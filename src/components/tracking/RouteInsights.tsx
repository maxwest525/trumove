import { useState, useEffect } from "react";
import { Sparkles, MapPin, Star, Lightbulb, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface RouteInsight {
  name: string;
  type: string;
  location: { lat: number; lng: number };
  rating?: number;
  description: string;
  funFact?: string;
  vicinity?: string;
}

interface RouteInsightsProps {
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
  originName: string;
  destName: string;
}

export function RouteInsights({
  originCoords,
  destCoords,
  originName,
  destName
}: RouteInsightsProps) {
  const [insights, setInsights] = useState<RouteInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch insights when coordinates change
  useEffect(() => {
    if (!originCoords || !destCoords) {
      setInsights([]);
      return;
    }

    const fetchInsights = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const routePoints = [
          { lat: originCoords[1], lng: originCoords[0], name: originName },
          // Add midpoint
          { 
            lat: (originCoords[1] + destCoords[1]) / 2, 
            lng: (originCoords[0] + destCoords[0]) / 2,
            name: undefined
          },
          { lat: destCoords[1], lng: destCoords[0], name: destName },
        ];

        const { data, error: fnError } = await supabase.functions.invoke('google-places-insights', {
          body: { routePoints, limit: 4 }
        });

        if (fnError) {
          console.error('Places insights error:', fnError);
          setError('Unable to load route insights');
          return;
        }

        if (data?.insights) {
          setInsights(data.insights);
        }
      } catch (err) {
        console.error('Failed to fetch insights:', err);
        setError('Unable to load route insights');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [originCoords, destCoords, originName, destName]);

  // Rotate through insights every 8 seconds
  useEffect(() => {
    if (insights.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [insights.length]);

  if (!originCoords || !destCoords) {
    return null;
  }

  const currentInsight = insights[currentIndex];

  return (
    <div className="tracking-info-card route-insights-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
            Did You Know?
          </span>
        </div>
        {insights.length > 1 && (
          <div className="flex gap-1">
            {insights.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  idx === currentIndex 
                    ? "bg-primary w-4" 
                    : "bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-h-[80px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-white/40 text-sm">
            {error}
          </div>
        ) : currentInsight ? (
          <div className="space-y-2 animate-fade-scale-in opacity-0">
            {/* Fun Fact */}
            {currentInsight.funFact && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-sm text-white/90 leading-relaxed">
                  {currentInsight.funFact}
                </p>
              </div>
            )}

            {/* Place info if not a route_info type */}
            {currentInsight.type !== 'route_info' && currentInsight.type !== 'city' && (
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <MapPin className="w-3 h-3 text-white/40" />
                <span className="text-xs text-white/50">{currentInsight.name}</span>
                {currentInsight.rating && (
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-white/60">{currentInsight.rating}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-white/40 text-sm">
            Discovering interesting facts...
          </div>
        )}
      </div>
    </div>
  );
}
