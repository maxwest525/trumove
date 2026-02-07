import { useState } from "react";
import { ChevronRight, ChevronLeft, Shield, Star, CheckCircle, Truck, Car, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import heroImage from "@/assets/hvl-hero-transport.jpg";

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
  const [isAsap, setIsAsap] = useState(false);

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
      if (!isAsap && !pickupDate) newErrors.date = "Required";
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
    setIsAsap(false);
    setName("");
    setPhone("");
    setEmail("");
    setErrors({});
  };

  return (
    <div className="hvl-page">
      {/* RED HEADER BAR */}
      <header className="hvl-header">
        <div className="hvl-header-inner">
          <div className="hvl-logo">
            <Truck className="w-7 h-7" />
            <span>Howard Van Lines</span>
          </div>
          <div className="hvl-header-contact">
            <span>Call Us: 1-800-555-MOVE</span>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hvl-hero">
        <div className="hvl-hero-inner">
          {/* Left: Headline + Image */}
          <div className="hvl-hero-text">
            <h1>Reliable Auto Transport</h1>
            <p>
              Trust Howard Van Lines for safe, insured vehicle shipping across the nation. 
              Get your free quote in minutes.
            </p>
            <div className="hvl-hero-image">
              <img src={heroImage} alt="Auto transport truck carrying vehicles" />
            </div>
          </div>

          {/* Right: Wizard Card */}
          <div className="hvl-wizard-card">
            {!showConfirmation && (
              <>
                {/* Step Indicator */}
                <div className="hvl-step-indicator">
                  <span className="hvl-step-label">Step {currentStep} of {totalSteps}</span>
                  <div className="hvl-step-dots">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={cn(
                          "hvl-step-dot",
                          step === currentStep && "active",
                          step < currentStep && "completed"
                        )}
                      />
                    ))}
                  </div>
                  <span className="hvl-step-name">{stepLabels[currentStep - 1]}</span>
                </div>
              </>
            )}

            {/* Wizard Content */}
            <div className="hvl-wizard-content">
              {showConfirmation ? (
                <div className="hvl-confirmation">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
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
                        className={cn("hvl-transport-card", transportType === "open" && "selected")}
                        onClick={() => setTransportType("open")}
                      >
                        <Truck className="w-5 h-5" />
                        <span>Open Carrier</span>
                        <span className="hvl-transport-desc">Standard, cost-effective</span>
                      </button>
                      <button
                        type="button"
                        className={cn("hvl-transport-card", transportType === "enclosed" && "selected")}
                        onClick={() => setTransportType("enclosed")}
                      >
                        <Car className="w-5 h-5" />
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
                    <div className="hvl-date-row">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            disabled={isAsap}
                            className={cn(
                              "hvl-date-btn",
                              !pickupDate && !isAsap && "hvl-date-placeholder",
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
                      <label className="hvl-asap-toggle">
                        <Checkbox
                          checked={isAsap}
                          onCheckedChange={(checked) => {
                            setIsAsap(!!checked);
                            if (checked) setPickupDate(undefined);
                          }}
                        />
                        <span>ASAP</span>
                      </label>
                    </div>
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
      </section>

      {/* TRUST STRIP */}
      <section className="hvl-trust-strip">
        <div className="hvl-trust-inner">
          <div className="hvl-trust-item">
            <Star className="w-5 h-5" />
            <span>Google Reviews</span>
          </div>
          <div className="hvl-trust-item">
            <Shield className="w-5 h-5" />
            <span>BBB Accredited</span>
          </div>
          <div className="hvl-trust-item">
            <CheckCircle className="w-5 h-5" />
            <span>Trustpilot</span>
          </div>
          <div className="hvl-trust-item">
            <Shield className="w-5 h-5" />
            <span>FMCSA Registered</span>
          </div>
          <div className="hvl-trust-item">
            <Truck className="w-5 h-5" />
            <span>USDOT Certified</span>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="hvl-footer">
        <p>© 2025 Howard Van Lines. All rights reserved.</p>
      </footer>
    </div>
  );
}
