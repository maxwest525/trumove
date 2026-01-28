import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Truck, Loader2, Plane, MapPin, Eye, Globe, Video, Navigation, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { getCachedAerialView, setCachedAerialView } from "@/lib/aerialViewCache";

type ViewMode = "aerial" | "satellite" | "street" | "video" | "3d";

interface AerialViewData {
  type: "video" | "tile" | "fallback";
  videoUrl?: string;
  thumbnailUrl?: string;
  tileUrl?: string;
  session?: string;
}

interface TruckAerialViewProps {
  routeCoordinates: [number, number][];
  progress: number;
  isTracking: boolean;
  originCoords?: [number, number] | null;
  locationName?: string;
  googleApiKey?: string;
}

export function TruckAerialView({
  routeCoordinates,
  progress,
  isTracking,
  originCoords,
  locationName,
  googleApiKey
}: TruckAerialViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("aerial");
  const [hasStreetViewError, setHasStreetViewError] = useState(false);
  const [aerialData, setAerialData] = useState<AerialViewData | null>(null);
  const [hasAerialVideo, setHasAerialVideo] = useState(false);
  const [imageTransition, setImageTransition] = useState(false);

  // Track last fetched coordinates to prevent duplicate calls
  const lastFetchedCoords = useRef<string | null>(null);
  const lastProgressBucket = useRef<number>(-1);
  const fetchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTrackingState = useRef<boolean>(isTracking);

  // Reset state when tracking state changes (fixes bucket not resetting between sessions)
  useEffect(() => {
    if (prevTrackingState.current !== isTracking) {
      console.log('[TruckAerial] Tracking state changed, resetting...');
      lastProgressBucket.current = -1;
      lastFetchedCoords.current = null;
      prevTrackingState.current = isTracking;
    }
  }, [isTracking]);

  // Calculate current position - use route progress when tracking, origin when idle
  const currentPosition = useMemo(() => {
    // If tracking and we have route coordinates, interpolate along route
    if (isTracking && routeCoordinates.length > 0) {
      const totalPoints = routeCoordinates.length;
      // Interpolate between points for smoother position
      const exactIndex = (progress / 100) * (totalPoints - 1);
      const lowerIndex = Math.floor(exactIndex);
      const upperIndex = Math.min(lowerIndex + 1, totalPoints - 1);
      const fraction = exactIndex - lowerIndex;
      
      const lowerPoint = routeCoordinates[lowerIndex];
      const upperPoint = routeCoordinates[upperIndex];
      
      // Linear interpolation between points
      const lng = lowerPoint[0] + (upperPoint[0] - lowerPoint[0]) * fraction;
      const lat = lowerPoint[1] + (upperPoint[1] - lowerPoint[1]) * fraction;
      
      return [lng, lat] as [number, number];
    }
    
    // If we have route coordinates but not tracking, show the first point (origin on route)
    if (routeCoordinates.length > 0) {
      return routeCoordinates[0];
    }
    
    // Fallback to origin coords if provided
    if (originCoords) {
      return originCoords;
    }
    
    return null;
  }, [routeCoordinates, progress, isTracking, originCoords]);

  // Fetch aerial view data from Google API with caching
  const fetchAerialView = useCallback(async (lat: number, lng: number) => {
    // Use 3 decimal places (~100m precision) for better cache hits
    const coordKey = `${lat.toFixed(3)}_${lng.toFixed(3)}`;
    
    // Skip if we just fetched this location
    if (lastFetchedCoords.current === coordKey) {
      console.log('[TruckAerial] Skipping duplicate fetch for', coordKey);
      return null;
    }
    
    // Check cache first
    const cached = getCachedAerialView(lat, lng);
    if (cached) {
      console.log('[TruckAerial] Using cached data for', coordKey);
      return cached as AerialViewData;
    }
    
    try {
      lastFetchedCoords.current = coordKey;
      
      const { data, error } = await supabase.functions.invoke('google-aerial-view', {
        body: { lat, lng, zoom: 18 }
      });

      if (error) {
        console.error('Aerial view API error:', error);
        return null;
      }

      console.log('Aerial view response:', data);
      
      // Cache the response
      if (data) {
        setCachedAerialView(lat, lng, data);
      }
      
      return data as AerialViewData;
    } catch (err) {
      console.error('Failed to fetch aerial view:', err);
      return null;
    }
  }, []);

  // Initial fetch when coordinates first become available
  useEffect(() => {
    if (currentPosition && !lastFetchedCoords.current) {
      const [lng, lat] = currentPosition;
      console.log('[TruckAerial] Initial fetch for:', lat, lng);
      setIsLoading(true);
      fetchAerialView(lat, lng).then(data => {
        if (data) {
          setAerialData(data);
          setHasAerialVideo(data.type === 'video');
          if (data.type === 'video') {
            setViewMode('video');
          }
        }
        setIsLoading(false);
      });
    }
  }, [currentPosition, fetchAerialView]);

  // Fetch aerial data - for tracking every 10% progress
  useEffect(() => {
    if (!currentPosition || !isTracking) return;
    
    const [lng, lat] = currentPosition;
    const progressBucket = Math.floor(progress / 10);
    
    // Only update every 10% progress
    if (progressBucket === lastProgressBucket.current) {
      return; // Skip - same bucket
    }
    lastProgressBucket.current = progressBucket;
    
    // Clear any pending fetch
    if (fetchDebounceRef.current) {
      clearTimeout(fetchDebounceRef.current);
    }
    
    // Trigger transition animation
    setImageTransition(true);
    setIsLoading(true);
    
    // Debounce the fetch
    fetchDebounceRef.current = setTimeout(() => {
      fetchAerialView(lat, lng).then(data => {
        if (data) {
          setAerialData(data);
          setHasAerialVideo(data.type === 'video');
          if (data.type === 'video') {
            setViewMode('video');
          }
        }
        setIsLoading(false);
        // Reset transition after image loads
        setTimeout(() => setImageTransition(false), 300);
      });
    }, 300);
    
    return () => {
      if (fetchDebounceRef.current) {
        clearTimeout(fetchDebounceRef.current);
      }
    };
  }, [currentPosition, isTracking, progress, fetchAerialView]);

  // Generate URLs for different view modes - NOW USING GOOGLE APIs
  const getImageUrl = () => {
    if (!currentPosition) return null;
    const [lng, lat] = currentPosition;
    
    switch (viewMode) {
      case "video":
        // Return thumbnail for video mode (video plays separately)
        return aerialData?.thumbnailUrl || null;
      case "aerial":
        // Use Google tile if available from API
        if (aerialData?.tileUrl) {
          return aerialData.tileUrl;
        }
        // Fallback to Google Static Maps satellite (replacing Mapbox)
        return googleApiKey
          ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=800x500&maptype=satellite&key=${googleApiKey}`
          : null;
      case "satellite":
        // Google Static Maps hybrid (satellite with labels) - replacing Mapbox
        return googleApiKey
          ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=800x500&maptype=hybrid&key=${googleApiKey}`
          : null;
      case "3d":
        // Google 3D-like view with tilt (using static maps with zoom for now)
        return googleApiKey
          ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=19&size=800x500&maptype=satellite&key=${googleApiKey}`
          : null;
      case "street":
        // Google Street View
        return googleApiKey
          ? `https://maps.googleapis.com/maps/api/streetview?size=800x500&location=${lat},${lng}&fov=100&heading=0&pitch=5&key=${googleApiKey}`
          : null;
      default:
        return null;
    }
  };

  const cycleViewMode = () => {
    const baseModes: ViewMode[] = ["aerial", "satellite", "3d"];
    if (hasAerialVideo) baseModes.unshift("video");
    if (!hasStreetViewError) baseModes.push("street");
    
    const currentIndex = baseModes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % baseModes.length;
    setViewMode(baseModes[nextIndex]);
    setIsLoading(true);
  };

  const getViewIcon = () => {
    switch (viewMode) {
      case "video": return <Video className="w-3 h-3" />;
      case "aerial": return <Plane className="w-3 h-3" />;
      case "satellite": return <Globe className="w-3 h-3" />;
      case "3d": return <Box className="w-3 h-3" />;
      case "street": return <Eye className="w-3 h-3" />;
    }
  };

  const getViewLabel = () => {
    switch (viewMode) {
      case "video": return "Flyover";
      case "aerial": return "Aerial";
      case "satellite": return "Hybrid";
      case "3d": return "3D";
      case "street": return "Street";
    }
  };

  const imageUrl = getImageUrl();

  // Show placeholder when no position available
  if (!currentPosition) {
    return (
      <div className="tracking-info-card">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
            <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            Location Preview
          </span>
        </div>
        <div className="h-[180px] rounded-lg bg-muted/50 border border-border flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Enter origin to see location</span>
        </div>
      </div>
    );
  }

  // Determine display state
  const isShowingOrigin = !isTracking || progress === 0;
  const headerLabel = isShowingOrigin ? "Origin Location" : "Live Truck View";
  const headerIcon = isShowingOrigin ? Navigation : Truck;
  const HeaderIcon = headerIcon;

  return (
    <div className="tracking-info-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
            <HeaderIcon className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            {headerLabel}
          </span>
          {isTracking && progress > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/20 text-red-600 text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        
        {/* View toggle */}
        <button
          onClick={cycleViewMode}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors text-[10px] text-muted-foreground"
        >
          {getViewIcon()}
          <span>{getViewLabel()}</span>
        </button>
      </div>

      {/* Image/Video Container with smooth transitions */}
      <div className="relative w-full h-[180px] rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50 border border-border">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        
        {/* Video mode - show video player */}
        {viewMode === "video" && aerialData?.videoUrl ? (
          <video
            src={aerialData.videoUrl}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setViewMode("aerial");
            }}
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={`${getViewLabel()} view of ${isShowingOrigin ? 'origin' : 'truck'} location`}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100",
              imageTransition && "opacity-50"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              if (viewMode === "street") {
                setHasStreetViewError(true);
                setViewMode("aerial");
              }
            }}
          />
        ) : null}

        {/* Marker overlay - different for origin vs tracking */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            {isTracking && progress > 0 ? (
              <>
                <div className="absolute inset-0 -m-2 rounded-full bg-primary/20 animate-ping" />
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 border-2 border-white">
                  <Truck className="w-5 h-5 text-primary-foreground" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 -m-1 rounded-full bg-green-500/30 animate-pulse" />
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg border-2 border-white">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* View badge */}
        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm flex items-center gap-1.5">
          {getViewIcon()}
          <span className="text-[9px] font-bold tracking-wider text-white/90 uppercase">
            {getViewLabel()} VIEW
          </span>
        </div>

        {/* Google attribution badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm flex items-center gap-1">
          <span className="text-[8px] font-medium text-white/60">
            Google Maps
          </span>
        </div>

        {/* Coordinates */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm">
          <span className="text-[9px] font-mono text-white/60">
            {currentPosition[1].toFixed(4)}°, {currentPosition[0].toFixed(4)}°
          </span>
        </div>

        {/* Progress indicator - only when tracking */}
        {isTracking && progress > 0 && (
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm flex items-center gap-2">
            <MapPin className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-white/90">
              {Math.round(progress)}% Complete
            </span>
          </div>
        )}
        
        {/* Origin label when not tracking */}
        {isShowingOrigin && (
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-green-500/90 backdrop-blur-sm flex items-center gap-2">
            <Navigation className="w-3 h-3 text-white" />
            <span className="text-[10px] font-semibold text-white">
              Pickup Location
            </span>
          </div>
        )}
      </div>

      {/* Location description */}
      {locationName && (
        <div className="mt-3 text-sm font-medium text-foreground/80 truncate">
          Near: {locationName}
        </div>
      )}
    </div>
  );
}
