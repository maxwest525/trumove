import { useState, useEffect } from "react";
import { Zap, TrendingDown, Clock, Route, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface OptimizationResult {
  optimizedOrder: number[];
  totalDistance: number;
  totalDuration: number;
  savings: {
    distancePercent: number;
    durationPercent: number;
  };
  legs: Array<{
    from: number;
    to: number;
    distance: number;
    duration: number;
  }>;
}

interface RouteOptimizationCardProps {
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
  intermediateStops?: Array<{ lat: number; lng: number; label?: string }>;
  isMultiStop?: boolean;
}

export function RouteOptimizationCard({
  originCoords,
  destCoords,
  intermediateStops = [],
  isMultiStop = false,
}: RouteOptimizationCardProps) {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeSavedMinutes, setTimeSavedMinutes] = useState<number>(0);

  // Fetch optimization data when coordinates change
  useEffect(() => {
    if (!originCoords || !destCoords) {
      setResult(null);
      setTimeSavedMinutes(0);
      return;
    }

    // Build waypoints array
    const waypoints = [
      { lat: originCoords[1], lng: originCoords[0], label: "Origin" },
      ...intermediateStops,
      { lat: destCoords[1], lng: destCoords[0], label: "Destination" },
    ];

    // Only call optimization if we have 2+ waypoints
    if (waypoints.length < 2) return;

    const fetchOptimization = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: funcError } = await supabase.functions.invoke(
          "mapbox-directions-optimize",
          {
            body: {
              waypoints,
              profile: "driving-traffic",
            },
          }
        );

        if (funcError) {
          console.error("Route optimization error:", funcError);
          setError("Unable to optimize route");
          return;
        }

        if (data?.error || data?.fallback) {
          // Fallback to Google if Mapbox fails
          const { data: googleData } = await supabase.functions.invoke(
            "google-route-optimization",
            {
              body: { waypoints },
            }
          );

          if (googleData && !googleData.error) {
            setResult(googleData);
            // Calculate time saved in minutes
            const savedSeconds =
              (googleData.savings?.durationPercent / 100) *
              googleData.totalDuration;
            setTimeSavedMinutes(Math.round(savedSeconds / 60));
          }
          return;
        }

        if (data) {
          setResult(data);
          // Calculate time saved in minutes
          const savedSeconds =
            (data.savings?.durationPercent / 100) * data.totalDuration;
          setTimeSavedMinutes(Math.round(savedSeconds / 60));
        }
      } catch (err) {
        console.error("Optimization fetch error:", err);
        setError("Failed to optimize route");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptimization();
  }, [originCoords, destCoords, intermediateStops]);

  // Don't show if no coordinates
  if (!originCoords || !destCoords) return null;

  // Format duration
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Format distance
  const formatDistance = (meters: number): string => {
    const miles = meters / 1609.34;
    return `${miles.toFixed(1)} mi`;
  };

  return (
    <div className="tracking-info-card">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-primary/20 text-primary">
          <Zap className="w-3.5 h-3.5" />
        </div>
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/50">
          Route Optimization
        </span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-2 py-4">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm text-foreground/70">
            Optimizing your route...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-sm text-foreground/60 py-2">{error}</div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="space-y-4">
          {/* Time Saved Banner */}
          {result.savings.durationPercent > 0 ? (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Time Saved
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {timeSavedMinutes > 0 ? `${timeSavedMinutes}` : "<1"}
                </span>
                <span className="text-sm text-foreground/70">minutes</span>
                <span className="ml-auto text-xs text-primary font-semibold">
                  {result.savings.durationPercent.toFixed(1)}% faster
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-muted/40 border border-border rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground/80">
                  Your route is already optimized!
                </span>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/40 dark:bg-white/5 rounded-lg p-3 border border-border">
              <div className="flex items-center gap-1.5 text-foreground/50 mb-1">
                <Route className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-wider">
                  Distance
                </span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {formatDistance(result.totalDistance)}
              </div>
              {result.savings.distancePercent > 0 && (
                <div className="text-[10px] text-primary">
                  {result.savings.distancePercent.toFixed(1)}% shorter
                </div>
              )}
            </div>

            <div className="bg-muted/40 dark:bg-white/5 rounded-lg p-3 border border-border">
              <div className="flex items-center gap-1.5 text-foreground/50 mb-1">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-wider">
                  Duration
                </span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {formatDuration(result.totalDuration)}
              </div>
              <div className="text-[10px] text-foreground/50">
                with live traffic
              </div>
            </div>
          </div>

          {/* Multi-stop indicator */}
          {isMultiStop && result.legs && result.legs.length > 1 && (
            <div className="pt-3 border-t border-border">
              <div className="text-[10px] font-bold tracking-wider uppercase text-foreground/50 mb-2">
                Stop Order Optimized
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {result.optimizedOrder.map((idx, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                        i === 0
                          ? "bg-primary text-primary-foreground"
                          : i === result.optimizedOrder.length - 1
                          ? "bg-red-500 text-white"
                          : "bg-muted text-foreground"
                      )}
                    >
                      {i + 1}
                    </span>
                    {i < result.optimizedOrder.length - 1 && (
                      <span className="text-foreground/30">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
