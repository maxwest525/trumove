import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Navigation, Truck, CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { cn } from "@/lib/utils";

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

export function RouteSetupModal({ open, onClose, onSubmit }: RouteSetupModalProps) {
  const [originAddress, setOriginAddress] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [bookingNumber, setBookingNumber] = useState("");
  const [moveDate, setMoveDate] = useState<Date | undefined>(undefined);
  const [showDate, setShowDate] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

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
      <DialogContent className="sm:max-w-lg">
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
