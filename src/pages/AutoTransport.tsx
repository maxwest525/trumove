import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, Shield, Star, CheckCircle, Truck, Car, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import HankChatButton from "@/components/hvl/HankChatButton";
import { HeroParticles } from "@/components/hvl/HeroParticles";
import { VehiclePreviewModal } from "@/components/hvl/VehiclePreviewModal";
import heroImage from "@/assets/hvl-hero-dynamic.jpg";
import hvlLogo from "@/assets/hvl-logo.png";

// ═══════════════════════════════════════════════════════════════════
// VEHICLE DATA
// ═══════════════════════════════════════════════════════════════════

const YEARS = Array.from({ length: 27 }, (_, i) => String(2026 - i)); // 2026 down to 2000

const VEHICLE_MODELS: Record<string, string[]> = {
  Toyota: ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "4Runner", "Prius"],
  Honda: ["Accord", "Civic", "CR-V", "Pilot", "Odyssey", "HR-V", "Ridgeline"],
  Ford: ["F-150", "Mustang", "Explorer", "Escape", "Bronco", "Edge", "Ranger"],
  Chevrolet: ["Silverado", "Camaro", "Equinox", "Tahoe", "Malibu", "Traverse", "Colorado"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "X7", "M3", "M5"],
  Tesla: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
};

const MAKES = Object.keys(VEHICLE_MODELS);

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════

export default function AutoTransport() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const totalSteps = 3;

  // Step 1: Vehicle
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [transportType, setTransportType] = useState<"open" | "enclosed" | "">("");

  // Step 2: Route
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupCity, setPickupCity] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [dropoffCity, setDropoffCity] = useState("");
  const [pickupDate, setPickupDate] = useState<Date | undefined>();

  // Step 3: Contact
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const stepLabels = ["Vehicle", "Route", "Contact"];

  // Get models for selected make
  const availableModels = make ? VEHICLE_MODELS[make] || [] : [];

  // Reset model when make changes
  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    setModel("");
  };

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!year) newErrors.year = "Required";
      if (!make) newErrors.make = "Required";
      if (!model) newErrors.model = "Required";
      if (!transportType) newErrors.transportType = "Required";
    } else if (step === 2) {
      if (!pickupLocation) newErrors.pickup = "Required";
      if (!dropoffLocation) newErrors.dropoff = "Required";
      if (!pickupDate) newErrors.date = "Required";
    } else if (step === 3) {
      if (!name.trim()) newErrors.name = "Required";
      if (!phone.trim()) newErrors.phone = "Required";
      if (!email.trim()) newErrors.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      setShowConfirmation(true);
    }
  };

  const handleReset = () => {
    setShowConfirmation(false);
    setCurrentStep(1);
    setYear("");
    setMake("");
    setModel("");
    setTransportType("");
    setPickupLocation("");
    setPickupCity("");
    setDropoffLocation("");
    setDropoffCity("");
    setPickupDate(undefined);
    setName("");
    setPhone("");
    setEmail("");
    setErrors({});
  };

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".hvl-animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="hvl-page">
      {/* HVL HEADER */}
      <header className="hvl-header">
        <div className="hvl-header-inner">
          <Link to="/auto-transport" className="hvl-logo">
            <img src={hvlLogo} alt="Howard's Van Line" className="hvl-logo-img" />
          </Link>
          <nav className="hvl-nav">
            <Link to="/" className="hvl-nav-link">Home</Link>
            <Link to="/online-estimate" className="hvl-nav-link">Get Estimate</Link>
            <Link to="/track" className="hvl-nav-link">Track Shipment</Link>
            <Link to="/book" className="hvl-nav-link">Contact Us</Link>
          </nav>
          <a href="tel:+18005551234" className="hvl-header-phone">
            <Phone className="w-4 h-4" />
            <span>1-800-555-MOVE</span>
          </a>
        </div>
      </header>

      <section className="hvl-hero-dramatic">
        <div className="hvl-hero-bg" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="hvl-hero-overlay" />
        </div>
        
        {/* Floating Transport Summary Modal - draggable */}
        <VehiclePreviewModal 
          year={year} 
          make={make} 
          model={model} 
          transportType={transportType}
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          pickupDate={pickupDate}
        />
        
        <div className="hvl-hero-content">
          <div className="hvl-hero-headline" style={{ transform: 'translateX(-125px)' }}>
            <div className="hvl-hero-text-block">
              <h1>Howards Van Line – <span>Trusted National Auto Transport Who Treat You Like Family</span></h1>
              <p>
                At Howards Van Line, we customize every move to your needs with precision, care, and transparency. 
                We're proud to be one of the top-rated auto transport companies in New Jersey.
              </p>
              <div className="hvl-hero-badges">
                <div className="hvl-hero-badge">
                  <Shield className="w-4 h-4" />
                  <span>$1M Insurance</span>
                </div>
                <div className="hvl-hero-badge">
                  <Star className="w-4 h-4" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="hvl-hero-badge">
                  <Truck className="w-4 h-4" />
                  <span>48 States</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Premium Wizard Card with Particles */}
          <div className="hvl-wizard-wrapper">
            <HeroParticles />
            <div className="hvl-wizard-card hvl-wizard-premium">
            {/* Logo Header */}
            <div className="hvl-wizard-logo-header">
              <img src={hvlLogo} alt="Howard Van Lines" className="hvl-wizard-logo" />
              <div className="hvl-wizard-divider" />
              <span className="hvl-wizard-tagline">Get Your Instant Quote</span>
            </div>

            {!showConfirmation && (
              <>
                {/* Premium Step Indicator */}
                <div className="hvl-step-indicator-premium">
                  {stepLabels.map((label, idx) => {
                    const step = idx + 1;
                    const isActive = step === currentStep;
                    const isCompleted = step < currentStep;
                    return (
                      <div key={step} className={cn("hvl-step-item", isActive && "active", isCompleted && "completed")}>
                        <div className="hvl-step-circle">
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : isActive ? (
                            <Car className="w-4 h-4" />
                          ) : null}
                        </div>
                        <span className="hvl-step-item-label">{label}</span>
                      </div>
                    );
                  })}
                  <div className="hvl-step-progress-bar">
                    <div className="hvl-step-progress-fill" style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }} />
                  </div>
                </div>
              </>
            )}

            {/* Wizard Content */}
            <div className="hvl-wizard-content">
              {showConfirmation ? (
                <div className="hvl-confirmation">
                  <div className="hvl-confirmation-icon">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h3>Thank You!</h3>
                  <p>We received your request for a {year} {make} {model} transport quote.</p>
                  <p className="hvl-confirmation-sub">A specialist will contact you shortly at {email}.</p>
                  <Button onClick={handleReset} className="hvl-btn-next mt-4">
                    Start New Quote
                  </Button>
                </div>
              ) : currentStep === 1 ? (
                <div className="hvl-step-content">
                  <div className="hvl-form-row">
                    <div className="hvl-field">
                      <Label className="hvl-label">Year</Label>
                      <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className={cn("hvl-select", errors.year && "hvl-error")}>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="hvl-dropdown">
                          {YEARS.map((y) => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.year && <span className="hvl-error-text">{errors.year}</span>}
                    </div>

                    <div className="hvl-field">
                      <Label className="hvl-label">Make</Label>
                      <Select value={make} onValueChange={handleMakeChange}>
                        <SelectTrigger className={cn("hvl-select", errors.make && "hvl-error")}>
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent className="hvl-dropdown">
                          {MAKES.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.make && <span className="hvl-error-text">{errors.make}</span>}
                    </div>
                  </div>

                  <div className="hvl-field">
                    <Label className="hvl-label">Model</Label>
                    <Select value={model} onValueChange={setModel} disabled={!make}>
                      <SelectTrigger className={cn("hvl-select", errors.model && "hvl-error")}>
                        <SelectValue placeholder={make ? "Select model" : "Select make first"} />
                      </SelectTrigger>
                      <SelectContent className="hvl-dropdown">
                        {availableModels.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.model && <span className="hvl-error-text">{errors.model}</span>}
                  </div>

                  <div className="hvl-field">
                    <Label className="hvl-label">Transport Type</Label>
                    <div className="hvl-transport-options">
                      <button
                        type="button"
                        className={cn("hvl-transport-btn", transportType === "open" && "selected")}
                        onClick={() => setTransportType("open")}
                      >
                        <span>Open Carrier</span>
                        <span className="hvl-transport-desc">Standard, cost-effective</span>
                      </button>
                      <button
                        type="button"
                        className={cn("hvl-transport-btn", transportType === "enclosed" && "selected")}
                        onClick={() => setTransportType("enclosed")}
                      >
                        <span>Enclosed Carrier</span>
                        <span className="hvl-transport-desc">Premium protection</span>
                      </button>
                    </div>
                    {errors.transportType && <span className="hvl-error-text">{errors.transportType}</span>}
                  </div>
                </div>
              ) : currentStep === 2 ? (
                <div className="hvl-step-content">
                  <div className="hvl-field">
                    <Label className="hvl-label">Pickup Location</Label>
                    <LocationAutocomplete
                      value={pickupLocation}
                      onValueChange={setPickupLocation}
                      onLocationSelect={(city, zip) => setPickupCity(city)}
                      placeholder="City, State or ZIP"
                      mode="city"
                      className={cn("hvl-input", errors.pickup && "hvl-error")}
                    />
                    {errors.pickup && <span className="hvl-error-text">{errors.pickup}</span>}
                  </div>

                  <div className="hvl-field">
                    <Label className="hvl-label">Dropoff Location</Label>
                    <LocationAutocomplete
                      value={dropoffLocation}
                      onValueChange={setDropoffLocation}
                      onLocationSelect={(city, zip) => setDropoffCity(city)}
                      placeholder="City, State or ZIP"
                      mode="city"
                      className={cn("hvl-input", errors.dropoff && "hvl-error")}
                    />
                    {errors.dropoff && <span className="hvl-error-text">{errors.dropoff}</span>}
                  </div>

                  <div className="hvl-field">
                    <Label className="hvl-label">Pickup Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "hvl-date-btn w-full justify-start",
                            !pickupDate && "hvl-date-placeholder",
                            errors.date && "hvl-error"
                          )}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={pickupDate}
                          onSelect={setPickupDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && <span className="hvl-error-text">{errors.date}</span>}
                  </div>
                </div>
              ) : currentStep === 3 ? (
                <div className="hvl-step-content">
                  <div className="hvl-field">
                    <Label className="hvl-label">Full Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className={cn("hvl-input", errors.name && "hvl-error")}
                    />
                    {errors.name && <span className="hvl-error-text">{errors.name}</span>}
                  </div>

                  <div className="hvl-field">
                    <Label className="hvl-label">Phone Number</Label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 555-5555"
                      className={cn("hvl-input", errors.phone && "hvl-error")}
                    />
                    {errors.phone && <span className="hvl-error-text">{errors.phone}</span>}
                  </div>

                  <div className="hvl-field">
                    <Label className="hvl-label">Email Address</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={cn("hvl-input", errors.email && "hvl-error")}
                    />
                    {errors.email && <span className="hvl-error-text">{errors.email}</span>}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Navigation Buttons */}
            {!showConfirmation && (
              <div className="hvl-wizard-buttons">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="hvl-btn-back"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                {currentStep === totalSteps ? (
                  <Button onClick={handleSubmit} className="hvl-btn-next">
                    Get Your Quote
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="hvl-btn-next">
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="hvl-trust-strip hvl-animate-on-scroll">
        <p className="hvl-trust-tagline">Trusted by thousands • Verified & Licensed</p>
        <div className="hvl-trust-inner">
          {/* Google */}
          <div className="hvl-trust-item">
            <svg viewBox="0 0 24 24" className="hvl-trust-logo hvl-trust-google">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <div className="hvl-trust-text">
              <span className="hvl-trust-rating">4.9★</span>
              <span className="hvl-trust-label">Google</span>
            </div>
          </div>

          {/* BBB */}
          <div className="hvl-trust-item">
            <svg viewBox="0 0 24 24" className="hvl-trust-logo hvl-trust-bbb">
              <circle cx="12" cy="12" r="11" fill="#005A9C"/>
              <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">BBB</text>
            </svg>
            <div className="hvl-trust-text">
              <span className="hvl-trust-rating">A+</span>
              <span className="hvl-trust-label">Accredited</span>
            </div>
          </div>

          {/* Trustpilot */}
          <div className="hvl-trust-item">
            <svg viewBox="0 0 24 24" className="hvl-trust-logo hvl-trust-trustpilot">
              <rect width="24" height="24" rx="3" fill="#00B67A"/>
              <path fill="white" d="M12 4l2.35 4.76 5.25.77-3.8 3.7.9 5.22L12 15.77l-4.7 2.68.9-5.22-3.8-3.7 5.25-.77L12 4z"/>
            </svg>
            <div className="hvl-trust-text">
              <span className="hvl-trust-rating">4.8★</span>
              <span className="hvl-trust-label">Trustpilot</span>
            </div>
          </div>

          {/* US DOT */}
          <div className="hvl-trust-item">
            <svg viewBox="0 0 24 24" className="hvl-trust-logo hvl-trust-dot">
              <circle cx="12" cy="12" r="11" fill="#002868"/>
              <path fill="white" d="M12 5l1.5 3h3.5l-2.5 2.5 1 3.5-3.5-2-3.5 2 1-3.5L7 8h3.5L12 5z"/>
            </svg>
            <div className="hvl-trust-text">
              <span className="hvl-trust-rating">Licensed</span>
              <span className="hvl-trust-label">USDOT</span>
            </div>
          </div>

          {/* FMCSA */}
          <div className="hvl-trust-item">
            <svg viewBox="0 0 24 24" className="hvl-trust-logo hvl-trust-fmcsa">
              <rect width="24" height="24" rx="3" fill="#1C3D5A"/>
              <path fill="#BF0A30" d="M4 8h16v2H4zM4 14h16v2H4z"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
            <div className="hvl-trust-text">
              <span className="hvl-trust-rating">Verified</span>
              <span className="hvl-trust-label">FMCSA</span>
            </div>
          </div>

          {/* Facebook */}
          <div className="hvl-trust-item">
            <svg viewBox="0 0 24 24" className="hvl-trust-logo hvl-trust-facebook">
              <circle cx="12" cy="12" r="11" fill="#1877F2"/>
              <path fill="white" d="M16.5 12.5h-2.5v7h-3v-7H9v-2.5h2v-1.5c0-2.5 1-4 3.5-4h2.5v2.5h-1.5c-1 0-1.5.5-1.5 1.5v1.5h3l-.5 2.5z"/>
            </svg>
            <div className="hvl-trust-text">
              <span className="hvl-trust-rating">5.0★</span>
              <span className="hvl-trust-label">Facebook</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="hvl-content-section hvl-animate-on-scroll">
        <div className="hvl-content-inner">
          <div className="hvl-about-grid">
            <div className="hvl-about-text">
              <h2>About Howard Van Lines</h2>
              <p>
                Since 1985, Howard Van Lines has been a trusted name in vehicle transportation. 
                What started as a small family business has grown into one of the nation's most 
                reliable auto transport companies, serving thousands of customers each year.
              </p>
              <p>
                Our commitment to excellence, transparency, and customer satisfaction has earned 
                us recognition from the Better Business Bureau and countless five-star reviews 
                from satisfied customers nationwide.
              </p>
            </div>
            <div className="hvl-about-stats">
              <div className="hvl-stat-item">
                <span className="hvl-stat-number">40+</span>
                <span className="hvl-stat-label">Years in Business</span>
              </div>
              <div className="hvl-stat-item">
                <span className="hvl-stat-number">50K+</span>
                <span className="hvl-stat-label">Vehicles Shipped</span>
              </div>
              <div className="hvl-stat-item">
                <span className="hvl-stat-number">48</span>
                <span className="hvl-stat-label">States Served</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="hvl-mission-section hvl-animate-on-scroll">
        <div className="hvl-content-inner">
          <h2>Our Mission</h2>
          <p className="hvl-mission-statement">
            To provide safe, reliable, and affordable vehicle transportation services while 
            treating every customer's vehicle as if it were our own. We believe in honest pricing, 
            clear communication, and delivering your vehicle on time, every time.
          </p>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="hvl-content-section hvl-animate-on-scroll">
        <div className="hvl-content-inner">
          <h2 className="hvl-section-title">Reliable & Secure Vehicle Shipping Services</h2>
          <p className="hvl-section-subtitle">
            Whether you're relocating, buying a car online, or shipping a classic vehicle, 
            we have the right solution for you.
          </p>
          
          <div className="hvl-services-grid">
            <div className="hvl-service-card">
              <div className="hvl-service-icon">
                <Truck className="w-6 h-6" />
              </div>
              <h3>Open Carrier Transport</h3>
              <p>
                Our most popular and cost-effective option. Your vehicle is transported on an 
                open trailer alongside other vehicles. Safe, efficient, and budget-friendly.
              </p>
              <ul className="hvl-service-features">
                <li><CheckCircle className="w-4 h-4" /> Lowest cost option</li>
                <li><CheckCircle className="w-4 h-4" /> Frequent departures</li>
                <li><CheckCircle className="w-4 h-4" /> Full insurance coverage</li>
              </ul>
            </div>

            <div className="hvl-service-card">
              <div className="hvl-service-icon enclosed">
                <Shield className="w-6 h-6" />
              </div>
              <h3>Enclosed Carrier Transport</h3>
              <p>
                Premium protection for luxury, classic, or high-value vehicles. Your car travels 
                in a fully enclosed trailer, shielded from weather and road debris.
              </p>
              <ul className="hvl-service-features">
                <li><CheckCircle className="w-4 h-4" /> Maximum protection</li>
                <li><CheckCircle className="w-4 h-4" /> Climate controlled options</li>
                <li><CheckCircle className="w-4 h-4" /> White glove service</li>
              </ul>
            </div>

            <div className="hvl-service-card">
              <div className="hvl-service-icon express">
                <Calendar className="w-6 h-6" />
              </div>
              <h3>Expedited Shipping</h3>
              <p>
                Need your vehicle fast? Our expedited service guarantees priority pickup and 
                delivery with dedicated carriers for time-sensitive shipments.
              </p>
              <ul className="hvl-service-features">
                <li><CheckCircle className="w-4 h-4" /> Priority scheduling</li>
                <li><CheckCircle className="w-4 h-4" /> Dedicated carrier</li>
                <li><CheckCircle className="w-4 h-4" /> Real-time tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="hvl-why-section hvl-animate-on-scroll">
        <div className="hvl-content-inner">
          <h2>Why Choose Howard Van Lines?</h2>
          <div className="hvl-why-grid">
            <div className="hvl-why-item">
              <Shield className="w-8 h-8" />
              <h4>Fully Insured</h4>
              <p>Every shipment is covered by comprehensive insurance for your peace of mind.</p>
            </div>
            <div className="hvl-why-item">
              <Star className="w-8 h-8" />
              <h4>Top Rated</h4>
              <p>Consistently rated 4.9+ stars by thousands of satisfied customers.</p>
            </div>
            <div className="hvl-why-item">
              <CheckCircle className="w-8 h-8" />
              <h4>No Hidden Fees</h4>
              <p>Transparent pricing with no surprises. The quote you get is the price you pay.</p>
            </div>
            <div className="hvl-why-item">
              <Truck className="w-8 h-8" />
              <h4>Nationwide Network</h4>
              <p>Vetted carriers across all 48 continental states for reliable service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE HOWARD GUARANTEE */}
      <section className="hvl-guarantee-section hvl-animate-on-scroll">
        <div className="hvl-guarantee-inner">
          <div className="hvl-guarantee-badge">
            <Shield className="w-12 h-12" />
          </div>
          <h2>The Howard Guarantee</h2>
          <p className="hvl-guarantee-headline">100% Risk-Free Money Back Guarantee</p>
          <p className="hvl-guarantee-text">
            At Howard Van Lines, we take pride in our auto transport services, and we're committed 
            to delivering the best auto shipping experiences in America. Our promise to you is to 
            ensure your vehicle is shipped safely with our 100% risk-free money back Howard Guarantee. 
            You pay nothing until you select a carrier for your car shipping, and you can cancel 
            anytime before we find you a carrier.
          </p>
          <div className="hvl-guarantee-points">
            <div className="hvl-guarantee-point">
              <CheckCircle className="w-5 h-5" />
              <span>No upfront payment required</span>
            </div>
            <div className="hvl-guarantee-point">
              <CheckCircle className="w-5 h-5" />
              <span>Cancel anytime before carrier assignment</span>
            </div>
            <div className="hvl-guarantee-point">
              <CheckCircle className="w-5 h-5" />
              <span>Full refund if we don't deliver on our promise</span>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="hvl-footer">
        <p>© 2025 Howard Van Lines. All rights reserved.</p>
      </footer>

      {/* Hank Chat Assistant */}
      <HankChatButton />
    </div>
  );
}
