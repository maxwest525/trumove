import { useState, useCallback, useEffect, useRef } from "react";
import { MapPin, Navigation, Play, Pause, RotateCcw, Truck, Zap, Calendar, FileText, Bell, Globe, Search, Eye } from "lucide-react";
import { format } from "date-fns";
import { TruckTrackingMap } from "@/components/tracking/TruckTrackingMap";
import { TrackingDashboard } from "@/components/tracking/TrackingDashboard";
import { TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import { StreetViewPreview } from "@/components/tracking/StreetViewPreview";
import { TruckAerialView } from "@/components/tracking/TruckAerialView";
import { RouteWeather } from "@/components/tracking/RouteWeather";
import { WeighStationChecklist } from "@/components/tracking/WeighStationChecklist";
import { RouteInsights } from "@/components/tracking/RouteInsights";
import { TrafficInsights } from "@/components/tracking/TrafficInsights";
import { RealtimeETACard } from "@/components/tracking/RealtimeETACard";
import { CheckMyTruckModal } from "@/components/tracking/CheckMyTruckModal";
import { useRealtimeETA } from "@/hooks/useRealtimeETA";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import SiteShell from "@/components/layout/SiteShell";
import FloatingNav from "@/components/FloatingNav";
import { MAPBOX_TOKEN } from "@/lib/mapboxToken";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
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

// Wrapper component to use the real-time ETA hook
function RealtimeETACardWrapper({
  originCoords,
  destCoords,
  progress,
  isTracking,
}: {
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
  progress: number;
  isTracking: boolean;
}) {
  const {
    routeInfo,
    isLoading,
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
    refreshIntervalMs: 60000, // Refresh every 60 seconds
  });

  if (!originCoords || !destCoords) return null;

  return (
    <RealtimeETACard
      adjustedETA={adjustedETA}
      adjustedDuration={adjustedDuration}
      remainingDistance={remainingDistance}
      trafficTrend={trafficTrend}
      trafficSeverity={routeInfo?.traffic?.severity || 'low'}
      trafficDelay={routeInfo?.traffic?.delayMinutes || 0}
      etaHistory={etaHistory}
      lastUpdate={lastUpdate}
      isLoading={isLoading}
      onRefresh={refreshNow}
    />
  );
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
  }>({ trafficInfo: null, tollInfo: null, etaFormatted: null });
  
  // Shipment notes
  const [shipmentNotes, setShipmentNotes] = useState("");
  
  // Check My Truck modal
  const [showCheckMyTruck, setShowCheckMyTruck] = useState(false);
  
  // Checkpoint notifications tracking
  const passedCheckpoints = useRef<Set<number>>(new Set());

  // Animation refs
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedProgressRef = useRef<number>(0);

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
      {/* Header */}
      <header className="tracking-header">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="TruMove" className="h-8 w-auto brightness-0 invert" />
          <span className="text-white/30">|</span>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">
            Shipment Tracking
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Check My Truck Button */}
          <Button
            onClick={() => setShowCheckMyTruck(true)}
            variant="outline"
            size="sm"
            className="border-primary/50 text-primary hover:bg-primary/10 gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Check My Truck</span>
          </Button>
          
          {isTracking && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Zap className="w-4 h-4 text-primary" />
              <span>Demo Mode</span>
            </div>
          )}
          
          <div className="text-right">
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Shipment ID</div>
            <div className="text-sm font-mono text-white/80">TM-2026-{String(Date.now()).slice(-8)}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="tracking-content">
        {/* Left: Address Inputs */}
        <div className="tracking-sidebar">
          {/* Demo Booking Lookup */}
          <div className="tracking-info-card mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
                Booking Lookup
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter booking #..."
                className="flex-1 h-9 px-3 bg-white/5 border border-white/10 rounded-md text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value === '12345') {
                      // Demo booking - auto-fill addresses
                      await handleOriginSelect('Jacksonville', '32207', '4520 Atlantic Blvd, Jacksonville, FL 32207');
                      await handleDestSelect('Miami', '33131', '100 Biscayne Blvd, Miami, FL 33131');
                      setMoveDate(new Date());
                      toast.success('📦 Booking #12345 loaded!', {
                        description: 'Demo move: Jacksonville → Miami',
                      });
                    } else if (value) {
                      toast.error('Booking not found', {
                        description: 'Try demo booking #12345',
                      });
                    }
                  }
                }}
              />
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 font-semibold"
                onClick={() => {
                  // Auto-fill demo booking
                  handleOriginSelect('Jacksonville', '32207', '4520 Atlantic Blvd, Jacksonville, FL 32207');
                  handleDestSelect('Miami', '33131', '100 Biscayne Blvd, Miami, FL 33131');
                  setMoveDate(new Date());
                  toast.success('📦 Demo booking loaded!', {
                    description: 'Move: Jacksonville → Miami',
                  });
                }}
              >
                <Search className="w-3.5 h-3.5 mr-1.5" />
                Search
              </Button>
            </div>
          </div>

          <div className="tracking-info-card">
            <h3 className="text-sm font-semibold text-white mb-4">Route Setup</h3>
            
            {/* Origin Input */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
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
            </div>

            {/* Destination Input */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-3.5 h-3.5 text-white/50" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
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
            </div>

            {/* Move Date */}
            <div className="mb-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-3.5 h-3.5 text-white/50" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
                  Move Date
                </span>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10",
                      !moveDate && "text-white/50"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {moveDate ? format(moveDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black/90 border-white/20" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={moveDate}
                    onSelect={(date) => date && setMoveDate(date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto text-white")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Shipment Notes */}
            <div className="mb-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-3.5 h-3.5 text-white/50" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
                  Shipment Notes
                </span>
              </div>
              <Textarea
                value={shipmentNotes}
                onChange={(e) => setShipmentNotes(e.target.value)}
                placeholder="Special instructions, delivery notes, access codes..."
                className="min-h-[80px] bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm resize-none"
              />
              {shipmentNotes && (
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-primary">
                  <Bell className="w-3 h-3" />
                  <span>Notes saved to shipment</span>
                </div>
              )}
            </div>

            {/* Speed Control */}
            {routeData && (
              <div className="mb-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
                    Demo Speed
                  </span>
                  <span className="text-xs text-white/60">{animationSpeed}s</span>
                </div>
                <Slider
                  value={[animationSpeed]}
                  onValueChange={([val]) => setAnimationSpeed(val)}
                  min={15}
                  max={120}
                  step={5}
                  className="tracking-slider"
                  disabled={isTracking}
                />
              </div>
            )}

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
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                  <Button
                    onClick={resetTracking}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Route Info */}
          {routeData && (
            <div className="tracking-info-card mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
                  Route Info
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Distance</span>
                  <span className="text-white font-medium">{Math.round(routeData.distance)} miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Est. Duration</span>
                  <span className="text-white font-medium">{formatDuration(routeData.duration)}</span>
                </div>
              </div>
            </div>
          )}
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
          <StreetViewPreview
            coordinates={originCoords}
            label="Origin"
            locationName={originName}
            time={formatTime(departureTime)}
            timeLabel="Departed"
            variant="origin"
            googleApiKey={GOOGLE_MAPS_API_KEY}
          />

          {routeData && (
            <TrackingDashboard
              progress={progress}
              distanceTraveled={distanceTraveled}
              totalDistance={totalDistance}
              timeRemaining={formatDuration(remainingDuration)}
              trafficInfo={googleRouteData.trafficInfo}
              tollInfo={googleRouteData.tollInfo}
              etaFormatted={googleRouteData.etaFormatted}
            />
          )}

          {/* Real-Time ETA with Traffic Adjustments */}
          <RealtimeETACardWrapper
            originCoords={originCoords}
            destCoords={destCoords}
            progress={progress}
            isTracking={isTracking}
          />

          {/* Traffic Insights - Google Routes */}
          <TrafficInsights
            originCoords={originCoords}
            destCoords={destCoords}
          />

          {/* Live Truck Aerial View */}
          {isTracking && routeCoordinates.length > 0 && (
            <TruckAerialView
              routeCoordinates={routeCoordinates}
              progress={progress}
              isTracking={isTracking}
              googleApiKey={GOOGLE_MAPS_API_KEY}
            />
          )}

          {/* Weigh Station Checklist */}
          <WeighStationChecklist
            routeCoordinates={routeCoordinates}
            progress={progress}
            isTracking={isTracking}
          />

          <StreetViewPreview
            coordinates={destCoords}
            label="Destination"
            locationName={destName}
            time={formatTime(etaTime)}
            timeLabel="ETA"
            variant="destination"
            googleApiKey={GOOGLE_MAPS_API_KEY}
          />

          {/* Route Insights - "Did You Know?" */}
          <RouteInsights
            originCoords={originCoords}
            destCoords={destCoords}
            originName={originName}
            destName={destName}
          />
        </div>

        {/* Weather Strip */}
        <RouteWeather
          originCoords={originCoords}
          destCoords={destCoords}
          originName={originName}
          destName={destName}
        />
      </div>

      {/* Bottom Timeline */}
      {routeData && (
        <div className="tracking-timeline-container">
          <TrackingTimeline
            progress={progress}
            originName={originName}
            destName={destName}
            departureTime={formatTime(departureTime)}
            etaTime={formatTime(etaTime)}
          />
        </div>
      )}
      
      {/* Check My Truck Modal */}
      <CheckMyTruckModal
        open={showCheckMyTruck}
        onOpenChange={setShowCheckMyTruck}
        onLoadRoute={(truck) => {
          // Load the truck's route into the main tracking view
          handleOriginSelect(truck.originName, '', truck.originName);
          handleDestSelect(truck.destName, '', truck.destName);
          setMoveDate(new Date());
          toast.success(`📦 Booking #${truck.bookingId} loaded!`, {
            description: `${truck.originName} → ${truck.destName}`,
          });
        }}
      />
    </div>
  );
}
