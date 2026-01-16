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
          className="flex items-center gap-4 w-full px-4 py-3 rounded-xl border-2 border-primary/20 bg-primary/5 text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg group"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
            <Video className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-foreground">Book Video Consult</span>
            <span className="text-xs text-muted-foreground">Live walkthrough with an expert</span>
          </div>
        </Link>
        
        <a
          href="tel:+16097277647"
          className="flex items-center gap-4 w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg group"
        >
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
            <Phone className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-foreground">Call Now</span>
            <span className="text-xs text-muted-foreground">Speak to someone immediately</span>
          </div>
        </a>
        
        <p className="text-xs text-center text-muted-foreground">
          Not ready to decide? Use these options to get personalized help.
        </p>
      </div>
    </div>
  );
}
