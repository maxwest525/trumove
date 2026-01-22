import { useState } from "react";
import { Package, ArrowDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { type InventoryItem } from "@/lib/priceCalculator";

interface FloatingInventoryButtonProps {
  totalCubicFeet: number;
  onScrollToInventory: () => void;
  recentItems: InventoryItem[];
  isLocked: boolean;
}

export default function FloatingInventoryButton({ 
  totalCubicFeet, 
  onScrollToInventory,
  recentItems,
  isLocked
}: FloatingInventoryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const lastItems = recentItems.slice(-4).reverse();
  const hasItems = lastItems.length > 0;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end"
    >
      {/* Expandable Preview Panel - Only shows when unlocked and has items */}
      {!isLocked && hasItems && (
        <div 
          className={cn(
            "mb-2 overflow-hidden rounded-xl bg-card border border-border/60 shadow-xl",
            "transition-all duration-300 ease-out origin-bottom",
            isHovered
              ? "opacity-100 translate-y-0 scale-100 max-h-[200px]"
              : "opacity-0 translate-y-4 scale-95 max-h-0"
          )}
        >
          <div className="p-3 min-w-[200px]">
            <div className="text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-2">
              Recent Items
            </div>
            <div className="space-y-1.5">
              {lastItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 py-1">
                  <div className="w-5 h-5 rounded overflow-hidden bg-muted/50 flex-shrink-0">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt="" 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <Package className="w-3 h-3 m-1 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium flex-1 truncate max-w-[120px]">
                    {item.name}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    ×{item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Pill Button */}
      <button
        onClick={isLocked ? undefined : onScrollToInventory}
        disabled={isLocked}
        className={cn(
          "flex items-center gap-2 px-4 py-3",
          "rounded-full shadow-lg",
          "transition-all duration-200",
          isLocked
            ? "bg-muted/80 text-muted-foreground cursor-not-allowed shadow-muted/20"
            : "bg-primary text-primary-foreground shadow-primary/25 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
        )}
      >
        {isLocked ? (
          <>
            <Lock className="w-4 h-4" />
            <span className="font-semibold text-sm">Complete form to unlock</span>
          </>
        ) : (
          <>
            <Package className="w-5 h-5" />
            <span className="font-bold tabular-nums">{totalCubicFeet} cu ft</span>
            <ArrowDown className={cn("w-4 h-4", !isHovered && "animate-bounce")} />
          </>
        )}
      </button>
    </div>
  );
}
