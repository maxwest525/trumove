import { useState, useEffect } from "react";
import { AlertTriangle, Clock, DollarSign, Fuel, Route, ChevronRight, Loader2, Construction, Car, CloudRain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// Traffic delay reason interface
interface TrafficReason {
  type: 'accident' | 'construction' | 'weather' | 'event' | 'congestion';
  description: string;
  impactMinutes: number;
  iconType: 'alert' | 'construction' | 'car' | 'weather';
}

// Helper to generate traffic reasons based on severity and time
const getTrafficReasons = (severity: string, delayMinutes: number): TrafficReason[] => {
  const reasons: TrafficReason[] = [];
  if (delayMinutes <= 0) return reasons;
  
  const hour = new Date().getHours();
  const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19);
  
  // High severity - likely incident
  if (severity === 'high') {
    reasons.push({
      type: 'accident',
      description: 'Incident reported ahead',
      impactMinutes: Math.round(delayMinutes * 0.4),
      iconType: 'alert'
    });
  }
  
  // Medium or high - possible construction
  if (severity === 'high' || severity === 'medium') {
    reasons.push({
      type: 'construction',
      description: 'Road work - lane restrictions',
      impactMinutes: Math.round(delayMinutes * 0.3),
      iconType: 'construction'
    });
  }
  
  // Rush hour congestion
  if (isRushHour && delayMinutes > 5) {
    reasons.push({
      type: 'congestion',
      description: 'Rush hour traffic',
      impactMinutes: Math.round(delayMinutes * 0.3),
      iconType: 'car'
    });
  }
  
  // If no specific reasons, show general congestion
  if (reasons.length === 0 && delayMinutes > 0) {
    reasons.push({
      type: 'congestion',
      description: 'Heavy traffic volume',
      impactMinutes: delayMinutes,
      iconType: 'car'
    });
  }
  
  return reasons;
};

// Get icon component for traffic reason
const TrafficReasonIcon = ({ type }: { type: TrafficReason['iconType'] }) => {
  switch (type) {
    case 'alert':
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    case 'construction':
      return <Construction className="w-4 h-4 text-amber-400" />;
    case 'car':
      return <Car className="w-4 h-4 text-orange-400" />;
    case 'weather':
      return <CloudRain className="w-4 h-4 text-blue-400" />;
    default:
      return <AlertTriangle className="w-4 h-4 text-white/50" />;
  }
};

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

interface GoogleRouteData {
  route: {
    distanceMiles: number;
    durationFormatted: string;
    etaFormatted: string;
    traffic: TrafficData;
    tolls: TollData;
    isFuelEfficient: boolean;
  };
  alternateRoutes: AlternateRoute[];
  hasAlternates: boolean;
}

interface TrafficInsightsProps {
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
  onRouteSelect?: (routeIndex: number) => void;
}

export function TrafficInsights({ originCoords, destCoords, onRouteSelect }: TrafficInsightsProps) {
  const [routeData, setRouteData] = useState<GoogleRouteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState(0);

  useEffect(() => {
    if (!originCoords || !destCoords) {
      setRouteData(null);
      return;
    }

    const fetchRouteData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke('google-routes', {
          body: {
            origin: { lat: originCoords[1], lng: originCoords[0] },
            destination: { lat: destCoords[1], lng: destCoords[0] },
            computeAlternatives: true,
            departureTime: new Date().toISOString(),
          },
        });

        if (fnError) {
          console.error('Google Routes error:', fnError);
          setError('Unable to fetch traffic data');
          return;
        }

        if (data?.fallback) {
          setError('Google Routes API not enabled');
          return;
        }

        if (data?.success) {
          setRouteData(data);
        }
      } catch (err) {
        console.error('Traffic fetch error:', err);
        setError('Failed to load traffic insights');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteData();
  }, [originCoords, destCoords]);

  const handleRouteSelect = (index: number) => {
    setSelectedRoute(index);
    onRouteSelect?.(index);
  };

  if (!originCoords || !destCoords) return null;

  if (isLoading) {
    return (
      <div className="tracking-info-card">
        <div className="flex items-center gap-2 mb-4">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
            Loading Traffic Data...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tracking-info-card">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <span className="text-xs text-white/60">{error}</span>
        </div>
        <p className="text-[10px] text-white/40">Using estimated times instead</p>
      </div>
    );
  }

  if (!routeData) return null;

  const { route, alternateRoutes, hasAlternates } = routeData;

  return (
    <div className="tracking-info-card">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-primary/20 text-primary">
          <Route className="w-3.5 h-3.5" />
        </div>
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
          Google Routes Insights
        </span>
      </div>

      {/* Traffic Status */}
      <div className={cn(
        "rounded-lg p-3 mb-3 border",
        route.traffic.severity === 'high' 
          ? "bg-red-500/10 border-red-500/30" 
          : route.traffic.severity === 'medium'
            ? "bg-yellow-500/10 border-yellow-500/30"
            : "bg-emerald-500/10 border-emerald-500/30"
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className={cn(
              "w-4 h-4",
              route.traffic.severity === 'high' ? "text-red-400" 
                : route.traffic.severity === 'medium' ? "text-yellow-400" 
                : "text-emerald-400"
            )} />
            <span className="text-xs font-medium text-white">Traffic Conditions</span>
          </div>
          <span className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full",
            route.traffic.severity === 'high' 
              ? "bg-red-500/20 text-red-300" 
              : route.traffic.severity === 'medium'
                ? "bg-yellow-500/20 text-yellow-300"
                : "bg-emerald-500/20 text-emerald-300"
          )}>
            {route.traffic.severity === 'high' ? 'Heavy' : route.traffic.severity === 'medium' ? 'Moderate' : 'Light'}
          </span>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-white">
            {route.traffic.hasDelay ? `+${route.traffic.delayFormatted}` : 'No delays'}
          </span>
          {route.traffic.hasDelay && (
            <span className="text-[10px] text-white/50">due to traffic</span>
          )}
        </div>
      </div>

      {/* Delay Causes Section */}
      {route.traffic.hasDelay && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-[10px] text-white/50 uppercase tracking-wider mb-3 font-bold">
            Delay Causes
          </div>
          <div className="space-y-2">
            {getTrafficReasons(route.traffic.severity, route.traffic.delayMinutes).map((reason, i) => (
              <div key={i} className="flex items-center gap-3">
                <TrafficReasonIcon type={reason.iconType} />
                <span className="text-xs text-white/80 flex-1">{reason.description}</span>
                <span className="text-[10px] text-white/40 font-mono">+{reason.impactMinutes}m</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toll & Fuel Info */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-white/40 mb-1">
            <DollarSign className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-wider">Tolls</span>
          </div>
          {route.tolls.hasTolls ? (
            <>
              <div className="text-lg font-bold text-white">
                {route.tolls.estimatedPrice || '~$5-15'}
              </div>
              <div className="text-[10px] text-white/40">estimated</div>
            </>
          ) : (
            <>
              <div className="text-lg font-bold text-emerald-400">Free</div>
              <div className="text-[10px] text-white/40">no tolls</div>
            </>
          )}
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-white/40 mb-1">
            <Fuel className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-wider">Fuel</span>
          </div>
          {route.isFuelEfficient ? (
            <>
              <div className="text-lg font-bold text-emerald-400">Optimal</div>
              <div className="text-[10px] text-white/40">fuel-efficient</div>
            </>
          ) : (
            <>
              <div className="text-lg font-bold text-white">Standard</div>
              <div className="text-[10px] text-white/40">regular route</div>
            </>
          )}
        </div>
      </div>

      {/* ETA */}
      <div className="flex items-center justify-between py-2 border-t border-white/10 mb-3">
        <span className="text-[10px] text-white/40 uppercase tracking-wider">Live ETA</span>
        <span className="text-sm font-semibold text-primary">{route.etaFormatted}</span>
      </div>

      {/* Alternate Routes */}
      {hasAlternates && alternateRoutes.length > 0 && (
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
              Alternate Routes
            </span>
          </div>
          
          <div className="space-y-2">
            {alternateRoutes.slice(0, 2).map((alt) => (
              <button
                key={alt.index}
                onClick={() => handleRouteSelect(alt.index)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-all",
                  selectedRoute === alt.index
                    ? "bg-primary/20 border-primary/50"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white truncate pr-2">
                    {alt.description || `Via alternate ${alt.index}`}
                  </span>
                  <ChevronRight className="w-3 h-3 text-white/40 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-3 text-[10px] text-white/50">
                  <span>{alt.distanceMiles} mi</span>
                  <span>•</span>
                  <span>{alt.durationFormatted}</span>
                  {alt.isTollFree && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400">No tolls</span>
                    </>
                  )}
                  {alt.traffic.hasDelay && (
                    <>
                      <span>•</span>
                      <span className="text-yellow-400">+{alt.traffic.delayMinutes}m</span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}