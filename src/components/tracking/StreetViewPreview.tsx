import { useState, useEffect, useCallback } from "react";
import { MapPin, Navigation, Loader2, Eye, Plane, Globe, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type ViewMode = "street" | "satellite" | "aerial" | "video";

interface AerialViewData {
  type: "video" | "processing" | "not_found" | "fallback" | "error";
  videoUrl?: string;
  thumbnailUrl?: string;
  message?: string;
}

interface StreetViewPreviewProps {
  coordinates: [number, number] | null;
  label: string;
  locationName: string;
  time?: string;
  timeLabel?: string;
  variant?: "origin" | "destination";
  googleApiKey: string;
  compact?: boolean;
}

export function StreetViewPreview({
  coordinates,
  label,
  locationName,
  time,
  timeLabel,
  variant = "origin",
  googleApiKey,
  compact = false,
}: StreetViewPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("street");
  const [aerialData, setAerialData] = useState<AerialViewData | null>(null);
  const [hasAerialVideo, setHasAerialVideo] = useState(false);

  // Fetch aerial view data from Google API
  const fetchAerialView = useCallback(async (lat: number, lng: number) => {
    try {
      // Use full address for better aerial view matching
      const address = locationName || `${lat},${lng}`;
      
      const { data, error } = await supabase.functions.invoke('google-aerial-view', {
        body: { address, lat, lng }
      });

      if (error) {
        console.error('Aerial view API error:', error);
        return null;
      }

      console.log('Aerial view response for', label, ':', data);
      return data as AerialViewData;
    } catch (err) {
      console.error('Failed to fetch aerial view:', err);
      return null;
    }
  }, [locationName, label]);

  // Fetch aerial data when coordinates are set
  useEffect(() => {
    if (coordinates) {
      const [lng, lat] = coordinates;
      fetchAerialView(lat, lng).then(data => {
        if (data) {
          setAerialData(data);
          setHasAerialVideo(data.type === 'video' && !!data.videoUrl);
        }
      });
    }
  }, [coordinates, fetchAerialView]);

  // Google Street View Static API URL
  const streetViewUrl = coordinates && googleApiKey
    ? `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${coordinates[1]},${coordinates[0]}&fov=90&heading=0&pitch=10&key=${googleApiKey}`
    : null;

  // Mapbox satellite view
  const satelliteUrl = coordinates
    ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${coordinates[0]},${coordinates[1]},17,0/300x200@2x?access_token=pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g`
    : null;

  // Aerial view (high zoom satellite for bird's eye effect)
  const aerialUrl = coordinates
    ? `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${coordinates[0]},${coordinates[1]},19,0/300x200@2x?access_token=pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g`
    : null;

  const Icon = variant === "origin" ? Navigation : MapPin;

  const handleStreetViewError = () => {
    setIsLoading(false);
    setHasError(true);
    setViewMode("satellite");
  };

  const getCurrentUrl = () => {
    switch (viewMode) {
      case "video":
        return aerialData?.thumbnailUrl || satelliteUrl;
      case "street":
        return hasError ? satelliteUrl : streetViewUrl;
      case "satellite":
        return satelliteUrl;
      case "aerial":
        return aerialUrl;
      default:
        return satelliteUrl;
    }
  };

  const cycleViewMode = () => {
    const modes: ViewMode[] = [];
    if (hasAerialVideo) modes.push("video");
    if (!hasError) modes.push("street");
    modes.push("satellite", "aerial");
    
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]);
    setIsLoading(true);
  };

  const getViewLabel = () => {
    switch (viewMode) {
      case "video": return "Flyover";
      case "street": return "Street";
      case "satellite": return "Satellite";
      case "aerial": return "Aerial";
    }
  };

  const getViewIcon = () => {
    switch (viewMode) {
      case "video": return <Video className="w-3 h-3" />;
      case "street": return <Eye className="w-3 h-3" />;
      case "satellite": return <Globe className="w-3 h-3" />;
      case "aerial": return <Plane className="w-3 h-3" />;
    }
  };

  // Compact variant for sidebar integration
  if (compact) {
    return (
      <div className="street-view-compact">
        {/* Compact Image Container */}
        <div className="relative w-full h-[100px] rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10">
          {coordinates ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/5 z-10">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              )}
              
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
                    setViewMode("street");
                  }}
                />
              ) : (
                <img
                  src={getCurrentUrl() || ""}
                  alt={`${getViewLabel()} view of ${locationName}`}
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={() => setIsLoading(false)}
                  onError={viewMode === "street" ? handleStreetViewError : () => setIsLoading(false)}
                />
              )}

              {/* View toggle button - compact */}
              <button
                onClick={cycleViewMode}
                className="absolute top-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 hover:bg-black/80 transition-colors text-[8px] text-white/70"
              >
                {getViewIcon()}
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700/50 to-slate-800/50">
              <Globe className="w-5 h-5 text-primary/40" />
            </div>
          )}
        </div>

        {/* Location Name - below image */}
        <div className="text-[11px] font-medium text-white/70 truncate mt-1.5 px-0.5">
          {locationName || `Awaiting ${variant}...`}
        </div>
      </div>
    );
  }

  // Full variant (original)
  return (
    <div className="tracking-info-card tracking-street-view-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-6 h-6 rounded-md flex items-center justify-center",
            variant === "origin" 
              ? "bg-primary/20 text-primary" 
              : "bg-white/10 text-white"
          )}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
            {label}
          </span>
        </div>
        
        {/* Toggle between views */}
        {coordinates && (
          <button
            onClick={cycleViewMode}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-[10px] text-white/60"
          >
            {getViewIcon()}
            <span>{getViewLabel()}</span>
          </button>
        )}
      </div>

      {/* Image/Video Container */}
      <div className="relative w-full h-[140px] rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10">
        {coordinates ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 z-10">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
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
                  setViewMode("street");
                }}
              />
            ) : (
              <img
                src={getCurrentUrl() || ""}
                alt={`${getViewLabel()} view of ${locationName}`}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  isLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setIsLoading(false)}
                onError={viewMode === "street" ? handleStreetViewError : () => setIsLoading(false)}
              />
            )}

            {/* View badge */}
            {!isLoading && (
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur-sm flex items-center gap-1">
                {getViewIcon()}
                <span className="text-[9px] font-semibold text-white/80 tracking-wider uppercase">
                  {getViewLabel()} VIEW
                </span>
              </div>
            )}
            
            {/* Video indicator */}
            {viewMode === "video" && hasAerialVideo && !isLoading && (
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-red-500/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[8px] font-bold text-white tracking-wider">LIVE</span>
              </div>
            )}
          </>
        ) : (
          /* Placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-700/50 to-slate-800/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary/60" />
            </div>
            <span className="text-xs text-white/40 text-center px-4">
              Enter {variant} address to preview
            </span>
          </div>
        )}
      </div>

      {/* Location Name */}
      <div className="text-sm font-semibold text-white truncate mt-3">
        {locationName || `Awaiting ${variant}...`}
      </div>

      {/* Time */}
      {time && (
        <div className="text-xs text-white/50 mt-1">
          {timeLabel}: {time}
        </div>
      )}
    </div>
  );
}
