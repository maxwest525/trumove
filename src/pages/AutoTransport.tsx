import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react";
import { 
  Car, Truck, Shield, Clock, MapPin, CheckCircle2, 
  ChevronRight, ChevronLeft, Phone, Calendar,
  Package, Eye, FileText, Navigation, Sparkles,
  AlertCircle, Plus, X, BadgeCheck, Camera, Radio, ChevronDown,
  Star, Building2, Hash, CalendarCheck, ExternalLink, Upload, ImageIcon,
  User, MessageCircle, PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/layout/Footer";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from "@/lib/mapboxToken";

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

// ═══════════════════════════════════════════════════════════════════
// DATA & PRICING LOGIC
// ═══════════════════════════════════════════════════════════════════

const YEARS = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
const MAKES = ["BMW", "Chevrolet", "Ford", "Honda", "Tesla", "Toyota"];

const MODELS: Record<string, string[]> = {
  BMW: ["3 Series", "5 Series", "X3", "X5", "X7"],
  Chevrolet: ["Camaro", "Corvette", "Equinox", "Silverado", "Tahoe"],
  Ford: ["Bronco", "F-150", "Mustang", "Explorer", "Escape"],
  Honda: ["Accord", "Civic", "CR-V", "Pilot", "Odyssey"],
  Tesla: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
  Toyota: ["Camry", "Corolla", "Highlander", "RAV4", "Tacoma"],
};

const VEHICLE_TYPES = ["Sedan", "SUV", "Truck", "Van"];
const RUNS_OPTIONS = ["Runs", "Does not run"];
const SIZE_OPTIONS = ["Standard", "Oversize"];

const CITIES = [
  "Miami, FL",
  "Orlando, FL", 
  "Atlanta, GA",
  "Dallas, TX",
  "Los Angeles, CA",
  "New York, NY",
];

const TIMEFRAMES = ["ASAP", "1–3 days", "4–7 days", "Scheduled date"];
const TRANSPORT_TYPES = ["Open", "Enclosed"];

// Base route prices
const ROUTE_PRICES: Record<string, Record<string, number>> = {
  "Miami, FL": { "Orlando, FL": 350, "Atlanta, GA": 550, "Dallas, TX": 1100, "Los Angeles, CA": 1450, "New York, NY": 1250 },
  "Orlando, FL": { "Miami, FL": 350, "Atlanta, GA": 450, "Dallas, TX": 950, "Los Angeles, CA": 1400, "New York, NY": 1150 },
  "Atlanta, GA": { "Miami, FL": 550, "Orlando, FL": 450, "Dallas, TX": 750, "Los Angeles, CA": 1350, "New York, NY": 850 },
  "Dallas, TX": { "Miami, FL": 1100, "Orlando, FL": 950, "Atlanta, GA": 750, "Los Angeles, CA": 950, "New York, NY": 1400 },
  "Los Angeles, CA": { "Miami, FL": 1450, "Orlando, FL": 1400, "Atlanta, GA": 1350, "Dallas, TX": 950, "New York, NY": 1650 },
  "New York, NY": { "Miami, FL": 1250, "Orlando, FL": 1150, "Atlanta, GA": 850, "Dallas, TX": 1400, "Los Angeles, CA": 1650 },
};

const TRANSIT_TIMES: Record<string, string> = { short: "2–3 days", medium: "4–6 days", long: "7–10 days" };

function getTransitTime(from: string, to: string): string {
  const price = ROUTE_PRICES[from]?.[to] || 800;
  if (price < 500) return TRANSIT_TIMES.short;
  if (price < 1000) return TRANSIT_TIMES.medium;
  return TRANSIT_TIMES.long;
}

function calculateDemoPrice(from: string, to: string, vehicleType: string, transportType: string, runs: string, size: string) {
  let base = ROUTE_PRICES[from]?.[to] || 800;
  if (transportType === "Enclosed") base *= 1.35;
  if (runs === "Does not run") base *= 1.20;
  if (size === "Oversize") base *= 1.20;
  if (vehicleType === "Truck") base *= 1.10;
  else if (vehicleType === "SUV") base *= 1.05;
  base = Math.round(base / 25) * 25;
  const low = Math.round((base * 0.92) / 25) * 25;
  const high = Math.round((base * 1.08) / 25) * 25;
  return { low, high, base };
}

// ═══════════════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════════════

const TRUST_ITEMS = [
  { icon: Shield, label: "Fully Insured" },
  { icon: Clock, label: "On-Time Delivery" },
  { icon: CheckCircle2, label: "Door-to-Door" },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Get a Quote", description: "Enter your vehicle and route details for an instant estimate." },
  { step: 2, title: "Book & Schedule", description: "Choose your pickup date and confirm your transport." },
  { step: 3, title: "Vehicle Pickup", description: "We collect your vehicle with a detailed condition report." },
  { step: 4, title: "Track & Receive", description: "Monitor your shipment and receive your vehicle safely." },
];

const FAQ_ITEMS = [
  { question: "How long does auto transport take?", answer: "Transit times vary based on distance. Cross-country shipments typically take 7-10 days, while regional moves are often completed in 3-5 days." },
  { question: "Is my vehicle insured during transport?", answer: "Yes, all vehicles are covered by carrier insurance during transport. We also offer supplemental coverage options for additional peace of mind." },
  { question: "Can I ship a non-running vehicle?", answer: "Absolutely. We transport non-running, inoperable, and project vehicles. Additional equipment fees may apply." },
  { question: "What's the difference between open and enclosed transport?", answer: "Open transport is cost-effective and suitable for most vehicles. Enclosed transport provides weather and debris protection, ideal for luxury, classic, or high-value vehicles." },
];

// Demo tracking updates
const DEMO_UPDATES = [
  { time: "Feb 7, 2:15 PM", event: "Shipment booked and confirmed", status: "complete" },
  { time: "Feb 8, 9:30 AM", event: "Carrier assigned: Elite Auto Transport", status: "complete" },
  { time: "Feb 9, 11:00 AM", event: "Pickup completed in Miami, FL", status: "complete" },
  { time: "Feb 10, 3:45 PM", event: "In transit – Passing through Georgia", status: "active" },
];

// Condition zones
const CONDITION_ZONES = ["Front", "Left Side", "Right Side", "Rear", "Roof"];
const CONDITION_GRADES = ["Excellent", "Good", "Fair"];

// ═══════════════════════════════════════════════════════════════════
// VEHICLE VIEWER COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface VehicleViewerProps {
  year: string;
  make: string;
  model: string;
  vehicleType: string;
  transportType: string;
  runs: string;
}

function VehicleViewer({ year, make, model, vehicleType, transportType, runs }: VehicleViewerProps) {
  // Free 3D car model from Google's model-viewer examples
  const modelUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
  
  // Alternative free car model
  const carModelUrl = "https://raw.githubusercontent.com/ArturoMauricioDev/car-demo/main/public/porsche.glb";
  
  return (
    <div className="at-viewer-inner">
      <div className="at-viewer-canvas">
        <model-viewer
          src={carModelUrl}
          alt={`${year} ${make} ${model}`}
          auto-rotate
          camera-controls
          disable-zoom
          rotation-per-second="20deg"
          interaction-prompt="none"
          shadow-intensity="0.5"
          exposure="1"
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        />
      </div>
      
      {/* Spec row */}
      <div className="at-viewer-specs">
        <div className="at-viewer-spec">
          <span className="at-viewer-spec-label">Vehicle</span>
          <span className="at-viewer-spec-value">{year} {make} {model}</span>
        </div>
        <div className="at-viewer-spec-divider" />
        <div className="at-viewer-spec">
          <span className="at-viewer-spec-label">Transport</span>
          <span className="at-viewer-spec-value">{transportType}</span>
        </div>
        <div className="at-viewer-spec-divider" />
        <div className="at-viewer-spec">
          <span className="at-viewer-spec-label">Condition</span>
          <span className="at-viewer-spec-value">{runs}</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CONDITION REPORT COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface ConditionNote {
  id: string;
  zone: string;
  note: string;
}

interface PhotoUpload {
  id: string;
  zone: string;
  preview: string;
  note: string;
}

const PHOTO_ZONES = ["Front", "Rear", "Left Side", "Right Side"];

function ConditionReport() {
  const [overallCondition, setOverallCondition] = useState("Good");
  const [scratches, setScratches] = useState(false);
  const [dents, setDents] = useState(false);
  const [windshield, setWindshield] = useState(false);
  const [curb, setCurb] = useState(false);
  
  const [selectedZone, setSelectedZone] = useState("");
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<ConditionNote[]>([]);
  
  // Photo uploads state
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  
  const addNote = () => {
    if (!selectedZone || !noteText.trim()) return;
    setNotes(prev => [...prev, {
      id: Date.now().toString(),
      zone: selectedZone,
      note: noteText.trim()
    }]);
    setNoteText("");
    setSelectedZone("");
  };
  
  const removeNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };
  
  const handlePhotoUpload = (zone: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result as string;
      setPhotos(prev => {
        // Replace existing photo for this zone or add new
        const existing = prev.find(p => p.zone === zone);
        if (existing) {
          return prev.map(p => p.zone === zone ? { ...p, preview } : p);
        }
        return [...prev, { id: Date.now().toString(), zone, preview, note: "" }];
      });
    };
    reader.readAsDataURL(file);
  };
  
  const updatePhotoNote = (zone: string, note: string) => {
    setPhotos(prev => prev.map(p => p.zone === zone ? { ...p, note } : p));
  };
  
  const removePhoto = (zone: string) => {
    setPhotos(prev => prev.filter(p => p.zone !== zone));
    if (fileInputRefs.current[zone]) {
      fileInputRefs.current[zone]!.value = "";
    }
  };
  
  const getPhotoForZone = (zone: string) => photos.find(p => p.zone === zone);
  
  return (
    <div className="at-condition-inner">
      {/* Overall condition */}
      <div className="at-condition-row">
        <label className="at-form-label">Overall Condition</label>
        <Select value={overallCondition} onValueChange={setOverallCondition}>
          <SelectTrigger className="at-select-trigger at-select-trigger-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="at-select-content">
            {CONDITION_GRADES.map(g => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Checkboxes */}
      <div className="at-condition-checks">
        <label className="at-form-label">Existing Damage</label>
        <div className="at-condition-check-grid">
          <label className="at-checkbox-label">
            <Checkbox checked={scratches} onCheckedChange={(c) => setScratches(!!c)} className="at-checkbox" />
            <span>Existing scratches</span>
          </label>
          <label className="at-checkbox-label">
            <Checkbox checked={dents} onCheckedChange={(c) => setDents(!!c)} className="at-checkbox" />
            <span>Minor dents</span>
          </label>
          <label className="at-checkbox-label">
            <Checkbox checked={windshield} onCheckedChange={(c) => setWindshield(!!c)} className="at-checkbox" />
            <span>Windshield chips</span>
          </label>
          <label className="at-checkbox-label">
            <Checkbox checked={curb} onCheckedChange={(c) => setCurb(!!c)} className="at-checkbox" />
            <span>Wheel curb rash</span>
          </label>
        </div>
      </div>
      
      {/* Photo Uploads */}
      <div className="at-condition-photos">
        <label className="at-form-label">Photo Documentation (Demo)</label>
        <div className="at-photo-grid">
          {PHOTO_ZONES.map(zone => {
            const photo = getPhotoForZone(zone);
            return (
              <div key={zone} className="at-photo-card">
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => { fileInputRefs.current[zone] = el; }}
                  onChange={(e) => handlePhotoUpload(zone, e)}
                  className="at-photo-input"
                  id={`photo-${zone}`}
                />
                
                {photo ? (
                  <div className="at-photo-preview">
                    <img src={photo.preview} alt={zone} />
                    <button 
                      className="at-photo-remove" 
                      onClick={() => removePhoto(zone)}
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="at-photo-zone-badge">{zone}</div>
                  </div>
                ) : (
                  <label htmlFor={`photo-${zone}`} className="at-photo-placeholder">
                    <Camera className="w-5 h-5" />
                    <span className="at-photo-zone-label">{zone}</span>
                    <span className="at-photo-upload-hint">Click to upload</span>
                  </label>
                )}
                
                {photo && (
                  <input
                    type="text"
                    placeholder="Add note..."
                    value={photo.note}
                    onChange={(e) => updatePhotoNote(zone, e.target.value)}
                    className="at-photo-note-input"
                  />
                )}
              </div>
            );
          })}
        </div>
        <p className="at-photo-disclaimer">Demo only. Photos stored locally for preview.</p>
      </div>
      
      {/* Zone notes */}
      <div className="at-condition-notes-section">
        <label className="at-form-label">Add Zone Note</label>
        <div className="at-condition-note-input">
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="at-select-trigger at-select-trigger-sm">
              <SelectValue placeholder="Select zone" />
            </SelectTrigger>
            <SelectContent className="at-select-content">
              {CONDITION_ZONES.map(z => (
                <SelectItem key={z} value={z}>{z}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea 
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Describe damage or note..."
            className="at-textarea"
            rows={2}
          />
          <Button 
            className="at-btn-add-note"
            onClick={addNote}
            disabled={!selectedZone || !noteText.trim()}
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
        
        {/* Saved notes */}
        {notes.length > 0 && (
          <div className="at-condition-notes-list">
            {notes.map(note => (
              <div key={note.id} className="at-condition-note-item">
                <div className="at-condition-note-content">
                  <span className="at-condition-note-zone">{note.zone}</span>
                  <span className="at-condition-note-text">{note.note}</span>
                </div>
                <button onClick={() => removeNote(note.id)} className="at-condition-note-remove">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SHIPMENT TRACKER MAP COMPONENT
// ═══════════════════════════════════════════════════════════════════

function ShipmentTrackerMap({ isTracking }: { isTracking: boolean }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const animationRef = useRef<number>();
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  
  // Miami to New York route
  const miamiCoords: [number, number] = [-80.1918, 25.7617];
  const nyCoords: [number, number] = [-74.006, 40.7128];
  
  // Fetch road-snapped route
  useEffect(() => {
    if (!isTracking) return;
    
    const fetchRoute = async () => {
      const waypoints = [
        miamiCoords,
        [-81.3792, 28.5383], // Orlando
        [-84.388, 33.749],   // Atlanta
        [-77.0369, 38.9072], // Washington DC
        nyCoords
      ];
      
      const coordsString = waypoints.map(p => `${p[0]},${p[1]}`).join(';');
      
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`
        );
        const data = await response.json();
        
        if (data.routes?.[0]) {
          setRouteCoords(data.routes[0].geometry.coordinates as [number, number][]);
        }
      } catch (error) {
        console.error('Failed to fetch route:', error);
        setRouteCoords([miamiCoords, nyCoords]);
      }
    };
    
    fetchRoute();
  }, [isTracking]);
  
  // Interpolation helpers
  const getPointAlongRoute = useCallback((progress: number): [number, number] => {
    if (routeCoords.length < 2) return routeCoords[0] || miamiCoords;
    const numSegments = routeCoords.length - 1;
    const segmentProgress = progress * numSegments;
    const segmentIndex = Math.min(Math.floor(segmentProgress), numSegments - 1);
    const t = segmentProgress - segmentIndex;
    const start = routeCoords[segmentIndex];
    const end = routeCoords[Math.min(segmentIndex + 1, routeCoords.length - 1)];
    return [start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t];
  }, [routeCoords]);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || routeCoords.length < 2 || !isTracking) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [-84.388, 33.749], // Atlanta center
      zoom: 5,
      pitch: 0,
      interactive: true,
      attributionControl: false
    });
    
    map.current.on('load', () => {
      if (!map.current) return;
      
      // Add route line
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: routeCoords }
        }
      });
      
      map.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#00e5a0', 'line-width': 3, 'line-opacity': 0.8 }
      });
      
      // Fit to route
      const bounds = new mapboxgl.LngLatBounds();
      routeCoords.forEach(coord => bounds.extend(coord));
      map.current.fitBounds(bounds, { padding: 50 });
      
      // Start animation
      let progress = 0.45; // Start ~45% along route (Georgia area)
      
      const animate = () => {
        if (!map.current) return;
        progress += 0.0001;
        if (progress > 1) progress = 0;
        
        const position = getPointAlongRoute(progress);
        
        // Update truck marker position
        const truckSource = map.current.getSource('truck') as mapboxgl.GeoJSONSource;
        if (truckSource) {
          truckSource.setData({
            type: 'Feature',
            properties: {},
            geometry: { type: 'Point', coordinates: position }
          });
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      // Add truck marker source
      map.current.addSource('truck', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: getPointAlongRoute(0.45) }
        }
      });
      
      map.current.addLayer({
        id: 'truck-marker',
        type: 'circle',
        source: 'truck',
        paint: {
          'circle-radius': 8,
          'circle-color': '#00e5a0',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#0d0d0d'
        }
      });
      
      // Origin marker
      map.current.addSource('origin', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: miamiCoords } }
      });
      map.current.addLayer({
        id: 'origin-marker',
        type: 'circle',
        source: 'origin',
        paint: { 'circle-radius': 6, 'circle-color': '#22c55e', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' }
      });
      
      // Destination marker
      map.current.addSource('destination', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: nyCoords } }
      });
      map.current.addLayer({
        id: 'dest-marker',
        type: 'circle',
        source: 'destination',
        paint: { 'circle-radius': 6, 'circle-color': '#ef4444', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' }
      });
      
      animate();
    });
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (map.current) { map.current.remove(); map.current = null; }
    };
  }, [routeCoords, isTracking, getPointAlongRoute]);
  
  return (
    <div className="at-tracker-map-container">
      <div ref={mapContainer} className="at-tracker-map-inner" />
      {!isTracking && (
        <div className="at-tracker-map-placeholder">
          <Navigation className="w-10 h-10" />
          <p>Click "Start Demo Tracking" to activate</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function AutoTransport() {
  const { toast } = useToast();
  const trackerRef = useRef<HTMLDivElement>(null);
  
  // Wizard state
  const [activeStep, setActiveStep] = useState(1);
  const [showTracker, setShowTracker] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [showCarrierMatch, setShowCarrierMatch] = useState(false);
  const [showCarrierPacket, setShowCarrierPacket] = useState(false);
  const [showDriverContact, setShowDriverContact] = useState(false);
  
  // Step 1: Vehicle
  const [year, setYear] = useState("2022");
  const [make, setMake] = useState("BMW");
  const [model, setModel] = useState("X5");
  const [vehicleType, setVehicleType] = useState("SUV");
  const [runs, setRuns] = useState("Runs");
  const [size, setSize] = useState("Standard");
  
  // Step 2: Route
  const [fromCity, setFromCity] = useState("Miami, FL");
  const [toCity, setToCity] = useState("New York, NY");
  const [timeframe, setTimeframe] = useState("ASAP");
  const [transportType, setTransportType] = useState("Enclosed");
  
  // Pricing
  const pricing = calculateDemoPrice(fromCity, toCity, vehicleType, transportType, runs, size);
  const transitTime = getTransitTime(fromCity, toCity);
  const availableModels = MODELS[make] || [];
  
  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    setModel(MODELS[newMake]?.[0] || "");
  };
  
  const handleReserve = () => {
    setShowCarrierMatch(true);
    setShowTracker(true);
    toast({
      title: "Demo Shipment Reserved!",
      description: `Your ${year} ${make} ${model} transport has been scheduled.`,
    });
    // Scroll to carrier match after a brief delay
    setTimeout(() => {
      document.getElementById('carrier-match-section')?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };
  
  const startDemoTracking = () => {
    setIsTracking(true);
    toast({ title: "Demo Tracking Started", description: "Watch the truck move along the route." });
  };
  
  const canProceedStep1 = year && make && model && vehicleType && runs && size;
  const canProceedStep2 = fromCity && toCity && fromCity !== toCity && timeframe && transportType;

  // Load model-viewer script
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return (
    <div className="auto-transport-page">
      {/* Carrier Packet Modal */}
      <Dialog open={showCarrierPacket} onOpenChange={setShowCarrierPacket}>
        <DialogContent className="at-packet-modal">
          <DialogHeader>
            <DialogTitle className="at-packet-title">
              <FileText className="w-5 h-5" />
              Carrier Packet (Demo)
            </DialogTitle>
          </DialogHeader>
          
          <div className="at-packet-content">
            <div className="at-packet-section">
              <h4 className="at-packet-section-title">Carrier Information</h4>
              <div className="at-packet-grid">
                <div className="at-packet-item"><span>Legal Name</span><span>Atlas Transport Group LLC</span></div>
                <div className="at-packet-item"><span>DBA</span><span>Atlas Auto Carriers</span></div>
                <div className="at-packet-item"><span>MC Number</span><span>MC-847293</span></div>
                <div className="at-packet-item"><span>DOT Number</span><span>3284756</span></div>
                <div className="at-packet-item"><span>Operating Authority</span><span>Active - Authorized</span></div>
                <div className="at-packet-item"><span>Fleet Size</span><span>42 Power Units</span></div>
              </div>
            </div>
            
            <div className="at-packet-section">
              <h4 className="at-packet-section-title">Insurance Coverage</h4>
              <div className="at-packet-grid">
                <div className="at-packet-item"><span>Cargo Insurance</span><span>$250,000</span></div>
                <div className="at-packet-item"><span>Liability</span><span>$1,000,000</span></div>
                <div className="at-packet-item"><span>Policy Expiration</span><span>Dec 31, 2026</span></div>
                <div className="at-packet-item"><span>Insurer</span><span>Progressive Commercial</span></div>
              </div>
            </div>
            
            <div className="at-packet-section">
              <h4 className="at-packet-section-title">Safety Record</h4>
              <div className="at-packet-grid">
                <div className="at-packet-item"><span>SAFER Rating</span><span>Satisfactory</span></div>
                <div className="at-packet-item"><span>Inspections (24mo)</span><span>18</span></div>
                <div className="at-packet-item"><span>Crashes (24mo)</span><span>0</span></div>
                <div className="at-packet-item"><span>Driver Rating</span><span>4.9 / 5.0</span></div>
              </div>
            </div>
            
            <div className="at-packet-section">
              <h4 className="at-packet-section-title">Equipment</h4>
              <div className="at-packet-grid">
                <div className="at-packet-item"><span>Trailer Types</span><span>Open & Enclosed</span></div>
                <div className="at-packet-item"><span>Capacity</span><span>Up to 10 vehicles</span></div>
                <div className="at-packet-item"><span>GPS Tracking</span><span>Yes - Real-time</span></div>
                <div className="at-packet-item"><span>Hydraulic Lift</span><span>Available</span></div>
              </div>
            </div>
            
            <p className="at-packet-disclaimer">
              Demo data for illustration purposes. Actual carrier credentials verified during booking.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Driver Contact Modal */}
      <Dialog open={showDriverContact} onOpenChange={setShowDriverContact}>
        <DialogContent className="at-driver-modal">
          <DialogHeader>
            <DialogTitle className="at-packet-title">
              <PhoneCall className="w-5 h-5" />
              Contact Driver (Demo)
            </DialogTitle>
          </DialogHeader>
          
          <div className="at-driver-modal-content">
            <div className="at-driver-modal-profile">
              <div className="at-driver-modal-avatar">
                <User className="w-10 h-10" />
              </div>
              <div className="at-driver-modal-info">
                <span className="at-driver-modal-name">Marcus Thompson</span>
                <span className="at-driver-modal-carrier">Atlas Transport Group</span>
                <div className="at-driver-modal-rating">
                  <Star className="w-3.5 h-3.5" />
                  <Star className="w-3.5 h-3.5" />
                  <Star className="w-3.5 h-3.5" />
                  <Star className="w-3.5 h-3.5" />
                  <Star className="w-3.5 h-3.5" />
                  <span>4.9</span>
                </div>
              </div>
            </div>
            
            <div className="at-driver-modal-actions">
              <Button 
                className="at-btn-primary at-btn-full"
                onClick={() => {
                  toast({ title: "Demo Mode", description: "Call feature not available in demo." });
                  setShowDriverContact(false);
                }}
              >
                <Phone className="w-4 h-4" />
                Call Driver
              </Button>
              <Button 
                className="at-btn-secondary at-btn-full"
                onClick={() => {
                  toast({ title: "Demo Mode", description: "Message feature not available in demo." });
                  setShowDriverContact(false);
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Send Message
              </Button>
            </div>
            
            <div className="at-driver-modal-note">
              <AlertCircle className="w-4 h-4" />
              <span>For urgent issues, contact dispatch at 1-800-TRUMOVE</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* HERO */}
      <section className="at-hero">
        <div className="at-hero-content">
          <h1 className="at-hero-headline">
            Vehicle Transport,<br />
            <span className="at-hero-headline-accent">Simplified.</span>
          </h1>
          <p className="at-hero-subheadline">
            Coast-to-coast auto shipping with real-time tracking, transparent pricing, and white-glove service.
          </p>
          <div className="at-hero-ctas">
            <Button className="at-btn-primary" size="lg">Get Instant Quote<ChevronRight className="w-4 h-4" /></Button>
            <Button variant="outline" className="at-btn-secondary" size="lg"><Phone className="w-4 h-4" />Speak to an Expert</Button>
          </div>
          <div className="at-trust-strip">
            {TRUST_ITEMS.map((item, idx) => (
              <div key={item.label} className="at-trust-item">
                <item.icon className="w-4 h-4" /><span>{item.label}</span>
                {idx < TRUST_ITEMS.length - 1 && <span className="at-trust-dot">•</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST & COMPLIANCE BAND */}
      <section className="at-trust-band">
        <div className="at-trust-band-inner">
          <div className="at-trust-band-grid">
            <div className="at-compliance-card">
              <div className="at-compliance-icon">
                <Shield className="w-5 h-5" />
              </div>
              <div className="at-compliance-text">
                <span className="at-compliance-title">DOT & FMCSA Compliant</span>
                <span className="at-compliance-subtitle">Carrier Network</span>
              </div>
            </div>
            
            <div className="at-compliance-card">
              <div className="at-compliance-icon">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div className="at-compliance-text">
                <span className="at-compliance-title">Cargo Insurance Verified</span>
                <span className="at-compliance-subtitle">Demo</span>
              </div>
            </div>
            
            <div className="at-compliance-card">
              <div className="at-compliance-icon">
                <Radio className="w-5 h-5" />
              </div>
              <div className="at-compliance-text">
                <span className="at-compliance-title">Live Driver Status</span>
                <span className="at-compliance-subtitle">Demo</span>
              </div>
            </div>
            
            <div className="at-compliance-card">
              <div className="at-compliance-icon">
                <Camera className="w-5 h-5" />
              </div>
              <div className="at-compliance-text">
                <span className="at-compliance-title">Condition Report & Photo</span>
                <span className="at-compliance-subtitle">Demo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE WIZARD */}
      <section className="at-section">
        <div className="at-section-header">
          <span className="at-section-label">Instant Pricing</span>
          <h2 className="at-section-title">Get Your Quote</h2>
          <p className="at-section-subtitle">Enter your details for a transparent, all-inclusive estimate.</p>
        </div>

        <Card className="at-wizard-card">
          <CardContent className="at-wizard-content">
            <div className="at-wizard-progress"><div className="at-wizard-progress-bar" style={{ width: `${(activeStep / 3) * 100}%` }} /></div>
            
            <div className="at-wizard-steps">
              {[{ num: 1, label: "Vehicle" }, { num: 2, label: "Route" }, { num: 3, label: "Review" }].map((step) => (
                <button
                  key={step.num}
                  className={`at-wizard-step ${activeStep >= step.num ? 'is-active' : ''} ${activeStep === step.num ? 'is-current' : ''}`}
                  onClick={() => step.num < activeStep && setActiveStep(step.num)}
                  disabled={step.num > activeStep}
                >
                  <span className="at-wizard-step-num">{step.num}</span>
                  <span className="at-wizard-step-label">{step.label}</span>
                </button>
              ))}
            </div>

            {/* Step 1 */}
            {activeStep === 1 && (
              <div className="at-wizard-body">
                <div className="at-wizard-form">
                  <h3 className="at-wizard-form-title">Vehicle Details</h3>
                  <div className="at-form-grid">
                    <div className="at-form-field"><label className="at-form-label">Year</label><Select value={year} onValueChange={setYear}><SelectTrigger className="at-select-trigger"><SelectValue /></SelectTrigger><SelectContent className="at-select-content">{YEARS.map((y) => (<SelectItem key={y} value={y}>{y}</SelectItem>))}</SelectContent></Select></div>
                    <div className="at-form-field"><label className="at-form-label">Make</label><Select value={make} onValueChange={handleMakeChange}><SelectTrigger className="at-select-trigger"><SelectValue /></SelectTrigger><SelectContent className="at-select-content">{MAKES.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}</SelectContent></Select></div>
                    <div className="at-form-field"><label className="at-form-label">Model</label><Select value={model} onValueChange={setModel}><SelectTrigger className="at-select-trigger"><SelectValue /></SelectTrigger><SelectContent className="at-select-content">{availableModels.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}</SelectContent></Select></div>
                    <div className="at-form-field"><label className="at-form-label">Vehicle Type</label><Select value={vehicleType} onValueChange={setVehicleType}><SelectTrigger className="at-select-trigger"><SelectValue /></SelectTrigger><SelectContent className="at-select-content">{VEHICLE_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent></Select></div>
                    <div className="at-form-field"><label className="at-form-label">Condition</label><Select value={runs} onValueChange={setRuns}><SelectTrigger className="at-select-trigger"><SelectValue /></SelectTrigger><SelectContent className="at-select-content">{RUNS_OPTIONS.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}</SelectContent></Select></div>
                    <div className="at-form-field"><label className="at-form-label">Size</label><Select value={size} onValueChange={setSize}><SelectTrigger className="at-select-trigger"><SelectValue /></SelectTrigger><SelectContent className="at-select-content">{SIZE_OPTIONS.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select></div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {activeStep === 2 && (
              <div className="at-wizard-body">
                <div className="at-wizard-form">
                  <h3 className="at-wizard-form-title">Route & Options</h3>
                  <div className="at-form-grid at-form-grid-2">
                    <div className="at-form-field"><label className="at-form-label">Pickup Location</label><Select value={fromCity} onValueChange={setFromCity}><SelectTrigger className="at-select-trigger"><SelectValue /></SelectTrigger><SelectContent className="at-select-content">{CITIES.map((c) => (<SelectItem key={c} value={c} disabled={c === toCity}>{c}</SelectItem>))}</SelectContent></Select></div>
                    <div className="at-form-field"><label className="at-form-label">Delivery Location</label><Select value={toCity} onValueChange={setToCity}><SelectTrigger className="at-select-trigger"><SelectValue /></SelectTrigger><SelectContent className="at-select-content">{CITIES.map((c) => (<SelectItem key={c} value={c} disabled={c === fromCity}>{c}</SelectItem>))}</SelectContent></Select></div>
                    <div className="at-form-field"><label className="at-form-label">Pickup Timeframe</label><Select value={timeframe} onValueChange={setTimeframe}><SelectTrigger className="at-select-trigger"><SelectValue /></SelectTrigger><SelectContent className="at-select-content">{TIMEFRAMES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent></Select></div>
                    <div className="at-form-field"><label className="at-form-label">Transport Type</label><Select value={transportType} onValueChange={setTransportType}><SelectTrigger className="at-select-trigger"><SelectValue /></SelectTrigger><SelectContent className="at-select-content">{TRANSPORT_TYPES.map((t) => (<SelectItem key={t} value={t}>{t} {t === "Enclosed" && <span className="at-select-badge">+35%</span>}</SelectItem>))}</SelectContent></Select></div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {activeStep === 3 && (
              <div className="at-wizard-body">
                <div className="at-review-layout">
                  <div className="at-review-summary">
                    <h3 className="at-wizard-form-title">Your Vehicle</h3>
                    <div className="at-review-vehicle"><Car className="w-8 h-8" /><div><span className="at-review-vehicle-name">{year} {make} {model}</span><span className="at-review-vehicle-meta">{vehicleType} • {runs} • {size}</span></div></div>
                    <div className="at-review-route">
                      <div className="at-review-route-point"><span className="at-review-route-dot at-review-route-dot-origin" /><span>{fromCity}</span></div>
                      <div className="at-review-route-line" />
                      <div className="at-review-route-point"><span className="at-review-route-dot at-review-route-dot-dest" /><span>{toCity}</span></div>
                    </div>
                    <div className="at-review-details">
                      <div className="at-review-detail"><span>Transport</span><span>{transportType}</span></div>
                      <div className="at-review-detail"><span>Timeframe</span><span>{timeframe}</span></div>
                    </div>
                  </div>
                  
                  <div className="at-estimate-card">
                    <div className="at-estimate-header"><Sparkles className="w-5 h-5" /><span>Demo Estimate</span></div>
                    <div className="at-estimate-price"><span className="at-estimate-price-label">Estimated Price</span><span className="at-estimate-price-value">${pricing.low.toLocaleString()} – ${pricing.high.toLocaleString()}</span></div>
                    
                    {/* Price Breakdown Dropdown */}
                    <details className="at-breakdown-details">
                      <summary className="at-breakdown-trigger">
                        <span>Price Breakdown (Demo)</span>
                        <ChevronDown className="at-breakdown-chevron" />
                      </summary>
                      <div className="at-breakdown-content">
                        <div className="at-breakdown-lines">
                          <div className="at-breakdown-line">
                            <span>Base Route Rate</span>
                            <span>${(ROUTE_PRICES[fromCity]?.[toCity] || 800).toLocaleString()}</span>
                          </div>
                          {vehicleType === "Truck" && (
                            <div className="at-breakdown-line at-breakdown-line-adjust">
                              <span>Vehicle Type (Truck)</span>
                              <span>+10%</span>
                            </div>
                          )}
                          {vehicleType === "SUV" && (
                            <div className="at-breakdown-line at-breakdown-line-adjust">
                              <span>Vehicle Type (SUV)</span>
                              <span>+5%</span>
                            </div>
                          )}
                          {vehicleType !== "Truck" && vehicleType !== "SUV" && (
                            <div className="at-breakdown-line at-breakdown-line-neutral">
                              <span>Vehicle Type ({vehicleType})</span>
                              <span>—</span>
                            </div>
                          )}
                          <div className={`at-breakdown-line ${transportType === "Enclosed" ? "at-breakdown-line-adjust" : "at-breakdown-line-neutral"}`}>
                            <span>Transport Type ({transportType})</span>
                            <span>{transportType === "Enclosed" ? "+35%" : "—"}</span>
                          </div>
                          <div className={`at-breakdown-line ${runs === "Does not run" ? "at-breakdown-line-adjust" : "at-breakdown-line-neutral"}`}>
                            <span>Condition ({runs})</span>
                            <span>{runs === "Does not run" ? "+20%" : "—"}</span>
                          </div>
                          <div className={`at-breakdown-line ${size === "Oversize" ? "at-breakdown-line-adjust" : "at-breakdown-line-neutral"}`}>
                            <span>Size ({size})</span>
                            <span>{size === "Oversize" ? "+20%" : "—"}</span>
                          </div>
                          <div className="at-breakdown-line at-breakdown-line-margin">
                            <span>Est. Carrier Margin (Demo)</span>
                            <span>±8%</span>
                          </div>
                        </div>
                        <div className="at-breakdown-total">
                          <span>Total Range</span>
                          <span>${pricing.low.toLocaleString()} – ${pricing.high.toLocaleString()}</span>
                        </div>
                      </div>
                    </details>
                    
                    <div className="at-estimate-meta">
                      <div className="at-estimate-meta-item"><Clock className="w-4 h-4" /><div><span className="at-estimate-meta-label">Pickup Window</span><span className="at-estimate-meta-value">{timeframe === "ASAP" ? "1–2 days" : timeframe}</span></div></div>
                      <div className="at-estimate-meta-item"><MapPin className="w-4 h-4" /><div><span className="at-estimate-meta-label">Transit Time</span><span className="at-estimate-meta-value">{transitTime}</span></div></div>
                    </div>
                    <div className="at-estimate-actions">
                      <Button className="at-btn-primary at-btn-full" onClick={() => toast({ title: "Demo Estimate Generated", description: `Estimated cost: $${pricing.low.toLocaleString()} – $${pricing.high.toLocaleString()}` })}>Get Demo Estimate</Button>
                      <Button className="at-btn-reserve at-btn-full" onClick={handleReserve}>Reserve Demo Shipment<ChevronRight className="w-4 h-4" /></Button>
                    </div>
                    <p className="at-estimate-disclaimer">Demo pricing only. Final confirmed after carrier match.</p>
                  </div>
                  
                  {/* Carrier Match Preview - appears after reserve */}
                  {showCarrierMatch && (
                    <div id="carrier-match-section" className="at-carrier-match-card">
                      <div className="at-carrier-match-header">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Carrier Match Preview (Demo)</span>
                      </div>
                      
                      <div className="at-carrier-info">
                        <div className="at-carrier-name-row">
                          <Building2 className="w-5 h-5" />
                          <div>
                            <span className="at-carrier-name">Atlas Transport Group</span>
                            <span className="at-carrier-verified"><BadgeCheck className="w-3.5 h-3.5" /> Insurance Verified</span>
                          </div>
                        </div>
                        
                        <div className="at-carrier-details-grid">
                          <div className="at-carrier-detail">
                            <span className="at-carrier-detail-label">MC Number</span>
                            <span className="at-carrier-detail-value">MC-847293</span>
                          </div>
                          <div className="at-carrier-detail">
                            <span className="at-carrier-detail-label">DOT Number</span>
                            <span className="at-carrier-detail-value">3284756</span>
                          </div>
                          <div className="at-carrier-detail">
                            <span className="at-carrier-detail-label">Driver Rating</span>
                            <span className="at-carrier-detail-value at-carrier-stars">
                              <Star className="w-3.5 h-3.5" />
                              <Star className="w-3.5 h-3.5" />
                              <Star className="w-3.5 h-3.5" />
                              <Star className="w-3.5 h-3.5" />
                              <Star className="w-3.5 h-3.5" />
                              <span>4.9</span>
                            </span>
                          </div>
                          <div className="at-carrier-detail">
                            <span className="at-carrier-detail-label">Equipment</span>
                            <span className="at-carrier-detail-value">{transportType} Trailer</span>
                          </div>
                          <div className="at-carrier-detail at-carrier-detail-wide">
                            <span className="at-carrier-detail-label">Next Available Pickup</span>
                            <span className="at-carrier-detail-value at-carrier-pickup">
                              <CalendarCheck className="w-3.5 h-3.5" />
                              Feb 10, 2026
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="at-btn-secondary at-btn-full" 
                        onClick={() => setShowCarrierPacket(true)}
                      >
                        <FileText className="w-4 h-4" />
                        View Carrier Packet
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="at-wizard-footer">
              <Button variant="outline" className="at-btn-secondary" disabled={activeStep === 1} onClick={() => setActiveStep(Math.max(1, activeStep - 1))}><ChevronLeft className="w-4 h-4" />Back</Button>
              {activeStep < 3 && (<Button className="at-btn-primary" disabled={activeStep === 1 ? !canProceedStep1 : !canProceedStep2} onClick={() => setActiveStep(Math.min(3, activeStep + 1))}>Continue<ChevronRight className="w-4 h-4" /></Button>)}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* VEHICLE VIEWER */}
      <section className="at-section at-section-alt">
        <div className="at-section-header">
          <span className="at-section-label">Interactive Preview</span>
          <h2 className="at-section-title">Vehicle Profile (Demo)</h2>
          <p className="at-section-subtitle">Inspect your vehicle from every angle.</p>
        </div>

        <Card className="at-viewer-card">
          <CardContent className="at-viewer-content">
            <VehicleViewer 
              year={year} 
              make={make} 
              model={model} 
              vehicleType={vehicleType}
              transportType={transportType}
              runs={runs}
            />
          </CardContent>
        </Card>
      </section>

      {/* CONDITION REPORT */}
      <section className="at-section">
        <div className="at-section-header">
          <span className="at-section-label">Documentation</span>
          <h2 className="at-section-title">Pre-Transport Condition (Demo)</h2>
          <p className="at-section-subtitle">Record existing damage before pickup.</p>
        </div>

        <Card className="at-report-card">
          <CardContent className="at-report-content">
            <ConditionReport />
          </CardContent>
        </Card>
      </section>

      {/* SHIPMENT TRACKER */}
      <section ref={trackerRef} className={`at-section at-section-alt at-tracker-section ${showTracker ? 'is-visible' : ''}`}>
        <div className="at-section-header">
          <span className="at-section-label">Real-Time Updates</span>
          <h2 className="at-section-title">Shipment Tracker (Demo)</h2>
          <p className="at-section-subtitle">Know exactly where your vehicle is at every step.</p>
        </div>

        <Card className="at-tracker-card">
          <CardContent className="at-tracker-content">
            <div className="at-tracker-layout-full">
              {/* Map */}
              <div className="at-tracker-map-panel">
                <ShipmentTrackerMap isTracking={isTracking} />
                {!isTracking && showTracker && (
                  <Button className="at-btn-start-tracking" onClick={startDemoTracking}>
                    <Navigation className="w-4 h-4" />
                    Start Demo Tracking
                  </Button>
                )}
              </div>

              {/* Info Panel - Tesla Style */}
              <div className="at-tracker-info-panel">
                {/* Tesla-Style Timeline */}
                <div className="at-tesla-timeline">
                  <div className="at-tesla-timeline-header">
                    <span className="at-tesla-timeline-label">Delivery Progress</span>
                    {showTracker && isTracking && (
                      <span className="at-tesla-timeline-active">
                        <span className="at-tesla-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                  
                  <div className="at-tesla-steps">
                    {[
                      { step: "Booked", tag: "Confirmed", complete: true },
                      { step: "Carrier Assigned", tag: "Confirmed", complete: true },
                      { step: "Pickup Scheduled", tag: "Scheduled", complete: true },
                      { step: "In Transit", tag: "In Progress", complete: false, active: true },
                      { step: "Delivered", tag: "Pending", complete: false },
                    ].map((item, idx, arr) => {
                      const isComplete = showTracker && item.complete;
                      const isActive = showTracker && isTracking && item.active;
                      const progressWidth = showTracker ? (isComplete ? 100 : isActive ? 45 : 0) : 0;
                      
                      return (
                        <div key={item.step} className="at-tesla-step-wrapper">
                          <div className={`at-tesla-step ${isComplete ? 'is-complete' : ''} ${isActive ? 'is-active' : ''}`}>
                            <div className="at-tesla-step-indicator">
                              {isComplete ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <div className="at-tesla-step-dot" />
                              )}
                            </div>
                            <div className="at-tesla-step-content">
                              <span className="at-tesla-step-name">{item.step}</span>
                              <span className={`at-tesla-step-tag ${isActive ? 'is-active' : isComplete ? 'is-complete' : ''}`}>
                                {item.tag}
                              </span>
                            </div>
                          </div>
                          
                          {idx < arr.length - 1 && (
                            <div className="at-tesla-step-connector">
                              <div 
                                className="at-tesla-step-progress" 
                                style={{ height: `${progressWidth}%` }} 
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Driver Info Card */}
                {showTracker && (
                  <div className="at-driver-card">
                    <div className="at-driver-header">
                      <User className="w-4 h-4" />
                      <span>Driver Information (Demo)</span>
                    </div>
                    
                    <div className="at-driver-info">
                      <div className="at-driver-avatar">
                        <div className="at-driver-avatar-placeholder">
                          <User className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="at-driver-details">
                        <span className="at-driver-name">Marcus Thompson</span>
                        <span className="at-driver-id">Driver ID: ATG-2847</span>
                      </div>
                    </div>
                    
                    <div className="at-driver-stats">
                      <div className="at-driver-stat">
                        <span className="at-driver-stat-label">Current Location</span>
                        <span className="at-driver-stat-value">
                          <MapPin className="w-3.5 h-3.5" />
                          {isTracking ? "Savannah, GA" : "—"}
                        </span>
                      </div>
                      <div className="at-driver-stat">
                        <span className="at-driver-stat-label">Next Checkpoint</span>
                        <span className="at-driver-stat-value">
                          <Clock className="w-3.5 h-3.5" />
                          {isTracking ? "Richmond, VA • 6:30 PM" : "—"}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      className="at-btn-secondary at-btn-full at-driver-contact-btn" 
                      onClick={() => setShowDriverContact(true)}
                      disabled={!isTracking}
                    >
                      <PhoneCall className="w-4 h-4" />
                      Contact Driver
                    </Button>
                  </div>
                )}
                
                {/* ETA Summary */}
                <div className="at-tracker-eta-panel">
                  <div className="at-tracker-eta-row">
                    <span className="at-tracker-eta-label">ETA Window</span>
                    <span className="at-tracker-eta-value">{showTracker ? "Feb 14–15, 2026" : "—"}</span>
                  </div>
                  <div className="at-tracker-eta-row">
                    <span className="at-tracker-eta-label">Last Update</span>
                    <span className="at-tracker-eta-value">{isTracking ? "Feb 10, 3:45 PM" : "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* HOW IT WORKS + FAQ */}
      <section className="at-section">
        <div className="at-dual-layout">
          <div className="at-how-it-works">
            <div className="at-section-header at-section-header-left">
              <span className="at-section-label">Process</span>
              <h2 className="at-section-title">How It Works</h2>
            </div>
            <div className="at-steps-list">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="at-step-item">
                  <div className="at-step-num">{item.step}</div>
                  <div className="at-step-text"><h3>{item.title}</h3><p>{item.description}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="at-faq">
            <div className="at-section-header at-section-header-left">
              <span className="at-section-label">Questions</span>
              <h2 className="at-section-title">FAQ</h2>
            </div>
            <Accordion type="single" collapsible className="at-faq-list">
              {FAQ_ITEMS.map((item, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="at-faq-item">
                  <AccordionTrigger className="at-faq-trigger">{item.question}</AccordionTrigger>
                  <AccordionContent className="at-faq-content">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="at-cta-section">
        <div className="at-cta-content">
          <h2 className="at-cta-headline">Ready to Ship Your Vehicle?</h2>
          <p className="at-cta-subheadline">Get a free quote in under 60 seconds. No obligation.</p>
          <div className="at-cta-buttons">
            <Button className="at-btn-primary" size="lg">Get Your Quote<ChevronRight className="w-4 h-4" /></Button>
            <Button variant="outline" className="at-btn-secondary" size="lg"><Calendar className="w-4 h-4" />Schedule a Call</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
