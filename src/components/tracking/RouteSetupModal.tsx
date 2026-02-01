import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Navigation, Truck, CalendarIcon, Search, Loader2, Globe, Eye } from "lucide-react";
import { format } from "date-fns";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { cn } from "@/lib/utils";
import { MAPBOX_TOKEN } from "@/lib/mapboxToken";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyD8aMj_HlkLUWuYbZRU7I6oFGTavx2zKOc";

interface RouteSetupModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    originAddress: string;
    destAddress: string;
    moveDate?: Date;
    bookingNumber?: string;
  }) => void;
}

// Mock booking data for demo
const MOCK_BOOKINGS: Record<string, { origin: string; destination: string; date: Date }> = {
  '12345': {
    origin: '4520 Atlantic Blvd, Jacksonville, FL 32207',
    destination: '1000 Ocean Dr, Miami Beach, FL 33139',
    date: new Date(),
  },
  '00000': {
    origin: '123 Main St, Atlanta, GA 30301',
    destination: '456 Oak Ave, Tampa, FL 33601',
    date: new Date(Date.now() + 86400000), // Tomorrow
  },
};

// Geocode address to coordinates
async function geocodeAddress(address: string): Promise<[number, number] | null> {
  if (!address || address.length < 5) return null;
  
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
    console.error("Geocoding error:", error);
    return null;
  }
}

// Compact Street View Preview Component
function AddressPreview({ 
  address, 
  variant,
  coordinates 
}: { 
  address: string; 
  variant: "origin" | "destination";
  coordinates: [number, number] | null;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset states when address changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [address, coordinates]);

  // Google Street View Static API URL
  const streetViewUrl = coordinates
    ? `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${coordinates[1]},${coordinates[0]}&fov=90&heading=0&pitch=10&key=${GOOGLE_MAPS_API_KEY}`
    : null;

  // Google Static Maps satellite fallback
  const satelliteUrl = coordinates
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates[1]},${coordinates[0]}&zoom=17&size=400x200&maptype=hybrid&key=${GOOGLE_MAPS_API_KEY}`
    : null;

  const Icon = variant === "origin" ? Navigation : MapPin;
  const iconColor = variant === "origin" ? "text-primary" : "text-destructive";

  if (!coordinates) {
    return null;
  }

  return (
    <div className="relative w-full h-[100px] rounded-lg overflow-hidden border border-border bg-muted animate-in fade-in slide-in-from-bottom-2 duration-300">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {hasError ? (
        // Fallback to satellite view
        <img
          src={satelliteUrl || ""}
          alt={`Satellite view of ${address}`}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
          }}
        />
      ) : (
        <img
          src={streetViewUrl || ""}
          alt={`Street view of ${address}`}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(true);
          }}
        />
      )}

      {/* Location badge overlay */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center gap-1.5 px-2 py-1 rounded bg-background/90 backdrop-blur-sm border border-border">
        <Icon className={cn("w-3 h-3 flex-shrink-0", iconColor)} />
        <span className="text-[10px] font-medium text-foreground truncate">
          {address}
        </span>
      </div>

      {/* View type badge */}
      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm">
        {hasError ? (
          <Globe className="w-2.5 h-2.5 text-muted-foreground" />
        ) : (
          <Eye className="w-2.5 h-2.5 text-muted-foreground" />
        )}
        <span className="text-[8px] font-medium text-muted-foreground uppercase">
          {hasError ? "Satellite" : "Street"}
        </span>
      </div>
    </div>
  );
}

export function RouteSetupModal({ open, onClose, onSubmit }: RouteSetupModalProps) {
  const [originAddress, setOriginAddress] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [bookingNumber, setBookingNumber] = useState("");
  const [moveDate, setMoveDate] = useState<Date | undefined>(undefined);
  const [showDate, setShowDate] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  
  // Coordinates for Street View previews
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);

  // Geocode origin address when it changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (originAddress && originAddress.length > 5) {
        const coords = await geocodeAddress(originAddress);
        setOriginCoords(coords);
      } else {
        setOriginCoords(null);
      }
    }, 500); // Debounce
    
    return () => clearTimeout(timer);
  }, [originAddress]);

  // Geocode destination address when it changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (destAddress && destAddress.length > 5) {
        const coords = await geocodeAddress(destAddress);
        setDestCoords(coords);
      } else {
        setDestCoords(null);
      }
    }, 500); // Debounce
    
    return () => clearTimeout(timer);
  }, [destAddress]);

  // Auto-populate from booking number
  useEffect(() => {
    const trimmed = bookingNumber.trim();
    if (MOCK_BOOKINGS[trimmed]) {
      const booking = MOCK_BOOKINGS[trimmed];
      setOriginAddress(booking.origin);
      setDestAddress(booking.destination);
      setMoveDate(booking.date);
      setShowDate(true);
    } else {
      setShowDate(bookingNumber.trim().length > 0);
    }
  }, [bookingNumber]);

  // Check for pending route from cross-page navigation
  useEffect(() => {
    if (open) {
      const pendingRoute = localStorage.getItem('trumove_pending_route');
      if (pendingRoute) {
        try {
          const data = JSON.parse(pendingRoute);
          if (data.originAddress) setOriginAddress(data.originAddress);
          if (data.destAddress) setDestAddress(data.destAddress);
          localStorage.removeItem('trumove_pending_route');
        } catch (e) {
          console.error('Failed to parse pending route:', e);
        }
      }
    }
  }, [open]);

  const handleSubmit = () => {
    if (!originAddress.trim() || !destAddress.trim()) return;
    
    onSubmit({
      originAddress: originAddress.trim(),
      destAddress: destAddress.trim(),
      moveDate: showDate ? moveDate : undefined,
      bookingNumber: bookingNumber.trim() || undefined,
    });
  };

  const canSubmit = originAddress.trim() && destAddress.trim();

  // Keyboard shortcuts: Escape to close, Enter to submit
  useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Enter' && canSubmit && !e.shiftKey) {
        // Don't submit if user is typing in an input with suggestions
        const activeElement = document.activeElement;
        const isInAutocomplete = activeElement?.closest('[data-autocomplete]');
        if (!isInAutocomplete) {
          e.preventDefault();
          handleSubmit();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, canSubmit, onClose]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Track Your Shipment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Origin Address */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <Navigation className="w-3.5 h-3.5 text-primary" />
              Origin Address
            </Label>
            <LocationAutocomplete
              value={originAddress}
              onValueChange={setOriginAddress}
              onLocationSelect={(displayAddr, zip, fullAddress) => 
                setOriginAddress(fullAddress || displayAddr)
              }
              placeholder="Enter pickup address..."
              mode="address"
              className="w-full"
            />
            {/* Street View Preview for Origin */}
            {originCoords && (
              <AddressPreview 
                address={originAddress} 
                variant="origin" 
                coordinates={originCoords}
              />
            )}
          </div>

          {/* Destination Address */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-destructive" />
              Destination Address
            </Label>
            <LocationAutocomplete
              value={destAddress}
              onValueChange={setDestAddress}
              onLocationSelect={(displayAddr, zip, fullAddress) => 
                setDestAddress(fullAddress || displayAddr)
              }
              placeholder="Enter delivery address..."
              mode="address"
              className="w-full"
            />
            {/* Street View Preview for Destination */}
            {destCoords && (
              <AddressPreview 
                address={destAddress} 
                variant="destination" 
                coordinates={destCoords}
              />
            )}
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-3 py-2">
            <Separator className="flex-1" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Or</span>
            <Separator className="flex-1" />
          </div>

          {/* Booking/Shipping Number */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <Search className="w-3.5 h-3.5" />
              Booking / Shipping Number
            </Label>
            <Input
              value={bookingNumber}
              onChange={(e) => setBookingNumber(e.target.value)}
              placeholder="Enter booking code (try 12345)"
              className="w-full"
            />
            <p className="text-[10px] text-muted-foreground">
              Enter your booking number to auto-populate route details
            </p>
          </div>

          {/* Move Date - Only shown when booking number entered */}
          {showDate && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <CalendarIcon className="w-3.5 h-3.5" />
                Move Date
              </Label>
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !moveDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {moveDate ? format(moveDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={moveDate}
                    onSelect={(date) => {
                      setMoveDate(date);
                      setDatePopoverOpen(false);
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!canSubmit}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            <MapPin className="w-4 h-4 mr-2" />
            View Route
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
