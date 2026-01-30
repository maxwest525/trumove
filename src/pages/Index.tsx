import { useState, useCallback, useMemo, useRef, useEffect } from "react";

// Scroll to top on mount
const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import SiteShell from "@/components/layout/SiteShell";
import MapboxMoveMap from "@/components/MapboxMoveMap";
import AnimatedRouteMap from "@/components/estimate/AnimatedRouteMap";
import FloatingNav from "@/components/FloatingNav";
import HeroParticles from "@/components/HeroParticles";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import RouteAnalysisSection from "@/components/RouteAnalysisSection";
import StatsStrip from "@/components/StatsStrip";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallax } from "@/hooks/useParallax";
import logoImg from "@/assets/logo.png";

// Preview images for value cards
import previewAiScanner from "@/assets/preview-ai-scanner.jpg";
import previewCarrierVetting from "@/assets/preview-carrier-vetting.jpg";
import trudyVideoCall from "@/assets/trudy-video-call.jpg";
import previewPropertyLookup from "@/assets/preview-property-lookup.jpg";
import sampleRoomLiving from "@/assets/sample-room-living.jpg";
import scanRoomPreview from "@/assets/scan-room-preview.jpg";
import heroFamilyMove from "@/assets/hero-family-move.jpg";
import trudyAvatar from "@/assets/trudy-model.jpg";

import ChatModal from "@/components/chat/ChatModal";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";

import { calculateDistance } from "@/lib/distanceCalculator";
import { calculateEstimate, formatCurrency } from "@/lib/priceCalculator";
import { 
  Shield, Video, Boxes, CheckCircle, Info,
  MapPin, Route, Clock, DollarSign, Headphones, Phone, ArrowRight, ArrowDown,
  CalendarIcon, ChevronLeft, Lock, Truck, Sparkles, Star, Users,
  Database, ChevronRight, Radar, CreditCard, ShieldCheck, BarChart3, Zap,
  Home, Building2, MoveVertical, ArrowUpDown, Scan, ChevronUp, ChevronDown, Camera, Globe,
  Play, Pause, MapPinned, Calendar
} from "lucide-react";


// ZIP lookup
const ZIP_LOOKUP: Record<string, string> = {
  "90210": "Beverly Hills, CA", "90001": "Los Angeles, CA", "10001": "New York, NY",
  "10016": "New York, NY", "77001": "Houston, TX", "60601": "Chicago, IL",
  "33101": "Miami, FL", "85001": "Phoenix, AZ", "98101": "Seattle, WA",
  "80201": "Denver, CO", "02101": "Boston, MA", "20001": "Washington, DC",
  "33431": "Boca Raton, FL", "33432": "Boca Raton, FL", "33433": "Boca Raton, FL",
};

async function lookupZip(zip: string): Promise<string | null> {
  if (ZIP_LOOKUP[zip]) return ZIP_LOOKUP[zip];
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (res.ok) {
      const data = await res.json();
      return `${data.places[0]["place name"]}, ${data.places[0]["state abbreviation"]}`;
    }
  } catch {}
  return null;
}


// Geocode a location string to coordinates for static map images
async function geocodeLocation(location: string): Promise<[number, number] | null> {
  try {
    const token = 'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g';
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?country=us&limit=1&access_token=${token}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return [lng, lat];
      }
    }
  } catch {}
  return null;
}

const MOVE_SIZES = [
  { label: "Studio", value: "Studio" },
  { label: "1 Bed", value: "1 Bedroom" },
  { label: "2 Bed", value: "2 Bedroom" },
  { label: "3 Bed", value: "3 Bedroom" },
  { label: "4+ Bed", value: "4+ Bedroom" },
  { label: "Office", value: "Office" },
];

const FLOOR_OPTIONS = [
  { label: "Ground/1st", value: 1 },
  { label: "2nd", value: 2 },
  { label: "3rd", value: 3 },
  { label: "4th+", value: 4 },
];

// AI Messages based on context
function getAiHint(step: number, fromCity: string, toCity: string, distance: number, moveDate: Date | null): string {
  switch (step) {
    case 2:
      return "";
    case 3:
      if (distance > 0) {
        return `🚛 ${distance.toLocaleString()} miles — analyzing best carriers for this route`;
      }
      return "";
    case 4:
      if (moveDate) {
        const month = format(moveDate, 'MMMM');
        const isLowSeason = [0, 1, 2, 10, 11].includes(moveDate.getMonth());
        if (isLowSeason) {
          return `📅 ${month} — typically 15-20% lower rates`;
        }
        return `📅 ${month} — peak season, finding competitive rates`;
      }
      return "";
    case 5:
      return "📦 Select size to calculate your estimate";
    case 6:
      return "";
    default:
      return "";
  }
}

// Demo items for live scan preview
const SCAN_DEMO_ITEMS = [
  { name: "3-Seat Sofa", weight: 350, cuft: 45, image: "/inventory/living-room/sofa-3-cushion.png" },
  { name: "Coffee Table", weight: 45, cuft: 8, image: "/inventory/living-room/coffee-table.png" },
  { name: "TV Stand", weight: 80, cuft: 12, image: "/inventory/living-room/tv-stand.png" },
  { name: "Armchair", weight: 85, cuft: 18, image: "/inventory/living-room/armchair.png" },
  { name: "Floor Lamp", weight: 15, cuft: 4, image: "/inventory/living-room/lamp-floor.png" },
];

// Move Summary Modal - Hero Right Side
import { X } from "lucide-react";

interface MoveSummaryModalProps {
  fromCity: string;
  toCity: string;
  distance: number;
  fromCoords: [number, number] | null;
  toCoords: [number, number] | null;
  moveDate?: Date | null;
  estimatedDuration?: string;
  onClose?: () => void;
}

function MoveSummaryModal({ 
  fromCity, 
  toCity, 
  distance, 
  fromCoords, 
  toCoords,
  moveDate,
  estimatedDuration,
  onClose
}: MoveSummaryModalProps) {
  const hasData = fromCity || toCity;
  if (!hasData) return null;

  const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g';

  return (
    <div className="tru-move-summary-modal">
      {/* Top Accent Stripe */}
      <div className="tru-move-summary-accent" />
      
      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose} 
          className="tru-move-summary-close"
          aria-label="Close move summary"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
      {/* Header with Sparkle */}
      <div className="tru-move-summary-header">
        <Sparkles className="w-5 h-5" />
        <h3>Building your personalized move profile</h3>
      </div>
      
      {/* Subtitle */}
      <p className="tru-move-summary-subtitle">
        We validate cities, analyze distance and access, prepare carrier matching, and estimate weight and volume.
      </p>
      
      <div className="tru-move-summary-grid">
        {/* Origin */}
        <div className="tru-move-summary-location">
          <div className="tru-move-summary-map tru-move-summary-map-lg">
            {fromCoords ? (
              <img 
                src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${fromCoords[0]},${fromCoords[1]},14,0/280x280@2x?access_token=${MAPBOX_TOKEN}`}
                alt="Origin satellite view"
              />
            ) : (
              <div className="tru-move-summary-map-placeholder">
                <MapPin className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="tru-move-summary-location-info">
            <span className="label">Origin</span>
            <span className="value">{fromCity || "Enter origin..."}</span>
          </div>
        </div>
        
        {/* Distance Badge - Green on Black */}
        <div className="tru-move-summary-distance">
          <Route className="w-4 h-4" />
          <span className="tru-move-summary-mileage">
            {distance > 0 ? `${distance.toLocaleString()} mi` : "— mi"}
          </span>
        </div>
        
        {/* Destination */}
        <div className="tru-move-summary-location">
          <div className="tru-move-summary-map tru-move-summary-map-lg">
            {toCoords ? (
              <img 
                src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${toCoords[0]},${toCoords[1]},14,0/280x280@2x?access_token=${MAPBOX_TOKEN}`}
                alt="Destination satellite view"
              />
            ) : (
              <div className="tru-move-summary-map-placeholder">
                <Truck className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="tru-move-summary-location-info">
            <span className="label">Destination</span>
            <span className="value">{toCity || "Enter destination..."}</span>
          </div>
        </div>
      </div>
      
      {/* Move Date & ETA Row */}
      {(moveDate || estimatedDuration) && (
        <div className="tru-move-summary-details">
          {moveDate && (
            <div className="tru-move-summary-detail">
              <Calendar className="w-4 h-4" />
              <span>{format(moveDate, "MMM d, yyyy")}</span>
            </div>
          )}
          {estimatedDuration && (
            <div className="tru-move-summary-detail">
              <Clock className="w-4 h-4" />
              <span>ETA: {estimatedDuration}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Status Indicators */}
      <div className="tru-move-summary-status">
        <div className={`tru-move-summary-status-item ${fromCity && toCity ? 'is-complete' : ''}`}>
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Cities validated</span>
        </div>
        <div className={`tru-move-summary-status-item ${distance > 0 ? 'is-complete' : ''}`}>
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Distance calculated</span>
        </div>
        <div className={`tru-move-summary-status-item ${fromCity && toCity ? 'is-complete' : ''}`}>
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Carrier matching ready</span>
        </div>
      </div>
    </div>
  );
}

// Live Scan Preview Component
interface LiveScanPreviewProps {
  isRunning: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}

function LiveScanPreview({ isRunning, containerRef }: LiveScanPreviewProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      setVisibleCount(0);
      return;
    }
    
    const interval = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= SCAN_DEMO_ITEMS.length) {
          return prev; // Stop at the end, don't loop
        }
        return prev + 1;
      });
    }, 800); // Slightly faster for better UX
    return () => clearInterval(interval);
  }, [isRunning]);

  const visibleItems = SCAN_DEMO_ITEMS.slice(0, visibleCount);
  const totalWeight = visibleItems.reduce((sum, item) => sum + item.weight, 0);
  const totalCuFt = visibleItems.reduce((sum, item) => sum + item.cuft, 0);

  return (
    <div ref={containerRef} className={`tru-ai-preview-live ${isRunning ? 'is-running' : ''}`}>
      <div className="tru-ai-live-scanner">
        <img src={sampleRoomLiving} alt="Room being scanned" />
        <div className="tru-ai-scanner-overlay">
          <div className="tru-ai-scanner-line" />
        </div>
        <div className="tru-ai-scanner-badge">
          <Scan className="w-4 h-4" />
          <span>Scanning...</span>
        </div>
      </div>
      <div className="tru-ai-live-inventory">
        <div className="tru-ai-live-header">
          <Sparkles className="w-4 h-4" />
          <span>Live Detection</span>
        </div>
        <div className="tru-ai-live-items">
          {visibleItems.map((item, i) => (
            <div 
              key={`${item.name}-${i}`} 
              className="tru-ai-live-item"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <img src={item.image} alt={item.name} />
              <span className="tru-ai-live-item-name">{item.name}</span>
              <span className="tru-ai-live-item-weight">{item.weight} lbs</span>
            </div>
          ))}
        </div>
        <div className="tru-ai-live-totals">
          <span>
            <span className="tru-ai-total-label">Items:</span> {visibleCount}
          </span>
          <span>
            <span className="tru-ai-total-label">Weight:</span> {totalWeight} lbs
          </span>
          <span>
            <span className="tru-ai-total-label">Volume:</span> {totalCuFt} cu ft
          </span>
        </div>
      </div>
    </div>
  );
}

// Trust Compact Section with scroll-triggered staggered reveal
function TrustCompactSection() {
  const [sectionRef, isInView] = useScrollAnimation<HTMLElement>({
    threshold: 0.2,
    rootMargin: "0px",
    triggerOnce: true,
  });

  const stats = [
    { icon: Database, label: "Federal SAFER Data" },
    { icon: CreditCard, label: "Secure Payments" },
    { icon: ShieldCheck, label: "Vetted Movers" },
  ];

  const badges = ["FMCSA Authorized", "USDOT Compliant", "Insured & Bonded"];

  return (
    <section className="tru-trust-compact" ref={sectionRef}>
      <div className="tru-trust-compact-inner">
        <div className="tru-trust-compact-stats">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className={`tru-trust-compact-stat ${isInView ? 'in-view' : ''}`}
              style={{ '--stagger-index': index } as React.CSSProperties}
            >
              <stat.icon className="w-5 h-5" />
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="tru-trust-compact-badges">
          {badges.map((badge, index) => (
            <span 
              key={badge} 
              className={`tru-trust-compact-badge ${isInView ? 'in-view' : ''}`}
              style={{ '--stagger-index': index + 3 } as React.CSSProperties}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// Steps Compact Section with parallax effect
function StepsCompactSection({ navigate }: { navigate: (path: string) => void }) {
  const [sectionRef, isInView] = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
    rootMargin: "0px",
    triggerOnce: true,
  });

  const steps = [
    { num: 1, title: "Build Your Inventory", desc: "AI-powered tools calculate weight and volume from real data." },
    { num: 2, title: "Get Carrier Matches", desc: "We analyze SAFER Web data to find the best fit." },
    { num: 3, title: "Book with Confidence", desc: "Secure payment. Licensed, vetted movers only." },
  ];

  return (
    <section className="tru-steps-compact" ref={sectionRef}>
      <div className="tru-steps-compact-inner">
        <div className="tru-steps-compact-header">
          <span className="tru-steps-compact-badge">How It Works</span>
          <h2 className="tru-steps-compact-title">Get matched with the right mover.</h2>
        </div>
        <div className="tru-steps-compact-grid">
          {steps.map((step, index) => (
            <div 
              key={step.num}
              className={`tru-steps-compact-card tru-steps-parallax-card ${isInView ? 'in-view' : ''}`}
              style={{ '--card-index': index } as React.CSSProperties}
              onClick={() => navigate("/online-estimate")}
            >
              <div className="tru-steps-compact-num">{step.num}</div>
              <div className="tru-steps-compact-card-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 tru-steps-compact-arrow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  useScrollToTop();
  const navigate = useNavigate();
  const quoteBuilderRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  
  // Scroll-triggered animation for hero content
  const [heroContentRef, isHeroInView] = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "0px",
    triggerOnce: true,
  });
  
  // Parallax effects for hero elements
  const [parallaxHeadlineRef, headlineParallax] = useParallax<HTMLDivElement>({ speed: 0.15, direction: "up" });
  const [parallaxCardsRef, cardsParallax] = useParallax<HTMLDivElement>({ speed: 0.08, direction: "up" });
  const [parallaxFormRef, formParallax] = useParallax<HTMLDivElement>({ speed: 0.05, direction: "up" });
  
  // Step tracking (1-4)
  const [step, setStep] = useState(1);
  
  // Analyzing transition state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzePhase, setAnalyzePhase] = useState(0); // 0: origin, 1: destination, 2: route
  const [fromCoords, setFromCoords] = useState<[number, number] | null>(null);
  const [toCoords, setToCoords] = useState<[number, number] | null>(null);
  const [routeProgress, setRouteProgress] = useState(0); // 0-100 for route drawing animation
  const [routeGeometry, setRouteGeometry] = useState<string | null>(null);
  
  // UI engagement state - cards expand when user starts typing
  const [isEngaged, setIsEngaged] = useState(false);
  
  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  
  // Lead capture modal state
  const [leadCaptureOpen, setLeadCaptureOpen] = useState(false);
  const [leadCaptureTarget, setLeadCaptureTarget] = useState<"manual" | "ai">("manual");
  const [hasProvidedContactInfo, setHasProvidedContactInfo] = useState(false);
  
  // AI Scan Demo state
  const [scanDemoRunning, setScanDemoRunning] = useState(false);
  const scanPreviewRef = useRef<HTMLDivElement>(null);
  
  // Form state
  const [fromZip, setFromZip] = useState("");
  const [toZip, setToZip] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [moveDate, setMoveDate] = useState<Date | null>(null);
  const [size, setSize] = useState("");
  const [propertyType, setPropertyType] = useState<'house' | 'apartment' | ''>('');
  const [floor, setFloor] = useState(1);
  const [hasElevator, setHasElevator] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNum] = useState("");
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  // Carrier search animation states
  const [isSearchingCarriers, setIsSearchingCarriers] = useState(false);
  const [searchPhase, setSearchPhase] = useState(0);
  const [carrierCount, setCarrierCount] = useState(0);
  const [foundCarriers, setFoundCarriers] = useState(0);
  
  // Track which summary fields just updated (for animation)
  const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());
  
  // Why TruMove feature selection state
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  
  // Move Summary Modal visibility state
  const [showMoveSummary, setShowMoveSummary] = useState(true);
  
  // Reset Move Summary visibility when locations change
  useEffect(() => {
    if (fromCity || toCity) {
      setShowMoveSummary(true);
    }
  }, [fromCity, toCity]);
  
  // Hero carousel auto-cycling state
  const [heroCarouselApi, setHeroCarouselApi] = useState<CarouselApi>();
  const [isHeroCarouselPaused, setIsHeroCarouselPaused] = useState(false);
  
  // Hero carousel autoplay effect (6-second interval)
  useEffect(() => {
    if (!heroCarouselApi || isHeroCarouselPaused) return;
    
    const intervalId = setInterval(() => {
      heroCarouselApi.scrollNext();
    }, 6000);
    
    return () => clearInterval(intervalId);
  }, [heroCarouselApi, isHeroCarouselPaused]);
  
  // Why TruMove features data - Updated per plan
  const whyTruMoveFeatures = [
    {
      id: 'ai-scanner',
      icon: Scan,
      title: 'Computer Vision Inventory',
      shortDesc: 'AI scans your rooms in seconds',
      longDesc: 'Our proprietary neural network detects furniture, estimates cubic footage, and calculates weight — eliminating the guesswork that leads to surprise fees on move day.',
      hoverTip: 'Skip the clipboard. Snap photos and let AI do the counting.'
    },
    {
      id: 'video-consults',
      icon: Video,
      title: 'Live Video Walk-Through',
      shortDesc: 'Real-time consultation with experts',
      longDesc: 'A TruMove specialist joins you via video to walk your home room-by-room. They catch details photos miss and build a quote you can actually trust.',
      hoverTip: 'Like FaceTime, but with a moving pro on the other end.'
    },
    {
      id: 'fmcsa-vetting',
      icon: ShieldCheck,
      title: 'FMCSA Safety Intelligence',
      shortDesc: 'Federal database cross-reference',
      longDesc: 'We pull real-time data from the SAFER Web Services API — checking operating authority, crash history, and compliance ratings before any carrier makes our list.',
      hoverTip: 'Same data the feds use. Zero guesswork.'
    },
    {
      id: 'authority-check',
      icon: Shield,
      title: 'License Verification Engine',
      shortDesc: 'Active authority confirmation',
      longDesc: 'Every carrier is validated for active MC and USDOT numbers. Revoked, suspended, or lapsed licenses get flagged instantly — you only see vetted options.',
      hoverTip: "If it's not active, you won't see it."
    },
    {
      id: 'insurance-check',
      icon: CreditCard,
      title: 'Coverage Validation',
      shortDesc: 'Insurance limits verified on file',
      longDesc: 'We confirm cargo, liability, and bodily injury coverage meets or exceeds federal minimums — so your belongings are protected before they leave the driveway.',
      hoverTip: 'Proof of coverage, not just promises.'
    },
    {
      id: 'transparency',
      icon: Zap,
      title: 'Zero Black Box',
      shortDesc: 'Full visibility at every stage',
      longDesc: 'From carrier matching to move-day coordination, you see exactly what we see. Real-time status updates, no hidden fees, no corporate runaround.',
      hoverTip: "You're in the loop. Always."
    }
  ];
  
  // Calculate real distance
  const distance = useMemo(() => calculateDistance(fromZip, toZip), [fromZip, toZip]);
  const moveType = distance > 150 ? "long-distance" : "local";
  
  // Previous values to detect changes (for animation)
  const prevFromCity = useRef(fromCity);
  const prevToCity = useRef(toCity);
  const prevDistance = useRef(distance);
  const prevMoveDate = useRef(moveDate);
  const prevSize = useRef(size);
  const prevPropertyType = useRef(propertyType);
  
  // Animate summary value updates (kept for potential future use)
  useEffect(() => {
    const fieldsToUpdate: string[] = [];
    
    if (fromCity && fromCity !== prevFromCity.current) fieldsToUpdate.push('from');
    if (toCity && toCity !== prevToCity.current) fieldsToUpdate.push('to');
    if (distance > 0 && distance !== prevDistance.current) fieldsToUpdate.push('distance');
    if (moveDate && moveDate !== prevMoveDate.current) fieldsToUpdate.push('date');
    if (size && size !== prevSize.current) fieldsToUpdate.push('size');
    if (propertyType && propertyType !== prevPropertyType.current) fieldsToUpdate.push('propertyType');
    
    // Update refs
    prevFromCity.current = fromCity;
    prevToCity.current = toCity;
    prevDistance.current = distance;
    prevMoveDate.current = moveDate;
    prevSize.current = size;
    prevPropertyType.current = propertyType;
    
    if (fieldsToUpdate.length > 0) {
      setUpdatedFields(new Set(fieldsToUpdate));
      const timer = setTimeout(() => setUpdatedFields(new Set()), 500);
      return () => clearTimeout(timer);
    }
  }, [fromCity, toCity, distance, moveDate, size, propertyType]);

  // AI hint for current step
  const aiHint = useMemo(() => 
    getAiHint(step, fromCity, toCity, distance, moveDate),
    [step, fromCity, toCity, distance, moveDate]
  );

  // Dynamic ticker content based on progress
  const tickerContent = useMemo(() => {
    if (!fromCity && !toCity) {
      return "256-bit encryption • Real-time pricing • FMCSA verified";
    }
    if (fromCity && !toCity) {
      const state = fromCity.split(',')[1]?.trim() || '';
      return `Scanning carriers in ${state} • Real-time pricing • FMCSA verified`;
    }
    if (fromCity && toCity && distance > 0) {
      return `${distance.toLocaleString()} mile route analyzed • Matching best carriers • FMCSA verified`;
    }
    return "256-bit encryption • Real-time pricing • FMCSA verified";
  }, [fromCity, toCity, distance]);

  // Calculate estimated move duration based on distance
  const estimatedDuration = useMemo(() => {
    if (distance <= 0) return null;
    if (distance < 50) return "1 day";
    if (distance < 200) return "1-2 days";
    if (distance < 500) return "2-3 days";
    if (distance < 1000) return "3-5 days";
    if (distance < 2000) return "5-7 days";
    return "7-10 days";
  }, [distance]);

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
    
    // Add floor surcharge for apartments with stairs
    if (propertyType === 'apartment' && !hasElevator && floor > 1) {
      const floorSurcharge = (floor - 1) * 75;
      min += floorSurcharge;
      max += floorSurcharge;
    }
    
    return { min, max };
  }, [size, distance, moveType, propertyType, floor, hasElevator]);

  // Carrier search animation
  const triggerCarrierSearch = useCallback((state: string) => {
    setIsSearchingCarriers(true);
    setSearchPhase(1);
    setCarrierCount(0);
    setFoundCarriers(0);
    
    // Phase 1: Scanning (0-2s)
    setTimeout(() => {
      setSearchPhase(2);
      // Count up carriers
      let count = 0;
      const countInterval = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 3;
        if (count >= 47) {
          count = 47;
          clearInterval(countInterval);
        }
        setCarrierCount(count);
      }, 150);
    }, 1500);
    
    // Phase 2: Analyzing (2-4s)
    setTimeout(() => {
      setSearchPhase(3);
      setFoundCarriers(Math.floor(Math.random() * 6) + 8); // 8-14 carriers
    }, 3500);
    
    // Complete (4s+)
    setTimeout(() => {
      setIsSearchingCarriers(false);
    }, 5000);
  }, []);

  // Handle ZIP changes
  const handleFromZipChange = useCallback(async (value: string) => {
    setFromZip(value);
    if (value.length === 5) {
      const city = await lookupZip(value);
      setFromCity(city || "");
      if (city) {
        const state = city.split(',')[1]?.trim() || '';
        triggerCarrierSearch(state);
      }
    } else {
      setFromCity("");
    }
  }, [triggerCarrierSearch]);

  const handleToZipChange = useCallback(async (value: string) => {
    setToZip(value);
    if (value.length === 5) {
      const city = await lookupZip(value);
      setToCity(city || "");
      if (city && fromCity) {
        const state = city.split(',')[1]?.trim() || '';
        triggerCarrierSearch(state);
      }
    } else {
      setToCity("");
    }
  }, [triggerCarrierSearch, fromCity]);

  // Track full location display text for better data transfer
  const [fromLocationDisplay, setFromLocationDisplay] = useState("");
  const [toLocationDisplay, setToLocationDisplay] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store lead data with full address display
    localStorage.setItem("tm_lead", JSON.stringify({
      name, fromZip, toZip, fromCity, toCity, 
      fromLocationDisplay: fromLocationDisplay || `${fromCity} ${fromZip}`,
      toLocationDisplay: toLocationDisplay || `${toCity} ${toZip}`,
      moveDate: moveDate?.toISOString(),
      size, propertyType, floor, hasElevator, email, phone, ts: Date.now()
    }));
    
    // Show confirmation
    setSubmitted(true);
  };

  // Handle inventory flow gating
  const handleInventoryClick = (flow: "manual" | "ai") => {
    if (!hasProvidedContactInfo && !name && !email && !phone) {
      setLeadCaptureTarget(flow);
      setLeadCaptureOpen(true);
    } else {
      // Already have contact info, proceed directly
      navigate(flow === "ai" ? "/scan-room" : "/online-estimate");
    }
  };

  const handleLeadCaptureSubmit = (data: { name: string; email: string; phone: string }) => {
    setName(data.name);
    setEmail(data.email);
    setPhoneNum(data.phone);
    setHasProvidedContactInfo(true);
    setLeadCaptureOpen(false);
    
    // Store the lead data
    localStorage.setItem("tm_lead_contact", JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      ts: Date.now()
    }));
    
    // Navigate to the selected flow
    navigate(leadCaptureTarget === "ai" ? "/scan-room" : "/online-estimate");
  };

  // Step validation
  const canContinue = () => {
    switch (step) {
      case 1: return fromZip.length === 5 && fromCity && toZip.length === 5 && toCity && moveDate !== null;
      case 2: return size !== "" && propertyType !== "";
      case 3: return email.includes("@") && phone.trim().length >= 10;
      default: return false;
    }
  };

  const goNext = async () => {
    if (canContinue() && step < 3) {
      // If on step 1, trigger analyzing transition
      if (step === 1) {
        setIsAnalyzing(true);
        setAnalyzePhase(0);
        
        // Fetch route geometry for the third map
        if (fromCoords && toCoords) {
          try {
            const token = 'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g';
            const res = await fetch(
              `https://api.mapbox.com/directions/v5/mapbox/driving/${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}?geometries=polyline&overview=full&access_token=${token}`
            );
            if (res.ok) {
              const data = await res.json();
              if (data.routes && data.routes[0]) {
                setRouteGeometry(data.routes[0].geometry);
              }
            }
          } catch (e) {
            console.error('Failed to fetch route:', e);
          }
        }
        
        // Slower timing for popup modal experience
        // Phase 0: Show origin (0-2s)
        setTimeout(() => setAnalyzePhase(1), 2000);
        // Phase 1: Show destination (2-4s)
        setTimeout(() => {
          setAnalyzePhase(2);
          // Start route progress animation
          setRouteProgress(0);
          let progress = 0;
          const progressInterval = setInterval(() => {
            progress += 2;
            if (progress >= 100) {
              progress = 100;
              clearInterval(progressInterval);
              // Wait a moment at 100% before transitioning
              setTimeout(() => {
                setIsAnalyzing(false);
                setAnalyzePhase(0);
                setRouteProgress(0);
                setStep(2);
              }, 500);
            }
            setRouteProgress(progress);
          }, 50);
        }, 4000);
      } else {
        setStep(step + 1);
      }
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canContinue()) {
      e.preventDefault();
      goNext();
    }
  };

  const hasRoute = fromZip.length === 5 && toZip.length === 5;

  return (
    <SiteShell centered>
      <div className="tru-page-frame">
        <div className="tru-page-inner">
        {/* HERO - Full Width Background Wrapper */}
        <div className="tru-hero-wrapper">
          {/* Full-width background image with parallax */}
          <div className="tru-hero-bg">
            <img 
              src={heroFamilyMove} 
              alt="Happy family moving into their new home" 
              className="tru-hero-bg-image"
            />
            <div className="tru-hero-bg-overlay" />
          </div>
          
          <section className="tru-hero tru-hero-split" ref={heroSectionRef}>
            {/* Particle Background Effect */}
            <HeroParticles />
            <div className="tru-hero-particles-overlay" />
            
            
            {/* Full-Page Analyzing Overlay */}
            {isAnalyzing && (
              <div className="tru-analyze-fullpage-overlay">
                <div className="tru-analyze-popup-modal">
                  <div className="tru-analyze-popup-header">
                    <Radar className="w-6 h-6 tru-analyzing-icon" />
                    <span className="tru-analyze-popup-title">
                      {analyzePhase === 0 && "Locating origin..."}
                      {analyzePhase === 1 && "Locating destination..."}
                      {analyzePhase === 2 && "Analyzing route..."}
                    </span>
                  </div>
                  
                  <div className="tru-analyze-strip">
                    {/* Origin Satellite */}
                    <div className={`tru-analyze-strip-panel ${analyzePhase >= 0 ? 'is-active' : ''}`}>
                      <div className="tru-analyze-strip-label">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Origin</span>
                      </div>
                      <div className="tru-analyze-strip-frame">
                        <div className="tru-analyze-strip-shimmer" />
                        <img 
                          src={fromCoords ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${fromCoords[0]},${fromCoords[1]},14,0/400x200@2x?access_token=pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g` : ''}
                          alt="Origin location"
                          className="tru-analyze-strip-img"
                          onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
                        />
                        <div className="tru-analyze-strip-city">{fromCity}</div>
                      </div>
                    </div>
                    
                    {/* Route Map - Center */}
                    <div className={`tru-analyze-strip-panel tru-analyze-strip-route ${analyzePhase >= 2 ? 'is-active' : ''}`}>
                      <div className="tru-analyze-strip-label">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Your Route</span>
                      </div>
                      <div className="tru-analyze-strip-frame tru-analyze-strip-route-frame">
                        <div className="tru-analyze-strip-shimmer" />
                        {fromCoords && toCoords && routeGeometry && (
                          <AnimatedRouteMap
                            fromCoords={fromCoords}
                            toCoords={toCoords}
                            routeGeometry={routeGeometry}
                            progress={routeProgress}
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Destination Satellite */}
                    <div className={`tru-analyze-strip-panel ${analyzePhase >= 1 ? 'is-active' : ''}`}>
                      <div className="tru-analyze-strip-label">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Destination</span>
                      </div>
                      <div className="tru-analyze-strip-frame">
                        <div className="tru-analyze-strip-shimmer" />
                        <img 
                          src={toCoords ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${toCoords[0]},${toCoords[1]},14,0/400x200@2x?access_token=pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g` : ''}
                          alt="Destination location"
                          className="tru-analyze-strip-img"
                          onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
                        />
                        <div className="tru-analyze-strip-city">{toCity}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hero Header with Headline Only - Subtitle outside backdrop */}
            <div className="tru-hero-header-section tru-hero-header-refined">
              <h1 className="tru-hero-headline-main tru-headline-animated">
                <img src={logoImg} alt="TruMove" className="tru-hero-headline-logo" />
                A Smarter Way To <span className="tru-hero-headline-accent">Move</span>
              </h1>
            </div>
            <p className="tru-hero-subheadline-refined tru-subheadline-animated">
              Moving. The Way Its Supposed To Be
            </p>

            {/* RIGHT: Form + Sidebar Stacked Vertically with parallax */}
            <div 
              ref={parallaxFormRef}
              className="tru-hero-right-half tru-hero-right-stacked"
              style={{
                transform: `translateY(${formParallax.y}px)`,
              }}
            >
              <div className="tru-hero-form-panel" ref={quoteBuilderRef}>
                {/* TOP ROW: Form Card */}
                <div className="tru-floating-form-card">
                  {/* Progress Bar - no accent stripe */}
                  
                  {/* Progress Bar */}
                  <div className="tru-form-progress-bar">
                    <div 
                      className="tru-form-progress-fill" 
                      style={{ width: `${(step / 3) * 100}%` }}
                    />
                  </div>
                  
                  <div className="tru-qb-form-header tru-qb-form-header-clean">
                    <div className="tru-qb-form-header-brand">
                      <img src={logoImg} alt="TruMove" className="tru-qb-header-logo-clean" />
                      <span className="tru-qb-header-tagline">A Smarter Way to Move</span>
                    </div>
                  </div>

                  {/* Form Content */}
                  <div className="tru-floating-form-content">

                    {/* Step 1: Route & Date */}
                    {step === 1 && (
                      <div className="tru-qb-step-content" key="step-1">
                        <h1 className="tru-qb-question tru-qb-question-decorated">Enter your route to begin matching</h1>
                        
                        {/* FROM + TO Row - Side by Side with Route Connector */}
                        <div className="tru-qb-location-row">
                        <div className="tru-qb-location-col">
                            <p className="tru-qb-section-label"><MapPin className="w-3 h-3" /> From</p>
                            <div className="tru-qb-input-wrap tru-qb-zip-wrap tru-qb-input-enhanced">
                              <LocationAutocomplete
                                value={fromZip}
                                onValueChange={(val) => {
                                  setFromZip(val);
                                  if (val.length > 0 && !isEngaged) setIsEngaged(true);
                                }}
                                onLocationSelect={async (city, zip, fullAddress) => {
                                  setFromZip(zip);
                                  setFromCity(city);
                                  setFromLocationDisplay(fullAddress || `${city} ${zip}`);
                                  const state = city.split(',')[1]?.trim() || '';
                                  triggerCarrierSearch(state);
                                  // Geocode for static map
                                  const coords = await geocodeLocation(`${city} ${zip}`);
                                  if (coords) setFromCoords(coords);
                                }}
                                placeholder="City or ZIP"
                                autoFocus
                              />
                            </div>
                          </div>

                          {/* Route Connector */}
                          <div className="tru-qb-route-connector">
                            <ArrowRight className="w-4 h-4" />
                          </div>

                          <div className="tru-qb-location-col">
                            <p className="tru-qb-section-label"><MapPin className="w-3 h-3" /> To</p>
                            <div className="tru-qb-input-wrap tru-qb-zip-wrap tru-qb-input-enhanced">
                              <LocationAutocomplete
                                value={toZip}
                                onValueChange={(val) => {
                                  setToZip(val);
                                  if (val.length > 0 && !isEngaged) setIsEngaged(true);
                                }}
                                onLocationSelect={async (city, zip, fullAddress) => {
                                  setToZip(zip);
                                  setToCity(city);
                                  setToLocationDisplay(fullAddress || `${city} ${zip}`);
                                  if (fromCity) {
                                    const state = city.split(',')[1]?.trim() || '';
                                    triggerCarrierSearch(state);
                                  }
                                  // Geocode for static map
                                  const coords = await geocodeLocation(`${city} ${zip}`);
                                  if (coords) setToCoords(coords);
                                }}
                                placeholder="City or ZIP"
                              />
                            </div>
                          </div>
                        </div>


                        {/* Move Date */}
                        <p className="tru-qb-section-label" style={{ marginTop: '1.25rem' }}>Move Date</p>
                        <div className="tru-qb-input-wrap">
                          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                            <PopoverTrigger asChild>
                              <button type="button" className="tru-qb-date-btn">
                                <CalendarIcon className="w-5 h-5" />
                                <span>{moveDate ? format(moveDate, "MMMM d, yyyy") : "Select a date"}</span>
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="form-date-popover" align="center">
                              <CalendarComponent
                                mode="single"
                                selected={moveDate || undefined}
                                onSelect={(date) => {
                                  setMoveDate(date || null);
                                  setDatePopoverOpen(false);
                                }}
                                disabled={(date) => date < new Date()}
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <button
                          type="button"
                          className={`tru-qb-continue tru-engine-btn ${isSearchingCarriers || isAnalyzing ? 'is-scanning' : ''}`}
                          disabled={!canContinue() || isSearchingCarriers || isAnalyzing}
                          onClick={goNext}
                        >
                          <Scan className="w-4 h-4 tru-btn-scan" />
                          <span>{isSearchingCarriers || isAnalyzing ? 'Analyzing...' : 'Analyze Route'}</span>
                          {!isSearchingCarriers && !isAnalyzing && <ArrowRight className="w-5 h-5 tru-btn-arrow" />}
                        </button>
                      </div>
                    )}


                    {/* Step 2: Move Size + Property Type */}
                    {step === 2 && (
                      <div className="tru-qb-step-content" key="step-2">
                        <h1 className="tru-qb-question">What size is your current home?</h1>
                        <p className="tru-qb-subtitle">This helps us estimate weight and crew size</p>
                        
                        <div className="tru-qb-size-grid">
                          {MOVE_SIZES.map((s) => (
                            <button
                              key={s.value}
                              type="button"
                              className={`tru-qb-size-btn ${size === s.value ? 'is-active' : ''}`}
                              onClick={() => setSize(s.value)}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>

                        <p className="tru-qb-section-label">Property Type</p>
                        <div className="tru-qb-toggles">
                          <button
                            type="button"
                            className={`tru-qb-toggle-card ${propertyType === 'house' ? 'is-active' : ''}`}
                            onClick={() => setPropertyType('house')}
                          >
                            <Home className="tru-qb-toggle-icon" />
                            <div className="tru-qb-toggle-content">
                              <span className="tru-qb-toggle-title">House</span>
                            </div>
                          </button>
                          <button
                            type="button"
                            className={`tru-qb-toggle-card ${propertyType === 'apartment' ? 'is-active' : ''}`}
                            onClick={() => setPropertyType('apartment')}
                          >
                            <Building2 className="tru-qb-toggle-icon" />
                            <div className="tru-qb-toggle-content">
                              <span className="tru-qb-toggle-title">Apartment</span>
                            </div>
                          </button>
                        </div>

                        {propertyType === 'apartment' && (
                          <>
                            <p className="tru-qb-section-label animate-fade-in">What floor?</p>
                            <div className="tru-qb-size-grid animate-fade-in">
                              {FLOOR_OPTIONS.map((f) => (
                                <button
                                  key={f.value}
                                  type="button"
                                  className={`tru-qb-size-btn ${floor === f.value ? 'is-active' : ''}`}
                                  onClick={() => setFloor(f.value)}
                                >
                                  {f.label}
                                </button>
                              ))}
                            </div>

                            <p className="tru-qb-section-label animate-fade-in">Access type</p>
                            <div className="tru-qb-toggles animate-fade-in">
                              <button
                                type="button"
                                className={`tru-qb-toggle-card ${!hasElevator ? 'is-active' : ''}`}
                                onClick={() => setHasElevator(false)}
                              >
                                <MoveVertical className="tru-qb-toggle-icon" />
                                <div className="tru-qb-toggle-content">
                                  <span className="tru-qb-toggle-title">Stairs</span>
                                </div>
                              </button>
                              <button
                                type="button"
                                className={`tru-qb-toggle-card ${hasElevator ? 'is-active' : ''}`}
                                onClick={() => setHasElevator(true)}
                              >
                                <ArrowUpDown className="tru-qb-toggle-icon" />
                                <div className="tru-qb-toggle-content">
                                  <span className="tru-qb-toggle-title">Elevator</span>
                                </div>
                              </button>
                            </div>
                          </>
                        )}

                        <button
                          type="button"
                          className="tru-qb-continue tru-engine-btn"
                          disabled={!canContinue()}
                          onClick={goNext}
                        >
                          <span>Match Carriers</span>
                          <ArrowRight className="w-5 h-5 tru-btn-arrow" />
                        </button>

                        <button type="button" className="tru-qb-back" onClick={goBack}>
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back</span>
                        </button>
                      </div>
                    )}

                    {/* Step 3: Contact - Simplified Lead Capture */}
                    {step === 3 && !submitted && (
                      <form className="tru-qb-step-content tru-qb-step-compact" key="step-3" onSubmit={handleSubmit}>
                        <h1 className="tru-qb-question">Almost done! How can we reach you?</h1>
                        <p className="tru-qb-subtitle">We'll call you within 1 business day to finalize your quote</p>
                        
                        <div className="tru-qb-contact-fields">
                          <div className="tru-qb-input-wrap tru-qb-glow-always">
                            <input
                              type="text"
                              className={`tru-qb-input ${formError && !name.trim() ? 'has-error' : ''}`}
                              placeholder="Your name"
                              value={name}
                              onChange={(e) => { setName(e.target.value); setFormError(""); }}
                              autoFocus
                            />
                          </div>
                          
                          <div className="tru-qb-input-row">
                            <input
                              type="email"
                              className={`tru-qb-input ${formError && !email.trim() ? 'has-error' : ''}`}
                              placeholder="Email"
                              value={email}
                              onChange={(e) => { setEmail(e.target.value); setFormError(""); }}
                              onKeyDown={handleKeyDown}
                            />
                            <input
                              type="tel"
                              className="tru-qb-input"
                              placeholder="Phone"
                              value={phone}
                              onChange={(e) => { setPhoneNum(e.target.value); setFormError(""); }}
                              onKeyDown={handleKeyDown}
                            />
                          </div>
                        </div>

                        {formError && (
                          <p className="tru-qb-error">{formError}</p>
                        )}

                        <button
                          type="submit"
                          className="tru-qb-continue tru-engine-btn"
                          onClick={(e) => { 
                            if (!canContinue()) {
                              e.preventDefault();
                              setFormError("Please enter a valid email and phone number (10+ digits).");
                            }
                          }}
                        >
                          <span>Get My Free Quote</span>
                          <ArrowRight className="w-5 h-5 tru-btn-arrow" />
                        </button>

                        <button type="button" className="tru-qb-back" onClick={goBack}>
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back</span>
                        </button>

                        <p className="tru-qb-disclaimer-bottom">
                          By submitting, you agree we may contact you. <Lock className="w-3 h-3 inline" /> Secure & never sold.
                        </p>
                      </form>
                    )}

                    {/* Post-Submission Confirmation */}
                    {step === 3 && submitted && (
                      <div className="tru-qb-step-content tru-qb-confirmation" key="step-confirmed">
                        <div className="tru-qb-confirmation-icon">
                          <CheckCircle className="w-12 h-12" />
                        </div>
                        <h1 className="tru-qb-question">Request received!</h1>
                        <p className="tru-qb-subtitle tru-qb-subtitle-bold">
                          <strong>A TruMove specialist will be contacting you shortly</strong> to discuss your move details and provide a personalized quote.
                        </p>
                        
                        <div className="tru-qb-confirmation-divider">
                          <span>Take control of your move:</span>
                        </div>
                        
                        <div className="tru-qb-options-stack-full">
                          <button 
                            type="button" 
                            className="tru-qb-option-card tru-qb-option-card-outline"
                            onClick={() => navigate("/book")}
                          >
                            <Video className="w-5 h-5" />
                            <div className="tru-qb-option-text">
                              <span className="tru-qb-option-title">Video Consult</span>
                              <span className="tru-qb-option-desc">Schedule a walkthrough</span>
                            </div>
                          </button>
                          <a href="tel:+16097277647" className="tru-qb-option-card tru-qb-option-card-outline">
                            <Phone className="w-5 h-5" />
                            <div className="tru-qb-option-text">
                              <span className="tru-qb-option-title">Call Us Now</span>
                              <span className="tru-qb-option-desc">(609) 727-7647</span>
                            </div>
                          </a>
                          <button 
                            type="button" 
                            className="tru-qb-option-card"
                            onClick={() => navigate("/online-estimate")}
                          >
                            <Sparkles className="w-5 h-5" />
                            <div className="tru-qb-option-text">
                              <span className="tru-qb-option-title">AI Estimator</span>
                              <span className="tru-qb-option-desc">Build your inventory</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Footer inside form card - with trust indicators */}
                  <div className="tru-floating-form-footer tru-form-footer-trust">
                    <div className="tru-form-trust-items">
                      <span className="tru-form-trust-item"><Lock className="w-3 h-3" /> TLS 1.3 ENCRYPTED</span>
                      <span className="tru-form-trust-divider">•</span>
                      <span className="tru-form-trust-item"><Shield className="w-3 h-3" /> FMCSA LICENSE VERIFIED</span>
                      <span className="tru-form-trust-divider">•</span>
                      <span className="tru-form-trust-item"><Database className="w-3 h-3" /> FIRST-PARTY DATA ONLY</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* SIDEBAR: Temporarily hidden - Summary Pill + Nav Icons Pill
              <div className="tru-hero-sidebar tru-hero-sidebar-stacked">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="tru-sidebar-summary-pill-v3 group">
                        <div className="tru-summary-pill-collapsed">
                          <div className="tru-summary-pill-icon-wrap">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <span className="tru-summary-pill-vertical-label">SUMMARY</span>
                        </div>
                        <div className="tru-summary-pill-expanded">
                          <div className="tru-summary-pill-header">
                            <span>MOVE SUMMARY</span>
                          </div>
                          <div className="tru-summary-pill-body">
                            <div className="tru-summary-pill-row">
                              <span className="tru-summary-pill-label">From</span>
                              <span className="tru-summary-pill-value">{fromCity ? fromCity.split(',')[0] : '—'}</span>
                            </div>
                            <div className="tru-summary-pill-row">
                              <span className="tru-summary-pill-label">To</span>
                              <span className="tru-summary-pill-value">{toCity ? toCity.split(',')[0] : '—'}</span>
                            </div>
                            <div className="tru-summary-pill-row">
                              <span className="tru-summary-pill-label">Distance</span>
                              <span className="tru-summary-pill-value">{distance > 0 ? `${distance.toLocaleString()} mi` : '—'}</span>
                            </div>
                            <div className="tru-summary-pill-row">
                              <span className="tru-summary-pill-label">Date</span>
                              <span className="tru-summary-pill-value">{moveDate ? format(moveDate, "MMM d") : '—'}</span>
                            </div>
                            <div className="tru-summary-pill-row">
                              <span className="tru-summary-pill-label">ETA</span>
                              <span className="tru-summary-pill-value">{estimatedDuration || '—'}</span>
                            </div>
                            <div className="tru-summary-pill-row">
                              <span className="tru-summary-pill-label">Size</span>
                              <span className="tru-summary-pill-value">{size || '—'}</span>
                            </div>
                            <div className="tru-summary-pill-row">
                              <span className="tru-summary-pill-label">Property</span>
                              <span className="tru-summary-pill-value">{selectedPropertyType ? selectedPropertyType.charAt(0).toUpperCase() + selectedPropertyType.slice(1) : '—'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="tru-tooltip-summary-preview">
                      <div className="tru-summary-preview-content">
                        <div className="tru-summary-preview-header">Quick Summary</div>
                        <div className="tru-summary-preview-body">
                          {fromCity && (
                            <div className="tru-summary-preview-row">
                              <span className="tru-summary-preview-label">From</span>
                              <span className="tru-summary-preview-value">{fromCity.split(',')[0]}</span>
                            </div>
                          )}
                          {toCity && (
                            <div className="tru-summary-preview-row">
                              <span className="tru-summary-preview-label">To</span>
                              <span className="tru-summary-preview-value">{toCity.split(',')[0]}</span>
                            </div>
                          )}
                          {distance > 0 && (
                            <div className="tru-summary-preview-row">
                              <span className="tru-summary-preview-label">Distance</span>
                              <span className="tru-summary-preview-value">{distance.toLocaleString()} mi</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={200}>
                  <div className="tru-sidebar-nav-pill-v3">
                    <FloatingNav onChatOpen={() => setChatOpen(true)} iconsOnly />
                  </div>
                </TooltipProvider>
              </div>
              */}
            </div>

            {/* RIGHT SIDE: Move Summary Modal + Why TruMove Card */}
            <div className="tru-hero-content-panel tru-hero-stacked-cards">
              {/* Move Summary Modal - appears when location data exists */}
              {showMoveSummary && (
                <MoveSummaryModal 
                  fromCity={fromCity}
                  toCity={toCity}
                  distance={distance}
                  fromCoords={fromCoords}
                  toCoords={toCoords}
                  onClose={() => setShowMoveSummary(false)}
                />
              )}
              
              {/* CARD 1: Why TruMove - Premium Card */}
              <div className="tru-why-card-premium" ref={parallaxCardsRef}
                style={{ transform: `translateY(${cardsParallax.y}px)` }}
              >
                <div className="tru-why-card-premium-glow" />
                <div className="tru-why-card-premium-content">
                  <h3 className="tru-ai-steps-title" style={{ fontSize: '24px', marginBottom: '8px' }}>
                    Why <span className="tru-ai-gradient-text">TruMove</span>?
                  </h3>
                  <div className="tru-ai-accent-line" style={{ marginBottom: '6px' }} />
                  <p className="tru-ai-steps-subtitle" style={{ maxWidth: 'none' }}>
                    Skip the van line middleman. Get matched with vetted carriers who compete for your business.
                  </p>
                  
                  {/* Mission Paragraph - Larger font */}
                  <p className="tru-why-mission-paragraph tru-why-mission-large">
                    We built TruMove to cut through the complexity of the moving industry. Using AI-powered inventory scanning and live video consultations, we understand your move better than anyone. Then we vet carriers through verified FMCSA and DOT safety databases to match you with movers you can actually trust.
                  </p>
                  
                  {/* Inline 2-Card Feature Carousel */}
                  <div 
                    className="tru-why-inline-carousel"
                    onMouseEnter={() => setIsHeroCarouselPaused(true)}
                    onMouseLeave={() => setIsHeroCarouselPaused(false)}
                  >
                    <Carousel
                      setApi={setHeroCarouselApi}
                      opts={{ align: "start", loop: true, duration: 35 }}
                      className="tru-why-carousel"
                    >
                      <CarouselContent className="tru-why-carousel-content">
                        {[
                          { title: "Smart Carrier Match", desc: "Our algorithm finds the best carrier for your route.", image: previewCarrierVetting, route: "/vetting", action: "navigate" as const },
                          { title: "TruMove Specialist", desc: "Live video consultation for personalized guidance.", image: trudyVideoCall, route: "/book", action: "navigate" as const },
                          { title: "Inventory Builder", desc: "Build your item list room by room for accurate pricing.", image: previewAiScanner, route: "/online-estimate", action: "navigate" as const },
                          { title: "AI Room Scanner", desc: "Point your camera and AI detects furniture instantly.", image: sampleRoomLiving, route: "/scan-room", action: "navigate" as const },
                          { title: "Shipment Tracking", desc: "Track your shipment in real-time with live updates.", image: previewPropertyLookup, route: "/track", action: "navigate" as const },
                          { title: "FMCSA Verified", desc: "Real-time safety data checks from official databases.", image: scanRoomPreview, route: "/vetting", action: "navigate" as const },
                          { title: "Trudy AI Assistant", desc: "Your virtual moving assistant, available 24/7.", image: trudyAvatar, route: "", action: "openChat" as const },
                        ].map((feature, index) => (
                          <CarouselItem key={index} className="tru-why-carousel-item basis-1/3">
                            <div 
                              className="tru-why-carousel-card"
                              onClick={() => feature.action === "openChat" ? setChatOpen(true) : navigate(feature.route)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && (feature.action === "openChat" ? setChatOpen(true) : navigate(feature.route))}
                            >
                              <div className="tru-why-carousel-card-text">
                                <h4 className="tru-why-carousel-card-title">{feature.title}</h4>
                                <p className="tru-why-carousel-card-desc">{feature.desc}</p>
                              </div>
                              <div className="tru-why-carousel-card-image">
                                <img src={feature.image} alt={feature.title} />
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="tru-why-carousel-prev" />
                      <CarouselNext className="tru-why-carousel-next" />
                    </Carousel>
                  </div>
                  
                </div>
              </div>
              
            </div>
          </section>
        </div> {/* End tru-hero-wrapper */}

        {/* BLACK STATS STRIP - Section Divider */}
        <StatsStrip />

          {/* START YOUR AI INVENTORY ANALYSIS - Enhanced with Preview */}
          <section className="tru-ai-steps-section">
            <div className="tru-ai-steps-inner">
              {/* Gradient Header */}
              <h2 className="tru-ai-steps-title">
                <span className="tru-ai-gradient-text">AI</span> Inventory Analysis
              </h2>

              {/* Accent Line */}
              <div className="tru-ai-accent-line" />

              <p className="tru-ai-steps-subtitle">Take a video or pictures of your room and let us do the rest</p>
              
              
              {/* Primary CTA Button */}
              <button 
                type="button"
                onClick={() => {
                  setScanDemoRunning(true);
                  // Scroll to preview smoothly
                  setTimeout(() => {
                    scanPreviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 100);
                }}
                className="tru-ai-start-btn"
              >
                <Scan className="w-5 h-5" />
                {scanDemoRunning ? "Scanning..." : "Demo AI Analysis"}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Live Scan Preview */}
              <LiveScanPreview isRunning={scanDemoRunning} containerRef={scanPreviewRef} />
              
              {/* 3-step grid */}
              <div className="tru-ai-steps-grid">
                <div className="tru-ai-step">
                  <div className="tru-ai-step-number">1</div>
                  <div className="tru-ai-step-content">
                    <h3 className="tru-ai-step-title">Video or Photos</h3>
                    <p className="tru-ai-step-desc">Walk through rooms with your camera or upload photos.</p>
                  </div>
                </div>
                <div className="tru-ai-step">
                  <div className="tru-ai-step-number">2</div>
                  <div className="tru-ai-step-content">
                    <h3 className="tru-ai-step-title">AI Detection</h3>
                    <p className="tru-ai-step-desc">Computer vision identifies items and estimates weight/volume.</p>
                  </div>
                </div>
                <div className="tru-ai-step">
                  <div className="tru-ai-step-number">3</div>
                  <div className="tru-ai-step-content">
                    <h3 className="tru-ai-step-title">Agent Confirmation</h3>
                    <p className="tru-ai-step-desc">A live specialist reviews to ensure accuracy.</p>
                  </div>
                </div>
              </div>
              
              {/* Inventory Action Buttons */}
              <div className="tru-inventory-actions">
                <button 
                  type="button" 
                  className="tru-inventory-action-btn"
                  onClick={() => navigate("/online-estimate")}
                >
                  <Boxes className="w-5 h-5" />
                  <span>Build Inventory Manually</span>
                </button>
                <button 
                  type="button" 
                  className="tru-inventory-action-btn"
                  onClick={() => navigate("/book")}
                >
                  <Video className="w-5 h-5" />
                  <span>Prefer to talk? Book Video Consult</span>
                </button>
              </div>
            </div>
          </section>


          {/* Move Summary is now in the hero right panel */}

          {/* CONSULT SECTION - Compact */}
          <section className="tru-consult-compact">
            <div className="tru-consult-compact-inner">
              <div className="tru-consult-compact-icon">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="tru-consult-compact-content">
                <h2 className="tru-consult-compact-title">Need a real conversation?</h2>
                <p className="tru-consult-compact-text">Talk to a TruMove specialist — no pressure, no upsells.</p>
              </div>
              <div className="tru-consult-compact-actions">
                <button className="tru-consult-compact-btn tru-consult-compact-btn-video" onClick={() => navigate("/book")}>
                  <Video className="w-4 h-4" />
                  Video Consult
                </button>
                <a href="tel:+16097277647" className="tru-consult-compact-btn tru-consult-compact-btn-phone">
                  <Phone className="w-4 h-4" />
                  (609) 727-7647
                </a>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS - Compact with Parallax */}
          <StepsCompactSection navigate={navigate} />

        </div>
      </div>



      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={leadCaptureOpen}
        onClose={() => setLeadCaptureOpen(false)}
        onSubmit={handleLeadCaptureSubmit}
        targetFlow={leadCaptureTarget}
      />

    </SiteShell>
  );
}
