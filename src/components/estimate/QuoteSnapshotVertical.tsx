import { useState } from "react";
import { Route, Video, Phone, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { calculateTotalWeight, calculateEstimate, formatCurrency, type InventoryItem, type MoveDetails } from "@/lib/priceCalculator";
import logoImg from "@/assets/logo.png";
import { cn } from "@/lib/utils";

interface QuoteSnapshotVerticalProps {
  items: InventoryItem[];
  moveDetails: MoveDetails;
}

export default function QuoteSnapshotVertical({ items, moveDetails }: QuoteSnapshotVerticalProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);
  const totalWeight = calculateTotalWeight(items);
  const effectiveMoveType = moveDetails.moveType === 'auto' 
    ? (moveDetails.distance >= 150 ? 'long-distance' : 'local')
    : moveDetails.moveType;
  
  const estimate = calculateEstimate(totalWeight, moveDetails.distance, effectiveMoveType);
  
  // Expand when data is entered or on hover
  const hasData = moveDetails.fromLocation || moveDetails.toLocation || items.length > 0;
  
  // User can manually collapse even when data exists
  const isExpanded = !isManuallyCollapsed && (hasData || isHovered);

  const handleToggle = () => {
    if (hasData) {
      setIsManuallyCollapsed(!isManuallyCollapsed);
    }
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
        <div className="tru-summary-card-header">
          <span className="tru-summary-card-title">Move Summary</span>
        </div>
      
        <div className="tru-summary-card-body">
          <div className="tru-summary-info-grid">
            <div className="tru-summary-row">
              <span className="tru-summary-label">From</span>
              <span className="tru-summary-value">{moveDetails.fromLocation || "—"}</span>
            </div>
            <div className="tru-summary-row">
              <span className="tru-summary-label">To</span>
              <span className="tru-summary-value">{moveDetails.toLocation || "—"}</span>
            </div>
            <div className="tru-summary-row">
              <span className="tru-summary-label">Distance</span>
              <span className="tru-summary-value">{moveDetails.distance > 0 ? `${moveDetails.distance.toLocaleString()} mi` : "—"}</span>
            </div>
            <div className="tru-summary-row">
              <span className="tru-summary-label">Date</span>
              <span className="tru-summary-value">{moveDetails.moveDate || "—"}</span>
            </div>
            <div className="tru-summary-row">
              <span className="tru-summary-label">Items</span>
              <span className="tru-summary-value">{items.length > 0 ? `${items.length} items` : "—"}</span>
            </div>
            <div className="tru-summary-row">
              <span className="tru-summary-label">Weight</span>
              <span className="tru-summary-value">{totalWeight > 0 ? `${totalWeight.toLocaleString()} lbs` : "—"}</span>
            </div>
            <div className="tru-summary-row tru-summary-row-estimate">
              <span className="tru-summary-label">Estimate</span>
              <span className="tru-summary-value tru-summary-value-primary">
                TBD
              </span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="tru-summary-actions">
          <Link
            to="/book"
            className="tru-summary-action-btn tru-summary-action-primary"
          >
            <Video className="w-4 h-4" />
            <span>Video Consult</span>
          </Link>
          <a
            href="tel:+16097277647"
            className="tru-summary-action-btn"
          >
            <Phone className="w-4 h-4" />
            <span>Call Now</span>
          </a>
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
