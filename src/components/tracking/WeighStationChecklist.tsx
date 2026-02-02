import { useMemo, useEffect, useRef } from "react";
import { Scale, CheckCircle2, AlertCircle, ChevronRight, Radio, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
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
  // Track which stations have had notifications shown
  const notifiedStations = useRef<Set<string>>(new Set());

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

  // Show toast notifications for approaching stations
  useEffect(() => {
    if (!isTracking) return;

    stationsWithStatus.forEach(({ station, status }) => {
      const notifyKey = `approaching-${station.id}`;
      const passedKey = `passed-${station.id}`;

      // Notify when approaching
      if (status === 'approaching' && !notifiedStations.current.has(notifyKey)) {
        notifiedStations.current.add(notifyKey);
        toast.info(`⚖️ Approaching ${station.name}`, {
          description: `${station.interstate} • Mile ${station.mile_marker} • ${station.state}${station.has_prepass ? ' (PrePass)' : ''}`,
          duration: 5000,
        });
      }

      // Notify when passed
      if (status === 'passed' && !notifiedStations.current.has(passedKey)) {
        notifiedStations.current.add(passedKey);
        toast.success(`✅ Cleared ${station.name}`, {
          description: `${station.interstate} weigh station passed`,
          duration: 3000,
        });
      }
    });
  }, [stationsWithStatus, isTracking]);

  // Reset notifications when route changes
  useEffect(() => {
    notifiedStations.current = new Set();
  }, [routeCoordinates]);

  const passedCount = stationsWithStatus.filter(s => s.status === 'passed').length;
  const totalCount = stationsWithStatus.length;

  if (!routeCoordinates.length) {
    return (
      <div className="tracking-info-card weigh-station-checklist">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="w-4 h-4 text-orange-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
            Weigh Stations
          </span>
        </div>
        <div className="text-center py-6 text-slate-500 text-sm">
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
          <Scale className="w-4 h-4 text-orange-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
            Weigh Stations
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400">
            {passedCount}/{totalCount}
          </span>
          <span className="text-[10px] text-slate-500">cleared</span>
        </div>
      </div>

      {/* Station List */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 weigh-station-scroll">
        {stationsWithStatus.length === 0 ? (
          <div className="text-center py-4 text-slate-500 text-sm">
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
        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Passed</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Approaching</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <div className="w-2 h-2 rounded-full bg-slate-500" />
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
        "weigh-station-item group relative flex items-start gap-3 p-3 rounded-lg border transition-all duration-300",
        status === 'passed' && "weigh-passed",
        status === 'approaching' && "weigh-approaching",
        status === 'upcoming' && "weigh-upcoming"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Status Icon */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all",
        status === 'passed' && "bg-emerald-500/20",
        status === 'approaching' && "bg-orange-500/25",
        status === 'upcoming' && "bg-slate-500/15"
      )}>
        {status === 'passed' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        ) : status === 'approaching' ? (
          <AlertCircle className="w-4 h-4 text-orange-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </div>

      {/* Station Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-semibold truncate",
            status === 'passed' ? "text-emerald-300" : 
            status === 'approaching' ? "text-orange-300" : "text-slate-400"
          )}>
            {station.name}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-medium text-slate-500">
            {station.interstate} • MM {station.mile_marker}
          </span>
          <span className="text-[10px] text-slate-600">•</span>
          <span className="text-[10px] text-slate-500">{station.state}</span>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 mt-1.5">
          {station.is_24_7 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-700/50 text-[9px] font-semibold text-slate-300">
              24/7
            </span>
          )}
          {station.has_prepass && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/20 text-[9px] font-semibold text-cyan-400">
              <Radio className="w-2.5 h-2.5" />
              PrePass
            </span>
          )}
          {station.has_drivewyze && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-500/20 text-[9px] font-semibold text-violet-400">
              <Shield className="w-2.5 h-2.5" />
              Drivewyze
            </span>
          )}
        </div>
      </div>

      {/* Approaching indicator */}
      {status === 'approaching' && isTracking && (
        <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-orange-500 animate-ping" />
      )}
    </div>
  );
}
