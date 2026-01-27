import { useState, useEffect } from "react";
import { Clock, Route, DollarSign, Fuel, AlertTriangle, TrendingUp, TrendingDown, Minus, RefreshCw, ChevronDown, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  
  // Alternates
  alternateRoutes?: AlternateRoute[];
  onRouteSelect?: (routeIndex: number) => void;
  
  // Refresh
  lastUpdate: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
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
  alternateRoutes = [],
  onRouteSelect,
  lastUpdate,
  isLoading,
  onRefresh,
}: UnifiedStatsCardProps) {
  const [showAlternates, setShowAlternates] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(0);

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
        return { label: 'Heavy', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' };
      case 'medium':
        return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30' };
      default:
        return { label: 'Light', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30' };
    }
  };

  // Traffic trend display
  const getTrendDisplay = () => {
    switch (trafficTrend) {
      case 'improving':
        return { icon: <TrendingDown className="w-3 h-3" />, label: 'Improving', color: 'text-emerald-400' };
      case 'worsening':
        return { icon: <TrendingUp className="w-3 h-3" />, label: 'Worsening', color: 'text-red-400' };
      case 'stable':
        return { icon: <Minus className="w-3 h-3" />, label: 'Stable', color: 'text-white/60' };
      default:
        return null;
    }
  };

  const severity = getSeverityDisplay();
  const trend = getTrendDisplay();

  const handleRouteSelect = (index: number) => {
    setSelectedRoute(index);
    onRouteSelect?.(index);
  };

  return (
    <div className="tracking-info-card unified-stats-card">
      {/* Header with refresh */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center bg-primary/20 text-primary">
            <Zap className="w-3 h-3" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
            Live Stats
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-white/40 hover:text-white hover:bg-white/10"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
        </Button>
      </div>

      {/* Primary Stats Row - ETA, Time, Distance */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-2.5 border border-primary/20">
          <div className="text-[9px] uppercase tracking-wider text-white/50 mb-0.5">ETA</div>
          <div className="text-lg font-bold text-primary leading-tight">
            {adjustedETA || '--:--'}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
          <div className="text-[9px] uppercase tracking-wider text-white/50 mb-0.5">Time Left</div>
          <div className="text-lg font-bold text-white leading-tight">
            {adjustedDuration || timeRemaining}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
          <div className="text-[9px] uppercase tracking-wider text-white/50 mb-0.5">Distance</div>
          <div className="text-lg font-bold text-white leading-tight">
            {remainingDistance || Math.round(totalDistance - distanceTraveled)} mi
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-white/50 mb-1.5">
          <span>{Math.round(progress)}% complete</span>
          <span>{Math.round(distanceTraveled)}/{Math.round(totalDistance)} mi</span>
        </div>
        <div className="tracking-progress-bar h-2">
          <div 
            className="tracking-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Traffic, Tolls, Fuel Row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* Traffic */}
        <div className={cn("rounded-lg p-2 border", severity.bg)}>
          <div className="flex items-center gap-1 mb-0.5">
            <AlertTriangle className={cn("w-2.5 h-2.5", severity.color)} />
            <span className="text-[8px] uppercase tracking-wider text-white/50">Traffic</span>
          </div>
          <div className={cn("text-xs font-semibold", severity.color)}>
            {severity.label}
          </div>
          {trafficDelay > 0 && (
            <div className="text-[9px] text-white/40">+{trafficDelay}m delay</div>
          )}
        </div>

        {/* Tolls */}
        <div className={cn(
          "rounded-lg p-2 border",
          tollInfo?.hasTolls ? "bg-white/5 border-white/10" : "bg-emerald-500/10 border-emerald-500/20"
        )}>
          <div className="flex items-center gap-1 mb-0.5">
            <DollarSign className={cn("w-2.5 h-2.5", tollInfo?.hasTolls ? "text-white/40" : "text-emerald-400")} />
            <span className="text-[8px] uppercase tracking-wider text-white/50">Tolls</span>
          </div>
          <div className={cn("text-xs font-semibold", tollInfo?.hasTolls ? "text-white" : "text-emerald-400")}>
            {tollInfo?.hasTolls ? (tollInfo.estimatedPrice || '~$5-15') : 'Free'}
          </div>
        </div>

        {/* Fuel */}
        <div className={cn(
          "rounded-lg p-2 border",
          isFuelEfficient ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white/5 border-white/10"
        )}>
          <div className="flex items-center gap-1 mb-0.5">
            <Fuel className={cn("w-2.5 h-2.5", isFuelEfficient ? "text-emerald-400" : "text-white/40")} />
            <span className="text-[8px] uppercase tracking-wider text-white/50">Fuel</span>
          </div>
          <div className={cn("text-xs font-semibold", isFuelEfficient ? "text-emerald-400" : "text-white")}>
            {isFuelEfficient ? 'Optimal' : 'Standard'}
          </div>
        </div>
      </div>

      {/* Traffic Trend & Last Update */}
      <div className="flex items-center justify-between py-2 border-t border-white/10">
        {trend && (
          <div className="flex items-center gap-1.5">
            <span className={trend.color}>{trend.icon}</span>
            <span className="text-[10px] text-white/50">Traffic {trend.label}</span>
          </div>
        )}
        {lastUpdate && (
          <span className="text-[10px] text-white/40">
            Updated {formatTimeAgo(lastUpdate)}
          </span>
        )}
      </div>

      {/* Alternate Routes (Collapsible) */}
      {alternateRoutes.length > 0 && (
        <Collapsible open={showAlternates} onOpenChange={setShowAlternates}>
          <CollapsibleTrigger className="w-full flex items-center justify-between py-2 border-t border-white/10 text-[10px] text-white/50 hover:text-white/70 transition-colors">
            <span className="uppercase tracking-wider font-medium">Alternate Routes</span>
            {showAlternates ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-1.5 pt-2">
            {alternateRoutes.slice(0, 2).map((alt) => (
              <button
                key={alt.index}
                onClick={() => handleRouteSelect(alt.index)}
                className={cn(
                  "w-full text-left p-2 rounded-lg border transition-all",
                  selectedRoute === alt.index
                    ? "bg-primary/20 border-primary/50"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                )}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-medium text-white truncate pr-2">
                    {alt.description || `Via alternate ${alt.index}`}
                  </span>
                  <ChevronRight className="w-2.5 h-2.5 text-white/40 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-2 text-[9px] text-white/50">
                  <span>{alt.distanceMiles} mi</span>
                  <span>•</span>
                  <span>{alt.durationFormatted}</span>
                  {alt.isTollFree && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400">No tolls</span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
