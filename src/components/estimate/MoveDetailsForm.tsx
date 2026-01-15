import { useEffect, useState } from "react";
import { type MoveDetails, determineMoveType } from "@/lib/priceCalculator";
import { calculateDistance } from "@/lib/distanceCalculator";
import { MapPin, Calendar, ArrowUpDown, Package, ArrowRight } from "lucide-react";

interface MoveDetailsFormProps {
  moveDetails: MoveDetails;
  onUpdate: (updates: Partial<MoveDetails>) => void;
  onProceed: () => void;
}

export default function MoveDetailsForm({ 
  moveDetails, 
  onUpdate, 
  onProceed 
}: MoveDetailsFormProps) {
  const [hasStairs, setHasStairs] = useState(false);
  const [needsPacking, setNeedsPacking] = useState(false);

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

  const canProceed = moveDetails.fromLocation && moveDetails.toLocation && moveDetails.moveDate;

  return (
    <div className="space-y-4">
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

      {/* Location + Date Row */}
      <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_140px] gap-3">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={moveDetails.fromLocation}
            onChange={(e) => onUpdate({ fromLocation: e.target.value })}
            placeholder="From ZIP"
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-border/60 bg-background text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={moveDetails.toLocation}
            onChange={(e) => onUpdate({ toLocation: e.target.value })}
            placeholder="To ZIP"
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-border/60 bg-background text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          />
        </div>
        <div className="relative col-span-2 md:col-span-1">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="date"
            value={moveDetails.moveDate}
            onChange={(e) => onUpdate({ moveDate: e.target.value })}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          />
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
        className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-bold tracking-wide uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        Proceed to Inventory
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}