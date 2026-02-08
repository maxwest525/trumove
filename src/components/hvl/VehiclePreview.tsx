import { useEffect, useState } from "react";
import { Car, Sparkles } from "lucide-react";

interface VehiclePreviewProps {
  year: string;
  make: string;
  model: string;
}

// Vehicle image mapping - using placeholder images based on make
const VEHICLE_IMAGES: Record<string, string> = {
  Toyota: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format",
  Honda: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop&auto=format",
  Ford: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=400&h=250&fit=crop&auto=format",
  Chevrolet: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop&auto=format",
  BMW: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop&auto=format",
  Tesla: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop&auto=format",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=250&fit=crop&auto=format";

export function VehiclePreview({ year, make, model }: VehiclePreviewProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const imageUrl = VEHICLE_IMAGES[make] || DEFAULT_IMAGE;

  useEffect(() => {
    if (year && make && model) {
      setShowPreview(false);
      setImageLoaded(false);
      // Small delay for animation
      const timer = setTimeout(() => setShowPreview(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowPreview(false);
    }
  }, [year, make, model]);

  if (!year || !make || !model || !showPreview) {
    return null;
  }

  return (
    <div className="hvl-vehicle-hero-preview">
      <div className="hvl-vehicle-hero-card">
        <div className="hvl-vehicle-hero-glow" />
        
        <div className="hvl-vehicle-hero-image-container">
          {!imageLoaded && (
            <div className="hvl-vehicle-hero-placeholder">
              <Car className="w-12 h-12 animate-pulse" />
            </div>
          )}
          <img
            src={imageUrl}
            alt={`${year} ${make} ${model}`}
            className={`hvl-vehicle-hero-image ${imageLoaded ? "loaded" : ""}`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="hvl-vehicle-hero-shine" />
        </div>

        <div className="hvl-vehicle-hero-info">
          <div className="hvl-vehicle-hero-badge">
            <Sparkles className="w-3 h-3" />
            <span>Your Vehicle</span>
          </div>
          <h4 className="hvl-vehicle-hero-title">{year} {make}</h4>
          <p className="hvl-vehicle-hero-model">{model}</p>
        </div>
      </div>
    </div>
  );
}
