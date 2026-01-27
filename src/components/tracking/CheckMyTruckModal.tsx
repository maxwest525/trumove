import { useState, useEffect, useCallback, useRef } from "react";
import { Truck, MapPin, Navigation, Clock, Route, Video, Plane, Globe, Loader2, X, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { getCachedAerialView, setCachedAerialView } from "@/lib/aerialViewCache";

interface AerialViewData {
  type: "video" | "processing" | "not_found" | "fallback" | "error";
  videoUrl?: string;
  thumbnailUrl?: string;
  message?: string;
}

interface TruckStatus {
  bookingId: string;
  originName: string;
  destName: string;
  originCoords: [number, number];
  destCoords: [number, number];
  currentCoords: [number, number];
  progress: number;
  distanceTraveled: number;
  totalDistance: number;
  eta: string;
  status: "in_transit" | "delivered" | "pending";
  currentLocationName: string;
}

// Demo truck statuses
const DEMO_TRUCKS: Record<string, TruckStatus> = {
  "12345": {
    bookingId: "12345",
    originName: "Jacksonville, FL",
    destName: "Miami, FL",
    originCoords: [-81.6557, 30.3322],
    destCoords: [-80.1918, 25.7617],
    currentCoords: [-80.6081, 28.0601],
    progress: 52,
    distanceTraveled: 182,
    totalDistance: 350,
    eta: "4:30 PM",
    status: "in_transit",
    currentLocationName: "Near Melbourne, FL"
  },
  "67890": {
    bookingId: "67890",
    originName: "New York, NY",
    destName: "Philadelphia, PA",
    originCoords: [-74.006, 40.7128],
    destCoords: [-75.1652, 39.9526],
    currentCoords: [-74.7429, 40.2171],
    progress: 68,
    distanceTraveled: 61,
    totalDistance: 90,
    eta: "2:15 PM",
    status: "in_transit",
    currentLocationName: "Near Trenton, NJ"
  },
  "11111": {
    bookingId: "11111",
    originName: "Los Angeles, CA",
    destName: "San Francisco, CA",
    originCoords: [-118.2437, 34.0522],
    destCoords: [-122.4194, 37.7749],
    currentCoords: [-120.4358, 35.3733],
    progress: 35,
    distanceTraveled: 135,
    totalDistance: 382,
    eta: "8:00 PM",
    status: "in_transit",
    currentLocationName: "Near Bakersfield, CA"
  }
};

interface CheckMyTruckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadRoute?: (truck: TruckStatus) => void;
}

export function CheckMyTruckModal({ open, onOpenChange, onLoadRoute }: CheckMyTruckModalProps) {
  const [bookingNumber, setBookingNumber] = useState("");
  const [truckStatus, setTruckStatus] = useState<TruckStatus | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [aerialData, setAerialData] = useState<AerialViewData | null>(null);
  const [isLoadingAerial, setIsLoadingAerial] = useState(false);

  // Mapbox token for satellite fallback
  const mapboxToken = "pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g";

  // Fetch aerial view for current truck position (with caching)
  const fetchAerialView = useCallback(async (lat: number, lng: number, locationName: string) => {
    setIsLoadingAerial(true);
    
    // Check cache first
    const cached = getCachedAerialView(lat, lng);
    if (cached) {
      console.log('[CheckMyTruck] Using cached aerial data');
      setAerialData(cached as AerialViewData);
      setIsLoadingAerial(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('google-aerial-view', {
        body: { address: locationName, lat, lng }
      });

      if (error) {
        console.error('Aerial view API error:', error);
        return;
      }

      console.log('Check My Truck aerial view:', data);
      
      // Cache the response
      if (data) {
        setCachedAerialView(lat, lng, data);
      }
      
      setAerialData(data as AerialViewData);
    } catch (err) {
      console.error('Failed to fetch aerial view:', err);
    } finally {
      setIsLoadingAerial(false);
    }
  }, []);

  // Search for truck
  const handleSearch = async () => {
    if (!bookingNumber.trim()) return;
    
    setIsSearching(true);
    setNotFound(false);
    setAerialData(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const truck = DEMO_TRUCKS[bookingNumber.trim()];
    
    if (truck) {
      setTruckStatus(truck);
      // Fetch aerial view for current position
      const [lng, lat] = truck.currentCoords;
      fetchAerialView(lat, lng, truck.currentLocationName);
    } else {
      setTruckStatus(null);
      setNotFound(true);
    }
    
    setIsSearching(false);
  };

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setBookingNumber("");
      setTruckStatus(null);
      setNotFound(false);
      setAerialData(null);
    }
  }, [open]);

  // Get satellite fallback URL
  const getSatelliteUrl = (coords: [number, number]) => {
    return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${coords[0]},${coords[1]},14,0/400x250@2x?access_token=${mapboxToken}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-white/10 text-white p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-white/10">
          <DialogTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-lg font-bold">Check My Truck</span>
              <p className="text-xs text-white/50 font-normal mt-0.5">
                Enter your booking number to see live status
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Search Input */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={bookingNumber}
                onChange={(e) => setBookingNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter booking # (try 12345, 67890, 11111)"
                className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !bookingNumber.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Find"}
            </Button>
          </div>

          {/* Not Found */}
          {notFound && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white/30" />
              </div>
              <p className="text-white/60 text-sm">No shipment found with that booking number</p>
              <p className="text-white/40 text-xs mt-1">Try: 12345, 67890, or 11111</p>
            </div>
          )}

          {/* Truck Status */}
          {truckStatus && (
            <div className="space-y-4">
              {/* Aerial/Satellite View */}
              <div className="relative w-full h-[200px] rounded-xl overflow-hidden bg-slate-800 border border-white/10">
                {isLoadingAerial && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
                    src={getSatelliteUrl(truckStatus.currentCoords)}
                    alt="Truck location"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Truck marker overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <div className="absolute inset-0 -m-3 rounded-full bg-primary/30 animate-ping" />
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 border-2 border-white">
                      <Truck className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                </div>

                {/* View type badge */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm flex items-center gap-1.5">
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

                {/* Live badge */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-red-500/80 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-[10px] font-bold text-white tracking-wider">LIVE</span>
                </div>

                {/* Location name */}
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-white truncate">
                      {truckStatus.currentLocationName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50">Journey Progress</span>
                  <span className="text-sm font-bold text-primary">{truckStatus.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                    style={{ width: `${truckStatus.progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-white/40">
                  <span>{truckStatus.originName}</span>
                  <span>{truckStatus.destName}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
                  <Route className="w-4 h-4 text-primary mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{truckStatus.distanceTraveled}</div>
                  <div className="text-[10px] text-white/40">Miles Traveled</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
                  <MapPin className="w-4 h-4 text-white/50 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{truckStatus.totalDistance - truckStatus.distanceTraveled}</div>
                  <div className="text-[10px] text-white/40">Miles Left</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
                  <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{truckStatus.eta}</div>
                  <div className="text-[10px] text-white/40">Est. Arrival</div>
                </div>
              </div>

              {/* Route Summary */}
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 flex-1">
                  <Navigation className="w-4 h-4 text-primary" />
                  <span className="text-xs text-white/70 truncate">{truckStatus.originName}</span>
                </div>
                <div className="text-white/30">→</div>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="text-xs text-white/70 truncate">{truckStatus.destName}</span>
                  <MapPin className="w-4 h-4 text-white/50" />
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => {
                  onLoadRoute?.(truckStatus);
                  onOpenChange(false);
                }}
                className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold"
              >
                <Truck className="w-4 h-4 mr-2" />
                Track Full Journey
              </Button>
            </div>
          )}

          {/* Initial State */}
          {!truckStatus && !notFound && !isSearching && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-10 h-10 text-primary/60" />
              </div>
              <p className="text-white/60 text-sm mb-2">Enter your booking number above</p>
              <p className="text-white/40 text-xs">
                Demo bookings: 12345, 67890, 11111
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
