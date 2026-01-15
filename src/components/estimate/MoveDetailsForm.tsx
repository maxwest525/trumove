import { useEffect, useState } from "react";
import { type MoveDetails, determineMoveType } from "@/lib/priceCalculator";
import { calculateDistance } from "@/lib/distanceCalculator";
import { MapPin, Calendar, ArrowUpDown, Package } from "lucide-react";

interface MoveDetailsFormProps {
  moveDetails: MoveDetails;
  onUpdate: (updates: Partial<MoveDetails>) => void;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onContactUpdate: (updates: Partial<{ name: string; email: string; phone: string }>) => void;
  onSubmit: () => void;
}

export default function MoveDetailsForm({ 
  moveDetails, 
  onUpdate, 
  contactInfo, 
  onContactUpdate,
  onSubmit 
}: MoveDetailsFormProps) {
  const [hasStairs, setHasStairs] = useState(false);
  const [needsPacking, setNeedsPacking] = useState(false);

  // Auto-calculate distance when locations change
  useEffect(() => {
    // Extract ZIP codes from location strings
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

  return (
    <div className="space-y-6">
      {/* Route Summary Strip */}
      {moveDetails.distance > 0 && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">
              {moveDetails.distance.toLocaleString()} miles
            </span>
          </div>
          <div className="w-px h-4 bg-border" />
          <span className={`text-xs font-bold tracking-wide uppercase px-2 py-1 rounded-full ${
            moveDetails.moveType === 'long-distance' 
              ? 'bg-amber-500/20 text-amber-600' 
              : 'bg-emerald-500/20 text-emerald-600'
          }`}>
            {moveDetails.moveType === 'long-distance' ? 'Long Distance' : 'Local Move'}
          </span>
        </div>
      )}

      {/* Location Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-foreground block mb-2">
            Moving from (city or ZIP)
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={moveDetails.fromLocation}
              onChange={(e) => onUpdate({ fromLocation: e.target.value })}
              placeholder="Oakland Park, FL or 33334"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground block mb-2">
            Moving to (city or ZIP)
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={moveDetails.toLocation}
              onChange={(e) => onUpdate({ toLocation: e.target.value })}
              placeholder="Atlanta, GA or 30301"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Move Date */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-2">
          Target move date
        </label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="date"
            value={moveDetails.moveDate}
            onChange={(e) => onUpdate({ moveDate: e.target.value })}
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Quick Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setHasStairs(!hasStairs)}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-150 ${
            hasStairs
              ? 'bg-primary/10 border-primary/40 shadow-[0_0_0_4px_hsl(var(--primary)/0.1)]'
              : 'bg-card border-border/60 hover:bg-muted/50'
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            hasStairs ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            <ArrowUpDown className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-foreground">Stairs involved?</div>
            <div className="text-xs text-muted-foreground">Flights at pickup or delivery</div>
          </div>
          <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            hasStairs ? 'border-primary bg-primary' : 'border-muted-foreground/40'
          }`}>
            {hasStairs && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setNeedsPacking(!needsPacking)}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-150 ${
            needsPacking
              ? 'bg-primary/10 border-primary/40 shadow-[0_0_0_4px_hsl(var(--primary)/0.1)]'
              : 'bg-card border-border/60 hover:bg-muted/50'
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            needsPacking ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            <Package className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-foreground">Need help packing?</div>
            <div className="text-xs text-muted-foreground">Full or partial packing service</div>
          </div>
          <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            needsPacking ? 'border-primary bg-primary' : 'border-muted-foreground/40'
          }`}>
            {needsPacking && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
          </div>
        </button>
      </div>

      {/* Contact Info */}
      <div className="pt-4 border-t border-border/40">
        <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-3">
          Your contact info
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-2">
              Full name
            </label>
            <input
              type="text"
              value={contactInfo.name}
              onChange={(e) => onContactUpdate({ name: e.target.value })}
              placeholder="Your full name"
              className="w-full h-12 px-4 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-2">
                Email
              </label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => onContactUpdate({ email: e.target.value })}
                placeholder="you@example.com"
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => onContactUpdate({ phone: e.target.value })}
                placeholder="(555) 555-5555"
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div>
        <button
          type="button"
          onClick={onSubmit}
          className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-sm font-bold tracking-wide uppercase transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_hsl(var(--primary)/0.3)] flex items-center justify-center gap-2"
        >
          Finalize My Estimate
          <span className="text-lg">→</span>
        </button>
        <p className="mt-3 text-xs text-muted-foreground text-center">
          By finalizing your estimate you authorize TruMove LLC to contact you.
        </p>
      </div>
    </div>
  );
}