import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import { Phone, Video, ArrowRight, ChevronLeft, Check, Car, Package } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

// Simple ZIP to city lookup for common US cities
const ZIP_LOOKUP: Record<string, string> = {
  "90210": "Beverly Hills, CA",
  "10001": "New York, NY",
  "60601": "Chicago, IL",
  "77001": "Houston, TX",
  "85001": "Phoenix, AZ",
  "19101": "Philadelphia, PA",
  "78201": "San Antonio, TX",
  "92101": "San Diego, CA",
  "75201": "Dallas, TX",
  "95101": "San Jose, CA",
  "32801": "Orlando, FL",
  "33101": "Miami, FL",
  "98101": "Seattle, WA",
  "80201": "Denver, CO",
  "02101": "Boston, MA",
  "20001": "Washington, DC",
  "30301": "Atlanta, GA",
  "89101": "Las Vegas, NV",
  "97201": "Portland, OR",
  "48201": "Detroit, MI",
};

interface ZipSuggestion {
  zip: string;
  city: string;
}

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

async function searchZipSuggestions(partial: string): Promise<ZipSuggestion[]> {
  const suggestions: ZipSuggestion[] = [];
  // Search local lookup for matches
  for (const [zip, city] of Object.entries(ZIP_LOOKUP)) {
    if (zip.startsWith(partial)) {
      suggestions.push({ zip, city });
    }
  }
  return suggestions.slice(0, 4);
}

const MOVE_SIZES = [
  { value: "Studio", label: "Studio" },
  { value: "1 Bedroom", label: "1 Bed" },
  { value: "2 Bedroom", label: "2 Bed" },
  { value: "3 Bedroom", label: "3 Bed" },
  { value: "4+ Bedroom", label: "4+ Bed" },
  { value: "Office", label: "Office" },
];

export default function Index() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fromZip: "", toZip: "", moveDate: null as Date | null, 
    size: "", hasCar: null as boolean | null, needsPacking: null as boolean | null,
    email: "", phone: ""
  });
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<ZipSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<ZipSuggestion[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  const zipOk = (z: string) => /^\d{5}$/.test(z.trim());
  const phoneOk = (p: string) => (p.replace(/\D/g, "")).length >= 10;
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  // ZIP lookup and suggestions effect
  useEffect(() => {
    if (zipOk(formData.fromZip)) {
      lookupZip(formData.fromZip).then(city => setFromCity(city || ""));
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    } else if (formData.fromZip.length >= 3) {
      searchZipSuggestions(formData.fromZip).then(s => {
        setFromSuggestions(s);
        setShowFromSuggestions(s.length > 0);
      });
      setFromCity("");
    } else {
      setFromCity("");
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  }, [formData.fromZip]);

  useEffect(() => {
    if (zipOk(formData.toZip)) {
      lookupZip(formData.toZip).then(city => setToCity(city || ""));
      setToSuggestions([]);
      setShowToSuggestions(false);
    } else if (formData.toZip.length >= 3) {
      searchZipSuggestions(formData.toZip).then(s => {
        setToSuggestions(s);
        setShowToSuggestions(s.length > 0);
      });
      setToCity("");
    } else {
      setToCity("");
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  }, [formData.toZip]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fromInputRef.current && !fromInputRef.current.parentElement?.contains(e.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (toInputRef.current && !toInputRef.current.parentElement?.contains(e.target as Node)) {
        setShowToSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateStep1 = () => {
    const newErrors: Record<string, boolean> = {};
    if (!zipOk(formData.fromZip)) newErrors.fromZip = true;
    if (!zipOk(formData.toZip)) newErrors.toZip = true;
    if (!formData.moveDate) newErrors.moveDate = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setFormError("Please complete all fields with valid ZIP codes.");
      return false;
    }
    setFormError("");
    return true;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.size) newErrors.size = true;
    if (formData.hasCar === null) newErrors.hasCar = true;
    if (formData.needsPacking === null) newErrors.needsPacking = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setFormError("Please complete all selections.");
      return false;
    }
    setFormError("");
    return true;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, boolean> = {};
    if (!emailOk(formData.email)) newErrors.email = true;
    if (!phoneOk(formData.phone)) newErrors.phone = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setFormError("Please enter a valid email and phone number.");
      return false;
    }
    setFormError("");
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setIsAnimating(false);
    }, 150);
  };

  const prevStep = () => {
    setIsAnimating(true);
    setFormError("");
    setErrors({});
    setTimeout(() => {
      setCurrentStep(prev => Math.max(prev - 1, 1));
      setIsAnimating(false);
    }, 150);
  };

  const handleIntent = (intent: string) => {
    if (!validateStep3()) return;
    
    localStorage.setItem("tm_lead", JSON.stringify({ 
      intent, 
      ...formData, 
      moveDate: formData.moveDate?.toISOString(),
      fromCity,
      toCity,
      ts: Date.now() 
    }));
    
    if (intent === "specialist") {
      window.location.href = "tel:+18001234567";
    } else if (intent === "virtual") {
      navigate("/book");
    } else if (intent === "builder") {
      navigate("/online-estimate");
    }
  };

  const stepLabels = ["Location", "Details", "Contact"];

  return (
    <SiteShell>
      <div className="tru-page-frame">
        <div className="tru-page-inner">
          {/* HERO */}
          <section className="tru-hero">
            <div className="tru-hero-grid">
              <div>
                <div className="tru-hero-pill">
                  <span className="tru-hero-pill-dot"></span>
                  <span>Smarter moving, powered by TruMove</span>
                </div>
                <h1 className="tru-hero-title">Move day control, without the stress.</h1>
                <p className="tru-hero-sub">TruMove turns a few simple questions into instant pricing, vetted movers, and live support. No spam calls, no surprise add ons, no getting bounced around.</p>
                <div className="tru-hero-bullets">
                  <div className="tru-hero-badge"><span className="tru-hero-badge-dot"></span><span>Instant AI quotes</span></div>
                  <div className="tru-hero-badge"><span className="tru-hero-badge-dot"></span><span>Vetted mover network</span></div>
                  <div className="tru-hero-badge"><span className="tru-hero-badge-dot"></span><span>Real-time updates</span></div>
                </div>
                <div className="tru-hero-actions">
                  <button className="tru-hero-btn-secondary" type="button" onClick={() => navigate("/about")}>
                    <span>See how TruMove works</span><span className="chevron">→</span>
                  </button>
                </div>
                <div className="tru-hero-note">No hidden fees, no endless phone calls, just one clean dashboard for your whole move.</div>
              </div>

              {/* PREMIUM WIZARD CONSOLE - Narrow & Tall */}
              <div className="tru-hero-visual">
                <div className="tru-form-card">
                  {/* Stylized Header */}
                  <div className="tru-form-header">
                    <div className="tru-form-header-top">
                      <img src={logo} alt="TruMove" className="tru-form-logo" />
                      <div className="tru-form-status">
                        <span className="tru-status-dot"></span>
                        <span className="tru-status-text">Online</span>
                      </div>
                    </div>
                    <div className="tru-form-flow-header">
                      <span className="tru-flow-step is-active">Start Your Move</span>
                      <span className="tru-flow-arrow">→</span>
                      <span className="tru-flow-step">Build Inventory</span>
                      <span className="tru-flow-arrow">→</span>
                      <span className="tru-flow-step">Get a Quote</span>
                    </div>
                  </div>

                  {/* Refined Progress Stepper */}
                  <div className="tru-stepper">
                    {stepLabels.map((label, idx) => (
                      <div key={label} className={`tru-stepper-step ${currentStep > idx + 1 ? "is-done" : ""} ${currentStep === idx + 1 ? "is-current" : ""}`}>
                        <div className="tru-stepper-indicator">
                          {currentStep > idx + 1 ? <Check className="tru-stepper-check" /> : <span>{idx + 1}</span>}
                        </div>
                        <span className="tru-stepper-label">{label}</span>
                        {idx < stepLabels.length - 1 && <div className="tru-stepper-connector" />}
                      </div>
                    ))}
                  </div>

                  {/* Form Content */}
                  <div className={`tru-form-body ${isAnimating ? "is-animating" : ""}`}>
                    {/* STEP 1: Location & Date */}
                    {currentStep === 1 && (
                      <div className="tru-form-step">
                        {/* From ZIP with suggestions */}
                        <div className="tru-input-group">
                          <label className="tru-input-label">Moving From</label>
                          <div className="tru-zip-field">
                            <div className={`tru-input-wrapper ${errors.fromZip ? "is-error" : ""}`}>
                              <input 
                                ref={fromInputRef}
                                type="text" 
                                className="tru-input"
                                placeholder="90210"
                                value={formData.fromZip}
                                onChange={e => setFormData(p => ({ ...p, fromZip: e.target.value.replace(/\D/g, "").slice(0, 5) }))}
                                onFocus={() => fromSuggestions.length > 0 && setShowFromSuggestions(true)}
                                maxLength={5}
                              />
                            </div>
                            {showFromSuggestions && fromSuggestions.length > 0 && (
                              <div className="tru-zip-suggestions">
                                {fromSuggestions.map(s => (
                                  <button
                                    key={s.zip}
                                    type="button"
                                    className="tru-zip-suggestion"
                                    onClick={() => {
                                      setFormData(p => ({ ...p, fromZip: s.zip }));
                                      setShowFromSuggestions(false);
                                    }}
                                  >
                                    <span className="tru-zip-suggestion-city">{s.city}</span>
                                    <span className="tru-zip-suggestion-zip">{s.zip}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                            {fromCity && <span className="tru-zip-city-badge">{fromCity}</span>}
                          </div>
                        </div>

                        {/* To ZIP with suggestions */}
                        <div className="tru-input-group">
                          <label className="tru-input-label">Moving To</label>
                          <div className="tru-zip-field">
                            <div className={`tru-input-wrapper ${errors.toZip ? "is-error" : ""}`}>
                              <input 
                                ref={toInputRef}
                                type="text" 
                                className="tru-input"
                                placeholder="10001"
                                value={formData.toZip}
                                onChange={e => setFormData(p => ({ ...p, toZip: e.target.value.replace(/\D/g, "").slice(0, 5) }))}
                                onFocus={() => toSuggestions.length > 0 && setShowToSuggestions(true)}
                                maxLength={5}
                              />
                            </div>
                            {showToSuggestions && toSuggestions.length > 0 && (
                              <div className="tru-zip-suggestions">
                                {toSuggestions.map(s => (
                                  <button
                                    key={s.zip}
                                    type="button"
                                    className="tru-zip-suggestion"
                                    onClick={() => {
                                      setFormData(p => ({ ...p, toZip: s.zip }));
                                      setShowToSuggestions(false);
                                    }}
                                  >
                                    <span className="tru-zip-suggestion-city">{s.city}</span>
                                    <span className="tru-zip-suggestion-zip">{s.zip}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                            {toCity && <span className="tru-zip-city-badge">{toCity}</span>}
                          </div>
                        </div>

                        {/* Inline Calendar */}
                        <div className="tru-input-group">
                          <label className="tru-input-label">Move Date</label>
                          <div className={`tru-calendar-inline ${errors.moveDate ? "is-error" : ""}`}>
                            <CalendarComponent
                              mode="single"
                              selected={formData.moveDate || undefined}
                              onSelect={(date) => setFormData(p => ({ ...p, moveDate: date || null }))}
                              disabled={(date) => date < new Date()}
                              className="tru-calendar"
                            />
                          </div>
                        </div>

                        <button type="button" className="tru-btn tru-btn-primary" onClick={nextStep}>
                          <span>Tell Us About Your Load</span>
                          <ArrowRight className="tru-btn-icon" />
                        </button>
                      </div>
                    )}

                    {/* STEP 2: Move Details */}
                    {currentStep === 2 && (
                      <div className="tru-form-step">
                        {/* Move Size Grid */}
                        <div className="tru-input-group">
                          <label className="tru-input-label">Move Size</label>
                          <div className={`tru-size-grid ${errors.size ? "is-error" : ""}`}>
                            {MOVE_SIZES.map(size => (
                              <button
                                key={size.value}
                                type="button"
                                className={cn("tru-size-btn", formData.size === size.value && "is-selected")}
                                onClick={() => setFormData(p => ({ ...p, size: size.value }))}
                              >
                                {formData.size === size.value && <Check className="tru-size-check" />}
                                <span>{size.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Vehicle Toggle */}
                        <div className="tru-input-group">
                          <label className="tru-input-label">Include vehicle shipping?</label>
                          <div className={`tru-toggle-group ${errors.hasCar ? "is-error" : ""}`}>
                            <button 
                              type="button"
                              className={cn("tru-toggle-btn", formData.hasCar === true && "is-active")}
                              onClick={() => setFormData(p => ({ ...p, hasCar: true }))}
                            >
                              <Car className="tru-toggle-icon" />
                              <span>Yes</span>
                            </button>
                            <button 
                              type="button"
                              className={cn("tru-toggle-btn", formData.hasCar === false && "is-active")}
                              onClick={() => setFormData(p => ({ ...p, hasCar: false }))}
                            >
                              <span>No</span>
                            </button>
                          </div>
                        </div>

                        {/* Packing Toggle */}
                        <div className="tru-input-group">
                          <label className="tru-input-label">Need packing help?</label>
                          <div className={`tru-toggle-group ${errors.needsPacking ? "is-error" : ""}`}>
                            <button 
                              type="button"
                              className={cn("tru-toggle-btn", formData.needsPacking === true && "is-active")}
                              onClick={() => setFormData(p => ({ ...p, needsPacking: true }))}
                            >
                              <Package className="tru-toggle-icon" />
                              <span>Yes</span>
                            </button>
                            <button 
                              type="button"
                              className={cn("tru-toggle-btn", formData.needsPacking === false && "is-active")}
                              onClick={() => setFormData(p => ({ ...p, needsPacking: false }))}
                            >
                              <span>No</span>
                            </button>
                          </div>
                        </div>

                        <div className="tru-btn-row">
                          <button type="button" className="tru-btn tru-btn-ghost" onClick={prevStep}>
                            <ChevronLeft className="tru-btn-icon-left" />
                            <span>Back</span>
                          </button>
                          <button type="button" className="tru-btn tru-btn-primary" onClick={nextStep}>
                            <span>Continue</span>
                            <ArrowRight className="tru-btn-icon" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Contact & Intent */}
                    {currentStep === 3 && (
                      <div className="tru-form-step">
                        <div className="tru-input-group">
                          <label className="tru-input-label">Email</label>
                          <div className={`tru-input-wrapper ${errors.email ? "is-error" : ""}`}>
                            <input 
                              type="email" 
                              className="tru-input"
                              placeholder="you@email.com"
                              value={formData.email}
                              onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="tru-input-group">
                          <label className="tru-input-label">Phone</label>
                          <div className={`tru-input-wrapper ${errors.phone ? "is-error" : ""}`}>
                            <input 
                              type="tel" 
                              className="tru-input"
                              placeholder="(555) 123-4567"
                              value={formData.phone}
                              onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="tru-cta-section">
                          <p className="tru-cta-prompt">How would you like to proceed?</p>
                          <div className="tru-cta-grid">
                            <button type="button" className="tru-cta-option" onClick={() => handleIntent("specialist")}>
                              <Phone className="tru-cta-icon" />
                              <div className="tru-cta-content">
                                <span className="tru-cta-title">Talk to a Specialist</span>
                                <span className="tru-cta-desc">Get personalized guidance</span>
                              </div>
                            </button>
                            <button type="button" className="tru-cta-option" onClick={() => handleIntent("virtual")}>
                              <Video className="tru-cta-icon" />
                              <div className="tru-cta-content">
                                <span className="tru-cta-title">Book a Virtual Meet</span>
                                <span className="tru-cta-desc">Walk your home with us</span>
                              </div>
                            </button>
                          </div>
                          <button type="button" className="tru-btn tru-btn-builder" onClick={() => handleIntent("builder")}>
                            <span>Build My Move Online</span>
                            <ArrowRight className="tru-btn-icon" />
                          </button>
                        </div>

                        <button type="button" className="tru-btn tru-btn-ghost tru-btn-center" onClick={prevStep}>
                          <ChevronLeft className="tru-btn-icon-left" />
                          <span>Back</span>
                        </button>
                      </div>
                    )}

                    {formError && <div className="tru-form-error">{formError}</div>}
                  </div>

                  {/* Trust footer */}
                  <div className="tru-form-footer">
                    <span className="tru-form-secure">🔒 Your info is secure & never sold</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section className="tru-simple-wrap">
            <div className="tru-simple-inner">
              <div className="tru-simple-kicker">All in one platform</div>
              <h2 className="tru-simple-title">The essentials, done right.</h2>
              <p className="tru-simple-sub">From instant quotes to live support, TruMove keeps every part of your move in one place.</p>
              <div className="tru-simple-grid">
                {[{title:"Instant Pricing",text:"Turn a few details into AI powered quotes in seconds."},{title:"Inventory Made Easy",text:"Tap through rooms, add items, and watch your move build itself."},{title:"Live Video Help",text:"Walk your home with a TruMove specialist over secure video."},{title:"Smart Matching",text:"We rank movers on real performance, not paid placement."},{title:"Real Time Updates",text:"Track confirmations, crews, and timing from one live timeline."},{title:"Built In Protection",text:"We screen carriers and flag red flag reviews before you book."}].map(f => (
                  <article key={f.title} className="tru-simple-card">
                    <div className="tru-simple-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M13 2L5 14H11L11 22L19 10H13L13 2Z" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" /></svg></div>
                    <div className="tru-simple-card-title">{f.title}</div>
                    <div className="tru-simple-card-text">{f.text}</div>
                  </article>
                ))}
              </div>
              <div className="tru-simple-cta">
                <div className="tru-simple-cta-text"><span className="tru-simple-cta-strong">Want the full breakdown.</span> Compare TruMove to a traditional moving broker.</div>
                <button className="tru-simple-cta-btn" onClick={() => navigate("/vetting")}><span>See all features</span><span className="chevron">→</span></button>
              </div>
            </div>
          </section>

          {/* MISSION */}
          <section className="tru-mission-wrap">
            <div className="tru-mission-inner">
              <div className="tru-mission-kicker">OUR MISSION</div>
              <h2 className="tru-mission-title">Making moving <span>honest</span>, <span>clear</span>, and <span>predictable</span>.</h2>
              <p className="tru-mission-text">Our mission is to make moving honest, clear, and predictable, using AI and real carrier data.</p>
              <div className="tru-mission-stats-shell">
                <div className="tru-mission-stats-bar">
                  {[{num:"4.9★",label:"Average Rating"},{num:"10,000+",label:"Moves Assisted"},{num:"0",label:"Spam Calls, Ever"}].map(s => (
                    <div key={s.label} className="tru-mission-stat">
                      <div className="tru-mission-stat-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M12 4L13.9 8.24L18.5 8.74L15 11.79L15.9 16.3L12 14.1L8.1 16.3L9 11.79L5.5 8.74L10.1 8.24L12 4Z" strokeWidth="1.5" strokeLinejoin="round" /></svg></div>
                      <div className="tru-mission-stat-copy"><div className="tru-mission-stat-number">{s.num}</div><div className="tru-mission-stat-label">{s.label}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="tru-guarantee-wrap">
                <div className="tru-guarantee-card">
                  <div>
                    <div className="tru-guarantee-tag"><span className="tru-guarantee-tag-dot"></span><span>TruMove Guarantee</span></div>
                    <div className="tru-guarantee-title">If it feels off, we flag it before you ever sign.</div>
                    <div className="tru-guarantee-text">Every quote passes through our checks so you don't waste time on carriers that play games.</div>
                    <ul className="tru-guarantee-list"><li>No spam calls sold to other brokers.</li><li>No last minute surprise add ons.</li><li>Help from a real human if anything feels wrong.</li></ul>
                  </div>
                  <div className="tru-guarantee-side"><span className="tru-guarantee-highlight">We built TruMove from bad experiences.</span><br />If we wouldn't book a mover for our own families, they don't show up in your options.</div>
                </div>
              </div>
              <div className="tru-trust-wrap">
                <div className="tru-trust-row">
                  <span className="tru-trust-label">Trusted across thousands of moves.</span>
                  {["Google Reviews","Yelp Movers","Better Business Bureau"].map(b => (<span key={b} className="tru-trust-badge"><span className="tru-trust-dot"></span><span>{b}</span></span>))}
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section className="tru-contact-wrap">
            <div className="tru-contact-inner">
              <h2 className="tru-contact-title">Contact Us</h2>
              <p className="tru-contact-sub">Have a question? Send us a message and a TruMove specialist will respond shortly.</p>
              <div className="tru-contact-card">
                <form className="tru-contact-form" onSubmit={e => { e.preventDefault(); window.location.href = "mailto:info@trumoveinc.com?subject=TruMove Contact"; }}>
                  <div className="tru-field"><div className="tru-field-inner"><span className="tru-field-icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3.2" strokeWidth="1.6" /><path d="M6.5 18.4C7.6 16.5 9.7 15.3 12 15.3C14.3 15.3 16.4 16.5 17.5 18.4" strokeWidth="1.6" strokeLinecap="round" /></svg></span><input type="text" className="tru-contact-input" placeholder=" " required /><label className="tru-field-label">Your name</label></div></div>
                  <div className="tru-field"><div className="tru-field-inner"><span className="tru-field-icon"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.6" /><path d="M4 7L12 12.5L20 7" strokeWidth="1.6" strokeLinecap="round" /></svg></span><input type="email" className="tru-contact-input" placeholder=" " required /><label className="tru-field-label">Your email</label></div></div>
                  <div className="tru-field textarea-field"><div className="tru-field-inner"><span className="tru-field-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M5 5H19V14H9L5 18V5Z" strokeWidth="1.6" strokeLinejoin="round" /></svg></span><textarea className="tru-contact-textarea" placeholder=" " required></textarea><label className="tru-field-label">Your message</label></div></div>
                  <div className="tru-contact-btn-row"><button type="submit" className="tru-contact-btn">Send Message</button><span className="tru-contact-hint">Average reply time under one business day.</span></div>
                </form>
              </div>
              <div className="tru-contact-secondary"><span>Prefer to talk to a real person.</span><button className="tru-contact-secondary-btn" onClick={() => navigate("/book")}><svg viewBox="0 0 24 24" fill="none"><path d="M6.5 4.5L9.5 4L11 7.5L9.3 8.7C9.9 9.9 10.8 10.9 12 11.7L13.9 10.4L17 12L16.3 15.3C16.2 15.8 15.8 16.1 15.3 16.2C14.1 16.5 12.3 16.1 10.3 14.8C8.3 13.4 6.9 11.7 6.1 10.1C5.5 8.9 5.3 7.8 5.5 6.9C5.6 6.4 5.9 5.9 6.5 4.5Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg><span>Talk to a TruMove specialist</span><span className="chevron">→</span></button></div>
            </div>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
