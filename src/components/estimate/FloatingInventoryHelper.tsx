import { useMemo } from "react";
import { Package, ArrowDown, Scale, Box } from "lucide-react";
import { type InventoryItem, calculateTotalWeight, calculateTotalCubicFeet } from "@/lib/priceCalculator";
import { cn } from "@/lib/utils";

interface FloatingInventoryHelperProps {
  items: InventoryItem[];
  onScrollToBottom: () => void;
  className?: string;
}

export default function FloatingInventoryHelper({ 
  items, 
  onScrollToBottom,
  className 
}: FloatingInventoryHelperProps) {
  const totalItems = useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0), 
    [items]
  );
  const totalWeight = useMemo(() => calculateTotalWeight(items), [items]);
  const totalCubicFeet = useMemo(() => calculateTotalCubicFeet(items), [items]);

  if (items.length === 0) return null;

  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 -translate-x-1/2 z-40",
      "bg-card/95 backdrop-blur-md border border-border/60 rounded-full shadow-xl",
      "flex items-center gap-1 px-2 py-2",
      "animate-in slide-in-from-bottom-4 duration-300",
      className
    )}>
      {/* Stats Pills */}
      <div className="flex items-center gap-1">
        {/* Total Items */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10">
          <Package className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-foreground">{totalItems}</span>
          <span className="text-xs text-muted-foreground">items</span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border/60" />

        {/* Total Weight */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50">
          <Scale className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">{totalWeight.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">lbs</span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border/60" />

        {/* Total Cu Ft */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50">
          <Box className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">{totalCubicFeet}</span>
          <span className="text-xs text-muted-foreground">cu ft</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-border/60 mx-1" />

      {/* Scroll to Bottom Button */}
      <button
        onClick={onScrollToBottom}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
        aria-label="Scroll to inventory table"
      >
        <ArrowDown className="w-4 h-4" />
        <span className="text-sm font-semibold">View All</span>
      </button>
    </div>
  );
}
