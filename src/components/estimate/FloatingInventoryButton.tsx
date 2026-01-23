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
  return (
    <button
      onClick={onScrollToInventory}
      className={cn(
        "fixed right-6 top-32 z-50",
        "flex items-center gap-2 px-4 py-2",
        "bg-card border border-primary/30 rounded-full",
        "shadow-md hover:shadow-lg",
        "transition-all duration-300",
        "hover:border-primary/60 hover:scale-105",
        "group"
      )}
      title="Click to view your full inventory list"
    >
      <Package className="w-4 h-4 text-primary" />
      <span className="text-sm font-bold text-foreground tabular-nums">{itemCount}</span>
      <span className="text-xs text-muted-foreground">•</span>
      <span className="text-xs text-muted-foreground tabular-nums">{totalWeight.toLocaleString()} lbs</span>
      <span className="text-xs text-muted-foreground">•</span>
      <span className="text-xs text-muted-foreground tabular-nums">{totalCubicFeet} cu ft</span>
      <span className="text-xs text-muted-foreground mx-1">|</span>
      <span className="text-xs font-medium text-primary group-hover:underline">View List</span>
      <ArrowDown className="w-3.5 h-3.5 text-primary group-hover:translate-y-0.5 transition-transform" />
    </button>
  );
}
