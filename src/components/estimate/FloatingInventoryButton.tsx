import { Package, ArrowDown, Hammer } from "lucide-react";
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
        "fixed bottom-6 right-6 z-50",
        "flex items-center gap-2 px-4 py-3",
        "bg-tm-ink text-white rounded-full",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        "hover:scale-105",
        "tru-qb-glow"
      )}
    >
      {isAtInventory ? (
        <Hammer className="w-5 h-5" />
      ) : (
        <Package className="w-5 h-5" />
      )}
      <span className="font-bold tabular-nums">{totalCubicFeet} cu ft</span>
      <span className="text-sm opacity-90">
        {isAtInventory ? "Keep Building" : "View Inventory"}
      </span>
      <ArrowDown className={cn(
        "w-4 h-4 transition-transform",
        isAtInventory && "rotate-180"
      )} />
    </button>
  );
}
