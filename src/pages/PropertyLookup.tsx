import { useState, useCallback, useRef, useEffect } from "react";
import SiteShell from "@/components/layout/SiteShell";
import PropertyMapPreview from "@/components/PropertyMapPreview";
import { MapPin, Navigation, ArrowRight, Loader2 } from "lucide-react";

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtldWRqOXgwYzQ1M2Vvam51OGJrcGFiIn0.tN-ZMle93ctK7PIt9kU7JA';

interface Suggestion {
  id: string;
  place_name: string;
  center: [number, number];
}

function calculateDistance(from: [number, number], to: [number, number]): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (to[1] - from[1]) * Math.PI / 180;
  const dLon = (to[0] - from[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from[1] * Math.PI / 180) * Math.cos(to[1] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function PropertyLookup() {
  const [propertyAddress, setPropertyAddress] = useState("");
  const [originAddress, setOriginAddress] = useState("");
  const [propertySuggestions, setPropertySuggestions] = useState<Suggestion[]>([]);
  const [originSuggestions, setOriginSuggestions] = useState<Suggestion[]>([]);
  const [propertyCoords, setPropertyCoords] = useState<[number, number] | null>(null);
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [isLoadingOrigin, setIsLoadingOrigin] = useState(false);
  const [selectedPropertyName, setSelectedPropertyName] = useState("");
  const [selectedOriginName, setSelectedOriginName] = useState("");
  const [showRoute, setShowRoute] = useState(false);
  
  const propertyInputRef = useRef<HTMLInputElement>(null);
  const originInputRef = useRef<HTMLInputElement>(null);
  const propertyDropdownRef = useRef<HTMLDivElement>(null);
  const originDropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (propertyDropdownRef.current && !propertyDropdownRef.current.contains(e.target as Node) &&
          propertyInputRef.current && !propertyInputRef.current.contains(e.target as Node)) {
        setShowPropertyDropdown(false);
      }
      if (originDropdownRef.current && !originDropdownRef.current.contains(e.target as Node) &&
          originInputRef.current && !originInputRef.current.contains(e.target as Node)) {
        setShowOriginDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (query: string, type: 'property' | 'origin') => {
    if (query.length < 3) {
      if (type === 'property') setPropertySuggestions([]);
      else setOriginSuggestions([]);
      return;
    }

    if (type === 'property') setIsLoadingProperty(true);
    else setIsLoadingOrigin(true);

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

      if (type === 'property') {
        setPropertySuggestions(suggestions);
        setShowPropertyDropdown(suggestions.length > 0);
      } else {
        setOriginSuggestions(suggestions);
        setShowOriginDropdown(suggestions.length > 0);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      if (type === 'property') setIsLoadingProperty(false);
      else setIsLoadingOrigin(false);
    }
  }, []);

  const handlePropertyChange = useCallback((value: string) => {
    setPropertyAddress(value);
    setPropertyCoords(null);
    setSelectedPropertyName("");
    setShowRoute(false);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value, 'property');
    }, 300);
  }, [fetchSuggestions]);

  const handleOriginChange = useCallback((value: string) => {
    setOriginAddress(value);
    setOriginCoords(null);
    setSelectedOriginName("");
    setShowRoute(false);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value, 'origin');
    }, 300);
  }, [fetchSuggestions]);

  const selectPropertySuggestion = useCallback((suggestion: Suggestion) => {
    setPropertyAddress(suggestion.place_name);
    setSelectedPropertyName(suggestion.place_name);
    setPropertyCoords(suggestion.center);
    setShowPropertyDropdown(false);
    setPropertySuggestions([]);
  }, []);

  const selectOriginSuggestion = useCallback((suggestion: Suggestion) => {
    setOriginAddress(suggestion.place_name);
    setSelectedOriginName(suggestion.place_name);
    setOriginCoords(suggestion.center);
    setShowOriginDropdown(false);
    setOriginSuggestions([]);
    
    // Show route after selecting origin
    if (propertyCoords) {
      setTimeout(() => setShowRoute(true), 100);
    }
  }, [propertyCoords]);

  const distance = propertyCoords && originCoords ? calculateDistance(originCoords, propertyCoords) : null;

  return (
    <SiteShell>
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-[10px] font-black tracking-[0.24em] uppercase text-muted-foreground mb-3">
            TruMove Property Preview
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-4">
            Preview your new home instantly
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Enter any address to see it on the map. Add your current location to visualize the moving route.
          </p>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Property Address */}
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Destination Property
              </div>
              
              <div className="relative">
                <label className="text-xs font-semibold text-foreground block mb-2">
                  Property address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    ref={propertyInputRef}
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => handlePropertyChange(e.target.value)}
                    onFocus={() => propertySuggestions.length > 0 && setShowPropertyDropdown(true)}
                    placeholder="123 Main St, City, State"
                    className="w-full h-12 pl-11 pr-10 rounded-xl border border-border/60 bg-background text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {isLoadingProperty && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                  )}
                </div>
                
                {/* Property suggestions dropdown */}
                {showPropertyDropdown && propertySuggestions.length > 0 && (
                  <div ref={propertyDropdownRef} className="property-autocomplete-dropdown">
                    {propertySuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        onClick={() => selectPropertySuggestion(suggestion)}
                        className="property-autocomplete-item"
                      >
                        <MapPin className="w-4 h-4 text-muted-foreground inline mr-2" />
                        <span className="text-sm">{suggestion.place_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedPropertyName && (
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-xs text-muted-foreground mb-1">Selected property</div>
                  <div className="text-sm font-medium text-foreground">{selectedPropertyName}</div>
                </div>
              )}
            </div>

            {/* Origin Address */}
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Your Current Location
              </div>
              
              <div className="relative">
                <label className="text-xs font-semibold text-foreground block mb-2">
                  Origin address (optional)
                </label>
                <div className="relative">
                  <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    ref={originInputRef}
                    type="text"
                    value={originAddress}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    onFocus={() => originSuggestions.length > 0 && setShowOriginDropdown(true)}
                    placeholder="Current address to see route"
                    className="w-full h-12 pl-11 pr-10 rounded-xl border border-border/60 bg-background text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {isLoadingOrigin && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                  )}
                </div>
                
                {/* Origin suggestions dropdown */}
                {showOriginDropdown && originSuggestions.length > 0 && (
                  <div ref={originDropdownRef} className="property-autocomplete-dropdown">
                    {originSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        onClick={() => selectOriginSuggestion(suggestion)}
                        className="property-autocomplete-item"
                      >
                        <Navigation className="w-4 h-4 text-muted-foreground inline mr-2" />
                        <span className="text-sm">{suggestion.place_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedOriginName && (
                <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-secondary">
                  <div className="text-xs text-muted-foreground mb-1">Current location</div>
                  <div className="text-sm font-medium text-foreground">{selectedOriginName}</div>
                </div>
              )}
            </div>

            {/* Route Info */}
            {distance !== null && (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
                <div className="text-[10px] font-black tracking-[0.2em] uppercase text-primary mb-4">
                  Moving Distance
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-foreground">{distance.toLocaleString()} mi</div>
                      <div className="text-xs text-muted-foreground">approximate distance</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Helper text */}
            <p className="text-sm text-muted-foreground text-center">
              Type at least 3 characters to see address suggestions powered by Mapbox.
            </p>
          </div>

          {/* Map Preview */}
          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
            <div className="aspect-[4/3] lg:aspect-auto lg:h-[600px]">
              {propertyCoords ? (
                <PropertyMapPreview 
                  coordinates={propertyCoords}
                  originCoordinates={originCoords}
                  showRoute={showRoute}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-muted/30">
                  <MapPin className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    Enter an address to preview
                  </p>
                  <p className="text-sm text-muted-foreground/70 max-w-sm">
                    Start typing and select from the suggestions to see the property on the map
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
