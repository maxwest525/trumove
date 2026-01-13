import { Video, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { calculateTotalWeight, calculateEstimate, determineMoveType, formatCurrency, type InventoryItem, type MoveDetails } from "@/lib/priceCalculator";

interface QuoteSnapshotProps {
  items: InventoryItem[];
  moveDetails: MoveDetails;
}

export default function QuoteSnapshot({ items, moveDetails }: QuoteSnapshotProps) {
  const totalWeight = calculateTotalWeight(items);
  const effectiveMoveType = moveDetails.moveType === 'auto' 
    ? (moveDetails.distance >= 150 ? 'long-distance' : 'local')
    : moveDetails.moveType;
  
  const estimate = calculateEstimate(totalWeight, moveDetails.distance, effectiveMoveType);

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-lg">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-b from-muted/30 to-transparent border-b border-border/40">
        <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">
          Your move snapshot
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Live view of what TruMove will use for your quote.
        </p>
      </div>

      {/* Details Grid */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-border/20">
          <span className="text-sm font-medium text-muted-foreground">From</span>
          <span className="text-sm font-semibold text-foreground">
            {moveDetails.fromLocation || 'Not set'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/20">
          <span className="text-sm font-medium text-muted-foreground">To</span>
          <span className="text-sm font-semibold text-foreground">
            {moveDetails.toLocation || 'Not set'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/20">
          <span className="text-sm font-medium text-muted-foreground">Distance</span>
          <span className="text-sm font-semibold text-foreground">
            {moveDetails.distance > 0 ? `${moveDetails.distance} miles` : 'Add miles'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/20">
          <span className="text-sm font-medium text-muted-foreground">Move type</span>
          <span className="text-sm font-semibold text-foreground capitalize">
            {moveDetails.moveType === 'auto' ? 'Auto based on miles' : moveDetails.moveType}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/20">
          <span className="text-sm font-medium text-muted-foreground">Move date</span>
          <span className="text-sm font-semibold text-foreground">
            {moveDetails.moveDate || 'Select date'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-muted-foreground">Total weight</span>
          <span className="text-sm font-semibold text-foreground">
            {totalWeight.toLocaleString()} lbs
          </span>
        </div>
      </div>

      {/* Estimate */}
      <div className="px-5 py-4 bg-gradient-to-b from-primary/5 to-primary/10 border-t border-border/40">
        <div className="text-xs text-muted-foreground mb-2">
          Rough estimate based on your inventory, move type, and distance:
        </div>
        <div className="text-3xl font-black text-foreground">
          {estimate.min === 0 ? (
            <span className="text-lg font-semibold text-muted-foreground">
              Add items in Step 1 to see a starting range.
            </span>
          ) : (
            <>{formatCurrency(estimate.min)} – {formatCurrency(estimate.max)}</>
          )}
        </div>
      </div>

      {/* CTAs */}
      <div className="p-5 space-y-3 border-t border-border/40">
        <Link
          to="/book"
          className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-foreground text-background text-sm font-bold tracking-wide uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Video className="w-4 h-4" />
          Schedule video consult
        </Link>
        <a
          href="tel:+16097277647"
          className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-border/60 bg-card text-foreground text-sm font-bold tracking-wide uppercase transition-all hover:bg-muted/50"
        >
          <Phone className="w-4 h-4" />
          Schedule a call
        </a>
        <p className="text-xs text-center text-muted-foreground">
          If you are not ready to call, schedule a video consult or call using the buttons above.
        </p>
      </div>
    </div>
  );
}
