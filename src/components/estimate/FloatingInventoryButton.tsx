import { Package, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingInventoryButtonProps {
  totalCubicFeet: number;
  onScrollToInventory: () => void;
}

export default function FloatingInventoryButton({ 
  totalCubicFeet, 
  onScrollToInventory 
}: FloatingInventoryButtonProps) {
  return (
    <button
      onClick={onScrollToInventory}
      className={cn(
        "fixed bottom-6 right-6 z-40",
        "flex items-center gap-2 px-4 py-3",
        "rounded-full bg-primary text-primary-foreground",
        "shadow-lg shadow-primary/25",
        "transition-all duration-200",
        "hover:scale-105 hover:shadow-xl hover:shadow-primary/30",
        "active:scale-95"
      )}
    >
      <Package className="w-5 h-5" />
      <span className="font-bold tabular-nums">{totalCubicFeet} cu ft</span>
      <ArrowDown className="w-4 h-4 animate-bounce" />
    </button>
  );
}
