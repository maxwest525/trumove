import { Clock, TrendingUp, TrendingDown, Minus, RefreshCw, AlertTriangle, Zap, Route, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ETAUpdateEvent {
  timestamp: Date;
  previousETA: string | null;
  newETA: string;
  delayChange: number;
  reason: 'traffic_improved' | 'traffic_worsened' | 'initial' | 'refresh';
}

interface RealtimeETACardProps {
  adjustedETA: string | null;
  adjustedDuration: string | null;
  remainingDistance: number;
  trafficTrend: 'improving' | 'worsening' | 'stable' | null;
  trafficSeverity?: 'low' | 'medium' | 'high';
  trafficDelay?: number; // minutes
  etaHistory: ETAUpdateEvent[];
  lastUpdate: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function RealtimeETACard({
  adjustedETA,
  adjustedDuration,
  remainingDistance,
  trafficTrend,
  trafficSeverity = 'low',
  trafficDelay = 0,
  etaHistory,
  lastUpdate,
  isLoading,
  onRefresh,
}: RealtimeETACardProps) {
  // Format time ago
  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 120) return '1 min ago';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Get trend icon and color
  const getTrendDisplay = () => {
    switch (trafficTrend) {
      case 'improving':
        return {
          icon: <TrendingDown className="w-4 h-4" />,
          label: 'Traffic Improving',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/30',
        };
      case 'worsening':
        return {
          icon: <TrendingUp className="w-4 h-4" />,
          label: 'Traffic Worsening',
          color: 'text-red-400',
          bgColor: 'bg-red-500/10 border-red-500/30',
        };
      case 'stable':
        return {
          icon: <Minus className="w-4 h-4" />,
          label: 'Traffic Stable',
          color: 'text-white/60',
          bgColor: 'bg-white/5 border-white/10',
        };
      default:
        return null;
    }
  };

  const trend = getTrendDisplay();

  // Get severity display
  const getSeverityDisplay = () => {
    switch (trafficSeverity) {
      case 'high':
        return {
          label: 'Heavy Traffic',
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
        };
      case 'medium':
        return {
          label: 'Moderate Traffic',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
        };
      default:
        return {
          label: 'Light Traffic',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/20',
        };
    }
  };

  const severity = getSeverityDisplay();

  return (
    <div className="tracking-info-card">
      {/* Header with refresh */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-primary/20 text-primary">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
            Real-Time ETA
          </span>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-white/40 hover:text-white hover:bg-white/10"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black/90 border-white/20">
              <p className="text-xs">
                {lastUpdate ? `Last updated ${formatTimeAgo(lastUpdate)}` : 'Refresh ETA'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main ETA Display */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-4 mb-4 border border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-white/50">Arrival Time</span>
          {trafficDelay > 0 && (
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium",
              severity.bgColor,
              severity.color
            )}>
              +{trafficDelay}m delay
            </span>
          )}
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">
            {adjustedETA || '--:--'}
          </span>
          {adjustedDuration && (
            <span className="text-sm text-white/40">
              ({adjustedDuration} remaining)
            </span>
          )}
        </div>

        {/* Remaining distance */}
        <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
          <Route className="w-3 h-3" />
          <span>{remainingDistance} miles to destination</span>
        </div>
      </div>

      {/* Traffic Status */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {/* Current Traffic */}
        <div className={cn(
          "rounded-lg p-3 border",
          trafficSeverity === 'high' 
            ? "bg-red-500/10 border-red-500/20" 
            : trafficSeverity === 'medium'
              ? "bg-yellow-500/10 border-yellow-500/20"
              : "bg-emerald-500/10 border-emerald-500/20"
        )}>
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className={cn("w-3 h-3", severity.color)} />
            <span className="text-[10px] uppercase tracking-wider text-white/50">Traffic</span>
          </div>
          <div className={cn("text-sm font-semibold", severity.color)}>
            {severity.label}
          </div>
        </div>

        {/* Traffic Trend */}
        {trend && (
          <div className={cn("rounded-lg p-3 border", trend.bgColor)}>
            <div className="flex items-center gap-1.5 mb-1">
              {trend.icon}
              <span className="text-[10px] uppercase tracking-wider text-white/50">Trend</span>
            </div>
            <div className={cn("text-sm font-semibold", trend.color)}>
              {trend.label.split(' ')[1]}
            </div>
          </div>
        )}
      </div>

      {/* Update History */}
      {etaHistory.length > 1 && (
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <History className="w-3 h-3 text-white/40" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/40">
              Recent Updates
            </span>
          </div>
          
          <div className="space-y-1.5 max-h-24 overflow-y-auto">
            {etaHistory.slice(-3).reverse().map((event, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between text-[10px] py-1 px-2 rounded bg-white/5"
              >
                <div className="flex items-center gap-2">
                  {event.reason === 'traffic_improved' && (
                    <TrendingDown className="w-3 h-3 text-emerald-400" />
                  )}
                  {event.reason === 'traffic_worsened' && (
                    <TrendingUp className="w-3 h-3 text-red-400" />
                  )}
                  {(event.reason === 'initial' || event.reason === 'refresh') && (
                    <Clock className="w-3 h-3 text-white/40" />
                  )}
                  <span className="text-white/60">
                    {event.timestamp.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white">{event.newETA}</span>
                  {event.delayChange !== 0 && event.previousETA && (
                    <span className={cn(
                      "text-[9px]",
                      event.delayChange < 0 ? "text-emerald-400" : "text-red-400"
                    )}>
                      {event.delayChange > 0 ? '+' : ''}{event.delayChange}m
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How it works info */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <details className="group">
          <summary className="text-[10px] text-white/40 cursor-pointer hover:text-white/60 transition-colors flex items-center gap-1">
            <span>How real-time ETA works</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-2 text-[10px] text-white/40 space-y-1 pl-2 border-l border-white/10">
            <p>• ETA updates every 60 seconds using live traffic</p>
            <p>• Google Routes API provides real-time conditions</p>
            <p>• Trend analysis tracks if traffic is improving</p>
            <p>• Delay shown is additional time due to traffic</p>
          </div>
        </details>
      </div>
    </div>
  );
}
