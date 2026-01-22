import { Pencil, MapPin, Calendar, Ruler, Car, Package, Box, Scale } from "lucide-react";
import { calculateTotalWeight, calculateTotalCubicFeet, type InventoryItem, type MoveDetails } from "@/lib/priceCalculator";
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
  const totalWeight = calculateTotalWeight(items);
  const totalCubicFeet = calculateTotalCubicFeet(items);

  // Format property type for display - plain text
  const formatPropertyType = (type: string, floor?: number, hasElevator?: boolean) => {
    if (!type) return '';
    if (type === 'apartment' && floor) {
      return `Apartment • Floor ${floor} ${hasElevator ? '(Elevator)' : '(Stairs)'}`;
    }
    return type === 'house' ? 'House' : type;
  };

  // Format home size for display - plain text
  const formatHomeSize = (size: string) => {
    const sizeMap: Record<string, string> = {
      'studio': 'Studio',
      '1br': '1 BR',
      '2br': '2 BR',
      '3br': '3 BR',
      '4br+': '4+ BR',
      'other': 'Other',
    };
    return sizeMap[size] || size || '';
  };

  // Build origin detail line
  const originPropertyLine = [
    formatPropertyType(extendedDetails?.fromPropertyType || '', extendedDetails?.fromFloor, extendedDetails?.fromHasElevator),
    formatHomeSize(extendedDetails?.homeSize || moveDetails.homeSize || '')
  ].filter(Boolean).join(' • ');

  // Build destination detail line
  const destPropertyLine = [
    formatPropertyType(extendedDetails?.toPropertyType || '', extendedDetails?.toFloor, extendedDetails?.toHasElevator),
    formatHomeSize(extendedDetails?.toHomeSize || '')
  ].filter(Boolean).join(' • ');

  return (
    <div className="tru-move-summary-card is-expanded w-full max-w-[320px]">
      {/* Header - No logo, compact */}
      <div className="tru-summary-header-compact">
        <div className="flex-1">
          <span className="text-sm font-bold text-foreground">
            Your Move <span className="tru-qb-title-accent">Calculated</span>
          </span>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">All details from your form</p>
        </div>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            title="Edit move details"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className="p-3 space-y-2.5">
        {/* Origin Section */}
        <div className="tru-summary-row">
          <div className="tru-summary-row-header">
            <MapPin className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Origin</span>
          </div>
          <p className="text-xs font-medium text-foreground truncate pl-4">
            {moveDetails.fromLocation || '—'}
          </p>
          {originPropertyLine && (
            <p className="text-[10px] text-muted-foreground pl-4">{originPropertyLine}</p>
          )}
        </div>

        {/* Destination Section */}
        <div className="tru-summary-row">
          <div className="tru-summary-row-header">
            <MapPin className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Destination</span>
          </div>
          <p className="text-xs font-medium text-foreground truncate pl-4">
            {moveDetails.toLocation || '—'}
          </p>
          {destPropertyLine && (
            <p className="text-[10px] text-muted-foreground pl-4">{destPropertyLine}</p>
          )}
        </div>

        {/* Distance & Date Row */}
        <div className="flex items-center gap-3 py-1.5 border-t border-b border-border/40">
          <div className="flex items-center gap-1">
            <Ruler className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium">
              {moveDetails.distance > 0 ? `${moveDetails.distance.toLocaleString()} mi` : '—'}
            </span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium">
              {extendedDetails?.moveDate ? format(extendedDetails.moveDate, 'MMM d, yyyy') : moveDetails.moveDate || '—'}
            </span>
          </div>
        </div>

        {/* Additional Services - Compact row */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1">
            <Car className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Vehicle:</span>
            <span className={cn(
              "font-medium",
              extendedDetails?.hasVehicleTransport ? "text-primary" : "text-muted-foreground"
            )}>
              {extendedDetails?.hasVehicleTransport ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1">
            <Package className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Packing:</span>
            <span className={cn(
              "font-medium",
              extendedDetails?.needsPackingService ? "text-primary" : "text-muted-foreground"
            )}>
              {extendedDetails?.needsPackingService ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {/* Inventory Stats - Single row with icons */}
        <div className="flex items-center justify-between py-1.5 px-2 bg-muted/30 rounded-md border border-border/40 text-xs">
          <div className="flex items-center gap-1">
            <Box className="w-3 h-3 text-muted-foreground" />
            <span className="font-bold text-foreground">{items.length}</span>
            <span className="text-muted-foreground">items</span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1">
            <span className="font-bold text-foreground">{totalCubicFeet.toLocaleString()}</span>
            <span className="text-muted-foreground">cu ft</span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1">
            <Scale className="w-3 h-3 text-muted-foreground" />
            <span className="font-bold text-foreground">{totalWeight > 0 ? `${(totalWeight / 1000).toFixed(1)}k` : '0'}</span>
            <span className="text-muted-foreground">lbs</span>
          </div>
        </div>

        {/* Estimate */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">Estimated</span>
          <span className="text-lg font-bold text-primary">TBD</span>
        </div>
        <p className="text-[10px] text-center text-muted-foreground">
          Final quote after inventory review
        </p>
      </div>
    </div>
  );
}
