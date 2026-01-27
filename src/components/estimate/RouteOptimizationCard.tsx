import { TrendingDown, Clock, Route, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { type OptimizationResult, formatDuration, formatDistance } from "@/hooks/useRouteOptimization";
import { cn } from "@/lib/utils";

interface RouteOptimizationCardProps {
  result: OptimizationResult | null;
  isOptimizing: boolean;
  error: string | null;
  waypointLabels?: string[];
}

export default function RouteOptimizationCard({
  result,
  isOptimizing,
  error,
  waypointLabels = [],
}: RouteOptimizationCardProps) {
  if (isOptimizing) {
    return (
      <div className="rounded-xl border border-border/50 bg-card p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <div>
            <p className="text-sm font-medium text-foreground">Optimizing Route...</p>
            <p className="text-xs text-muted-foreground">Finding the most efficient path</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Optimization Failed</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
        <div className="flex items-center gap-3">
          <Route className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Route Optimization</p>
            <p className="text-xs text-muted-foreground">Add at least 2 locations to optimize</p>
          </div>
        </div>
      </div>
    );
  }

  const hasSavings = result.savings.distancePercent > 0 || result.savings.durationPercent > 0;

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-foreground">Route Optimized</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-background/80 p-2.5 text-center">
          <Route className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{formatDistance(result.totalDistance)}</p>
          <p className="text-[10px] text-muted-foreground uppercase">Total Distance</p>
        </div>
        <div className="rounded-lg bg-background/80 p-2.5 text-center">
          <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{formatDuration(result.totalDuration)}</p>
          <p className="text-[10px] text-muted-foreground uppercase">Est. Time</p>
        </div>
      </div>

      {/* Savings */}
      {hasSavings && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10">
          <TrendingDown className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary">
            Saved {result.savings.distancePercent > 0 && `${result.savings.distancePercent}% distance`}
            {result.savings.distancePercent > 0 && result.savings.durationPercent > 0 && ' • '}
            {result.savings.durationPercent > 0 && `${result.savings.durationPercent}% time`}
          </span>
        </div>
      )}

      {/* Optimized Order */}
      {waypointLabels.length > 0 && result.optimizedOrder.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-muted-foreground uppercase font-medium">Optimized Stop Order</p>
          <div className="flex flex-wrap gap-1">
            {result.optimizedOrder.map((originalIndex, newIndex) => (
              <div
                key={newIndex}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded text-xs",
                  "bg-background border border-border/50"
                )}
              >
                <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold">
                  {newIndex + 1}
                </span>
                <span className="text-foreground truncate max-w-[100px]">
                  {waypointLabels[originalIndex] || `Stop ${originalIndex + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leg Details - Compact */}
      {result.legs.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase font-medium">Route Legs</p>
          <div className="space-y-1">
            {result.legs.slice(0, 5).map((leg, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs py-1 border-b border-border/30 last:border-0"
              >
                <span className="text-muted-foreground">
                  Leg {index + 1}
                </span>
                <span className="text-foreground font-medium">
                  {formatDistance(leg.distance)} • {formatDuration(leg.duration)}
                </span>
              </div>
            ))}
            {result.legs.length > 5 && (
              <p className="text-[10px] text-muted-foreground text-center">
                +{result.legs.length - 5} more legs
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
