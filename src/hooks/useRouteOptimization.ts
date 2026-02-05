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

export function useRouteOptimization(): UseRouteOptimizationResult {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const optimize = useCallback(async (waypoints: Waypoint[]): Promise<OptimizationResult | null> => {
    if (waypoints.length < 2) {
      setError("At least 2 waypoints are required for optimization");
      return null;
    }

    if (waypoints.length > 10) {
      setError("Maximum 10 waypoints supported for optimization");
      return null;
    }

    // Check cache first
    const cacheKey = getCacheKey(waypoints);
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
      const { data, error: funcError } = await supabase.functions.invoke('google-route-optimization', {
        body: {
          waypoints: waypoints.map(w => ({
            lat: w.lat,
            lng: w.lng,
            label: w.label || w.address,
          })),
        },
      });

      if (funcError) {
        console.error('Route optimization error:', funcError);
        setError("Failed to optimize route. Please try again.");
        return null;
      }

      if (data?.error) {
        console.error('Route optimization API error:', data.error);
        
        // Handle specific error cases
        if (data.code === 'API_NOT_CONFIGURED') {
          setError("Route optimization is not configured. Please contact support.");
        } else if (data.code === 'TOO_MANY_WAYPOINTS') {
          setError("Too many stops. Maximum 10 waypoints supported.");
        } else if (data.fallback) {
          // API not enabled - provide helpful message
          setError("Route optimization requires Google Directions API. Please enable it in Google Cloud Console.");
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
  }, []);

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
