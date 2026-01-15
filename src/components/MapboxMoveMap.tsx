import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { X, Maximize2, MapPin, Route, Clock } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtldWRqOXgwYzQ1M2Vvam51OGJrcGFiIn0.tN-ZMle93ctK7PIt9kU7JA';

interface MapboxMoveMapProps {
  fromZip?: string;
  toZip?: string;
}

// Geocode a ZIP code using Mapbox API for precise coordinates
async function geocodeZip(zip: string): Promise<[number, number] | null> {
  // Only geocode valid 5-digit ZIP codes
  if (!zip || zip.length !== 5) return null;
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${zip}.json?country=US&types=postcode&access_token=${MAPBOX_TOKEN}`
    );
    
    if (!response.ok) {
      console.warn('Geocoding request failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const coords = data.features[0].center as [number, number];
      console.log(`Geocoded ${zip} to:`, coords);
      return coords;
    }
    
    console.warn('No geocoding results for ZIP:', zip);
    return null;
  } catch (e) {
    console.warn('Geocoding failed:', e);
    return null;
  }
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
  // Florida - CORRECTED coordinates
  "320": [-81.7, 30.3], "321": [-81.0, 28.5], "322": [-81.7, 30.3],
  "323": [-80.4, 27.6], "324": [-82.5, 30.3], "325": [-82.3, 29.2],
  "326": [-82.0, 29.2], "327": [-81.4, 28.5], "328": [-81.4, 28.4],
  "329": [-81.0, 28.0], "330": [-80.2, 25.8], "331": [-80.3, 25.9],
  "332": [-80.1, 25.8], "333": [-80.2, 25.8], "334": [-80.1, 26.4],
  "335": [-80.1, 26.2], "336": [-82.5, 27.9], "337": [-82.6, 27.8],
  "338": [-80.2, 26.6], "339": [-80.3, 26.5], "340": [-80.1, 26.0],
  "341": [-82.7, 28.0], "342": [-82.5, 28.1], "344": [-80.1, 26.1],
  "346": [-82.5, 27.5], "347": [-80.2, 26.0],
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

interface ExpandedMapViewProps {
  fromCoords: [number, number] | null;
  toCoords: [number, number] | null;
  onClose: () => void;
}

function ExpandedMapView({ fromCoords, toCoords, onClose }: ExpandedMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-98.5795, 39.8283],
      zoom: 3,
      pitch: 25,
      interactive: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Handle errors gracefully (e.g., 403 for terrain)
    map.current.on('error', (e) => {
      const err = e.error as { status?: number; url?: string } | undefined;
      if (err?.status === 403) {
        console.warn('Mapbox resource not available:', err.url);
      }
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Try to add terrain (may fail if token doesn't have access)
      try {
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });
        map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.2 });
      } catch (e) {
        console.warn('Terrain not available with this token');
      }

      // Add fog (works without terrain)
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

        // Fit bounds
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(fromCoords);
        bounds.extend(toCoords);
        map.current.fitBounds(bounds, { padding: 80, maxZoom: 6 });
      }
    });

    return () => {
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
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [fromCoords, setFromCoords] = useState<[number, number] | null>(null);
  const [toCoords, setToCoords] = useState<[number, number] | null>(null);

  // Geocode ZIP codes when they change
  useEffect(() => {
    const fetchCoords = async () => {
      const [fromResult, toResult] = await Promise.all([
        fromZip ? geocodeZip(fromZip) : Promise.resolve(null),
        toZip ? geocodeZip(toZip) : Promise.resolve(null)
      ]);
      
      // Fall back to lookup table if geocoding fails
      setFromCoords(fromResult || (fromZip ? getZipCoords(fromZip) : null));
      setToCoords(toResult || (toZip ? getZipCoords(toZip) : null));
    };

    fetchCoords();
  }, [fromZip, toZip]);

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
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-98.5795, 39.8283],
      zoom: 3,
      pitch: 20,
      interactive: false,
    });

    // Handle errors gracefully (e.g., 403 for terrain)
    map.current.on('error', (e) => {
      const err = e.error as { status?: number; url?: string } | undefined;
      if (err?.status === 403) {
        console.warn('Mapbox resource not available:', err.url);
        // Still set map as loaded even if terrain fails
        if (!isMapLoaded) setIsMapLoaded(true);
      }
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Try to add terrain (may fail if token doesn't have access)
      try {
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });
        map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.2 });
      } catch (e) {
        console.warn('Terrain not available with this token');
      }

      // Add fog (works without terrain)
      map.current.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 210, 230)',
        'horizon-blend': 0.1
      });

      setIsMapLoaded(true);
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, []);

  // Update route when ZIPs change
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Remove old layers/sources
    if (map.current.getLayer('route-line')) map.current.removeLayer('route-line');
    if (map.current.getLayer('route-glow')) map.current.removeLayer('route-glow');
    if (map.current.getSource('route')) map.current.removeSource('route');

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
    
    // Add full route
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

    // Add route line
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
