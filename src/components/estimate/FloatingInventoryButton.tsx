import { Package, ArrowDown, ArrowUp } from "lucide-react";
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
        "fixed right-6 top-32 z-50",
        "flex items-center gap-3 px-5 py-2.5",
        "bg-card border-2 border-primary/30 rounded-full",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        "hover:border-primary/60 hover:scale-105"
      )}
    >
      <Package className="w-5 h-5 text-primary" />
      <span className="text-base font-bold text-foreground tabular-nums">{totalCubicFeet} cu ft</span>
      <span className="text-sm font-medium text-muted-foreground">
        {isAtInventory ? "Keep Building" : "View Inventory"}
      </span>
      {isAtInventory ? (
        <ArrowUp className="w-4 h-4 text-primary" />
      ) : (
        <ArrowDown className="w-4 h-4 text-primary" />
      )}
    </button>
  );
}
