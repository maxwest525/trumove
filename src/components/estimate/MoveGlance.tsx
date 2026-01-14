import { useMemo } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Truck, Route, Calendar, Package, MapPin, DollarSign, Phone, Video } from "lucide-react";
import { calculateEstimate, formatCurrency } from "@/lib/priceCalculator";
import MoveMap from "@/components/MoveMap";

interface MoveGlanceProps {
  fromZip: string;
  toZip: string;
  fromCity: string;
  toCity: string;
  distance: number;
  moveType: "local" | "long-distance";
  moveDate: Date | null;
  size: string;
  hasCar: boolean;
  needsPacking: boolean;
}

export default function MoveGlance({
  fromZip,
  toZip,
  fromCity,
  toCity,
  distance,
  moveType,
  moveDate,
  size,
  hasCar,
  needsPacking,
}: MoveGlanceProps) {
  
  // Calculate estimate
  const estimate = useMemo(() => {
    if (!size) return null;
    
    const sizeWeights: Record<string, number> = {
      'Studio': 2000,
      '1 Bedroom': 3000,
      '2 Bedroom': 5000,
      '3 Bedroom': 7000,
      '4+ Bedroom': 10000,
      'Office': 4000,
    };
    const weight = sizeWeights[size] || 4000;
    const base = calculateEstimate(weight, distance, moveType);
    
    let min = base.min;
    let max = base.max;
    
    if (hasCar) {
      min += 800;
      max += 1200;
    }
    if (needsPacking) {
      min += Math.round(weight * 0.15);
      max += Math.round(weight * 0.25);
    }
    
    return { min, max };
  }, [size, distance, moveType, hasCar, needsPacking]);

  const hasRoute = fromZip.length === 5 && toZip.length === 5;

  return (
    <div className="tru-glance">
      {/* Header */}
      <div className="tru-glance-header">
        <Truck className="w-5 h-5 text-primary" />
        <span className="tru-glance-title">YOUR MOVE AT A GLANCE</span>
      </div>

      <div className="tru-glance-divider" />

      {/* Map Area */}
      <div className="tru-glance-map">
        {hasRoute ? (
          <MoveMap fromZip={fromZip} toZip={toZip} />
        ) : (
          <div className="tru-glance-map-empty">
            <MapPin className="w-6 h-6 text-muted-foreground/40" />
            <span>Enter your ZIP codes to see your route</span>
          </div>
        )}
      </div>

      {/* Route Details */}
      <div className="tru-glance-section">
        <div className="tru-glance-section-header">
          <Route className="w-4 h-4" />
          <span>ROUTE DETAILS</span>
        </div>
        <div className="tru-glance-row">
          <span className="tru-glance-label">From</span>
          <span className="tru-glance-value">{fromCity || "—"}</span>
        </div>
        <div className="tru-glance-row">
          <span className="tru-glance-label">To</span>
          <span className="tru-glance-value">{toCity || "—"}</span>
        </div>
        <div className="tru-glance-row">
          <span className="tru-glance-label">Type</span>
          <span className="tru-glance-badge">
            {distance > 0 ? (moveType === 'long-distance' ? 'Long Distance' : 'Local') : 'Local'}
          </span>
        </div>
      </div>

      {/* Move Details */}
      <div className="tru-glance-section">
        <div className="tru-glance-section-header">
          <Calendar className="w-4 h-4" />
          <span>MOVE DETAILS</span>
        </div>
        <div className="tru-glance-row">
          <span className="tru-glance-label">Date</span>
          <span className="tru-glance-value">
            {moveDate ? format(moveDate, "MMM d, yyyy") : "—"}
          </span>
        </div>
        <div className="tru-glance-row">
          <span className="tru-glance-label">Size</span>
          <span className="tru-glance-value">{size || "—"}</span>
        </div>
        {(hasCar || needsPacking) && (
          <div className="tru-glance-row">
            <span className="tru-glance-label">Add-ons</span>
            <span className="tru-glance-value">
              {[hasCar && "Vehicle", needsPacking && "Packing"].filter(Boolean).join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Estimate */}
      <div className="tru-glance-estimate">
        <div className="tru-glance-estimate-header">
          <DollarSign className="w-4 h-4" />
          <span>YOUR ESTIMATE</span>
        </div>
        {estimate ? (
          <div className="tru-glance-estimate-value">
            {formatCurrency(estimate.min)} – {formatCurrency(estimate.max)}
          </div>
        ) : (
          <div className="tru-glance-estimate-empty">
            Select your move size to see estimate
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="tru-glance-ctas">
        <a href="tel:+16097277647" className="tru-glance-btn tru-glance-btn-secondary">
          <Phone className="w-4 h-4" />
          <span>Call Now</span>
        </a>
        <Link to="/book" className="tru-glance-btn tru-glance-btn-primary">
          <Video className="w-4 h-4" />
          <span>Book Video Consult</span>
        </Link>
      </div>
    </div>
  );
}
