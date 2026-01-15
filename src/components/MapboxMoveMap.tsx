import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { X, Maximize2, MapPin, Route, Clock } from 'lucide-react';

// Animation duration in ms (10 seconds for full route)
const ANIMATION_DURATION = 10000;

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtldWRqOXgwYzQ1M2Vvam51OGJrcGFiIn0.tN-ZMle93ctK7PIt9kU7JA';

interface MapboxMoveMapProps {
  fromZip?: string;
  toZip?: string;
}

// Approximate lat/lng positions for ZIP prefixes
const ZIP_COORDS: Record<string, [number, number]> = {
  // Format: [longitude, latitude]
  // Northeast
  "010": [-72.6, 42.1], "020": [-71.0, 42.4], "030": [-71.5, 43.2],
  "040": [-70.3, 43.7], "050": [-72.9, 44.3], "060": [-72.7, 41.8],
  "070": [-74.2, 40.8], "080": [-74.9, 39.9], "100": [-74.0, 40.7],
  "110": [-73.7, 40.8], "120": [-73.9, 42.7], "130": [-76.2, 43.1],
  "140": [-78.9, 42.9], "150": [-79.9, 40.4], "160": [-79.5, 41.4],
  "170": [-76.9, 40.3], "180": [-75.4, 40.6], "190": [-75.2, 40.0],
  // DC/MD/VA
  "200": [-77.0, 38.9], "210": [-76.6, 39.3], "220": [-77.5, 38.8],
  "230": [-77.5, 37.5], "240": [-79.9, 37.3],
  // Carolinas
  "270": [-78.6, 35.8], "280": [-80.8, 35.2], "290": [-79.9, 34.0],
  // Georgia
  "300": [-84.4, 33.8], "310": [-81.1, 32.1],
  // Florida
  "320": [-81.7, 30.3], "330": [-80.2, 25.8], "334": [-82.5, 27.9],
  // Alabama
  "350": [-86.8, 33.5], "360": [-86.3, 32.4],
  // Tennessee
  "370": [-86.8, 36.2], "380": [-90.0, 35.1],
  // Kentucky
  "400": [-85.8, 38.3], "410": [-84.5, 38.0],
  // Ohio
  "430": [-83.0, 39.9], "440": [-81.7, 41.5], "450": [-84.2, 39.8],
  // Indiana
  "460": [-86.2, 39.8], "470": [-85.7, 41.1],
  // Michigan
  "480": [-83.0, 42.3], "490": [-85.7, 42.3], "496": [-84.6, 42.7],
  // Iowa
  "500": [-93.6, 41.6], "510": [-95.9, 41.3], "520": [-91.5, 41.7],
  // Wisconsin
  "530": [-89.4, 43.1], "540": [-91.5, 44.9], "549": [-89.6, 46.8],
  // Minnesota
  "550": [-93.3, 44.9], "560": [-94.2, 44.2], "566": [-95.9, 47.5],
  // Dakotas
  "570": [-96.7, 43.5], "580": [-96.8, 46.9], "590": [-110.4, 45.8],
  // Illinois
  "600": [-87.6, 41.9], "610": [-88.1, 41.8], "620": [-89.6, 38.6],
  // Missouri
  "630": [-90.2, 38.6], "640": [-94.6, 39.1], "650": [-92.3, 38.6],
  // Kansas
  "660": [-94.6, 39.0], "670": [-97.3, 37.7], "679": [-101.0, 37.8],
  // Nebraska
  "680": [-95.9, 41.3], "690": [-100.8, 41.1],
  // Louisiana
  "700": [-90.1, 29.9], "710": [-92.0, 30.2],
  // Arkansas
  "720": [-92.3, 34.7], "728": [-94.2, 36.1],
  // Oklahoma
  "730": [-97.5, 35.5], "740": [-96.0, 36.2],
  // Texas
  "750": [-96.8, 32.8], "760": [-97.3, 32.7], "770": [-95.4, 29.8],
  "780": [-98.5, 29.4], "790": [-101.8, 35.2], "797": [-102.1, 31.9],
  // Colorado
  "800": [-104.9, 39.7], "810": [-105.0, 38.8], "816": [-108.5, 37.3],
  // Wyoming
  "820": [-104.8, 41.1], "824": [-110.0, 42.9],
  // Idaho
  "832": [-116.2, 43.6], "835": [-116.8, 47.7],
  // Utah
  "840": [-111.9, 40.8], "847": [-113.6, 37.1],
  // Arizona
  "850": [-112.1, 33.4], "856": [-110.9, 32.2], "860": [-111.1, 35.2],
  // New Mexico
  "870": [-106.6, 35.1], "880": [-106.5, 32.3], "884": [-108.2, 35.5],
  // Nevada
  "890": [-115.1, 36.2], "894": [-119.8, 39.5], "898": [-117.2, 39.0],
  // California
  "900": [-118.2, 34.1], "910": [-118.2, 34.2], "920": [-117.2, 32.7],
  "930": [-119.7, 34.4], "940": [-122.4, 37.8], "950": [-121.9, 37.3],
  "960": [-121.5, 38.6],
  // Washington
  "980": [-122.3, 47.6], "985": [-117.4, 47.7], "990": [-117.4, 47.7],
  // Oregon
  "970": [-122.7, 45.5], "975": [-123.0, 44.1], "979": [-118.3, 45.9],
  // Alaska/Hawaii
  "995": [-134.4, 58.3], "967": [-155.5, 19.5],
};

function getZipCoords(zip: string): [number, number] | null {
  if (zip.length < 3) return null;
  const prefix = zip.substring(0, 3);
  if (ZIP_COORDS[prefix]) return ZIP_COORDS[prefix];
  
  // Try first 2 digits with 0
  const prefix2 = zip.substring(0, 2) + "0";
  if (ZIP_COORDS[prefix2]) return ZIP_COORDS[prefix2];
  
  return null;
}

function createArcLine(start: [number, number], end: [number, number], steps: number): [number, number][] {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lng = start[0] + (end[0] - start[0]) * t;
    const lat = start[1] + (end[1] - start[1]) * t;
    // Add arc curve based on distance
    const dist = Math.abs(end[0] - start[0]);
    const arcHeight = Math.min(dist * 0.1, 5);
    const arc = Math.sin(t * Math.PI) * arcHeight;
    coords.push([lng, lat + arc]);
  }
  return coords;
}

function getBearing(start: [number, number], end: [number, number]): number {
  const lng1 = start[0] * Math.PI / 180;
  const lng2 = end[0] * Math.PI / 180;
  const lat1 = start[1] * Math.PI / 180;
  const lat2 = end[1] * Math.PI / 180;
  const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

// Calculate distance between coords in miles
function calculateDistanceBetweenCoords(from: [number, number], to: [number, number]): number {
  const R = 3959; // Earth radius in miles
  const dLat = (to[1] - from[1]) * Math.PI / 180;
  const dLon = (to[0] - from[0]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(from[1] * Math.PI / 180) * Math.cos(to[1] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

// Truck SVG icon
const TRUCK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.684-.949V8a2 2 0 0 1 2-2h2.586a1 1 0 0 1 .707.293l2.414 2.414a1 1 0 0 1 .293.707V17a1 1 0 0 1-1 1h-1"/><circle cx="7" cy="18" r="2"/><circle cx="19" cy="18" r="2"/></svg>`;

interface ExpandedMapViewProps {
  fromCoords: [number, number] | null;
  toCoords: [number, number] | null;
  onClose: () => void;
}

function ExpandedMapView({ fromCoords, toCoords, onClose }: ExpandedMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283],
      zoom: 3,
      pitch: 25,
      interactive: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;

      // Add terrain
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.2 });

      // Add fog
      map.current.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 210, 230)',
        'horizon-blend': 0.1
      });

      // Add route if coords available
      if (fromCoords && toCoords) {
        const lineCoords = createArcLine(fromCoords, toCoords, 100);
        
        // Add full route
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: lineCoords }
          }
        });

        map.current.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#00ff6a',
            'line-width': 4,
            'line-opacity': 0.9,
          }
        });

        map.current.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#00ff6a',
            'line-width': 12,
            'line-opacity': 0.2,
            'line-blur': 8
          }
        });

        // Add markers
        const originEl = document.createElement('div');
        originEl.className = 'mapbox-marker-container';
        originEl.innerHTML = `
          <div class="mapbox-marker-ripple"></div>
          <div class="mapbox-marker-ripple"></div>
          <div class="mapbox-marker-dot origin"></div>
        `;
        const originMarker = new mapboxgl.Marker({ element: originEl, anchor: 'center' })
          .setLngLat(fromCoords)
          .addTo(map.current);
        markersRef.current.push(originMarker);

        const destEl = document.createElement('div');
        destEl.className = 'mapbox-marker-container';
        destEl.innerHTML = `
          <div class="mapbox-marker-ripple"></div>
          <div class="mapbox-marker-ripple"></div>
          <div class="mapbox-marker-dot destination"></div>
        `;
        const destMarker = new mapboxgl.Marker({ element: destEl, anchor: 'center' })
          .setLngLat(toCoords)
          .addTo(map.current);
        markersRef.current.push(destMarker);

        // Add truck marker
        const truckEl = document.createElement('div');
        truckEl.className = 'mapbox-truck-marker';
        truckEl.innerHTML = TRUCK_SVG;
        const truckMarker = new mapboxgl.Marker({ element: truckEl, anchor: 'center' })
          .setLngLat(lineCoords[0])
          .addTo(map.current);
        markersRef.current.push(truckMarker);

        // Animate truck with slower speed
        let startTime: number | null = null;
        const totalSteps = lineCoords.length;
        
        const animateTruck = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
          const step = Math.floor(progress * (totalSteps - 1));
          
          const pos = lineCoords[step];
          const nextPos = lineCoords[Math.min(step + 1, totalSteps - 1)];
          const bearing = getBearing(pos, nextPos);
          truckMarker.setLngLat(pos);
          truckMarker.setRotation(bearing - 90);
          
          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animateTruck);
          } else {
            // Loop animation after pause
            setTimeout(() => {
              startTime = null;
              animationRef.current = requestAnimationFrame(animateTruck);
            }, 2000);
          }
        };
        animationRef.current = requestAnimationFrame(animateTruck);

        // Fit bounds
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(fromCoords);
        bounds.extend(toCoords);
        map.current.fitBounds(bounds, { padding: 80, maxZoom: 6 });
      }
    });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, [fromCoords, toCoords]);

  // Calculate distance for info display
  const distance = fromCoords && toCoords 
    ? calculateDistanceBetweenCoords(fromCoords, toCoords) 
    : 0;
  const transitDays = Math.ceil(distance / 500);

  return (
    <div className="mapbox-expanded-overlay" onClick={onClose}>
      <div className="mapbox-expanded-container" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        <div ref={mapContainer} className="w-full h-full" />
        
        {/* Route info panel */}
        {distance > 0 && (
          <div className="expanded-map-info">
            <div className="expanded-map-stat">
              <Route className="w-4 h-4" />
              <span>{distance.toLocaleString()} miles</span>
            </div>
            <div className="expanded-map-stat">
              <Clock className="w-4 h-4" />
              <span>~{transitDays} day{transitDays > 1 ? 's' : ''} transit</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MapboxMoveMap({ fromZip = '', toZip = '' }: MapboxMoveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const animationRef = useRef<number | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fromCoords = useMemo(() => fromZip ? getZipCoords(fromZip) : null, [fromZip]);
  const toCoords = useMemo(() => toZip ? getZipCoords(toZip) : null, [toZip]);

  // Click only - no hover delay
  const handleExpandClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (fromCoords && toCoords) {
      setIsExpanded(true);
    }
  }, [fromCoords, toCoords]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283],
      zoom: 3,
      pitch: 20,
      interactive: false,
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add terrain
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.2 });

      // Add fog
      map.current.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 210, 230)',
        'horizon-blend': 0.1
      });

      setIsMapLoaded(true);
    });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, []);

  // Update route when ZIPs change
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Remove old layers/sources
    if (map.current.getLayer('route-line')) map.current.removeLayer('route-line');
    if (map.current.getLayer('route-glow')) map.current.removeLayer('route-glow');
    if (map.current.getLayer('route-progress')) map.current.removeLayer('route-progress');
    if (map.current.getSource('route')) map.current.removeSource('route');
    if (map.current.getSource('route-progress')) map.current.removeSource('route-progress');

    if (!fromCoords || !toCoords) {
      // Reset view
      map.current.flyTo({ center: [-98.5795, 39.8283], zoom: 3, pitch: 20 });
      return;
    }

    // Calculate bounds
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(fromCoords);
    bounds.extend(toCoords);

    // Create arc coordinates
    const lineCoords = createArcLine(fromCoords, toCoords, 100);
    
    // Add full route (invisible initially)
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: lineCoords }
      }
    });

    // Add glow layer
    map.current.addLayer({
      id: 'route-glow',
      type: 'line',
      source: 'route',
      paint: {
        'line-color': '#00ff6a',
        'line-width': 12,
        'line-opacity': 0.2,
        'line-blur': 8
      }
    });

    // Add progress source for animation
    map.current.addSource('route-progress', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: [lineCoords[0]] }
      }
    });

    map.current.addLayer({
      id: 'route-progress',
      type: 'line',
      source: 'route-progress',
      paint: {
        'line-color': '#00ff6a',
        'line-width': 4,
        'line-opacity': 0.9,
      }
    });

    // Add origin marker with ripples
    const originEl = document.createElement('div');
    originEl.className = 'mapbox-marker-container';
    originEl.innerHTML = `
      <div class="mapbox-marker-ripple"></div>
      <div class="mapbox-marker-ripple"></div>
      <div class="mapbox-marker-dot origin"></div>
    `;
    const originMarker = new mapboxgl.Marker({ element: originEl, anchor: 'center' })
      .setLngLat(fromCoords)
      .addTo(map.current);
    markersRef.current.push(originMarker);

    // Add destination marker with ripples
    const destEl = document.createElement('div');
    destEl.className = 'mapbox-marker-container';
    destEl.innerHTML = `
      <div class="mapbox-marker-ripple"></div>
      <div class="mapbox-marker-ripple"></div>
      <div class="mapbox-marker-dot destination"></div>
    `;
    const destMarker = new mapboxgl.Marker({ element: destEl, anchor: 'center' })
      .setLngLat(toCoords)
      .addTo(map.current);
    markersRef.current.push(destMarker);

    // Add truck marker
    const truckEl = document.createElement('div');
    truckEl.className = 'mapbox-truck-marker';
    truckEl.innerHTML = TRUCK_SVG;
    const truckMarker = new mapboxgl.Marker({ element: truckEl, anchor: 'center' })
      .setLngLat(lineCoords[0])
      .addTo(map.current);
    markersRef.current.push(truckMarker);

    // Animate route drawing and truck with time-based throttle (10 seconds)
    let startTime: number | null = null;
    const totalSteps = lineCoords.length;
    
    const animate = (timestamp: number) => {
      if (!map.current) return;
      
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const currentStep = Math.floor(progress * totalSteps);
      
      // Update route line
      const visibleCoords = lineCoords.slice(0, Math.max(currentStep, 1));
      const source = map.current.getSource('route-progress') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: visibleCoords }
        });
      }

      // Move truck
      const truckPos = lineCoords[Math.min(currentStep, totalSteps - 1)];
      const nextPos = lineCoords[Math.min(currentStep + 1, totalSteps - 1)];
      const bearing = getBearing(truckPos, nextPos);
      truckMarker.setLngLat(truckPos);
      truckMarker.setRotation(bearing - 90);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Loop after 2 second pause
        setTimeout(() => {
          startTime = null;
          animationRef.current = requestAnimationFrame(animate);
        }, 2000);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);

    // Fit to bounds
    map.current.fitBounds(bounds, {
      padding: 40,
      maxZoom: 6,
    });

  }, [fromCoords, toCoords, isMapLoaded]);

  return (
    <>
      <div className="mapbox-move-map-wrapper">
        {/* Loading skeleton */}
        {!isMapLoaded && (
          <div className="mapbox-skeleton">
            <div className="mapbox-skeleton-shimmer" />
            <div className="mapbox-skeleton-content">
              <MapPin className="w-8 h-8 text-muted-foreground/40" />
              <span>Loading map...</span>
            </div>
          </div>
        )}
        
        <div ref={mapContainer} className="mapbox-move-map" />
        
        {/* Expand button - only show when route exists */}
        {fromCoords && toCoords && (
          <button 
            onClick={handleExpandClick}
            className="map-expand-button"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Expand</span>
          </button>
        )}
      </div>
      
      {isExpanded && createPortal(
        <ExpandedMapView 
          fromCoords={fromCoords} 
          toCoords={toCoords} 
          onClose={() => setIsExpanded(false)} 
        />,
        document.body
      )}
    </>
  );
}
