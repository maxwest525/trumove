import { useState, useCallback, useRef, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationSuggestion {
  city: string;
  state: string;
  zip: string;
  display: string;
}

interface LocationAutocompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  onLocationSelect: (city: string, zip: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtldWRqOXgwYzQ1M2Vvam51OGJrcGFiIn0.tN-ZMle93ctK7PIt9kU7JA';

async function searchMapbox(query: string): Promise<LocationSuggestion[]> {
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
      `access_token=${MAPBOX_TOKEN}&country=us&types=place,postcode,address&limit=5`
    );
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.features.map((f: any) => {
      const region = f.context?.find((c: any) => c.id.startsWith('region'));
      const postcode = f.context?.find((c: any) => c.id.startsWith('postcode'));
      const state = region?.short_code?.replace('US-', '') || '';
      const zip = postcode?.text || (f.id.startsWith('postcode') ? f.text : '');
      
      return {
        city: f.text,
        state,
        zip,
        display: f.place_name,
      };
    });
  } catch {
    return [];
  }
}

async function lookupZip(zip: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (res.ok) {
      const data = await res.json();
      return `${data.places[0]["place name"]}, ${data.places[0]["state abbreviation"]}`;
    }
  } catch {}
  return null;
}

export default function LocationAutocomplete({
  value,
  onValueChange,
  onLocationSelect,
  placeholder = "City or ZIP code",
  autoFocus = false,
  onKeyDown,
  className,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedCity, setSelectedCity] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  }, []);

  const searchLocations = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    setShowDropdown(true);

    // Check if it's a complete ZIP code (5 digits)
    const isCompleteZip = /^\d{5}$/.test(query);

    if (isCompleteZip) {
      // Look up ZIP code using zippopotam for accuracy
      const city = await lookupZip(query);
      if (city) {
        const [cityName, state] = city.split(", ");
        setSuggestions([{
          city: cityName,
          state: state,
          zip: query,
          display: city,
        }]);
      } else {
        setSuggestions([]);
      }
    } else {
      // Use Mapbox for city/address search
      const results = await searchMapbox(query);
      setSuggestions(results);
    }

    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);
    setSelectedCity("");
    searchLocations(newValue);
  };

  const handleSelect = (suggestion: LocationSuggestion) => {
    setSelectedCity(suggestion.display);
    onValueChange(suggestion.zip);
    onLocationSelect(suggestion.display, suggestion.zip);
    setShowDropdown(false);
    setSuggestions([]);
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

  const displayValue = selectedCity || value;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        className={cn(
          "w-full h-11 px-4 rounded-lg border border-border/60 bg-background text-sm font-medium",
          "placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40",
          "transition-colors transition-shadow duration-200",
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
      
      {showDropdown && (suggestions.length > 0 || isLoading) && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 z-50 rounded-lg border border-border/60 bg-card shadow-lg overflow-hidden min-w-[280px]"
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
                  "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                  idx === selectedIndex ? "bg-primary/10" : "hover:bg-muted/50"
                )}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                  {suggestion.display} {suggestion.zip}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
