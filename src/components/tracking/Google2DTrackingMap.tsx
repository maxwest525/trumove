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

// Truck SVG icon as data URL
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
  const routePathRef = useRef<[number, number][]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [internalFollowMode, setInternalFollowMode] = useState(followMode);

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

      // Initialize directions renderer
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true, // We'll use custom markers
        polylineOptions: {
          strokeColor: '#22c55e',
          strokeWeight: 5,
          strokeOpacity: 0.8
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
          directionsRendererRef.current.setDirections(result);
          
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

          // Create origin marker
          if (originMarkerRef.current) {
            originMarkerRef.current.setMap(null);
          }
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
            zIndex: 10
          });

          // Create destination marker
          if (destMarkerRef.current) {
            destMarkerRef.current.setMap(null);
          }
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
            zIndex: 10
          });

          // Create truck marker
          if (truckMarkerRef.current) {
            truckMarkerRef.current.setMap(null);
          }
          truckMarkerRef.current = new window.google.maps.Marker({
            position: { lat: originCoords[1], lng: originCoords[0] },
            map: mapRef.current,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(TRUCK_ICON_SVG)}`,
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            },
            zIndex: 100
          });

          // Fit bounds to show entire route
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend({ lat: originCoords[1], lng: originCoords[0] });
          bounds.extend({ lat: destCoords[1], lng: destCoords[0] });
          mapRef.current.fitBounds(bounds, { padding: 80 });
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
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 border border-border flex items-center justify-center">
        <div className="text-center">
          <Satellite className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Enter origin and destination to view route</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/90 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading satellite view...</p>
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

      {/* Controls overlay */}
      <div className="absolute top-3 left-3 z-20 flex gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border flex items-center gap-2">
          <Satellite className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold tracking-wider text-foreground/90 uppercase">
            2D Satellite
          </span>
        </div>
        
        {isTracking && (
          <div className="px-2 py-1.5 rounded-lg bg-primary/90 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[9px] font-bold text-primary-foreground tracking-wider">LIVE</span>
          </div>
        )}
      </div>

      {/* Follow Mode Status Badge on Map */}
      {isTracking && routePathRef.current.length > 0 && (
        <div className={cn(
          "absolute bottom-16 left-3 z-20 px-3 py-1.5 rounded-lg backdrop-blur-sm border transition-all duration-300",
          internalFollowMode 
            ? "bg-primary/20 border-primary/40 text-primary" 
            : "bg-amber-500/15 border-amber-500/30 text-amber-400"
        )}>
          <div className="flex items-center gap-2">
            {internalFollowMode ? (
              <>
                <Navigation2 className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider uppercase">Following Truck</span>
              </>
            ) : (
              <>
                <Satellite className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold tracking-wider uppercase">Manual View</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Google attribution - positioned bottom-left */}
      <div className="absolute bottom-3 left-3 z-20 px-2 py-1 rounded bg-background/70 backdrop-blur-sm border border-border">
        <span className="text-[8px] text-muted-foreground">Google Maps</span>
      </div>

      {/* Map container */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}
