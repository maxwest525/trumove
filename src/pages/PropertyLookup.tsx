import { useState, useCallback, useRef, useEffect } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { MapPin, Navigation, ArrowRight, Loader2, Eye, Map } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtldWRqOXgwYzQ1M2Vvam51OGJrcGFiIn0.tN-ZMle93ctK7PIt9kU7JA';

interface Suggestion {
  id: string;
  place_name: string;
  center: [number, number];
}

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
  const [originSuggestions, setOriginSuggestions] = useState<Suggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<Suggestion[]>([]);
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [isLoadingOrigin, setIsLoadingOrigin] = useState(false);
  const [isLoadingDest, setIsLoadingDest] = useState(false);
  const [selectedOriginName, setSelectedOriginName] = useState("");
  const [selectedDestName, setSelectedDestName] = useState("");
  
  const originInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);
  const originDropdownRef = useRef<HTMLDivElement>(null);
  const destDropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originDropdownRef.current && !originDropdownRef.current.contains(e.target as Node) &&
          originInputRef.current && !originInputRef.current.contains(e.target as Node)) {
        setShowOriginDropdown(false);
      }
      if (destDropdownRef.current && !destDropdownRef.current.contains(e.target as Node) &&
          destInputRef.current && !destInputRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (query: string, type: 'origin' | 'dest') => {
    if (query.length < 3) {
      if (type === 'origin') setOriginSuggestions([]);
      else setDestSuggestions([]);
      return;
    }

    if (type === 'origin') setIsLoadingOrigin(true);
    else setIsLoadingDest(true);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=US&types=address,place&limit=5`
      );
      const data = await response.json();
      
      const suggestions: Suggestion[] = data.features?.map((f: any) => ({
        id: f.id,
        place_name: f.place_name,
        center: f.center as [number, number]
      })) || [];

      if (type === 'origin') {
        setOriginSuggestions(suggestions);
        setShowOriginDropdown(suggestions.length > 0);
      } else {
        setDestSuggestions(suggestions);
        setShowDestDropdown(suggestions.length > 0);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      if (type === 'origin') setIsLoadingOrigin(false);
      else setIsLoadingDest(false);
    }
  }, []);

  const handleOriginChange = useCallback((value: string) => {
    setOriginAddress(value);
    setOriginCoords(null);
    setSelectedOriginName("");
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value, 'origin');
    }, 300);
  }, [fetchSuggestions]);

  const handleDestChange = useCallback((value: string) => {
    setDestAddress(value);
    setDestCoords(null);
    setSelectedDestName("");
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value, 'dest');
    }, 300);
  }, [fetchSuggestions]);

  const selectOriginSuggestion = useCallback((suggestion: Suggestion) => {
    setOriginAddress(suggestion.place_name);
    setSelectedOriginName(suggestion.place_name);
    setOriginCoords(suggestion.center);
    setShowOriginDropdown(false);
    setOriginSuggestions([]);
  }, []);

  const selectDestSuggestion = useCallback((suggestion: Suggestion) => {
    setDestAddress(suggestion.place_name);
    setSelectedDestName(suggestion.place_name);
    setDestCoords(suggestion.center);
    setShowDestDropdown(false);
    setDestSuggestions([]);
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
            </div>
            
            <div className="relative">
              <input
                ref={originInputRef}
                type="text"
                value={originAddress}
                onChange={(e) => handleOriginChange(e.target.value)}
                onFocus={() => originSuggestions.length > 0 && setShowOriginDropdown(true)}
                placeholder="Enter current address..."
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-background text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {isLoadingOrigin && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
              )}
              
              {showOriginDropdown && originSuggestions.length > 0 && (
                <div ref={originDropdownRef} className="property-autocomplete-dropdown">
                  {originSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      onClick={() => selectOriginSuggestion(suggestion)}
                      className="property-autocomplete-item"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground inline mr-2" />
                      <span className="text-sm">{suggestion.place_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedOriginName && (
              <div className="mt-3 p-2.5 rounded-lg bg-secondary/50 border border-secondary text-xs text-foreground font-medium truncate">
                {selectedOriginName}
              </div>
            )}
          </div>

          {/* Destination Address */}
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Moving To
            </div>
            
            <div className="relative">
              <input
                ref={destInputRef}
                type="text"
                value={destAddress}
                onChange={(e) => handleDestChange(e.target.value)}
                onFocus={() => destSuggestions.length > 0 && setShowDestDropdown(true)}
                placeholder="Enter destination address..."
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-background text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {isLoadingDest && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
              )}
              
              {showDestDropdown && destSuggestions.length > 0 && (
                <div ref={destDropdownRef} className="property-autocomplete-dropdown">
                  {destSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      onClick={() => selectDestSuggestion(suggestion)}
                      className="property-autocomplete-item"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground inline mr-2" />
                      <span className="text-sm">{suggestion.place_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedDestName && (
              <div className="mt-3 p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-foreground font-medium truncate">
                {selectedDestName}
              </div>
            )}
          </div>
        </div>

        {/* Route Stats */}
        {distance !== null && (
          <div className="flex items-center justify-center gap-8 mb-8 p-4 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-black text-foreground">{distance.toLocaleString()} mi</div>
                <div className="text-xs text-muted-foreground">distance</div>
              </div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <div className="text-2xl font-black text-foreground">~{transitDays} day{transitDays && transitDays > 1 ? 's' : ''}</div>
              <div className="text-xs text-muted-foreground">transit time</div>
            </div>
          </div>
        )}

        {/* Street View Maps */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="aspect-[4/3] rounded-2xl border border-border/60 overflow-hidden bg-card">
            <StreetViewMap coordinates={originCoords} title="Origin" />
          </div>
          <div className="aspect-[4/3] rounded-2xl border border-border/60 overflow-hidden bg-card">
            <StreetViewMap coordinates={destCoords} title="Destination" />
          </div>
        </div>

        {/* Route Map */}
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-card">
          <div className="h-[400px]">
            <RouteMap originCoords={originCoords} destCoords={destCoords} />
          </div>
        </div>

        {/* Helper text */}
        <p className="text-sm text-muted-foreground text-center mt-6">
          Type at least 3 characters to see address suggestions. Select addresses to view satellite street views.
        </p>
      </div>
    </SiteShell>
  );
}
