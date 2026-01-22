import { useState } from "react";
import { Pencil, ChevronDown, MapPin, Calendar, Ruler, Car, Package } from "lucide-react";
import { calculateTotalWeight, calculateTotalCubicFeet, type InventoryItem, type MoveDetails } from "@/lib/priceCalculator";
import logoImg from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { ExtendedMoveDetails } from "./EstimateWizard";

interface QuoteSnapshotVerticalProps {
  items: InventoryItem[];
  moveDetails: MoveDetails;
  extendedDetails?: ExtendedMoveDetails | null;
  onEdit?: () => void;
}

export default function QuoteSnapshotVertical({ items, moveDetails, extendedDetails, onEdit }: QuoteSnapshotVerticalProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);
  const totalWeight = calculateTotalWeight(items);
  const totalCubicFeet = calculateTotalCubicFeet(items);
  
  // Expand when data is entered or on hover
  const hasData = moveDetails.fromLocation || moveDetails.toLocation || items.length > 0;
  
  // User can manually collapse even when data exists
  const isExpanded = !isManuallyCollapsed && (hasData || isHovered);

  const handleToggle = () => {
    if (hasData) {
      setIsManuallyCollapsed(!isManuallyCollapsed);
    }
  };

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
    <div 
      className={cn(
        "tru-move-summary-card",
        isExpanded ? "is-expanded" : "is-collapsed"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header - Pill style matching homepage */}
      <div className="tru-qb-form-header tru-qb-form-header-pill tru-qb-form-header-summary">
        <img src={logoImg} alt="TruMove" className="tru-qb-header-logo" />
        <div className="tru-qb-form-title-group">
          <span className="tru-qb-form-title">
            Your Move <span className="tru-qb-title-accent">Calculated</span>
          </span>
          <span className="tru-qb-form-subtitle-compact">ALL DETAILS FROM YOUR FORM</span>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <button 
              onClick={onEdit}
              className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              title="Edit move details"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleToggle}
            className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors"
          >
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform duration-300",
              isExpanded ? "rotate-180" : "rotate-0"
            )} />
          </button>
        </div>
      </div>
      
      {/* Expanded content */}
      <div className={cn(
        "tru-summary-body overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="p-4 space-y-3">
          {/* Origin Section */}
          <div className="tru-summary-row">
            <div className="tru-summary-row-header">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Origin</span>
            </div>
            <p className="text-sm font-medium text-foreground truncate">
              {moveDetails.fromLocation || '—'}
            </p>
            {originPropertyLine && (
              <p className="text-xs text-muted-foreground">{originPropertyLine}</p>
            )}
          </div>

          {/* Destination Section */}
          <div className="tru-summary-row">
            <div className="tru-summary-row-header">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Destination</span>
            </div>
            <p className="text-sm font-medium text-foreground truncate">
              {moveDetails.toLocation || '—'}
            </p>
            {destPropertyLine && (
              <p className="text-xs text-muted-foreground">{destPropertyLine}</p>
            )}
          </div>

          {/* Distance & Date Row */}
          <div className="flex items-center gap-4 py-2 border-t border-b border-border/50">
            <div className="flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-medium">
                {moveDetails.distance > 0 ? `${moveDetails.distance.toLocaleString()} mi` : '—'}
              </span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-medium">
                {extendedDetails?.moveDate ? format(extendedDetails.moveDate, 'MMM d, yyyy') : moveDetails.moveDate || '—'}
              </span>
            </div>
          </div>

          {/* Additional Services */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Car className="w-3.5 h-3.5" />
                Vehicle Transport
              </span>
              <span className={cn(
                "font-medium",
                extendedDetails?.hasVehicleTransport ? "text-primary" : "text-muted-foreground"
              )}>
                {extendedDetails?.hasVehicleTransport ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Package className="w-3.5 h-3.5" />
                Packing Service
              </span>
              <span className={cn(
                "font-medium",
                extendedDetails?.needsPackingService ? "text-primary" : "text-muted-foreground"
              )}>
                {extendedDetails?.needsPackingService ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          {/* Inventory Stats */}
          <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg border border-border/50">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{items.length}</p>
              <p className="text-xs text-muted-foreground">Items</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{totalCubicFeet.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Cu Ft</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {totalWeight > 0 ? `${(totalWeight / 1000).toFixed(1)}k` : '0'}
              </p>
              <p className="text-xs text-muted-foreground">Lbs</p>
            </div>
          </div>

          {/* Estimate */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Estimated</span>
            <span className="text-xl font-bold text-primary">TBD</span>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Final quote after inventory review
          </p>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-center gap-1.5 py-2 border-t border-border/50 bg-muted/20">
          <span className="text-xs text-muted-foreground">Powered by</span>
          <img src={logoImg} alt="TruMove" className="h-3 w-auto opacity-60" />
        </div>
      </div>
    </div>
  );
}
