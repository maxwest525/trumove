import { Pencil, MapPin, Calendar, Ruler, Car, Package, Scale, Home, Truck } from "lucide-react";
import { type InventoryItem, type MoveDetails, calculateTotalWeight, calculateTotalCubicFeet } from "@/lib/priceCalculator";
import { format } from "date-fns";
import type { ExtendedMoveDetails } from "./EstimateWizard";

interface QuoteSnapshotVerticalProps {
  items: InventoryItem[];
  moveDetails: MoveDetails;
  extendedDetails?: ExtendedMoveDetails | null;
  onEdit?: () => void;
}

export default function QuoteSnapshotVertical({ items, moveDetails, extendedDetails, onEdit }: QuoteSnapshotVerticalProps) {
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

  // Determine move type label
  const getMoveTypeLabel = (type: string, distance: number) => {
    if (type === 'auto') {
      return distance > 0 ? 'Auto Based On Miles' : 'Auto Based On Miles';
    }
    return type === 'long-distance' ? 'Long Distance' : 'Local';
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
    <div className="tru-move-summary-card is-expanded w-full max-w-[300px]">
      {/* Header - Enlarged and Centered */}
      <div className="tru-summary-header-large relative">
        <div className="text-center flex-1">
          <h3 className="text-lg font-black text-foreground">
            Move <span className="tru-qb-title-accent">Summary</span>
          </h3>
        </div>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            title="Edit move details"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      
      {/* Content - Left aligned rows */}
      <div className="p-4 space-y-2.5 text-left">
        {/* From */}
        <div className="flex items-start justify-between py-1.5 border-b border-border/30">
          <span className="text-sm text-muted-foreground">From</span>
          <div className="text-right">
            <span className="text-sm font-medium text-foreground">
              {moveDetails.fromLocation || 'Not set'}
            </span>
            {originPropertyLine && (
              <p className="text-xs text-muted-foreground">{originPropertyLine}</p>
            )}
          </div>
        </div>

        {/* To */}
        <div className="flex items-start justify-between py-1.5 border-b border-border/30">
          <span className="text-sm text-muted-foreground">To</span>
          <div className="text-right">
            <span className="text-sm font-medium text-foreground">
              {moveDetails.toLocation || 'Not set'}
            </span>
            {destPropertyLine && (
              <p className="text-xs text-muted-foreground">{destPropertyLine}</p>
            )}
          </div>
        </div>

        {/* Distance */}
        <div className="flex items-center justify-between py-1.5 border-b border-border/30">
          <span className="text-sm text-muted-foreground">Distance</span>
          <span className="text-sm font-medium text-foreground">
            {moveDetails.distance > 0 ? `${moveDetails.distance.toLocaleString()} miles` : 'Add miles'}
          </span>
        </div>

        {/* Move Type */}
        <div className="flex items-center justify-between py-1.5 border-b border-border/30">
          <span className="text-sm text-muted-foreground">Move type</span>
          <span className="text-sm font-medium text-foreground">
            {getMoveTypeLabel(moveDetails.moveType, moveDetails.distance)}
          </span>
        </div>

        {/* Move Date */}
        <div className="flex items-center justify-between py-1.5 border-b border-border/30">
          <span className="text-sm text-muted-foreground">Move date</span>
          <span className="text-sm font-medium text-foreground">
            {extendedDetails?.moveDate ? format(extendedDetails.moveDate, 'MMM d, yyyy') : 'Select date'}
          </span>
        </div>

        {/* Total Weight */}
        <div className="flex items-center justify-between py-1.5 border-b border-border/30">
          <span className="text-sm text-muted-foreground">Total weight</span>
          <span className="text-sm font-medium text-foreground">
            {totalWeight > 0 ? `${totalWeight.toLocaleString()} lbs` : '0 lbs'}
          </span>
        </div>

        {/* Total Cubic Feet */}
        <div className="flex items-center justify-between py-1.5 border-b border-border/30">
          <span className="text-sm text-muted-foreground">Total volume</span>
          <span className="text-sm font-medium text-foreground">
            {totalCubicFeet > 0 ? `${totalCubicFeet.toLocaleString()} cu ft` : '0 cu ft'}
          </span>
        </div>

        {/* Vehicle Transport */}
        <div className="flex items-center justify-between py-1.5 border-b border-border/30">
          <span className="text-sm text-muted-foreground">Vehicle transport</span>
          <span className="text-sm font-medium text-foreground">
            {extendedDetails?.hasVehicleTransport ? 'Yes' : 'No'}
          </span>
        </div>

        {/* Packing Service */}
        <div className="flex items-center justify-between py-1.5">
          <span className="text-sm text-muted-foreground">Packing service</span>
          <span className="text-sm font-medium text-foreground">
            {extendedDetails?.needsPackingService ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      {/* Footer note */}
      <div className="px-4 pb-3">
        <p className="text-[10px] text-muted-foreground italic">
          Rough estimate based on your inventory, move type, and distance.
        </p>
      </div>
    </div>
  );
}
