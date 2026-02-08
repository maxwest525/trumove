import { useState, useRef, useCallback, useEffect } from "react";
import { Car, GripHorizontal, X, MapPin, Calendar, Truck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface VehiclePreviewModalProps {
  year: string;
  make: string;
  model: string;
  transportType: "open" | "enclosed" | "";
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate?: Date;
}

// Vehicle image mapping - using Unsplash images based on make
const VEHICLE_IMAGES: Record<string, string> = {
  Toyota: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format",
  Honda: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop&auto=format",
  Nissan: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=250&fit=crop&auto=format",
  Mazda: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=400&h=250&fit=crop&auto=format",
  Subaru: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=400&h=250&fit=crop&auto=format",
  Lexus: "https://images.unsplash.com/photo-1622194993627-c3de0bcee890?w=400&h=250&fit=crop&auto=format",
  Ford: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=400&h=250&fit=crop&auto=format",
  Chevrolet: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop&auto=format",
  Dodge: "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=400&h=250&fit=crop&auto=format",
  Jeep: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop&auto=format",
  Tesla: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop&auto=format",
  BMW: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop&auto=format",
  "Mercedes-Benz": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop&auto=format",
  Audi: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop&auto=format",
  Porsche: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop&auto=format",
  Hyundai: "https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=400&h=250&fit=crop&auto=format",
  Kia: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=400&h=250&fit=crop&auto=format",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=250&fit=crop&auto=format";

function getVehicleImageUrl(make: string): string {
  return VEHICLE_IMAGES[make] || DEFAULT_IMAGE;
}

// Storage key - increment to force position reset
const STORAGE_KEY = "hvl_transport_summary_pos_v9";

export function VehiclePreviewModal({ 
  year, 
  make, 
  model, 
  transportType,
  pickupLocation,
  dropoffLocation,
  pickupDate
}: VehiclePreviewModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Dragging state - position 70px left of the form (right side, but offset)
  const [position, setPosition] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    // Position to the right but 90px gap from form (form is ~520px wide, centered right)
    return { x: window.innerWidth - 520 - 340 - 90, y: 180 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const imageUrl = getVehicleImageUrl(make);

  // Show preview when we have at least vehicle info
  useEffect(() => {
    if (year && make && model) {
      setShowPreview(false);
      setImageLoaded(false);
      const timer = setTimeout(() => setShowPreview(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowPreview(false);
    }
  }, [year, make, model]);

  // Save position to localStorage
  useEffect(() => {
    if (!isDragging) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
      } catch {}
    }
  }, [position, isDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragOffset.current.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.current.y));
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  if (!year || !make || !model || !showPreview) {
    return null;
  }

  const hasRouteInfo = pickupLocation || dropoffLocation || pickupDate;

  return (
    <div 
      className={cn(
        "hvl-vehicle-modal hvl-transport-summary",
        isDragging && "hvl-vehicle-modal-dragging"
      )}
      style={{ left: position.x, top: position.y }}
    >
      {/* Header - Draggable */}
      <div 
        className="hvl-vehicle-modal-header"
        onMouseDown={handleMouseDown}
      >
        <div className="hvl-vehicle-modal-grip">
          <GripHorizontal className="w-3.5 h-3.5" />
          <span>Transport Summary</span>
        </div>
        <div className="hvl-vehicle-modal-actions">
          <button 
            className="hvl-vehicle-modal-btn hvl-vehicle-modal-close"
            onClick={() => setShowPreview(false)}
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Vehicle Image */}
      <div className="hvl-vehicle-modal-image-wrap">
        {!imageLoaded && (
          <div className="hvl-vehicle-modal-placeholder">
            <Car className="w-10 h-10 animate-pulse" />
          </div>
        )}
        <img
          src={imageUrl}
          alt={`${year} ${make} ${model}`}
          className={cn("hvl-vehicle-modal-image", imageLoaded && "loaded")}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="hvl-vehicle-modal-shine" />
        
        {/* Vehicle Title Overlay */}
        <div className="hvl-summary-vehicle-overlay">
          <h4>{year} {make} {model}</h4>
          {transportType && (
            <span className="hvl-summary-transport-badge">
              <Truck className="w-3 h-3" />
              {transportType === "open" ? "Open Carrier" : "Enclosed Carrier"}
            </span>
          )}
        </div>
      </div>

      {/* Summary Details */}
      <div className="hvl-summary-details">
        {/* Route */}
        {(pickupLocation || dropoffLocation) && (
          <div className="hvl-summary-route">
            <div className="hvl-summary-route-row">
              <div className="hvl-summary-location">
                <div className="hvl-summary-location-dot hvl-summary-dot-from" />
                <div className="hvl-summary-location-text">
                  <span className="hvl-summary-label">From</span>
                  <span className="hvl-summary-value">{pickupLocation || "—"}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="hvl-summary-location">
                <div className="hvl-summary-location-dot hvl-summary-dot-to" />
                <div className="hvl-summary-location-text">
                  <span className="hvl-summary-label">To</span>
                  <span className="hvl-summary-value">{dropoffLocation || "—"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Date */}
        {pickupDate && (
          <div className="hvl-summary-date">
            <Calendar className="w-4 h-4" />
            <div className="hvl-summary-date-text">
              <span className="hvl-summary-label">Pickup Date</span>
              <span className="hvl-summary-value">{format(pickupDate, "MMM d, yyyy")}</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasRouteInfo && (
          <div className="hvl-summary-empty">
            <MapPin className="w-4 h-4" />
            <span>Add route details to see full summary</span>
          </div>
        )}
      </div>
    </div>
  );
}
