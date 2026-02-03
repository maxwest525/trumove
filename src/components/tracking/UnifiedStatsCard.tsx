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
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded flex items-center justify-center bg-primary/20">
            <Zap className="w-2.5 h-2.5 text-primary" />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
            Live Stats
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
          onClick={onRefresh}
          disabled={isLoading || isEmpty}
        >
          <RefreshCw className={cn("w-2.5 h-2.5", isLoading && "animate-spin")} />
        </Button>
      </div>

      {/* Primary Stats Row - ETA, Time, Distance */}
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        <div className="bg-primary/10 rounded-md p-2 border border-primary/20">
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5 font-medium">ETA</div>
          {isEmpty ? (
            <Skeleton className="h-4 w-10 bg-primary/10" />
          ) : (
            <div className="text-sm font-bold text-primary leading-tight">
              {adjustedETA || '--:--'}
            </div>
          )}
        </div>
        
        <div className="bg-muted/50 rounded-md p-2 border border-border">
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5 font-medium">Time</div>
          {isEmpty ? (
            <Skeleton className="h-4 w-10" />
          ) : (
            <div className="text-sm font-bold text-foreground leading-tight">
              {adjustedDuration || timeRemaining}
            </div>
          )}
        </div>
        
        <div className="bg-muted/50 rounded-md p-2 border border-border">
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5 font-medium">Miles</div>
          {isEmpty ? (
            <Skeleton className="h-4 w-10" />
          ) : (
            <div className="text-sm font-bold text-foreground leading-tight">
              {remainingDistance || Math.round(totalDistance - distanceTraveled)}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-medium">
          <span>{isEmpty ? '0%' : `${Math.round(progress)}%`}</span>
          <span>{isEmpty ? '0/0' : `${Math.round(distanceTraveled)}/${Math.round(totalDistance)} mi`}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: isEmpty ? '0%' : `${progress}%` }}
          />
        </div>
      </div>

      {/* Traffic, Tolls, Fuel Row */}
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {/* Traffic */}
        <div className={cn(
          "rounded-md p-2 border",
          isEmpty ? "bg-muted/30 border-border" : 
          trafficSeverity === 'high' ? "bg-destructive/10 border-destructive/20" :
          trafficSeverity === 'medium' ? "bg-amber-500/10 border-amber-500/20" :
          "bg-emerald-500/10 border-emerald-500/20"
        )}>
          <div className="flex items-center gap-1 mb-0.5">
            <AlertTriangle className={cn(
              "w-3 h-3",
              isEmpty ? "text-muted-foreground" :
              trafficSeverity === 'high' ? "text-destructive" :
              trafficSeverity === 'medium' ? "text-amber-500" :
              "text-emerald-500"
            )} />
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Traffic</span>
          </div>
          {isEmpty ? (
            <Skeleton className="h-3 w-8" />
          ) : (
            <>
              <div className={cn(
                "text-xs font-bold",
                trafficSeverity === 'high' ? "text-destructive" :
                trafficSeverity === 'medium' ? "text-amber-500" :
                "text-emerald-500"
              )}>
                {severity.label}
              </div>
              {trafficDelay > 0 && (
                <div className="text-[9px] text-muted-foreground mt-0.5">+{trafficDelay}m</div>
              )}
            </>
          )}
        </div>

        {/* Tolls */}
        <div className={cn(
          "rounded-md p-2 border",
          isEmpty ? "bg-muted/30 border-border" : 
          !tollInfo?.hasTolls ? "bg-emerald-500/10 border-emerald-500/20" : "bg-muted/50 border-border"
        )}>
          <div className="flex items-center gap-1 mb-0.5">
            <DollarSign className={cn(
              "w-3 h-3",
              isEmpty ? "text-muted-foreground" : 
              !tollInfo?.hasTolls ? "text-emerald-500" : "text-muted-foreground"
            )} />
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Tolls</span>
          </div>
          {isEmpty ? (
            <Skeleton className="h-3 w-6" />
          ) : (
            <div className={cn(
              "text-xs font-bold",
              !tollInfo?.hasTolls ? "text-emerald-500" : "text-foreground"
            )}>
              {tollInfo?.hasTolls ? (tollInfo.estimatedPrice || '~$10') : 'Free'}
            </div>
          )}
        </div>

        {/* Fuel Cost */}
        <div className={cn(
          "rounded-md p-2 border",
          isEmpty ? "bg-muted/30 border-border" : 
          isFuelEfficient ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"
        )}>
          <div className="flex items-center gap-1 mb-0.5">
            <Fuel className={cn(
              "w-3 h-3",
              isEmpty ? "text-muted-foreground" : 
              isFuelEfficient ? "text-emerald-500" : "text-amber-500"
            )} />
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Fuel</span>
          </div>
          {isEmpty ? (
            <Skeleton className="h-3 w-8" />
          ) : (
            <div className={cn(
              "text-xs font-bold",
              isFuelEfficient ? "text-emerald-500" : "text-amber-500"
            )}>
              {fuelCostEstimate ? `$${fuelCostEstimate.toFixed(0)}` : '--'}
            </div>
          )}
        </div>
      </div>

      {/* Traffic Trend & Last Update */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        {isEmpty ? (
          <span className="text-[10px] text-muted-foreground">Awaiting route...</span>
        ) : (
          <>
            {trend && (
              <div className="flex items-center gap-1">
                <span className={trend.color}>{trend.icon}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{trend.label}</span>
              </div>
            )}
            {lastUpdate && (
              <span className="text-[10px] text-muted-foreground">
                {formatTimeAgo(lastUpdate)}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
