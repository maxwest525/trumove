import { useState } from "react";
import { MapPin, Navigation, Loader2, Eye, EyeOff, Globe } from "lucide-react";

interface StreetViewPreviewProps {
  coordinates: [number, number] | null;
  label: string;
  locationName: string;
  time?: string;
  timeLabel?: string;
  variant?: "origin" | "destination";
  googleApiKey: string;
}

export function StreetViewPreview({
  coordinates,
  label,
  locationName,
  time,
  timeLabel,
  variant = "origin",
  googleApiKey
}: StreetViewPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showStreetView, setShowStreetView] = useState(true);

  // Google Street View Static API URL
  const streetViewUrl = coordinates && googleApiKey
    ? `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${coordinates[1]},${coordinates[0]}&fov=90&heading=0&pitch=10&key=${googleApiKey}`
    : null;

  // Fallback to Mapbox satellite
  const satelliteUrl = coordinates
    ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${coordinates[0]},${coordinates[1]},17,0/300x200@2x?access_token=pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g`
    : null;

  const Icon = variant === "origin" ? Navigation : MapPin;

  const handleStreetViewError = () => {
    setIsLoading(false);
    setHasError(true);
    setShowStreetView(false);
  };

  return (
    <div className="tracking-info-card tracking-street-view-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
            variant === "origin" 
              ? "bg-primary/20 text-primary" 
              : "bg-white/10 text-white"
          }`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
            {label}
          </span>
        </div>
        
        {/* Toggle between Street View and Satellite */}
        {coordinates && !hasError && (
          <button
            onClick={() => setShowStreetView(!showStreetView)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-[10px] text-white/60"
          >
            {showStreetView ? (
              <>
                <Eye className="w-3 h-3" />
                <span>Street</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3" />
                <span>Satellite</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Image Container */}
      <div className="relative w-full h-[140px] rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10">
        {coordinates ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 z-10">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            )}
            
            {showStreetView && streetViewUrl && !hasError ? (
              <img
                src={streetViewUrl}
                alt={`Street view of ${locationName}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsLoading(false)}
                onError={handleStreetViewError}
              />
            ) : satelliteUrl ? (
              <img
                src={satelliteUrl}
                alt={`Satellite view of ${locationName}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
              />
            ) : null}

            {/* Street View badge */}
            {showStreetView && !hasError && !isLoading && (
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-[9px] font-semibold text-white/80 tracking-wider">
                STREET VIEW
              </div>
            )}
          </>
        ) : (
          /* Placeholder - Globe/US Map view before address entered */
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
