import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, Navigation2, Eye, Satellite } from "lucide-react";
import { cn } from "@/lib/utils";

interface Google2DTrackingMapProps {
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
  progress: number;
  isTracking: boolean;
  onRouteCalculated?: (route: { coordinates: [number, number][]; distance: number; duration: number }) => void;
  followMode?: boolean;
  onFollowModeChange?: (enabled: boolean) => void;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  googleApiKey: string;
}

declare global {
  interface Window {
    google: any;
    initGoogle2DMap: () => void;
  }
}

// Truck SVG icon as data URL (static version)
const TRUCK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <circle cx="20" cy="20" r="18" fill="#22c55e" filter="url(#shadow)"/>
  <path d="M12 24h-1c-.6 0-1-.4-1-1v-6c0-.6.4-1 1-1h12l4 4v4c0 .6-.4 1-1 1h-1" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(2, -2)"/>
  <circle cx="15" cy="22" r="2" fill="none" stroke="white" stroke-width="1.5" transform="translate(2, -2)"/>
  <circle cx="23" cy="22" r="2" fill="none" stroke="white" stroke-width="1.5" transform="translate(2, -2)"/>
  <path d="M17 22h4" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" transform="translate(2, -2)"/>
  <path d="M22 16v4h4" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(2, -2)"/>
</svg>`;

// Truck SVG with animated pulse ring and glow for active tracking
const TRUCK_ICON_PULSING_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
    </filter>
    <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Glow background -->
  <circle cx="32" cy="32" r="26" fill="#22c55e" opacity="0.25" filter="url(#glow)">
    <animate attributeName="opacity" values="0.25;0.4;0.25" dur="2s" repeatCount="indefinite"/>
  </circle>
  <!-- Outer pulse ring -->
  <circle cx="32" cy="32" r="28" fill="none" stroke="#22c55e" stroke-width="2" opacity="0.4">
    <animate attributeName="r" values="24;30;24" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/>
  </circle>
  <!-- Inner pulse ring -->
  <circle cx="32" cy="32" r="22" fill="none" stroke="#22c55e" stroke-width="1.5" opacity="0.3">
    <animate attributeName="r" values="20;25;20" dur="1.5s" repeatCount="indefinite" begin="0.2s"/>
    <animate attributeName="opacity" values="0.5;0.15;0.5" dur="1.5s" repeatCount="indefinite" begin="0.2s"/>
  </circle>
  <!-- Main truck circle with glow -->
  <circle cx="32" cy="32" r="18" fill="#22c55e" filter="url(#shadow)"/>
  <!-- Truck icon -->
  <path d="M24 36h-1c-.6 0-1-.4-1-1v-6c0-.6.4-1 1-1h12l4 4v4c0 .6-.4 1-1 1h-1" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(2, -2)"/>
  <circle cx="27" cy="34" r="2" fill="none" stroke="white" stroke-width="1.5" transform="translate(2, -2)"/>
  <circle cx="35" cy="34" r="2" fill="none" stroke="white" stroke-width="1.5" transform="translate(2, -2)"/>
  <path d="M29 34h4" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" transform="translate(2, -2)"/>
  <path d="M34 28v4h4" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(2, -2)"/>
</svg>`;

/**
 * Google Maps 2D Tracking View
 * Uses Google Maps JavaScript API with satellite/hybrid view as default
 * Includes traffic layer, follow mode, and animated truck marker
 */
export function Google2DTrackingMap({
  originCoords,
  destCoords,
  progress,
  isTracking,
  onRouteCalculated,
  followMode = true,
  onFollowModeChange,
  mapType = 'hybrid',
  googleApiKey
}: Google2DTrackingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const trafficLayerRef = useRef<any>(null);
  const truckMarkerRef = useRef<any>(null);
  const originMarkerRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);
  const animatedPolylineRef = useRef<any>(null);
  const routePathRef = useRef<[number, number][]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [internalFollowMode, setInternalFollowMode] = useState(followMode);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const lastPositionRef = useRef<{ lat: number; lng: number; time: number } | null>(null);

  // Sync follow mode with prop
  useEffect(() => {
    setInternalFollowMode(followMode);
  }, [followMode]);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) {
      setIsScriptLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsScriptLoaded(true));
      if (window.google?.maps) {
        setIsScriptLoaded(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      setError('Failed to load Google Maps');
      setIsLoading(false);
    };
    
    document.head.appendChild(script);
  }, [googleApiKey]);

  // Initialize map
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current) return;

    try {
      const initialCenter = originCoords 
        ? { lat: originCoords[1], lng: originCoords[0] }
        : { lat: 28.5383, lng: -81.3792 }; // Default: Orlando

      const map = new window.google.maps.Map(containerRef.current, {
        center: initialCenter,
        zoom: originCoords ? 12 : 6,
        mapTypeId: mapType,
        mapTypeControl: false, // Disabled - using custom dropdown instead
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER
        },
        tilt: 0, // 2D view
        styles: mapType === 'roadmap' ? [
          { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#8a8aa3' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d2d44' }] },
          { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
        ] : undefined
      });

      mapRef.current = map;

      // Add traffic layer
      const trafficLayer = new window.google.maps.TrafficLayer();
      trafficLayer.setMap(map);
      trafficLayerRef.current = trafficLayer;

      // Initialize directions renderer with invisible line (will animate in)
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true, // We'll use custom markers
        polylineOptions: {
          strokeColor: '#22c55e',
          strokeWeight: 5,
          strokeOpacity: 0 // Start invisible for animation
        }
      });
      directionsRendererRef.current = directionsRenderer;

      // Listen for user interaction to disable follow mode
      map.addListener('dragstart', () => {
        if (internalFollowMode) {
          setInternalFollowMode(false);
          onFollowModeChange?.(false);
        }
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to initialize Google 2D map:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }
  }, [isScriptLoaded, mapType, originCoords]);

  // Calculate route when origin/destination change
  useEffect(() => {
    if (!mapRef.current || !originCoords || !destCoords || !directionsRendererRef.current) return;

    const directionsService = new window.google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: { lat: originCoords[1], lng: originCoords[0] },
        destination: { lat: destCoords[1], lng: destCoords[0] },
        travelMode: window.google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: window.google.maps.TrafficModel.BEST_GUESS
        }
      },
      (result: any, status: any) => {
        if (status === 'OK' && result) {
          // Don't show the default renderer - we'll animate our own polyline
          directionsRendererRef.current.setOptions({ preserveViewport: true });
          
          // Extract path coordinates for progress tracking
          const route = result.routes[0];
          const path = route.overview_path;
          const coordinates: [number, number][] = path.map((p: any) => [p.lng(), p.lat()]);
          routePathRef.current = coordinates;
          
          // Get route info
          const leg = route.legs[0];
          const distanceInMiles = leg.distance.value / 1609.34;
          const durationInSeconds = leg.duration_in_traffic?.value || leg.duration.value;
          
          onRouteCalculated?.({
            coordinates,
            distance: distanceInMiles,
            duration: durationInSeconds
          });

          // Remove previous animated polyline and shadows if exists
          if (animatedPolylineRef.current) {
            // Remove all shadow polylines
            if ((animatedPolylineRef.current as any)._shadowPolyline) {
              (animatedPolylineRef.current as any)._shadowPolyline.setMap(null);
            }
            if ((animatedPolylineRef.current as any)._midShadowPolyline) {
              (animatedPolylineRef.current as any)._midShadowPolyline.setMap(null);
            }
            if ((animatedPolylineRef.current as any)._outlinePolyline) {
              (animatedPolylineRef.current as any)._outlinePolyline.setMap(null);
            }
            // Remove all gradient polylines
            if ((animatedPolylineRef.current as any)._gradientPolylines) {
              (animatedPolylineRef.current as any)._gradientPolylines.forEach((pl: any) => pl.setMap(null));
            }
            animatedPolylineRef.current.setMap(null);
          }

          // Create soft shadow polyline (widest, most transparent)
          const shadowPolyline = new window.google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#000000',
            strokeOpacity: 0.15,
            strokeWeight: 18,
            map: mapRef.current,
            zIndex: 2
          });

          // Create mid shadow polyline for depth
          const midShadowPolyline = new window.google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#000000',
            strokeOpacity: 0.3,
            strokeWeight: 12,
            map: mapRef.current,
            zIndex: 3
          });

          // Create black outline polyline for crisp edge
          const outlinePolyline = new window.google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#000000',
            strokeOpacity: 0.7,
            strokeWeight: 8,
            map: mapRef.current,
            zIndex: 4
          });
          
          // Create gradient effect using multiple polyline segments
          const gradientColors = [
            '#16a34a', // darker green (start)
            '#1cb454',
            '#22c55e', // primary green (middle)
            '#34d06a',
            '#22c55e', // primary green
            '#1cb454',
            '#16a34a', // darker green (end)
          ];
          
          const segmentCount = gradientColors.length;
          const pointsPerSegment = Math.floor(path.length / segmentCount);
          const gradientPolylines: any[] = [];
          
          for (let i = 0; i < segmentCount; i++) {
            const startIdx = i * pointsPerSegment;
            const endIdx = i === segmentCount - 1 ? path.length : (i + 1) * pointsPerSegment + 1;
            const segmentPath = path.slice(startIdx, endIdx);
            
            if (segmentPath.length > 1) {
              const segmentPolyline = new window.google.maps.Polyline({
                path: segmentPath,
                geodesic: true,
                strokeColor: gradientColors[i],
                strokeOpacity: 0,
                strokeWeight: 5,
                map: mapRef.current,
                zIndex: 5 + i
              });
              gradientPolylines.push(segmentPolyline);
            }
          }
          
          // Use first segment as the main reference
          animatedPolylineRef.current = gradientPolylines[0] || new window.google.maps.Polyline({ path, map: mapRef.current });
          
          // Store all refs for cleanup
          (animatedPolylineRef.current as any)._shadowPolyline = shadowPolyline;
          (animatedPolylineRef.current as any)._midShadowPolyline = midShadowPolyline;
          (animatedPolylineRef.current as any)._outlinePolyline = outlinePolyline;
          (animatedPolylineRef.current as any)._gradientPolylines = gradientPolylines;

          // Animate the gradient polylines opacity
          let opacity = 0;
          const fadeInInterval = setInterval(() => {
            opacity += 0.05;
            if (opacity >= 0.85) {
              opacity = 0.85;
              clearInterval(fadeInInterval);
            }
            // Update all gradient polylines
            gradientPolylines.forEach(pl => pl.setOptions({ strokeOpacity: opacity }));
          }, 30);

          // Create origin marker with staggered drop animation
          if (originMarkerRef.current) {
            originMarkerRef.current.setMap(null);
          }
          setTimeout(() => {
            originMarkerRef.current = new window.google.maps.Marker({
              position: { lat: originCoords[1], lng: originCoords[0] },
              map: mapRef.current,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#22c55e',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3
              },
              zIndex: 10,
              animation: window.google.maps.Animation.DROP
            });
          }, 150);

          // Create destination marker with delay
          if (destMarkerRef.current) {
            destMarkerRef.current.setMap(null);
          }
          setTimeout(() => {
            destMarkerRef.current = new window.google.maps.Marker({
              position: { lat: destCoords[1], lng: destCoords[0] },
              map: mapRef.current,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#ef4444',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3
              },
              zIndex: 10,
              animation: window.google.maps.Animation.DROP
            });
          }, 350);

          // Create truck marker with delay - uses pulsing version when tracking starts
          if (truckMarkerRef.current) {
            truckMarkerRef.current.setMap(null);
          }
          setTimeout(() => {
            truckMarkerRef.current = new window.google.maps.Marker({
              position: { lat: originCoords[1], lng: originCoords[0] },
              map: mapRef.current,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(TRUCK_ICON_PULSING_SVG)}`,
                scaledSize: new window.google.maps.Size(64, 64),
                anchor: new window.google.maps.Point(32, 32)
              },
              zIndex: 100,
              animation: window.google.maps.Animation.DROP
            });
          }, 500);

          // Smooth pan to bounds
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend({ lat: originCoords[1], lng: originCoords[0] });
          bounds.extend({ lat: destCoords[1], lng: destCoords[0] });
          setTimeout(() => {
            mapRef.current.panToBounds(bounds, { padding: 80 });
            setTimeout(() => {
              mapRef.current.fitBounds(bounds, { padding: 80 });
            }, 200);
          }, 50);
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  }, [originCoords, destCoords, onRouteCalculated]);

  // Update truck position based on progress
  useEffect(() => {
    if (!truckMarkerRef.current || routePathRef.current.length < 2) return;

    const path = routePathRef.current;
    const totalPoints = path.length;
    const exactIndex = (progress / 100) * (totalPoints - 1);
    const lowerIndex = Math.floor(exactIndex);
    const upperIndex = Math.min(lowerIndex + 1, totalPoints - 1);
    const fraction = exactIndex - lowerIndex;

    const lowerPoint = path[lowerIndex];
    const upperPoint = path[upperIndex];

    const lng = lowerPoint[0] + (upperPoint[0] - lowerPoint[0]) * fraction;
    const lat = lowerPoint[1] + (upperPoint[1] - lowerPoint[1]) * fraction;

    const newPosition = { lat, lng };
    truckMarkerRef.current.setPosition(newPosition);

    // Calculate speed based on position change
    const now = Date.now();
    if (lastPositionRef.current && isTracking) {
      const timeDelta = (now - lastPositionRef.current.time) / 1000 / 3600; // hours
      if (timeDelta > 0) {
        // Haversine distance
        const R = 3959; // miles
        const dLat = (lat - lastPositionRef.current.lat) * Math.PI / 180;
        const dLng = (lng - lastPositionRef.current.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lastPositionRef.current.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
          Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        // Speed in mph (clamped to realistic values)
        const speed = Math.min(Math.max(distance / timeDelta, 0), 85);
        // Smooth the speed value
        setCurrentSpeed(prev => Math.round(prev * 0.7 + speed * 0.3));
      }
    }
    lastPositionRef.current = { lat, lng, time: now };

    // Follow mode: pan map to follow truck
    if (internalFollowMode && mapRef.current && isTracking) {
      mapRef.current.panTo(newPosition);
      if (mapRef.current.getZoom() < 13) {
        mapRef.current.setZoom(14);
      }
    }
  }, [progress, internalFollowMode, isTracking]);

  // Toggle follow mode
  const toggleFollowMode = useCallback(() => {
    const newMode = !internalFollowMode;
    setInternalFollowMode(newMode);
    onFollowModeChange?.(newMode);

    if (newMode && truckMarkerRef.current && mapRef.current) {
      const pos = truckMarkerRef.current.getPosition();
      mapRef.current.panTo(pos);
      mapRef.current.setZoom(14);
    }
  }, [internalFollowMode, onFollowModeChange]);

  // Placeholder when no coordinates
  if (!originCoords && !destCoords) {
    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/70 border border-border">
        {/* Empty state skeleton */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{ 
            backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
          
          {/* Placeholder route line */}
          <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
            <path 
              d="M 100 350 Q 250 200 400 180 T 650 100" 
              fill="none" 
              stroke="hsl(var(--primary))" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeDasharray="12 8"
            />
          </svg>
        </div>
        
        {/* Centered prompt */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-background/60 backdrop-blur-sm rounded-xl px-8 py-6 border border-border">
            <Satellite className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">Enter origin and destination</p>
            <p className="text-xs text-muted-foreground mt-1">to view your route on the map</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border">
      {/* Loading skeleton state */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/70 z-10 overflow-hidden">
          {/* Animated skeleton lines mimicking a map */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Fake route line skeleton */}
            <div className="absolute top-1/4 left-1/6 right-1/4 h-1 bg-primary/20 rounded-full animate-pulse" />
            <div className="absolute top-1/3 left-1/4 right-1/6 h-1 bg-primary/15 rounded-full animate-pulse delay-100" style={{ transform: 'rotate(15deg)' }} />
            <div className="absolute top-1/2 left-1/5 right-1/3 h-1 bg-primary/20 rounded-full animate-pulse delay-200" style={{ transform: 'rotate(-10deg)' }} />
            
            {/* Origin marker skeleton */}
            <div className="absolute top-1/4 left-[15%] w-6 h-6 rounded-full bg-primary/30 animate-pulse" />
            
            {/* Destination marker skeleton */}
            <div className="absolute bottom-1/4 right-[20%] w-6 h-6 rounded-full bg-destructive/30 animate-pulse delay-150" />
          </div>
          
          {/* Center loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-background/80 backdrop-blur-sm rounded-xl px-6 py-4 border border-border shadow-lg">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Loading satellite view</p>
              <p className="text-xs text-muted-foreground mt-1">Preparing map data...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-background/90 flex items-center justify-center z-10">
          <div className="text-center">
            <Satellite className="w-10 h-10 text-destructive/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}
      {/* Minimal tracking active indicator */}
      {isTracking && (
        <div className="absolute top-3 left-3 z-20 px-2 py-1 rounded-full bg-primary/90 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[9px] font-bold text-primary-foreground tracking-wider uppercase">Tracking</span>
        </div>
      )}

      {/* Map container */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}
