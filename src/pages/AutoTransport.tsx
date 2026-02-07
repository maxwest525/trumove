import { useState, useEffect } from "react";
import { 
  Car, ChevronRight, Phone, Clock, MapPin, Plus, X,
  CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Model Viewer types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        'disable-zoom'?: boolean;
        'rotation-per-second'?: string;
        'interaction-prompt'?: string;
        'shadow-intensity'?: string;
        'environment-image'?: string;
        exposure?: string;
        poster?: string;
      }, HTMLElement>;
    }
  }
}
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/layout/Footer";

// Load model-viewer script on mount
function useModelViewer() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      document.head.appendChild(script);
    }
  }, []);
}

// ═══════════════════════════════════════════════════════════════════
// VEHICLE DATA
// ═══════════════════════════════════════════════════════════════════

const YEARS = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

const VEHICLE_DATA: Record<string, { models: Record<string, number> }> = {
  "BMW": {
    models: { "3 Series": 3580, "5 Series": 4100, "X3": 4400, "X5": 5260, "X7": 5900 }
  },
  "Chevrolet": {
    models: { "Camaro": 3700, "Corvette": 3650, "Equinox": 3550, "Silverado": 5100, "Tahoe": 5600 }
  },
  "Ford": {
    models: { "Bronco": 4500, "F-150": 4700, "Mustang": 3800, "Explorer": 4600, "Escape": 3550 }
  },
  "Honda": {
    models: { "Accord": 3300, "Civic": 2900, "CR-V": 3500, "Pilot": 4300, "Odyssey": 4500 }
  },
  "Tesla": {
    models: { "Model 3": 3860, "Model S": 4800, "Model X": 5400, "Model Y": 4400, "Cybertruck": 6600 }
  },
  "Toyota": {
    models: { "Camry": 3350, "Corolla": 3000, "Highlander": 4500, "RAV4": 3700, "Tacoma": 4500 }
  },
  "Porsche": {
    models: { "911": 3400, "Cayenne": 4800, "Macan": 4100, "Taycan": 5100, "Panamera": 4600 }
  },
  "Mercedes-Benz": {
    models: { "C-Class": 3700, "E-Class": 4100, "GLE": 5200, "GLC": 4400, "S-Class": 4900 }
  },
};

const MAKES = Object.keys(VEHICLE_DATA);

const CITIES = ["Miami, FL", "Orlando, FL", "Atlanta, GA", "Dallas, TX", "Los Angeles, CA", "New York, NY", "Chicago, IL", "Seattle, WA"];

const TRANSPORT_TYPES = ["Open", "Enclosed"];

// Base prices by distance tier
const ROUTE_PRICES: Record<string, Record<string, number>> = {
  "Miami, FL": { "Orlando, FL": 280, "Atlanta, GA": 450, "Dallas, TX": 950, "Los Angeles, CA": 1350, "New York, NY": 1100, "Chicago, IL": 1200, "Seattle, WA": 1600 },
  "New York, NY": { "Miami, FL": 1100, "Orlando, FL": 1000, "Atlanta, GA": 750, "Dallas, TX": 1300, "Los Angeles, CA": 1550, "Chicago, IL": 800, "Seattle, WA": 1500 },
  "Los Angeles, CA": { "Miami, FL": 1350, "Orlando, FL": 1300, "Atlanta, GA": 1250, "Dallas, TX": 850, "New York, NY": 1550, "Chicago, IL": 1150, "Seattle, WA": 650 },
};

function getBasePrice(from: string, to: string): number {
  return ROUTE_PRICES[from]?.[to] || ROUTE_PRICES[to]?.[from] || 900;
}

function calculatePrice(from: string, to: string, weight: number, transport: string): { low: number; high: number } {
  let base = getBasePrice(from, to);
  
  // Weight modifier (heavier = more expensive)
  if (weight > 5000) base *= 1.15;
  else if (weight > 4000) base *= 1.08;
  
  // Enclosed premium
  if (transport === "Enclosed") base *= 1.40;
  
  base = Math.round(base / 25) * 25;
  return { low: Math.round(base * 0.92 / 25) * 25, high: Math.round(base * 1.08 / 25) * 25 };
}

// Condition zones for damage marking
const CONDITION_ZONES = [
  { id: "front-bumper", label: "Front Bumper" },
  { id: "hood", label: "Hood" },
  { id: "front-left", label: "Front Left Fender" },
  { id: "front-right", label: "Front Right Fender" },
  { id: "driver-door", label: "Driver Door" },
  { id: "passenger-door", label: "Passenger Door" },
  { id: "rear-left", label: "Rear Left Panel" },
  { id: "rear-right", label: "Rear Right Panel" },
  { id: "rear-bumper", label: "Rear Bumper" },
  { id: "trunk", label: "Trunk/Tailgate" },
  { id: "roof", label: "Roof" },
  { id: "windshield", label: "Windshield" },
];

const DAMAGE_TYPES = ["Scratch", "Dent", "Chip", "Crack", "Rust", "Missing Part"];

interface DamageNote {
  id: string;
  zone: string;
  type: string;
  notes: string;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════

export default function AutoTransport() {
  useModelViewer();
  const { toast } = useToast();
  
  // Vehicle selection
  const [year, setYear] = useState("2024");
  const [make, setMake] = useState("Porsche");
  const [model, setModel] = useState("911");
  
  // Route
  const [fromCity, setFromCity] = useState("Miami, FL");
  const [toCity, setToCity] = useState("New York, NY");
  const [transport, setTransport] = useState("Enclosed");
  
  // Condition report
  const [damages, setDamages] = useState<DamageNote[]>([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedDamageType, setSelectedDamageType] = useState("");
  const [damageNotes, setDamageNotes] = useState("");
  
  // Common damage checkboxes
  const [hasScratches, setHasScratches] = useState(false);
  const [hasDents, setHasDents] = useState(false);
  const [hasChips, setHasChips] = useState(false);
  const [hasWheelDamage, setHasWheelDamage] = useState(false);
  
  // Derived data
  const models = VEHICLE_DATA[make]?.models || {};
  const modelNames = Object.keys(models);
  const weight = models[model] || 3500;
  const pricing = calculatePrice(fromCity, toCity, weight, transport);
  
  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    const firstModel = Object.keys(VEHICLE_DATA[newMake]?.models || {})[0] || "";
    setModel(firstModel);
  };
  
  const addDamage = () => {
    if (!selectedZone || !selectedDamageType) return;
    setDamages(prev => [...prev, {
      id: Date.now().toString(),
      zone: selectedZone,
      type: selectedDamageType,
      notes: damageNotes
    }]);
    setSelectedZone("");
    setSelectedDamageType("");
    setDamageNotes("");
  };
  
  const removeDamage = (id: string) => {
    setDamages(prev => prev.filter(d => d.id !== id));
  };
  
  const handleGetQuote = () => {
    toast({
      title: "Quote Generated",
      description: `${year} ${make} ${model}: $${pricing.low.toLocaleString()} – $${pricing.high.toLocaleString()}`
    });
  };

  return (
    <div className="at-page">
      {/* HEADER */}
      <header className="at-header">
        <div className="at-header-inner">
          <h1>Auto Transport</h1>
          <p>Select your vehicle, mark any existing damage, and get an instant quote.</p>
        </div>
      </header>

      {/* MAIN CONTENT - 2 Column */}
      <main className="at-main">
        {/* LEFT: Vehicle + 3D Viewer */}
        <div className="at-col-left">
          <Card className="at-card">
            <CardContent className="at-card-body">
              <div className="at-card-title">Vehicle Selection</div>
              
              {/* Vehicle Dropdowns */}
              <div className="at-vehicle-grid">
                <div className="at-field">
                  <label>Year</label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="at-select"><SelectValue /></SelectTrigger>
                    <SelectContent className="at-dropdown">{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="at-field">
                  <label>Make</label>
                  <Select value={make} onValueChange={handleMakeChange}>
                    <SelectTrigger className="at-select"><SelectValue /></SelectTrigger>
                    <SelectContent className="at-dropdown">{MAKES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="at-field">
                  <label>Model</label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="at-select"><SelectValue /></SelectTrigger>
                    <SelectContent className="at-dropdown">{modelNames.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Auto-populated specs */}
              <div className="at-specs">
                <div className="at-spec">
                  <span className="at-spec-label">Curb Weight</span>
                  <span className="at-spec-value">{weight.toLocaleString()} lbs</span>
                </div>
                <div className="at-spec">
                  <span className="at-spec-label">Category</span>
                  <span className="at-spec-value">{weight > 5000 ? "Heavy" : weight > 4000 ? "Standard" : "Light"}</span>
                </div>
              </div>
              
              {/* 3D Viewer */}
              <div className="at-viewer">
                <model-viewer
                  src="https://raw.githubusercontent.com/ArturoMauricioDev/car-demo/main/public/porsche.glb"
                  alt={`${year} ${make} ${model}`}
                  auto-rotate
                  camera-controls
                  rotation-per-second="15deg"
                  interaction-prompt="none"
                  shadow-intensity="0.3"
                  exposure="1.1"
                  style={{ width: '100%', height: '100%', background: 'transparent' }}
                />
                <div className="at-viewer-hint">Drag to rotate • Scroll to zoom</div>
              </div>
            </CardContent>
          </Card>
          
          {/* Route + Price */}
          <Card className="at-card">
            <CardContent className="at-card-body">
              <div className="at-card-title">Route & Quote</div>
              
              <div className="at-route-grid">
                <div className="at-field">
                  <label>Pickup</label>
                  <Select value={fromCity} onValueChange={setFromCity}>
                    <SelectTrigger className="at-select"><SelectValue /></SelectTrigger>
                    <SelectContent className="at-dropdown">{CITIES.map(c => <SelectItem key={c} value={c} disabled={c === toCity}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="at-field">
                  <label>Delivery</label>
                  <Select value={toCity} onValueChange={setToCity}>
                    <SelectTrigger className="at-select"><SelectValue /></SelectTrigger>
                    <SelectContent className="at-dropdown">{CITIES.map(c => <SelectItem key={c} value={c} disabled={c === fromCity}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="at-field">
                  <label>Transport</label>
                  <Select value={transport} onValueChange={setTransport}>
                    <SelectTrigger className="at-select"><SelectValue /></SelectTrigger>
                    <SelectContent className="at-dropdown">{TRANSPORT_TYPES.map(t => <SelectItem key={t} value={t}>{t}{t === "Enclosed" && " (+40%)"}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Price Display */}
              <div className="at-price-box">
                <div className="at-price-label">Estimated Price</div>
                <div className="at-price-value">${pricing.low.toLocaleString()} – ${pricing.high.toLocaleString()}</div>
                <div className="at-price-meta">
                  <span><Clock className="w-3.5 h-3.5" /> 5–7 days</span>
                  <span><MapPin className="w-3.5 h-3.5" /> Door-to-door</span>
                </div>
              </div>
              
              <Button className="at-btn at-btn-full" onClick={handleGetQuote}>
                Get Quote <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Condition Report */}
        <div className="at-col-right">
          <Card className="at-card at-card-stretch">
            <CardContent className="at-card-body">
              <div className="at-card-title">Condition Report</div>
              <p className="at-card-desc">Document any existing damage before transport.</p>
              
              {/* Quick checkboxes */}
              <div className="at-damage-quick">
                <label className="at-checkbox-row">
                  <Checkbox checked={hasScratches} onCheckedChange={(c) => setHasScratches(!!c)} />
                  <span>Existing scratches</span>
                </label>
                <label className="at-checkbox-row">
                  <Checkbox checked={hasDents} onCheckedChange={(c) => setHasDents(!!c)} />
                  <span>Minor dents</span>
                </label>
                <label className="at-checkbox-row">
                  <Checkbox checked={hasChips} onCheckedChange={(c) => setHasChips(!!c)} />
                  <span>Paint chips</span>
                </label>
                <label className="at-checkbox-row">
                  <Checkbox checked={hasWheelDamage} onCheckedChange={(c) => setHasWheelDamage(!!c)} />
                  <span>Wheel/curb damage</span>
                </label>
              </div>
              
              {/* Add specific damage */}
              <div className="at-damage-form">
                <div className="at-damage-form-title">Add Specific Damage</div>
                <div className="at-damage-form-grid">
                  <Select value={selectedZone} onValueChange={setSelectedZone}>
                    <SelectTrigger className="at-select"><SelectValue placeholder="Select zone" /></SelectTrigger>
                    <SelectContent className="at-dropdown">{CONDITION_ZONES.map(z => <SelectItem key={z.id} value={z.id}>{z.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={selectedDamageType} onValueChange={setSelectedDamageType}>
                    <SelectTrigger className="at-select"><SelectValue placeholder="Damage type" /></SelectTrigger>
                    <SelectContent className="at-dropdown">{DAMAGE_TYPES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <input
                  type="text"
                  placeholder="Additional notes (optional)"
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  className="at-input"
                />
                <Button 
                  className="at-btn-secondary" 
                  onClick={addDamage}
                  disabled={!selectedZone || !selectedDamageType}
                >
                  <Plus className="w-4 h-4" /> Add Damage
                </Button>
              </div>
              
              {/* Damage list */}
              {damages.length > 0 && (
                <div className="at-damage-list">
                  <div className="at-damage-list-title">Documented Damage ({damages.length})</div>
                  {damages.map(d => {
                    const zone = CONDITION_ZONES.find(z => z.id === d.zone);
                    return (
                      <div key={d.id} className="at-damage-item">
                        <div className="at-damage-item-info">
                          <span className="at-damage-zone">{zone?.label}</span>
                          <span className="at-damage-type">{d.type}</span>
                          {d.notes && <span className="at-damage-notes">{d.notes}</span>}
                        </div>
                        <button className="at-damage-remove" onClick={() => removeDamage(d.id)}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Status summary */}
              <div className="at-condition-summary">
                {damages.length === 0 && !hasScratches && !hasDents && !hasChips && !hasWheelDamage ? (
                  <div className="at-condition-clean">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>No damage documented</span>
                  </div>
                ) : (
                  <div className="at-condition-noted">
                    <AlertCircle className="w-4 h-4" />
                    <span>Pre-existing damage will be noted on the Bill of Lading</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

