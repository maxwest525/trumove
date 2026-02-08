import { useState, useRef, useCallback, useEffect } from "react";
import { Car, Sparkles, GripHorizontal, X, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehiclePreviewModalProps {
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

// Color options for car tint overlay
const CAR_COLORS = [
  { name: "Original", value: "none", bg: "transparent", border: "hsl(220 10% 80%)" },
  { name: "Midnight Black", value: "hsl(220 20% 10% / 0.5)", bg: "hsl(220 20% 10%)", border: "hsl(220 20% 20%)" },
  { name: "Pearl White", value: "hsl(0 0% 95% / 0.3)", bg: "hsl(0 0% 95%)", border: "hsl(0 0% 85%)" },
  { name: "Racing Red", value: "hsl(0 70% 50% / 0.35)", bg: "hsl(0 70% 50%)", border: "hsl(0 70% 40%)" },
  { name: "Ocean Blue", value: "hsl(210 80% 50% / 0.35)", bg: "hsl(210 80% 50%)", border: "hsl(210 80% 40%)" },
  { name: "Forest Green", value: "hsl(150 60% 35% / 0.35)", bg: "hsl(150 60% 35%)", border: "hsl(150 60% 25%)" },
  { name: "Sunset Orange", value: "hsl(25 90% 55% / 0.35)", bg: "hsl(25 90% 55%)", border: "hsl(25 90% 45%)" },
  { name: "Royal Purple", value: "hsl(270 60% 50% / 0.35)", bg: "hsl(270 60% 50%)", border: "hsl(270 60% 40%)" },
];

const STORAGE_KEY = "hvl_vehicle_preview_position";

export function VehiclePreviewModal({ year, make, model }: VehiclePreviewModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedColor, setSelectedColor] = useState(CAR_COLORS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Dragging state
  const [position, setPosition] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return { x: window.innerWidth - 320, y: 150 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const imageUrl = VEHICLE_IMAGES[make] || DEFAULT_IMAGE;

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
        const newX = Math.max(0, Math.min(window.innerWidth - 280, e.clientX - dragOffset.current.x));
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

  return (
    <div 
      className={cn(
        "hvl-vehicle-modal",
        isDragging && "hvl-vehicle-modal-dragging",
        isMinimized && "hvl-vehicle-modal-minimized"
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
          <span>Your Vehicle</span>
        </div>
        <div className="hvl-vehicle-modal-actions">
          <button 
            className="hvl-vehicle-modal-btn"
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Change Color"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>
          <button 
            className="hvl-vehicle-modal-btn hvl-vehicle-modal-close"
            onClick={() => setShowPreview(false)}
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Color Picker Dropdown */}
      {showColorPicker && (
        <div className="hvl-color-picker">
          <div className="hvl-color-picker-label">Select Color</div>
          <div className="hvl-color-swatches">
            {CAR_COLORS.map((color) => (
              <button
                key={color.name}
                className={cn(
                  "hvl-color-swatch",
                  selectedColor.name === color.name && "hvl-color-swatch-active"
                )}
                style={{ 
                  background: color.bg === "transparent" 
                    ? "linear-gradient(135deg, #fff 45%, #ddd 45%, #ddd 55%, #fff 55%)" 
                    : color.bg,
                  borderColor: color.border
                }}
                onClick={() => {
                  setSelectedColor(color);
                  setShowColorPicker(false);
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

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
        {/* Color Overlay */}
        {selectedColor.value !== "none" && (
          <div 
            className="hvl-vehicle-color-overlay"
            style={{ background: selectedColor.value }}
          />
        )}
        <div className="hvl-vehicle-modal-shine" />
      </div>

      {/* Vehicle Info */}
      <div className="hvl-vehicle-modal-info">
        <div className="hvl-vehicle-modal-badge">
          <Sparkles className="w-3 h-3" />
          <span>Ready to Ship</span>
        </div>
        <h4 className="hvl-vehicle-modal-title">{year} {make}</h4>
        <p className="hvl-vehicle-modal-model">{model}</p>
        {selectedColor.name !== "Original" && (
          <p className="hvl-vehicle-modal-color">
            <span className="hvl-color-dot" style={{ background: selectedColor.bg }} />
            {selectedColor.name}
          </p>
        )}
      </div>
    </div>
  );
}
