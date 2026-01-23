import { useState, useEffect, useRef } from "react";
import { Package, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingInventoryButtonProps {
  itemCount: number;
  totalWeight: number;
  totalCubicFeet: number;
  onScrollToInventory: () => void;
}

export default function FloatingInventoryButton({ 
  itemCount,
  totalWeight,
  totalCubicFeet,
  onScrollToInventory
}: FloatingInventoryButtonProps) {
  const [isPulsing, setIsPulsing] = useState(false);
  const prevCountRef = useRef(itemCount);

  // Trigger pulse animation when item count increases
  useEffect(() => {
    if (itemCount > prevCountRef.current) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 600);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = itemCount;
  }, [itemCount]);

  return (
    <button
      onClick={onScrollToInventory}
      className={cn(
        "sticky top-4 z-40 ml-4 mb-4",
        "flex items-center gap-2 px-4 py-2",
        "bg-card border border-border/60 rounded-full",
        "shadow-md hover:shadow-lg",
        "transition-all duration-300",
        "hover:border-primary/40 hover:scale-105",
        "group",
        isPulsing && "animate-pulse ring-2 ring-primary/50"
      )}
      title="Click to view your full inventory list"
    >
      <Package className={cn(
        "w-4 h-4 text-muted-foreground transition-colors",
        isPulsing && "text-primary"
      )} />
      <span className="text-sm font-bold text-foreground tabular-nums">{itemCount}</span>
      <span className="text-xs text-muted-foreground">•</span>
      <span className="text-xs text-muted-foreground tabular-nums">{totalWeight.toLocaleString()} lbs</span>
      <span className="text-xs text-muted-foreground">•</span>
      <span className="text-xs text-muted-foreground tabular-nums">{totalCubicFeet} cu ft</span>
      <span className="text-xs text-muted-foreground mx-1">|</span>
      <span className="text-xs font-medium text-foreground group-hover:underline">View Inventory</span>
      <ArrowDown className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-y-0.5 transition-transform" />
    </button>
  );
}
