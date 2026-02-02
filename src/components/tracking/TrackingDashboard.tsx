import { Clock, Route, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrafficInfo {
  delayMinutes: number;
  hasDelay: boolean;
  severity: 'low' | 'medium' | 'high';
}

interface TollInfo {
  hasTolls: boolean;
  estimatedPrice: string | null;
}

interface TrackingDashboardProps {
  progress: number;
  distanceTraveled: number;
  totalDistance: number;
  timeRemaining: string;
  averageSpeed?: number;
  trafficInfo?: TrafficInfo | null;
  tollInfo?: TollInfo | null;
  etaFormatted?: string | null;
}

export function TrackingDashboard({
  progress,
  distanceTraveled,
  totalDistance,
  timeRemaining,
  averageSpeed = 55,
  trafficInfo,
  tollInfo,
  etaFormatted
}: TrackingDashboardProps) {
  return (
    <div className="tracking-info-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-primary/20 text-primary">
          <TrendingUp className="w-3.5 h-3.5" />
        </div>
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
          Progress
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-white/60 mb-2">
          <span>{Math.round(progress)}% complete</span>
          <span>{Math.round(distanceTraveled)} / {Math.round(totalDistance)} mi</span>
        </div>
        <div className="tracking-progress-bar">
          <div 
            className="tracking-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-white/40 mb-1">
            <Route className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-wider">Distance</span>
          </div>
          <div className="text-lg font-bold text-white">
            {Math.round(totalDistance - distanceTraveled)} mi
          </div>
          <div className="text-[10px] text-white/40">remaining</div>
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-white/40 mb-1">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-wider">Time</span>
          </div>
          <div className="text-lg font-bold text-white">
            {timeRemaining}
          </div>
          <div className="text-[10px] text-white/40">remaining</div>
        </div>
      </div>

      {/* Traffic & Toll Info (Google Routes) */}
      {(trafficInfo || tollInfo) && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
          {trafficInfo && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Traffic</span>
              <span className={cn(
                "text-sm font-semibold",
                trafficInfo.severity === 'high' ? "text-red-400" 
                  : trafficInfo.severity === 'medium' ? "text-yellow-400" 
                  : "text-emerald-400"
              )}>
                {trafficInfo.hasDelay ? `+${trafficInfo.delayMinutes}m` : 'Clear'}
              </span>
            </div>
          )}

          {tollInfo && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Tolls</span>
              <span className={cn(
                "text-sm font-semibold",
                tollInfo.hasTolls ? "text-white" : "text-emerald-400"
              )}>
                {tollInfo.hasTolls ? (tollInfo.estimatedPrice || '~$5-15') : 'Free'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Speed indicator */}
      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
        <span className="text-[10px] text-white/40 uppercase tracking-wider">Avg Speed</span>
        <span className="text-sm font-semibold text-white">{averageSpeed} mph</span>
      </div>

      {/* Live ETA from Google */}
      {etaFormatted && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] text-white/40 uppercase tracking-wider">Live ETA</span>
          <span className="text-sm font-semibold text-primary">{etaFormatted}</span>
        </div>
      )}
    </div>
  );
}
