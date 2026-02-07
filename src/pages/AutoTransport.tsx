import { useState, useRef } from "react";
import { 
  Car, Truck, Shield, Clock, MapPin, CheckCircle2, 
  ChevronRight, ChevronLeft, Phone, Calendar,
  Package, Eye, FileText, Navigation, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/layout/Footer";

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

// Base route prices (origin → destination)
const ROUTE_PRICES: Record<string, Record<string, number>> = {
  "Miami, FL": {
    "Orlando, FL": 350,
    "Atlanta, GA": 550,
    "Dallas, TX": 1100,
    "Los Angeles, CA": 1450,
    "New York, NY": 1250,
  },
  "Orlando, FL": {
    "Miami, FL": 350,
    "Atlanta, GA": 450,
    "Dallas, TX": 950,
    "Los Angeles, CA": 1400,
    "New York, NY": 1150,
  },
  "Atlanta, GA": {
    "Miami, FL": 550,
    "Orlando, FL": 450,
    "Dallas, TX": 750,
    "Los Angeles, CA": 1350,
    "New York, NY": 850,
  },
  "Dallas, TX": {
    "Miami, FL": 1100,
    "Orlando, FL": 950,
    "Atlanta, GA": 750,
    "Los Angeles, CA": 950,
    "New York, NY": 1400,
  },
  "Los Angeles, CA": {
    "Miami, FL": 1450,
    "Orlando, FL": 1400,
    "Atlanta, GA": 1350,
    "Dallas, TX": 950,
    "New York, NY": 1650,
  },
  "New York, NY": {
    "Miami, FL": 1250,
    "Orlando, FL": 1150,
    "Atlanta, GA": 850,
    "Dallas, TX": 1400,
    "Los Angeles, CA": 1650,
  },
};

// Transit times by route distance tier
const TRANSIT_TIMES: Record<string, string> = {
  short: "2–3 days",
  medium: "4–6 days",
  long: "7–10 days",
};

function getTransitTime(from: string, to: string): string {
  const price = ROUTE_PRICES[from]?.[to] || 800;
  if (price < 500) return TRANSIT_TIMES.short;
  if (price < 1000) return TRANSIT_TIMES.medium;
  return TRANSIT_TIMES.long;
}

function calculateDemoPrice(
  from: string,
  to: string,
  vehicleType: string,
  transportType: string,
  runs: string,
  size: string
): { low: number; high: number; base: number } {
  // Get base price
  let base = ROUTE_PRICES[from]?.[to] || 800;
  
  // Apply modifiers
  if (transportType === "Enclosed") base *= 1.35;
  if (runs === "Does not run") base *= 1.20;
  if (size === "Oversize") base *= 1.20;
  if (vehicleType === "Truck") base *= 1.10;
  else if (vehicleType === "SUV") base *= 1.05;
  
  // Round to nearest 25
  base = Math.round(base / 25) * 25;
  
  // Create range (+/- 8%)
  const low = Math.round((base * 0.92) / 25) * 25;
  const high = Math.round((base * 1.08) / 25) * 25;
  
  return { low, high, base };
}

// ═══════════════════════════════════════════════════════════════════
// TRUST & HOW IT WORKS DATA
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
  {
    question: "How long does auto transport take?",
    answer: "Transit times vary based on distance. Cross-country shipments typically take 7-10 days, while regional moves are often completed in 3-5 days."
  },
  {
    question: "Is my vehicle insured during transport?",
    answer: "Yes, all vehicles are covered by carrier insurance during transport. We also offer supplemental coverage options for additional peace of mind."
  },
  {
    question: "Can I ship a non-running vehicle?",
    answer: "Absolutely. We transport non-running, inoperable, and project vehicles. Additional equipment fees may apply."
  },
  {
    question: "What's the difference between open and enclosed transport?",
    answer: "Open transport is cost-effective and suitable for most vehicles. Enclosed transport provides weather and debris protection, ideal for luxury, classic, or high-value vehicles."
  },
];

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function AutoTransport() {
  const { toast } = useToast();
  const trackerRef = useRef<HTMLDivElement>(null);
  
  // Wizard step
  const [activeStep, setActiveStep] = useState(1);
  
  // Tracker visibility
  const [showTracker, setShowTracker] = useState(false);
  
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
  
  // Calculate demo price
  const pricing = calculateDemoPrice(fromCity, toCity, vehicleType, transportType, runs, size);
  const transitTime = getTransitTime(fromCity, toCity);
  
  // Get available models for selected make
  const availableModels = MODELS[make] || [];
  
  // Handle make change - reset model
  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    setModel(MODELS[newMake]?.[0] || "");
  };
  
  // Handle reserve shipment
  const handleReserve = () => {
    setShowTracker(true);
    toast({
      title: "Demo Shipment Reserved!",
      description: `Your ${year} ${make} ${model} transport from ${fromCity} to ${toCity} has been scheduled.`,
    });
    
    // Scroll to tracker
    setTimeout(() => {
      trackerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };
  
  // Step validation
  const canProceedStep1 = year && make && model && vehicleType && runs && size;
  const canProceedStep2 = fromCity && toCity && fromCity !== toCity && timeframe && transportType;

  return (
    <div className="auto-transport-page">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="at-hero">
        <div className="at-hero-content">
          <h1 className="at-hero-headline">
            Vehicle Transport,<br />
            <span className="at-hero-headline-accent">Simplified.</span>
          </h1>
          <p className="at-hero-subheadline">
            Coast-to-coast auto shipping with real-time tracking, 
            transparent pricing, and white-glove service.
          </p>
          
          <div className="at-hero-ctas">
            <Button className="at-btn-primary" size="lg">
              Get Instant Quote
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="at-btn-secondary" size="lg">
              <Phone className="w-4 h-4" />
              Speak to an Expert
            </Button>
          </div>

          {/* Trust Strip */}
          <div className="at-trust-strip">
            {TRUST_ITEMS.map((item, idx) => (
              <div key={item.label} className="at-trust-item">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {idx < TRUST_ITEMS.length - 1 && <span className="at-trust-dot">•</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DEMO QUOTE WIZARD SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="at-section">
        <div className="at-section-header">
          <span className="at-section-label">Instant Pricing</span>
          <h2 className="at-section-title">Get Your Quote</h2>
          <p className="at-section-subtitle">
            Enter your details for a transparent, all-inclusive estimate.
          </p>
        </div>

        <Card className="at-wizard-card">
          <CardContent className="at-wizard-content">
            {/* Progress Indicator */}
            <div className="at-wizard-progress">
              <div 
                className="at-wizard-progress-bar" 
                style={{ width: `${(activeStep / 3) * 100}%` }} 
              />
            </div>
            
            {/* Step Indicators */}
            <div className="at-wizard-steps">
              {[
                { num: 1, label: "Vehicle" },
                { num: 2, label: "Route" },
                { num: 3, label: "Review" },
              ].map((step) => (
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

            {/* Step 1: Vehicle */}
            {activeStep === 1 && (
              <div className="at-wizard-body">
                <div className="at-wizard-form">
                  <h3 className="at-wizard-form-title">Vehicle Details</h3>
                  
                  <div className="at-form-grid">
                    {/* Year */}
                    <div className="at-form-field">
                      <label className="at-form-label">Year</label>
                      <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="at-select-trigger">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="at-select-content">
                          {YEARS.map((y) => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Make */}
                    <div className="at-form-field">
                      <label className="at-form-label">Make</label>
                      <Select value={make} onValueChange={handleMakeChange}>
                        <SelectTrigger className="at-select-trigger">
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent className="at-select-content">
                          {MAKES.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Model */}
                    <div className="at-form-field">
                      <label className="at-form-label">Model</label>
                      <Select value={model} onValueChange={setModel}>
                        <SelectTrigger className="at-select-trigger">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent className="at-select-content">
                          {availableModels.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Vehicle Type */}
                    <div className="at-form-field">
                      <label className="at-form-label">Vehicle Type</label>
                      <Select value={vehicleType} onValueChange={setVehicleType}>
                        <SelectTrigger className="at-select-trigger">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="at-select-content">
                          {VEHICLE_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Runs */}
                    <div className="at-form-field">
                      <label className="at-form-label">Condition</label>
                      <Select value={runs} onValueChange={setRuns}>
                        <SelectTrigger className="at-select-trigger">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent className="at-select-content">
                          {RUNS_OPTIONS.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Size */}
                    <div className="at-form-field">
                      <label className="at-form-label">Size</label>
                      <Select value={size} onValueChange={setSize}>
                        <SelectTrigger className="at-select-trigger">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent className="at-select-content">
                          {SIZE_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Route */}
            {activeStep === 2 && (
              <div className="at-wizard-body">
                <div className="at-wizard-form">
                  <h3 className="at-wizard-form-title">Route & Options</h3>
                  
                  <div className="at-form-grid at-form-grid-2">
                    {/* From */}
                    <div className="at-form-field">
                      <label className="at-form-label">Pickup Location</label>
                      <Select value={fromCity} onValueChange={setFromCity}>
                        <SelectTrigger className="at-select-trigger">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent className="at-select-content">
                          {CITIES.map((c) => (
                            <SelectItem key={c} value={c} disabled={c === toCity}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* To */}
                    <div className="at-form-field">
                      <label className="at-form-label">Delivery Location</label>
                      <Select value={toCity} onValueChange={setToCity}>
                        <SelectTrigger className="at-select-trigger">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent className="at-select-content">
                          {CITIES.map((c) => (
                            <SelectItem key={c} value={c} disabled={c === fromCity}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Timeframe */}
                    <div className="at-form-field">
                      <label className="at-form-label">Pickup Timeframe</label>
                      <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger className="at-select-trigger">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent className="at-select-content">
                          {TIMEFRAMES.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Transport Type */}
                    <div className="at-form-field">
                      <label className="at-form-label">Transport Type</label>
                      <Select value={transportType} onValueChange={setTransportType}>
                        <SelectTrigger className="at-select-trigger">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="at-select-content">
                          {TRANSPORT_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t} {t === "Enclosed" && <span className="at-select-badge">+35%</span>}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {activeStep === 3 && (
              <div className="at-wizard-body">
                <div className="at-review-layout">
                  {/* Vehicle Summary */}
                  <div className="at-review-summary">
                    <h3 className="at-wizard-form-title">Your Vehicle</h3>
                    <div className="at-review-vehicle">
                      <Car className="w-8 h-8" />
                      <div>
                        <span className="at-review-vehicle-name">{year} {make} {model}</span>
                        <span className="at-review-vehicle-meta">
                          {vehicleType} • {runs} • {size}
                        </span>
                      </div>
                    </div>
                    
                    <div className="at-review-route">
                      <div className="at-review-route-point">
                        <span className="at-review-route-dot at-review-route-dot-origin" />
                        <span>{fromCity}</span>
                      </div>
                      <div className="at-review-route-line" />
                      <div className="at-review-route-point">
                        <span className="at-review-route-dot at-review-route-dot-dest" />
                        <span>{toCity}</span>
                      </div>
                    </div>
                    
                    <div className="at-review-details">
                      <div className="at-review-detail">
                        <span>Transport</span>
                        <span>{transportType}</span>
                      </div>
                      <div className="at-review-detail">
                        <span>Timeframe</span>
                        <span>{timeframe}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Demo Estimate Card */}
                  <div className="at-estimate-card">
                    <div className="at-estimate-header">
                      <Sparkles className="w-5 h-5" />
                      <span>Demo Estimate</span>
                    </div>
                    
                    <div className="at-estimate-price">
                      <span className="at-estimate-price-label">Estimated Price</span>
                      <span className="at-estimate-price-value">
                        ${pricing.low.toLocaleString()} – ${pricing.high.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="at-estimate-meta">
                      <div className="at-estimate-meta-item">
                        <Clock className="w-4 h-4" />
                        <div>
                          <span className="at-estimate-meta-label">Pickup Window</span>
                          <span className="at-estimate-meta-value">
                            {timeframe === "ASAP" ? "1–2 days" : timeframe}
                          </span>
                        </div>
                      </div>
                      <div className="at-estimate-meta-item">
                        <MapPin className="w-4 h-4" />
                        <div>
                          <span className="at-estimate-meta-label">Transit Time</span>
                          <span className="at-estimate-meta-value">{transitTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="at-estimate-actions">
                      <Button 
                        className="at-btn-primary at-btn-full"
                        onClick={() => {
                          toast({
                            title: "Demo Estimate Generated",
                            description: `Estimated cost: $${pricing.low.toLocaleString()} – $${pricing.high.toLocaleString()}`,
                          });
                        }}
                      >
                        Get Demo Estimate
                      </Button>
                      <Button 
                        className="at-btn-reserve at-btn-full"
                        onClick={handleReserve}
                      >
                        Reserve Demo Shipment
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <p className="at-estimate-disclaimer">
                      Demo pricing only. Final confirmed after carrier match.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="at-wizard-footer">
              <Button 
                variant="outline" 
                className="at-btn-secondary"
                disabled={activeStep === 1}
                onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              
              {activeStep < 3 && (
                <Button 
                  className="at-btn-primary"
                  disabled={activeStep === 1 ? !canProceedStep1 : !canProceedStep2}
                  onClick={() => setActiveStep(Math.min(3, activeStep + 1))}
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          VEHICLE VIEWER SECTION (3D Spin Demo)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="at-section at-section-alt">
        <div className="at-section-header">
          <span className="at-section-label">Interactive Preview</span>
          <h2 className="at-section-title">Vehicle Viewer</h2>
          <p className="at-section-subtitle">
            Inspect your vehicle from every angle with our 360° viewer.
          </p>
        </div>

        <Card className="at-viewer-card">
          <CardContent className="at-viewer-content">
            <div className="at-viewer-placeholder">
              <Car className="w-12 h-12" />
              <p>3D Vehicle Spin Demo</p>
              <span>Drag to rotate • Scroll to zoom</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CONDITION REPORT SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="at-section">
        <div className="at-section-header">
          <span className="at-section-label">Documentation</span>
          <h2 className="at-section-title">Condition Report</h2>
          <p className="at-section-subtitle">
            Comprehensive photo documentation before and after transport.
          </p>
        </div>

        <Card className="at-report-card">
          <CardContent className="at-report-content">
            <div className="at-report-grid">
              <div className="at-report-panel">
                <div className="at-report-panel-header">
                  <Eye className="w-5 h-5" />
                  <span>Pickup Inspection</span>
                </div>
                <div className="at-report-placeholder">
                  <FileText className="w-8 h-8" />
                  <p>Pre-transport photos & notes</p>
                </div>
              </div>
              <div className="at-report-panel">
                <div className="at-report-panel-header">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Delivery Inspection</span>
                </div>
                <div className="at-report-placeholder">
                  <FileText className="w-8 h-8" />
                  <p>Post-transport verification</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SHIPMENT TRACKER SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        ref={trackerRef}
        className={`at-section at-section-alt at-tracker-section ${showTracker ? 'is-visible' : ''}`}
      >
        <div className="at-section-header">
          <span className="at-section-label">Real-Time Updates</span>
          <h2 className="at-section-title">Shipment Tracker</h2>
          <p className="at-section-subtitle">
            Know exactly where your vehicle is at every step of the journey.
          </p>
        </div>

        <Card className="at-tracker-card">
          <CardContent className="at-tracker-content">
            <div className="at-tracker-layout">
              {/* Map Placeholder */}
              <div className="at-tracker-map">
                <div className="at-tracker-map-placeholder">
                  <Navigation className="w-10 h-10" />
                  <p>Live GPS Tracking Map</p>
                  {showTracker && (
                    <span className="at-tracker-active-badge">
                      <span className="at-tracker-active-dot" />
                      Demo Active
                    </span>
                  )}
                </div>
              </div>

              {/* ETA Timeline */}
              <div className="at-tracker-timeline">
                <div className="at-tracker-eta">
                  <span className="at-tracker-eta-label">Estimated Arrival</span>
                  <span className="at-tracker-eta-value">
                    {showTracker ? "Feb 14, 2026" : "—"}
                  </span>
                </div>
                <div className="at-tracker-steps">
                  {[
                    { label: 'Pickup Confirmed', complete: showTracker },
                    { label: 'In Transit', active: showTracker },
                    { label: 'Nearing Destination', complete: false },
                    { label: 'Delivered', complete: false },
                  ].map((step, idx) => (
                    <div 
                      key={step.label} 
                      className={`at-tracker-step ${step.complete ? 'is-complete' : ''} ${step.active ? 'is-active' : ''}`}
                    >
                      <div className="at-tracker-step-dot" />
                      <span>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          HOW IT WORKS + FAQ SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="at-section">
        <div className="at-dual-layout">
          {/* How It Works */}
          <div className="at-how-it-works">
            <div className="at-section-header at-section-header-left">
              <span className="at-section-label">Process</span>
              <h2 className="at-section-title">How It Works</h2>
            </div>
            <div className="at-steps-list">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="at-step-item">
                  <div className="at-step-num">{item.step}</div>
                  <div className="at-step-text">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="at-faq">
            <div className="at-section-header at-section-header-left">
              <span className="at-section-label">Questions</span>
              <h2 className="at-section-title">FAQ</h2>
            </div>
            <Accordion type="single" collapsible className="at-faq-list">
              {FAQ_ITEMS.map((item, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="at-faq-item">
                  <AccordionTrigger className="at-faq-trigger">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="at-faq-content">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="at-cta-section">
        <div className="at-cta-content">
          <h2 className="at-cta-headline">Ready to Ship Your Vehicle?</h2>
          <p className="at-cta-subheadline">
            Get a free quote in under 60 seconds. No obligation.
          </p>
          <div className="at-cta-buttons">
            <Button className="at-btn-primary" size="lg">
              Get Your Quote
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="at-btn-secondary" size="lg">
              <Calendar className="w-4 h-4" />
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
