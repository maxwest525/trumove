import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '@/lib/mapboxToken';
import { Map, Layers, MapPin } from 'lucide-react';

mapboxgl.accessToken = MAPBOX_TOKEN;

interface MoveMapTriptychProps {
  fromZip?: string;
  toZip?: string;
  fromCity?: string;
  toCity?: string;
  visible?: boolean;
}

// Geocode a location string to coordinates
async function geocodeLocation(location: string): Promise<[number, number] | null> {
  if (!location || location.length < 3) return null;
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${MAPBOX_TOKEN}&country=US&limit=1`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].center as [number, number];
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  return null;
}

// Fetch driving route from Mapbox Directions API
async function fetchDrivingRoute(from: [number, number], to: [number, number]): Promise<[number, number][] | null> {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates;
    }
  } catch (error) {
    console.error('Directions API error:', error);
  }
  return null;
}

// Create arc line fallback
function createArcLine(start: [number, number], end: [number, number], steps = 50): [number, number][] {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lng = start[0] + (end[0] - start[0]) * t;
    const lat = start[1] + (end[1] - start[1]) * t;
    const arc = Math.sin(t * Math.PI) * 0.5;
    coords.push([lng, lat + arc]);
  }
  return coords;
}

// Individual location preview map component
interface LocationMapProps {
  location: string;
  label: string;
  accentColor: string;
  isSatellite?: boolean;
  onToggleStyle?: () => void;
}

function LocationMap({ location, label, accentColor, isSatellite = true, onToggleStyle }: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Geocode on location change
  useEffect(() => {
    if (!location) {
      setCoords(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    geocodeLocation(location).then((result) => {
      setCoords(result);
      setIsLoading(false);
    });
  }, [location]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: isSatellite 
        ? 'mapbox://styles/mapbox/satellite-streets-v12'
        : 'mapbox://styles/mapbox/streets-v12',
      center: [-98.5, 39.8], // US center
      zoom: 4,
      pitch: isSatellite ? 45 : 0,
      bearing: 0,
      attributionControl: false,
      interactive: false,
    });

    map.on('load', () => {
      // Add 3D terrain for satellite view
      if (isSatellite) {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14,
        });
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.2 });
      }
    });

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update style when toggle changes
  useEffect(() => {
    if (!mapRef.current) return;
    
    const styleUrl = isSatellite 
      ? 'mapbox://styles/mapbox/satellite-streets-v12'
      : 'mapbox://styles/mapbox/streets-v12';
    
    mapRef.current.setStyle(styleUrl);
    mapRef.current.setPitch(isSatellite ? 45 : 0);
    
    mapRef.current.once('style.load', () => {
      if (isSatellite && mapRef.current) {
        mapRef.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14,
        });
        mapRef.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.2 });
      }
      
      // Re-add marker after style change
      if (coords && mapRef.current) {
        markerRef.current?.remove();
        const el = document.createElement('div');
        el.className = 'tru-location-marker';
        el.innerHTML = `<div class="tru-location-marker-dot" style="background: ${accentColor}"></div>`;
        markerRef.current = new mapboxgl.Marker({ element: el })
          .setLngLat(coords)
          .addTo(mapRef.current);
      }
    });
  }, [isSatellite, coords, accentColor]);

  // Fly to location when coords change
  useEffect(() => {
    if (!mapRef.current || !coords) return;

    markerRef.current?.remove();

    // Create marker
    const el = document.createElement('div');
    el.className = 'tru-location-marker';
    el.innerHTML = `<div class="tru-location-marker-dot" style="background: ${accentColor}"></div>`;
    
    markerRef.current = new mapboxgl.Marker({ element: el })
      .setLngLat(coords)
      .addTo(mapRef.current);

    // Fly to location
    mapRef.current.flyTo({
      center: coords,
      zoom: 14,
      duration: 1500,
      essential: true,
    });
  }, [coords, accentColor]);

  return (
    <div className="tru-triptych-panel">
      <div className="tru-triptych-map-container" ref={containerRef}>
        {isLoading && (
          <div className="tru-triptych-loading">
            <div className="tru-triptych-loading-spinner" />
          </div>
        )}
        {!location && !isLoading && (
          <div className="tru-triptych-placeholder">
            <MapPin className="w-6 h-6 opacity-30" />
            <span>Enter {label.toLowerCase()}</span>
          </div>
        )}
      </div>
      <div className="tru-triptych-label" style={{ borderColor: accentColor }}>
        <span style={{ color: accentColor }}>{label}</span>
        {location && (
          <button 
            className="tru-triptych-style-toggle"
            onClick={onToggleStyle}
            title={isSatellite ? 'Switch to street view' : 'Switch to satellite view'}
          >
            {isSatellite ? <Map className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

// Route map component
interface RouteMapProps {
  fromCoords: [number, number] | null;
  toCoords: [number, number] | null;
  fromLabel: string;
  toLabel: string;
}

function RouteMap({ fromCoords, toCoords, fromLabel, toLabel }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-98.5, 39.8],
      zoom: 3,
      attributionControl: false,
      interactive: false,
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach(m => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Draw route when both coords available
  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;

    // Clear previous
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    
    if (map.getSource('route')) {
      map.removeLayer('route-line');
      map.removeSource('route');
    }

    if (!fromCoords || !toCoords) return;

    setIsLoading(true);

    const drawRoute = async () => {
      // Fetch driving route or use arc fallback
      let routeCoords = await fetchDrivingRoute(fromCoords, toCoords);
      if (!routeCoords) {
        routeCoords = createArcLine(fromCoords, toCoords);
      }

      if (!mapRef.current) return;

      // Wait for style to be loaded
      if (!map.isStyleLoaded()) {
        await new Promise<void>(resolve => {
          map.once('style.load', () => resolve());
        });
      }

      // Add route source and layer
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoords,
          },
        },
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'hsl(142, 76%, 36%)',
          'line-width': 4,
          'line-opacity': 0.9,
        },
      });

      // Add markers
      const createMarker = (coords: [number, number], label: string, color: string) => {
        const el = document.createElement('div');
        el.className = 'tru-route-marker';
        el.innerHTML = `
          <div class="tru-route-marker-dot" style="background: ${color}"></div>
          <div class="tru-route-marker-label">${label}</div>
        `;
        return new mapboxgl.Marker({ element: el }).setLngLat(coords).addTo(map);
      };

      markersRef.current.push(createMarker(fromCoords, fromLabel.split(',')[0], 'hsl(217, 91%, 60%)'));
      markersRef.current.push(createMarker(toCoords, toLabel.split(',')[0], 'hsl(142, 76%, 36%)'));

      // Fit bounds
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(fromCoords);
      bounds.extend(toCoords);
      
      map.fitBounds(bounds, {
        padding: { top: 40, bottom: 40, left: 40, right: 40 },
        duration: 1000,
      });

      setIsLoading(false);
    };

    drawRoute();
  }, [fromCoords, toCoords, fromLabel, toLabel]);

  const hasRoute = fromCoords && toCoords;

  return (
    <div className="tru-triptych-panel tru-triptych-panel-route">
      <div className="tru-triptych-map-container" ref={containerRef}>
        {isLoading && (
          <div className="tru-triptych-loading">
            <div className="tru-triptych-loading-spinner" />
          </div>
        )}
        {!hasRoute && (
          <div className="tru-triptych-placeholder">
            <Map className="w-6 h-6 opacity-30" />
            <span>Enter both locations</span>
          </div>
        )}
      </div>
      <div className="tru-triptych-label tru-triptych-label-route">
        <span>Your Route</span>
      </div>
    </div>
  );
}

// Main triptych component
export default function MoveMapTriptych({ fromZip, toZip, fromCity, toCity, visible = true }: MoveMapTriptychProps) {
  const [fromCoords, setFromCoords] = useState<[number, number] | null>(null);
  const [toCoords, setToCoords] = useState<[number, number] | null>(null);
  const [fromSatellite, setFromSatellite] = useState(true);
  const [toSatellite, setToSatellite] = useState(true);

  // Build location strings
  const fromLocation = fromCity || (fromZip?.length === 5 ? fromZip : '');
  const toLocation = toCity || (toZip?.length === 5 ? toZip : '');

  // Geocode locations for route map
  useEffect(() => {
    if (fromLocation) {
      geocodeLocation(fromLocation).then(setFromCoords);
    } else {
      setFromCoords(null);
    }
  }, [fromLocation]);

  useEffect(() => {
    if (toLocation) {
      geocodeLocation(toLocation).then(setToCoords);
    } else {
      setToCoords(null);
    }
  }, [toLocation]);

  if (!visible) return null;

  return (
    <div className="tru-map-triptych">
      <LocationMap 
        location={fromLocation}
        label="Origin"
        accentColor="hsl(217, 91%, 60%)"
        isSatellite={fromSatellite}
        onToggleStyle={() => setFromSatellite(!fromSatellite)}
      />
      <LocationMap 
        location={toLocation}
        label="Destination"
        accentColor="hsl(142, 76%, 36%)"
        isSatellite={toSatellite}
        onToggleStyle={() => setToSatellite(!toSatellite)}
      />
      <RouteMap 
        fromCoords={fromCoords}
        toCoords={toCoords}
        fromLabel={fromCity || fromZip || 'Origin'}
        toLabel={toCity || toZip || 'Destination'}
      />
    </div>
  );
}
