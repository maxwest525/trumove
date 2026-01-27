import { useState, useEffect, useCallback } from "react";
import { Truck, Video, Globe, MapPin, Loader2, X, Maximize2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCachedAerialView, setCachedAerialView } from "@/lib/aerialViewCache";

interface AerialViewData {
  type: "video" | "processing" | "not_found" | "fallback" | "error";
  videoUrl?: string;
  thumbnailUrl?: string;
  message?: string;
}

interface TruckLocationPopupProps {
  coordinates: [number, number];
  locationName?: string;
  onClose: () => void;
  isOpen: boolean;
}

const mapboxToken = "pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g";

export function TruckLocationPopup({ coordinates, locationName, onClose, isOpen }: TruckLocationPopupProps) {
  const [aerialData, setAerialData] = useState<AerialViewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fetchAerialView = useCallback(async () => {
    if (!coordinates) return;
    
    const [lng, lat] = coordinates;
    setIsLoading(true);
    
    // Check cache first
    const cached = getCachedAerialView(lat, lng);
    if (cached) {
      setAerialData(cached as AerialViewData);
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('google-aerial-view', {
        body: { lat, lng, address: locationName || `${lat},${lng}` }
      });

      if (error) {
        console.error('Aerial view API error:', error);
        setAerialData({ type: 'fallback' });
        return;
      }
      
      // Cache the response
      if (data) {
        setCachedAerialView(lat, lng, data);
      }
      
      setAerialData(data as AerialViewData);
    } catch (err) {
      console.error('Failed to fetch aerial view:', err);
      setAerialData({ type: 'fallback' });
    } finally {
      setIsLoading(false);
    }
  }, [coordinates, locationName]);

  useEffect(() => {
    if (isOpen && coordinates) {
      fetchAerialView();
    }
  }, [isOpen, coordinates, fetchAerialView]);

  if (!isOpen) return null;

  const getSatelliteUrl = () => {
    return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${coordinates[0]},${coordinates[1]},15,0/${isFullscreen ? '800x500' : '320x200'}@2x?access_token=${mapboxToken}`;
  };

  return (
    <>
      {/* Overlay for fullscreen */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm"
          onClick={() => setIsFullscreen(false)}
        />
      )}
      
      <div 
        className={`
          ${isFullscreen 
            ? 'fixed inset-4 z-[70] max-w-4xl mx-auto my-auto h-fit' 
            : 'absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50'
          }
          bg-slate-900/95 border border-white/20 rounded-xl overflow-hidden shadow-2xl
          backdrop-blur-md
        `}
        style={!isFullscreen ? { width: '340px' } : undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Truck className="w-3 h-3 text-primary" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white">Live Location</span>
              {locationName && (
                <p className="text-[10px] text-white/50 truncate max-w-[180px]">{locationName}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-white/60" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white/60" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`relative ${isFullscreen ? 'h-[500px]' : 'h-[200px]'}`}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {/* Video or Satellite Image */}
          {aerialData?.type === 'video' && aerialData.videoUrl ? (
            <video
              src={aerialData.videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={getSatelliteUrl()}
              alt="Truck location"
              className="w-full h-full object-cover"
            />
          )}

          {/* Truck marker overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              <div className="absolute inset-0 -m-2 rounded-full bg-primary/30 animate-ping" />
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 border-2 border-white">
                <Truck className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* View type badge */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm flex items-center gap-1.5">
            {aerialData?.type === 'video' ? (
              <>
                <Video className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-bold tracking-wider text-white/90 uppercase">Flyover</span>
              </>
            ) : (
              <>
                <Globe className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-bold tracking-wider text-white/90 uppercase">Satellite</span>
              </>
            )}
          </div>

          {/* Coordinates */}
          <div className="absolute bottom-2 left-2 right-2 px-2 py-1.5 rounded-md bg-black/70 backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="text-[10px] text-white/80 font-mono">
                {coordinates[1].toFixed(4)}°N, {Math.abs(coordinates[0]).toFixed(4)}°W
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
