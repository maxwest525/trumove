import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Car, Truck, ChevronRight, ChevronLeft, Phone, Clock, MapPin,
  CheckCircle2, Sparkles, ChevronDown
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
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from "@/lib/mapboxToken";

// ═══════════════════════════════════════════════════════════════════
// DATA & PRICING
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
const CITIES = ["Miami, FL", "Orlando, FL", "Atlanta, GA", "Dallas, TX", "Los Angeles, CA", "New York, NY"];
const TRANSPORT_TYPES = ["Open", "Enclosed"];

const ROUTE_PRICES: Record<string, Record<string, number>> = {
  "Miami, FL": { "Orlando, FL": 350, "Atlanta, GA": 550, "Dallas, TX": 1100, "Los Angeles, CA": 1450, "New York, NY": 1250 },
  "Orlando, FL": { "Miami, FL": 350, "Atlanta, GA": 450, "Dallas, TX": 950, "Los Angeles, CA": 1400, "New York, NY": 1150 },
  "Atlanta, GA": { "Miami, FL": 550, "Orlando, FL": 450, "Dallas, TX": 750, "Los Angeles, CA": 1350, "New York, NY": 850 },
  "Dallas, TX": { "Miami, FL": 1100, "Orlando, FL": 950, "Atlanta, GA": 750, "Los Angeles, CA": 950, "New York, NY": 1400 },
  "Los Angeles, CA": { "Miami, FL": 1450, "Orlando, FL": 1400, "Atlanta, GA": 1350, "Dallas, TX": 950, "New York, NY": 1650 },
  "New York, NY": { "Miami, FL": 1250, "Orlando, FL": 1150, "Atlanta, GA": 850, "Dallas, TX": 1400, "Los Angeles, CA": 1650 },
};

function calculatePrice(from: string, to: string, transportType: string) {
  let base = ROUTE_PRICES[from]?.[to] || 800;
  if (transportType === "Enclosed") base *= 1.35;
  base = Math.round(base / 25) * 25;
  const low = Math.round((base * 0.92) / 25) * 25;
  const high = Math.round((base * 1.08) / 25) * 25;
  return { low, high };
}

function getTransitDays(from: string, to: string): string {
  const price = ROUTE_PRICES[from]?.[to] || 800;
  if (price < 500) return "2–3";
  if (price < 1000) return "4–6";
  return "7–10";
}

const FAQ_ITEMS = [
  { q: "How long does transport take?", a: "Transit times vary by distance. Cross-country is typically 7-10 days, regional moves 3-5 days." },
  { q: "Is my vehicle insured?", a: "Yes, all vehicles are covered by carrier insurance during transport." },
  { q: "Can you ship non-running vehicles?", a: "Absolutely. Additional equipment fees may apply for inoperable vehicles." },
  { q: "Open vs enclosed transport?", a: "Open is cost-effective for most vehicles. Enclosed provides weather protection for luxury or classic cars." },
];

// ═══════════════════════════════════════════════════════════════════
// TRACKER MAP
// ═══════════════════════════════════════════════════════════════════

function TrackerMap({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const animRef = useRef<number>();
  const [coords, setCoords] = useState<[number, number][]>([]);
  
  const miami: [number, number] = [-80.1918, 25.7617];
  const ny: [number, number] = [-74.006, 40.7128];
  
  useEffect(() => {
    if (!active) return;
    const fetchRoute = async () => {
      const waypoints = [miami, [-81.3792, 28.5383], [-84.388, 33.749], [-77.0369, 38.9072], ny];
      const str = waypoints.map(p => `${p[0]},${p[1]}`).join(';');
      try {
        const res = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${str}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`);
        const data = await res.json();
        if (data.routes?.[0]) setCoords(data.routes[0].geometry.coordinates);
      } catch { setCoords([miami, ny]); }
    };
    fetchRoute();
  }, [active]);
  
  const getPoint = useCallback((p: number): [number, number] => {
    if (coords.length < 2) return coords[0] || miami;
    const n = coords.length - 1;
    const sp = p * n;
    const i = Math.min(Math.floor(sp), n - 1);
    const t = sp - i;
    const s = coords[i], e = coords[Math.min(i + 1, coords.length - 1)];
    return [s[0] + (e[0] - s[0]) * t, s[1] + (e[1] - s[1]) * t];
  }, [coords]);
  
  useEffect(() => {
    if (!containerRef.current || mapRef.current || coords.length < 2 || !active) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-84.388, 33.749],
      zoom: 4.5,
      interactive: true,
      attributionControl: false
    });
    
    mapRef.current.on('load', () => {
      if (!mapRef.current) return;
      mapRef.current.addSource('route', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } } });
      mapRef.current.addLayer({ id: 'route-line', type: 'line', source: 'route', paint: { 'line-color': '#1a1a1a', 'line-width': 2, 'line-opacity': 0.6 } });
      
      const bounds = new mapboxgl.LngLatBounds();
      coords.forEach(c => bounds.extend(c));
      mapRef.current.fitBounds(bounds, { padding: 40 });
      
      let progress = 0.45;
      const animate = () => {
        if (!mapRef.current) return;
        progress += 0.0001;
        if (progress > 1) progress = 0;
        const pos = getPoint(progress);
        const src = mapRef.current.getSource('truck') as mapboxgl.GeoJSONSource;
        if (src) src.setData({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: pos } });
        animRef.current = requestAnimationFrame(animate);
      };
      
      mapRef.current.addSource('truck', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: getPoint(0.45) } } });
      mapRef.current.addLayer({ id: 'truck-marker', type: 'circle', source: 'truck', paint: { 'circle-radius': 6, 'circle-color': '#1a1a1a', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' } });
      mapRef.current.addSource('origin', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: miami } } });
      mapRef.current.addLayer({ id: 'origin', type: 'circle', source: 'origin', paint: { 'circle-radius': 5, 'circle-color': '#16a34a', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' } });
      mapRef.current.addSource('dest', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: ny } } });
      mapRef.current.addLayer({ id: 'dest', type: 'circle', source: 'dest', paint: { 'circle-radius': 5, 'circle-color': '#dc2626', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' } });
      animate();
    });
    
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [coords, active, getPoint]);
  
  return (
    <div className="at-map-wrap">
      <div ref={containerRef} className="at-map" />
      {!active && (
        <div className="at-map-placeholder">
          <Truck className="w-8 h-8 text-neutral-300" />
          <span>Demo tracking will appear here</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════

export default function AutoTransport() {
  const { toast } = useToast();
  
  // Wizard
  const [step, setStep] = useState(1);
  const [year, setYear] = useState("2024");
  const [make, setMake] = useState("Tesla");
  const [model, setModel] = useState("Model Y");
  const [fromCity, setFromCity] = useState("Miami, FL");
  const [toCity, setToCity] = useState("New York, NY");
  const [transport, setTransport] = useState("Open");
  
  // Tracking demo
  const [booked, setBooked] = useState(false);
  const [tracking, setTracking] = useState(false);
  
  const models = MODELS[make] || [];
  const pricing = calculatePrice(fromCity, toCity, transport);
  const days = getTransitDays(fromCity, toCity);
  
  const handleMake = (m: string) => { setMake(m); setModel(MODELS[m]?.[0] || ""); };
  
  const canNext1 = year && make && model;
  const canNext2 = fromCity && toCity && fromCity !== toCity;
  
  const reserve = () => {
    setBooked(true);
    toast({ title: "Shipment Reserved", description: `${year} ${make} ${model} transport confirmed.` });
  };
  
  const startTracking = () => {
    setTracking(true);
    toast({ title: "Tracking Started", description: "Watch the demo truck move along the route." });
  };

  return (
    <div className="at-page">
      {/* HERO */}
      <section className="at-hero">
        <div className="at-hero-inner">
          <h1 className="at-hero-title">Ship Your Vehicle</h1>
          <p className="at-hero-sub">Transparent pricing. Real-time tracking. Nationwide coverage.</p>
          <div className="at-hero-actions">
            <Button className="at-btn" size="lg">Get Quote <ChevronRight className="w-4 h-4" /></Button>
            <Button variant="outline" className="at-btn-outline" size="lg"><Phone className="w-4 h-4" /> Call Us</Button>
          </div>
        </div>
      </section>

      {/* WIZARD */}
      <section className="at-section">
        <Card className="at-card">
          <CardContent className="at-card-inner">
            {/* Steps */}
            <div className="at-steps">
              {["Vehicle", "Route", "Review"].map((label, i) => (
                <button
                  key={label}
                  className={`at-step ${step > i ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}
                  onClick={() => i + 1 < step && setStep(i + 1)}
                  disabled={i + 1 > step}
                >
                  <span className="at-step-num">{i + 1}</span>
                  <span className="at-step-label">{label}</span>
                </button>
              ))}
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div className="at-form">
                <div className="at-form-row">
                  <label>Year</label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="at-select"><SelectValue /></SelectTrigger>
                    <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="at-form-row">
                  <label>Make</label>
                  <Select value={make} onValueChange={handleMake}>
                    <SelectTrigger className="at-select"><SelectValue /></SelectTrigger>
                    <SelectContent>{MAKES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="at-form-row">
                  <label>Model</label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="at-select"><SelectValue /></SelectTrigger>
                    <SelectContent>{models.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="at-form">
                <div className="at-form-row">
                  <label>Pickup</label>
                  <Select value={fromCity} onValueChange={setFromCity}>
                    <SelectTrigger className="at-select"><SelectValue /></SelectTrigger>
                    <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c} disabled={c === toCity}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="at-form-row">
                  <label>Delivery</label>
                  <Select value={toCity} onValueChange={setToCity}>
                    <SelectTrigger className="at-select"><SelectValue /></SelectTrigger>
                    <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c} disabled={c === fromCity}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="at-form-row">
                  <label>Transport</label>
                  <Select value={transport} onValueChange={setTransport}>
                    <SelectTrigger className="at-select"><SelectValue /></SelectTrigger>
                    <SelectContent>{TRANSPORT_TYPES.map(t => <SelectItem key={t} value={t}>{t}{t === "Enclosed" && " (+35%)"}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="at-review">
                <div className="at-review-vehicle">
                  <Car className="w-6 h-6" />
                  <div>
                    <span className="at-review-title">{year} {make} {model}</span>
                    <span className="at-review-meta">{transport} Transport</span>
                  </div>
                </div>
                
                <div className="at-review-route">
                  <div className="at-review-point"><span className="at-dot origin" />{fromCity}</div>
                  <div className="at-review-line" />
                  <div className="at-review-point"><span className="at-dot dest" />{toCity}</div>
                </div>
                
                <div className="at-estimate">
                  <div className="at-estimate-header">
                    <Sparkles className="w-4 h-4" />
                    <span>Estimate</span>
                  </div>
                  <div className="at-estimate-price">${pricing.low.toLocaleString()} – ${pricing.high.toLocaleString()}</div>
                  <div className="at-estimate-meta">
                    <span><Clock className="w-3.5 h-3.5" /> {days} days transit</span>
                    <span><MapPin className="w-3.5 h-3.5" /> Door-to-door</span>
                  </div>
                </div>
                
                <Button className="at-btn at-btn-full" onClick={reserve}>Reserve Shipment</Button>
              </div>
            )}

            {/* Footer */}
            <div className="at-wizard-footer">
              <Button variant="outline" className="at-btn-outline" disabled={step === 1} onClick={() => setStep(step - 1)}>
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              {step < 3 && (
                <Button className="at-btn" disabled={step === 1 ? !canNext1 : !canNext2} onClick={() => setStep(step + 1)}>
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* TRACKER */}
      {booked && (
        <section className="at-section">
          <div className="at-section-title">Track Shipment</div>
          <Card className="at-card">
            <CardContent className="at-card-inner at-tracker">
              <TrackerMap active={tracking} />
              
              <div className="at-tracker-panel">
                <div className="at-tracker-status">
                  <div className="at-status-item done"><CheckCircle2 className="w-4 h-4" /> Booked</div>
                  <div className="at-status-item done"><CheckCircle2 className="w-4 h-4" /> Carrier Assigned</div>
                  <div className={`at-status-item ${tracking ? 'active' : ''}`}>
                    <div className="at-status-dot" /> In Transit
                  </div>
                  <div className="at-status-item"><div className="at-status-dot" /> Delivered</div>
                </div>
                
                <div className="at-tracker-info">
                  <div className="at-info-row"><span>ETA</span><span>Feb 14–15, 2026</span></div>
                  <div className="at-info-row"><span>Status</span><span>{tracking ? "In Transit" : "Awaiting Pickup"}</span></div>
                </div>
                
                {!tracking && (
                  <Button className="at-btn at-btn-full" onClick={startTracking}>
                    Start Demo Tracking
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="at-section">
        <div className="at-section-title">How It Works</div>
        <div className="at-steps-grid">
          {[
            { n: 1, t: "Get a Quote", d: "Enter your vehicle and route for an instant estimate." },
            { n: 2, t: "Book & Schedule", d: "Choose your pickup date and confirm transport." },
            { n: 3, t: "Pickup", d: "We collect your vehicle with a condition report." },
            { n: 4, t: "Track & Receive", d: "Monitor your shipment and receive your vehicle." },
          ].map(s => (
            <div key={s.n} className="at-step-card">
              <span className="at-step-n">{s.n}</span>
              <span className="at-step-t">{s.t}</span>
              <span className="at-step-d">{s.d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="at-section">
        <div className="at-section-title">FAQ</div>
        <Accordion type="single" collapsible className="at-faq">
          {FAQ_ITEMS.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="at-faq-item">
              <AccordionTrigger className="at-faq-q">{f.q}</AccordionTrigger>
              <AccordionContent className="at-faq-a">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Footer />
    </div>
  );
}
