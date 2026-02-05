import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { cn } from "@/lib/utils";
import { MAPBOX_TOKEN } from "@/lib/mapboxToken";

interface TruckViewMapProps {
  routeCoordinates: [number, number][];
  progress: number;
  isTracking: boolean;
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
}

// Calculate bearing between two points
function calculateBearing(start: [number, number], end: [number, number]): number {
  const startLat = (start[1] * Math.PI) / 180;
  const startLng = (start[0] * Math.PI) / 180;
  const endLat = (end[1] * Math.PI) / 180;
  const endLng = (end[0] * Math.PI) / 180;

  const dLng = endLng - startLng;
  const x = Math.sin(dLng) * Math.cos(endLat);
  const y = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
  
  let bearing = (Math.atan2(x, y) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

// Get point at progress along route
function getPointAtProgress(coords: [number, number][], progress: number): { 
  point: [number, number]; 
  bearing: number;
  segmentIndex: number;
} {
  if (coords.length === 0) return { point: [0, 0], bearing: 0, segmentIndex: 0 };
  if (progress <= 0) return { point: coords[0], bearing: coords.length > 1 ? calculateBearing(coords[0], coords[1]) : 0, segmentIndex: 0 };
  if (progress >= 100) return { point: coords[coords.length - 1], bearing: 0, segmentIndex: coords.length - 1 };
  
  const exactIndex = (progress / 100) * (coords.length - 1);
  const lowIndex = Math.floor(exactIndex);
  const highIndex = Math.min(lowIndex + 1, coords.length - 1);
  const t = exactIndex - lowIndex;
  
  const lng = coords[lowIndex][0] + (coords[highIndex][0] - coords[lowIndex][0]) * t;
  const lat = coords[lowIndex][1] + (coords[highIndex][1] - coords[lowIndex][1]) * t;
  
  // Calculate bearing from current segment
  const bearing = lowIndex < coords.length - 1 
    ? calculateBearing(coords[lowIndex], coords[highIndex])
    : 0;
  
  return { point: [lng, lat], bearing, segmentIndex: lowIndex };
}

// Green circular truck icon SVG
const TRUCK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <filter id="truckGlowTV" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
      <feFlood flood-color="#00e5a0" flood-opacity="0.5" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="shadow"/>
      <feMerge>
        <feMergeNode in="shadow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <circle cx="24" cy="24" r="22" fill="none" stroke="#00e5a0" stroke-width="2" opacity="0.4">
    <animate attributeName="r" values="18;22;18" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="24" cy="24" r="14" fill="#00e5a0" filter="url(#truckGlowTV)"/>
  <g transform="translate(15, 15)" stroke="#1a1a1a" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 13V4a1.25 1.25 0 0 0-1.25-1.25h-5A1.25 1.25 0 0 0 2.5 4v7.7a0.6 0.6 0 0 0 0.6 0.6h1.25"/>
    <path d="M10.6 13H6.9"/>
    <path d="M13.1 13h1.25a0.6 0.6 0 0 0 0.6-0.6v-2.3a0.6 0.6 0 0 0-0.14-0.39l-2.17-2.71A0.6 0.6 0 0 0 12.2 6.25H10"/>
    <circle cx="11.9" cy="13" r="1.25" fill="#1a1a1a"/>
    <circle cx="5" cy="13" r="1.25" fill="#1a1a1a"/>
  </g>
</svg>`;

/**
 * TruckViewMap - Street-level tilted view that follows truck position
 * Uses Mapbox GL JS with navigation-night-v1 style for dark roads aesthetic
 */
export function TruckViewMap({
  routeCoordinates,
  progress,
  isTracking,
  originCoords,
  destCoords
}: TruckViewMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const truckMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastBearingRef = useRef(0);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Default center: US center if no origin
    const initialCenter: [number, number] = originCoords || [-98.5795, 39.8283];
    const initialZoom = originCoords ? 15 : 4;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: initialCenter,
      zoom: initialZoom,
      pitch: 60,
      bearing: 0,
      attributionControl: false,
      interactive: false // Read-only view
    });

    mapRef.current = map;

    map.on("load", () => {
      setIsLoading(false);

      // Create truck marker element
      const truckEl = document.createElement("div");
      truckEl.className = "truck-view-marker";
      truckEl.innerHTML = TRUCK_ICON_SVG;
      truckEl.style.cssText = "cursor: pointer; width: 48px; height: 48px;";

      truckMarkerRef.current = new mapboxgl.Marker({ element: truckEl })
        .setLngLat(initialCenter)
        .addTo(map);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update origin center if origin changes (before tracking starts)
  useEffect(() => {
    if (!mapRef.current || !originCoords || isTracking) return;
    
    mapRef.current.flyTo({
      center: originCoords,
      zoom: 15,
      pitch: 60,
      bearing: 0,
      duration: 1500
    });

    if (truckMarkerRef.current) {
      truckMarkerRef.current.setLngLat(originCoords);
    }
  }, [originCoords, isTracking]);

  // Update camera and truck position based on progress
  useEffect(() => {
    if (!mapRef.current || routeCoordinates.length < 2) return;

    const { point, bearing } = getPointAtProgress(routeCoordinates, progress);
    
    // Smooth bearing transition
    let targetBearing = bearing;
    const bearingDiff = targetBearing - lastBearingRef.current;
    if (Math.abs(bearingDiff) > 180) {
      targetBearing = bearingDiff > 0 ? targetBearing - 360 : targetBearing + 360;
    }
    lastBearingRef.current = bearing;

    // Update truck marker position
    if (truckMarkerRef.current) {
      truckMarkerRef.current.setLngLat(point);
    }

    // Animate camera to follow truck
    mapRef.current.flyTo({
      center: point,
      zoom: 17,
      pitch: 60,
      bearing: targetBearing,
      duration: isTracking ? 800 : 1500,
      essential: true
    });
  }, [progress, routeCoordinates, isTracking]);

  return (
    <div className="tracking-map-panel tracking-map-panel-right relative">
      {/* Panel label */}
      <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10">
        <span className="text-[10px] font-bold tracking-wider text-white/90 uppercase">
          Truck View
        </span>
      </div>

      {/* Live indicator when tracking */}
      {isTracking && (
        <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-lg bg-red-500/80 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[9px] font-bold text-white tracking-wider">LIVE</span>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs text-white/60">Loading view...</span>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

export default TruckViewMap;
