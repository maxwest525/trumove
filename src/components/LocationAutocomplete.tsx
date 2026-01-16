import { useState, useCallback, useRef, useEffect } from "react";
import { MapPin, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationSuggestion {
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  display: string;
  fullAddress: string;
}

interface LocationAutocompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  onLocationSelect: (city: string, zip: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
  mode?: 'city' | 'address'; // 'city' for homepage, 'address' for full street addresses
}

// Photon API for full street address autocomplete (mode="address") - CORS-friendly
async function searchPhotonAddresses(query: string): Promise<LocationSuggestion[]> {
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en&layer=house,street`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.features
      .filter((f: any) => f.properties.country === 'United States')
      .map((f: any) => {
        const props = f.properties;
        const houseNumber = props.housenumber || '';
        const street = props.street || props.name || '';
        const streetAddress = [houseNumber, street].filter(Boolean).join(' ');
        const city = props.city || props.town || props.village || props.locality || '';
        const state = props.state || '';
        const zip = props.postcode || '';
        
        return {
          streetAddress,
          city,
          state,
          zip,
          display: [streetAddress, city, state].filter(Boolean).join(', '),
          fullAddress: [streetAddress, city, state, zip].filter(Boolean).join(', '),
        };
      })
      .slice(0, 5);
  } catch {
    return [];
  }
}

// Photon API for city-only search (mode="city") - CORS-friendly
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
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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
      // For partial numeric input, search cities/addresses that might match
      const results = mode === 'address' 
        ? await searchPhotonAddresses(query)
        : await searchPhotonCities(query);
      setSuggestions(results);
    } else {
      // Use Photon API (CORS-friendly) based on mode
      const results = mode === 'address' 
        ? await searchPhotonAddresses(query)
        : await searchPhotonCities(query);
      setSuggestions(results);
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
    debouncedSearch(newValue);
  };

  const handleSelect = (suggestion: LocationSuggestion) => {
    const displayText = suggestion.zip 
      ? `${suggestion.display} ${suggestion.zip}`.trim()
      : suggestion.display;
    
    setSelectedDisplay(displayText);
    onValueChange(suggestion.zip || suggestion.fullAddress);
    onLocationSelect(suggestion.display, suggestion.zip);
    setShowDropdown(false);
    setSuggestions([]);
    setIsValid(true);
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

  const displayValue = selectedDisplay || value;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        className={cn(
          "w-full h-11 px-4 pr-10 rounded-lg border bg-background text-sm font-medium",
          "placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2",
          "transition-colors transition-shadow duration-200",
          isValid === true 
            ? "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500/20" 
            : "border-border/60 focus:border-primary/40 focus:ring-primary/20",
          className
        )}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDownInternal}
        onFocus={() => {
          if (suggestions.length > 0) setShowDropdown(true);
        }}
        autoFocus={autoFocus}
      />
      
      {/* Validation checkmark */}
      {isValid && (
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
                key={`${suggestion.zip}-${idx}`}
                className={cn(
                  "flex items-start gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                  idx === selectedIndex ? "bg-primary/10" : "hover:bg-muted/50"
                )}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-foreground">
                  {suggestion.streetAddress
                    ? `${suggestion.streetAddress}, ${suggestion.city}, ${suggestion.state} ${suggestion.zip}`.trim()
                    : `${suggestion.display}${suggestion.zip ? ` ${suggestion.zip}` : ''}`
                  }
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
