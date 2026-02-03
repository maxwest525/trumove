import { useState, useEffect } from "react";
import { Clock, Route, DollarSign, Fuel, AlertTriangle, TrendingUp, TrendingDown, Minus, RefreshCw, ChevronDown, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";

interface TrafficData {
  delayMinutes: number;
  delayFormatted: string;
  hasDelay: boolean;
  severity: 'low' | 'medium' | 'high';
}

interface TollData {
  hasTolls: boolean;
  estimatedPrice: string | null;
}

interface AlternateRoute {
  index: number;
  description: string;
  distanceMiles: number;
  durationFormatted: string;
  traffic: TrafficData;
  tolls: TollData;
  isFuelEfficient: boolean;
  isTollFree: boolean;
}

interface UnifiedStatsCardProps {
  // Progress data
  progress: number;
  distanceTraveled: number;
  totalDistance: number;
  timeRemaining: string;
  
  // ETA data
  adjustedETA: string | null;
  adjustedDuration: string | null;
  remainingDistance: number;
  
  // Traffic data
  trafficSeverity: 'low' | 'medium' | 'high';
  trafficDelay: number;
  trafficTrend: 'improving' | 'worsening' | 'stable' | null;
  
  // Toll & fuel
  tollInfo: TollData | null;
  isFuelEfficient?: boolean;
  fuelCostEstimate?: number | null; // Estimated fuel cost in dollars
  
  // Alternates
  alternateRoutes?: AlternateRoute[];
  onRouteSelect?: (routeIndex: number) => void;
  
  // Refresh
  lastUpdate: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
  
  // Empty state
  isEmpty?: boolean;
}

export function UnifiedStatsCard({
  progress,
  distanceTraveled,
  totalDistance,
  timeRemaining,
  adjustedETA,
  adjustedDuration,
  remainingDistance,
  trafficSeverity,
  trafficDelay,
  trafficTrend,
  tollInfo,
  isFuelEfficient = false,
  fuelCostEstimate,
  lastUpdate,
  isLoading,
  onRefresh,
  isEmpty = false,
}: UnifiedStatsCardProps) {

  // Format time ago
  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 120) return '1m ago';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Traffic severity display
  const getSeverityDisplay = () => {
    switch (trafficSeverity) {
      case 'high':
        return { label: 'Heavy', color: 'text-red-500', bg: 'bg-red-500/20 border-red-500/30' };
      case 'medium':
        return { label: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500/20 border-yellow-500/30' };
      default:
        return { label: 'Light', color: 'text-emerald-500', bg: 'bg-emerald-500/20 border-emerald-500/30' };
    }
  };

  // Traffic trend display
  const getTrendDisplay = () => {
    switch (trafficTrend) {
      case 'improving':
        return { icon: <TrendingDown className="w-3 h-3" />, label: 'Improving', color: 'text-emerald-500' };
      case 'worsening':
        return { icon: <TrendingUp className="w-3 h-3" />, label: 'Worsening', color: 'text-red-500' };
      case 'stable':
        return { icon: <Minus className="w-3 h-3" />, label: 'Stable', color: 'text-muted-foreground' };
      default:
        return null;
    }
  };

  const severity = getSeverityDisplay();
  const trend = getTrendDisplay();

  return (
    <div className="tracking-info-card unified-stats-card">
      {/* Header with refresh */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center bg-primary/20 text-primary">
            <Zap className="w-3 h-3" />
          </div>
          <span className="text-xs font-bold tracking-wider uppercase text-foreground">
            Live Stats
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          onClick={onRefresh}
          disabled={isLoading || isEmpty}
        >
          <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
        </Button>
      </div>

      {/* Primary Stats Row - ETA, Time, Distance - Compact single row */}
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        <div className="bg-primary/15 rounded-lg p-2 border border-primary/25">
          <div className="text-[9px] uppercase tracking-wider text-primary/80 mb-0.5 font-semibold">ETA</div>
          {isEmpty ? (
            <Skeleton className="h-5 w-12 bg-primary/10" />
          ) : (
            <div className="text-base font-bold text-primary leading-tight">
              {adjustedETA || '--:--'}
            </div>
          )}
        </div>
        
        <div className="bg-muted/60 dark:bg-white/5 rounded-lg p-2 border border-border/60">
          <div className="text-[9px] uppercase tracking-wider text-foreground/60 mb-0.5 font-semibold">Time</div>
          {isEmpty ? (
            <Skeleton className="h-5 w-10" />
          ) : (
            <div className="text-base font-bold text-foreground leading-tight">
              {adjustedDuration || timeRemaining}
            </div>
          )}
        </div>
        
        <div className="bg-muted/60 dark:bg-white/5 rounded-lg p-2 border border-border/60">
          <div className="text-[9px] uppercase tracking-wider text-foreground/60 mb-0.5 font-semibold">Miles</div>
          {isEmpty ? (
            <Skeleton className="h-5 w-12" />
          ) : (
            <div className="text-base font-bold text-foreground leading-tight">
              {remainingDistance || Math.round(totalDistance - distanceTraveled)}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar - Compact */}
      <div className="mb-2">
        <div className="flex justify-between text-[10px] text-foreground/70 mb-1 font-medium">
          <span>{isEmpty ? '0%' : `${Math.round(progress)}%`}</span>
          <span>{isEmpty ? '0/0 mi' : `${Math.round(distanceTraveled)}/${Math.round(totalDistance)} mi`}</span>
        </div>
        <div className="tracking-progress-bar h-1.5">
          <div 
            className="tracking-progress-fill"
            style={{ width: isEmpty ? '0%' : `${progress}%` }}
          />
        </div>
      </div>

      {/* Traffic, Tolls, Fuel Row - Compact */}
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {/* Traffic */}
        <div className={cn("rounded-lg p-2 border", isEmpty ? "bg-muted/30 border-border/50" : severity.bg)}>
          <div className="flex items-center gap-1 mb-0.5">
            <AlertTriangle className={cn("w-3 h-3", isEmpty ? "text-muted-foreground" : severity.color)} />
            <span className="text-[9px] uppercase tracking-wider text-foreground/60 font-semibold">Traffic</span>
          </div>
          {isEmpty ? (
            <Skeleton className="h-4 w-10" />
          ) : (
            <>
              <div className={cn("text-sm font-bold leading-tight", severity.color)}>
                {severity.label}
              </div>
              {trafficDelay > 0 && (
                <div className="text-[9px] text-foreground/60">+{trafficDelay}m</div>
              )}
            </>
          )}
        </div>

        {/* Tolls */}
        <div className={cn(
          "rounded-lg p-2 border",
          isEmpty ? "bg-muted/30 border-border/50" : (tollInfo?.hasTolls ? "bg-muted/50 dark:bg-white/5 border-border/60" : "bg-emerald-500/10 border-emerald-500/25")
        )}>
          <div className="flex items-center gap-1 mb-0.5">
            <DollarSign className={cn("w-3 h-3", isEmpty ? "text-muted-foreground" : (tollInfo?.hasTolls ? "text-foreground/60" : "text-emerald-500"))} />
            <span className="text-[9px] uppercase tracking-wider text-foreground/60 font-semibold">Tolls</span>
          </div>
          {isEmpty ? (
            <Skeleton className="h-4 w-8" />
          ) : (
            <div className={cn("text-sm font-bold leading-tight", tollInfo?.hasTolls ? "text-foreground" : "text-emerald-500")}>
              {tollInfo?.hasTolls ? (tollInfo.estimatedPrice || '~$10') : 'Free'}
            </div>
          )}
        </div>

        {/* Fuel Cost */}
        <div className={cn(
          "rounded-lg p-2 border",
          isEmpty ? "bg-muted/30 border-border/50" : (isFuelEfficient ? "bg-emerald-500/10 border-emerald-500/25" : "bg-amber-500/10 border-amber-500/25")
        )}>
          <div className="flex items-center gap-1 mb-0.5">
            <Fuel className={cn("w-3 h-3", isEmpty ? "text-muted-foreground" : (isFuelEfficient ? "text-emerald-500" : "text-amber-500"))} />
            <span className="text-[9px] uppercase tracking-wider text-foreground/60 font-semibold">Fuel</span>
          </div>
          {isEmpty ? (
            <Skeleton className="h-4 w-8" />
          ) : (
            <>
              <div className={cn("text-sm font-bold leading-tight", isFuelEfficient ? "text-emerald-500" : "text-amber-500")}>
                {fuelCostEstimate ? `$${fuelCostEstimate.toFixed(0)}` : '--'}
              </div>
              {isFuelEfficient && (
                <div className="text-[8px] text-emerald-500/80">Eco</div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Traffic Trend & Last Update - Compact footer */}
      <div className="flex items-center justify-between pt-1.5 border-t border-border/50">
        {isEmpty ? (
          <span className="text-[10px] text-muted-foreground">Awaiting route...</span>
        ) : (
          <>
            {trend && (
              <div className="flex items-center gap-1">
                <span className={trend.color}>{trend.icon}</span>
                <span className="text-[10px] text-foreground/70 font-medium">{trend.label}</span>
              </div>
            )}
            {lastUpdate && (
              <span className="text-[10px] text-foreground/60">
                {formatTimeAgo(lastUpdate)}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
