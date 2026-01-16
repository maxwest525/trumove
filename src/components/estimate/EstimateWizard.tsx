import { useState, useCallback, useRef, useEffect } from "react";
import { format } from "date-fns";
import { 
  ArrowRight, ChevronLeft, MapPin, Home, Building2, 
  ArrowUpDown, CalendarIcon, HelpCircle, Footprints, Check, MoveVertical, Sparkles
} from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import logoImg from "@/assets/logo.png";
import ChatModal from "@/components/chat/ChatModal";

export interface ExtendedMoveDetails {
  // Contact
  name: string;
  phone: string;
  email: string;
  
  // From Location
  fromLocation: string;
  fromPropertyType: 'house' | 'apartment' | '';
  fromFloor: number;
  fromHasElevator: boolean;
  fromParkingDistance: 'unknown' | 'less75' | 'more75' | '';
  
  // To Location
  toLocation: string;
  toPropertyType: 'house' | 'apartment' | '';
  toFloor: number;
  toHasElevator: boolean;
  toParkingDistance: 'unknown' | 'less75' | 'more75' | '';
  
  // Other
  homeSize: string;
  moveDate: Date | null;
}

interface EstimateWizardProps {
  onComplete: (details: ExtendedMoveDetails) => void;
}

const HOME_SIZES = [
  { label: "Studio", value: "studio" },
  { label: "1 BR", value: "1br" },
  { label: "2 BR", value: "2br" },
  { label: "3 BR", value: "3br" },
  { label: "4+ BR", value: "4br+" },
];

const FLOOR_OPTIONS = [
  { label: "Ground/1st", value: 1 },
  { label: "2nd", value: 2 },
  { label: "3rd", value: 3 },
  { label: "4th+", value: 4 },
];

export default function EstimateWizard({ onComplete }: EstimateWizardProps) {
  const [step, setStep] = useState(1);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const prevStep = useRef(1);

  useEffect(() => {
    prevStep.current = step;
  }, [step]);
  
  const [details, setDetails] = useState<ExtendedMoveDetails>({
    name: '',
    phone: '',
    email: '',
    fromLocation: '',
    fromPropertyType: '',
    fromFloor: 1,
    fromHasElevator: false,
    fromParkingDistance: '',
    toLocation: '',
    toPropertyType: '',
    toFloor: 1,
    toHasElevator: false,
    toParkingDistance: '',
    homeSize: '',
    moveDate: null,
  });

  // Auto-populate from homepage form data stored in localStorage
  useEffect(() => {
    const storedLead = localStorage.getItem("tm_lead");
    if (storedLead) {
      try {
        const lead = JSON.parse(storedLead);
        
        // Helper to map homepage size values to wizard values
        const mapHomeSize = (size: string): string => {
          const sizeMap: Record<string, string> = {
            'Studio': 'studio',
            '1 Bedroom': '1br',
            '2 Bedroom': '2br',
            '3 Bedroom': '3br',
            '4+ Bedroom': '4br+',
            'Office': '2br',
          };
          return sizeMap[size] || '';
        };
        
        setDetails(prev => ({
          ...prev,
          email: lead.email || '',
          phone: lead.phone || '',
          fromLocation: lead.fromCity ? `${lead.fromCity} ${lead.fromZip}` : lead.fromZip || '',
          toLocation: lead.toCity ? `${lead.toCity} ${lead.toZip}` : lead.toZip || '',
          homeSize: mapHomeSize(lead.size) || '',
          moveDate: lead.moveDate ? new Date(lead.moveDate) : null,
        }));
        
        // Clear the stored data after use
        localStorage.removeItem("tm_lead");
      } catch (e) {
        console.error("Failed to parse stored lead data:", e);
      }
    }
  }, []);

  const updateDetails = useCallback((updates: Partial<ExtendedMoveDetails>) => {
    setDetails(prev => ({ ...prev, ...updates }));
  }, []);

  const canContinue = () => {
    switch (step) {
      case 1:
        return details.name.trim() && details.phone.trim() && details.email.includes('@');
      case 2:
        return details.fromLocation && details.fromPropertyType && details.homeSize;
      case 3:
        return details.toLocation && details.toPropertyType;
      case 4:
        return details.moveDate !== null;
      case 5:
        return details.fromParkingDistance && details.toParkingDistance;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (canContinue()) {
      if (step < 5) {
        setStep(step + 1);
      } else {
        onComplete(details);
      }
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canContinue()) {
      e.preventDefault();
      goNext();
    }
  };

  return (
    <>
      <div className="tru-floating-form-card">
        {/* Header - Matching homepage style */}
        <div className="tru-qb-form-header">
          <img src={logoImg} alt="TruMove" className="tru-qb-header-logo" />
          <span className="tru-qb-form-title">Build Your Move</span>
          <button 
            type="button"
            onClick={() => setChatOpen(true)} 
            className="tru-ai-chat-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Assistant</span>
          </button>
        </div>

        <div className="tru-floating-form-content">
          {/* Step 1: Contact Information */}
          {step === 1 && (
            <div className="tru-qb-step-content" key="step-1">
              <h1 className="tru-qb-question">Let's start with your contact info</h1>
              <p className="tru-qb-subtitle">We'll use this to send your personalized quote</p>

              <div className="tru-qb-contact-fields">
                <div className="tru-qb-input-wrap">
                  <input
                    type="text"
                    value={details.name}
                    onChange={(e) => updateDetails({ name: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder="Full Name"
                    className="tru-qb-input"
                    autoFocus
                  />
                </div>

                <div className="tru-qb-input-wrap">
                  <input
                    type="tel"
                    value={details.phone}
                    onChange={(e) => updateDetails({ phone: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder="Phone Number"
                    className="tru-qb-input"
                  />
                </div>

                <div className="tru-qb-input-wrap">
                  <input
                    type="email"
                    value={details.email}
                    onChange={(e) => updateDetails({ email: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder="Email Address"
                    className="tru-qb-input"
                  />
                </div>
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
            </div>
          )}

          {/* Step 2: Moving FROM Details */}
          {step === 2 && (
            <div className="tru-qb-step-content" key="step-2">
              <h1 className="tru-qb-question">
                {details.name.trim() 
                  ? `Hey ${details.name.split(' ')[0]}, where are you moving from?`
                  : "Where are you moving from?"}
              </h1>
              <p className="tru-qb-subtitle">Enter your current address details</p>

              <div className="tru-qb-input-wrap tru-qb-zip-wrap">
                <LocationAutocomplete
                  value={details.fromLocation}
                  onValueChange={(val) => updateDetails({ fromLocation: val })}
                  onLocationSelect={(city) => updateDetails({ fromLocation: city })}
                  placeholder="City or ZIP code"
                  onKeyDown={handleKeyDown}
                  className="tru-qb-input"
                />
              </div>

              <p className="tru-qb-section-label">Property Type</p>
              <div className="tru-qb-toggles">
                <button
                  type="button"
                  className={`tru-qb-toggle-card ${details.fromPropertyType === 'house' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ fromPropertyType: 'house' })}
                >
                  <Home className="tru-qb-toggle-icon" />
                  <div className="tru-qb-toggle-content">
                    <span className="tru-qb-toggle-title">House</span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`tru-qb-toggle-card ${details.fromPropertyType === 'apartment' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ fromPropertyType: 'apartment' })}
                >
                  <Building2 className="tru-qb-toggle-icon" />
                  <div className="tru-qb-toggle-content">
                    <span className="tru-qb-toggle-title">Apartment</span>
                  </div>
                </button>
              </div>

              {details.fromPropertyType === 'apartment' && (
                <>
                  <p className="tru-qb-section-label animate-fade-in">What floor?</p>
                  <div className="tru-qb-size-grid animate-fade-in">
                    {FLOOR_OPTIONS.map((floor) => (
                      <button
                        key={floor.value}
                        type="button"
                        className={`tru-qb-size-btn ${details.fromFloor === floor.value ? 'is-active' : ''}`}
                        onClick={() => updateDetails({ fromFloor: floor.value })}
                      >
                        {floor.label}
                      </button>
                    ))}
                  </div>

                  <p className="tru-qb-section-label animate-fade-in">Access type</p>
                  <div className="tru-qb-toggles animate-fade-in">
                    <button
                      type="button"
                      className={`tru-qb-toggle-card ${!details.fromHasElevator ? 'is-active' : ''}`}
                      onClick={() => updateDetails({ fromHasElevator: false })}
                    >
                      <MoveVertical className="tru-qb-toggle-icon" />
                      <div className="tru-qb-toggle-content">
                        <span className="tru-qb-toggle-title">Stairs</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`tru-qb-toggle-card ${details.fromHasElevator ? 'is-active' : ''}`}
                      onClick={() => updateDetails({ fromHasElevator: true })}
                    >
                      <ArrowUpDown className="tru-qb-toggle-icon" />
                      <div className="tru-qb-toggle-content">
                        <span className="tru-qb-toggle-title">Elevator</span>
                      </div>
                    </button>
                  </div>
                </>
              )}

              <p className="tru-qb-section-label">Home Size</p>
              <div className="tru-qb-size-grid">
                {HOME_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    className={`tru-qb-size-btn ${details.homeSize === size.value ? 'is-active' : ''}`}
                    onClick={() => updateDetails({ homeSize: size.value })}
                  >
                    {size.label}
                  </button>
                ))}
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

          {/* Step 3: Moving TO Details */}
          {step === 3 && (
            <div className="tru-qb-step-content" key="step-3">
              <h1 className="tru-qb-question">Where are you moving to?</h1>
              <p className="tru-qb-subtitle">Enter your destination address details</p>

              <div className="tru-qb-input-wrap tru-qb-zip-wrap">
                <LocationAutocomplete
                  value={details.toLocation}
                  onValueChange={(val) => updateDetails({ toLocation: val })}
                  onLocationSelect={(city) => updateDetails({ toLocation: city })}
                  placeholder="City or ZIP code"
                  onKeyDown={handleKeyDown}
                  className="tru-qb-input"
                />
              </div>

              <p className="tru-qb-section-label">Property Type</p>
              <div className="tru-qb-toggles">
                <button
                  type="button"
                  className={`tru-qb-toggle-card ${details.toPropertyType === 'house' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ toPropertyType: 'house' })}
                >
                  <Home className="tru-qb-toggle-icon" />
                  <div className="tru-qb-toggle-content">
                    <span className="tru-qb-toggle-title">House</span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`tru-qb-toggle-card ${details.toPropertyType === 'apartment' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ toPropertyType: 'apartment' })}
                >
                  <Building2 className="tru-qb-toggle-icon" />
                  <div className="tru-qb-toggle-content">
                    <span className="tru-qb-toggle-title">Apartment</span>
                  </div>
                </button>
              </div>

              {details.toPropertyType === 'apartment' && (
                <>
                  <p className="tru-qb-section-label animate-fade-in">What floor?</p>
                  <div className="tru-qb-size-grid animate-fade-in">
                    {FLOOR_OPTIONS.map((floor) => (
                      <button
                        key={floor.value}
                        type="button"
                        className={`tru-qb-size-btn ${details.toFloor === floor.value ? 'is-active' : ''}`}
                        onClick={() => updateDetails({ toFloor: floor.value })}
                      >
                        {floor.label}
                      </button>
                    ))}
                  </div>

                  <p className="tru-qb-section-label animate-fade-in">Access type</p>
                  <div className="tru-qb-toggles animate-fade-in">
                    <button
                      type="button"
                      className={`tru-qb-toggle-card ${!details.toHasElevator ? 'is-active' : ''}`}
                      onClick={() => updateDetails({ toHasElevator: false })}
                    >
                      <MoveVertical className="tru-qb-toggle-icon" />
                      <div className="tru-qb-toggle-content">
                        <span className="tru-qb-toggle-title">Stairs</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`tru-qb-toggle-card ${details.toHasElevator ? 'is-active' : ''}`}
                      onClick={() => updateDetails({ toHasElevator: true })}
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

          {/* Step 4: Move Date */}
          {step === 4 && (
            <div className="tru-qb-step-content" key="step-4">
              <h1 className="tru-qb-question">When would you like to move?</h1>
              <p className="tru-qb-subtitle">This helps us match you with available carriers</p>

              <div className="tru-qb-input-wrap">
                <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <button type="button" className="tru-qb-date-btn">
                      <CalendarIcon className="w-5 h-5" />
                      <span>
                        {details.moveDate 
                          ? format(details.moveDate, "MMMM d, yyyy") 
                          : "Select a date"}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="form-date-popover" align="center">
                    <CalendarComponent
                      mode="single"
                      selected={details.moveDate || undefined}
                      onSelect={(date) => {
                        updateDetails({ moveDate: date || null });
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

          {/* Step 5: Parking Distance */}
          {step === 5 && (
            <div className="tru-qb-step-content" key="step-5">
              <h1 className="tru-qb-question">How far is parking from the entrance?</h1>
              <p className="tru-qb-subtitle">This helps us estimate carry distance for your move</p>

              <p className="tru-qb-section-label">
                <Footprints className="w-4 h-4" />
                At your current location (FROM)
              </p>
              <div className="tru-qb-parking-options">
                <button
                  type="button"
                  className={`tru-qb-toggle-card ${details.fromParkingDistance === 'unknown' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ fromParkingDistance: 'unknown' })}
                >
                  <HelpCircle className="tru-qb-toggle-icon" />
                  <div className="tru-qb-toggle-content">
                    <span className="tru-qb-toggle-title">I don't know</span>
                  </div>
                  {details.fromParkingDistance === 'unknown' && <Check className="w-4 h-4 tru-qb-check-icon" />}
                </button>
                <button
                  type="button"
                  className={`tru-qb-toggle-card ${details.fromParkingDistance === 'less75' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ fromParkingDistance: 'less75' })}
                >
                  <Footprints className="tru-qb-toggle-icon" />
                  <div className="tru-qb-toggle-content">
                    <span className="tru-qb-toggle-title">Less than 75 feet</span>
                  </div>
                  {details.fromParkingDistance === 'less75' && <Check className="w-4 h-4 tru-qb-check-icon" />}
                </button>
                <button
                  type="button"
                  className={`tru-qb-toggle-card ${details.fromParkingDistance === 'more75' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ fromParkingDistance: 'more75' })}
                >
                  <Footprints className="tru-qb-toggle-icon" />
                  <div className="tru-qb-toggle-content">
                    <span className="tru-qb-toggle-title">More than 75 feet</span>
                  </div>
                  {details.fromParkingDistance === 'more75' && <Check className="w-4 h-4 tru-qb-check-icon" />}
                </button>
              </div>

              <p className="tru-qb-section-label">
                <Footprints className="w-4 h-4" />
                At your new location (TO)
              </p>
              <div className="tru-qb-parking-options">
                <button
                  type="button"
                  className={`tru-qb-toggle-card ${details.toParkingDistance === 'unknown' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ toParkingDistance: 'unknown' })}
                >
                  <HelpCircle className="tru-qb-toggle-icon" />
                  <div className="tru-qb-toggle-content">
                    <span className="tru-qb-toggle-title">I don't know</span>
                  </div>
                  {details.toParkingDistance === 'unknown' && <Check className="w-4 h-4 tru-qb-check-icon" />}
                </button>
                <button
                  type="button"
                  className={`tru-qb-toggle-card ${details.toParkingDistance === 'less75' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ toParkingDistance: 'less75' })}
                >
                  <Footprints className="tru-qb-toggle-icon" />
                  <div className="tru-qb-toggle-content">
                    <span className="tru-qb-toggle-title">Less than 75 feet</span>
                  </div>
                  {details.toParkingDistance === 'less75' && <Check className="w-4 h-4 tru-qb-check-icon" />}
                </button>
                <button
                  type="button"
                  className={`tru-qb-toggle-card ${details.toParkingDistance === 'more75' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ toParkingDistance: 'more75' })}
                >
                  <Footprints className="tru-qb-toggle-icon" />
                  <div className="tru-qb-toggle-content">
                    <span className="tru-qb-toggle-title">More than 75 feet</span>
                  </div>
                  {details.toParkingDistance === 'more75' && <Check className="w-4 h-4 tru-qb-check-icon" />}
                </button>
              </div>

              <button
                type="button"
                className="tru-qb-continue"
                disabled={!canContinue()}
                onClick={goNext}
              >
                <span>Start Building Inventory</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button type="button" className="tru-qb-back" onClick={goBack}>
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer inside form card */}
        <div className="tru-floating-form-footer">
          <span>Powered by</span>
          <img src={logoImg} alt="TruMove" className="tru-footer-mini-logo" />
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
