import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, Box, Navigation, RotateCw, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Google3DTrackingViewProps {
  coordinates: [number, number] | null;
  bearing?: number;
  isTracking?: boolean;
  followMode?: boolean;
  onClose?: () => void;
  googleApiKey: string;
  trafficSeverity?: 'low' | 'medium' | 'high';
  trafficDelayMinutes?: number;
}

declare global {
  interface Window {
    google: any;
  }
}

/**
 * Google 3D Photorealistic Map View
 * Uses Google Maps JavaScript API with maps3d library for immersive 3D tracking
 */
export function Google3DTrackingView({
  coordinates,
  bearing = 0,
  isTracking = false,
  followMode = false,
  onClose,
  googleApiKey,
  trafficSeverity = 'low',
  trafficDelayMinutes = 0
}: Google3DTrackingViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const map3DRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const orbitAnimationRef = useRef<number | null>(null);
  const orbitAngleRef = useRef(0);

  // Load Google Maps script if not already loaded
  useEffect(() => {
    if (window.google?.maps) {
      setIsScriptLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      // Script exists but might still be loading
      existingScript.addEventListener('load', () => setIsScriptLoaded(true));
      if (window.google?.maps) {
        setIsScriptLoaded(true);
      }
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&v=alpha&loading=async&libraries=maps3d`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    
    script.onerror = () => {
      setError('Failed to load Google Maps 3D');
      setIsLoading(false);
    };
    
    document.head.appendChild(script);
  }, [googleApiKey]);

  // Initialize 3D map when script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current || !coordinates) return;

    const initMap3D = async () => {
      try {
        setIsLoading(true);
        
        // Import the maps3d library
        const { Map3DElement, Polyline3DElement, Marker3DElement } = await window.google.maps.importLibrary('maps3d');
        
        const [lng, lat] = coordinates;
        
        // Create 3D map element
        const map3D = new Map3DElement({
          center: { lat, lng, altitude: 200 },
          range: 800,
          tilt: 65,
          heading: bearing
        });
        
        // Clear container and add map
        containerRef.current!.innerHTML = '';
        containerRef.current!.appendChild(map3D);
        map3DRef.current = map3D;
        
        // Wait for map to be ready
        await map3D.ready;
        
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize 3D map:', err);
        setError('3D view not available for this location');
        setIsLoading(false);
      }
    };

    initMap3D();

    return () => {
      if (orbitAnimationRef.current) {
        cancelAnimationFrame(orbitAnimationRef.current);
      }
    };
  }, [isScriptLoaded, coordinates, bearing]);

  // Update camera position when coordinates/bearing change (follow mode)
  useEffect(() => {
    if (!map3DRef.current || !coordinates || !followMode || isOrbiting) return;

    const [lng, lat] = coordinates;

    try {
      map3DRef.current.flyCameraTo({
        endCamera: {
          center: { lat, lng, altitude: 150 },
          range: 600,
          tilt: 60,
          heading: bearing
        },
        durationMillis: 1000
      });
    } catch (err) {
      console.warn('Camera animation not supported:', err);
    }
  }, [coordinates, bearing, followMode, isOrbiting]);

  // Orbit animation
  const startOrbitAnimation = useCallback(() => {
    if (!map3DRef.current || !coordinates) return;

    setIsOrbiting(true);
    const [lng, lat] = coordinates;
    
    const animate = () => {
      orbitAngleRef.current = (orbitAngleRef.current + 0.5) % 360;
      
      try {
        map3DRef.current.center = { lat, lng, altitude: 150 };
        map3DRef.current.heading = orbitAngleRef.current;
        map3DRef.current.tilt = 60;
        map3DRef.current.range = 600;
      } catch (err) {
        // Fallback if direct property setting fails
      }
      
      if (isOrbiting) {
        orbitAnimationRef.current = requestAnimationFrame(animate);
      }
    };
    
    orbitAnimationRef.current = requestAnimationFrame(animate);
  }, [coordinates, isOrbiting]);

  const stopOrbitAnimation = useCallback(() => {
    setIsOrbiting(false);
    if (orbitAnimationRef.current) {
      cancelAnimationFrame(orbitAnimationRef.current);
      orbitAnimationRef.current = null;
    }
  }, []);

  const toggleOrbit = useCallback(() => {
    if (isOrbiting) {
      stopOrbitAnimation();
    } else {
      startOrbitAnimation();
    }
  }, [isOrbiting, startOrbitAnimation, stopOrbitAnimation]);

  // Placeholder when no coordinates
  if (!coordinates) {
    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 flex items-center justify-center">
        <div className="text-center">
          <Box className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Enter location for 3D view</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-white/70">Loading 3D View...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-10">
          <div className="text-center">
            <Box className="w-10 h-10 text-destructive/50 mx-auto mb-3" />
            <p className="text-sm text-white/70">{error}</p>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute top-3 left-3 z-20 flex gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm flex items-center gap-2">
          <Box className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold tracking-wider text-white/90 uppercase">
            3D View
          </span>
        </div>
        
        {isTracking && (
          <div className="px-2 py-1.5 rounded-lg bg-red-500/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[9px] font-bold text-white tracking-wider">LIVE</span>
          </div>
        )}
        
        {/* Traffic delay badge */}
        {isTracking && trafficDelayMinutes > 0 && (
          <div className={cn(
            "px-3 py-1.5 rounded-lg flex items-center gap-2",
            trafficSeverity === 'high' 
              ? "bg-red-500/80" 
              : trafficSeverity === 'medium' 
                ? "bg-amber-500/80" 
                : "bg-emerald-500/80"
          )}>
            <Clock className="w-3 h-3 text-white" />
            <span className="text-[9px] font-bold text-white tracking-wider">
              +{trafficDelayMinutes}m delay
            </span>
          </div>
        )}
      </div>

      {/* Orbit toggle button */}
      <button
        onClick={toggleOrbit}
        className={cn(
          "absolute top-3 right-3 z-20 flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-md border transition-all duration-300",
          isOrbiting
            ? "bg-primary/90 border-primary text-primary-foreground"
            : "bg-black/60 border-white/20 text-white/80 hover:bg-black/80"
        )}
      >
        <RotateCw className={cn("w-4 h-4", isOrbiting && "animate-spin")} />
        <span className="text-xs font-semibold uppercase tracking-wider">
          {isOrbiting ? "Orbiting" : "Orbit"}
        </span>
      </button>

      {/* Coordinates display */}
      <div className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm">
        <span className="text-[9px] font-mono text-white/60">
          {coordinates[1].toFixed(4)}°, {coordinates[0].toFixed(4)}°
        </span>
      </div>

      {/* Google attribution */}
      <div className="absolute bottom-3 left-3 z-20 px-2 py-1 rounded bg-black/70 backdrop-blur-sm">
        <span className="text-[8px] text-white/50">Google 3D Maps</span>
      </div>

      {/* 3D Map container */}
      <div 
        ref={containerRef} 
        className="w-full h-full bg-slate-900"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}
