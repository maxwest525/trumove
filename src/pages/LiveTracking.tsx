import { useState, useCallback, useEffect, useRef } from "react";
import { MapPin, Navigation, Play, Pause, RotateCcw, Truck, Zap } from "lucide-react";
import { TruckTrackingMap } from "@/components/tracking/TruckTrackingMap";
import { TrackingDashboard } from "@/components/tracking/TrackingDashboard";
import { TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import { SatellitePreview } from "@/components/tracking/SatellitePreview";
import { RouteWeather } from "@/components/tracking/RouteWeather";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { MAPBOX_TOKEN } from "@/lib/mapboxToken";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import logoImg from "@/assets/logo.png";

interface RouteData {
  coordinates: [number, number][];
  distance: number;
  duration: number;
}

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
  const [progress, setProgress] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(60); // seconds for full journey
  const [departureTime] = useState(new Date());

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
  }, []);

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
          <img src={logoImg} alt="TruMove" className="h-8 w-auto" />
          <span className="text-white/30">|</span>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">
            Live Tracking
          </span>
        </div>

        <div className="flex items-center gap-4">
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
                  className="flex-1 bg-primary hover:bg-primary/90 text-black font-semibold"
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
          <SatellitePreview
            coordinates={originCoords}
            label="Origin"
            locationName={originName}
            time={formatTime(departureTime)}
            timeLabel="Departed"
            variant="origin"
          />

          {routeData && (
            <TrackingDashboard
              progress={progress}
              distanceTraveled={distanceTraveled}
              totalDistance={totalDistance}
              timeRemaining={formatDuration(remainingDuration)}
            />
          )}

          <SatellitePreview
            coordinates={destCoords}
            label="Destination"
            locationName={destName}
            time={formatTime(etaTime)}
            timeLabel="ETA"
            variant="destination"
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
    </div>
  );
}
