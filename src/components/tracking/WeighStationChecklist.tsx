import { useMemo } from "react";
import { Scale, CheckCircle2, AlertCircle, ChevronRight, Radio, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  WeighStation, 
  findWeighStationsOnRoute, 
  getStationStatus 
} from "@/data/weighStations";

interface WeighStationChecklistProps {
  routeCoordinates: [number, number][];
  progress: number;
  isTracking: boolean;
}

export function WeighStationChecklist({
  routeCoordinates,
  progress,
  isTracking
}: WeighStationChecklistProps) {
  // Find weigh stations along the route
  const stationsOnRoute = useMemo(() => {
    if (!routeCoordinates.length) return [];
    return findWeighStationsOnRoute(routeCoordinates, 3); // 3 mile tolerance
  }, [routeCoordinates]);

  // Get status for each station
  const stationsWithStatus = useMemo(() => {
    return stationsOnRoute.map(({ station, routeIndex, distanceFromRoute }) => ({
      station,
      routeIndex,
      distanceFromRoute,
      status: getStationStatus(routeIndex, routeCoordinates.length, progress)
    }));
  }, [stationsOnRoute, routeCoordinates.length, progress]);

  const passedCount = stationsWithStatus.filter(s => s.status === 'passed').length;
  const totalCount = stationsWithStatus.length;

  if (!routeCoordinates.length) {
    return (
      <div className="tracking-info-card weigh-station-checklist">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
            Weigh Stations
          </span>
        </div>
        <div className="text-center py-6 text-white/40 text-sm">
          Enter route to see stations
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-info-card weigh-station-checklist">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
            Weigh Stations
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary">
            {passedCount}/{totalCount}
          </span>
          <span className="text-[10px] text-white/40">cleared</span>
        </div>
      </div>

      {/* Station List */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 weigh-station-scroll">
        {stationsWithStatus.length === 0 ? (
          <div className="text-center py-4 text-white/40 text-sm">
            No weigh stations on this route
          </div>
        ) : (
          stationsWithStatus.map(({ station, status }, index) => (
            <WeighStationItem 
              key={station.id} 
              station={station} 
              status={status}
              isTracking={isTracking}
              index={index}
            />
          ))
        )}
      </div>

      {/* Legend */}
      {totalCount > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] text-white/40">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Passed</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-white/40">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Approaching</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-white/40">
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <span>Upcoming</span>
          </div>
        </div>
      )}
    </div>
  );
}

function WeighStationItem({ 
  station, 
  status,
  isTracking,
  index
}: { 
  station: WeighStation; 
  status: 'passed' | 'approaching' | 'upcoming';
  isTracking: boolean;
  index: number;
}) {
  return (
    <div 
      className={cn(
        "weigh-station-item group relative flex items-start gap-3 p-2.5 rounded-lg border transition-all duration-300",
        status === 'passed' && "bg-primary/10 border-primary/30",
        status === 'approaching' && "bg-amber-500/15 border-amber-500/40 animate-pulse-subtle",
        status === 'upcoming' && "bg-white/5 border-white/10 opacity-60"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Status Icon */}
      <div className={cn(
        "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all",
        status === 'passed' && "bg-primary/20",
        status === 'approaching' && "bg-amber-500/20",
        status === 'upcoming' && "bg-white/10"
      )}>
        {status === 'passed' ? (
          <CheckCircle2 className="w-4 h-4 text-primary" />
        ) : status === 'approaching' ? (
          <AlertCircle className="w-4 h-4 text-amber-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-white/40" />
        )}
      </div>

      {/* Station Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-semibold truncate",
            status === 'passed' ? "text-white" : 
            status === 'approaching' ? "text-amber-300" : "text-white/60"
          )}>
            {station.name}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-medium text-white/40">
            {station.interstate} • MM {station.mile_marker}
          </span>
          <span className="text-[10px] text-white/30">•</span>
          <span className="text-[10px] text-white/40">{station.state}</span>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 mt-1.5">
          {station.is_24_7 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-semibold text-white/60">
              24/7
            </span>
          )}
          {station.has_prepass && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/20 text-[9px] font-semibold text-primary">
              <Radio className="w-2.5 h-2.5" />
              PrePass
            </span>
          )}
          {station.has_drivewyze && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/20 text-[9px] font-semibold text-blue-400">
              <Shield className="w-2.5 h-2.5" />
              Drivewyze
            </span>
          )}
        </div>
      </div>

      {/* Approaching indicator */}
      {status === 'approaching' && isTracking && (
        <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
      )}
    </div>
  );
}
