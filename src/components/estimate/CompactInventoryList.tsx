import { X, Minus, Plus } from "lucide-react";
import { type InventoryItem, calculateTotalWeight } from "@/lib/priceCalculator";

interface CompactInventoryListProps {
  items: InventoryItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function CompactInventoryList({ 
  items, 
  onUpdateQuantity,
  onRemoveItem 
}: CompactInventoryListProps) {
  const totalWeight = calculateTotalWeight(items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return null;
  }

  // Abbreviate room names for compact display
  const abbreviateRoom = (room: string) => {
    const abbrevMap: Record<string, string> = {
      'living-room': 'Living',
      'bedroom': 'Bedroom',
      'dining-room': 'Dining',
      'kitchen': 'Kitchen',
      'office': 'Office',
      'nursery': 'Nursery',
      'garage': 'Garage',
      'patio': 'Patio',
      'appliances': 'Applnc',
      'exercise': 'Exercise',
      'boxes': 'Boxes',
      'electronics': 'Electr',
      'misc': 'Misc',
    };
    return abbrevMap[room] || room;
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/40 bg-muted/30">
        <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">
          Your Inventory
        </div>
      </div>
      
      {/* Table Header */}
      <div className="grid grid-cols-[1fr_70px_50px_60px_70px_32px] gap-1 px-3 py-2 bg-muted/20 border-b border-border/30 text-[10px] font-bold tracking-wide uppercase text-muted-foreground">
        <span>Item</span>
        <span className="text-center">Room</span>
        <span className="text-center">Qty</span>
        <span className="text-right">Wt Ea</span>
        <span className="text-right">Total</span>
        <span></span>
      </div>
      
      {/* Scrollable Table Body */}
      <div className="max-h-[300px] overflow-y-auto">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="grid grid-cols-[1fr_70px_50px_60px_70px_32px] gap-1 px-3 py-2 border-b border-border/20 last:border-0 items-center hover:bg-muted/10 transition-colors"
          >
            {/* Item Name */}
            <span className="text-sm font-medium text-foreground truncate" title={item.name}>
              {item.name}
            </span>
            
            {/* Room */}
            <span className="text-xs text-muted-foreground text-center truncate" title={item.room}>
              {abbreviateRoom(item.room)}
            </span>
            
            {/* Quantity with +/- controls */}
            <div className="flex items-center justify-center gap-0.5">
              <button 
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} 
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-semibold text-foreground tabular-nums w-4 text-center">
                {item.quantity}
              </span>
              <button 
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} 
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            
            {/* Weight Each */}
            <span className="text-xs text-muted-foreground text-right tabular-nums">
              {item.weightEach} lbs
            </span>
            
            {/* Total Weight */}
            <span className="text-xs font-semibold text-foreground text-right tabular-nums">
              {(item.quantity * item.weightEach).toLocaleString()}
            </span>
            
            {/* Remove Button */}
            <button 
              onClick={() => onRemoveItem(item.id)} 
              className="p-1 text-muted-foreground hover:text-destructive transition-colors justify-self-center"
              aria-label={`Remove ${item.name}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Footer Totals */}
      <div className="grid grid-cols-[1fr_70px_50px_60px_70px_32px] gap-1 px-3 py-3 border-t border-border/40 bg-muted/30 text-sm">
        <span className="font-bold text-foreground">{items.length} unique</span>
        <span></span>
        <span className="text-center font-semibold text-foreground tabular-nums">{totalItems}</span>
        <span></span>
        <span className="text-right font-bold text-foreground tabular-nums">{totalWeight.toLocaleString()}</span>
        <span className="text-xs text-muted-foreground">lbs</span>
      </div>
    </div>
  );
}
