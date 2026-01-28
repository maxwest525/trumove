import { useState, useCallback, useEffect, useRef } from "react";
import { MapPin, Navigation, Play, Pause, RotateCcw, Truck, Calendar, Search, Eye } from "lucide-react";
import { format } from "date-fns";
import { TruckTrackingMap } from "@/components/tracking/TruckTrackingMap";
import { UnifiedStatsCard } from "@/components/tracking/UnifiedStatsCard";
import { StreetViewPreview } from "@/components/tracking/StreetViewPreview";
import { TruckAerialView } from "@/components/tracking/TruckAerialView";
import { RouteWeather } from "@/components/tracking/RouteWeather";
import { WeighStationChecklist } from "@/components/tracking/WeighStationChecklist";
// RouteInsights removed - "Did You Know" section eliminated
import { CheckMyTruckModal, isMultiStop, isSingleStop, type TruckStatus, type MultiStopTruckStatus } from "@/components/tracking/CheckMyTruckModal";
import { MultiStopSummaryCard } from "@/components/tracking/MultiStopSummaryCard";
import { useRealtimeETA } from "@/hooks/useRealtimeETA";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MAPBOX_TOKEN } from "@/lib/mapboxToken";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logoImg from "@/assets/logo.png";

// Google Maps API key from environment
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyD8aMj_HlkLUWuYbZRU7I6oFGTavx2zKOc";

interface RouteData {
  coordinates: [number, number][];
  distance: number;
  duration: number;
}

// Checkpoint thresholds for notifications (percentage)
const CHECKPOINTS = [
  { percent: 0, label: "Pickup Complete", icon: "🚚" },
  { percent: 25, label: "25% Complete", icon: "📍" },
  { percent: 50, label: "Halfway There!", icon: "🎯" },
  { percent: 75, label: "Almost There!", icon: "🏁" },
  { percent: 100, label: "Delivered!", icon: "✅" },
];

// Geocode address string to coordinates
async function geocodeAddress(address: string): Promise<[number, number] | null> {
  if (!address || address.length < 3) return null;
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&country=US&types=address,place&limit=1`
    );
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      return data.features[0].center as [number, number];
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

// Format time for display
function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

// Format duration in hours/minutes
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function LiveTracking() {
  // Location state
  const [originAddress, setOriginAddress] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [originName, setOriginName] = useState("");
  const [destName, setDestName] = useState("");

  // Route and tracking state
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [progress, setProgress] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(60); // seconds for full journey
  const [moveDate, setMoveDate] = useState<Date>(new Date()); // Auto-populate with today
  const [departureTime] = useState(new Date());
  
  // Google Routes data
  const [googleRouteData, setGoogleRouteData] = useState<{
    trafficInfo: { delayMinutes: number; hasDelay: boolean; severity: 'low' | 'medium' | 'high' } | null;
    tollInfo: { hasTolls: boolean; estimatedPrice: string | null } | null;
    etaFormatted: string | null;
    alternateRoutes?: any[];
    isFuelEfficient?: boolean;
  }>({ trafficInfo: null, tollInfo: null, etaFormatted: null });
  
  // Check My Truck modal
  const [showCheckMyTruck, setShowCheckMyTruck] = useState(false);
  
  // Multi-stop tracking state
  const [multiStopData, setMultiStopData] = useState<MultiStopTruckStatus | null>(null);
  
  // Checkpoint notifications tracking
  const passedCheckpoints = useRef<Set<number>>(new Set());

  // Animation refs
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedProgressRef = useRef<number>(0);

  // Real-time ETA hook
  const {
    routeInfo,
    isLoading: etaLoading,
    lastUpdate,
    etaHistory,
    adjustedETA,
    adjustedDuration,
    trafficTrend,
    remainingDistance,
    refreshNow,
  } = useRealtimeETA({
    originCoords,
    destCoords,
    currentProgress: progress,
    isTracking,
    refreshIntervalMs: 60000,
  });

  // Handle origin location selection
  const handleOriginSelect = useCallback(async (city: string, zip: string, fullAddress?: string) => {
    const addressToGeocode = fullAddress || `${city}, ${zip}`;
    setOriginAddress(addressToGeocode);
    setOriginName(city || addressToGeocode);
    
    const coords = await geocodeAddress(addressToGeocode);
    setOriginCoords(coords);
  }, []);

  // Handle destination location selection
  const handleDestSelect = useCallback(async (city: string, zip: string, fullAddress?: string) => {
    const addressToGeocode = fullAddress || `${city}, ${zip}`;
    setDestAddress(addressToGeocode);
    setDestName(city || addressToGeocode);
    
    const coords = await geocodeAddress(addressToGeocode);
    setDestCoords(coords);
  }, []);

  // Handle route calculated
  const handleRouteCalculated = useCallback((route: RouteData) => {
    setRouteData(route);
    setRouteCoordinates(route.coordinates);
  }, []);

  // Fetch Google Routes data for traffic & toll info
  useEffect(() => {
    if (!originCoords || !destCoords) {
      setGoogleRouteData({ trafficInfo: null, tollInfo: null, etaFormatted: null });
      return;
    }

    const fetchGoogleRoutes = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('google-routes', {
          body: {
            origin: { lat: originCoords[1], lng: originCoords[0] },
            destination: { lat: destCoords[1], lng: destCoords[0] },
            departureTime: new Date().toISOString(),
            computeAlternatives: true,
          },
        });

        if (error || data?.fallback) {
          console.log('Google Routes fallback mode');
          return;
        }

        if (data?.success && data?.route) {
          setGoogleRouteData({
            trafficInfo: data.route.traffic,
            tollInfo: data.route.tolls,
            etaFormatted: data.route.etaFormatted,
            alternateRoutes: data.alternateRoutes || [],
            isFuelEfficient: data.route.isFuelEfficient || false,
          });
        }
      } catch (err) {
        console.error('Failed to fetch Google Routes:', err);
      }
    };

    fetchGoogleRoutes();
  }, [originCoords, destCoords]);

  // Animation loop
  useEffect(() => {
    if (!isTracking || isPaused || !routeData) return;

    const totalDuration = animationSpeed * 1000;
    
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now() - (pausedProgressRef.current / 100) * totalDuration;
    }

    const animate = () => {
      const elapsed = Date.now() - (startTimeRef.current || Date.now());
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsTracking(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTracking, isPaused, animationSpeed, routeData]);

  // Checkpoint notifications
  useEffect(() => {
    if (!isTracking) return;
    
    CHECKPOINTS.forEach((checkpoint) => {
      if (progress >= checkpoint.percent && !passedCheckpoints.current.has(checkpoint.percent)) {
        passedCheckpoints.current.add(checkpoint.percent);
        
        // Show toast notification
        toast.success(`${checkpoint.icon} ${checkpoint.label}`, {
          description: checkpoint.percent === 100 
            ? `Your shipment has arrived at ${destName || 'destination'}!`
            : `Shipment progress: ${Math.round(progress)}% of ${Math.round(routeData?.distance || 0)} miles`,
          duration: 4000,
        });
      }
    });
  }, [progress, isTracking, destName, routeData]);

  // Start tracking
  const startTracking = () => {
    if (!routeData) return;
    setIsTracking(true);
    setIsPaused(false);
    startTimeRef.current = null;
    pausedProgressRef.current = progress;
  };

  // Pause tracking
  const pauseTracking = () => {
    setIsPaused(true);
    pausedProgressRef.current = progress;
    startTimeRef.current = null;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Resume tracking
  const resumeTracking = () => {
    setIsPaused(false);
  };

  // Reset tracking
  const resetTracking = () => {
    setIsTracking(false);
    setIsPaused(false);
    setProgress(0);
    pausedProgressRef.current = 0;
    startTimeRef.current = null;
    passedCheckpoints.current = new Set(); // Reset checkpoint notifications
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Calculate derived values
  const distanceTraveled = routeData ? (progress / 100) * routeData.distance : 0;
  const totalDistance = routeData?.distance || 0;
  const remainingDuration = routeData ? routeData.duration * (1 - progress / 100) : 0;
  const etaTime = new Date(departureTime.getTime() + (routeData?.duration || 0) * 1000);

  const canTrack = !!originCoords && !!destCoords && !!routeData;

  return (
    <div className="live-tracking-page">
      {/* Site Header - White logo for tracking page */}
      <Header whiteLogo />
      
      {/* Dashboard Header */}
      <header className="tracking-header">
        <div className="flex items-center gap-3">
          <img 
            src={logoImg} 
            alt="TruMove" 
            className="h-6 brightness-0 invert"
          />
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/90">
            Shipment Command Center
          </span>
        </div>

        {/* Centered Search & Satellite Button */}
        <div className="tracking-header-controls">
          <div className="tracking-header-search">
            <Search className="w-4 h-4 text-white/70" />
            <input
              type="text"
              placeholder="Enter Booking # (try 12345)"
              className="tracking-header-input"
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value === '12345' || value === '00000') {
                    await handleOriginSelect('Jacksonville', '32207', '4520 Atlantic Blvd, Jacksonville, FL 32207');
                    await handleDestSelect('Miami Beach', '33139', '1000 Ocean Dr, Miami Beach, FL 33139');
                    setMoveDate(new Date());
                    toast.success('📦 Booking loaded!', { description: 'Jacksonville → Miami' });
                  } else if (value) {
                    toast.error('Booking not found', { description: 'Try #12345 or #00000' });
                  }
                }
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="tracking-header-go-btn"
              onClick={async () => {
                await handleOriginSelect('Jacksonville', '32207', '4520 Atlantic Blvd, Jacksonville, FL 32207');
                await handleDestSelect('Miami Beach', '33139', '1000 Ocean Dr, Miami Beach, FL 33139');
                setMoveDate(new Date());
                toast.success('📦 Demo booking loaded!');
              }}
            >
              Go
            </Button>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => setShowCheckMyTruck(true)}
            className="tracking-header-satellite-btn"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Locate via Satellite</span>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden lg:block">
            <div className="text-[11px] text-white/80 uppercase tracking-wider">Shipment ID</div>
            <div className="text-sm font-mono text-white">TM-2026-{String(Date.now()).slice(-8)}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="tracking-content">
        {/* Left: Address Inputs + Street Views */}
        <div className="tracking-sidebar">
          <div className="tracking-info-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Route Setup</h3>
            
            {/* Origin Input */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/70">
                  Origin
                </span>
              </div>
              <LocationAutocomplete
                value={originAddress}
                onValueChange={setOriginAddress}
                onLocationSelect={handleOriginSelect}
                placeholder="Enter pickup address..."
                mode="address"
                className="tracking-input"
              />
              {/* Compact Street View Preview - Origin */}
              <div className="mt-2">
                <StreetViewPreview
                  coordinates={originCoords}
                  label="Origin"
                  locationName={originName}
                  variant="origin"
                  googleApiKey={GOOGLE_MAPS_API_KEY}
                  compact
                />
              </div>
            </div>

            {/* Destination Input */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-3.5 h-3.5 text-foreground/60" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/70">
                  Destination
                </span>
              </div>
              <LocationAutocomplete
                value={destAddress}
                onValueChange={setDestAddress}
                onLocationSelect={handleDestSelect}
                placeholder="Enter delivery address..."
                mode="address"
                className="tracking-input"
              />
              {/* Compact Street View Preview - Destination */}
              <div className="mt-2">
                <StreetViewPreview
                  coordinates={destCoords}
                  label="Destination"
                  locationName={destName}
                  variant="destination"
                  googleApiKey={GOOGLE_MAPS_API_KEY}
                  compact
                />
              </div>
            </div>

            {/* Move Date */}
            <div className="mb-4 pt-3 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-3.5 h-3.5 text-foreground/60" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/70">
                  Move Date
                </span>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal tracking-input",
                      !moveDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {moveDate ? format(moveDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={moveDate}
                    onSelect={(date) => date && setMoveDate(date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>


            {/* Control Buttons */}
            <div className="flex gap-2">
              {!isTracking ? (
                <Button
                  onClick={startTracking}
                  disabled={!canTrack}
                  className="flex-1 bg-foreground hover:bg-foreground/90 text-background font-semibold"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {progress > 0 ? "Resume" : "Start"} Tracking
                </Button>
              ) : (
                <>
                  <Button
                    onClick={isPaused ? resumeTracking : pauseTracking}
                    variant="outline"
                    className="flex-1"
                  >
                    {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                  <Button
                    onClick={resetTracking}
                    variant="outline"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Center: Map */}
        <div className="tracking-map-container">
          <TruckTrackingMap
            originCoords={originCoords}
            destCoords={destCoords}
            progress={progress}
            isTracking={isTracking}
            onRouteCalculated={handleRouteCalculated}
          />
        </div>

        {/* Right: Dashboard */}
        <div className="tracking-dashboard">
          {/* Multi-Stop Summary Card - Show when multi-stop data present */}
          {multiStopData && (
            <MultiStopSummaryCard
              stops={multiStopData.stops}
              currentStopIndex={multiStopData.currentStopIndex}
              totalDistance={multiStopData.totalDistance}
              remainingDuration={formatDuration(multiStopData.estimatedDuration * (1 - multiStopData.progress / 100))}
            />
          )}

          {/* Unified Stats Card - Always visible, shows empty state before route */}
          <UnifiedStatsCard
            progress={routeData ? progress : 0}
            distanceTraveled={routeData ? distanceTraveled : 0}
            totalDistance={routeData ? totalDistance : 0}
            timeRemaining={routeData ? formatDuration(remainingDuration) : '--'}
            adjustedETA={routeData ? adjustedETA : null}
            adjustedDuration={routeData ? adjustedDuration : null}
            remainingDistance={routeData ? remainingDistance : 0}
            trafficSeverity={routeInfo?.traffic?.severity || googleRouteData.trafficInfo?.severity || 'low'}
            trafficDelay={routeInfo?.traffic?.delayMinutes || googleRouteData.trafficInfo?.delayMinutes || 0}
            trafficTrend={trafficTrend}
            tollInfo={googleRouteData.tollInfo}
            isFuelEfficient={googleRouteData.isFuelEfficient}
            alternateRoutes={googleRouteData.alternateRoutes}
            lastUpdate={lastUpdate}
            isLoading={etaLoading}
            onRefresh={refreshNow}
            isEmpty={!routeData}
          />

          {/* Live Truck Aerial View - Shows origin before tracking, then live updates */}
          <TruckAerialView
            routeCoordinates={routeCoordinates}
            progress={progress}
            isTracking={isTracking}
            originCoords={originCoords}
            googleApiKey={GOOGLE_MAPS_API_KEY}
          />

          {/* Weigh Station Checklist */}
          <WeighStationChecklist
            routeCoordinates={routeCoordinates}
            progress={progress}
            isTracking={isTracking}
          />

          {/* Route Weather - Sidebar Card */}
          <RouteWeather
            originCoords={originCoords}
            destCoords={destCoords}
            originName={originName}
            destName={destName}
          />

        </div>
      </div>
      
      {/* Check My Truck Modal */}
      <CheckMyTruckModal
        open={showCheckMyTruck}
        onOpenChange={setShowCheckMyTruck}
        onLoadRoute={(truck) => {
          // Handle based on truck type
          if (isSingleStop(truck)) {
            // Load the single-stop truck's route into the main tracking view
            handleOriginSelect(truck.originName, '', truck.originName);
            handleDestSelect(truck.destName, '', truck.destName);
            setMoveDate(new Date());
            setMultiStopData(null);
            toast.success(`📦 Booking #${truck.bookingId} loaded!`, {
              description: `${truck.originName} → ${truck.destName}`,
            });
          }
        }}
        onLoadMultiStop={(truck) => {
          // Load multi-stop data
          setMultiStopData(truck);
          // Set origin/dest from first pickup and last dropoff
          const firstPickup = truck.stops.find(s => s.type === 'pickup');
          const lastDropoff = [...truck.stops].reverse().find(s => s.type === 'dropoff');
          if (firstPickup) {
            handleOriginSelect(firstPickup.address.split(',')[0], '', firstPickup.address);
          }
          if (lastDropoff) {
            handleDestSelect(lastDropoff.address.split(',')[0], '', lastDropoff.address);
          }
          setMoveDate(new Date());
          toast.success(`📦 Multi-Stop Booking #${truck.bookingId} loaded!`, {
            description: `${truck.stops.length} stops • ${truck.totalDistance} miles`,
          });
        }}
      />
      
      {/* Site Footer */}
      <Footer />
    </div>
  );
}
