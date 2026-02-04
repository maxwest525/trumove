import { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN, MAPBOX_STYLES, applyStandardStyleConfig, type LightPreset } from "@/lib/mapboxToken";
import { Loader2, Navigation, Box, Eye, Globe, Sun, Moon, Sunrise, Play, Pause } from "lucide-react";
import { TruckLocationPopup } from "./TruckLocationPopup";
import { TrafficLegend } from "./TrafficLegend";
import { MiniRouteOverview } from "./MiniRouteOverview";
import { findWeighStationsOnRoute, type WeighStation } from "@/data/weighStations";
import { cn } from "@/lib/utils";
import { cinematicFlyTo } from "@/lib/mapbox3DConfig";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface RouteData {
  coordinates: [number, number][];
  distance: number;
  duration: number;
  congestionLevels?: string[];
}

// Major cities for waypoint detection
interface CityWaypoint {
  name: string;
  lat: number;
  lon: number;
}

const MAJOR_CITIES: CityWaypoint[] = [
  // Florida
  { name: "Tampa", lat: 27.9506, lon: -82.4572 },
  { name: "Orlando", lat: 28.5383, lon: -81.3792 },
  { name: "Jacksonville", lat: 30.3322, lon: -81.6557 },
  { name: "West Palm Beach", lat: 26.7153, lon: -80.0534 },
  { name: "Fort Lauderdale", lat: 26.1224, lon: -80.1373 },
  // East Coast
  { name: "Atlanta", lat: 33.749, lon: -84.388 },
  { name: "Charlotte", lat: 35.2271, lon: -80.8431 },
  { name: "Washington DC", lat: 38.9072, lon: -77.0369 },
  { name: "Philadelphia", lat: 39.9526, lon: -75.1652 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Boston", lat: 42.3601, lon: -71.0589 },
  // Midwest
  { name: "Chicago", lat: 41.8781, lon: -87.6298 },
  { name: "Detroit", lat: 42.3314, lon: -83.0458 },
  { name: "Indianapolis", lat: 39.7684, lon: -86.1581 },
  { name: "Kansas City", lat: 39.0997, lon: -94.5786 },
  { name: "St. Louis", lat: 38.627, lon: -90.1994 },
  { name: "Minneapolis", lat: 44.9778, lon: -93.265 },
  // Southwest
  { name: "Dallas", lat: 32.7767, lon: -96.797 },
  { name: "Houston", lat: 29.7604, lon: -95.3698 },
  { name: "San Antonio", lat: 29.4241, lon: -98.4936 },
  { name: "Phoenix", lat: 33.4484, lon: -112.074 },
  { name: "Albuquerque", lat: 35.0844, lon: -106.6504 },
  { name: "Denver", lat: 39.7392, lon: -104.9903 },
  // West Coast
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { name: "San Diego", lat: 32.7157, lon: -117.1611 },
  { name: "San Francisco", lat: 37.7749, lon: -122.4194 },
  { name: "Seattle", lat: 47.6062, lon: -122.3321 },
  { name: "Portland", lat: 45.5152, lon: -122.6784 },
  { name: "Las Vegas", lat: 36.1699, lon: -115.1398 },
];

// Sample rest stops along major routes
const REST_STOPS = [
  { id: 'rest-1', name: 'Flying J Travel Center', lat: 30.1897, lon: -82.6392, type: 'rest' as const },
  { id: 'rest-2', name: 'Pilot Travel Center', lat: 30.8508, lon: -83.2786, type: 'rest' as const },
  { id: 'rest-3', name: 'Love\'s Travel Stop', lat: 29.5500, lon: -81.2100, type: 'rest' as const },
  { id: 'rest-4', name: 'TA Travel Center', lat: 26.1200, lon: -80.1400, type: 'rest' as const },
];

// Find cities near the route
function findCitiesOnRoute(routeCoords: [number, number][], maxDistanceMiles: number = 15): CityWaypoint[] {
  const citiesOnRoute: CityWaypoint[] = [];
  const degreeThreshold = maxDistanceMiles / 69; // Approximate miles to degrees
  
  for (const city of MAJOR_CITIES) {
    for (const coord of routeCoords) {
      const dist = Math.sqrt(
        Math.pow(coord[0] - city.lon, 2) + 
        Math.pow(coord[1] - city.lat, 2)
      );
      if (dist < degreeThreshold) {
        citiesOnRoute.push(city);
        break;
      }
    }
  }
  
  return citiesOnRoute;
}

interface TruckTrackingMapProps {
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
  progress: number;
  isTracking: boolean;
  onRouteCalculated?: (route: RouteData) => void;
  followMode?: boolean;
  onFollowModeChange?: (enabled: boolean) => void;
  googleApiKey?: string;
}

// Map congestion string to numeric value for styling
function getCongestionValue(congestion: string): number {
  switch (congestion) {
    case 'low': return 0;
    case 'moderate': return 0.5;
    case 'heavy': return 0.8;
    case 'severe': return 1;
    default: return 0;
  }
}

export function TruckTrackingMap({
  originCoords,
  destCoords,
  progress,
  isTracking,
  onRouteCalculated,
  followMode = false,
  onFollowModeChange,
  googleApiKey = ''
}: TruckTrackingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const truckMarker = useRef<mapboxgl.Marker | null>(null);
  const waypointMarkers = useRef<mapboxgl.Marker[]>([]);
  const routeCoords = useRef<[number, number][]>([]);
  const congestionData = useRef<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [showTruckPopup, setShowTruckPopup] = useState(false);
  const [currentTruckPosition, setCurrentTruckPosition] = useState<[number, number] | null>(null);
  const [currentLocationName, setCurrentLocationName] = useState<string>("");
  const [routeWaypoints, setRouteWaypoints] = useState<{ station: WeighStation; routeIndex: number }[]>([]);
  const [internalFollowMode, setInternalFollowMode] = useState(followMode);
  const [currentBearing, setCurrentBearing] = useState(0);
  const [lightingPreset, setLightingPreset] = useState<'day' | 'dusk' | 'night'>('night');
  const userInteractingRef = useRef(false);
  const introPlayedRef = useRef(false); // Track if intro animation has played

  // Apply lighting preset changes using Standard style's native lightPreset
  const applyLightingPreset = useCallback((preset: 'day' | 'dusk' | 'night') => {
    if (!map.current) return;
    
    // Map our presets to Standard style's lightPreset values
    const lightPresetMap: Record<string, LightPreset> = {
      day: 'day',
      dusk: 'dusk', 
      night: 'night'
    };
    
    // Use Standard style's built-in light preset API
    map.current.setConfigProperty('basemap', 'lightPreset', lightPresetMap[preset]);
  }, []);

  // Handle lighting change
  const handleLightingChange = useCallback((value: string) => {
    if (value && (value === 'day' || value === 'dusk' || value === 'night')) {
      setLightingPreset(value);
      applyLightingPreset(value);
    }
  }, [applyLightingPreset]);

  // Sync internal follow mode with prop
  useEffect(() => {
    setInternalFollowMode(followMode);
  }, [followMode]);

  // Toggle follow mode
  const toggleFollowMode = useCallback(() => {
    const newMode = !internalFollowMode;
    setInternalFollowMode(newMode);
    onFollowModeChange?.(newMode);
  }, [internalFollowMode, onFollowModeChange]);

  // Calculate bearing between two points
  const calculateBearing = useCallback((start: [number, number], end: [number, number]) => {
    const startLat = start[1] * Math.PI / 180;
    const startLng = start[0] * Math.PI / 180;
    const endLat = end[1] * Math.PI / 180;
    const endLng = end[0] * Math.PI / 180;
    
    const dLng = endLng - startLng;
    const x = Math.sin(dLng) * Math.cos(endLat);
    const y = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
    
    return (Math.atan2(x, y) * 180 / Math.PI + 360) % 360;
  }, []);

  // Fetch driving route from Mapbox Directions API with traffic/congestion data
  const fetchRoute = useCallback(async (origin: [number, number], dest: [number, number]) => {
    try {
      // Include annotations=congestion to get traffic data
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${origin[0]},${origin[1]};${dest[0]},${dest[1]}?geometries=geojson&overview=full&annotations=congestion&access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates as [number, number][];
        routeCoords.current = coords;
        
        // Store congestion data if available
        const congestion = route.legs?.[0]?.annotation?.congestion || [];
        congestionData.current = congestion;
        
        onRouteCalculated?.({
          coordinates: coords,
          distance: route.distance / 1609.34, // Convert to miles
          duration: route.duration,
          congestionLevels: congestion
        });
        
        return { coords, congestion };
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch route:", error);
      setMapError("Failed to calculate route");
      return null;
    }
  }, [onRouteCalculated]);

  // Initialize map with simplified WebGL handling
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Check if map already exists to avoid duplicate initialization
    if (map.current) {
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      // Use Mapbox Standard style with built-in 3D buildings, terrain, and lighting
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAPBOX_STYLES.standard,
        center: [-98.5, 39.8],
        zoom: 4,
        pitch: 30, // Start with slight tilt for depth
        bearing: -10,
        interactive: true,
        antialias: true // Smoother 3D rendering
      });

      map.current.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        if (e.error?.message?.includes('WebGL')) {
          setMapError('Map rendering error. Please refresh the page.');
        }
      });

      // Detect user interaction to disable follow mode temporarily
      // User can pause by interacting, but will auto-resume after 5 seconds
      map.current.on('dragstart', () => {
        userInteractingRef.current = true;
        if (internalFollowMode) {
          setInternalFollowMode(false);
          onFollowModeChange?.(false);
        }
      });

      map.current.on('zoomstart', () => {
        // Assume any zoom during tracking might be user-initiated
        if (isTracking && internalFollowMode) {
          userInteractingRef.current = true;
        }
      });

      map.current.on('dragend', () => {
        userInteractingRef.current = false;
        // Auto-resume follow mode after 5 seconds of inactivity
        if (isTracking) {
          setTimeout(() => {
            if (!userInteractingRef.current) {
              setInternalFollowMode(true);
              onFollowModeChange?.(true);
            }
          }, 5000);
        }
      });

      map.current.on('zoomend', () => {
        userInteractingRef.current = false;
        // Auto-resume follow mode after 5 seconds of inactivity
        if (isTracking) {
          setTimeout(() => {
            if (!userInteractingRef.current) {
              setInternalFollowMode(true);
              onFollowModeChange?.(true);
            }
          }, 5000);
        }
      });

      map.current.on("load", () => {
        setIsLoaded(true);

        // Apply Standard style configuration with night preset for dramatic effect
        if (map.current) {
          applyStandardStyleConfig(map.current, {
            lightPreset: 'night',
            show3dObjects: true,
            showPlaceLabels: true,
            showRoadLabels: true,
            showPointOfInterestLabels: false,
            theme: 'default'
          });
        }

        // Add route source (empty initially)
        map.current?.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: [] }
          }
        });

        // Route black outline layer (creates contrast on satellite)
        map.current?.addLayer({
          id: "route-glow-outer",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#000000",
            "line-width": 10,
            "line-opacity": 0.6,
            "line-blur": 2
          }
        });

        // Route inner glow layer (cyan glow)
        map.current?.addLayer({
          id: "route-glow",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#00e5a0",
            "line-width": 8,
            "line-opacity": 0.3,
            "line-blur": 4
          }
        });

        // Main route line (cyan)
        map.current?.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#00e5a0",
            "line-width": 4,
            "line-opacity": 1
          }
        });

        // Add traffic segments source
        map.current?.addSource("traffic-segments", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        });

        // Traffic overlay layer - color by congestion
        map.current?.addLayer({
          id: "traffic-overlay",
          type: "line",
          source: "traffic-segments",
          paint: {
            "line-color": [
              "interpolate",
              ["linear"],
              ["get", "congestion"],
              0, "#22c55e",    // Green - free flow
              0.5, "#f59e0b",  // Yellow/Orange - moderate
              0.8, "#ef4444",  // Red - heavy
              1, "#dc2626"     // Dark red - severe
            ],
            "line-width": 6,
            "line-opacity": 0.85
          }
        });
      });
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setMapError('Failed to initialize map. Please refresh the page or try a different browser.');
    }

    return () => {
      truckMarker.current?.remove();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Cinematic intro fly-through animation
  const triggerIntroAnimation = useCallback(() => {
    if (!map.current || !originCoords || introPlayedRef.current) return;
    
    introPlayedRef.current = true;
    
    // Start from continental overview
    map.current.jumpTo({
      center: [-98, 39], // Center of US
      zoom: 4,
      pitch: 0,
      bearing: 0
    });
    
    // Cinematic fly-in to origin after brief pause
    setTimeout(() => {
      if (!map.current) return;
      cinematicFlyTo(map.current, originCoords, {
        zoom: 15,
        pitch: 55,
        bearing: -20,
        duration: 3500,
        curve: 1.8
      });
    }, 500);
  }, [originCoords]);

  // Add route and markers when coordinates change
  useEffect(() => {
    if (!map.current || !isLoaded || !originCoords || !destCoords) return;

    const setupRoute = async () => {
      const result = await fetchRoute(originCoords, destCoords);
      if (!result || !map.current) return;
      
      // Trigger intro animation on first route setup
      triggerIntroAnimation();

      const { coords, congestion } = result;

      // Update route line
      const source = map.current.getSource("route") as mapboxgl.GeoJSONSource;
      source?.setData({
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: coords }
      });

      // Add traffic-colored segments if congestion data available
      if (congestion && congestion.length > 0 && map.current.getSource("traffic-segments")) {
        const features = coords.slice(0, -1).map((coord: [number, number], i: number) => ({
          type: "Feature" as const,
          properties: {
            congestion: getCongestionValue(congestion[i] || 'low')
          },
          geometry: {
            type: "LineString" as const,
            coordinates: [coord, coords[i + 1]]
          }
        }));

        const trafficSource = map.current.getSource("traffic-segments") as mapboxgl.GeoJSONSource;
        trafficSource?.setData({
          type: "FeatureCollection",
          features
        });
      }

      // Clear existing markers
      truckMarker.current?.remove();
      waypointMarkers.current.forEach(m => m.remove());
      waypointMarkers.current = [];

      // Find weigh stations along the route
      const weighStationsOnRoute = findWeighStationsOnRoute(coords, 8);
      setRouteWaypoints(weighStationsOnRoute);

      // Add weigh station waypoint markers
      weighStationsOnRoute.forEach(({ station }) => {
        const el = document.createElement("div");
        el.className = "tracking-waypoint-marker weigh-station";
        el.innerHTML = `
          <div class="waypoint-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 3v18"/>
              <path d="M18 3v18"/>
              <path d="M3 12h18"/>
              <path d="m6 8 6-5 6 5"/>
            </svg>
          </div>
          <div class="waypoint-label">${station.name}</div>
        `;
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([station.lon, station.lat])
          .addTo(map.current!);
        waypointMarkers.current.push(marker);
      });

      // Add rest stop waypoint markers (filter those near route)
      REST_STOPS.forEach(stop => {
        // Check if rest stop is near route
        let isNearRoute = false;
        for (const coord of coords) {
          const dist = Math.sqrt(Math.pow(coord[0] - stop.lon, 2) + Math.pow(coord[1] - stop.lat, 2));
          if (dist < 0.15) { // ~10 miles
            isNearRoute = true;
            break;
          }
        }
        if (!isNearRoute) return;

        const el = document.createElement("div");
        el.className = "tracking-waypoint-marker rest-stop";
        el.innerHTML = `
          <div class="waypoint-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
              <line x1="6" y1="1" x2="6" y2="4"/>
              <line x1="10" y1="1" x2="10" y2="4"/>
              <line x1="14" y1="1" x2="14" y2="4"/>
            </svg>
          </div>
          <div class="waypoint-label">${stop.name}</div>
        `;
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([stop.lon, stop.lat])
          .addTo(map.current!);
        waypointMarkers.current.push(marker);
      });

      // Add city waypoint markers along route
      const citiesOnRoute = findCitiesOnRoute(coords, 20);
      citiesOnRoute.forEach(city => {
        const el = document.createElement("div");
        el.className = "tracking-waypoint-marker city-waypoint";
        el.innerHTML = `
          <div class="city-waypoint-dot"></div>
          <div class="city-waypoint-label">${city.name}</div>
        `;
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([city.lon, city.lat])
          .addTo(map.current!);
        waypointMarkers.current.push(marker);
      });

      // Add origin marker
      const originEl = document.createElement("div");
      originEl.className = "tracking-origin-marker";
      originEl.innerHTML = `
        <div class="tracking-marker-pulse"></div>
        <div class="tracking-marker-dot origin"></div>
      `;
      new mapboxgl.Marker({ element: originEl })
        .setLngLat(originCoords)
        .addTo(map.current);

      // Add destination marker
      const destEl = document.createElement("div");
      destEl.className = "tracking-dest-marker";
      destEl.innerHTML = `
        <div class="tracking-marker-dot destination"></div>
      `;
      new mapboxgl.Marker({ element: destEl })
        .setLngLat(destCoords)
        .addTo(map.current);

      // Add truck marker (clickable)
      const truckEl = document.createElement("div");
      truckEl.className = "tracking-truck-marker cursor-pointer";
      truckEl.innerHTML = `
        <div class="tracking-truck-glow"></div>
        <div class="tracking-truck-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
            <circle cx="17" cy="18" r="2"/>
            <circle cx="7" cy="18" r="2"/>
          </svg>
        </div>
      `;
      
      // Add click handler to truck marker
      truckEl.addEventListener('click', (e) => {
        e.stopPropagation();
        setShowTruckPopup(prev => !prev);
      });
      
      truckMarker.current = new mapboxgl.Marker({ 
        element: truckEl, 
        rotationAlignment: "map",
        anchor: 'center'
      })
        .setLngLat(originCoords)
        .addTo(map.current);

      // Fit bounds
      const bounds = new mapboxgl.LngLatBounds();
      coords.forEach((coord: [number, number]) => bounds.extend(coord));
      map.current.fitBounds(bounds, { padding: 80, maxZoom: 8 });
    };

    setupRoute();
  }, [originCoords, destCoords, isLoaded, fetchRoute]);

  // Update truck position based on progress - use interpolation for smooth movement
  useEffect(() => {
    if (!map.current || !isLoaded || !routeCoords.current.length || !truckMarker.current) return;

    const coords = routeCoords.current;
    const totalPoints = coords.length;
    
    // Interpolate between points for smoother position
    const exactIndex = (progress / 100) * (totalPoints - 1);
    const lowerIndex = Math.floor(exactIndex);
    const upperIndex = Math.min(lowerIndex + 1, totalPoints - 1);
    const fraction = exactIndex - lowerIndex;
    
    const lowerPoint = coords[lowerIndex];
    const upperPoint = coords[upperIndex];
    
    // Linear interpolation between points
    const currentLng = lowerPoint[0] + (upperPoint[0] - lowerPoint[0]) * fraction;
    const currentLat = lowerPoint[1] + (upperPoint[1] - lowerPoint[1]) * fraction;
    const currentPos: [number, number] = [currentLng, currentLat];

    // Update truck position
    truckMarker.current.setLngLat(currentPos);
    
    // Track current position for popup
    setCurrentTruckPosition(currentPos);
    setCurrentLocationName(`${currentLat.toFixed(4)}°N, ${Math.abs(currentLng).toFixed(4)}°W`);

    // Calculate and set bearing using interpolated positions
    let bearing = currentBearing;
    if (lowerIndex < totalPoints - 1) {
      bearing = calculateBearing(lowerPoint, upperPoint);
      truckMarker.current.setRotation(bearing);
      setCurrentBearing(bearing);
    }

    // Follow mode: Cinematic 3D camera following truck
    if (internalFollowMode && isTracking && !userInteractingRef.current) {
      map.current.easeTo({
        center: currentPos,
        bearing: bearing,
        zoom: 16, // Closer zoom for 3D building visibility
        pitch: 60, // Dramatic tilt for cinematic 3D view
        duration: 600,
        easing: (t) => t * (2 - t) // Ease out quad
      });
    }

    // Update traveled portion - use the floor index for traveled path
    const traveledCoords = coords.slice(0, lowerIndex + 1);
    // Add the current interpolated position as the last point
    if (traveledCoords.length > 0) {
      traveledCoords.push(currentPos);
    }
    const traveledSource = map.current.getSource("route-traveled") as mapboxgl.GeoJSONSource;
    traveledSource?.setData({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: traveledCoords }
    });

  }, [progress, isLoaded, calculateBearing, internalFollowMode, isTracking, currentBearing]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10">
      {!isLoaded && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center z-20">
          <div className="text-center p-6 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
              <Box className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Map Unavailable</h3>
            <p className="text-sm text-white/60 mb-4">{mapError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}

      {/* Status chips */}
      {isTracking && (
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <span className="tracking-status-chip live">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            LIVE
          </span>
          <span className="tracking-status-chip">
            IN TRANSIT
          </span>
          <span className="tracking-status-chip success">
            ON SCHEDULE
          </span>
        </div>
      )}

      {/* Follow Mode Toggle Button - Original style */}
      <button
        id="tracking-map-go-btn"
        onClick={toggleFollowMode}
        className={cn(
          "absolute top-4 right-16 z-20 flex items-center gap-2 px-4 py-2.5 rounded-lg border font-semibold text-sm transition-all duration-200",
          internalFollowMode
            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
            : "bg-background/80 hover:bg-muted border-border text-foreground"
        )}
      >
        {internalFollowMode ? (
          <>
            <Pause className="w-4 h-4" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Follow Truck</span>
          </>
        )}
      </button>

      {/* Lighting Preset Toggle */}
      <div className="absolute bottom-20 right-4 z-20">
        <ToggleGroup 
          type="single" 
          value={lightingPreset} 
          onValueChange={handleLightingChange}
          className="bg-black/70 backdrop-blur-md rounded-lg border border-white/20 p-1"
        >
          <ToggleGroupItem 
            value="day" 
            aria-label="Day mode"
            className="data-[state=on]:bg-amber-500/30 data-[state=on]:text-amber-300 text-white/70 hover:text-white px-2.5 py-1.5"
          >
            <Sun className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="dusk" 
            aria-label="Dusk mode"
            className="data-[state=on]:bg-orange-500/30 data-[state=on]:text-orange-300 text-white/70 hover:text-white px-2.5 py-1.5"
          >
            <Sunrise className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="night" 
            aria-label="Night mode"
            className="data-[state=on]:bg-indigo-500/30 data-[state=on]:text-indigo-300 text-white/70 hover:text-white px-2.5 py-1.5"
          >
            <Moon className="w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Traffic Legend */}
      <TrafficLegend isVisible={isTracking} />

      {/* Progress overlay */}
      {isTracking && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="px-6 py-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-3">
            {internalFollowMode && (
              <Navigation className="w-4 h-4 text-primary animate-pulse" />
            )}
            <span className="text-sm font-semibold text-white">
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>
      )}

      {/* Truck Location Popup */}
      {currentTruckPosition && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="pointer-events-auto">
            <TruckLocationPopup
              coordinates={currentTruckPosition}
              locationName={currentLocationName}
              isOpen={showTruckPopup}
              onClose={() => setShowTruckPopup(false)}
            />
          </div>
        </div>
      )}

      {/* Mini Route Overview - visible when zoomed in/following */}
      <MiniRouteOverview
        originCoords={originCoords}
        destCoords={destCoords}
        truckPosition={currentTruckPosition}
        progress={progress}
        isVisible={isTracking && internalFollowMode}
        onExpand={() => {
          setInternalFollowMode(false);
          onFollowModeChange?.(false);
          // Zoom out to show full route
          if (map.current && originCoords && destCoords) {
            const bounds = new mapboxgl.LngLatBounds();
            routeCoords.current.forEach(coord => bounds.extend(coord));
            map.current.fitBounds(bounds, { padding: 80, maxZoom: 8 });
          }
        }}
      />

      {/* Street View inset removed - cleaner map focus */}

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
