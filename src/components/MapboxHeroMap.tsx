import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxHeroMapProps {
  accessToken?: string;
}

export default function MapboxHeroMap({ accessToken }: MapboxHeroMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState(accessToken || '');
  const [isMapReady, setIsMapReady] = useState(false);

  // Route data - popular long-distance moves
  const routes = [
    { from: [-74.006, 40.7128] as [number, number], to: [-118.2437, 34.0522] as [number, number], labels: ['NYC', 'LA'] },
    { from: [-87.6298, 41.8781] as [number, number], to: [-80.1918, 25.7617] as [number, number], labels: ['CHI', 'MIA'] },
    { from: [-122.3321, 47.6062] as [number, number], to: [-96.7970, 32.7767] as [number, number], labels: ['SEA', 'DAL'] },
  ];

  // Helper to create arc between two points
  function createArcLine(start: [number, number], end: [number, number], steps: number): [number, number][] {
    const coords: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lng = start[0] + (end[0] - start[0]) * t;
      const lat = start[1] + (end[1] - start[1]) * t;
      // Add arc curve
      const arc = Math.sin(t * Math.PI) * 4;
      coords.push([lng, lat + arc]);
    }
    return coords;
  }

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283], // Center of US
      zoom: 3.2,
      pitch: 20,
      interactive: false, // Disable interaction for hero
    });

    map.current.on('load', () => {
      if (!map.current) return;
      setIsMapReady(true);
      
      // Add route lines
      routes.forEach((route, i) => {
        const lineCoords = createArcLine(route.from, route.to, 50);
        
        map.current?.addSource(`route-${i}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: lineCoords
            }
          }
        });

        map.current?.addLayer({
          id: `route-line-${i}`,
          type: 'line',
          source: `route-${i}`,
          paint: {
            'line-color': '#00ff6a',
            'line-width': 3,
            'line-opacity': 0.8,
          }
        });

        // Add animated dashed overlay
        map.current?.addLayer({
          id: `route-dash-${i}`,
          type: 'line',
          source: `route-${i}`,
          paint: {
            'line-color': '#ffffff',
            'line-width': 1.5,
            'line-opacity': 0.6,
            'line-dasharray': [2, 2]
          }
        });
      });

      // Add city markers
      routes.forEach((route, i) => {
        // Origin marker
        const originEl = document.createElement('div');
        originEl.className = 'mapbox-marker mapbox-marker-origin';
        originEl.innerHTML = `<div class="mapbox-marker-pulse"></div><div class="mapbox-marker-dot"></div><span class="mapbox-marker-label">${route.labels[0]}</span>`;
        
        new mapboxgl.Marker({ element: originEl, anchor: 'center' })
          .setLngLat(route.from)
          .addTo(map.current!);
        
        // Destination marker
        const destEl = document.createElement('div');
        destEl.className = 'mapbox-marker mapbox-marker-dest';
        destEl.innerHTML = `<div class="mapbox-marker-pulse"></div><div class="mapbox-marker-dot"></div><span class="mapbox-marker-label">${route.labels[1]}</span>`;
        
        new mapboxgl.Marker({ element: destEl, anchor: 'center' })
          .setLngLat(route.to)
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [token]);

  // Show token input if not provided
  if (!token) {
    return (
      <div className="tru-hero-map tru-hero-map-token">
        <div className="tru-hero-map-token-content">
          <p className="text-sm font-semibold text-foreground mb-2">Enter your Mapbox public token:</p>
          <input 
            type="text" 
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="pk.xxxxx..."
            className="tru-qb-input w-full"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Get your token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tru-hero-map">
      <div ref={mapContainer} className="tru-hero-map-container" />
      
      {/* Stats overlay */}
      <div className="tru-hero-map-stats">
        <div className="tru-hero-map-stat">
          <span className="tru-hero-map-stat-num">2,400+</span>
          <span className="tru-hero-map-stat-label">Moves Completed</span>
        </div>
        <div className="tru-hero-map-stat">
          <span className="tru-hero-map-stat-num">50</span>
          <span className="tru-hero-map-stat-label">States Covered</span>
        </div>
      </div>
    </div>
  );
}
