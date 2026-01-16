import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import SiteShell from "@/components/layout/SiteShell";
import MapboxMoveMap from "@/components/MapboxMoveMap";
import FloatingChatButton from "@/components/FloatingChatButton";
import FloatingQuoteButton from "@/components/FloatingQuoteButton";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import logoImg from "@/assets/logo.png";

import ChatModal from "@/components/chat/ChatModal";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { calculateDistance } from "@/lib/distanceCalculator";
import { calculateEstimate, formatCurrency } from "@/lib/priceCalculator";
import { 
  Shield, Video, Boxes, CheckCircle, 
  MapPin, Route, Clock, DollarSign, Headphones, Phone, ArrowRight, ArrowDown,
  CalendarIcon, Car, Package, ChevronLeft, Lock, Truck, Sparkles, Star, Users,
  Database, ChevronRight, Radar, CreditCard, ShieldCheck, BarChart3, Zap
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

const MOVE_SIZES = [
  { label: "Studio", value: "Studio" },
  { label: "1 Bed", value: "1 Bedroom" },
  { label: "2 Bed", value: "2 Bedroom" },
  { label: "3 Bed", value: "3 Bedroom" },
  { label: "4+ Bed", value: "4+ Bedroom" },
  { label: "Office", value: "Office" },
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

export default function Index() {
  const navigate = useNavigate();
  const quoteBuilderRef = useRef<HTMLDivElement>(null);
  
  // Step tracking (1-6)
  const [step, setStep] = useState(1);
  
  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [fromZip, setFromZip] = useState("");
  const [toZip, setToZip] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [moveDate, setMoveDate] = useState<Date | null>(null);
  const [size, setSize] = useState("");
  const [hasCar, setHasCar] = useState(false);
  const [needsPacking, setNeedsPacking] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhoneNum] = useState("");
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  
  // Carrier search animation states
  const [isSearchingCarriers, setIsSearchingCarriers] = useState(false);
  const [searchPhase, setSearchPhase] = useState(0);
  const [carrierCount, setCarrierCount] = useState(0);
  const [foundCarriers, setFoundCarriers] = useState(0);
  
  // Track which summary fields just updated (for animation)
  const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());
  
  // Calculate real distance
  const distance = useMemo(() => calculateDistance(fromZip, toZip), [fromZip, toZip]);
  const moveType = distance > 150 ? "long-distance" : "local";
  
  // Previous values to detect changes (for animation)
  const prevFromCity = useRef(fromCity);
  const prevToCity = useRef(toCity);
  const prevDistance = useRef(distance);
  const prevMoveDate = useRef(moveDate);
  const prevSize = useRef(size);
  const prevAddons = useRef({ hasCar, needsPacking });
  
  // Animate summary value updates
  useEffect(() => {
    const fieldsToUpdate: string[] = [];
    
    if (fromCity && fromCity !== prevFromCity.current) fieldsToUpdate.push('from');
    if (toCity && toCity !== prevToCity.current) fieldsToUpdate.push('to');
    if (distance > 0 && distance !== prevDistance.current) fieldsToUpdate.push('distance');
    if (moveDate && moveDate !== prevMoveDate.current) fieldsToUpdate.push('date');
    if (size && size !== prevSize.current) fieldsToUpdate.push('size');
    if ((hasCar !== prevAddons.current.hasCar) || (needsPacking !== prevAddons.current.needsPacking)) {
      if (hasCar || needsPacking) fieldsToUpdate.push('addons');
    }
    
    // Update refs
    prevFromCity.current = fromCity;
    prevToCity.current = toCity;
    prevDistance.current = distance;
    prevMoveDate.current = moveDate;
    prevSize.current = size;
    prevAddons.current = { hasCar, needsPacking };
    
    if (fieldsToUpdate.length > 0) {
      setUpdatedFields(new Set(fieldsToUpdate));
      const timer = setTimeout(() => setUpdatedFields(new Set()), 500);
      return () => clearTimeout(timer);
    }
  }, [fromCity, toCity, distance, moveDate, size, hasCar, needsPacking]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store lead data
    localStorage.setItem("tm_lead", JSON.stringify({
      name, fromZip, toZip, fromCity, toCity, moveDate: moveDate?.toISOString(),
      size, hasCar, needsPacking, email, phone, ts: Date.now()
    }));
    
    // Navigate directly
    navigate("/online-estimate");
  };

  // Step validation
  const canContinue = () => {
    switch (step) {
      case 1: return name.trim() && fromZip.length === 5 && fromCity;
      case 2: return toZip.length === 5 && toCity;
      case 3: return moveDate !== null;
      case 4: return size !== "";
      case 5: return true; // Options are optional
      case 6: return email.includes("@");
      default: return false;
    }
  };

  const goNext = () => {
    if (canContinue() && step < 6) {
      setStep(step + 1);
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
    <SiteShell>
      <div className="tru-page-frame">
        <div className="tru-page-inner">
        {/* HERO - Centered Form Layout */}
          <section className="tru-hero tru-hero-centered">
            {/* Hero Headline */}
            <div className="tru-hero-headline">
              <h1 className="tru-hero-title-centered">
                Let TruMove find the right mover at the best rate.
              </h1>
            </div>

            {/* Two Floating Cards Layout */}
            <div className="tru-hero-dual-cards animate-fade-in" ref={quoteBuilderRef}>
              {/* LEFT: Form Card */}
              <div className="tru-floating-form-card">
                {/* Form Header - Logo + Skip Button */}
                <div className="tru-qb-form-header">
                  <img src={logoImg} alt="TruMove" className="tru-qb-header-logo" />
                  <span className="tru-qb-form-title">Build Your Move</span>
                  <button 
                    onClick={() => setChatOpen(true)} 
                    className="tru-ai-chat-btn"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI Assistant</span>
                  </button>
                </div>

                {/* Form Content */}
                <div className="tru-floating-form-content">

                  {/* Step 1: Name + From Location */}
                  {step === 1 && (
                    <div className="tru-qb-step-content" key="step-1">
                      <h1 className="tru-qb-question tru-qb-question-decorated">Let's start with your name</h1>
                      <p className="tru-qb-subtitle">Then tell us where you're moving from</p>
                      
                      {/* Name Input */}
                      <div className="tru-qb-input-wrap" style={{ marginBottom: '16px' }}>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="tru-qb-input"
                          autoFocus
                          onKeyDown={handleKeyDown}
                        />
                      </div>

                      {/* ZIP Input - Only show after name entered */}
                      {name.trim() && (
                        <div className="tru-qb-input-wrap tru-qb-zip-wrap animate-fade-in">
                          <LocationAutocomplete
                            value={fromZip}
                            onValueChange={(val) => {
                              // Only update if it's a ZIP or partial
                              if (/^\d*$/.test(val)) {
                                handleFromZipChange(val);
                              }
                            }}
                            onLocationSelect={(city, zip) => {
                              setFromZip(zip);
                              setFromCity(city);
                              const state = city.split(',')[1]?.trim() || '';
                              triggerCarrierSearch(state);
                            }}
                            placeholder="City or ZIP code"
                            onKeyDown={handleKeyDown}
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        className="tru-qb-continue"
                        disabled={!canContinue()}
                        onClick={goNext}
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* Step 2: To Location */}
                  {step === 2 && (
                    <div className="tru-qb-step-content" key="step-2">
                      <h1 className="tru-qb-question">
                        {name.trim() 
                          ? `Hey ${name.split(' ')[0]}, where are you moving to?`
                          : "Where are you moving to?"}
                      </h1>
                      <p className="tru-qb-subtitle">Enter your destination city or ZIP code</p>
                      
                      <div className="tru-qb-input-wrap tru-qb-zip-wrap">
                        <LocationAutocomplete
                          value={toZip}
                          onValueChange={(val) => {
                            if (/^\d*$/.test(val)) {
                              handleToZipChange(val);
                            }
                          }}
                          onLocationSelect={(city, zip) => {
                            setToZip(zip);
                            setToCity(city);
                            if (fromCity) {
                              const state = city.split(',')[1]?.trim() || '';
                              triggerCarrierSearch(state);
                            }
                          }}
                          placeholder="City or ZIP code"
                          autoFocus
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                      
                      <button
                        type="button"
                        className="tru-qb-continue"
                        disabled={!canContinue()}
                        onClick={goNext}
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>

                      <button type="button" className="tru-qb-back" onClick={goBack}>
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    </div>
                  )}

                  {/* Step 3: Move Date */}
                  {step === 3 && (
                    <div className="tru-qb-step-content" key="step-3">
                      <h1 className="tru-qb-question">When would you like to move?</h1>
                      <p className="tru-qb-subtitle">This helps us match you with available carriers</p>
                      
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
                        className="tru-qb-continue"
                        disabled={!canContinue()}
                        onClick={goNext}
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>

                      <button type="button" className="tru-qb-back" onClick={goBack}>
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    </div>
                  )}

                  {/* Step 4: Move Size */}
                  {step === 4 && (
                    <div className="tru-qb-step-content" key="step-4">
                      <h1 className="tru-qb-question">What size is your move?</h1>
                      <p className="tru-qb-subtitle">This helps us estimate weight and find the right carriers</p>
                      
                      <div className="tru-qb-size-grid">
                        {MOVE_SIZES.map((s) => (
                          <button
                            key={s.value}
                            type="button"
                            className={`tru-qb-size-btn ${size === s.value ? 'is-active' : ''}`}
                            onClick={() => {
                              setSize(s.value);
                              setTimeout(() => setStep(5), 200);
                            }}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>

                      <button type="button" className="tru-qb-back" onClick={goBack}>
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    </div>
                  )}

                  {/* Step 5: Additional Options */}
                  {step === 5 && (
                    <div className="tru-qb-step-content" key="step-5">
                      <h1 className="tru-qb-question">Any additional services?</h1>
                      <p className="tru-qb-subtitle">Select any that apply (optional)</p>
                      
                      <div className="tru-qb-toggles">
                        <button
                          type="button"
                          className={`tru-qb-toggle-card ${hasCar ? 'is-active' : ''}`}
                          onClick={() => setHasCar(!hasCar)}
                        >
                          <Car className="tru-qb-toggle-icon" />
                          <div className="tru-qb-toggle-content">
                            <span className="tru-qb-toggle-title">Vehicle Transport</span>
                            <span className="tru-qb-toggle-desc">Ship a car with your move</span>
                          </div>
                          <span className="tru-qb-toggle-indicator">{hasCar ? 'Yes' : 'No'}</span>
                        </button>
                        
                        <button
                          type="button"
                          className={`tru-qb-toggle-card ${needsPacking ? 'is-active' : ''}`}
                          onClick={() => setNeedsPacking(!needsPacking)}
                        >
                          <Package className="tru-qb-toggle-icon" />
                          <div className="tru-qb-toggle-content">
                            <span className="tru-qb-toggle-title">Packing Service</span>
                            <span className="tru-qb-toggle-desc">We pack everything for you</span>
                          </div>
                          <span className="tru-qb-toggle-indicator">{needsPacking ? 'Yes' : 'No'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        className="tru-qb-continue"
                        onClick={goNext}
                      >
                        <span>Almost There</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>

                      <button type="button" className="tru-qb-back" onClick={goBack}>
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    </div>
                  )}

                  {/* Step 6: Contact */}
                  {step === 6 && (
                    <form className="tru-qb-step-content" key="step-6" onSubmit={handleSubmit}>
                      <h1 className="tru-qb-question">Build your move how you want</h1>
                      <p className="tru-qb-subtitle">Continue to our AI estimator, book a live video consult, or call us now</p>
                      
                      <div className="tru-qb-contact-fields">
                        <div className="tru-qb-input-wrap">
                          <input
                            type="email"
                            className="tru-qb-input"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                          />
                        </div>
                        
                        <div className="tru-qb-input-wrap">
                          <input
                            type="tel"
                            className="tru-qb-input"
                            placeholder="Phone (optional)"
                            value={phone}
                            onChange={(e) => setPhoneNum(e.target.value)}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="tru-qb-submit"
                        disabled={!canContinue()}
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>Proceed to AI Move Estimator</span>
                      </button>
                      
                      <div className="tru-qb-options-grid">
                        <button 
                          type="button" 
                          className="tru-qb-option-card"
                          onClick={() => navigate("/book")}
                        >
                          <Video className="w-5 h-5" />
                          <div className="tru-qb-option-text">
                            <span className="tru-qb-option-title">Book Video Consult</span>
                            <span className="tru-qb-option-desc">Live walkthrough with an expert</span>
                          </div>
                        </button>
                        <a href="tel:+16097277647" className="tru-qb-option-card">
                          <Phone className="w-5 h-5" />
                          <div className="tru-qb-option-text">
                            <span className="tru-qb-option-title">Call Now</span>
                            <span className="tru-qb-option-desc">Speak to someone immediately</span>
                          </div>
                        </a>
                      </div>

                      <button type="button" className="tru-qb-back" onClick={goBack}>
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      
                      <p className="tru-qb-disclaimer">
                        By submitting, you agree we may contact you by phone, text, or email.
                        <span className="tru-qb-disclaimer-secure"> ⭐ Your info is secure & never sold.</span>
                      </p>
                    </form>
                  )}
                </div>
                
                {/* Footer inside form card */}
                <div className="tru-floating-form-footer">
                  <span>Powered by</span>
                  <img src={logoImg} alt="TruMove" className="tru-footer-mini-logo" />
                </div>
              </div>

              {/* RIGHT: Summary Card */}
              <div className="tru-floating-summary-card">
                <div className="tru-summary-card-header">
                  <img src={logoImg} alt="TruMove" className="tru-summary-card-logo" />
                  <span>Move Summary</span>
                </div>
                
                <div className="tru-summary-card-body">
                  {/* Summary Rows */}
                  <div className="tru-summary-info-grid">
                    <div className="tru-summary-row">
                      <span className="tru-summary-label">From</span>
                      <span className={`tru-summary-value ${updatedFields.has('from') ? 'is-updated' : ''}`}>{fromCity || "—"}</span>
                    </div>
                    <div className="tru-summary-row">
                      <span className="tru-summary-label">To</span>
                      <span className={`tru-summary-value ${updatedFields.has('to') ? 'is-updated' : ''}`}>{toCity || "—"}</span>
                    </div>
                    <div className="tru-summary-row">
                      <span className="tru-summary-label">Distance</span>
                      <span className={`tru-summary-value ${updatedFields.has('distance') ? 'is-updated' : ''}`}>{distance > 0 ? `${distance.toLocaleString()} mi` : "—"}</span>
                    </div>
                    <div className="tru-summary-row">
                      <span className="tru-summary-label">Date</span>
                      <span className={`tru-summary-value ${updatedFields.has('date') ? 'is-updated' : ''}`}>{moveDate ? format(moveDate, "MMM d, yyyy") : "—"}</span>
                    </div>
                    <div className="tru-summary-row">
                      <span className="tru-summary-label">Size</span>
                      <span className={`tru-summary-value ${updatedFields.has('size') ? 'is-updated' : ''}`}>{size || "—"}</span>
                    </div>
                    <div className="tru-summary-row">
                      <span className="tru-summary-label">Add-ons</span>
                      <span className={`tru-summary-value ${updatedFields.has('addons') ? 'is-updated' : ''}`}>
                        {(hasCar || needsPacking) 
                          ? [hasCar && "Vehicle", needsPacking && "Packing"].filter(Boolean).join(", ")
                          : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Estimate Box */}
                  <Link to="/online-estimate" className="tru-summary-skip-cta">
                    <Zap className="w-5 h-5" />
                    <span>Skip to AI Move Estimator</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  {/* Map Area */}
                  <div className="tru-summary-map">
                    <MapboxMoveMap fromZip={fromZip} toZip={toZip} />
                  </div>

                  {/* Stats Row */}
                  {distance > 0 && (
                    <div className="tru-summary-map-stats">
                      <div className="tru-summary-stat">
                        <Route className="w-4 h-4" />
                        <span>{distance.toLocaleString()} miles</span>
                      </div>
                      <div className="tru-summary-stat">
                        <Clock className="w-4 h-4" />
                        <span>~{Math.ceil(distance / 500)} day{Math.ceil(distance / 500) > 1 ? 's' : ''} transit</span>
                      </div>
                    </div>
                  )}
              </div>
            </div>
            
            {/* Quick Tools Sidebar - 3rd column */}
            <div className="tru-quick-tools-sidebar">
              <Link to="/online-estimate" className="tru-quick-tool" title="AI Inventory Builder">
                <Sparkles className="w-5 h-5" />
                <span className="tru-quick-tool-label">AI Inventory</span>
              </Link>
              <Link to="/vetting" className="tru-quick-tool" title="FMCSA Carrier Lookup">
                <Database className="w-5 h-5" />
                <span className="tru-quick-tool-label">FMCSA Lookup</span>
              </Link>
              <Link to="/book" className="tru-quick-tool" title="Video Walkthrough">
                <Video className="w-5 h-5" />
                <span className="tru-quick-tool-label">Video Consult</span>
              </Link>
              <a href="tel:+16097277647" className="tru-quick-tool" title="Move Specialists">
                <Headphones className="w-5 h-5" />
                <span className="tru-quick-tool-label">Call Us</span>
              </a>
            </div>
          </div>
          </section>

          {/* TRUST STRIP */}
          <section className="tru-trust-strip">
            <div className="tru-trust-strip-inner">
              <div className="tru-trust-strip-item">
                <Shield className="w-4 h-4" />
                <span>USDOT Compliant</span>
              </div>
              <div className="tru-trust-strip-item">
                <CheckCircle className="w-4 h-4" />
                <span>Bonded & Insured</span>
              </div>
              <div className="tru-trust-strip-item">
                <Truck className="w-4 h-4" />
                <span>FMCSA Authorized</span>
              </div>
              <div className="tru-trust-strip-item">
                <Star className="w-4 h-4" />
                <span>Licensed Broker</span>
              </div>
              <div className="tru-trust-strip-item">
                <Users className="w-4 h-4" />
                <span>2,400+ Moves Completed</span>
              </div>
            </div>
          </section>

          {/* CONSULT SECTION - Video & Phone */}
          <section className="tru-consult-wrap">
            <div className="tru-consult-inner">
              <div className="tru-consult-content">
                <div className="tru-consult-icon-wrap">
                  <Headphones className="w-8 h-8" />
                </div>
                <h2 className="tru-consult-title">Need a real conversation?</h2>
                <p className="tru-consult-text">
                  Talk to a TruMove specialist. We'll review your quote line-by-line, 
                  vet your movers together, and answer every question — no pressure, no upsells.
                </p>
                <div className="tru-consult-actions">
                  <button className="tru-consult-btn tru-consult-btn-video" onClick={() => navigate("/book")}>
                    <Video className="w-5 h-5" />
                    <span>Book a Video Consult</span>
                  </button>
                  <a href="tel:+16097277647" className="tru-consult-btn tru-consult-btn-phone">
                    <Phone className="w-5 h-5" />
                    <span>Call (609) 727-7647</span>
                  </a>
                </div>
              </div>
              <div className="tru-consult-features">
                <div className="tru-consult-feature">
                  <CheckCircle className="w-5 h-5" />
                  <span>Walk through your home virtually</span>
                </div>
                <div className="tru-consult-feature">
                  <CheckCircle className="w-5 h-5" />
                  <span>Get accurate quotes based on real items</span>
                </div>
                <div className="tru-consult-feature">
                  <CheckCircle className="w-5 h-5" />
                  <span>Ask questions about carriers and routes</span>
                </div>
                <div className="tru-consult-feature">
                  <CheckCircle className="w-5 h-5" />
                  <span>No obligation — just honest answers</span>
                </div>
              </div>
            </div>
          </section>

          {/* HOW TRUMOVE WORKS */}
          <section className="tru-diff-wrap">
            <div className="tru-diff-inner">
              <div className="tru-diff-kicker">HOW IT WORKS</div>
              <h2 className="tru-diff-title">Get matched with the right mover at the best rate.</h2>
              <p className="tru-diff-sub">We use federal SAFER Web data to analyze carriers, rates, and availability — so you don't have to.</p>
              
              <div className="tru-diff-grid">
                <article className="tru-diff-card" onClick={() => navigate("/online-estimate")}>
                  <div className="tru-diff-icon"><Boxes className="w-6 h-6" /></div>
                  <h3 className="tru-diff-card-title">Build Your Inventory</h3>
                  <p className="tru-diff-card-text">Use our AI-powered tools to create your item list. We calculate weight and volume so estimates are based on real data — not guesses.</p>
                  <span className="tru-diff-cta">Try the Inventory Builder <ArrowRight className="w-3.5 h-3.5" /></span>
                </article>

                <article className="tru-diff-card" onClick={() => navigate("/online-estimate")}>
                  <div className="tru-diff-icon"><Radar className="w-6 h-6" /></div>
                  <h3 className="tru-diff-card-title">Get Matched with Carriers</h3>
                  <p className="tru-diff-card-text">We analyze federal SAFER Web data, carrier availability, and rates to match you with the right mover at the best price.</p>
                  <span className="tru-diff-cta">Get Your Estimate <ArrowRight className="w-3.5 h-3.5" /></span>
                </article>

                <article className="tru-diff-card" onClick={() => navigate("/online-estimate")}>
                  <div className="tru-diff-icon"><ShieldCheck className="w-6 h-6" /></div>
                  <h3 className="tru-diff-card-title">Book with Confidence</h3>
                  <p className="tru-diff-card-text">Pay through TruMove for secure transactions. We only work with licensed, vetted movers — protecting you from scams and surprises.</p>
                  <span className="tru-diff-cta">Start Your Estimate <ArrowRight className="w-3.5 h-3.5" /></span>
                </article>
              </div>
            </div>
          </section>

          {/* LONG DISTANCE EXPERTISE */}
          <section className="tru-expertise-wrap">
            <div className="tru-expertise-inner">
              <div className="tru-expertise-content">
                <div className="tru-expertise-kicker">LONG-DISTANCE EXPERTS</div>
                <h2 className="tru-expertise-title">Built for moves over 150 miles.</h2>
                <p className="tru-expertise-text">
                  Cross-country moves require interstate compliance, route optimization, and precise timing. 
                  We specialize in long-haul relocations — and our AI is trained on thousands of routes.
                </p>
                <div className="tru-expertise-stats">
                  <div className="tru-expertise-stat">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <div className="tru-expertise-stat-num">50</div>
                      <div className="tru-expertise-stat-label">States Covered</div>
                    </div>
                  </div>
                  <div className="tru-expertise-stat">
                    <Route className="w-5 h-5 text-primary" />
                    <div>
                      <div className="tru-expertise-stat-num">1,200+</div>
                      <div className="tru-expertise-stat-label">Avg. Miles per Move</div>
                    </div>
                  </div>
                  <div className="tru-expertise-stat">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <div className="tru-expertise-stat-num">0</div>
                      <div className="tru-expertise-stat-label">Spam Calls, Ever</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tru-expertise-map">
                {/* Use form ZIPs if available, otherwise show sample route */}
                <div className="tru-map-placeholder">
                  <MapPin className="w-8 h-8 text-primary/40" />
                  <span>Enter your route above to see it on the map</span>
                </div>
              </div>
            </div>
          </section>

          {/* HOW WE VET CARRIERS */}
          <section className="tru-vetting-wrap">
            <div className="tru-vetting-inner">
              <div className="tru-vetting-kicker">CARRIER VETTING</div>
              <h2 className="tru-vetting-title">Every mover goes through 4 stages before you see them.</h2>
              <p className="tru-vetting-sub">If their performance drops, they're automatically removed.</p>
              
              <div className="tru-vetting-steps">
                <div className="tru-vetting-step">
                  <div className="tru-vetting-step-num">1</div>
                  <div className="tru-vetting-step-title">Pre-Screen</div>
                  <div className="tru-vetting-step-text">USDOT & MC verification, active authority check</div>
                </div>
                <div className="tru-vetting-connector"></div>
                <div className="tru-vetting-step">
                  <div className="tru-vetting-step-num">2</div>
                  <div className="tru-vetting-step-title">Compliance</div>
                  <div className="tru-vetting-step-text">Insurance minimums, safety ratings, fleet inspection</div>
                </div>
                <div className="tru-vetting-connector"></div>
                <div className="tru-vetting-step">
                  <div className="tru-vetting-step-num">3</div>
                  <div className="tru-vetting-step-title">Reputation</div>
                  <div className="tru-vetting-step-text">Review analysis, complaint history, claim resolution</div>
                </div>
                <div className="tru-vetting-connector"></div>
                <div className="tru-vetting-step">
                  <div className="tru-vetting-step-num">4</div>
                  <div className="tru-vetting-step-title">Live Scoring</div>
                  <div className="tru-vetting-step-text">Ongoing performance monitoring, customer feedback loops</div>
                </div>
              </div>

              <div className="tru-vetting-cta">
                <button className="tru-btn-secondary-lg" onClick={() => navigate("/vetting")}>
                  <span>Learn More About Our Vetting</span><ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>


          {/* SMART ESTIMATES & PROTECTION */}
          <section className="tru-mission-wrap">
            <div className="tru-mission-inner">
              <div className="tru-guarantee-wrap">
                <div className="tru-guarantee-card">
                  <div>
                    <div className="tru-guarantee-tag"><span className="tru-guarantee-tag-dot"></span><span>Smart Estimates</span></div>
                    <div className="tru-guarantee-title">Realistic pricing based on federal data.</div>
                    <div className="tru-guarantee-text">Our estimates are calculated using federally regulated data, carrier rates, and real availability — not guesswork.</div>
                    <ul className="tru-guarantee-list">
                      <li><strong>Data-driven estimates</strong> — based on federal SAFER Web data</li>
                      <li><strong>Payment protection</strong> — pay through TruMove, not the mover</li>
                      <li><strong>Vetted movers only</strong> — licensed, insured, and monitored</li>
                      <li><strong>24/7 tracking</strong> — know where your stuff is, always</li>
                      <li><strong>Dedicated support</strong> — one specialist for your entire move</li>
                    </ul>
                  </div>
                  <div className="tru-guarantee-side">
                    <div className="tru-guarantee-side-stats">
                      <div className="tru-guarantee-side-stat">
                        <Database className="w-5 h-5 text-primary" />
                        <div>
                          <span className="tru-guarantee-side-num">Federal</span>
                          <span className="tru-guarantee-side-label">SAFER Web Data</span>
                        </div>
                      </div>
                      <div className="tru-guarantee-side-stat">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <div>
                          <span className="tru-guarantee-side-num">Secure</span>
                          <span className="tru-guarantee-side-label">Payment Protection</span>
                        </div>
                      </div>
                      <div className="tru-guarantee-side-stat">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <div>
                          <span className="tru-guarantee-side-num">Vetted</span>
                          <span className="tru-guarantee-side-label">Licensed Movers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tru-trust-wrap">
                <div className="tru-trust-row">
                  <span className="tru-trust-label">Every mover on our platform is verified.</span>
                  {["FMCSA Authorized", "USDOT Compliant", "Insured & Bonded"].map(b => (
                    <span key={b} className="tru-trust-badge"><span className="tru-trust-dot"></span><span>{b}</span></span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="tru-final-cta-wrap">
            <div className="tru-final-cta-inner">
              <h2 className="tru-final-cta-title">Ready to move?</h2>
              <p className="tru-final-cta-sub">Get your free quote in 60 seconds. No spam, no callbacks you didn't ask for.</p>
              <div className="tru-final-cta-actions">
                <button className="tru-btn-primary-xl" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <span>Build Your Quote</span><ArrowRight className="w-5 h-5" />
                </button>
                <div className="tru-final-cta-or">or</div>
                <a href="tel:+18005551234" className="tru-final-cta-phone">
                  <Phone className="w-4 h-4" />
                  <span>Call (800) 555-1234</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>


      {/* Chat Modal */}
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      
      {/* Floating AI Move Builder Button */}
      <FloatingQuoteButton quoteBuilderRef={quoteBuilderRef} onChatOpen={() => setChatOpen(true)} />

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </SiteShell>
  );
}
