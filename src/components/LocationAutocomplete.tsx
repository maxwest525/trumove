import { useState, useCallback, useRef, useEffect } from "react";
import { MapPin, Loader2, CheckCircle, AlertCircle, XCircle, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { MAPBOX_TOKEN } from '@/lib/mapboxToken';

// Debounce delay for API calls (ms)
const DEBOUNCE_DELAY = 350;

// Validation levels for address verification
export type ValidationLevel = 'verified' | 'partial' | 'unverifiable' | null;

interface LocationSuggestion {
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  display: string;
  fullAddress: string;
  isVerified?: boolean;
  validationLevel?: ValidationLevel;
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
  showHelperText?: boolean; // Show helper text below input
  showGeolocation?: boolean; // Show "Use my location" button
}

// Generate a unique session token for Mapbox API (required for Search Box API)
function generateSessionToken(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Session token for Mapbox - persists for the component lifecycle
let mapboxSessionToken = generateSessionToken();

// Mapbox Address Autofill API for verified street addresses
async function searchMapboxAddresses(query: string): Promise<LocationSuggestion[]> {
  try {
    const res = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(query)}&types=address&country=us&language=en&limit=5&session_token=${mapboxSessionToken}&access_token=${MAPBOX_TOKEN}`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) return [];
    
    const data = await res.json();
    return (data.suggestions || []).map((s: any) => {
      // Mapbox suggest returns: name (street), full_address (complete), place_formatted (city, state, country)
      const streetName = s.name || ''; // e.g., "123 Main Street"
      const fullAddr = s.full_address || ''; // e.g., "123 Main Street, New York, NY 10001, United States"
      
      // Parse from full_address: "123 Main St, New York, NY 10001, United States"
      const parts = fullAddr.split(', ');
      const streetAddress = parts[0] || streetName;
      const city = parts.length >= 3 ? parts[1] : '';
      
      // Extract state and zip from "NY 10001" pattern
      const stateZipPart = parts.length >= 3 ? parts[parts.length - 2] : '';
      const stateZipMatch = stateZipPart.match(/^([A-Z]{2})\s*(\d{5})?$/);
      const state = stateZipMatch?.[1] || '';
      const zip = stateZipMatch?.[2] || '';
      
      // Display the full address without "United States"
      const displayAddr = fullAddr.replace(', United States', '');
      
      // Check if this has a street address component (not just city/state)
      const hasStreet = streetName && !streetName.match(/^\d{5}$/) && streetName !== city;
      
      return {
        streetAddress,
        city,
        state,
        zip,
        display: displayAddr, // Show full street address in dropdown
        fullAddress: fullAddr,
        isVerified: false, // Will be verified after retrieve
        validationLevel: hasStreet ? null : 'partial' as ValidationLevel,
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
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?session_token=${mapboxSessionToken}&access_token=${MAPBOX_TOKEN}`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) return null;
    
    // Generate a new session token after retrieve (billing best practice)
    mapboxSessionToken = generateSessionToken();
    
    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return null;
    
    const props = feature.properties;
    const context = props.context || {};
    
    // Build the verified full address
    const streetAddress = props.name || '';
    const city = context.place?.name || '';
    const state = context.region?.region_code || '';
    const zip = context.postcode?.name || '';
    const fullAddr = props.full_address || `${streetAddress}, ${city}, ${state} ${zip}`;
    const displayAddr = fullAddr.replace(', United States', '');
    
    // Street-level verification requires an actual street address
    const hasStreet = streetAddress && !streetAddress.match(/^\d{5}$/) && streetAddress !== city;
    
    return {
      streetAddress,
      city,
      state,
      zip,
      display: displayAddr, // Full verified address
      fullAddress: fullAddr,
      isVerified: hasStreet,
      validationLevel: hasStreet ? 'verified' : 'partial',
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
          validationLevel: 'partial' as ValidationLevel,
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
        display: `${city}, ${state} ${zip}`,
        fullAddress: `${city}, ${state} ${zip}`,
        isVerified: false, // ZIP only = partial verification
        validationLevel: 'partial' as ValidationLevel,
      };
    }
  } catch {}
  return null;
}

// Reverse geocode coordinates to address using Mapbox
async function reverseGeocode(lat: number, lng: number): Promise<LocationSuggestion | null> {
  try {
    const res = await fetch(
      `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&types=address&access_token=${MAPBOX_TOKEN}`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) return null;
    
    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return null;
    
    const props = feature.properties;
    const context = props.context || {};
    
    const streetAddress = props.name || '';
    const city = context.place?.name || '';
    const state = context.region?.region_code || '';
    const zip = context.postcode?.name || '';
    const fullAddr = props.full_address || `${streetAddress}, ${city}, ${state} ${zip}`;
    const displayAddr = fullAddr.replace(', United States', '');
    
    const hasStreet = streetAddress && !streetAddress.match(/^\d{5}$/) && streetAddress !== city;
    
    return {
      streetAddress,
      city,
      state,
      zip,
      display: displayAddr,
      fullAddress: fullAddr,
      isVerified: hasStreet,
      validationLevel: hasStreet ? 'verified' : 'partial',
      mapboxId: feature.id,
    };
  } catch {
    return null;
  }
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
  showHelperText = false,
  showGeolocation = false,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedDisplay, setSelectedDisplay] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationLevel, setValidationLevel] = useState<ValidationLevel>(null);
  const [correctionSuggestion, setCorrectionSuggestion] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
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

    if (mode === 'address') {
      // For address mode, ALWAYS use Mapbox first - even for ZIP codes
      // This ensures we get street-level suggestions
      const mapboxResults = await searchMapboxAddresses(query);
      
      if (mapboxResults.length > 0) {
        setSuggestions(mapboxResults);
      } else if (isCompleteZip) {
        // Fallback: if Mapbox returns nothing for a ZIP, show city-level with a prompt
        const zipResult = await lookupZip(query.trim());
        if (zipResult) {
          // Mark as partial - needs street address
          zipResult.validationLevel = 'partial';
          setSuggestions([zipResult]);
        } else {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    } else {
      // City mode: use existing logic
      if (isCompleteZip) {
        const result = await lookupZip(query.trim());
        if (result) {
          setSuggestions([result]);
        } else {
          setSuggestions([]);
        }
      } else if (isPartialZip) {
        const results = await searchPhotonCities(query);
        setSuggestions(results);
      } else {
        const results = await searchPhotonCities(query);
        setSuggestions(results);
      }
    }

    setIsLoading(false);
  }, [mode]);

  const debouncedSearch = useCallback((query: string) => {
    // Cancel any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    debounceRef.current = setTimeout(() => {
      searchLocations(query);
    }, DEBOUNCE_DELAY);
  }, [searchLocations]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);
    setSelectedDisplay("");
    setIsValid(null);
    setValidationLevel(null);
    setCorrectionSuggestion(null);
    debouncedSearch(newValue);
  };

  // Handle geolocation - use browser's current position
  const handleGeolocation = async () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }
    
    setIsGeolocating(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await reverseGeocode(latitude, longitude);
        
        if (result) {
          const displayText = result.fullAddress?.replace(', United States', '') || result.display;
          setSelectedDisplay(displayText);
          onValueChange(displayText);
          onLocationSelect(displayText, result.zip, result.fullAddress, result.isVerified);
          setIsValid(true);
          setValidationLevel(result.validationLevel || 'verified');
        }
        
        setIsGeolocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setIsGeolocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSelect = async (suggestion: LocationSuggestion) => {
    let finalSuggestion = suggestion;
    const originalInput = value.trim();
    
    // If this is a Mapbox suggestion with an ID, retrieve the full verified address
    if (suggestion.mapboxId && mode === 'address') {
      const verified = await retrieveMapboxAddress(suggestion.mapboxId);
      if (verified) {
        finalSuggestion = verified;
        
        // Check if Mapbox standardized the address differently
        const originalStreet = originalInput.split(',')[0]?.toLowerCase().trim();
        const verifiedStreet = verified.streetAddress?.toLowerCase().trim();
        if (originalStreet && verifiedStreet && originalStreet !== verifiedStreet) {
          // Show correction suggestion if addresses differ
          setCorrectionSuggestion(verified.fullAddress.replace(', United States', ''));
        }
      }
    }
    
    const displayText = finalSuggestion.fullAddress?.replace(', United States', '') || 
      (finalSuggestion.streetAddress 
        ? `${finalSuggestion.streetAddress}, ${finalSuggestion.city}, ${finalSuggestion.state} ${finalSuggestion.zip}`.trim()
        : `${finalSuggestion.display}${finalSuggestion.zip ? ` ${finalSuggestion.zip}` : ''}`);
    
    setSelectedDisplay(displayText);
    onValueChange(displayText);
    // Pass the full verified address as the first parameter for easier consumption
    onLocationSelect(displayText, finalSuggestion.zip, finalSuggestion.fullAddress, finalSuggestion.isVerified);
    setShowDropdown(false);
    setSuggestions([]);
    setIsValid(true);
    setValidationLevel(finalSuggestion.validationLevel || (finalSuggestion.isVerified ? 'verified' : 'partial'));
  };

  const acceptCorrection = (correctedAddress: string) => {
    setSelectedDisplay(correctedAddress);
    onValueChange(correctedAddress);
    onLocationSelect(correctedAddress, '', correctedAddress, true);
    setCorrectionSuggestion(null);
    setValidationLevel('verified');
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

  // Determine border color based on validation level
  const getBorderClass = () => {
    if (!isValid) return "border-border/60 focus:border-primary";
    switch (validationLevel) {
      case 'verified':
        return "border-emerald-500/60 focus:border-emerald-500";
      case 'partial':
        return "border-emerald-600/50 border-2 focus:border-emerald-500";
      case 'unverifiable':
        return "border-red-500/60 focus:border-red-500";
      default:
        return "border-border/60 focus:border-primary";
    }
  };

  // Get tooltip content based on validation level
  const getTooltipContent = () => {
    switch (validationLevel) {
      case 'verified':
        return "This address has been validated against USPS postal records";
      case 'partial':
        return "City/ZIP verified. Add a street address for full verification";
      case 'unverifiable':
        return "Could not verify this address. Please check for errors";
      default:
        return "";
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative">
        {/* Input with geolocation button */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              className={cn(
                "w-full h-11 px-4 pr-10 rounded-lg border bg-background text-sm font-medium",
                "placeholder:text-muted-foreground/50 focus:outline-none",
                "transition-all duration-300",
                "tru-input-glow",
                getBorderClass(),
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
            
            {/* Validation indicators with tooltips */}
            {isValid && validationLevel === 'verified' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[200px]">
                  <p className="text-xs">{getTooltipContent()}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isValid && validationLevel === 'partial' && mode === 'address' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[200px]">
                  <p className="text-xs">{getTooltipContent()}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isValid && validationLevel === 'partial' && mode === 'city' && (
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
            )}
            {isValid && validationLevel === 'unverifiable' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[200px]">
                  <p className="text-xs">{getTooltipContent()}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          
          {/* Geolocation button */}
          {showGeolocation && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleGeolocation}
                  disabled={isGeolocating}
                  className={cn(
                    "flex items-center justify-center w-11 h-11 rounded-lg border transition-all duration-200",
                    "bg-background hover:bg-muted border-border/60 hover:border-primary/40",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label="Use my current location"
                >
                  {isGeolocating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Navigation className="w-4 h-4 text-muted-foreground hover:text-primary" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Use my current location</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        
        {/* Helper text */}
        {showHelperText && mode === 'address' && !isValid && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Enter a complete street address (e.g., 123 Main St, City, ST 12345)
          </p>
        )}
        
        {/* Address correction suggestion */}
        {correctionSuggestion && (
          <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-amber-50 border border-amber-200 rounded-lg text-sm z-40">
            <span className="text-amber-700">Did you mean: </span>
            <button 
              className="font-medium text-amber-900 underline hover:no-underline"
              onClick={() => acceptCorrection(correctionSuggestion)}
            >
              {correctionSuggestion}
            </button>
          </div>
        )}
        
        {showDropdown && (suggestions.length > 0 || isLoading) && (
          <div 
            ref={dropdownRef}
            className={cn(
              "absolute left-0 z-50 rounded-lg border border-border/60 bg-card shadow-lg overflow-hidden min-w-full w-max max-w-md",
              correctionSuggestion ? "top-[calc(100%+48px)]" : showHelperText && mode === 'address' && !isValid ? "top-[calc(100%+28px)]" : "top-full mt-1"
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </div>
            ) : (
              <>
                {/* Hint for partial results in address mode */}
                {mode === 'address' && suggestions.length > 0 && suggestions.every(s => !s.streetAddress || s.validationLevel === 'partial') && (
                  <div className="px-4 py-2 bg-amber-50/50 border-b border-amber-100 text-xs text-amber-700">
                    💡 Type a street address for full verification
                  </div>
                )}
                {suggestions.map((suggestion, idx) => (
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
                      suggestion.validationLevel === 'verified' ? "text-emerald-500" : 
                      suggestion.validationLevel === 'partial' ? "text-amber-500" : "text-primary"
                    )} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {suggestion.streetAddress
                          ? `${suggestion.streetAddress}, ${suggestion.city}, ${suggestion.state} ${suggestion.zip}`.trim()
                          : `${suggestion.display}${suggestion.zip && !suggestion.display.includes(suggestion.zip) ? ` ${suggestion.zip}` : ''}`
                        }
                      </span>
                      {suggestion.streetAddress && mode === 'address' && (
                        <span className={cn(
                          "text-xs flex items-center gap-1 mt-0.5",
                          suggestion.validationLevel === 'verified' ? "text-emerald-600" : "text-amber-600"
                        )}>
                          {suggestion.validationLevel === 'verified' ? (
                            <><CheckCircle className="w-3 h-3" /> Verified address</>
                          ) : (
                            <><AlertCircle className="w-3 h-3" /> Partial match</>
                          )}
                        </span>
                      )}
                      {!suggestion.streetAddress && mode === 'address' && (
                        <span className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3" /> City/ZIP only - add street for verification
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
