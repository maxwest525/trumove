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

// Sample city data for autocomplete - can be expanded
const CITY_DATABASE: LocationSuggestion[] = [
  { city: "Los Angeles", state: "CA", zip: "90001", display: "Los Angeles, CA" },
  { city: "Beverly Hills", state: "CA", zip: "90210", display: "Beverly Hills, CA" },
  { city: "San Francisco", state: "CA", zip: "94102", display: "San Francisco, CA" },
  { city: "San Diego", state: "CA", zip: "92101", display: "San Diego, CA" },
  { city: "New York", state: "NY", zip: "10001", display: "New York, NY" },
  { city: "Brooklyn", state: "NY", zip: "11201", display: "Brooklyn, NY" },
  { city: "Manhattan", state: "NY", zip: "10016", display: "Manhattan, NY" },
  { city: "Houston", state: "TX", zip: "77001", display: "Houston, TX" },
  { city: "Dallas", state: "TX", zip: "75201", display: "Dallas, TX" },
  { city: "Austin", state: "TX", zip: "78701", display: "Austin, TX" },
  { city: "Chicago", state: "IL", zip: "60601", display: "Chicago, IL" },
  { city: "Miami", state: "FL", zip: "33101", display: "Miami, FL" },
  { city: "Boca Raton", state: "FL", zip: "33431", display: "Boca Raton, FL" },
  { city: "Tampa", state: "FL", zip: "33602", display: "Tampa, FL" },
  { city: "Orlando", state: "FL", zip: "32801", display: "Orlando, FL" },
  { city: "Phoenix", state: "AZ", zip: "85001", display: "Phoenix, AZ" },
  { city: "Seattle", state: "WA", zip: "98101", display: "Seattle, WA" },
  { city: "Denver", state: "CO", zip: "80201", display: "Denver, CO" },
  { city: "Boston", state: "MA", zip: "02101", display: "Boston, MA" },
  { city: "Washington", state: "DC", zip: "20001", display: "Washington, DC" },
  { city: "Atlanta", state: "GA", zip: "30301", display: "Atlanta, GA" },
  { city: "Las Vegas", state: "NV", zip: "89101", display: "Las Vegas, NV" },
  { city: "Portland", state: "OR", zip: "97201", display: "Portland, OR" },
  { city: "Philadelphia", state: "PA", zip: "19101", display: "Philadelphia, PA" },
  { city: "Nashville", state: "TN", zip: "37201", display: "Nashville, TN" },
  { city: "Charlotte", state: "NC", zip: "28201", display: "Charlotte, NC" },
  { city: "San Antonio", state: "TX", zip: "78201", display: "San Antonio, TX" },
  { city: "Indianapolis", state: "IN", zip: "46201", display: "Indianapolis, IN" },
  { city: "Columbus", state: "OH", zip: "43201", display: "Columbus, OH" },
  { city: "Fort Worth", state: "TX", zip: "76101", display: "Fort Worth, TX" },
];

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

    // Check if it's a ZIP code (all digits)
    const isZip = /^\d+$/.test(query);

    if (isZip && query.length === 5) {
      // Look up ZIP code
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
    } else if (isZip) {
      // Partial ZIP - filter known ZIPs
      const filtered = CITY_DATABASE.filter(loc => 
        loc.zip.startsWith(query)
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      // City search - filter by city name
      const lowerQuery = query.toLowerCase();
      const filtered = CITY_DATABASE.filter(loc => 
        loc.city.toLowerCase().includes(lowerQuery) ||
        loc.state.toLowerCase().includes(lowerQuery) ||
        loc.display.toLowerCase().includes(lowerQuery)
      ).slice(0, 5);
      setSuggestions(filtered);
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
