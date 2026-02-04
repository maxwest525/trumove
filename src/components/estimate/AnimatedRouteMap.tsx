import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/lib/mapboxToken';
import { addTerrain, setFogPreset, on3DReady } from '@/lib/mapbox3DConfig';

interface AnimatedRouteMapProps {
  fromCoords: [number, number]; // [lng, lat]
  toCoords: [number, number];
  routeGeometry: string; // encoded polyline
  progress: number; // 0-100
  onMapReady?: () => void;
}

// Decode polyline to array of [lng, lat] coordinates
function decodePolyline(encoded: string): [number, number][] {
  const coords: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coords.push([lng / 1e5, lat / 1e5]);
  }

  return coords;
}

// Get a point along the route at a given progress percentage
function getPointAtProgress(coords: [number, number][], progress: number): [number, number] {
  if (coords.length === 0) return [0, 0];
  if (progress <= 0) return coords[0];
  if (progress >= 100) return coords[coords.length - 1];
  
  const index = Math.floor((coords.length - 1) * (progress / 100));
  return coords[Math.min(index, coords.length - 1)];
}

// Get partial route coordinates up to a given progress percentage
function getPartialRoute(coords: [number, number][], progress: number): [number, number][] {
  if (coords.length === 0) return [];
  if (progress <= 0) return [coords[0]];
  if (progress >= 100) return coords;
  
  const endIndex = Math.floor((coords.length - 1) * (progress / 100)) + 1;
  return coords.slice(0, Math.max(2, endIndex));
}

const AnimatedRouteMap: React.FC<AnimatedRouteMapProps> = ({
  fromCoords,
  toCoords,
  routeGeometry,
  progress,
  onMapReady
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const truckMarker = useRef<mapboxgl.Marker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const routeCoords = useRef<[number, number][]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const coords = decodePolyline(routeGeometry);
    routeCoords.current = coords;

    // Calculate bounds
    const lngs = coords.map(c => c[0]);
    const lats = coords.map(c => c[1]);
    const bounds = new mapboxgl.LngLatBounds(
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)]
    );

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      bounds: bounds,
      fitBoundsOptions: { padding: 50, maxZoom: 10 },
      interactive: false,
      attributionControl: false,
      pitch: 35, // Tilted view for depth
      bearing: -10,
      antialias: true
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Apply 3D terrain and atmospheric effects
      on3DReady(map.current, () => {
        if (!map.current) return;
        
        // Add terrain with moderate exaggeration for route visualization
        addTerrain(map.current, 1.3);
        
        // Apply satellite-appropriate fog
        setFogPreset(map.current, 'satellite');
      });


      // Add shadow source for contrast on satellite
      map.current.addSource('route-shadow', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coords
          }
        }
      });

      // Black shadow - outermost layer for depth
      map.current.addLayer({
        id: 'route-shadow-outer',
        type: 'line',
        source: 'route-shadow',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 14,
          'line-opacity': 0.3,
          'line-blur': 6
        }
      });

      // Black shadow - mid layer
      map.current.addLayer({
        id: 'route-shadow-mid',
        type: 'line',
        source: 'route-shadow',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 10,
          'line-opacity': 0.5,
          'line-blur': 3
        }
      });

      // Add background route (faint)
      map.current.addSource('route-bg', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coords
          }
        }
      });

      map.current.addLayer({
        id: 'route-bg',
        type: 'line',
        source: 'route-bg',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#00e5a0',
          'line-width': 6,
          'line-opacity': 0.25
        }
      });

      // Add animated route (visible portion)
      map.current.addSource('route-animated', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [coords[0]] // Start with just origin
          }
        }
      });

      // Animated route shadow - outer
      map.current.addLayer({
        id: 'route-animated-shadow-outer',
        type: 'line',
        source: 'route-animated',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 16,
          'line-opacity': 0.35,
          'line-blur': 6
        }
      });

      // Animated route shadow - inner
      map.current.addLayer({
        id: 'route-animated-shadow-inner',
        type: 'line',
        source: 'route-animated',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#000000',
          'line-width': 10,
          'line-opacity': 0.6,
          'line-blur': 2
        }
      });

      // Main animated route line
      map.current.addLayer({
        id: 'route-animated',
        type: 'line',
        source: 'route-animated',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#00e5a0',
          'line-width': 5,
          'line-opacity': 1
        }
      });

      // Add glow layer
      map.current.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route-animated',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#00e5a0',
          'line-width': 12,
          'line-opacity': 0.35,
          'line-blur': 4
        }
      }, 'route-animated');

      // Add origin marker
      new mapboxgl.Marker({ color: '#00e5a0' })
        .setLngLat(fromCoords)
        .addTo(map.current);

      // Add destination marker
      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(toCoords)
        .addTo(map.current);

      // Create truck marker element
      const truckEl = document.createElement('div');
      truckEl.className = 'animated-route-truck-marker';
      truckEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
          <path d="M15 18H9"/>
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
          <circle cx="17" cy="18" r="2"/>
          <circle cx="7" cy="18" r="2"/>
        </svg>
      `;

      truckMarker.current = new mapboxgl.Marker({ element: truckEl })
        .setLngLat(coords[0])
        .addTo(map.current);

      setIsReady(true);
      onMapReady?.();
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [routeGeometry, fromCoords, toCoords, onMapReady]);

  // Update route based on progress
  useEffect(() => {
    if (!isReady || !map.current || routeCoords.current.length === 0) return;

    const partialCoords = getPartialRoute(routeCoords.current, progress);
    const truckPosition = getPointAtProgress(routeCoords.current, progress);

    // Update animated route line
    const source = map.current.getSource('route-animated') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: partialCoords
        }
      });
    }

    // Update truck position
    if (truckMarker.current) {
      truckMarker.current.setLngLat(truckPosition);
    }
  }, [progress, isReady]);

  return (
    <div 
      ref={mapContainer} 
      className="animated-route-map-container"
    />
  );
};

export default AnimatedRouteMap;
