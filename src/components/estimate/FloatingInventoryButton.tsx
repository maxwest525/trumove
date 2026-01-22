import { Package, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingInventoryButtonProps {
  totalCubicFeet: number;
  onScrollToInventory: () => void;
  isAtInventory: boolean;
}

export default function FloatingInventoryButton({ 
  totalCubicFeet, 
  onScrollToInventory,
  isAtInventory 
}: FloatingInventoryButtonProps) {
  return (
    <button
      onClick={onScrollToInventory}
      className={cn(
        "fixed top-24 right-6 z-40",
        "flex items-center gap-2 px-3 py-2",
        "bg-card border border-border/60 rounded-full",
        "shadow-md hover:shadow-lg",
        "transition-all duration-300",
        "hover:border-primary/40"
      )}
    >
      <Package className="w-4 h-4 text-primary" />
      <span className="text-sm font-semibold text-foreground tabular-nums">{totalCubicFeet} cu ft</span>
      <span className="text-xs text-muted-foreground">
        {isAtInventory ? "Keep Building" : "View Inventory"}
      </span>
      <ChevronDown className={cn(
        "w-3 h-3 text-muted-foreground transition-transform",
        isAtInventory && "rotate-180"
      )} />
    </button>
  );
}
