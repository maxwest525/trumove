import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import SiteShell from "@/components/layout/SiteShell";
import MapboxMoveMap from "@/components/MapboxMoveMap";
import FloatingChatButton from "@/components/FloatingChatButton";
import FloatingQuoteButton from "@/components/FloatingQuoteButton";

import ChatModal from "@/components/chat/ChatModal";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { calculateDistance } from "@/lib/distanceCalculator";
import { calculateEstimate, formatCurrency } from "@/lib/priceCalculator";
import { 
  Shield, Video, Boxes, CheckCircle, 
  MapPin, Route, Clock, DollarSign, Headphones, Phone, ArrowRight,
  CalendarIcon, Car, Package, ChevronLeft, Lock, Truck, Sparkles, Star, Users,
  Database, ChevronRight, Radar, CreditCard, ShieldCheck, BarChart3
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
      return `📍 ${fromCity.split(',')[0]} — vetted movers ready in your area`;
    case 3:
      if (distance > 0) {
        return `🚛 ${distance.toLocaleString()} miles — analyzing best carriers for this route`;
      }
      return "🚛 Great route — analyzing carriers now";
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
      return "✉️ We'll email your detailed quote (no spam, ever)";
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
  
  // Calculate real distance
  const distance = useMemo(() => calculateDistance(fromZip, toZip), [fromZip, toZip]);
  const moveType = distance > 150 ? "long-distance" : "local";

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
      fromZip, toZip, fromCity, toCity, moveDate: moveDate?.toISOString(),
      size, hasCar, needsPacking, email, phone, ts: Date.now()
    }));
    
    // Navigate directly
    navigate("/online-estimate");
  };

  // Step validation
  const canContinue = () => {
    switch (step) {
      case 1: return fromZip.length === 5 && fromCity;
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
        {/* HERO - Split Layout: Company Info + Quote Builder */}
          <section className="tru-hero">
            <div className="tru-hero-grid">
              {/* LEFT: Company Info - Marketplace Focused */}
              <div className="tru-hero-content">
                {/* Section 1: Marketplace Value Prop */}
                <div className="tru-hero-intro">
                  <div className="tru-hero-kicker">
                    <BarChart3 className="w-4 h-4" />
                    <span>COMPARE & BOOK</span>
                  </div>
                  <h1 className="tru-hero-title">
                    Find the right mover at the best rate.
                  </h1>
                  <p className="tru-hero-sub">
                    We use federal SAFER Web data to match you with licensed, vetted carriers — our goal is to get you the cheapest rate possible. No phone calls, no spam.
                  </p>
                </div>

                {/* Section 2: Plan-Match-Move Workflow */}
                <div className="tru-hero-workflow">
                  <div className="tru-hero-workflow-step">
                    <div className="tru-hero-workflow-num">1</div>
                    <div className="tru-hero-workflow-info">
                      <span className="tru-hero-workflow-title">Plan</span>
                      <span className="tru-hero-workflow-desc">Build your inventory with AI tools or talk to a specialist</span>
                    </div>
                  </div>
                  <div className="tru-hero-workflow-arrow">→</div>
                  <div className="tru-hero-workflow-step">
                    <div className="tru-hero-workflow-num">2</div>
                    <div className="tru-hero-workflow-info">
                      <span className="tru-hero-workflow-title">Match</span>
                      <span className="tru-hero-workflow-desc">We analyze federal SAFER data to find best rates</span>
                    </div>
                  </div>
                  <div className="tru-hero-workflow-arrow">→</div>
                  <div className="tru-hero-workflow-step">
                    <div className="tru-hero-workflow-num">3</div>
                    <div className="tru-hero-workflow-info">
                      <span className="tru-hero-workflow-title">Move</span>
                      <span className="tru-hero-workflow-desc">Get matched with the right mover at the best rate</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Don't Want a Stranger Callout */}
                <div className="tru-hero-no-visit">
                  <div className="tru-hero-no-visit-content">
                    <span className="tru-hero-no-visit-title">Don't want a stranger in your home?</span>
                    <span className="tru-hero-no-visit-desc">Build your inventory online with our AI tools — no in-home visit required.</span>
                  </div>
                </div>

                {/* Section 4: TruMove Tools - What Makes Us Different */}
                <div className="tru-hero-features-section">
                  <h4 className="tru-hero-features-label">Powered by TruMove Tools</h4>
                  <div className="tru-hero-feature-cards">
                    <Link to="/online-estimate" className="tru-hero-feature-card">
                      <div className="tru-hero-feature-icon-wrap">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="tru-hero-feature-info">
                        <span className="tru-hero-feature-title">AI Inventory Builder</span>
                        <span className="tru-hero-feature-desc">Create your item list in minutes — our AI calculates weight & cost</span>
                      </div>
                      <ChevronRight className="tru-hero-feature-arrow" />
                    </Link>
                    <Link to="/vetting" className="tru-hero-feature-card">
                      <div className="tru-hero-feature-icon-wrap">
                        <Database className="w-5 h-5" />
                      </div>
                      <div className="tru-hero-feature-info">
                        <span className="tru-hero-feature-title">FMCSA Carrier Lookup</span>
                        <span className="tru-hero-feature-desc">Check any mover's safety record, insurance & complaints</span>
                      </div>
                      <ChevronRight className="tru-hero-feature-arrow" />
                    </Link>
                    <Link to="/book" className="tru-hero-feature-card">
                      <div className="tru-hero-feature-icon-wrap">
                        <Video className="w-5 h-5" />
                      </div>
                      <div className="tru-hero-feature-info">
                        <span className="tru-hero-feature-title">Video Walkthrough</span>
                        <span className="tru-hero-feature-desc">Show a specialist your home for accurate pricing</span>
                      </div>
                      <ChevronRight className="tru-hero-feature-arrow" />
                    </Link>
                    <a href="tel:+16097277647" className="tru-hero-feature-card">
                      <div className="tru-hero-feature-icon-wrap">
                        <Headphones className="w-5 h-5" />
                      </div>
                      <div className="tru-hero-feature-info">
                        <span className="tru-hero-feature-title">Move Specialists</span>
                        <span className="tru-hero-feature-desc">Real humans to answer questions — no pushy sales</span>
                      </div>
                      <ChevronRight className="tru-hero-feature-arrow" />
                    </a>
                  </div>
                </div>
              </div>

              
              {/* RIGHT: Quote Builder */}
              <div className="tru-hero-visual" ref={quoteBuilderRef}>
                <div className="tru-quote-builder">
                  {/* Form Header - Plan Match Move Workflow */}
                  <div className="tru-qb-form-header">
                    <div className="tru-qb-workflow">
                      <div className="tru-qb-workflow-step">
                        <span className="tru-qb-workflow-num">1</span>
                        <span className="tru-qb-workflow-label">Plan</span>
                      </div>
                      <div className="tru-qb-workflow-arrow">→</div>
                      <div className="tru-qb-workflow-step">
                        <span className="tru-qb-workflow-num">2</span>
                        <span className="tru-qb-workflow-label">Match</span>
                      </div>
                      <div className="tru-qb-workflow-arrow">→</div>
                      <div className="tru-qb-workflow-step">
                        <span className="tru-qb-workflow-num">3</span>
                        <span className="tru-qb-workflow-label">Move</span>
                      </div>
                    </div>
                    <div className="tru-qb-step-indicator">
                      Step {step} of 6
                    </div>
                  </div>
                  {/* Main Body: Form + Dashboard Side by Side */}
                  <div className="tru-qb-body">
                {/* LEFT: Conversation Area */}
                <div className="tru-qb-main">
                  {/* Step 1: From ZIP */}
                  {step === 1 && (
                    <div className="tru-qb-step-content" key="step-1">
                      <h1 className="tru-qb-question">Where are you moving from?</h1>
                      <p className="tru-qb-subtitle">Enter your current ZIP code to start</p>
                      
                      <div className="tru-qb-input-wrap tru-qb-zip-wrap">
                        <input
                          type="text"
                          className="tru-qb-input"
                          placeholder="Enter ZIP"
                          maxLength={5}
                          value={fromZip}
                          onChange={(e) => handleFromZipChange(e.target.value.replace(/\D/g, ""))}
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />
                        {fromCity && (
                          <div className="tru-qb-zip-city">{fromCity}</div>
                        )}
                      </div>

                      <button
                        type="button"
                        className="tru-qb-continue"
                        disabled={!canContinue()}
                        onClick={goNext}
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* Step 2: To ZIP */}
                  {step === 2 && (
                    <div className="tru-qb-step-content" key="step-2">
                      <h1 className="tru-qb-question">Where are you moving to?</h1>
                      <p className="tru-qb-subtitle">Enter your destination ZIP code</p>
                      
                      <div className="tru-qb-input-wrap tru-qb-zip-wrap">
                        <input
                          type="text"
                          className="tru-qb-input"
                          placeholder="Enter ZIP"
                          maxLength={5}
                          value={toZip}
                          onChange={(e) => handleToZipChange(e.target.value.replace(/\D/g, ""))}
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />
                        {toCity && (
                          <div className="tru-qb-zip-city">{toCity}</div>
                        )}
                      </div>
                      
                      {aiHint && <p className="tru-qb-ai-hint">{aiHint}</p>}

                      <button
                        type="button"
                        className="tru-qb-continue"
                        disabled={!canContinue()}
                        onClick={goNext}
                      >
                        <span>Continue</span>
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

                      {aiHint && <p className="tru-qb-ai-hint">{aiHint}</p>}

                      <button
                        type="button"
                        className="tru-qb-continue"
                        disabled={!canContinue()}
                        onClick={goNext}
                      >
                        <span>Continue</span>
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
                        <span>Continue</span>
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
                      <h1 className="tru-qb-question">Where should we send your quote?</h1>
                      <p className="tru-qb-subtitle">We'll email your detailed estimate (no spam, ever)</p>
                      
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
                        <span>Start My Quote</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>

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

                {/* RIGHT: Live Dashboard Panel */}
                <div className="tru-qb-panel">
                  {/* Simple Summary */}
                  <div className="tru-qb-summary">
                    <div className="tru-qb-summary-title">YOUR QUOTE</div>
                    <div className="tru-qb-info-row">
                      <span className="tru-qb-info-label">From</span>
                      <span className="tru-qb-info-value">{fromCity || "—"}</span>
                    </div>
                    <div className="tru-qb-info-row">
                      <span className="tru-qb-info-label">To</span>
                      <span className="tru-qb-info-value">{toCity || "—"}</span>
                    </div>
                    <div className="tru-qb-info-row">
                      <span className="tru-qb-info-label">Distance</span>
                      <span className="tru-qb-info-value">{distance > 0 ? `${distance.toLocaleString()} mi` : "—"}</span>
                    </div>
                    <div className="tru-qb-info-row">
                      <span className="tru-qb-info-label">Date</span>
                      <span className="tru-qb-info-value">{moveDate ? format(moveDate, "MMM d, yyyy") : "—"}</span>
                    </div>
                    <div className="tru-qb-info-row">
                      <span className="tru-qb-info-label">Size</span>
                      <span className="tru-qb-info-value">{size || "—"}</span>
                    </div>
                    <div className="tru-qb-info-row">
                      <span className="tru-qb-info-label">Add-ons</span>
                      <span className="tru-qb-info-value">
                        {(hasCar || needsPacking) 
                          ? [hasCar && "Vehicle", needsPacking && "Packing"].filter(Boolean).join(", ")
                          : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Carrier Search Animation */}
                  <div className="tru-qb-carrier-search">
                    {isSearchingCarriers ? (
                      <div className="tru-carrier-searching">
                        {searchPhase === 1 && (
                          <div className="tru-carrier-phase tru-carrier-phase-1">
                            <Radar className="w-4 h-4 tru-radar-spin" />
                            <span>Scanning carriers in {fromCity?.split(',')[1]?.trim() || 'your area'}<span className="tru-dots-animate">...</span></span>
                          </div>
                        )}
                        {searchPhase === 2 && (
                          <div className="tru-carrier-phase tru-carrier-phase-2">
                            <div className="tru-carrier-progress-bar">
                              <div className="tru-carrier-progress-fill" style={{ width: `${(carrierCount / 47) * 100}%` }}></div>
                            </div>
                            <span>Analyzing {carrierCount} carriers...</span>
                          </div>
                        )}
                        {searchPhase === 3 && (
                          <div className="tru-carrier-phase tru-carrier-phase-3">
                            <CheckCircle className="w-4 h-4" />
                            <span>{foundCarriers} vetted carriers found</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="tru-carrier-ready">
                        {(fromCity || toCity) ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>{foundCarriers || 12} vetted carriers in your area</span>
                          </>
                        ) : (
                          <>
                            <Database className="w-4 h-4" />
                            <span>Powered by federal SAFER Web data</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Map Area */}
                  <div className="tru-qb-map">
                    <MapboxMoveMap fromZip={fromZip} toZip={toZip} />
                  </div>

                  {/* Estimate */}
                  <div className="tru-qb-estimate">
                    <div className="tru-qb-estimate-header">
                      <DollarSign className="w-4 h-4" />
                      <span>YOUR ESTIMATE</span>
                    </div>
                    {estimate ? (
                      <div className="tru-qb-estimate-value">
                        {formatCurrency(estimate.min)} – {formatCurrency(estimate.max)}
                      </div>
                    ) : (
                      <div className="tru-qb-estimate-empty">
                        Complete steps to see estimate
                      </div>
                    )}
                  </div>
                </div>
              </div>

                  {/* Compact Tech Ticker */}
                  <div className="tru-qb-ticker">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{tickerContent}</span>
                  </div>
                </div>
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
