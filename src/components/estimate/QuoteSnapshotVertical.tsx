import { useState } from "react";
import { Route, Pencil, ChevronRight, MapPin, Calendar, Ruler, Home, Building2, Car, Package, Scale } from "lucide-react";
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
        "tru-floating-summary-card tru-floating-summary-card-compact tru-summary-hover-expand tru-summary-animated",
        isExpanded ? "is-expanded" : "is-collapsed"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Collapsed state - slim bar with toggle */}
      <div 
        className="tru-summary-collapsed-bar"
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleToggle()}
      >
        <div className="tru-summary-collapsed-indicator">
          <Route className="w-4 h-4" />
        </div>
        <span className="tru-summary-collapsed-label">Summary</span>
        <ChevronRight className={cn(
          "w-3 h-3 transition-transform duration-300",
          isExpanded ? "rotate-180" : "rotate-0"
        )} />
      </div>
      
      {/* Expanded content with smooth animation */}
      <div className="tru-summary-expanded-content">
        <div className="tru-summary-card-header flex items-center justify-between">
          <span className="tru-summary-card-title">Your Move Calculated</span>
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
      
        <div className="tru-summary-card-body tru-summary-card-body-compact">
          {/* Origin Section */}
          <div className="tru-summary-section">
            <div className="tru-summary-section-header">
              <MapPin className="w-3 h-3 text-primary" />
              <span>Origin</span>
            </div>
            <div className="tru-summary-detail-row">
              <span className="tru-summary-detail-value truncate">{moveDetails.fromLocation || '—'}</span>
            </div>
            <div className="tru-summary-detail-chips">
              <span className="tru-summary-chip">
                {extendedDetails?.fromPropertyType === 'house' ? <Home className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                {formatPropertyType(extendedDetails?.fromPropertyType || '', extendedDetails?.fromFloor, extendedDetails?.fromHasElevator)}
              </span>
              <span className="tru-summary-chip">
                {formatHomeSize(extendedDetails?.homeSize || moveDetails.homeSize || '')}
              </span>
            </div>
          </div>

          {/* Destination Section */}
          <div className="tru-summary-section">
            <div className="tru-summary-section-header">
              <MapPin className="w-3 h-3 text-primary" />
              <span>Destination</span>
            </div>
            <div className="tru-summary-detail-row">
              <span className="tru-summary-detail-value truncate">{moveDetails.toLocation || '—'}</span>
            </div>
            <div className="tru-summary-detail-chips">
              <span className="tru-summary-chip">
                {extendedDetails?.toPropertyType === 'house' ? <Home className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                {formatPropertyType(extendedDetails?.toPropertyType || '', extendedDetails?.toFloor, extendedDetails?.toHasElevator)}
              </span>
              <span className="tru-summary-chip">
                {formatHomeSize(extendedDetails?.toHomeSize || '')}
              </span>
            </div>
          </div>

          {/* Move Info Row */}
          <div className="tru-summary-info-bar">
            <div className="tru-summary-info-item">
              <Ruler className="w-3 h-3" />
              <span>{moveDetails.distance > 0 ? `${moveDetails.distance.toLocaleString()} mi` : '—'}</span>
            </div>
            <div className="tru-summary-info-divider" />
            <div className="tru-summary-info-item">
              <Calendar className="w-3 h-3" />
              <span>{extendedDetails?.moveDate ? format(extendedDetails.moveDate, 'MMM d') : moveDetails.moveDate || '—'}</span>
            </div>
          </div>

          {/* Additional Services */}
          {(extendedDetails?.hasVehicleTransport || extendedDetails?.needsPackingService) && (
            <div className="tru-summary-services">
              {extendedDetails.hasVehicleTransport && (
                <span className="tru-summary-service-chip">
                  <Car className="w-3 h-3" />
                  Vehicle
                </span>
              )}
              {extendedDetails.needsPackingService && (
                <span className="tru-summary-service-chip">
                  <Package className="w-3 h-3" />
                  Packing
                </span>
              )}
            </div>
          )}

          {/* Inventory Stats */}
          <div className="tru-summary-stats-bar">
            <div className="tru-summary-stat">
              <span className="tru-summary-stat-value">{items.length}</span>
              <span className="tru-summary-stat-label">Items</span>
            </div>
            <div className="tru-summary-stat">
              <span className="tru-summary-stat-value">{totalCubicFeet.toLocaleString()}</span>
              <span className="tru-summary-stat-label">Cu Ft</span>
            </div>
            <div className="tru-summary-stat">
              <span className="tru-summary-stat-value">{totalWeight > 0 ? `${(totalWeight / 1000).toFixed(1)}k` : '0'}</span>
              <span className="tru-summary-stat-label">Lbs</span>
            </div>
          </div>

          {/* Estimate */}
          <div className="tru-summary-estimate-bar">
            <span className="tru-summary-estimate-label">Estimate</span>
            <span className="tru-summary-estimate-value">TBD</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="tru-summary-card-footer">
          <span>Powered by</span>
          <img src={logoImg} alt="TruMove" className="tru-footer-mini-logo" />
        </div>
      </div>
    </div>
  );
}
