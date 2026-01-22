import { useEffect, useState } from "react";
import { format } from "date-fns";
import { type MoveDetails, determineMoveType } from "@/lib/priceCalculator";
import { calculateDistance } from "@/lib/distanceCalculator";
import { MapPin, Calendar, ArrowUpDown, Package, Truck, Home } from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import MapboxMoveMap from "@/components/MapboxMoveMap";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface MoveDetailsFormProps {
  moveDetails: MoveDetails;
  onUpdate: (updates: Partial<MoveDetails>) => void;
  onProceed: () => void;
}

const HOME_SIZES = [
  { value: 'studio', label: 'Studio' },
  { value: '1br', label: '1BR' },
  { value: '2br', label: '2BR' },
  { value: '3br', label: '3BR' },
  { value: '4br+', label: '4+' },
] as const;

export default function MoveDetailsForm({ 
  moveDetails, 
  onUpdate, 
  onProceed 
}: MoveDetailsFormProps) {
  const [hasStairs, setHasStairs] = useState(false);
  const [needsPacking, setNeedsPacking] = useState(false);
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [dateOpen, setDateOpen] = useState(false);

  // Auto-calculate distance when locations change
  useEffect(() => {
    const extractZip = (location: string): string => {
      const match = location.match(/\b\d{5}\b/);
      return match ? match[0] : '';
    };
    
    const fromZip = extractZip(moveDetails.fromLocation);
    const toZip = extractZip(moveDetails.toLocation);
    
    if (fromZip && toZip) {
      const calculatedDistance = calculateDistance(fromZip, toZip);
      if (calculatedDistance > 0) {
        const moveType = determineMoveType(calculatedDistance);
        onUpdate({ distance: calculatedDistance, moveType });
      }
    }
  }, [moveDetails.fromLocation, moveDetails.toLocation, onUpdate]);

  const canProceed = moveDetails.fromLocation && moveDetails.toLocation && moveDetails.moveDate && moveDetails.homeSize;

  const selectedDate = moveDetails.moveDate ? new Date(moveDetails.moveDate + 'T00:00:00') : undefined;

  return (
    <div className="space-y-4">
      {/* Location Inputs - TOP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-semibold text-muted-foreground">From</span>
          </div>
          <LocationAutocomplete
            value={moveDetails.fromLocation}
            onValueChange={(val) => onUpdate({ fromLocation: val })}
            onLocationSelect={(city, zip) => {
              setFromCity(city);
              onUpdate({ fromLocation: zip });
            }}
            placeholder="Full address"
            mode="address"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground">To</span>
          </div>
          <LocationAutocomplete
            value={moveDetails.toLocation}
            onValueChange={(val) => onUpdate({ toLocation: val })}
            onLocationSelect={(city, zip) => {
              setToCity(city);
              onUpdate({ toLocation: zip });
            }}
            placeholder="Full address"
            mode="address"
          />
        </div>
      </div>

      {/* Route Summary Strip */}
      {moveDetails.distance > 0 && (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold text-foreground">
            {moveDetails.distance.toLocaleString()} mi
          </span>
          <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full ${
            moveDetails.moveType === 'long-distance' 
              ? 'bg-amber-500/20 text-amber-600' 
              : 'bg-emerald-500/20 text-emerald-600'
          }`}>
            {moveDetails.moveType === 'long-distance' ? 'Long Distance' : 'Local'}
          </span>
        </div>
      )}

      {/* Mini Route Map Preview */}
      {moveDetails.fromLocation && moveDetails.toLocation && moveDetails.distance > 0 && (
        <div className="rounded-xl overflow-hidden border border-border/40 h-28">
          <MapboxMoveMap 
            fromZip={moveDetails.fromLocation}
            toZip={moveDetails.toLocation}
          />
        </div>
      )}

      {/* Move Date + Home Size - SAME ROW */}
      <div className="flex gap-3">
        {/* Move Date Picker - Compact */}
        <div className="w-[140px] flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">Date</span>
          </div>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-xs font-medium text-left flex items-center gap-2 transition-all hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  !selectedDate && "text-muted-foreground/60"
                )}
              >
                <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    onUpdate({ moveDate: format(date, "yyyy-MM-dd") });
                    setDateOpen(false);
                  }
                }}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Home Size Selector */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">Home Size</span>
          </div>
          <div className="flex gap-1.5">
            {HOME_SIZES.map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() => onUpdate({ homeSize: size.value })}
                className={cn(
                  "flex-1 h-10 rounded-lg text-xs font-bold transition-all border-2",
                  moveDetails.homeSize === size.value
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-transparent bg-muted/60 text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Options - Inline */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setHasStairs(!hasStairs)}
          className={`flex-1 flex items-center justify-center gap-2 h-10 px-3 rounded-lg border text-xs font-semibold transition-all ${
            hasStairs
              ? 'bg-primary/10 border-primary/40 text-primary'
              : 'bg-background border-border/60 text-foreground/70 hover:bg-muted/50'
          }`}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          Stairs
        </button>
        <button
          type="button"
          onClick={() => setNeedsPacking(!needsPacking)}
          className={`flex-1 flex items-center justify-center gap-2 h-10 px-3 rounded-lg border text-xs font-semibold transition-all ${
            needsPacking
              ? 'bg-primary/10 border-primary/40 text-primary'
              : 'bg-background border-border/60 text-foreground/70 hover:bg-muted/50'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Packing Help
        </button>
      </div>

      {/* Proceed Button */}
      <button
        type="button"
        onClick={onProceed}
        disabled={!canProceed}
        className={cn(
          "w-full h-12 rounded-xl text-sm font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-3",
          "border-2 border-primary bg-primary/10 text-primary",
          "hover:-translate-y-0.5 hover:bg-primary/20 hover:shadow-lg",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:border-muted disabled:bg-muted/50 disabled:text-muted-foreground"
        )}
      >
        <Truck className="w-5 h-5" />
        Proceed to Inventory
      </button>
    </div>
  );
}
