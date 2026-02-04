import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Waypoint {
  lat: number;
  lng: number;
  label?: string;
  address: string;
  type: 'pickup' | 'dropoff';
}

export interface OptimizationResult {
  optimizedOrder: number[];
  totalDistance: number; // meters
  totalDuration: number; // seconds
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
  geometry?: string; // Encoded polyline from Mapbox for precise route display
}

type OptimizationProvider = 'mapbox' | 'google';

interface UseRouteOptimizationOptions {
  provider?: OptimizationProvider;
  profile?: 'driving' | 'driving-traffic' | 'walking' | 'cycling';
}

interface UseRouteOptimizationResult {
  optimize: (waypoints: Waypoint[]) => Promise<OptimizationResult | null>;
  isOptimizing: boolean;
  result: OptimizationResult | null;
  error: string | null;
  clearResult: () => void;
}

// Cache for optimization results
const optimizationCache = new Map<string, OptimizationResult>();

function getCacheKey(waypoints: Waypoint[]): string {
  return waypoints.map(w => `${w.lat.toFixed(5)},${w.lng.toFixed(5)}`).join('|');
}

export function useRouteOptimization(
  options: UseRouteOptimizationOptions = {}
): UseRouteOptimizationResult {
  // Use Mapbox by default for traffic-aware optimization
  const { provider = 'mapbox', profile = 'driving-traffic' } = options;
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const optimize = useCallback(async (waypoints: Waypoint[]): Promise<OptimizationResult | null> => {
    if (waypoints.length < 2) {
      setError("At least 2 waypoints are required for optimization");
      return null;
    }

    const maxWaypoints = provider === 'mapbox' ? 12 : 10;
    if (waypoints.length > maxWaypoints) {
      setError(`Maximum ${maxWaypoints} waypoints supported for optimization`);
      return null;
    }

    // Check cache first
    const cacheKey = getCacheKey(waypoints) + `_${provider}_${profile}`;
    const cached = optimizationCache.get(cacheKey);
    if (cached) {
      setResult(cached);
      setError(null);
      return cached;
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsOptimizing(true);
    setError(null);

    try {
      // Use Mapbox Optimization API by default for better traffic-aware results
      const functionName = provider === 'mapbox' ? 'mapbox-optimization' : 'google-route-optimization';
      
      const { data, error: funcError } = await supabase.functions.invoke(functionName, {
        body: {
          waypoints: waypoints.map(w => ({
            lat: w.lat,
            lng: w.lng,
            label: w.label || w.address,
          })),
          profile, // Only used by Mapbox
          roundtrip: false,
          source: 'first',
          destination: 'last',
        },
      });

      if (funcError) {
        console.error('Route optimization error:', funcError);
        
        // Fallback to Google if Mapbox fails
        if (provider === 'mapbox') {
          console.log('Mapbox optimization failed, falling back to Google...');
          const { data: googleData, error: googleError } = await supabase.functions.invoke('google-route-optimization', {
            body: {
              waypoints: waypoints.map(w => ({
                lat: w.lat,
                lng: w.lng,
                label: w.label || w.address,
              })),
            },
          });
          
          if (!googleError && googleData && !googleData.error) {
            const fallbackResult: OptimizationResult = {
              optimizedOrder: googleData.optimizedOrder,
              totalDistance: googleData.totalDistance,
              totalDuration: googleData.totalDuration,
              savings: googleData.savings,
              legs: googleData.legs,
            };
            optimizationCache.set(cacheKey, fallbackResult);
            setResult(fallbackResult);
            return fallbackResult;
          }
        }
        
        setError("Failed to optimize route. Please try again.");
        return null;
      }

      if (data?.error) {
        console.error('Route optimization API error:', data.error);
        
        if (data.code === 'TOO_MANY_WAYPOINTS') {
          setError(`Too many stops. Maximum ${maxWaypoints} waypoints supported.`);
        } else if (data.fallback) {
          setError("Route optimization service temporarily unavailable.");
        } else {
          setError(data.error);
        }
        return null;
      }

      const optimizationResult: OptimizationResult = {
        optimizedOrder: data.optimizedOrder,
        totalDistance: data.totalDistance,
        totalDuration: data.totalDuration,
        savings: data.savings,
        legs: data.legs,
        geometry: data.geometry, // Mapbox provides the optimized route geometry
      };

      // Cache the result
      optimizationCache.set(cacheKey, optimizationResult);
      
      setResult(optimizationResult);
      return optimizationResult;
    } catch (err) {
      console.error('Route optimization exception:', err);
      setError("An unexpected error occurred. Please try again.");
      return null;
    } finally {
      setIsOptimizing(false);
    }
  }, [provider, profile]);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    optimize,
    isOptimizing,
    result,
    error,
    clearResult,
  };
}

// Utility function to format duration
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}

// Utility function to format distance
export function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  if (miles < 1) {
    return `${(miles * 5280).toFixed(0)} ft`;
  }
  return `${miles.toFixed(1)} mi`;
}
