import { Trash2, Printer, Download } from "lucide-react";
import { type InventoryItem, calculateTotalWeight, getMoveSize } from "@/lib/priceCalculator";

interface InventoryTableProps {
  items: InventoryItem[];
  onUpdateItem: (id: string, updates: Partial<InventoryItem>) => void;
  onRemoveItem: (id: string) => void;
  onClear: () => void;
}

export default function InventoryTable({ items, onUpdateItem, onRemoveItem, onClear }: InventoryTableProps) {
  const totalWeight = calculateTotalWeight(items);
  const moveSize = getMoveSize(totalWeight);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = items.map(item => 
      `${item.name},${item.room},${item.quantity},${item.weightEach},${item.quantity * item.weightEach}`
    ).join('\n');
    const header = 'Item,Room,Qty,Weight Each (lbs),Total Weight (lbs)\n';
    const blob = new Blob([header + content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trumove-inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
      {/* Header - Enlarged and Centered */}
      <div className="tru-summary-header-large border-b border-border/40">
        <div className="text-center flex-1">
          <h3 className="text-lg font-black text-foreground">
            Your Move <span className="tru-qb-title-accent">Inventory</span>
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{items.length} items added</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-muted/30">
              <th className="text-left px-4 py-3 font-bold text-xs tracking-wide uppercase text-muted-foreground">Item</th>
              <th className="text-left px-4 py-3 font-bold text-xs tracking-wide uppercase text-muted-foreground">Room</th>
              <th className="text-center px-4 py-3 font-bold text-xs tracking-wide uppercase text-muted-foreground">Qty</th>
              <th className="text-center px-4 py-3 font-bold text-xs tracking-wide uppercase text-muted-foreground">Weight each (lbs)</th>
              <th className="text-center px-4 py-3 font-bold text-xs tracking-wide uppercase text-muted-foreground">Total weight (lbs)</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No items yet. Start by adding a sofa, bed, or boxes.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Larger thumbnail */}
                      <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-muted/30 border border-border/30">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-contain p-0.5"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-base text-muted-foreground">📦</span>
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.room}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => onUpdateItem(item.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-16 h-8 text-center rounded-lg border border-border/40 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min={1}
                      value={item.weightEach}
                      onChange={(e) => onUpdateItem(item.id, { weightEach: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-20 h-8 text-center rounded-lg border border-border/40 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {item.quantity * item.weightEach}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border/40 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handlePrint}
          disabled={items.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card text-sm font-semibold text-foreground hover:bg-muted/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Printer className="w-4 h-4" />
          Print inventory
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={items.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card text-sm font-semibold text-foreground hover:bg-muted/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Download as PDF
        </button>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}