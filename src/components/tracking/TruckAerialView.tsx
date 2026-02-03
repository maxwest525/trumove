import { useState, useEffect, useMemo, useRef } from "react";
import { Truck, Loader2, MapPin, Eye, Navigation, Maximize2, Minimize2, X, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface TruckAerialViewProps {
  routeCoordinates: [number, number][];
  progress: number;
  isTracking: boolean;
  originCoords?: [number, number] | null;
  locationName?: string;
  googleApiKey?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

type PreviewSize = 'default';

const SIZE_CONFIGS: Record<PreviewSize, { height: number; label: string }> = {
  default: { height: 180, label: 'Default' },
};

export function TruckAerialView({
  routeCoordinates,
  progress,
  isTracking,
  originCoords,
  locationName,
  googleApiKey,
  expanded = false,
  onToggleExpand
}: TruckAerialViewProps) {
  const [previewSize, setPreviewSize] = useState<PreviewSize>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [hasStreetViewError, setHasStreetViewError] = useState(false);
  const [imageTransition, setImageTransition] = useState(false);

  // Track last fetched coordinates to prevent duplicate loads
  const lastProgressBucket = useRef<number>(-1);
  const prevTrackingState = useRef<boolean>(isTracking);

  // Reset state when tracking state changes
  useEffect(() => {
    if (prevTrackingState.current !== isTracking) {
      console.log('[TruckAerial] Tracking state changed, resetting...');
      lastProgressBucket.current = -1;
      prevTrackingState.current = isTracking;
    }
  }, [isTracking]);

  // Calculate current position - use route progress when tracking, origin when idle
  const currentPosition = useMemo(() => {
    // If tracking and we have route coordinates, interpolate along route
    if (isTracking && routeCoordinates.length > 0) {
      const totalPoints = routeCoordinates.length;
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

  // Trigger transition when progress changes significantly (every 10%)
  useEffect(() => {
    if (!currentPosition || !isTracking) return;
    
    const progressBucket = Math.floor(progress / 10);
    
    if (progressBucket === lastProgressBucket.current) {
      return;
    }
    lastProgressBucket.current = progressBucket;
    
    // Trigger transition animation
    setImageTransition(true);
    setIsLoading(true);
    
    setTimeout(() => setImageTransition(false), 300);
  }, [currentPosition, isTracking, progress]);

  // Get Street View URL
  const getStreetViewUrl = () => {
    if (!currentPosition || !googleApiKey) return null;
    const [lng, lat] = currentPosition;
    return `https://maps.googleapis.com/maps/api/streetview?size=800x500&location=${lat},${lng}&fov=100&heading=0&pitch=5&key=${googleApiKey}`;
  };

  // Get interactive Street View embed URL (for expanded view)
  const getInteractiveStreetViewUrl = () => {
    if (!currentPosition || !googleApiKey) return null;
    const [lng, lat] = currentPosition;
    return `https://www.google.com/maps/embed/v1/streetview?key=${googleApiKey}&location=${lat},${lng}&heading=0&pitch=0&fov=90`;
  };

  const streetViewUrl = getStreetViewUrl();

  // Show placeholder structure when no position available - same size as active state with skeleton
  if (!currentPosition) {
    return (
      <div className="tracking-info-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
              <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
              Location Preview
            </span>
          </div>
          <button
            disabled
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-semibold border bg-muted/50 text-muted-foreground border-border cursor-not-allowed opacity-50"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fullscreen</span>
          </button>
        </div>
        <div 
          className="relative w-full rounded-lg overflow-hidden border border-border"
          style={{ height: SIZE_CONFIGS['default'].height }}
        >
          {/* Skeleton with subtle animation */}
          <Skeleton className="absolute inset-0 w-full h-full" />
          
          {/* Overlay content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center z-10">
              <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center mx-auto mb-2 animate-pulse">
                <MapPin className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Enter origin to see location</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine display state - always show "Live Location" when paused
  const isShowingOrigin = !isTracking || progress === 0;
  const headerLabel = "Live Location";
  const headerIcon = isTracking && progress > 0 ? Truck : Navigation;
  const HeaderIcon = headerIcon;

  return (
    <div className={cn(
      "tracking-info-card transition-all duration-300",
      expanded && "fixed inset-[15%] z-50 bg-background/95 backdrop-blur-sm rounded-xl border border-border shadow-2xl"
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
            <HeaderIcon className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
              {headerLabel}
            </span>
            {isTracking && progress > 0 && (
              <span className="text-[9px] text-muted-foreground/70 flex items-center gap-1">
                <Pause className="w-2.5 h-2.5" />
                Pause to view
              </span>
            )}
          </div>
          {isTracking && progress > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-destructive/20 text-destructive text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        
        {/* Controls row - only fullscreen toggle */}
        <div className="flex items-center gap-1.5">
          {/* Expand/Remote View Button */}
          <button
            onClick={onToggleExpand}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all text-[10px] font-semibold border",
              expanded 
                ? "bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/30" 
                : "bg-background/80 hover:bg-muted text-foreground border-border"
            )}
          >
            {expanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Interactive Street View */}
      {expanded ? (
        <div className="flex flex-col h-[calc(100%-3rem)]">
          
          <div className="relative flex-1 rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50 border border-border">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            
            {/* Interactive Street View iframe */}
            <iframe
              src={getInteractiveStreetViewUrl() || ''}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />

            {/* View badge */}
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm flex items-center gap-1.5 z-20">
              <Eye className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-bold tracking-wider text-white/90 uppercase">
                Interactive Street View
              </span>
            </div>

            {/* Coordinates */}
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm z-20">
              <span className="text-[9px] font-mono text-white/60">
                {currentPosition[1].toFixed(4)}°, {currentPosition[0].toFixed(4)}°
              </span>
            </div>

          </div>

          {/* Location info footer */}
          {locationName && (
            <div className="mt-3 text-sm font-medium text-foreground/80 truncate">
              Near: {locationName}
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-2">
            Drag to look around • Use scroll to zoom
          </p>
        </div>
      ) : (
        <>
          {/* Collapsed Static Street View Image - Dynamic Height */}
          <div 
            className="relative w-full rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50 border border-border transition-all duration-300"
            style={{ height: SIZE_CONFIGS[previewSize].height }}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
            
            {hasStreetViewError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-background">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-primary/40 mx-auto mb-2" />
                  <span className="text-xs text-white/60">{locationName || 'Location preview'}</span>
                  <span className="block text-[9px] text-white/40 mt-1 font-mono">
                    {currentPosition ? `${currentPosition[1].toFixed(3)}°, ${currentPosition[0].toFixed(3)}°` : ''}
                  </span>
                </div>
              </div>
            ) : streetViewUrl ? (
              <img
                src={streetViewUrl}
                alt={`Street view of ${isShowingOrigin ? 'origin' : 'truck'} location`}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100",
                  imageTransition && "opacity-50"
                )}
                onLoad={() => {
                  setIsLoading(false);
                  setHasStreetViewError(false);
                }}
                onError={() => {
                  setIsLoading(false);
                  setHasStreetViewError(true);
                }}
              />
            ) : null}


            {/* View badge */}
            <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-bold tracking-wider text-white/90 uppercase">
                Street View
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

          </div>

          {/* Location description */}
          {locationName && (
            <div className="mt-3 text-sm font-medium text-foreground/80 truncate">
              Near: {locationName}
            </div>
          )}
        </>
      )}
    </div>
  );
}
