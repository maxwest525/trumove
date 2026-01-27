import { useState } from "react";
import { Check, ArrowRight, Circle, MapPin, Truck, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface MultiStopInfo {
  type: 'pickup' | 'dropoff';
  address: string;
  coords: [number, number]; // [lng, lat]
  status: 'completed' | 'current' | 'upcoming';
  eta?: string;
  completedAt?: string;
}

interface MultiStopSummaryCardProps {
  stops: MultiStopInfo[];
  currentStopIndex: number;
  totalDistance: number;
  remainingDuration: string;
  className?: string;
}

export function MultiStopSummaryCard({
  stops,
  currentStopIndex,
  totalDistance,
  remainingDuration,
  className,
}: MultiStopSummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const completedCount = stops.filter(s => s.status === 'completed').length;
  const totalCount = stops.length;

  // Get abbreviated address (first part before comma)
  const getShortAddress = (address: string) => {
    const parts = address.split(',');
    return parts[0] || address;
  };

  return (
    <div className={cn(
      "tracking-info-card",
      className
    )}>
      {/* Header */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
                Multi-Stop Route
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40">
                {completedCount}/{totalCount} stops
              </span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-white/40" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-white/40" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        {/* Progress dots */}
        <div className="flex items-center gap-1 mb-4">
          {stops.map((stop, index) => (
            <div key={index} className="flex items-center">
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all",
                  stop.status === 'completed' && "bg-primary",
                  stop.status === 'current' && "bg-primary animate-pulse ring-2 ring-primary/30",
                  stop.status === 'upcoming' && "bg-white/20"
                )}
              />
              {index < stops.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-4",
                    index < currentStopIndex ? "bg-primary" : "bg-white/10"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <CollapsibleContent>
          {/* Stop list */}
          <div className="space-y-2">
            {stops.map((stop, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2 p-2 rounded-lg transition-all",
                  stop.status === 'current' && "bg-primary/10 border border-primary/20",
                  stop.status === 'completed' && "opacity-60",
                  stop.status === 'upcoming' && "opacity-80"
                )}
              >
                {/* Status icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {stop.status === 'completed' ? (
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                  ) : stop.status === 'current' ? (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                      <Circle className="w-2.5 h-2.5 text-white/40" />
                    </div>
                  )}
                </div>

                {/* Stop details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-medium text-white/50">
                      {index + 1}.
                    </span>
                    {stop.type === 'pickup' ? (
                      <MapPin className="w-3 h-3 text-green-400" />
                    ) : (
                      <MapPin className="w-3 h-3 text-red-400" />
                    )}
                    <span className="text-[10px] uppercase tracking-wider text-white/40">
                      {stop.type}
                    </span>
                  </div>
                  <p className="text-xs text-white truncate">
                    {getShortAddress(stop.address)}
                  </p>
                </div>

                {/* Time/ETA */}
                <div className="flex-shrink-0 text-right">
                  {stop.status === 'completed' && stop.completedAt ? (
                    <div className="flex items-center gap-1 text-[10px] text-white/50">
                      <Check className="w-3 h-3" />
                      {stop.completedAt}
                    </div>
                  ) : stop.eta ? (
                    <div className="flex items-center gap-1 text-[10px] text-primary">
                      <Clock className="w-3 h-3" />
                      {stop.eta}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Footer summary */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-[11px]">
        <span className="text-white/50">
          Total: {totalDistance} mi
        </span>
        <span className="text-primary font-medium">
          {remainingDuration} remaining
        </span>
      </div>
    </div>
  );
}

export default MultiStopSummaryCard;
