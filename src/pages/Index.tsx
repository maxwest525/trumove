import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import SiteShell from "@/components/layout/SiteShell";
import LiveMoveDashboard from "@/components/estimate/LiveMoveDashboard";
import MoveMap from "@/components/MoveMap";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Shield, Cpu, Video, Boxes, Calculator, Search, CheckCircle, 
  MapPin, Route, Clock, DollarSign, Headphones, Phone, ArrowRight,
  CalendarIcon, Sparkles, Car, Package
} from "lucide-react";

// ZIP lookup
const ZIP_LOOKUP: Record<string, string> = {
  "90210": "Beverly Hills, CA", "90001": "Los Angeles, CA", "10001": "New York, NY",
  "10016": "New York, NY", "77001": "Houston, TX", "60601": "Chicago, IL",
  "33101": "Miami, FL", "85001": "Phoenix, AZ", "98101": "Seattle, WA",
  "80201": "Denver, CO", "02101": "Boston, MA", "20001": "Washington, DC",
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
  { label: "1 Bedroom", value: "1 Bedroom" },
  { label: "2 Bedroom", value: "2 Bedroom" },
  { label: "3 Bedroom", value: "3 Bedroom" },
  { label: "4+ Bedroom", value: "4+ Bedroom" },
  { label: "Office", value: "Office" },
];

export default function Index() {
  const navigate = useNavigate();
  
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
  
  // Calculate distance (simplified)
  const distance = fromZip && toZip ? Math.floor(Math.random() * 2000) + 200 : 0;
  const moveType = distance > 150 ? "long-distance" : "local";

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

  const isFormValid = fromZip.length === 5 && toZip.length === 5 && size && email;

  return (
    <SiteShell>
      <div className="tru-page-frame">
        <div className="tru-page-inner">
          {/* HERO - Hybrid Quote Builder */}
          <section className="hero-hybrid">
            <div className="hero-hybrid-inner">
              {/* Left: Quote Builder Form */}
              <div className="hero-form-column">
                <div className="hero-form-intro">
                  <div className="hero-pill">
                    <span className="hero-pill-dot"></span>
                    <span>Long-Distance Moving Specialists</span>
                  </div>
                  <h1 className="hero-title">Build Your Move. See It Come Together.</h1>
                  <p className="hero-subtitle">
                    Build your quote step-by-step and watch your move take shape in real-time. 
                    No hidden fees, no callbacks you didn't ask for.
                  </p>
                  <div className="hero-badges">
                    <span className="hero-badge"><Cpu className="w-3.5 h-3.5" /><span>AI-Powered</span></span>
                    <span className="hero-badge"><Shield className="w-3.5 h-3.5" /><span>FMCSA-Verified</span></span>
                    <span className="hero-badge"><Video className="w-3.5 h-3.5" /><span>Video Consults</span></span>
                  </div>
                </div>

                {/* Quote Form */}
                <form className="hero-form" onSubmit={handleSubmit}>
                  {/* Step 1: Route */}
                  <div className="form-section">
                    <div className="form-section-header">
                      <span className="form-section-num">1</span>
                      <span className="form-section-title">Your Route</span>
                    </div>
                    <div className="form-row-2col">
                      <div className="form-field">
                        <label className="form-label">From ZIP</label>
                        <div className="form-input-wrap">
                          <MapPin className="form-input-icon" />
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. 90210"
                            maxLength={5}
                            value={fromZip}
                            onChange={(e) => handleFromZipChange(e.target.value.replace(/\D/g, ""))}
                          />
                        </div>
                        {fromCity && <span className="form-city-badge">{fromCity}</span>}
                      </div>
                      <div className="form-field">
                        <label className="form-label">To ZIP</label>
                        <div className="form-input-wrap">
                          <MapPin className="form-input-icon" />
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. 10001"
                            maxLength={5}
                            value={toZip}
                            onChange={(e) => handleToZipChange(e.target.value.replace(/\D/g, ""))}
                          />
                        </div>
                        {toCity && <span className="form-city-badge">{toCity}</span>}
                      </div>
                    </div>
                    <div className="form-field">
                      <label className="form-label">Move Date</label>
                      <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                        <PopoverTrigger asChild>
                          <button type="button" className="form-date-btn">
                            <CalendarIcon className="form-input-icon" />
                            <span>{moveDate ? format(moveDate, "MMMM d, yyyy") : "Select a date"}</span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="form-date-popover" align="start">
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
                  </div>

                  {/* Step 2: Move Size */}
                  <div className="form-section">
                    <div className="form-section-header">
                      <span className="form-section-num">2</span>
                      <span className="form-section-title">Move Size</span>
                    </div>
                    <div className="form-chips">
                      {MOVE_SIZES.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          className={`form-chip ${size === s.value ? "is-active" : ""}`}
                          onClick={() => setSize(s.value)}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Additional Options */}
                  <div className="form-section">
                    <div className="form-section-header">
                      <span className="form-section-num">3</span>
                      <span className="form-section-title">Additional Options</span>
                    </div>
                    <div className="form-toggles">
                      <button
                        type="button"
                        className={`form-toggle ${hasCar ? "is-active" : ""}`}
                        onClick={() => setHasCar(!hasCar)}
                      >
                        <Car className="w-4 h-4" />
                        <span>Vehicle Transport</span>
                        <span className="form-toggle-indicator">{hasCar ? "Yes" : "No"}</span>
                      </button>
                      <button
                        type="button"
                        className={`form-toggle ${needsPacking ? "is-active" : ""}`}
                        onClick={() => setNeedsPacking(!needsPacking)}
                      >
                        <Package className="w-4 h-4" />
                        <span>Packing Service</span>
                        <span className="form-toggle-indicator">{needsPacking ? "Yes" : "No"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 4: Contact */}
                  <div className="form-section">
                    <div className="form-section-header">
                      <span className="form-section-num">4</span>
                      <span className="form-section-title">Your Contact</span>
                    </div>
                    <div className="form-row-2col">
                      <div className="form-field">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="you@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Phone (optional)</label>
                        <input
                          type="tel"
                          className="form-input"
                          placeholder="(555) 123-4567"
                          value={phone}
                          onChange={(e) => setPhoneNum(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <button 
                    type="submit" 
                    className="form-submit"
                    disabled={!isFormValid}
                  >
                    <span>Get My Quote</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* AI Chat Alternative */}
                  <div className="form-alt">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Prefer to chat? Use the</span>
                    <button type="button" className="form-alt-link" onClick={() => {
                      // This will be handled by the header's ChatModal
                      const chatBtn = document.querySelector('.header-btn-chat') as HTMLButtonElement;
                      chatBtn?.click();
                    }}>
                      AI Assistant
                    </button>
                    <span>in the header</span>
                  </div>
                </form>
              </div>

              {/* Right: Live Dashboard */}
              <div className="hero-dashboard-column">
                <LiveMoveDashboard
                  fromZip={fromZip}
                  toZip={toZip}
                  fromCity={fromCity}
                  toCity={toCity}
                  distance={distance}
                  moveDate={moveDate}
                  moveType={moveType}
                  size={size}
                  itemCount={0}
                  totalWeight={0}
                  hasCar={hasCar}
                  needsPacking={needsPacking}
                />
              </div>
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
                <MoveMap fromZip="90210" toZip="10001" />
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
    </SiteShell>
  );
}
