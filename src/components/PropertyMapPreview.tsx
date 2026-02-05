import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Layers } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtldWRqOXgwYzQ1M2Vvam51OGJrcGFiIn0.tN-ZMle93ctK7PIt9kU7JA';

interface PropertyMapPreviewProps {
  coordinates: [number, number] | null;
  originCoordinates?: [number, number] | null;
  showRoute?: boolean;
}

function createArcLine(start: [number, number], end: [number, number], steps = 100): [number, number][] {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lng = start[0] + (end[0] - start[0]) * t;
    const lat = start[1] + (end[1] - start[1]) * t;
    const arc = Math.sin(Math.PI * t) * 2;
    coords.push([lng, lat + arc]);
  }
  return coords;
}

function getBearing(start: [number, number], end: [number, number]): number {
  const startLat = start[1] * Math.PI / 180;
  const startLng = start[0] * Math.PI / 180;
  const endLat = end[1] * Math.PI / 180;
  const endLng = end[0] * Math.PI / 180;
  
  const dLng = endLng - startLng;
  
  const x = Math.sin(dLng) * Math.cos(endLat);
  const y = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
  
  let bearing = Math.atan2(x, y) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

export default function PropertyMapPreview({ 
  coordinates, 
  originCoordinates,
  showRoute = false 
}: PropertyMapPreviewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const truckMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');

  const toggleStyle = useCallback(() => {
    setMapStyle(prev => prev === 'streets' ? 'satellite' : 'streets');
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const styleUrl = mapStyle === 'streets' 
      ? 'mapbox://styles/mapbox/light-v11'
      : 'mapbox://styles/mapbox/satellite-streets-v12';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: coordinates || [-98.5, 39.8],
      zoom: coordinates ? 15 : 3,
      pitch: 45,
      interactive: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setIsMapLoaded(true);
      
      // Add terrain
      map.current?.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
      map.current?.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      
      // Add fog
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 210, 230)',
        'horizon-blend': 0.1,
        'star-intensity': 0.0,
        'space-color': 'rgb(200, 210, 230)'
      });
    });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      markersRef.current.forEach(m => m.remove());
      truckMarkerRef.current?.remove();
      markersRef.current = [];
      map.current?.remove();
      setIsMapLoaded(false);
    };
  }, [mapStyle]);

  // Update markers and route when coordinates change
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Cancel ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    truckMarkerRef.current?.remove();
    truckMarkerRef.current = null;

    // Remove previous route layers/sources
    if (map.current.getLayer('route-line')) map.current.removeLayer('route-line');
    if (map.current.getLayer('route-line-glow')) map.current.removeLayer('route-line-glow');
    if (map.current.getLayer('route-progress')) map.current.removeLayer('route-progress');
    if (map.current.getSource('route')) map.current.removeSource('route');
    if (map.current.getSource('route-progress')) map.current.removeSource('route-progress');

    if (!coordinates) return;

    // Create property marker with pulse
    const propEl = document.createElement('div');
    propEl.className = 'mapbox-marker-container';
    propEl.innerHTML = `
      <div class="mapbox-marker-ripple"></div>
      <div class="mapbox-marker-ripple" style="animation-delay: 0.8s"></div>
      <div class="mapbox-marker-dot destination"></div>
    `;
    
    const propMarker = new mapboxgl.Marker({ element: propEl })
      .setLngLat(coordinates)
      .addTo(map.current);
    markersRef.current.push(propMarker);

    // Fly to property location
    map.current.flyTo({
      center: coordinates,
      zoom: 16,
      pitch: 50,
      duration: 2000
    });

    // If we have origin and showRoute, draw the route
    if (originCoordinates && showRoute) {
      const arcCoords = createArcLine(originCoordinates, coordinates, 100);

      // Add route sources
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: arcCoords }
        }
      });

      map.current.addSource('route-progress', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [arcCoords[0]] }
        }
      });

      // Add route layers
      map.current.addLayer({
        id: 'route-line-glow',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': 'hsl(145, 63%, 42%)',
          'line-width': 8,
          'line-opacity': 0.2,
          'line-blur': 4
        }
      });

      map.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': 'hsl(145, 63%, 42%)',
          'line-width': 3,
          'line-opacity': 0.3,
          'line-dasharray': [2, 4]
        }
      });

      map.current.addLayer({
        id: 'route-progress',
        type: 'line',
        source: 'route-progress',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': 'hsl(145, 63%, 42%)',
          'line-width': 4,
          'line-opacity': 1
        }
      });

      // Add origin marker
      const originEl = document.createElement('div');
      originEl.className = 'mapbox-marker-container';
      originEl.innerHTML = `
        <div class="mapbox-marker-ripple"></div>
        <div class="mapbox-marker-ripple" style="animation-delay: 0.8s"></div>
        <div class="mapbox-marker-dot origin"></div>
      `;
      
      const originMarker = new mapboxgl.Marker({ element: originEl })
        .setLngLat(originCoordinates)
        .addTo(map.current);
      markersRef.current.push(originMarker);

      // Fit bounds to show both points
      const bounds = new mapboxgl.LngLatBounds();
      arcCoords.forEach(coord => bounds.extend(coord));
      map.current.fitBounds(bounds, { padding: 60, duration: 2000 });

      // Create truck marker
      const truckEl = document.createElement('div');
      truckEl.className = 'mapbox-truck-marker';
      truckEl.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`;
      
      truckMarkerRef.current = new mapboxgl.Marker({ element: truckEl })
        .setLngLat(arcCoords[0])
        .addTo(map.current);

      // Animate
      let step = 0;
      const totalSteps = arcCoords.length;
      const animationDuration = 2500;
      const stepTime = animationDuration / totalSteps;
      let lastTime = performance.now();

      const animate = (currentTime: number) => {
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime >= stepTime && step < totalSteps - 1) {
          step = Math.min(step + Math.floor(deltaTime / stepTime), totalSteps - 1);
          lastTime = currentTime;

          const visibleCoords = arcCoords.slice(0, step + 1);
          
          if (map.current?.getSource('route-progress')) {
            (map.current.getSource('route-progress') as mapboxgl.GeoJSONSource).setData({
              type: 'Feature',
              properties: {},
              geometry: { type: 'LineString', coordinates: visibleCoords }
            });
          }

          if (truckMarkerRef.current && step < totalSteps - 1) {
            truckMarkerRef.current.setLngLat(arcCoords[step]);
            const nextStep = Math.min(step + 5, totalSteps - 1);
            const bearing = getBearing(arcCoords[step], arcCoords[nextStep]);
            truckMarkerRef.current.setRotation(bearing - 90);
          }
        }

        if (step < totalSteps - 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          truckMarkerRef.current?.remove();
        }
      };

      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, 2500);
    }

  }, [coordinates, originCoordinates, showRoute, isMapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden" />
      
      {/* Style toggle */}
      <button
        onClick={toggleStyle}
        className="absolute bottom-4 left-4 z-10 px-3 py-2 rounded-lg bg-background/90 backdrop-blur shadow-lg flex items-center gap-2 text-sm font-medium hover:bg-background transition-colors"
      >
        <Layers className="w-4 h-4" />
        {mapStyle === 'streets' ? 'Satellite' : 'Streets'}
      </button>
    </div>
  );
}
