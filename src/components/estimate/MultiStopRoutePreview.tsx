import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN } from "@/lib/mapboxToken";
import { MapPin, Truck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StopLocation } from "./MultiStopLocationList";
import { addTerrain, add3DBuildings, setFogPreset, on3DReady } from "@/lib/mapbox3DConfig";

interface MultiStopRoutePreviewProps {
  pickupLocations: StopLocation[];
  dropoffLocations: StopLocation[];
  optimizedOrder?: number[];
  className?: string;
}

export default function MultiStopRoutePreview({
  pickupLocations,
  dropoffLocations,
  optimizedOrder,
  className,
}: MultiStopRoutePreviewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get all validated locations with coords
  const validPickups = pickupLocations.filter(l => l.validated && l.coords);
  const validDropoffs = dropoffLocations.filter(l => l.validated && l.coords);
  const allValidLocations = [...validPickups, ...validDropoffs];

  const hasLocations = allValidLocations.length >= 1;

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-98.5795, 39.8283], // Center of US
      zoom: 3,
      pitch: 30, // Slight tilt for depth
      interactive: true,
      attributionControl: false,
      antialias: true
    });

    map.current.on("load", () => {
      setIsLoading(false);

      // Apply 3D features for urban stop previews
      on3DReady(map.current!, () => {
        if (!map.current) return;
        
        // Add subtle terrain
        addTerrain(map.current, 1.0);
        
        // Add light fog for depth
        setFogPreset(map.current, 'day');
        
        // Add 3D buildings (visible when zoomed into urban areas)
        add3DBuildings(map.current, {
          color: '#c8c8c8',
          opacity: 0.7,
          minZoom: 14,
          lightPreset: 'day'
        });
      });

      
      // Add route line source
      map.current?.addSource("route-line", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        },
      });

      // Add dashed connecting line
      map.current?.addLayer({
        id: "route-line",
        type: "line",
        source: "route-line",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#6366f1",
          "line-width": 3,
          "line-dasharray": [2, 2],
        },
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers and route line when locations change
  useEffect(() => {
    if (!map.current || isLoading) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!hasLocations) {
      // Reset route line
      const source = map.current.getSource("route-line") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: [] },
        });
      }
      return;
    }

    // Determine order of waypoints
    const orderedLocations = optimizedOrder
      ? optimizedOrder.map(i => allValidLocations[i]).filter(Boolean)
      : allValidLocations;

    // Create markers
    let pickupIndex = 0;
    let dropoffIndex = 0;

    orderedLocations.forEach((loc, index) => {
      const isPickup = validPickups.includes(loc);
      const displayIndex = isPickup ? ++pickupIndex : ++dropoffIndex;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = `multistop-marker ${isPickup ? "pickup" : "dropoff"}`;
      el.innerHTML = `
        <div class="marker-circle">
          <span class="marker-number">${displayIndex}</span>
        </div>
      `;

      // Add CSS styles inline
      el.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      const circle = el.querySelector(".marker-circle") as HTMLElement;
      if (circle) {
        circle.style.cssText = `
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${isPickup ? "#22c55e" : "#ef4444"};
          color: white;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 2px solid white;
        `;
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat([loc.coords![1], loc.coords![0]]) // coords are [lat, lng], mapbox needs [lng, lat]
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Draw connecting line
    const lineCoords = orderedLocations
      .filter(l => l.coords)
      .map(l => [l.coords![1], l.coords![0]]); // [lng, lat]

    const source = map.current.getSource("route-line") as mapboxgl.GeoJSONSource;
    if (source && lineCoords.length >= 2) {
      source.setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: lineCoords,
        },
      });
    }

    // Fit bounds to show all markers
    if (lineCoords.length >= 1) {
      const bounds = new mapboxgl.LngLatBounds();
      lineCoords.forEach(coord => bounds.extend(coord as [number, number]));
      
      map.current.fitBounds(bounds, {
        padding: { top: 40, bottom: 40, left: 40, right: 40 },
        maxZoom: 12,
        duration: 500,
      });
    }
  }, [allValidLocations, validPickups, optimizedOrder, isLoading, hasLocations]);

  if (!hasLocations) {
    return (
      <div className={cn(
        "h-[200px] bg-muted/30 rounded-lg border border-border/40 flex flex-col items-center justify-center gap-2",
        className
      )}>
        <div className="flex items-center gap-3 text-muted-foreground">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-sm">Add locations to see route preview</span>
          <Truck className="w-5 h-5 text-destructive" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-lg overflow-hidden border border-border/40", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
      
      <div ref={mapContainer} className="h-[200px] w-full" />

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-3 px-2 py-1 bg-background/90 backdrop-blur-sm rounded-md text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Pickup</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Drop-off</span>
        </div>
      </div>

      {/* Location count badge */}
      <div className="absolute top-2 right-2 px-2 py-1 bg-background/90 backdrop-blur-sm rounded-md text-[10px] font-medium text-muted-foreground">
        {validPickups.length} pickup{validPickups.length !== 1 ? 's' : ''} • {validDropoffs.length} drop-off{validDropoffs.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
