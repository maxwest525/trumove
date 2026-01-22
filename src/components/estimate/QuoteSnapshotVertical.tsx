import { Pencil, MapPin, Calendar, Ruler, Car, Package } from "lucide-react";
import { type InventoryItem, type MoveDetails } from "@/lib/priceCalculator";
import { format } from "date-fns";
import type { ExtendedMoveDetails } from "./EstimateWizard";

interface QuoteSnapshotVerticalProps {
  items: InventoryItem[];
  moveDetails: MoveDetails;
  extendedDetails?: ExtendedMoveDetails | null;
  onEdit?: () => void;
}

export default function QuoteSnapshotVertical({ items, moveDetails, extendedDetails, onEdit }: QuoteSnapshotVerticalProps) {
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
    <div className="tru-move-summary-card is-expanded w-full max-w-[300px]">
      {/* Header - Enlarged and Centered */}
      <div className="tru-summary-header-large relative">
        <div className="text-center flex-1">
          <h3 className="text-lg font-black text-foreground">
            Your Move <span className="tru-qb-title-accent">Calculated</span>
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">All details from your form</p>
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
      <div className="p-4 space-y-3 text-left">
        {/* Origin */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            <MapPin className="w-3 h-3 text-primary" />
            Origin
          </div>
          <p className="text-sm text-foreground">
            {moveDetails.fromLocation || '—'}
          </p>
          {originPropertyLine && (
            <p className="text-xs text-muted-foreground">{originPropertyLine}</p>
          )}
        </div>

        {/* Destination */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            <MapPin className="w-3 h-3 text-primary" />
            Destination
          </div>
          <p className="text-sm text-foreground">
            {moveDetails.toLocation || '—'}
          </p>
          {destPropertyLine && (
            <p className="text-xs text-muted-foreground">{destPropertyLine}</p>
          )}
        </div>

        {/* Distance & Date - Row */}
        <div className="flex items-center gap-4 py-2 border-t border-b border-border/40 text-sm">
          <div className="flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-foreground">
              {moveDetails.distance > 0 ? `${moveDetails.distance.toLocaleString()} mi` : '—'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-foreground">
              {extendedDetails?.moveDate ? format(extendedDetails.moveDate, 'MMM d, yyyy') : '—'}
            </span>
          </div>
        </div>

        {/* Additional Services - Row with black text for Yes/No */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Vehicle:</span>
            <span className="font-medium text-foreground">
              {extendedDetails?.hasVehicleTransport ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Packing:</span>
            <span className="font-medium text-foreground">
              {extendedDetails?.needsPackingService ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
