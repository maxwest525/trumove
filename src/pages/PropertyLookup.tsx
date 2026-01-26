import { useState, useCallback, useRef, useEffect } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { MapPin, Navigation, ArrowRight, Loader2, Eye, Map, Clock, Route, CheckCircle } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { MAPBOX_TOKEN } from '@/lib/mapboxToken';

function calculateDistance(from: [number, number], to: [number, number]): number {
  const R = 3959;
  const dLat = (to[1] - from[1]) * Math.PI / 180;
  const dLon = (to[0] - from[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from[1] * Math.PI / 180) * Math.cos(to[1] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function createArcLine(start: [number, number], end: [number, number], steps = 100): [number, number][] {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lng = start[0] + (end[0] - start[0]) * t;
    const lat = start[1] + (end[1] - start[1]) * t;
    const dist = Math.abs(end[0] - start[0]);
    const arcHeight = Math.min(dist * 0.08, 4);
    const arc = Math.sin(Math.PI * t) * arcHeight;
    coords.push([lng, lat + arc]);
  }
  return coords;
}

// Geocode address string to coordinates
async function geocodeAddress(address: string): Promise<[number, number] | null> {
  if (!address || address.length < 3) return null;
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&country=US&types=address,place&limit=1`
    );
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      return data.features[0].center as [number, number];
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Street View Map Component
function StreetViewMap({ coordinates, title }: { coordinates: [number, number] | null; title: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !coordinates) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: coordinates,
      zoom: 18,
      pitch: 60,
      bearing: -20,
      interactive: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');

    map.current.on('load', () => {
      setIsLoaded(true);
      
      // Add terrain for 3D effect
      map.current?.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
      map.current?.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      
      // Add 3D buildings
      const layers = map.current?.getStyle()?.layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      if (labelLayerId) {
        map.current?.addLayer({
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6
          }
        }, labelLayerId);
      }

      // Add marker
      const el = document.createElement('div');
      el.className = 'mapbox-marker-container';
      el.innerHTML = `
        <div class="mapbox-marker-ripple"></div>
        <div class="mapbox-marker-ripple" style="animation-delay: 0.8s"></div>
        <div class="mapbox-marker-dot destination"></div>
      `;
      
      new mapboxgl.Marker({ element: el })
        .setLngLat(coordinates)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
      setIsLoaded(false);
    };
  }, [coordinates]);

  if (!coordinates) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-muted/30 rounded-xl">
        <Eye className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-sm text-muted-foreground">
          Enter {title.toLowerCase()} address to see street view
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-3 left-3 px-3 py-1.5 bg-background/90 backdrop-blur rounded-lg text-xs font-semibold">
        {title}
      </div>
    </div>
  );
}

// Route Map Component
function RouteMap({ 
  originCoords, 
  destCoords 
}: { 
  originCoords: [number, number] | null; 
  destCoords: [number, number] | null;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !originCoords || !destCoords) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5, 39.8],
      zoom: 3,
      pitch: 30,
      interactive: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;
      setIsLoaded(true);

      // Add terrain
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.2 });

      // Create arc line
      const arcCoords = createArcLine(originCoords, destCoords, 100);

      // Add route
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: arcCoords }
        }
      });

      map.current.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        paint: {
          'line-color': 'hsl(var(--primary))',
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
          'line-color': 'hsl(var(--primary))',
          'line-width': 4,
          'line-opacity': 0.9
        }
      });

      // Add markers
      const originEl = document.createElement('div');
      originEl.className = 'mapbox-marker-container';
      originEl.innerHTML = `
        <div class="mapbox-marker-ripple"></div>
        <div class="mapbox-marker-dot origin"></div>
        <div class="mapbox-marker-label">Origin</div>
      `;
      const originMarker = new mapboxgl.Marker({ element: originEl })
        .setLngLat(originCoords)
        .addTo(map.current);
      markersRef.current.push(originMarker);

      const destEl = document.createElement('div');
      destEl.className = 'mapbox-marker-container';
      destEl.innerHTML = `
        <div class="mapbox-marker-ripple"></div>
        <div class="mapbox-marker-dot destination"></div>
        <div class="mapbox-marker-label">Destination</div>
      `;
      const destMarker = new mapboxgl.Marker({ element: destEl })
        .setLngLat(destCoords)
        .addTo(map.current);
      markersRef.current.push(destMarker);

      // Fit bounds
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(originCoords);
      bounds.extend(destCoords);
      map.current.fitBounds(bounds, { padding: 80, maxZoom: 8 });
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.current?.remove();
      setIsLoaded(false);
    };
  }, [originCoords, destCoords]);

  if (!originCoords || !destCoords) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-muted/30 rounded-xl">
        <Map className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-sm text-muted-foreground">
          Enter both addresses to see the route
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

export default function PropertyLookup() {
  const [originAddress, setOriginAddress] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [originVerified, setOriginVerified] = useState(false);
  const [destVerified, setDestVerified] = useState(false);
  const [isGeocodingOrigin, setIsGeocodingOrigin] = useState(false);
  const [isGeocodingDest, setIsGeocodingDest] = useState(false);

  // Handle origin location selection
  const handleOriginSelect = useCallback(async (city: string, zip: string, fullAddress?: string, isVerified?: boolean) => {
    const addressToGeocode = fullAddress || `${city}, ${zip}`;
    setOriginAddress(addressToGeocode);
    setOriginVerified(!!isVerified);
    setIsGeocodingOrigin(true);
    
    const coords = await geocodeAddress(addressToGeocode);
    setOriginCoords(coords);
    setIsGeocodingOrigin(false);
  }, []);

  // Handle destination location selection
  const handleDestSelect = useCallback(async (city: string, zip: string, fullAddress?: string, isVerified?: boolean) => {
    const addressToGeocode = fullAddress || `${city}, ${zip}`;
    setDestAddress(addressToGeocode);
    setDestVerified(!!isVerified);
    setIsGeocodingDest(true);
    
    const coords = await geocodeAddress(addressToGeocode);
    setDestCoords(coords);
    setIsGeocodingDest(false);
  }, []);

  const distance = originCoords && destCoords ? calculateDistance(originCoords, destCoords) : null;
  const transitDays = distance ? Math.max(1, Math.ceil(distance / 500)) : null;

  return (
    <SiteShell>
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-[10px] font-black tracking-[0.24em] uppercase text-muted-foreground mb-3">
            TruMove Route Preview
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-4">
            Visualize your move
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Enter both addresses to see satellite street views and your moving route
          </p>
        </div>

        {/* Address Inputs */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Origin Address */}
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5" />
              Moving From
              {isGeocodingOrigin && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
            </div>
            
            <LocationAutocomplete
              value={originAddress}
              onValueChange={setOriginAddress}
              onLocationSelect={handleOriginSelect}
              placeholder="Enter current address..."
              mode="address"
              showGeolocation={true}
              className="w-full"
            />

            {originVerified && originAddress && !isGeocodingOrigin && (
              <div className="mt-3 p-2.5 rounded-lg bg-muted/60 border border-border/60 text-xs text-foreground/70 font-medium flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                Address verified
              </div>
            )}
          </div>

          {/* Destination Address */}
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Moving To
              {isGeocodingDest && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
            </div>
            
            <LocationAutocomplete
              value={destAddress}
              onValueChange={setDestAddress}
              onLocationSelect={handleDestSelect}
              placeholder="Enter destination address..."
              mode="address"
              showGeolocation={true}
              className="w-full"
            />

            {destVerified && destAddress && !isGeocodingDest && (
              <div className="mt-3 p-2.5 rounded-lg bg-primary/10 border border-primary/30 text-xs text-primary font-medium flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                Address verified
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        {distance && (
          <div className="flex items-center justify-center gap-8 mb-8 py-4 px-6 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 text-foreground">
              <Route className="w-4 h-4 text-primary" />
              <span className="font-semibold">{distance.toLocaleString()} miles</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-semibold">{transitDays} {transitDays === 1 ? 'day' : 'days'} transit</span>
            </div>
          </div>
        )}

        {/* Street Views */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border/60">
            <StreetViewMap coordinates={originCoords} title="Origin" />
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border/60">
            <StreetViewMap coordinates={destCoords} title="Destination" />
          </div>
        </div>

        {/* Route Overview */}
        <div className="rounded-2xl overflow-hidden border border-border/60">
          <div className="h-[400px]">
            <RouteMap originCoords={originCoords} destCoords={destCoords} />
          </div>
        </div>

        {/* CTA */}
        {distance && (
          <div className="mt-10 text-center">
            <a
              href="/online-estimate"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-foreground text-background font-bold text-lg hover:bg-background hover:text-foreground border border-transparent hover:border-foreground shadow-[0_4px_16px_hsl(var(--primary)/0.3)] hover:shadow-[0_8px_24px_hsl(var(--primary)/0.4)] transition-all duration-200"
            >
              Get Your Instant Quote
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
