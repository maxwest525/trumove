import { useState } from "react";
import { Clock, DollarSign, Route, Check, ChevronDown, ChevronUp, Zap, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RouteOption {
  index: number;
  description: string;
  distanceMiles: number;
  durationMinutes: number;
  durationFormatted: string;
  etaFormatted: string;
  trafficDelayMinutes: number;
  trafficSeverity: 'low' | 'medium' | 'high';
  hasTolls: boolean;
  tollCost: string | null;
  isFuelEfficient: boolean;
}

interface RouteComparisonPanelProps {
  routes: RouteOption[];
  selectedIndex: number;
  onSelectRoute: (index: number) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function RouteComparisonPanel({
  routes,
  selectedIndex,
  onSelectRoute,
  isExpanded = true,
  onToggleExpand
}: RouteComparisonPanelProps) {
  // Don't render if no routes or only one route
  if (!routes || routes.length <= 1) return null;
  
  // Determine which route is best in each category
  const fastestIndex = routes.reduce((min, r, i) => 
    r.durationMinutes < routes[min].durationMinutes ? i : min, 0);
  const shortestIndex = routes.reduce((min, r, i) => 
    r.distanceMiles < routes[min].distanceMiles ? i : min, 0);
  const cheapestIndex = routes.findIndex(r => !r.hasTolls);
  
  return (
    <div className="tracking-info-card">
      {/* Header with toggle */}
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-primary/10 text-primary">
            <Route className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60">
            Route Options ({routes.length})
          </span>
        </div>
        {onToggleExpand && (
          isExpanded 
            ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> 
            : <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="space-y-3">
          {routes.map((route, i) => {
            const isFastest = i === fastestIndex;
            const isShortest = i === shortestIndex;
            const isCheapest = cheapestIndex === i && !route.hasTolls;
            const isSelected = i === selectedIndex;
            
            return (
              <button
                key={route.index}
                onClick={() => onSelectRoute(route.index)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-200",
                  isSelected
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-muted/30 border-border hover:bg-muted/50 hover:border-primary/30"
                )}
              >
                {/* Route header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {route.description || `Route ${i + 1}`}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                    </div>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {isFastest && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold rounded-full uppercase">
                          <Zap className="w-2.5 h-2.5" />
                          Fastest
                        </span>
                      )}
                      {isShortest && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[9px] font-bold rounded-full uppercase">
                          Shortest
                        </span>
                      )}
                      {isCheapest && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[9px] font-bold rounded-full uppercase">
                          <DollarSign className="w-2.5 h-2.5" />
                          No Tolls
                        </span>
                      )}
                      {route.isFuelEfficient && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[9px] font-bold rounded-full uppercase">
                          <Leaf className="w-2.5 h-2.5" />
                          Eco
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* ETA */}
                  <div className="text-right flex-shrink-0 ml-3">
                    <div className="text-lg font-bold text-primary">{route.etaFormatted}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">ETA</div>
                  </div>
                </div>
                
                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-3 pt-3 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-xs font-semibold text-foreground">{route.distanceMiles} mi</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-foreground">{route.durationFormatted}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className={cn(
                      "text-xs font-semibold",
                      route.trafficDelayMinutes > 15 ? "text-red-500" 
                        : route.trafficDelayMinutes > 5 ? "text-amber-500" 
                        : "text-emerald-500"
                    )}>
                      {route.trafficDelayMinutes > 0 ? `+${route.trafficDelayMinutes}m` : 'Clear'}
                    </div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">Traffic</div>
                  </div>
                  <div className="text-center">
                    <div className={cn(
                      "text-xs font-semibold",
                      route.hasTolls ? "text-foreground" : "text-emerald-500"
                    )}>
                      {route.hasTolls ? (route.tollCost || '$5-15') : 'Free'}
                    </div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">Tolls</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
