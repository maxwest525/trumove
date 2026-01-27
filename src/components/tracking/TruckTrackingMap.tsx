import { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN } from "@/lib/mapboxToken";
import { Loader2 } from "lucide-react";

interface RouteData {
  coordinates: [number, number][];
  distance: number;
  duration: number;
}

interface TruckTrackingMapProps {
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
  progress: number;
  isTracking: boolean;
  onRouteCalculated?: (route: RouteData) => void;
}

export function TruckTrackingMap({
  originCoords,
  destCoords,
  progress,
  isTracking,
  onRouteCalculated
}: TruckTrackingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const truckMarker = useRef<mapboxgl.Marker | null>(null);
  const routeCoords = useRef<[number, number][]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

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

  // Fetch driving route from Mapbox Directions API
  const fetchRoute = useCallback(async (origin: [number, number], dest: [number, number]) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${dest[0]},${dest[1]}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates as [number, number][];
        routeCoords.current = coords;
        
        onRouteCalculated?.({
          coordinates: coords,
          distance: route.distance / 1609.34, // Convert to miles
          duration: route.duration
        });
        
        return coords;
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch route:", error);
      setMapError("Failed to calculate route");
      return null;
    }
  }, [onRouteCalculated]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-98.5, 39.8],
      zoom: 4,
      pitch: 0,
      interactive: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");

    map.current.on("load", () => {
      setIsLoaded(true);

      // Add route source (empty initially)
      map.current?.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: [] }
        }
      });

      // Route glow layer
      map.current?.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#22c55e",
          "line-width": 12,
          "line-opacity": 0.3,
          "line-blur": 8
        }
      });

      // Main route line
      map.current?.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#22c55e",
          "line-width": 4,
          "line-opacity": 1
        }
      });

      // Traveled portion (darker)
      map.current?.addSource("route-traveled", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: [] }
        }
      });

      map.current?.addLayer({
        id: "route-traveled-line",
        type: "line",
        source: "route-traveled",
        paint: {
          "line-color": "#16a34a",
          "line-width": 5,
          "line-opacity": 0.8
        }
      });
    });

    return () => {
      truckMarker.current?.remove();
      map.current?.remove();
    };
  }, []);

  // Add route and markers when coordinates change
  useEffect(() => {
    if (!map.current || !isLoaded || !originCoords || !destCoords) return;

    const setupRoute = async () => {
      const coords = await fetchRoute(originCoords, destCoords);
      if (!coords || !map.current) return;

      // Update route line
      const source = map.current.getSource("route") as mapboxgl.GeoJSONSource;
      source?.setData({
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: coords }
      });

      // Clear existing markers
      truckMarker.current?.remove();

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

      // Add truck marker
      const truckEl = document.createElement("div");
      truckEl.className = "tracking-truck-marker";
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
      truckMarker.current = new mapboxgl.Marker({ element: truckEl, rotationAlignment: "map" })
        .setLngLat(originCoords)
        .addTo(map.current);

      // Fit bounds
      const bounds = new mapboxgl.LngLatBounds();
      coords.forEach(coord => bounds.extend(coord));
      map.current.fitBounds(bounds, { padding: 80, maxZoom: 8 });
    };

    setupRoute();
  }, [originCoords, destCoords, isLoaded, fetchRoute]);

  // Update truck position based on progress
  useEffect(() => {
    if (!map.current || !isLoaded || !routeCoords.current.length || !truckMarker.current) return;

    const coords = routeCoords.current;
    const totalPoints = coords.length;
    const currentIndex = Math.min(
      Math.floor((progress / 100) * (totalPoints - 1)),
      totalPoints - 1
    );

    const currentPos = coords[currentIndex];
    const nextPos = coords[Math.min(currentIndex + 1, totalPoints - 1)];

    // Update truck position
    truckMarker.current.setLngLat(currentPos);

    // Calculate and set bearing
    if (currentIndex < totalPoints - 1) {
      const bearing = calculateBearing(currentPos, nextPos);
      truckMarker.current.setRotation(bearing);
    }

    // Update traveled portion
    const traveledCoords = coords.slice(0, currentIndex + 1);
    const traveledSource = map.current.getSource("route-traveled") as mapboxgl.GeoJSONSource;
    traveledSource?.setData({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: traveledCoords }
    });

  }, [progress, isLoaded, calculateBearing]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10">
      {!isLoaded && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      
      {mapError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {mapError}
        </div>
      )}

      {/* Status chips */}
      {isTracking && (
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <span className="tracking-status-chip live">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
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

      {/* Progress overlay */}
      {isTracking && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="px-6 py-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-full">
            <span className="text-sm font-semibold text-white">
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
