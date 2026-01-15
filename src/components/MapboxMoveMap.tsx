import { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtldHJ3b2YwYXF4M2tvajNsbTFpNTdjIn0.DXcMYHvBRP8vJQM8KKdRLg';

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

export default function MapboxMoveMap({ fromZip = '', toZip = '' }: MapboxMoveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const fromCoords = useMemo(() => fromZip ? getZipCoords(fromZip) : null, [fromZip]);
  const toCoords = useMemo(() => toZip ? getZipCoords(toZip) : null, [toZip]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283],
      zoom: 3,
      interactive: false,
    });

    map.current.on('load', () => {
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
    if (map.current.getLayer('route-dash')) map.current.removeLayer('route-dash');
    if (map.current.getSource('route')) map.current.removeSource('route');

    if (!fromCoords || !toCoords) {
      // Reset view
      map.current.flyTo({ center: [-98.5795, 39.8283], zoom: 3 });
      return;
    }

    // Calculate bounds and center
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(fromCoords);
    bounds.extend(toCoords);

    // Add route line
    const lineCoords = createArcLine(fromCoords, toCoords, 50);
    
    map.current.addSource('route', {
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

    map.current.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      paint: {
        'line-color': '#00ff6a',
        'line-width': 3,
        'line-opacity': 0.9,
      }
    });

    map.current.addLayer({
      id: 'route-dash',
      type: 'line',
      source: 'route',
      paint: {
        'line-color': '#ffffff',
        'line-width': 1,
        'line-opacity': 0.5,
        'line-dasharray': [2, 2]
      }
    });

    // Add origin marker
    const originEl = document.createElement('div');
    originEl.className = 'mapbox-marker';
    originEl.innerHTML = `<div class="mapbox-marker-pulse"></div><div class="mapbox-marker-dot"></div>`;
    const originMarker = new mapboxgl.Marker({ element: originEl, anchor: 'center' })
      .setLngLat(fromCoords)
      .addTo(map.current);
    markersRef.current.push(originMarker);

    // Add destination marker
    const destEl = document.createElement('div');
    destEl.className = 'mapbox-marker';
    destEl.innerHTML = `<div class="mapbox-marker-pulse"></div><div class="mapbox-marker-dot"></div>`;
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

  return <div ref={mapContainer} className="mapbox-move-map" />;
}
