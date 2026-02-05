import { useState } from "react";
import { Check, Circle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CoachingChecklistItem } from "./types";

interface CoachingChecklistProps {
  items: CoachingChecklistItem[];
  onItemComplete?: (itemId: string) => void;
  compact?: boolean;
}

export function CoachingChecklist({ items, onItemComplete, compact = false }: CoachingChecklistProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const handleToggle = (item: CoachingChecklistItem) => {
    setCompletedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item.id)) {
        newSet.delete(item.id);
      } else {
        newSet.add(item.id);
      }
      return newSet;
    });
    onItemComplete?.(item.id);
  };

  const categories = ['opening', 'discovery', 'presentation', 'closing'] as const;
  const categoryLabels = {
    opening: 'Opening',
    discovery: 'Discovery',
    presentation: 'Presentation',
    closing: 'Closing'
  };

  const groupedItems = categories.map(cat => ({
    category: cat,
    label: categoryLabels[cat],
    items: items.filter(item => item.category === cat)
  }));

  const totalRequired = items.filter(i => i.isRequired).length;
  const completedRequired = items.filter(i => i.isRequired && completedIds.has(i.id)).length;
  const progress = totalRequired > 0 ? (completedRequired / totalRequired) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Call Progress</span>
          <span className={cn(
            "font-medium",
            progress === 100 ? "text-green-600" : "text-foreground"
          )}>
            {completedRequired}/{totalRequired} Required
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500 rounded-full",
              progress === 100 ? "bg-green-500" : "bg-primary"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist by category */}
      <div className="space-y-2">
        {groupedItems.map(group => (
          <div key={group.category} className="space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
              {group.label}
            </div>
            <div className={cn("space-y-0.5", compact && "space-y-0")}>
              {group.items.map(item => {
                const isCompleted = completedIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggle(item)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all",
                      "hover:bg-accent/50",
                      isCompleted && "bg-green-500/10"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                      isCompleted 
                        ? "bg-green-500 text-white" 
                        : item.isRequired 
                          ? "border-2 border-orange-400" 
                          : "border border-muted-foreground/40"
                    )}>
                      {isCompleted && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span className={cn(
                      "text-xs flex-1",
                      isCompleted && "line-through text-muted-foreground"
                    )}>
                      {item.label}
                    </span>
                    {item.isRequired && !isCompleted && (
                      <span className="text-[9px] text-orange-500 font-medium">REQ</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
