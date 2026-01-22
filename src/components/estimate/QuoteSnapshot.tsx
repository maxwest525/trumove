import { useState } from "react";
import { ChevronDown, Pencil, MapPin, Calendar, Ruler, Home, Building2, Car, Package } from "lucide-react";
import { calculateTotalWeight, calculateTotalCubicFeet, type InventoryItem, type MoveDetails } from "@/lib/priceCalculator";
import logoImg from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { ExtendedMoveDetails } from "./EstimateWizard";

interface QuoteSnapshotProps {
  items: InventoryItem[];
  moveDetails: MoveDetails;
  extendedDetails?: ExtendedMoveDetails | null;
  onEdit?: () => void;
}

export default function QuoteSnapshot({ items, moveDetails, extendedDetails, onEdit }: QuoteSnapshotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const totalWeight = calculateTotalWeight(items);
  const totalCubicFeet = calculateTotalCubicFeet(items);
  
  // Expand when data is entered or on hover
  const hasData = moveDetails.fromLocation || moveDetails.toLocation || items.length > 0;
  const isExpanded = hasData || isHovered;

  // Format property type for display
  const formatPropertyType = (type: string, floor?: number, hasElevator?: boolean) => {
    if (type === 'apartment' && floor) {
      return `Apt ${floor}F ${hasElevator ? '(Elev)' : '(Stairs)'}`;
    }
    return type === 'house' ? 'House' : type || '—';
  };

  // Format home size for display
  const formatHomeSize = (size: string) => {
    const sizeMap: Record<string, string> = {
      'studio': 'Studio',
      '1br': '1 BR',
      '2br': '2 BR',
      '3br': '3 BR',
      '4br+': '4+ BR',
      'other': 'Other',
    };
    return sizeMap[size] || size || '—';
  };

  return (
    <div 
      className={cn(
        "lg:sticky lg:top-6 flex flex-col rounded-2xl border-2 border-border/60 bg-gradient-to-b from-card via-card to-muted/30 shadow-xl shadow-primary/5 transition-all duration-300 overflow-hidden",
        isExpanded ? "max-h-[800px]" : "max-h-[72px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header - Matching "Your Move Calculated" style */}
      <div className="tru-qb-form-header relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="TruMove" className="tru-qb-header-logo" />
          <span className="tru-qb-form-title">Your Move Calculated</span>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button 
              onClick={onEdit}
              className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              title="Edit move details"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-300",
            isExpanded ? "rotate-180" : "rotate-0"
          )} />
        </div>
      </div>

      {/* Compact Details Grid */}
      <div className="p-4 space-y-3 flex-1">
        {/* Origin Section */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="w-3 h-3 text-primary" />
            <span>Origin</span>
          </div>
          <div className="text-sm font-semibold text-foreground truncate pl-4">
            {moveDetails.fromLocation || 'Not set'}
          </div>
          <div className="flex gap-1.5 pl-4">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
              {extendedDetails?.fromPropertyType === 'house' ? <Home className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
              {formatPropertyType(extendedDetails?.fromPropertyType || '', extendedDetails?.fromFloor, extendedDetails?.fromHasElevator)}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
              {formatHomeSize(extendedDetails?.homeSize || moveDetails.homeSize || '')}
            </span>
          </div>
        </div>

        {/* Destination Section */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="w-3 h-3 text-primary" />
            <span>Destination</span>
          </div>
          <div className="text-sm font-semibold text-foreground truncate pl-4">
            {moveDetails.toLocation || 'Not set'}
          </div>
          <div className="flex gap-1.5 pl-4">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
              {extendedDetails?.toPropertyType === 'house' ? <Home className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
              {formatPropertyType(extendedDetails?.toPropertyType || '', extendedDetails?.toFloor, extendedDetails?.toHasElevator)}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
              {formatHomeSize(extendedDetails?.toHomeSize || '')}
            </span>
          </div>
        </div>

        {/* Move Info Bar */}
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50 border border-border/40">
          <div className="flex items-center gap-1.5 text-xs">
            <Ruler className="w-3 h-3 text-muted-foreground" />
            <span className="font-semibold text-foreground">{moveDetails.distance > 0 ? `${moveDetails.distance.toLocaleString()} mi` : '—'}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="font-semibold text-foreground">
              {extendedDetails?.moveDate ? format(extendedDetails.moveDate, 'MMM d, yyyy') : moveDetails.moveDate || '—'}
            </span>
          </div>
        </div>

        {/* Additional Services */}
        {(extendedDetails?.hasVehicleTransport || extendedDetails?.needsPackingService) && (
          <div className="flex gap-2">
            {extendedDetails.hasVehicleTransport && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                <Car className="w-3 h-3" />
                Vehicle Transport
              </span>
            )}
            {extendedDetails.needsPackingService && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                <Package className="w-3 h-3" />
                Packing
              </span>
            )}
          </div>
        )}

        {/* Inventory Stats */}
        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="text-center">
            <div className="text-lg font-black text-foreground">{items.length}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Items</div>
          </div>
          <div className="text-center border-x border-border/40">
            <div className="text-lg font-black text-foreground">{totalCubicFeet.toLocaleString()}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Cu Ft</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-foreground">{totalWeight > 0 ? `${(totalWeight / 1000).toFixed(1)}k` : '0'}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Lbs</div>
          </div>
        </div>
      </div>

      {/* Estimate */}
      <div className="px-4 py-3 bg-gradient-to-b from-primary/5 to-primary/10 border-t border-border/40">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Estimated cost</span>
          <span className="text-2xl font-black text-foreground">TBD</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          Final quote after inventory review
        </p>
      </div>
    </div>
  );
}
