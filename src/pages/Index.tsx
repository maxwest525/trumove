import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import SiteShell from "@/components/layout/SiteShell";
import MoveMap from "@/components/MoveMap";
import TechIndicatorStrip from "@/components/TechIndicatorStrip";
import FloatingChatButton from "@/components/FloatingChatButton";
import MoveGlance from "@/components/estimate/MoveGlance";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { calculateDistance } from "@/lib/distanceCalculator";
import { calculateEstimate, formatCurrency } from "@/lib/priceCalculator";
import logo from "@/assets/logo.png";
import { 
  Shield, Cpu, Video, Boxes, Calculator, Search, CheckCircle, 
  MapPin, Route, Clock, DollarSign, Headphones, Phone, ArrowRight,
  CalendarIcon, Sparkles, Car, Package, ChevronLeft
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
function getAiMessage(step: number, fromCity: string, toCity: string, distance: number, moveDate: Date | null): string {
  switch (step) {
    case 2:
      return `Perfect! ${fromCity.split(',')[0]} — we have vetted movers ready in your area.`;
    case 3:
      if (distance > 0) {
        return `${distance.toLocaleString()} miles! Analyzing the best carriers for this route...`;
      }
      return "Great route! We're analyzing the best carriers for you.";
    case 4:
      if (moveDate) {
        const month = format(moveDate, 'MMMM');
        const isLowSeason = [0, 1, 2, 10, 11].includes(moveDate.getMonth());
        if (isLowSeason) {
          return `${month} is a great time to move — typically 15-20% lower demand than summer.`;
        }
        return `${month} is peak season, but we'll find you competitive rates.`;
      }
      return "Great timing! Let's find the best carriers for your date.";
    case 5:
      return "Almost there! Select your move size to see your estimate.";
    case 6:
      return "Perfect! Last step — where should we send your detailed quote?";
    default:
      return "";
  }
}

export default function Index() {
  const navigate = useNavigate();
  
  // Step tracking (1-6)
  const [step, setStep] = useState(1);
  
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
  
  // Calculate real distance
  const distance = useMemo(() => calculateDistance(fromZip, toZip), [fromZip, toZip]);
  const moveType = distance > 150 ? "long-distance" : "local";

  // AI message for current step
  const aiMessage = useMemo(() => 
    getAiMessage(step, fromCity, toCity, distance, moveDate),
    [step, fromCity, toCity, distance, moveDate]
  );

  // Handle ZIP changes
  const handleFromZipChange = useCallback(async (value: string) => {
    setFromZip(value);
    if (value.length === 5) {
      const city = await lookupZip(value);
      setFromCity(city || "");
    } else {
      setFromCity("");
    }
  }, []);

  const handleToZipChange = useCallback(async (value: string) => {
    setToZip(value);
    if (value.length === 5) {
      const city = await lookupZip(value);
      setToCity(city || "");
    } else {
      setToCity("");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store lead data
    localStorage.setItem("tm_lead", JSON.stringify({
      fromZip, toZip, fromCity, toCity, moveDate: moveDate?.toISOString(),
      size, hasCar, needsPacking, email, phone, ts: Date.now()
    }));
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

  // Render completed badges
  const renderCompletedBadges = () => {
    const badges = [];
    if (step > 1 && fromCity) {
      badges.push(
        <span key="from" className="tru-confirmed-badge">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{fromCity}</span>
        </span>
      );
    }
    if (step > 2 && toCity) {
      badges.push(
        <span key="to" className="tru-confirmed-badge">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{toCity}</span>
        </span>
      );
    }
    if (step > 3 && moveDate) {
      badges.push(
        <span key="date" className="tru-confirmed-badge">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{format(moveDate, "MMM d, yyyy")}</span>
        </span>
      );
    }
    if (step > 4 && size) {
      badges.push(
        <span key="size" className="tru-confirmed-badge">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{size}</span>
        </span>
      );
    }
    return badges.length > 0 ? (
      <div className="tru-confirmed-badges">{badges}</div>
    ) : null;
  };

  // Render progress dots
  const renderProgressDots = () => (
    <div className="tru-progress-dots">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <span
          key={n}
          className={`tru-progress-dot ${n < step ? 'is-complete' : ''} ${n === step ? 'is-current' : ''}`}
        />
      ))}
    </div>
  );

  return (
    <SiteShell>
      <div className="tru-page-frame">
        <div className="tru-page-inner">
          {/* HERO - Side-by-side: Form + Glance Dashboard */}
          <section className="tru-hero">
            <div className="tru-hero-split">
              {/* LEFT: The Conversation Card */}
              <div className="tru-form-card">
                {/* Card Header: Logo only */}
                <div className="tru-form-header">
                  <div className="tru-form-header-top">
                    <img src={logo} alt="TruMove" className="tru-form-logo" />
                  </div>
                </div>

                {/* AI Feedback Bubble */}
                {step > 1 && aiMessage && (
                  <div className="tru-ai-bubble">
                    <div className="tru-ai-icon">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <p className="tru-ai-text">{aiMessage}</p>
                  </div>
                )}

                {/* TYPEFORM STEPS */}
                <div className="tru-focus-hero">
                  {/* Step 1: From ZIP */}
                  {step === 1 && (
                    <div className="tru-focus-step">
                      <h1 className="tru-focus-question">Where are you moving from?</h1>
                      <p className="tru-focus-subtitle">Enter your current ZIP code</p>
                      
                      <div className="tru-focus-input-wrap">
                        <input
                          type="text"
                          className="tru-focus-input"
                          placeholder="Enter ZIP..."
                          maxLength={5}
                          value={fromZip}
                          onChange={(e) => handleFromZipChange(e.target.value.replace(/\D/g, ""))}
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />
                      </div>
                      
                      {fromCity && (
                        <div className="tru-focus-city-badge">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{fromCity}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        className="tru-focus-continue"
                        disabled={!canContinue()}
                        onClick={goNext}
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      
                      <p className="tru-focus-hint">Press Enter ↵</p>
                    </div>
                  )}

                  {/* Step 2: To ZIP */}
                  {step === 2 && (
                    <div className="tru-focus-step">
                      <h1 className="tru-focus-question">Where are you moving to?</h1>
                      <p className="tru-focus-subtitle">Enter your destination ZIP code</p>
                      
                      <div className="tru-focus-input-wrap">
                        <input
                          type="text"
                          className="tru-focus-input"
                          placeholder="Enter ZIP..."
                          maxLength={5}
                          value={toZip}
                          onChange={(e) => handleToZipChange(e.target.value.replace(/\D/g, ""))}
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />
                      </div>
                      
                      {toCity && (
                        <div className="tru-focus-city-badge">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{toCity}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        className="tru-focus-continue"
                        disabled={!canContinue()}
                        onClick={goNext}
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>

                      <button type="button" className="tru-focus-back" onClick={goBack}>
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    </div>
                  )}

                  {/* Step 3: Move Date */}
                  {step === 3 && (
                    <div className="tru-focus-step">
                      <h1 className="tru-focus-question">When would you like to move?</h1>
                      <p className="tru-focus-subtitle">This helps us match you with available carriers</p>
                      
                      <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                        <PopoverTrigger asChild>
                          <button type="button" className="tru-focus-date-btn">
                            <CalendarIcon className="tru-focus-input-icon" />
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

                      <button
                        type="button"
                        className="tru-focus-continue"
                        disabled={!canContinue()}
                        onClick={goNext}
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>

                      <button type="button" className="tru-focus-back" onClick={goBack}>
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    </div>
                  )}

                  {/* Step 4: Move Size */}
                  {step === 4 && (
                    <div className="tru-focus-step">
                      <h1 className="tru-focus-question">What size is your move?</h1>
                      <p className="tru-focus-subtitle">This helps us estimate weight and find the right carriers</p>
                      
                      <div className="tru-focus-size-grid">
                        {MOVE_SIZES.map((s) => (
                          <button
                            key={s.value}
                            type="button"
                            className={`tru-focus-size-btn ${size === s.value ? 'is-active' : ''}`}
                            onClick={() => {
                              setSize(s.value);
                              setTimeout(() => setStep(5), 200);
                            }}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>

                      <button type="button" className="tru-focus-back" onClick={goBack}>
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    </div>
                  )}

                  {/* Step 5: Additional Options */}
                  {step === 5 && (
                    <div className="tru-focus-step">
                      <h1 className="tru-focus-question">Any additional services?</h1>
                      <p className="tru-focus-subtitle">Select any that apply (optional)</p>
                      
                      <div className="tru-focus-toggles-vertical">
                        <button
                          type="button"
                          className={`tru-focus-toggle-card ${hasCar ? 'is-active' : ''}`}
                          onClick={() => setHasCar(!hasCar)}
                        >
                          <Car className="tru-focus-toggle-icon" />
                          <div className="tru-focus-toggle-content">
                            <span className="tru-focus-toggle-title">Vehicle Transport</span>
                            <span className="tru-focus-toggle-desc">Ship a car with your move</span>
                          </div>
                          <span className="tru-focus-toggle-indicator">{hasCar ? 'Yes' : 'No'}</span>
                        </button>
                        
                        <button
                          type="button"
                          className={`tru-focus-toggle-card ${needsPacking ? 'is-active' : ''}`}
                          onClick={() => setNeedsPacking(!needsPacking)}
                        >
                          <Package className="tru-focus-toggle-icon" />
                          <div className="tru-focus-toggle-content">
                            <span className="tru-focus-toggle-title">Packing Service</span>
                            <span className="tru-focus-toggle-desc">We pack everything for you</span>
                          </div>
                          <span className="tru-focus-toggle-indicator">{needsPacking ? 'Yes' : 'No'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        className="tru-focus-continue tru-btn-mechanical"
                        onClick={goNext}
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>

                      <button type="button" className="tru-focus-back" onClick={goBack}>
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    </div>
                  )}

                  {/* Step 6: Contact */}
                  {step === 6 && (
                    <form className="tru-focus-step" onSubmit={handleSubmit}>
                      <h1 className="tru-focus-question">Where should we send your quote?</h1>
                      <p className="tru-focus-subtitle">We'll email your detailed estimate (no spam, ever)</p>
                      
                      <div className="tru-focus-contact-fields">
                        <div className="tru-focus-input-wrap">
                          <input
                            type="email"
                            className="tru-focus-input"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                          />
                        </div>
                        
                        <div className="tru-focus-input-wrap">
                          <input
                            type="tel"
                            className="tru-focus-input"
                            placeholder="Phone (optional)"
                            value={phone}
                            onChange={(e) => setPhoneNum(e.target.value)}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="tru-focus-submit"
                        disabled={!canContinue()}
                      >
                        <span>Get My Quote</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>

                      <button type="button" className="tru-focus-back" onClick={goBack}>
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      
                      <p className="tru-focus-disclaimer">
                        By submitting, you agree we may contact you by phone, text, or email, 
                        including via automated technology. Consent is not required to purchase services.
                        <span className="tru-focus-disclaimer-secure">⭐ Your info is secure & never sold.</span>
                      </p>
                    </form>
                  )}
                </div>

                {/* Progress Dots */}
                {renderProgressDots()}

                {/* Tech Indicator Strip */}
                <TechIndicatorStrip />

                {/* Footer Disclaimer */}
                <p className="tru-form-disclaimer">
                  Your info is secure & never sold.
                </p>
              </div>

              {/* RIGHT: Move at a Glance Dashboard */}
              <MoveGlance
                fromZip={fromZip}
                toZip={toZip}
                fromCity={fromCity}
                toCity={toCity}
                distance={distance}
                moveType={moveType as "local" | "long-distance"}
                moveDate={moveDate}
                size={size}
                hasCar={hasCar}
                needsPacking={needsPacking}
              />
            </div>
          </section>

          {/* WHAT MAKES TRUMOVE DIFFERENT */}
          <section className="tru-diff-wrap">
            <div className="tru-diff-inner">
              <div className="tru-diff-kicker">WHY TRUMOVE</div>
              <h2 className="tru-diff-title">The only moving platform where you're in control.</h2>
              <p className="tru-diff-sub">Most moving sites collect your info and sell it to brokers. We built something different.</p>
              
              <div className="tru-diff-grid">
                <article className="tru-diff-card" onClick={() => navigate("/online-estimate")}>
                  <div className="tru-diff-icon"><Boxes className="w-6 h-6" /></div>
                  <h3 className="tru-diff-card-title">Build Your Own Inventory</h3>
                  <p className="tru-diff-card-text">Pick rooms, add items, watch your move build itself. Our AI estimates weight and size so you know exactly what you're shipping.</p>
                  <span className="tru-diff-cta">Try the Inventory Builder <ArrowRight className="w-3.5 h-3.5" /></span>
                </article>

                <article className="tru-diff-card" onClick={() => navigate("/online-estimate")}>
                  <div className="tru-diff-icon"><Calculator className="w-6 h-6" /></div>
                  <h3 className="tru-diff-card-title">Instant AI Pricing</h3>
                  <p className="tru-diff-card-text">No waiting for callbacks. Enter your route and see a live price range in seconds — not a bait-and-switch lowball.</p>
                  <span className="tru-diff-cta">Get Your Quote <ArrowRight className="w-3.5 h-3.5" /></span>
                </article>

                <article className="tru-diff-card" onClick={() => navigate("/lookup")}>
                  <div className="tru-diff-icon"><Search className="w-6 h-6" /></div>
                  <h3 className="tru-diff-card-title">Vet Any Mover with FMCSA Data</h3>
                  <p className="tru-diff-card-text">We integrated the federal Company Snapshot database. Look up any mover's USDOT, safety record, and insurance — free.</p>
                  <span className="tru-diff-cta">Look Up a Carrier <ArrowRight className="w-3.5 h-3.5" /></span>
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

          {/* VIDEO CONSULTS */}
          <section className="tru-video-wrap">
            <div className="tru-video-inner">
              <div className="tru-video-content">
                <div className="tru-video-icon-wrap">
                  <Video className="w-8 h-8" />
                </div>
                <h2 className="tru-video-title">Need a real conversation?</h2>
                <p className="tru-video-text">
                  Book a video call with a TruMove specialist. We'll review your quote line-by-line, 
                  vet your movers together, and answer every question — no pressure, no upsells.
                </p>
                <button className="tru-btn-primary-lg" onClick={() => navigate("/book")}>
                  <span>Book a Video Consult</span><Video className="w-4 h-4" />
                </button>
              </div>
              <div className="tru-video-features">
                <div className="tru-video-feature">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Walk through your home virtually</span>
                </div>
                <div className="tru-video-feature">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Get accurate quotes based on real items</span>
                </div>
                <div className="tru-video-feature">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Ask questions about carriers and routes</span>
                </div>
                <div className="tru-video-feature">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>No obligation — just honest answers</span>
                </div>
              </div>
            </div>
          </section>

          {/* GUARANTEE */}
          <section className="tru-mission-wrap">
            <div className="tru-mission-inner">
              <div className="tru-guarantee-wrap">
                <div className="tru-guarantee-card">
                  <div>
                    <div className="tru-guarantee-tag"><span className="tru-guarantee-tag-dot"></span><span>TruMove Guarantee</span></div>
                    <div className="tru-guarantee-title">We built TruMove from bad experiences.</div>
                    <div className="tru-guarantee-text">If we wouldn't book a mover for our own families, they don't show up in your options.</div>
                    <ul className="tru-guarantee-list">
                      <li>No spam calls sold to other brokers.</li>
                      <li>No bait-and-switch pricing.</li>
                      <li>Binding quotes — the price we give is the price you pay.</li>
                      <li>24/7 tracking from pickup to delivery.</li>
                      <li>Dedicated specialist for your entire move.</li>
                    </ul>
                  </div>
                  <div className="tru-guarantee-side">
                    <div className="tru-guarantee-side-stats">
                      <div className="tru-guarantee-side-stat">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <div>
                          <span className="tru-guarantee-side-num">$0</span>
                          <span className="tru-guarantee-side-label">Hidden Fees</span>
                        </div>
                      </div>
                      <div className="tru-guarantee-side-stat">
                        <Clock className="w-5 h-5 text-primary" />
                        <div>
                          <span className="tru-guarantee-side-num">24/7</span>
                          <span className="tru-guarantee-side-label">Tracking</span>
                        </div>
                      </div>
                      <div className="tru-guarantee-side-stat">
                        <Headphones className="w-5 h-5 text-primary" />
                        <div>
                          <span className="tru-guarantee-side-num">1:1</span>
                          <span className="tru-guarantee-side-label">Dedicated Support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tru-trust-wrap">
                <div className="tru-trust-row">
                  <span className="tru-trust-label">Trusted across thousands of moves.</span>
                  {["FMCSA Authorized", "USDOT Compliant", "BBB Accredited"].map(b => (
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

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </SiteShell>
  );
}
