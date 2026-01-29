/// <reference types="google.maps" />
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation, Clock, Truck, Play, RotateCcw, ToggleLeft, ToggleRight, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types
interface BookingData {
  bookingNumber: string;
  originAddress: string;
  destinationAddress: string;
  pickupConfirmedTime: Date;
  etaMinutes: number;
  status: "Scheduled" | "Picked Up" | "In Transit" | "Delivered";
  deliveredTime?: Date;
}

interface RouteData {
  path: google.maps.LatLng[];
  cumulativeDistances: number[];
  totalDistance: number;
  polyline: string;
  origin: google.maps.LatLng;
  destination: google.maps.LatLng;
}

// Mock bookings for demo
const MOCK_BOOKINGS: Record<string, BookingData> = {
  "12345": {
    bookingNumber: "12345",
    originAddress: "1234 Main St, Jacksonville, FL 32202",
    destinationAddress: "5678 Ocean Dr, Miami, FL 33139",
    pickupConfirmedTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    etaMinutes: 360,
    status: "In Transit"
  },
  "54321": {
    bookingNumber: "54321",
    originAddress: "100 Peachtree St, Atlanta, GA 30303",
    destinationAddress: "200 Bourbon St, New Orleans, LA 70130",
    pickupConfirmedTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    etaMinutes: 420,
    status: "Scheduled"
  },
  "99999": {
    bookingNumber: "99999",
    originAddress: "500 5th Ave, New York, NY 10036",
    destinationAddress: "1600 Pennsylvania Ave, Washington, DC 20500",
    pickupConfirmedTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    etaMinutes: 240,
    status: "Delivered",
    deliveredTime: new Date(Date.now() - 30 * 60 * 1000)
  }
};

export default function LiveMoveTracker69() {
  const navigate = useNavigate();
  
  // Mode states
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoopDemo, setIsLoopDemo] = useState(true);
  
  // Booking mode states
  const [bookingNumber, setBookingNumber] = useState("");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  
  // Demo mode states
  const [demoOrigin, setDemoOrigin] = useState("Los Angeles, CA");
  const [demoDestination, setDemoDestination] = useState("San Francisco, CA");
  const [demoEtaMinutes, setDemoEtaMinutes] = useState(360);
  const [demoStartTime, setDemoStartTime] = useState<Date | null>(null);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  
  // Route and map states
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [is3DSupported, setIs3DSupported] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map3DRef = useRef<any>(null);
  const map2DRef = useRef<google.maps.Map | null>(null);
  const truckMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const routePolylineRef = useRef<google.maps.Polyline | null>(null);
  const traveledPolylineRef = useRef<google.maps.Polyline | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  
  // Compute current status display
  const getStatusInfo = useCallback(() => {
    const data = isDemoMode ? {
      startTime: demoStartTime,
      etaMinutes: demoEtaMinutes,
      status: isDemoRunning ? "In Transit" : "Ready"
    } : bookingData ? {
      startTime: bookingData.pickupConfirmedTime,
      etaMinutes: bookingData.etaMinutes,
      status: bookingData.status
    } : null;
    
    if (!data || !data.startTime) return null;
    
    const now = new Date();
    const startTime = new Date(data.startTime);
    const durationMs = data.etaMinutes * 60 * 1000;
    const endTime = new Date(startTime.getTime() + durationMs);
    const elapsed = now.getTime() - startTime.getTime();
    const currentProgress = Math.max(0, Math.min(1, elapsed / durationMs));
    
    const remainingMs = Math.max(0, endTime.getTime() - now.getTime());
    const remainingMinutes = Math.floor(remainingMs / 60000);
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMins = remainingMinutes % 60;
    
    let displayStatus = data.status;
    if (currentProgress === 0 && elapsed < 0) {
      displayStatus = "Scheduled";
    } else if (currentProgress >= 0.95) {
      displayStatus = "Arriving Soon";
    } else if (currentProgress >= 1) {
      displayStatus = "Delivered";
    }
    
    const distanceRemaining = routeData ? 
      (routeData.totalDistance * (1 - currentProgress) / 1609.34).toFixed(1) : "0";
    
    return {
      status: displayStatus,
      progress: currentProgress,
      etaTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeRemaining: remainingHours > 0 ? `${remainingHours}h ${remainingMins}m` : `${remainingMins}m`,
      distanceRemaining: `${distanceRemaining} mi`,
      isBeforeStart: elapsed < 0,
      scheduledStart: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }, [isDemoMode, demoStartTime, demoEtaMinutes, isDemoRunning, bookingData, routeData]);
  
  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (window.google?.maps) {
        setMapLoaded(true);
        return;
      }
      
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        // Try fetching from edge function
        try {
          const { data } = await supabase.functions.invoke('google-routes', {
            body: { action: 'getApiKey' }
          });
          if (data?.apiKey) {
            loadScript(data.apiKey);
            return;
          }
        } catch (e) {
          console.error('Failed to get API key:', e);
        }
        toast.error("Google Maps API key not configured");
        return;
      }
      
      loadScript(apiKey);
    };
    
    const loadScript = (apiKey: string) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=beta&libraries=maps3d,geometry,marker,places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => {
        toast.error("Failed to load Google Maps");
        setIs3DSupported(false);
      };
      document.head.appendChild(script);
    };
    
    loadGoogleMaps();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Initialize DirectionsService when maps loaded
  useEffect(() => {
    if (mapLoaded && window.google?.maps) {
      directionsServiceRef.current = new google.maps.DirectionsService();
    }
  }, [mapLoaded]);
  
  // Fetch route when booking data or demo inputs change
  const fetchRoute = async (origin: string, destination: string) => {
    if (!directionsServiceRef.current) return null;
    
    try {
      const result = await directionsServiceRef.current.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING
      });
      
      if (result.routes[0]) {
        const route = result.routes[0];
        const path: google.maps.LatLng[] = [];
        const cumulativeDistances: number[] = [0];
        let totalDistance = 0;
        
        // Extract all points from the route
        route.legs.forEach(leg => {
          leg.steps.forEach(step => {
            step.path?.forEach(point => {
              if (path.length > 0) {
                const lastPoint = path[path.length - 1];
                const segmentDistance = google.maps.geometry.spherical.computeDistanceBetween(lastPoint, point);
                totalDistance += segmentDistance;
                cumulativeDistances.push(totalDistance);
              }
              path.push(point);
            });
          });
        });
        
        return {
          path,
          cumulativeDistances,
          totalDistance,
          polyline: route.overview_polyline,
          origin: path[0],
          destination: path[path.length - 1]
        };
      }
    } catch (error) {
      console.error('Route fetch error:', error);
      toast.error("Failed to calculate route");
    }
    return null;
  };
  
  // Interpolate position along route
  const interpolatePosition = useCallback((progress: number): { position: google.maps.LatLng; heading: number } | null => {
    if (!routeData || routeData.path.length < 2) return null;
    
    const targetDistance = progress * routeData.totalDistance;
    
    // Binary search for the segment
    let low = 0;
    let high = routeData.cumulativeDistances.length - 1;
    
    while (low < high - 1) {
      const mid = Math.floor((low + high) / 2);
      if (routeData.cumulativeDistances[mid] <= targetDistance) {
        low = mid;
      } else {
        high = mid;
      }
    }
    
    const segmentStart = routeData.path[low];
    const segmentEnd = routeData.path[Math.min(low + 1, routeData.path.length - 1)];
    const segmentStartDist = routeData.cumulativeDistances[low];
    const segmentEndDist = routeData.cumulativeDistances[Math.min(low + 1, routeData.cumulativeDistances.length - 1)];
    
    const segmentLength = segmentEndDist - segmentStartDist;
    const segmentProgress = segmentLength > 0 ? (targetDistance - segmentStartDist) / segmentLength : 0;
    
    const lat = segmentStart.lat() + (segmentEnd.lat() - segmentStart.lat()) * segmentProgress;
    const lng = segmentStart.lng() + (segmentEnd.lng() - segmentStart.lng()) * segmentProgress;
    
    const heading = google.maps.geometry.spherical.computeHeading(segmentStart, segmentEnd);
    
    return {
      position: new google.maps.LatLng(lat, lng),
      heading
    };
  }, [routeData]);
  
  // Initialize 3D map
  const init3DMap = useCallback(async () => {
    if (!mapContainerRef.current || !routeData) return;
    
    try {
      // Clear existing content
      mapContainerRef.current.innerHTML = '';
      
      // Create 3D map element
      const map3DElement = document.createElement('gmp-map-3d');
      map3DElement.setAttribute('center', `${routeData.origin.lat()},${routeData.origin.lng()}`);
      map3DElement.setAttribute('tilt', '67.5');
      map3DElement.setAttribute('heading', '0');
      map3DElement.setAttribute('range', '5000');
      map3DElement.style.width = '100%';
      map3DElement.style.height = '100%';
      
      mapContainerRef.current.appendChild(map3DElement);
      
      // Wait for map to be ready
      await customElements.whenDefined('gmp-map-3d');
      
      map3DRef.current = map3DElement;
      setIs3DSupported(true);
      
      // Draw route polyline on 3D map
      const polyline3D = document.createElement('gmp-polyline-3d');
      polyline3D.setAttribute('altitude-mode', 'clamp-to-ground');
      polyline3D.setAttribute('stroke-color', '#10b981');
      polyline3D.setAttribute('stroke-width', '8');
      
      const coordinates = routeData.path.map(p => ({
        lat: p.lat(),
        lng: p.lng(),
        altitude: 0
      }));
      
      (polyline3D as any).coordinates = coordinates;
      map3DElement.appendChild(polyline3D);
      
    } catch (error) {
      console.error('3D map init failed:', error);
      setIs3DSupported(false);
      init2DMap();
    }
  }, [routeData]);
  
  // Initialize 2D fallback map
  const init2DMap = useCallback(() => {
    if (!mapContainerRef.current || !routeData) return;
    
    // Clear existing content
    mapContainerRef.current.innerHTML = '';
    
    const mapDiv = document.createElement('div');
    mapDiv.style.width = '100%';
    mapDiv.style.height = '100%';
    mapContainerRef.current.appendChild(mapDiv);
    
    const map = new google.maps.Map(mapDiv, {
      center: routeData.origin,
      zoom: 10,
      mapTypeId: 'hybrid',
      tilt: 45,
      disableDefaultUI: true,
      gestureHandling: 'greedy'
    });
    
    map2DRef.current = map;
    
    // Draw route polyline
    routePolylineRef.current = new google.maps.Polyline({
      path: routeData.path,
      strokeColor: '#10b981',
      strokeOpacity: 0.4,
      strokeWeight: 6,
      map
    });
    
    // Traveled portion
    traveledPolylineRef.current = new google.maps.Polyline({
      path: [],
      strokeColor: '#10b981',
      strokeOpacity: 1,
      strokeWeight: 6,
      map
    });
    
    // Fit bounds
    const bounds = new google.maps.LatLngBounds();
    routeData.path.forEach(p => bounds.extend(p));
    map.fitBounds(bounds, 50);
    
    // Create truck marker
    const truckElement = document.createElement('div');
    truckElement.innerHTML = `
      <div style="
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(16, 185, 129, 0.5);
        border: 3px solid white;
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M1 3h15v13H1z"/>
          <path d="M16 8h4l3 3v5h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      </div>
    `;
    
    truckMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: routeData.origin,
      content: truckElement
    });
  }, [routeData]);
  
  // Animation loop
  const animate = useCallback(() => {
    const statusInfo = getStatusInfo();
    if (!statusInfo || !routeData) return;
    
    let currentProgress = statusInfo.progress;
    
    // Handle demo loop
    if (isDemoMode && isLoopDemo && currentProgress >= 1 && isDemoRunning) {
      setTimeout(() => {
        setDemoStartTime(new Date());
      }, 2000);
      return;
    }
    
    setProgress(currentProgress);
    
    const posData = interpolatePosition(currentProgress);
    if (!posData) return;
    
    // Update truck position
    if (truckMarkerRef.current) {
      truckMarkerRef.current.position = posData.position;
    }
    
    // Update traveled polyline (2D only)
    if (traveledPolylineRef.current && routeData) {
      const traveledIndex = Math.floor(currentProgress * (routeData.path.length - 1));
      const traveledPath = routeData.path.slice(0, traveledIndex + 1);
      if (posData.position) {
        traveledPath.push(posData.position);
      }
      traveledPolylineRef.current.setPath(traveledPath);
    }
    
    // Update camera (3D map)
    if (map3DRef.current && is3DSupported) {
      const lookAheadProgress = Math.min(1, currentProgress + 0.01);
      const lookAhead = interpolatePosition(lookAheadProgress);
      
      map3DRef.current.center = `${posData.position.lat()},${posData.position.lng()}`;
      map3DRef.current.heading = posData.heading;
      map3DRef.current.tilt = 67.5;
      map3DRef.current.range = 2000;
    }
    
    // Update camera (2D map)
    if (map2DRef.current && !is3DSupported) {
      map2DRef.current.panTo(posData.position);
      map2DRef.current.setZoom(15);
    }
    
    // Continue animation if not complete
    if (currentProgress < 1 || (isDemoMode && isLoopDemo)) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [getStatusInfo, routeData, interpolatePosition, isDemoMode, isLoopDemo, isDemoRunning, is3DSupported]);
  
  // Start animation when route is ready
  useEffect(() => {
    if (routeData && mapLoaded && (isDemoRunning || bookingData)) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Small delay to let map initialize
      setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(animate);
      }, 100);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [routeData, mapLoaded, isDemoRunning, bookingData, animate]);
  
  // Handle booking lookup
  const handleBookingLookup = async () => {
    if (!bookingNumber.trim()) {
      toast.error("Please enter a booking number");
      return;
    }
    
    setIsAnalyzing(true);
    
    // Check mock bookings first
    const mockBooking = MOCK_BOOKINGS[bookingNumber.trim()];
    if (mockBooking) {
      setBookingData(mockBooking);
      
      const route = await fetchRoute(mockBooking.originAddress, mockBooking.destinationAddress);
      if (route) {
        setRouteData(route);
        
        // Initialize map
        setTimeout(() => {
          if (is3DSupported) {
            init3DMap();
          } else {
            init2DMap();
          }
          setIsAnalyzing(false);
        }, 1500);
      } else {
        setIsAnalyzing(false);
      }
    } else {
      toast.error("Booking not found");
      setIsAnalyzing(false);
    }
  };
  
  // Handle demo start
  const handleStartDemo = async () => {
    if (!demoOrigin.trim() || !demoDestination.trim()) {
      toast.error("Please enter origin and destination");
      return;
    }
    
    setIsAnalyzing(true);
    
    const route = await fetchRoute(demoOrigin, demoDestination);
    if (route) {
      setRouteData(route);
      setDemoStartTime(new Date());
      setIsDemoRunning(true);
      
      // Initialize map
      setTimeout(() => {
        if (is3DSupported) {
          init3DMap();
        } else {
          init2DMap();
        }
        setIsAnalyzing(false);
      }, 1500);
    } else {
      setIsAnalyzing(false);
    }
  };
  
  // Handle analyze route (without starting)
  const handleAnalyzeRoute = async () => {
    if (!demoOrigin.trim() || !demoDestination.trim()) {
      toast.error("Please enter origin and destination");
      return;
    }
    
    setIsAnalyzing(true);
    
    const route = await fetchRoute(demoOrigin, demoDestination);
    if (route) {
      setRouteData(route);
      
      // Initialize map but don't start animation
      setTimeout(() => {
        if (is3DSupported) {
          init3DMap();
        } else {
          init2DMap();
        }
        setIsAnalyzing(false);
      }, 1500);
    } else {
      setIsAnalyzing(false);
    }
  };
  
  // Reset demo
  const handleResetDemo = () => {
    setIsDemoRunning(false);
    setDemoStartTime(null);
    setProgress(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
    <div className="lmt69-container">
      {/* Header */}
      <header className="lmt69-header">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="lmt69-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="lmt69-title">Live Move Tracker</h1>
        <div className="lmt69-mode-toggle">
          <span className={!isDemoMode ? 'active' : ''}>Booking</span>
          <Switch
            checked={isDemoMode}
            onCheckedChange={(checked) => {
              setIsDemoMode(checked);
              handleResetDemo();
              setRouteData(null);
              setBookingData(null);
            }}
          />
          <span className={isDemoMode ? 'active' : ''}>Demo</span>
        </div>
      </header>
      
      {/* Main content */}
      <div className="lmt69-main">
        {/* Map container */}
        <div className="lmt69-map-wrapper">
          <div ref={mapContainerRef} className="lmt69-map" />
          
          {/* Loading overlay */}
          {isAnalyzing && (
            <div className="lmt69-loading-overlay">
              <div className="lmt69-loading-content">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <h2>Analyzing your route</h2>
                <p>Building your live tracking view</p>
              </div>
            </div>
          )}
          
          {/* Status overlay */}
          {statusInfo && routeData && !isAnalyzing && (
            <div className="lmt69-status-card">
              <div className="lmt69-status-badge" data-status={statusInfo.status.toLowerCase().replace(' ', '-')}>
                {statusInfo.status}
              </div>
              
              {statusInfo.isBeforeStart ? (
                <div className="lmt69-status-scheduled">
                  <Clock className="w-5 h-5" />
                  <span>Starts at {statusInfo.scheduledStart}</span>
                </div>
              ) : (
                <>
                  <div className="lmt69-status-eta">
                    <span className="label">ETA</span>
                    <span className="value">{statusInfo.etaTime}</span>
                  </div>
                  
                  <div className="lmt69-status-metrics">
                    <div className="metric">
                      <Clock className="w-4 h-4" />
                      <span>{statusInfo.timeRemaining}</span>
                    </div>
                    <div className="metric">
                      <Navigation className="w-4 h-4" />
                      <span>{statusInfo.distanceRemaining}</span>
                    </div>
                  </div>
                  
                  <div className="lmt69-progress-bar">
                    <div 
                      className="lmt69-progress-fill" 
                      style={{ width: `${statusInfo.progress * 100}%` }}
                    />
                  </div>
                </>
              )}
              
              {!isDemoMode && bookingData && (
                <div className="lmt69-booking-number">
                  Booking #{bookingData.bookingNumber}
                </div>
              )}
            </div>
          )}
          
          {/* Empty state */}
          {!routeData && !isAnalyzing && (
            <div className="lmt69-empty-state">
              <Truck className="w-16 h-16 text-primary/30" />
              <p>Enter {isDemoMode ? 'addresses' : 'a booking number'} to start tracking</p>
            </div>
          )}
        </div>
        
        {/* Controls panel */}
        <div className="lmt69-controls">
          {isDemoMode ? (
            <>
              <div className="lmt69-input-group">
                <Label>Origin</Label>
                <div className="lmt69-input-wrapper">
                  <MapPin className="w-4 h-4" />
                  <Input
                    value={demoOrigin}
                    onChange={(e) => setDemoOrigin(e.target.value)}
                    placeholder="Enter origin address"
                    disabled={isDemoRunning}
                  />
                </div>
              </div>
              
              <div className="lmt69-input-group">
                <Label>Destination</Label>
                <div className="lmt69-input-wrapper">
                  <MapPin className="w-4 h-4" />
                  <Input
                    value={demoDestination}
                    onChange={(e) => setDemoDestination(e.target.value)}
                    placeholder="Enter destination address"
                    disabled={isDemoRunning}
                  />
                </div>
              </div>
              
              <div className="lmt69-input-group">
                <Label>ETA (minutes)</Label>
                <Input
                  type="number"
                  value={demoEtaMinutes}
                  onChange={(e) => setDemoEtaMinutes(parseInt(e.target.value) || 60)}
                  min={1}
                  max={1440}
                  disabled={isDemoRunning}
                />
              </div>
              
              <div className="lmt69-loop-toggle">
                <Label>Loop Demo</Label>
                <Switch
                  checked={isLoopDemo}
                  onCheckedChange={setIsLoopDemo}
                />
              </div>
              
              <div className="lmt69-button-group">
                {!isDemoRunning ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleAnalyzeRoute}
                      disabled={isAnalyzing}
                      className="lmt69-btn-secondary"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Analyze Route
                    </Button>
                    <Button
                      onClick={handleStartDemo}
                      disabled={isAnalyzing}
                      className="lmt69-btn-primary"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Demo
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleResetDemo}
                    className="lmt69-btn-secondary"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Demo
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="lmt69-input-group">
                <Label>Booking Number</Label>
                <div className="lmt69-input-wrapper">
                  <Search className="w-4 h-4" />
                  <Input
                    value={bookingNumber}
                    onChange={(e) => setBookingNumber(e.target.value)}
                    placeholder="Enter booking number"
                    onKeyDown={(e) => e.key === 'Enter' && handleBookingLookup()}
                  />
                </div>
              </div>
              
              <Button
                onClick={handleBookingLookup}
                disabled={isAnalyzing}
                className="lmt69-btn-primary w-full"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Truck className="w-4 h-4 mr-2" />
                )}
                Track Shipment
              </Button>
              
              <div className="lmt69-demo-codes">
                <p>Try demo codes:</p>
                <div className="codes">
                  {Object.keys(MOCK_BOOKINGS).map(code => (
                    <button
                      key={code}
                      onClick={() => setBookingNumber(code)}
                      className="code-chip"
                    >
                      #{code}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}