import { useState, useCallback, useRef, useEffect } from "react";
import { MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mapbox token (same as MoveMap)
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbTkycWc4dWYwZHdwMnFwdnZyanlM6XCog7Y0nrPt-5v-E2g';

interface LocationSuggestion {
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  display: string;
  fullAddress: string;
  isVerified?: boolean;
  mapboxId?: string;
}

interface LocationAutocompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  onLocationSelect: (city: string, zip: string, fullAddress?: string, isVerified?: boolean) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
  mode?: 'city' | 'address'; // 'city' for homepage, 'address' for full street addresses
}

// Mapbox Address Autofill API for verified street addresses
async function searchMapboxAddresses(query: string): Promise<LocationSuggestion[]> {
  try {
    const res = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(query)}&types=address&country=us&language=en&limit=5&access_token=${MAPBOX_TOKEN}`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) return [];
    
    const data = await res.json();
    return (data.suggestions || []).map((s: any) => {
      const parts = s.full_address?.split(', ') || [];
      const streetAddress = s.address || parts[0] || '';
      const city = s.place || parts[1] || '';
      const stateZip = parts[2] || '';
      const [state, zip] = stateZip.split(' ');
      
      return {
        streetAddress,
        city,
        state: state || '',
        zip: zip || '',
        display: `${city}, ${state || ''}`.trim(),
        fullAddress: s.full_address || `${streetAddress}, ${city}, ${state} ${zip}`.trim(),
        isVerified: true,
        mapboxId: s.mapbox_id,
      };
    });
  } catch {
    return [];
  }
}

// Retrieve full verified address from Mapbox
async function retrieveMapboxAddress(mapboxId: string): Promise<LocationSuggestion | null> {
  try {
    const res = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?access_token=${MAPBOX_TOKEN}`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) return null;
    
    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return null;
    
    const props = feature.properties;
    const context = props.context || {};
    
    return {
      streetAddress: props.address || props.name || '',
      city: context.place?.name || '',
      state: context.region?.region_code || '',
      zip: context.postcode?.name || '',
      display: `${context.place?.name || ''}, ${context.region?.region_code || ''}`.trim(),
      fullAddress: props.full_address || '',
      isVerified: true,
      mapboxId,
    };
  } catch {
    return null;
  }
}

// Photon API for city-only search (mode="city") - CORS-friendly, fallback
async function searchPhotonCities(query: string): Promise<LocationSuggestion[]> {
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10&lang=en&layer=city,town,village`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.features
      .filter((f: any) => f.properties.country === 'United States')
      .map((f: any) => {
        const props = f.properties;
        const city = props.city || props.town || props.village || props.name || '';
        const state = props.state || '';
        const zip = props.postcode || '';
        
        return {
          streetAddress: '',
          city,
          state,
          zip,
          display: `${city}, ${state}`,
          fullAddress: `${city}, ${state}${zip ? ` ${zip}` : ''}`,
          isVerified: false,
        };
      })
      .slice(0, 5);
  } catch {
    return [];
  }
}

// ZIP code lookup for complete 5-digit codes
async function lookupZip(zip: string): Promise<LocationSuggestion | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (res.ok) {
      const data = await res.json();
      const city = data.places[0]["place name"];
      const state = data.places[0]["state abbreviation"];
      return {
        streetAddress: '',
        city,
        state,
        zip,
        display: `${city}, ${state}`,
        fullAddress: `${city}, ${state} ${zip}`,
        isVerified: true,
      };
    }
  } catch {}
  return null;
}

export default function LocationAutocomplete({
  value,
  onValueChange,
  onLocationSelect,
  placeholder = "City or ZIP",
  autoFocus = false,
  onKeyDown,
  className,
  mode = 'city', // Default to city-only mode
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedDisplay, setSelectedDisplay] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isClickingDropdownRef = useRef(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mode]);

  const searchLocations = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    setShowDropdown(true);
    setSelectedIndex(-1);

    // Check if it's a complete ZIP code (5 digits)
    const isCompleteZip = /^\d{5}$/.test(query.trim());
    const isPartialZip = /^\d{2,4}$/.test(query.trim());

    if (isCompleteZip) {
      // Look up complete ZIP code using zippopotam for accuracy
      const result = await lookupZip(query.trim());
      if (result) {
        setSuggestions([result]);
      } else {
        setSuggestions([]);
      }
    } else if (isPartialZip) {
      // For partial numeric input, use Photon as fallback
      const results = await searchPhotonCities(query);
      setSuggestions(results);
    } else {
      // Use Mapbox for addresses, Photon for cities
      if (mode === 'address') {
        const results = await searchMapboxAddresses(query);
        setSuggestions(results);
      } else {
        const results = await searchPhotonCities(query);
        setSuggestions(results);
      }
    }

    setIsLoading(false);
  }, [mode]);

  const debouncedSearch = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
  }, [searchLocations]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);
    setSelectedDisplay("");
    setIsValid(null);
    setIsVerified(false);
    debouncedSearch(newValue);
  };

  const handleSelect = async (suggestion: LocationSuggestion) => {
    let finalSuggestion = suggestion;
    
    // If this is a Mapbox suggestion with an ID, retrieve the full verified address
    if (suggestion.mapboxId && mode === 'address') {
      const verified = await retrieveMapboxAddress(suggestion.mapboxId);
      if (verified) {
        finalSuggestion = verified;
      }
    }
    
    const displayText = finalSuggestion.fullAddress || 
      (finalSuggestion.streetAddress 
        ? `${finalSuggestion.streetAddress}, ${finalSuggestion.city}, ${finalSuggestion.state} ${finalSuggestion.zip}`.trim()
        : `${finalSuggestion.display}${finalSuggestion.zip ? ` ${finalSuggestion.zip}` : ''}`);
    
    setSelectedDisplay(displayText);
    onValueChange(displayText);
    onLocationSelect(finalSuggestion.display, finalSuggestion.zip, finalSuggestion.fullAddress, finalSuggestion.isVerified);
    setShowDropdown(false);
    setSuggestions([]);
    setIsValid(true);
    setIsVerified(finalSuggestion.isVerified || false);
  };

  const handleKeyDownInternal = (e: React.KeyboardEvent) => {
    if (showDropdown && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        handleSelect(suggestions[selectedIndex]);
        return;
      } else if (e.key === "Tab" && suggestions.length > 0) {
        // Tab selects highlighted or first suggestion (Google Places behavior)
        const indexToSelect = selectedIndex >= 0 ? selectedIndex : 0;
        handleSelect(suggestions[indexToSelect]);
        // Don't preventDefault - let tab continue to next field
      } else if (e.key === "Escape") {
        setShowDropdown(false);
      }
    }
    
    // Pass through to parent handler - also set isValid to true if there's meaningful input
    if (onKeyDown && e.key === "Enter" && selectedIndex < 0) {
      // If user typed something meaningful, consider it valid for proceeding
      if (value.trim().length >= 3) {
        setIsValid(true);
      }
      onKeyDown(e);
    }
  };

  // Handle blur - autofill first/highlighted suggestion (Google Places behavior)
  const handleBlur = () => {
    // Slightly longer delay to allow click events on dropdown to fire first
    setTimeout(() => {
      // If user is clicking a dropdown item, don't interfere - let onClick handle it
      if (isClickingDropdownRef.current) {
        isClickingDropdownRef.current = false;
        return;
      }
      
      // Otherwise, auto-select first/highlighted suggestion (Google Places behavior)
      if (showDropdown && suggestions.length > 0) {
        const indexToSelect = selectedIndex >= 0 ? selectedIndex : 0;
        handleSelect(suggestions[indexToSelect]);
      }
      setShowDropdown(false);
    }, 200);
  };

  const displayValue = selectedDisplay || value;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        className={cn(
          "w-full h-11 px-4 pr-10 rounded-lg border bg-background text-sm font-medium",
          "placeholder:text-muted-foreground/50 focus:outline-none",
          "transition-all duration-300",
          "tru-input-glow",
          isValid === true 
            ? isVerified 
              ? "border-emerald-500/60 focus:border-emerald-500" 
              : "border-amber-500/60 focus:border-amber-500"
            : "border-border/60 focus:border-primary",
          className
        )}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDownInternal}
        onFocus={() => {
          if (suggestions.length > 0) setShowDropdown(true);
        }}
        onBlur={handleBlur}
        autoFocus={autoFocus}
      />
      
      {/* Validation indicators */}
      {isValid && isVerified && (
        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
      )}
      {isValid && !isVerified && mode === 'address' && (
        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
      )}
      {isValid && !isVerified && mode === 'city' && (
        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
      )}
      
      {showDropdown && (suggestions.length > 0 || isLoading) && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 z-50 rounded-lg border border-border/60 bg-card shadow-lg overflow-hidden min-w-full w-max max-w-md"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching...</span>
            </div>
          ) : (
            suggestions.map((suggestion, idx) => (
              <div
                key={`${suggestion.mapboxId || suggestion.zip}-${idx}`}
                className={cn(
                  "flex items-start gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                  idx === selectedIndex ? "bg-primary/10" : "hover:bg-muted/50"
                )}
                onMouseDown={() => {
                  isClickingDropdownRef.current = true;
                }}
                onClick={() => {
                  isClickingDropdownRef.current = false;
                  handleSelect(suggestion);
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <MapPin className={cn(
                  "w-4 h-4 flex-shrink-0 mt-0.5",
                  suggestion.isVerified ? "text-emerald-500" : "text-primary"
                )} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {suggestion.streetAddress
                      ? `${suggestion.streetAddress}, ${suggestion.city}, ${suggestion.state} ${suggestion.zip}`.trim()
                      : `${suggestion.display}${suggestion.zip ? ` ${suggestion.zip}` : ''}`
                    }
                  </span>
                  {suggestion.isVerified && mode === 'address' && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
                      <CheckCircle className="w-3 h-3" /> Verified address
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
