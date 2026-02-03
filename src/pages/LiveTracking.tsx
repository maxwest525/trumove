import { useState, useCallback, useEffect, useRef } from "react";
import { MapPin, Navigation, Play, Pause, RotateCcw, Truck, Calendar, Box, AlertTriangle, ChevronDown, ChevronRight, ChevronLeft, ChevronUp, Map, Layers, Globe, Navigation2, Sparkles, Scale, Route, Crosshair, ShieldCheck, Cloud } from "lucide-react";
import { format } from "date-fns";
import { TruckTrackingMap } from "@/components/tracking/TruckTrackingMap";
// Google3DTrackingView removed - unreliable
import { Google2DTrackingMap } from "@/components/tracking/Google2DTrackingMap";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GoogleStaticRouteMap } from "@/components/tracking/GoogleStaticRouteMap";
import { RouteComparisonPanel, type RouteOption } from "@/components/tracking/RouteComparisonPanel";
import { UnifiedStatsCard } from "@/components/tracking/UnifiedStatsCard";
import { StreetViewPreview } from "@/components/tracking/StreetViewPreview";
import { TruckAerialView } from "@/components/tracking/TruckAerialView";
import { RouteWeather } from "@/components/tracking/RouteWeather";
import { CompactRouteWeather } from "@/components/tracking/CompactRouteWeather";
import { WeighStationChecklist } from "@/components/tracking/WeighStationChecklist";
import { type MultiStopTruckStatus } from "@/components/tracking/CheckMyTruckModal";
import { MultiStopSummaryCard } from "@/components/tracking/MultiStopSummaryCard";
import { RouteSetupModal } from "@/components/tracking/RouteSetupModal";
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
// Individual collapsible section component for below-map panels
function IndividualCollapsibleSection({ 
  title, 
  icon, 
  children, 
  storageKey,
  defaultOpen = true 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  storageKey: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem(`collapsible-${storageKey}`);
    return stored !== null ? stored === 'true' : defaultOpen;
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    localStorage.setItem(`collapsible-${storageKey}`, String(open));
  };

  return (
    <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
      <div className="tracking-below-map-section" data-state={isOpen ? 'open' : 'closed'}>
        <CollapsibleTrigger className="tracking-below-map-section-trigger">
          <div className="tracking-section-title">
            {icon}
            <span>{title}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 tracking-section-chevron" />
        </CollapsibleTrigger>
        <CollapsibleContent className="tracking-below-map-section-content">
          {children}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

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
  
  // 3D view mode toggle - default to false (2D satellite is primary, 3D is unreliable)
  const [show3DView, setShow3DView] = useState(false);
  
  // Map view type for 2D maps (satellite, hybrid, roadmap)
  const [mapViewType, setMapViewType] = useState<'satellite' | 'hybrid' | 'roadmap'>('hybrid');
  
  // WebGL diagnostics and fallback state
  const [webglDiagnostics, setWebglDiagnostics] = useState<WebGLDiagnostics | null>(null);
  const [useStaticMap, setUseStaticMap] = useState(false);
  
  // Below-map panel collapsed state
  const [belowMapCollapsed, setBelowMapCollapsed] = useState(false);
  
  // Route comparison state
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [routeComparisonExpanded, setRouteComparisonExpanded] = useState(true);
  
  // Current truck bearing for 3D view
  const [truckBearing, setTruckBearing] = useState(0);
  
  // Route setup modal state
  const [showRouteModal, setShowRouteModal] = useState(true);
  
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
      // WebGL supported - default to 2D satellite view (3D is unreliable)
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
    
    // Check for pending route from cross-page navigation
    const pendingRoute = localStorage.getItem('trumove_pending_route');
    if (pendingRoute) {
      try {
        const data = JSON.parse(pendingRoute);
        if (data.originAddress && data.destAddress) {
          setShowRouteModal(false); // Skip modal since we have route data
          // Geocode and populate
          if (data.originAddress) {
            handleOriginSelect('', '', data.originAddress);
          }
          if (data.destAddress) {
            handleDestSelect('', '', data.destAddress);
          }
          localStorage.removeItem('trumove_pending_route');
          toast.success('📍 Route loaded from estimate!');
        }
      } catch (e) {
        console.error('Failed to parse pending route:', e);
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
    if (!routeCoordinates || routeCoordinates.length < 2) return originCoords;
    const totalPoints = routeCoordinates.length;
    const exactIndex = (progress / 100) * (totalPoints - 1);
    const lowerIndex = Math.max(0, Math.min(Math.floor(exactIndex), totalPoints - 1));
    const upperIndex = Math.max(0, Math.min(lowerIndex + 1, totalPoints - 1));
    const fraction = exactIndex - lowerIndex;
    
    const lowerPoint = routeCoordinates[lowerIndex];
    const upperPoint = routeCoordinates[upperIndex];
    
    // Safety check - ensure points exist before accessing properties
    if (!lowerPoint || !upperPoint) return originCoords;
    
    const lng = lowerPoint[0] + (upperPoint[0] - lowerPoint[0]) * fraction;
    const lat = lowerPoint[1] + (upperPoint[1] - lowerPoint[1]) * fraction;
    
    return [lng, lat] as [number, number];
  })();

  const canTrack = !!originCoords && !!destCoords && !!routeData;

  // Handle route modal submit
  const handleRouteModalSubmit = async (data: {
    originAddress: string;
    destAddress: string;
    moveDate?: Date;
    bookingNumber?: string;
  }) => {
    await handleOriginSelect('', '', data.originAddress);
    await handleDestSelect('', '', data.destAddress);
    if (data.moveDate) {
      setMoveDate(data.moveDate);
    }
    setShowRouteModal(false);
    toast.success('📍 Route configured!');
  };

  // Handle demo button click
  const handleDemoClick = () => {
    setBookingInput('12345');
    setIsDemoMode(true);
    // Pre-populate Jacksonville to Miami demo route
    handleOriginSelect('Jacksonville', '', 'Jacksonville, FL 32202');
    handleDestSelect('Miami', '', 'Miami, FL 33101');
    toast.success('🚚 Demo mode activated - Jacksonville to Miami');
  };

  // Handle booking search
  const handleBookingSearch = () => {
    if (!bookingInput.trim()) {
      toast.error('Please enter a booking ID');
      return;
    }
    
    // Demo booking codes
    if (bookingInput === '12345') {
      handleDemoClick();
    } else if (bookingInput === '00000') {
      // Multi-stop demo
      toast.info('🗺️ Multi-stop route loaded');
    } else {
      toast.info(`🔍 Looking up booking #${bookingInput}...`);
    }
  };

  return (
    <div className="live-tracking-page">
      {/* Site Header - White logo for tracking page */}
      <Header whiteLogo />
      
      {/* Dashboard Header - Compact */}
      <header className="tracking-header">
        <div className="flex items-center gap-3">
          <img 
            src={logoImg} 
            alt="TruMove" 
            className="h-7 brightness-0 invert"
          />
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/90">
            Shipment Command Center
          </span>
        </div>

        {/* Trust Indicators - Right */}
        <div className="tracking-header-trust">
          <span className="tracking-header-trust-item">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            FMCSA VERIFIED
          </span>
          <span className="tracking-header-trust-dot">•</span>
          <span className="tracking-header-trust-item">
            <Truck className="w-3.5 h-3.5 text-primary" />
            LIVE GPS
          </span>
        </div>
      </header>
      
      {/* Booking Search Bar - Below Header */}
      <div className="tracking-search-bar">
        <div className="tracking-search-bar-inner">
          <div className="tracking-booking-input-group">
            <input
              type="text"
              placeholder="Enter Booking ID or Shipment #"
              value={bookingInput}
              onChange={(e) => setBookingInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBookingSearch()}
              className="tracking-booking-input"
            />
            <Button
              onClick={handleBookingSearch}
              className="tracking-booking-go-btn"
              size="sm"
            >
              <Play className="w-3.5 h-3.5" />
              Go
            </Button>
          </div>
          <Button
            onClick={handleDemoClick}
            variant="outline"
            size="sm"
            className="tracking-demo-btn"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Demo
          </Button>
        </div>
      </div>

      {/* Route Setup Modal */}
      <RouteSetupModal 
        open={showRouteModal} 
        onClose={() => setShowRouteModal(false)}
        onSubmit={handleRouteModalSubmit}
      />

      {/* Main Content - 2 Column Layout */}
      <div className="tracking-content tracking-content-2col">
        {/* Left: Map Area */}
        <div className="tracking-map-area">
          {/* Map Container */}
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
            ) : (
              <Google2DTrackingMap
                originCoords={originCoords}
                destCoords={destCoords}
                progress={progress}
                isTracking={isTracking}
                onRouteCalculated={handleRouteCalculated}
                followMode={true}
                onFollowModeChange={() => {}}
                mapType={mapViewType}
                googleApiKey={GOOGLE_MAPS_API_KEY}
              />
            )}
          </div>

          {/* Map Controls Strip - Go/Pause/Reset */}
          <div className="tracking-map-controls">
            <div className="tracking-map-controls-buttons">
              {!isTracking ? (
                <Button
                  onClick={startTracking}
                  disabled={!canTrack}
                  className="tracking-map-go-btn"
                >
                  <Play className="w-4 h-4" />
                  Track
                </Button>
              ) : (
                <Button
                  onClick={isPaused ? resumeTracking : pauseTracking}
                  variant="secondary"
                  className="tracking-map-pause-btn"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
              )}
              
              <Button
                onClick={resetTracking}
                variant="ghost"
                size="sm"
                disabled={progress === 0 && !isTracking}
                className="tracking-map-reset-btn"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* Below Map Panel: Weather + Alternate Routes + Weigh Stations - Collapsible */}
          <Collapsible open={!belowMapCollapsed} onOpenChange={(open) => setBelowMapCollapsed(!open)}>
            <div className="tracking-below-map-wrapper">
              <CollapsibleTrigger asChild>
                <button className="tracking-below-map-toggle">
                  {belowMapCollapsed ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      <span>Show Route Details</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>Hide Route Details</span>
                    </>
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="tracking-below-map-panel">
                  {/* Route Weather - Individually Collapsible */}
                  <IndividualCollapsibleSection
                    title="Route Weather"
                    icon={<Cloud className="w-4 h-4 text-primary" />}
                    storageKey="tracking-weather"
                  >
                    <CompactRouteWeather
                      originCoords={originCoords}
                      destCoords={destCoords}
                      originName={originName}
                      destName={destName}
                    />
                  </IndividualCollapsibleSection>

                  {/* Alternate Routes - Individually Collapsible */}
                  {googleRouteData.alternateRoutes && googleRouteData.alternateRoutes.length > 0 && (
                    <IndividualCollapsibleSection
                      title={`Alternate Routes (${googleRouteData.alternateRoutes.length})`}
                      icon={<Route className="w-4 h-4 text-primary" />}
                      storageKey="tracking-alt-routes"
                    >
                      <div className="tracking-alternate-routes-list">
                        {googleRouteData.alternateRoutes.slice(0, 2).map((alt: any, i: number) => (
                          <div key={i} className="tracking-alternate-route-item">
                            <span className="tracking-alt-route-name">{alt.description || `Via alternate ${i + 1}`}</span>
                            <span className="tracking-alt-route-meta">
                              {alt.distanceMiles} mi • {alt.durationFormatted}
                              {alt.isTollFree && <span className="tracking-alt-toll-free">No tolls</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </IndividualCollapsibleSection>
                  )}

                  {/* Weigh Stations - Individually Collapsible */}
                  {routeCoordinates.length > 0 && (
                    <IndividualCollapsibleSection
                      title="Weigh Stations"
                      icon={<Scale className="w-4 h-4 text-amber-500" />}
                      storageKey="tracking-weigh"
                    >
                      <WeighStationChecklist
                        routeCoordinates={routeCoordinates}
                        progress={progress}
                        isTracking={isTracking}
                      />
                    </IndividualCollapsibleSection>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>

        {/* Right: Dashboard - Always Expanded */}
        <div className="tracking-dashboard transition-all duration-300">
          {/* Multi-Stop Summary Card - Show when multi-stop data present */}
          {routeData && multiStopData && (
            <MultiStopSummaryCard
              stops={multiStopData.stops}
              currentStopIndex={multiStopData.currentStopIndex}
              totalDistance={multiStopData.totalDistance}
              remainingDuration={formatDuration(multiStopData.estimatedDuration * (1 - multiStopData.progress / 100))}
            />
          )}

          {/* Unified Stats Card - Always visible */}
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
            isEmpty={!routeData}
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
        </div>
      </div>
      
      
      {/* Site Footer */}
      <Footer />
    </div>
  );
}
