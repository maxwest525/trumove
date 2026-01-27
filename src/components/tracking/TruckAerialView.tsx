import { useState, useEffect, useMemo } from "react";
import { Truck, Loader2, Plane, MapPin, Eye, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "aerial" | "satellite" | "street";

interface TruckAerialViewProps {
  routeCoordinates: [number, number][];
  progress: number;
  isTracking: boolean;
  locationName?: string;
  googleApiKey?: string;
}

export function TruckAerialView({
  routeCoordinates,
  progress,
  isTracking,
  locationName,
  googleApiKey
}: TruckAerialViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("aerial");
  const [hasStreetViewError, setHasStreetViewError] = useState(false);

  // Calculate current truck position based on progress
  const currentPosition = useMemo(() => {
    if (!routeCoordinates.length) return null;
    
    const totalPoints = routeCoordinates.length;
    const currentIndex = Math.min(
      Math.floor((progress / 100) * (totalPoints - 1)),
      totalPoints - 1
    );
    
    return routeCoordinates[currentIndex];
  }, [routeCoordinates, progress]);

  // Reset loading state when position changes significantly
  useEffect(() => {
    if (isTracking && currentPosition) {
      setIsLoading(true);
    }
  }, [Math.floor(progress / 10), isTracking]); // Only reload every 10%

  // Mapbox satellite token
  const mapboxToken = "pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g";

  // Generate URLs for different view modes
  const getImageUrl = () => {
    if (!currentPosition) return null;
    const [lng, lat] = currentPosition;
    
    switch (viewMode) {
      case "aerial":
        // High zoom satellite for aerial effect
        return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lng},${lat},18,0/400x250@2x?access_token=${mapboxToken}`;
      case "satellite":
        // Standard satellite with labels
        return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${lng},${lat},16,0/400x250@2x?access_token=${mapboxToken}`;
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
    const modes: ViewMode[] = hasStreetViewError ? ["aerial", "satellite"] : ["aerial", "satellite", "street"];
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]);
    setIsLoading(true);
  };

  const getViewIcon = () => {
    switch (viewMode) {
      case "aerial": return <Plane className="w-3 h-3" />;
      case "satellite": return <Globe className="w-3 h-3" />;
      case "street": return <Eye className="w-3 h-3" />;
    }
  };

  const getViewLabel = () => {
    switch (viewMode) {
      case "aerial": return "Aerial";
      case "satellite": return "Satellite";
      case "street": return "Street";
    }
  };

  const imageUrl = getImageUrl();

  if (!currentPosition) {
    return (
      <div className="tracking-info-card">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
            <Plane className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
            Truck Location
          </span>
        </div>
        <div className="h-[180px] rounded-lg bg-slate-800/50 border border-white/10 flex items-center justify-center">
          <span className="text-xs text-white/40">Start tracking to see truck location</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-info-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
            <Truck className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
            Live Truck View
          </span>
          {isTracking && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        
        {/* View toggle */}
        <button
          onClick={cycleViewMode}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-[10px] text-white/60"
        >
          {getViewIcon()}
          <span>{getViewLabel()}</span>
        </button>
      </div>

      {/* Image Container */}
      <div className="relative w-full h-[180px] rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${getViewLabel()} view of truck location`}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
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
        )}

        {/* Truck marker overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 -m-2 rounded-full bg-primary/20 animate-ping" />
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 border-2 border-white">
              <Truck className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* View badge */}
        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm flex items-center gap-1.5">
          {getViewIcon()}
          <span className="text-[9px] font-bold tracking-wider text-white/90 uppercase">
            {getViewLabel()} VIEW
          </span>
        </div>

        {/* Coordinates */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm">
          <span className="text-[9px] font-mono text-white/60">
            {currentPosition[1].toFixed(4)}°, {currentPosition[0].toFixed(4)}°
          </span>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm flex items-center gap-2">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-semibold text-white/90">
            {Math.round(progress)}% Complete
          </span>
        </div>
      </div>

      {/* Location description */}
      {locationName && (
        <div className="mt-3 text-sm font-medium text-white/80 truncate">
          Near: {locationName}
        </div>
      )}
    </div>
  );
}
