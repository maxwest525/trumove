import { useState, useCallback, useEffect, useRef } from "react";
import { MapPin, Navigation, Play, Pause, RotateCcw, Truck, Calendar, Search, Box, AlertTriangle, ChevronDown, ChevronRight, ChevronLeft, Map, Layers, Globe, Navigation2, Sparkles, Scale, Route, Crosshair } from "lucide-react";
import { format } from "date-fns";
import { TruckTrackingMap } from "@/components/tracking/TruckTrackingMap";
import { Google3DTrackingView } from "@/components/tracking/Google3DTrackingView";
import { Google2DTrackingMap } from "@/components/tracking/Google2DTrackingMap";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GoogleStaticRouteMap } from "@/components/tracking/GoogleStaticRouteMap";
import { RouteComparisonPanel, type RouteOption } from "@/components/tracking/RouteComparisonPanel";
import { UnifiedStatsCard } from "@/components/tracking/UnifiedStatsCard";
import { StreetViewPreview } from "@/components/tracking/StreetViewPreview";
import { TruckAerialView } from "@/components/tracking/TruckAerialView";
import { RouteWeather } from "@/components/tracking/RouteWeather";
import { WeighStationChecklist } from "@/components/tracking/WeighStationChecklist";
import { type MultiStopTruckStatus } from "@/components/tracking/CheckMyTruckModal";
import { MultiStopSummaryCard } from "@/components/tracking/MultiStopSummaryCard";
import { useRealtimeETA } from "@/hooks/useRealtimeETA";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MAPBOX_TOKEN } from "@/lib/mapboxToken";
import { getWebGLDiagnostics, type WebGLDiagnostics } from "@/lib/webglDiagnostics";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getQuickFuelEstimate } from "@/lib/fuelCostCalculator";
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
  const [isDemoMode, setIsDemoMode] = useState(false); // Demo mode uses fast playback, regular mode is real-time
  const [moveDate, setMoveDate] = useState<Date>(new Date()); // Auto-populate with today
  const [departureTime] = useState(new Date());
  
  // Booking number input state (controlled)
  const [bookingInput, setBookingInput] = useState("");
  
  // Resume booking state
  const [savedBooking, setSavedBooking] = useState<{
    originAddress: string;
    destAddress: string;
    originCoords: [number, number];
    destCoords: [number, number];
    originName: string;
    destName: string;
    timestamp: number;
  } | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  
  // Google Routes data
  const [googleRouteData, setGoogleRouteData] = useState<{
    trafficInfo: { delayMinutes: number; hasDelay: boolean; severity: 'low' | 'medium' | 'high' } | null;
    tollInfo: { hasTolls: boolean; estimatedPrice: string | null } | null;
    etaFormatted: string | null;
    alternateRoutes?: any[];
    isFuelEfficient?: boolean;
    polyline?: string;
  }>({ trafficInfo: null, tollInfo: null, etaFormatted: null });
  
  // Street View expanded state (replaces Check My Truck modal)
  const [streetViewExpanded, setStreetViewExpanded] = useState(false);
  
  // Multi-stop tracking state
  const [multiStopData, setMultiStopData] = useState<MultiStopTruckStatus | null>(null);
  
  // Follow mode state - default to true for better UX
  const [followMode, setFollowMode] = useState(true);
  
  // 3D view mode toggle - default to false (2D satellite is primary)
  const [show3DView, setShow3DView] = useState(false);
  
  // Map view type for 2D maps (satellite, hybrid, roadmap)
  const [mapViewType, setMapViewType] = useState<'satellite' | 'hybrid' | 'roadmap'>('hybrid');
  
  // WebGL diagnostics and fallback state
  const [webglDiagnostics, setWebglDiagnostics] = useState<WebGLDiagnostics | null>(null);
  const [useStaticMap, setUseStaticMap] = useState(false);
  
  // Route comparison state
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [routeComparisonExpanded, setRouteComparisonExpanded] = useState(true);
  
  // Current truck bearing for 3D view
  const [truckBearing, setTruckBearing] = useState(0);
  
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

  // Check WebGL capabilities on mount and set appropriate view mode
  useEffect(() => {
    const diagnostics = getWebGLDiagnostics();
    setWebglDiagnostics(diagnostics);
    
    if (!diagnostics.supported || diagnostics.recommendation === 'static') {
      // WebGL not available or software rendering - use static map
      setUseStaticMap(true);
      setShow3DView(false);
      console.log('WebGL diagnostics: Using static map fallback', diagnostics);
    } else {
      // WebGL supported - default to 2D satellite view (not 3D)
      setShow3DView(false);
      setFollowMode(true);
      console.log('WebGL diagnostics: 2D satellite view enabled by default', diagnostics);
    }
  }, []);

  // Check for saved booking on mount
  useEffect(() => {
    const saved = localStorage.getItem('trumove_last_tracking');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only show prompt if booking is less than 24 hours old
        const isRecent = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;
        if (isRecent) {
          setSavedBooking(parsed);
          setShowResumePrompt(true);
        } else {
          localStorage.removeItem('trumove_last_tracking');
        }
      } catch (e) {
        localStorage.removeItem('trumove_last_tracking');
      }
    }
  }, []);

  // Save booking when tracking starts
  useEffect(() => {
    if (isTracking && originCoords && destCoords && originName && destName) {
      const bookingData = {
        originAddress,
        destAddress,
        originCoords,
        destCoords,
        originName,
        destName,
        timestamp: Date.now(),
      };
      localStorage.setItem('trumove_last_tracking', JSON.stringify(bookingData));
    }
  }, [isTracking, originCoords, destCoords, originAddress, destAddress, originName, destName]);

  // Handle resume booking
  const handleResumeBooking = () => {
    if (savedBooking) {
      setOriginAddress(savedBooking.originAddress);
      setDestAddress(savedBooking.destAddress);
      setOriginCoords(savedBooking.originCoords);
      setDestCoords(savedBooking.destCoords);
      setOriginName(savedBooking.originName);
      setDestName(savedBooking.destName);
      setShowResumePrompt(false);
      toast.success('📍 Previous route restored!');
    }
  };

  const handleDismissResume = () => {
    setShowResumePrompt(false);
    localStorage.removeItem('trumove_last_tracking');
  };

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
          // Still set basic routeData for static map fallback
          if (useStaticMap && !routeData) {
            // Calculate approximate distance and duration
            const latDiff = destCoords[1] - originCoords[1];
            const lngDiff = destCoords[0] - originCoords[0];
            const approxDistanceMiles = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 69;
            const approxDurationSeconds = approxDistanceMiles * 60; // ~1 min per mile
            
            setRouteData({
              coordinates: [originCoords, destCoords],
              distance: approxDistanceMiles,
              duration: approxDurationSeconds,
            });
            setRouteCoordinates([originCoords, destCoords]);
          }
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
          
          // Also set routeData for static map mode
          if (useStaticMap && !routeData && data.route.distanceMeters && data.route.durationSeconds) {
            setRouteData({
              coordinates: [originCoords, destCoords],
              distance: data.route.distanceMeters / 1609.34, // meters to miles
              duration: data.route.durationSeconds,
            });
            setRouteCoordinates([originCoords, destCoords]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch Google Routes:', err);
        
        // Fallback for static map mode
        if (useStaticMap && !routeData) {
          const latDiff = destCoords[1] - originCoords[1];
          const lngDiff = destCoords[0] - originCoords[0];
          const approxDistanceMiles = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 69;
          const approxDurationSeconds = approxDistanceMiles * 60;
          
          setRouteData({
            coordinates: [originCoords, destCoords],
            distance: approxDistanceMiles,
            duration: approxDurationSeconds,
          });
          setRouteCoordinates([originCoords, destCoords]);
        }
      }
    };

    fetchGoogleRoutes();
  }, [originCoords, destCoords, useStaticMap, routeData]);

  // Set animation speed - ALWAYS real-time based on actual route duration
  useEffect(() => {
    if (routeData) {
      // Real-time mode: Animation matches actual route duration
      // Route duration is in seconds, so truck moves at real-world speed
      // Both demo and production use the same real-time speed
      setAnimationSpeed(routeData.duration);
    }
  }, [routeData]);

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

  // Calculate current truck position for 3D view
  const currentTruckPosition = (() => {
    if (routeCoordinates.length < 2) return originCoords;
    const totalPoints = routeCoordinates.length;
    const exactIndex = (progress / 100) * (totalPoints - 1);
    const lowerIndex = Math.floor(exactIndex);
    const upperIndex = Math.min(lowerIndex + 1, totalPoints - 1);
    const fraction = exactIndex - lowerIndex;
    
    const lowerPoint = routeCoordinates[lowerIndex];
    const upperPoint = routeCoordinates[upperIndex];
    
    const lng = lowerPoint[0] + (upperPoint[0] - lowerPoint[0]) * fraction;
    const lat = lowerPoint[1] + (upperPoint[1] - lowerPoint[1]) * fraction;
    
    return [lng, lat] as [number, number];
  })();

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
              value={bookingInput}
              onChange={(e) => setBookingInput(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  const value = bookingInput.trim();
                if (value === '12345' || value === '00000') {
                    await handleOriginSelect('Jacksonville', '32207', '4520 Atlantic Blvd, Jacksonville, FL 32207');
                    await handleDestSelect('Miami Beach', '33139', '1000 Ocean Dr, Miami Beach, FL 33139');
                    setMoveDate(new Date());
                    // Default to 2D satellite view with follow mode for demos
                    setShow3DView(false);
                    setFollowMode(true);
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
                const value = bookingInput.trim() || '12345';
                await handleOriginSelect('Jacksonville', '32207', '4520 Atlantic Blvd, Jacksonville, FL 32207');
                await handleDestSelect('Miami Beach', '33139', '1000 Ocean Dr, Miami Beach, FL 33139');
                setMoveDate(new Date());
                // Default to 2D satellite view with follow mode for demos
                setShow3DView(false);
                setFollowMode(true);
                setBookingInput(value);
                toast.success('📦 Booking loaded!');
              }}
            >
              Go
            </Button>
            
            {/* Demo Button - Smaller, subtle outline style */}
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                // Set booking input to 12345
                setBookingInput('12345');
                await handleOriginSelect('Jacksonville', '32207', '4520 Atlantic Blvd, Jacksonville, FL 32207');
                await handleDestSelect('Miami Beach', '33139', '1000 Ocean Dr, Miami Beach, FL 33139');
                setMoveDate(new Date());
                setShow3DView(false);
                setFollowMode(true);
                setIsDemoMode(true);
                // Real-time speed will be set automatically when routeData loads
                // Auto-start tracking after a brief delay
                setTimeout(() => {
                  if (canTrack) startTracking();
                }, 1500);
                toast.success('🚚 Demo mode started!', {
                  description: 'Jacksonville → Miami Beach • Real-time tracking'
                });
              }}
              className="tracking-header-demo-btn"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline text-[11px]">Demo</span>
            </Button>
          </div>
          
          {/* Map view is fixed to hybrid - no user toggle */}
          
          {/* Recenter Button - Centers map back on truck */}
          {routeData && (
            <Button
              variant="ghost"
              onClick={() => setFollowMode(true)}
              className="tracking-header-satellite-btn"
              title="Center map on truck"
            >
              <Crosshair className="w-4 h-4" />
              <span className="hidden sm:inline">Recenter</span>
            </Button>
          )}
          
          {/* Follow Mode Toggle - Header version with distinct active/inactive states */}
          {routeData && (
            <Button
              variant="ghost"
              onClick={() => setFollowMode(!followMode)}
              className={cn(
                "tracking-header-satellite-btn",
                followMode ? "tracking-follow-active" : "tracking-follow-inactive"
              )}
            >
              <Navigation2 className={cn(
                "w-4 h-4 transition-all",
                followMode && "text-primary animate-pulse"
              )} />
              <span className="hidden sm:inline">
                {followMode ? "Following" : "Follow"}
              </span>
            </Button>
          )}
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

            {/* Playback Speed Control - Hidden for production appearance */}
          </div>

        </div>

        {/* Center: Map - Auto-select based on WebGL capabilities */}
        <div className="tracking-map-container">
          {/* WebGL warning banner when using static fallback */}
          {useStaticMap && webglDiagnostics && webglDiagnostics.warnings.length > 0 && (
            <div className="absolute top-0 left-0 right-0 z-30 bg-destructive text-destructive-foreground px-4 py-2 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{webglDiagnostics.warnings[0]}</span>
            </div>
          )}
          
          {useStaticMap ? (
            <GoogleStaticRouteMap
              originCoords={originCoords}
              destCoords={destCoords}
              progress={progress}
              isTracking={isTracking}
              googleApiKey={GOOGLE_MAPS_API_KEY}
              routePolyline={googleRouteData.polyline}
              truckPosition={currentTruckPosition}
              originName={originName}
              destName={destName}
            />
          ) : show3DView ? (
            <Google3DTrackingView
              coordinates={currentTruckPosition}
              bearing={truckBearing}
              isTracking={isTracking}
              followMode={followMode}
              googleApiKey={GOOGLE_MAPS_API_KEY}
              trafficSeverity={routeInfo?.traffic?.severity || googleRouteData.trafficInfo?.severity || 'low'}
              trafficDelayMinutes={routeInfo?.traffic?.delayMinutes || googleRouteData.trafficInfo?.delayMinutes || 0}
            />
          ) : (
            <Google2DTrackingMap
              originCoords={originCoords}
              destCoords={destCoords}
              progress={progress}
              isTracking={isTracking}
              onRouteCalculated={handleRouteCalculated}
              followMode={followMode}
              onFollowModeChange={setFollowMode}
              mapType={mapViewType}
              googleApiKey={GOOGLE_MAPS_API_KEY}
            />
          )}
        </div>

        {/* Right: Dashboard - Collapsible until route is active */}
        <div className={cn(
          "tracking-dashboard transition-all duration-300",
          !routeData && "tracking-dashboard-collapsed"
        )}>
          {!routeData ? (
            /* Collapsed State - Before route is entered */
            <div className="tracking-sidebar-collapsed">
              <ChevronLeft className="w-5 h-5 text-foreground/40" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-foreground/40 [writing-mode:vertical-lr] rotate-180">
                Stats
              </span>
            </div>
          ) : (
            /* Expanded State - Route is active */
            <>
              {/* Multi-Stop Summary Card - Show when multi-stop data present */}
              {multiStopData && (
                <MultiStopSummaryCard
                  stops={multiStopData.stops}
                  currentStopIndex={multiStopData.currentStopIndex}
                  totalDistance={multiStopData.totalDistance}
                  remainingDuration={formatDuration(multiStopData.estimatedDuration * (1 - multiStopData.progress / 100))}
                />
              )}

              {/* Unified Stats Card - Shows live data */}
              <UnifiedStatsCard
                progress={progress}
                distanceTraveled={distanceTraveled}
                totalDistance={totalDistance}
                timeRemaining={formatDuration(remainingDuration)}
                adjustedETA={adjustedETA}
                adjustedDuration={adjustedDuration}
                remainingDistance={remainingDistance}
                trafficSeverity={routeInfo?.traffic?.severity || googleRouteData.trafficInfo?.severity || 'low'}
                trafficDelay={routeInfo?.traffic?.delayMinutes || googleRouteData.trafficInfo?.delayMinutes || 0}
                trafficTrend={trafficTrend}
                tollInfo={googleRouteData.tollInfo}
                isFuelEfficient={googleRouteData.isFuelEfficient}
                fuelCostEstimate={getQuickFuelEstimate(totalDistance)}
                lastUpdate={lastUpdate}
                isLoading={etaLoading}
                onRefresh={refreshNow}
                isEmpty={false}
              />

              {/* Live Truck Street View */}
              <TruckAerialView
                routeCoordinates={routeCoordinates}
                progress={progress}
                isTracking={isTracking}
                originCoords={originCoords}
                googleApiKey={GOOGLE_MAPS_API_KEY}
                expanded={streetViewExpanded}
                onToggleExpand={() => setStreetViewExpanded(!streetViewExpanded)}
              />

              {/* Route Weather - Sidebar Card */}
              <RouteWeather
                originCoords={originCoords}
                destCoords={destCoords}
                originName={originName}
                destName={destName}
              />

              {/* Route Info - Collapsible Sections (Bottom of sidebar) */}
              <div className="tracking-info-card space-y-2">
                {/* Alternate Routes - Collapsible */}
                {googleRouteData.alternateRoutes && googleRouteData.alternateRoutes.length > 0 && (
                  <Collapsible defaultOpen={false}>
                    <CollapsibleTrigger className="w-full flex items-center justify-between py-2 text-sm hover:text-foreground transition-colors group">
                      <div className="flex items-center gap-2">
                        <Route className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60">
                          Alternate Routes ({googleRouteData.alternateRoutes.length})
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 pt-2">
                      {googleRouteData.alternateRoutes.slice(0, 2).map((alt: any, i: number) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-muted/50 border border-border"
                        >
                          <div className="text-sm font-semibold text-foreground mb-1">
                            {alt.description || `Via alternate ${i + 1}`}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-foreground/70">
                            <span>{alt.distanceMiles} mi</span>
                            <span>•</span>
                            <span>{alt.durationFormatted}</span>
                            {alt.isTollFree && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-500 font-medium">No tolls</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Weigh Stations - Collapsible */}
                <Collapsible defaultOpen={false}>
                  <CollapsibleTrigger className="w-full flex items-center justify-between py-2 text-sm hover:text-foreground transition-colors group border-t border-border pt-3">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground/60">
                        Weigh Stations
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <WeighStationChecklist
                      routeCoordinates={routeCoordinates}
                      progress={progress}
                      isTracking={isTracking}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </>
          )}
        </div>
      </div>
      
      
      {/* Site Footer */}
      <Footer />
    </div>
  );
}
