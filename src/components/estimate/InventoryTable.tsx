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
    <div className="space-y-4">
      <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">
        Your move inventory
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border/60 bg-card">
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
                  <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
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

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border/60 bg-card">
          <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-1">Total items</div>
          <div className="text-2xl font-black text-foreground">{items.length}</div>
        </div>
        <div className="p-4 rounded-xl border border-border/60 bg-card">
          <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-1">Estimated total weight</div>
          <div className="text-2xl font-black text-foreground">{totalWeight.toLocaleString()} lbs</div>
        </div>
        <div className="p-4 rounded-xl border border-border/60 bg-card">
          <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-1">Estimated move size</div>
          <div className="text-lg font-bold text-foreground">{moveSize}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
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
