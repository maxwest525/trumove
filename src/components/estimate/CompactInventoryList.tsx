import { X } from "lucide-react";
import { type InventoryItem, calculateTotalWeight } from "@/lib/priceCalculator";

interface CompactInventoryListProps {
  items: InventoryItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function CompactInventoryList({ 
  items, 
  onRemoveItem 
}: CompactInventoryListProps) {
  const totalWeight = calculateTotalWeight(items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-3">
        Your Inventory
      </div>
      
      {/* Scrollable list */}
      <div className="max-h-48 overflow-y-auto space-y-1">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0"
          >
            <span className="text-sm font-medium text-foreground truncate max-w-[180px]">
              {item.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground tabular-nums">
                ×{item.quantity}
              </span>
              <button 
                onClick={() => onRemoveItem(item.id)} 
                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Remove ${item.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer totals */}
      <div className="pt-3 mt-3 border-t border-border/40 flex justify-between text-sm">
        <span className="text-muted-foreground">{totalItems} items</span>
        <span className="font-bold text-foreground tabular-nums">
          {totalWeight.toLocaleString()} lbs
        </span>
      </div>
    </div>
  );
}
