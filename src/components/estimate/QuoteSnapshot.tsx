import { useState } from "react";
import { Video, Phone, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { calculateTotalWeight, calculateEstimate, determineMoveType, formatCurrency, type InventoryItem, type MoveDetails } from "@/lib/priceCalculator";
import logoImg from "@/assets/logo.png";
import { cn } from "@/lib/utils";

interface QuoteSnapshotProps {
  items: InventoryItem[];
  moveDetails: MoveDetails;
}

export default function QuoteSnapshot({ items, moveDetails }: QuoteSnapshotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const totalWeight = calculateTotalWeight(items);
  const effectiveMoveType = moveDetails.moveType === 'auto' 
    ? (moveDetails.distance >= 150 ? 'long-distance' : 'local')
    : moveDetails.moveType;
  
  const estimate = calculateEstimate(totalWeight, moveDetails.distance, effectiveMoveType);
  
  // Expand when data is entered or on hover
  const hasData = moveDetails.fromLocation || moveDetails.toLocation || items.length > 0;
  const isExpanded = hasData || isHovered;

  return (
    <div 
      className={cn(
        "lg:sticky lg:top-6 flex flex-col rounded-2xl border-2 border-border/60 bg-gradient-to-b from-card via-card to-muted/30 shadow-xl shadow-primary/5 transition-all duration-300 overflow-hidden",
        isExpanded ? "max-h-[800px]" : "max-h-[72px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header - Matching homepage style */}
      <div className="tru-qb-form-header relative">
        <img src={logoImg} alt="TruMove" className="tru-qb-header-logo" />
        <span className="tru-qb-form-title">Move Summary</span>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-300",
          isExpanded ? "rotate-180" : "rotate-0"
        )} />
      </div>

      {/* Details Grid */}
      <div className="p-5 space-y-3 flex-1">
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
