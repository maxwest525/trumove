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

// Nominatim API for full street address autocomplete (mode="address")
async function searchNominatimAddresses(query: string): Promise<LocationSuggestion[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query)}&countrycodes=us&format=json&addressdetails=1&limit=5`,
      { 
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'TruMove/1.0'
        } 
      }
    );
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.map((item: any) => {
      const addr = item.address || {};
      const houseNumber = addr.house_number || '';
      const road = addr.road || addr.street || '';
      const streetAddress = [houseNumber, road].filter(Boolean).join(' ');
      const city = addr.city || addr.town || addr.village || addr.hamlet || addr.municipality || addr.county || '';
      const state = addr.state || '';
      const zip = addr.postcode || '';
      
      const displayParts = [streetAddress, city, state].filter(Boolean);
      const display = displayParts.join(', ');
      
      return {
        streetAddress,
        city,
        state,
        zip,
        display: display || item.display_name,
        fullAddress: item.display_name,
      };
    });
  } catch {
    return [];
  }
}

// Nominatim API for city-only search (mode="city")
async function searchNominatimCities(query: string): Promise<LocationSuggestion[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query)}&countrycodes=us&format=json&addressdetails=1&limit=5&featuretype=city`,
      { 
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'TruMove/1.0'
        } 
      }
    );
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.map((item: any) => {
      const addr = item.address || {};
      const city = addr.city || addr.town || addr.village || addr.hamlet || addr.municipality || item.name || '';
      const state = addr.state || '';
      const zip = addr.postcode || '';
      
      return {
        streetAddress: '',
        city,
        state,
        zip,
        display: `${city}, ${state}`,
        fullAddress: `${city}, ${state}${zip ? ` ${zip}` : ''}`,
      };
    });
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

    if (isCompleteZip) {
      // Look up complete ZIP code using zippopotam for accuracy
      const result = await lookupZip(query.trim());
      if (result) {
        setSuggestions([result]);
      } else {
        setSuggestions([]);
      }
    } else {
      // Use appropriate Nominatim search based on mode
      const results = mode === 'address' 
        ? await searchNominatimAddresses(query)
        : await searchNominatimCities(query);
      setSuggestions(results);
    }

    setIsLoading(false);
  }, []);

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
    
    // Pass through to parent handler
    if (onKeyDown && e.key === "Enter" && selectedIndex < 0) {
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
          className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-border/60 bg-card shadow-lg overflow-hidden"
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
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">
                    {suggestion.streetAddress 
                      ? `${suggestion.streetAddress}, ${suggestion.city}, ${suggestion.state}`
                      : suggestion.display
                    }
                  </span>
                  {suggestion.zip && (
                    <span className="text-xs text-muted-foreground">
                      {suggestion.zip}
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
