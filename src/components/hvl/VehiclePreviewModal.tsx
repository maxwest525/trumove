import { useState, useRef, useCallback, useEffect } from "react";
import { Car, Sparkles, GripHorizontal, X, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehiclePreviewModalProps {
  year: string;
  make: string;
  model: string;
}

// Vehicle image mapping - using Unsplash images based on make
const VEHICLE_IMAGES: Record<string, string> = {
  // Japanese Makes
  Toyota: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format",
  Honda: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop&auto=format",
  Nissan: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=250&fit=crop&auto=format",
  Mazda: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=400&h=250&fit=crop&auto=format",
  Subaru: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=400&h=250&fit=crop&auto=format",
  Lexus: "https://images.unsplash.com/photo-1622194993627-c3de0bcee890?w=400&h=250&fit=crop&auto=format",
  Acura: "https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=400&h=250&fit=crop&auto=format",
  Infiniti: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop&auto=format",
  Mitsubishi: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=400&h=250&fit=crop&auto=format",
  
  // American Makes
  Ford: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=400&h=250&fit=crop&auto=format",
  Chevrolet: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop&auto=format",
  GMC: "https://images.unsplash.com/photo-1612911912304-f9e5c0f49868?w=400&h=250&fit=crop&auto=format",
  Dodge: "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=400&h=250&fit=crop&auto=format",
  Jeep: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop&auto=format",
  Ram: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=250&fit=crop&auto=format",
  Cadillac: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=400&h=250&fit=crop&auto=format",
  Lincoln: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=250&fit=crop&auto=format",
  Buick: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop&auto=format",
  Chrysler: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=250&fit=crop&auto=format",
  Tesla: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop&auto=format",
  Rivian: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=250&fit=crop&auto=format",
  
  // German Makes
  BMW: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop&auto=format",
  "Mercedes-Benz": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop&auto=format",
  Audi: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop&auto=format",
  Volkswagen: "https://images.unsplash.com/photo-1622194993627-c3de0bcee890?w=400&h=250&fit=crop&auto=format",
  Porsche: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop&auto=format",
  
  // Korean Makes
  Hyundai: "https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=400&h=250&fit=crop&auto=format",
  Kia: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=400&h=250&fit=crop&auto=format",
  Genesis: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format",
  
  // European Makes
  Volvo: "https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=400&h=250&fit=crop&auto=format",
  "Land Rover": "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=400&h=250&fit=crop&auto=format",
  Jaguar: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=400&h=250&fit=crop&auto=format",
  "Alfa Romeo": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop&auto=format",
  Fiat: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=250&fit=crop&auto=format",
  Mini: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=250&fit=crop&auto=format",
  
  // Luxury/Exotic
  Ferrari: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=250&fit=crop&auto=format",
  Lamborghini: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop&auto=format",
  Maserati: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop&auto=format",
  "Aston Martin": "https://images.unsplash.com/photo-1596905687424-dd0cb27aa2b4?w=400&h=250&fit=crop&auto=format",
  Bentley: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=400&h=250&fit=crop&auto=format",
  "Rolls-Royce": "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=400&h=250&fit=crop&auto=format",
  McLaren: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=400&h=250&fit=crop&auto=format",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=250&fit=crop&auto=format";

// Vehicle type images - fallback based on detected vehicle type
const VEHICLE_TYPE_IMAGES: Record<string, string> = {
  sedan: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop&auto=format",
  suv: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop&auto=format",
  truck: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=250&fit=crop&auto=format",
  coupe: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop&auto=format",
  hatchback: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=250&fit=crop&auto=format",
  van: "https://images.unsplash.com/photo-1612911912304-f9e5c0f49868?w=400&h=250&fit=crop&auto=format",
  wagon: "https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=400&h=250&fit=crop&auto=format",
  convertible: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop&auto=format",
  sports: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=250&fit=crop&auto=format",
  crossover: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=400&h=250&fit=crop&auto=format",
  electric: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop&auto=format",
  luxury: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop&auto=format",
};

// Keywords to detect vehicle type from model name
const VEHICLE_TYPE_KEYWORDS: Record<string, string[]> = {
  suv: ["suv", "explorer", "expedition", "tahoe", "suburban", "yukon", "escalade", "navigator", "pilot", "highlander", "4runner", "sequoia", "pathfinder", "armada", "durango", "grand cherokee", "wrangler", "defender", "range rover", "discovery", "rav4", "cr-v", "cx-5", "cx-9", "tucson", "santa fe", "sorento", "telluride", "palisade", "atlas", "tiguan", "q5", "q7", "q8", "x3", "x5", "x7", "gle", "gls", "cayenne", "macan", "blazer", "trailblazer", "equinox", "traverse", "bronco", "4x4", "forester", "outback", "crosstrek", "ascent"],
  truck: ["f-150", "f150", "f-250", "f250", "f-350", "f350", "silverado", "sierra", "ram", "1500", "2500", "3500", "tundra", "tacoma", "titan", "frontier", "colorado", "canyon", "ranger", "ridgeline", "gladiator", "maverick", "lightning", "cybertruck", "r1t", "pickup"],
  sedan: ["camry", "accord", "civic", "corolla", "altima", "sentra", "maxima", "avalon", "sonata", "elantra", "optima", "k5", "malibu", "impala", "charger", "300", "model 3", "model s", "a4", "a6", "a8", "3 series", "5 series", "7 series", "c-class", "e-class", "s-class", "is", "es", "ls", "g70", "g80", "g90", "passat", "jetta", "legacy", "mazda3", "mazda6"],
  coupe: ["mustang", "camaro", "challenger", "corvette", "supra", "86", "brz", "370z", "400z", "rc", "lc", "m4", "c63", "amg gt", "718", "911", "tt", "r8"],
  hatchback: ["golf", "gti", "civic hatchback", "mazda3 hatch", "veloster", "corolla hatch", "fit", "yaris", "i30", "focus", "fiesta"],
  van: ["odyssey", "sienna", "pacifica", "carnival", "grand caravan", "transit", "sprinter", "express", "savana", "nv", "promaster", "metris"],
  wagon: ["outback", "v60", "v90", "e-class wagon", "allroad", "a4 allroad"],
  convertible: ["miata", "mx-5", "z4", "boxster", "mustang convertible", "camaro convertible", "c-class cabriolet", "e-class cabriolet", "s-class cabriolet"],
  sports: ["911", "corvette", "nsx", "gt-r", "supra", "cayman", "f-type", "vantage", "db11", "huracan", "aventador", "488", "f8", "sf90", "720s", "570s", "amg gt"],
  crossover: ["rogue", "kicks", "murano", "hr-v", "seltos", "sportage", "niro", "kona", "venue", "trax", "encore", "escape", "edge", "envision", "ux", "nx", "rx"],
  electric: ["model 3", "model s", "model x", "model y", "leaf", "bolt", "mach-e", "ioniq", "ev6", "id.4", "taycan", "e-tron", "i4", "ix", "eqe", "eqs", "rivian", "lucid", "polestar", "ariya", "bz4x", "solterra", "lyriq", "hummer ev"],
  luxury: ["phantom", "ghost", "wraith", "dawn", "cullinan", "continental", "flying spur", "bentayga", "quattroporte", "ghibli", "levante"],
};

// Detect vehicle type from model name
function detectVehicleType(model: string): string | null {
  const modelLower = model.toLowerCase();
  
  for (const [type, keywords] of Object.entries(VEHICLE_TYPE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (modelLower.includes(keyword.toLowerCase())) {
        return type;
      }
    }
  }
  
  return null;
}

// Get the best image URL based on make, model, and detected type
function getVehicleImageUrl(make: string, model: string): string {
  // First try make-specific image
  if (VEHICLE_IMAGES[make]) {
    return VEHICLE_IMAGES[make];
  }
  
  // Then try to detect vehicle type from model name
  const detectedType = detectVehicleType(model);
  if (detectedType && VEHICLE_TYPE_IMAGES[detectedType]) {
    return VEHICLE_TYPE_IMAGES[detectedType];
  }
  
  // Fall back to default
  return DEFAULT_IMAGE;
}

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

  // Get image URL based on make and model type detection
  const imageUrl = getVehicleImageUrl(make, model);
  const detectedType = detectVehicleType(model);

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
        <div className="hvl-vehicle-modal-badges">
          <div className="hvl-vehicle-modal-badge">
            <Sparkles className="w-3 h-3" />
            <span>Ready to Ship</span>
          </div>
          {detectedType && (
            <div className="hvl-vehicle-modal-type-badge">
              <Car className="w-3 h-3" />
              <span>{detectedType.charAt(0).toUpperCase() + detectedType.slice(1)}</span>
            </div>
          )}
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
