import { useState, useCallback, useRef, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtldWRqOXgwYzQ1M2Vvam51OGJrcGFiIn0.tN-ZMle93ctK7PIt9kU7JA';

interface AddressSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
}

interface AddressAutocompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  onAddressSelect: (address: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
}

export default function AddressAutocomplete({
  value,
  onValueChange,
  onAddressSelect,
  placeholder = "Enter your full address",
  autoFocus = false,
  onKeyDown,
  className,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
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
  }, []);

  const searchAddresses = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    setShowDropdown(true);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=US&types=address,place&limit=5`
      );
      const data = await response.json();
      
      const addressSuggestions: AddressSuggestion[] = data.features?.map((f: any) => ({
        id: f.id,
        place_name: f.place_name,
        center: f.center as [number, number],
      })) || [];

      setSuggestions(addressSuggestions);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);
    
    // Debounce the API call
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchAddresses(newValue);
    }, 300);
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    onValueChange(suggestion.place_name);
    onAddressSelect(suggestion.place_name);
    setShowDropdown(false);
    setSuggestions([]);
    setSelectedIndex(-1);
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
        setSelectedIndex(-1);
      }
    }
    
    // Pass through to parent handler
    if (onKeyDown && e.key === "Enter" && selectedIndex < 0) {
      onKeyDown(e);
    }
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full">
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
        value={value}
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
          className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-border/60 bg-card shadow-lg overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching addresses...</span>
            </div>
          ) : (
            suggestions.map((suggestion, idx) => (
              <div
                key={suggestion.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                  idx === selectedIndex ? "bg-primary/10" : "hover:bg-muted/50"
                )}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  {suggestion.place_name}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
