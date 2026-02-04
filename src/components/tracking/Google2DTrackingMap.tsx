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

// Clean truck silhouette SVG - matches satellite route aesthetic
const TRUCK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="32" viewBox="0 0 48 32">
  <defs>
    <filter id="truckShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>
  <!-- Truck body -->
  <rect x="0" y="6" width="28" height="16" rx="2" fill="#1a1a1a" filter="url(#truckShadow)"/>
  <!-- Cab section -->
  <path d="M28 6 L28 22 L40 22 L40 12 L34 6 Z" fill="#1a1a1a" filter="url(#truckShadow)"/>
  <!-- Windshield accent -->
  <path d="M29 7 L33 7 L38 12 L38 14 L29 14 Z" fill="#00e5a0" opacity="0.9"/>
  <!-- Cargo stripes -->
  <rect x="4" y="10" width="20" height="2" fill="#00e5a0" opacity="0.6"/>
  <rect x="4" y="14" width="20" height="2" fill="#00e5a0" opacity="0.4"/>
  <!-- Wheels -->
  <circle cx="10" cy="24" r="5" fill="#333"/>
  <circle cx="10" cy="24" r="3" fill="#1a1a1a" stroke="#00e5a0" stroke-width="1.5"/>
  <circle cx="34" cy="24" r="5" fill="#333"/>
  <circle cx="34" cy="24" r="3" fill="#1a1a1a" stroke="#00e5a0" stroke-width="1.5"/>
  <!-- Direction arrow -->
  <path d="M42 10 L48 16 L42 22 L42 18 L46 16 L42 14 Z" fill="#00e5a0"/>
</svg>`;

// Truck SVG with animated pulse ring for active tracking
const TRUCK_ICON_PULSING_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72">
  <defs>
    <filter id="truckGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>
  <!-- Outer pulse ring -->
  <circle cx="36" cy="36" r="32" fill="none" stroke="#00e5a0" stroke-width="2" opacity="0.5">
    <animate attributeName="r" values="28;34;28" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/>
  </circle>
  <!-- Inner pulse ring -->
  <circle cx="36" cy="36" r="26" fill="none" stroke="#00e5a0" stroke-width="1.5" opacity="0.3">
    <animate attributeName="r" values="24;29;24" dur="1.5s" repeatCount="indefinite" begin="0.2s"/>
    <animate attributeName="opacity" values="0.5;0.15;0.5" dur="1.5s" repeatCount="indefinite" begin="0.2s"/>
  </circle>
  <!-- Truck body -->
  <rect x="16" y="28" width="28" height="16" rx="2" fill="#1a1a1a" filter="url(#truckGlow)"/>
  <!-- Cab section -->
  <path d="M44 28 L44 44 L56 44 L56 34 L50 28 Z" fill="#1a1a1a" filter="url(#truckGlow)"/>
  <!-- Windshield -->
  <path d="M45 29 L49 29 L54 34 L54 36 L45 36 Z" fill="#00e5a0" opacity="0.9"/>
  <!-- Cargo stripes -->
  <rect x="20" y="32" width="20" height="2" fill="#00e5a0" opacity="0.5"/>
  <rect x="20" y="36" width="20" height="2" fill="#00e5a0" opacity="0.3"/>
  <!-- Wheels -->
  <circle cx="26" cy="46" r="4" fill="#333"/>
  <circle cx="26" cy="46" r="2.5" fill="#1a1a1a" stroke="#00e5a0" stroke-width="1"/>
  <circle cx="50" cy="46" r="4" fill="#333"/>
  <circle cx="50" cy="46" r="2.5" fill="#1a1a1a" stroke="#00e5a0" stroke-width="1"/>
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
  const [currentTruckCoords, setCurrentTruckCoords] = useState<[number, number] | null>(null);
  const [currentBearing, setCurrentBearing] = useState<number>(0);
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
          strokeColor: '#00e5a0',
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
  }, [isScriptLoaded, originCoords]);

  // Update map type without recreating map
  useEffect(() => {
    if (!mapRef.current) return;
    
    mapRef.current.setMapTypeId(mapType);
    
    // Apply dark styles for roadmap, clear for satellite/hybrid
    if (mapType === 'roadmap') {
      mapRef.current.setOptions({
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#8a8aa3' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d2d44' }] },
          { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
        ]
      });
    } else {
      mapRef.current.setOptions({ styles: undefined });
    }
  }, [mapType]);

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
          
          // Create gradient effect using cyan color (matching satellite reference)
          const gradientColors = [
            '#00c896', // slightly darker cyan (start)
            '#00d89d',
            '#00e5a0', // primary cyan (middle)
            '#00f0a8',
            '#00e5a0', // primary cyan
            '#00d89d',
            '#00c896', // slightly darker cyan (end)
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
                scaledSize: new window.google.maps.Size(72, 72),
                anchor: new window.google.maps.Point(36, 46)
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
    
    // Update truck position state for Street View inset
    setCurrentTruckCoords([lng, lat]);

    // Calculate bearing for Street View heading
    if (lowerIndex < totalPoints - 1) {
      const nextPoint = path[Math.min(lowerIndex + 1, totalPoints - 1)];
      const bearing = Math.atan2(
        nextPoint[0] - lowerPoint[0],
        nextPoint[1] - lowerPoint[1]
      ) * (180 / Math.PI);
      setCurrentBearing((bearing + 360) % 360);
    }

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

      {/* Street View Inset - Bottom Right */}
      {isTracking && currentTruckCoords && googleApiKey && (
        <div className="absolute bottom-4 right-4 z-30">
          <div className="w-[200px] h-[140px] rounded-lg overflow-hidden border-2 border-white/20 shadow-xl bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="relative w-full h-full">
              <img
                src={`https://maps.googleapis.com/maps/api/streetview?size=400x280&location=${currentTruckCoords[1]},${currentTruckCoords[0]}&fov=100&heading=${currentBearing}&pitch=5&key=${googleApiKey}`}
                alt="Street View at truck location"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to satellite view if street view fails
                  e.currentTarget.src = `https://maps.googleapis.com/maps/api/staticmap?center=${currentTruckCoords[1]},${currentTruckCoords[0]}&zoom=17&size=400x280&maptype=hybrid&key=${googleApiKey}`;
                }}
              />
              {/* Label overlay */}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wider">Street View</span>
                </div>
              </div>
              {/* Live indicator */}
              <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[8px] font-bold text-white/80 tracking-wider">LIVE</span>
              </div>
            </div>
          </div>
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
