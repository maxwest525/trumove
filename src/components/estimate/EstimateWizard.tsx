import { useState, useCallback, useRef, useEffect } from "react";
import { format } from "date-fns";
import { 
  ArrowRight, ChevronLeft, User, Phone, Mail, MapPin, Home, Building2, 
  ArrowUpDown, CalendarIcon, HelpCircle, Footprints, Check, MoveVertical, Unlock
} from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
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
        setDirection('forward');
        setStep(step + 1);
      } else {
        onComplete(details);
      }
    }
  };

  const goBack = () => {
    if (step > 1) {
      setDirection('backward');
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
    <div className="tru-estimate-wizard">
      {/* Unlock Badge */}
      <div className="flex items-center justify-center gap-2 px-4 py-2 mb-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
        <Unlock className="w-4 h-4" />
        <span>Fill out to unlock your FREE Move Builder</span>
      </div>

      {/* Progress Bar */}
      <div className="tru-wizard-progress">
        <span className="tru-wizard-step-label">Step {step} of 5</span>
        <div className="tru-wizard-progress-bar">
          <div 
            className="tru-wizard-progress-fill" 
            style={{ width: `${(step / 5) * 100}%` }} 
          />
        </div>
      </div>

      {/* Step 1: Contact Information */}
      {step === 1 && (
        <div className={cn("tru-wizard-step", direction === 'backward' && "backwards")} key="step-1">
          <div className="tru-wizard-header">
            <h2 className="tru-wizard-question">Let's start with your contact info</h2>
            <p className="tru-wizard-subtitle">We'll use this to send your personalized quote</p>
          </div>

          <div className="tru-wizard-form">
            <div className="tru-wizard-input-group">
              <label className="tru-wizard-label">Full Name</label>
              <div className="tru-wizard-input-wrapper">
                <User className="tru-wizard-input-icon" />
                <input
                  type="text"
                  value={details.name}
                  onChange={(e) => updateDetails({ name: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="John Smith"
                  className="tru-wizard-input has-icon"
                  autoFocus
                />
              </div>
            </div>

            <div className="tru-wizard-input-group">
              <label className="tru-wizard-label">Phone Number</label>
              <div className="tru-wizard-input-wrapper">
                <Phone className="tru-wizard-input-icon" />
                <input
                  type="tel"
                  value={details.phone}
                  onChange={(e) => updateDetails({ phone: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="(555) 123-4567"
                  className="tru-wizard-input has-icon"
                />
              </div>
            </div>

            <div className="tru-wizard-input-group">
              <label className="tru-wizard-label">Email Address</label>
              <div className="tru-wizard-input-wrapper">
                <Mail className="tru-wizard-input-icon" />
                <input
                  type="email"
                  value={details.email}
                  onChange={(e) => updateDetails({ email: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="john@example.com"
                  className="tru-wizard-input has-icon"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="tru-wizard-continue"
            disabled={!canContinue()}
            onClick={goNext}
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 2: Moving FROM Details */}
      {step === 2 && (
        <div className={cn("tru-wizard-step", direction === 'backward' && "backwards")} key="step-2">
          <div className="tru-wizard-header">
            <h2 className="tru-wizard-question">Where are you moving from?</h2>
            <p className="tru-wizard-subtitle">Enter your current address details</p>
          </div>

          <div className="tru-wizard-form">
            <div className="tru-wizard-input-group">
              <label className="tru-wizard-label">Location</label>
              <div className="tru-wizard-input-wrapper">
                <MapPin className="tru-wizard-input-icon" />
                <LocationAutocomplete
                  value={details.fromLocation}
                  onValueChange={(val) => updateDetails({ fromLocation: val })}
                  onLocationSelect={(city) => updateDetails({ fromLocation: city })}
                  placeholder="City or ZIP code"
                  onKeyDown={handleKeyDown}
                  className="tru-wizard-input has-icon"
                />
              </div>
            </div>

            <div className="tru-wizard-input-group">
              <label className="tru-wizard-label">Property Type</label>
              <div className="tru-wizard-toggle-row">
                <button
                  type="button"
                  className={`tru-wizard-toggle-btn ${details.fromPropertyType === 'house' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ fromPropertyType: 'house' })}
                >
                  <Home className="w-5 h-5" />
                  <span>House</span>
                </button>
                <button
                  type="button"
                  className={`tru-wizard-toggle-btn ${details.fromPropertyType === 'apartment' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ fromPropertyType: 'apartment' })}
                >
                  <Building2 className="w-5 h-5" />
                  <span>Apartment</span>
                </button>
              </div>
            </div>

            {details.fromPropertyType === 'apartment' && (
              <>
                <div className="tru-wizard-input-group animate-fade-in">
                  <label className="tru-wizard-label">What floor?</label>
                  <div className="tru-wizard-pills">
                    {FLOOR_OPTIONS.map((floor) => (
                      <button
                        key={floor.value}
                        type="button"
                        className={`tru-wizard-pill ${details.fromFloor === floor.value ? 'is-active' : ''}`}
                        onClick={() => updateDetails({ fromFloor: floor.value })}
                      >
                        {floor.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tru-wizard-input-group animate-fade-in">
                  <label className="tru-wizard-label">Access type</label>
                  <div className="tru-wizard-toggle-row">
                    <button
                      type="button"
                      className={`tru-wizard-toggle-btn ${!details.fromHasElevator ? 'is-active' : ''}`}
                      onClick={() => updateDetails({ fromHasElevator: false })}
                    >
                      <MoveVertical className="w-5 h-5" />
                      <span>Stairs</span>
                    </button>
                    <button
                      type="button"
                      className={`tru-wizard-toggle-btn ${details.fromHasElevator ? 'is-active' : ''}`}
                      onClick={() => updateDetails({ fromHasElevator: true })}
                    >
                      <ArrowUpDown className="w-5 h-5" />
                      <span>Elevator</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="tru-wizard-input-group">
              <label className="tru-wizard-label">Home Size</label>
              <div className="tru-wizard-pills">
                {HOME_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    className={`tru-wizard-pill ${details.homeSize === size.value ? 'is-active' : ''}`}
                    onClick={() => updateDetails({ homeSize: size.value })}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="tru-wizard-continue"
            disabled={!canContinue()}
            onClick={goNext}
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button type="button" className="tru-wizard-back" onClick={goBack}>
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      )}

      {/* Step 3: Moving TO Details */}
      {step === 3 && (
        <div className={cn("tru-wizard-step", direction === 'backward' && "backwards")} key="step-3">
          <div className="tru-wizard-header">
            <h2 className="tru-wizard-question">Where are you moving to?</h2>
            <p className="tru-wizard-subtitle">Enter your destination address details</p>
          </div>

          <div className="tru-wizard-form">
            <div className="tru-wizard-input-group">
              <label className="tru-wizard-label">Location</label>
              <div className="tru-wizard-input-wrapper">
                <MapPin className="tru-wizard-input-icon" />
                <LocationAutocomplete
                  value={details.toLocation}
                  onValueChange={(val) => updateDetails({ toLocation: val })}
                  onLocationSelect={(city) => updateDetails({ toLocation: city })}
                  placeholder="City or ZIP code"
                  onKeyDown={handleKeyDown}
                  className="tru-wizard-input has-icon"
                />
              </div>
            </div>

            <div className="tru-wizard-input-group">
              <label className="tru-wizard-label">Property Type</label>
              <div className="tru-wizard-toggle-row">
                <button
                  type="button"
                  className={`tru-wizard-toggle-btn ${details.toPropertyType === 'house' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ toPropertyType: 'house' })}
                >
                  <Home className="w-5 h-5" />
                  <span>House</span>
                </button>
                <button
                  type="button"
                  className={`tru-wizard-toggle-btn ${details.toPropertyType === 'apartment' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ toPropertyType: 'apartment' })}
                >
                  <Building2 className="w-5 h-5" />
                  <span>Apartment</span>
                </button>
              </div>
            </div>

            {details.toPropertyType === 'apartment' && (
              <>
                <div className="tru-wizard-input-group animate-fade-in">
                  <label className="tru-wizard-label">What floor?</label>
                  <div className="tru-wizard-pills">
                    {FLOOR_OPTIONS.map((floor) => (
                      <button
                        key={floor.value}
                        type="button"
                        className={`tru-wizard-pill ${details.toFloor === floor.value ? 'is-active' : ''}`}
                        onClick={() => updateDetails({ toFloor: floor.value })}
                      >
                        {floor.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tru-wizard-input-group animate-fade-in">
                  <label className="tru-wizard-label">Access type</label>
                  <div className="tru-wizard-toggle-row">
                    <button
                      type="button"
                      className={`tru-wizard-toggle-btn ${!details.toHasElevator ? 'is-active' : ''}`}
                      onClick={() => updateDetails({ toHasElevator: false })}
                    >
                      <MoveVertical className="w-5 h-5" />
                      <span>Stairs</span>
                    </button>
                    <button
                      type="button"
                      className={`tru-wizard-toggle-btn ${details.toHasElevator ? 'is-active' : ''}`}
                      onClick={() => updateDetails({ toHasElevator: true })}
                    >
                      <ArrowUpDown className="w-5 h-5" />
                      <span>Elevator</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="tru-wizard-continue"
            disabled={!canContinue()}
            onClick={goNext}
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button type="button" className="tru-wizard-back" onClick={goBack}>
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      )}

      {/* Step 4: Move Date */}
      {step === 4 && (
        <div className={cn("tru-wizard-step", direction === 'backward' && "backwards")} key="step-4">
          <div className="tru-wizard-header">
            <h2 className="tru-wizard-question">When would you like to move?</h2>
            <p className="tru-wizard-subtitle">Select your target move date</p>
          </div>

          <div className="tru-wizard-form">
            <div className="tru-wizard-input-group">
              <label className="tru-wizard-label">Move Date</label>
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <button type="button" className="tru-wizard-date-btn">
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
          </div>

          <button
            type="button"
            className="tru-wizard-continue"
            disabled={!canContinue()}
            onClick={goNext}
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button type="button" className="tru-wizard-back" onClick={goBack}>
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      )}

      {/* Step 5: Parking Distance */}
      {step === 5 && (
        <div className={cn("tru-wizard-step", direction === 'backward' && "backwards")} key="step-5">
          <div className="tru-wizard-header">
            <h2 className="tru-wizard-question">How far is parking from the entrance?</h2>
            <p className="tru-wizard-subtitle">This helps us estimate carry distance for your move</p>
          </div>

          <div className="tru-wizard-form">
            <div className="tru-wizard-input-group">
              <label className="tru-wizard-label">
                <Footprints className="w-4 h-4" />
                At your current location (FROM)
              </label>
              <div className="tru-wizard-option-cards">
                <button
                  type="button"
                  className={`tru-wizard-option-card ${details.fromParkingDistance === 'unknown' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ fromParkingDistance: 'unknown' })}
                >
                  <HelpCircle className="w-5 h-5" />
                  <span>I don't know</span>
                  {details.fromParkingDistance === 'unknown' && <Check className="w-4 h-4 check-icon" />}
                </button>
                <button
                  type="button"
                  className={`tru-wizard-option-card ${details.fromParkingDistance === 'less75' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ fromParkingDistance: 'less75' })}
                >
                  <Footprints className="w-5 h-5" />
                  <span>Less than 75 feet</span>
                  {details.fromParkingDistance === 'less75' && <Check className="w-4 h-4 check-icon" />}
                </button>
                <button
                  type="button"
                  className={`tru-wizard-option-card ${details.fromParkingDistance === 'more75' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ fromParkingDistance: 'more75' })}
                >
                  <Footprints className="w-5 h-5" />
                  <span>More than 75 feet</span>
                  {details.fromParkingDistance === 'more75' && <Check className="w-4 h-4 check-icon" />}
                </button>
              </div>
            </div>

            <div className="tru-wizard-input-group">
              <label className="tru-wizard-label">
                <Footprints className="w-4 h-4" />
                At your new location (TO)
              </label>
              <div className="tru-wizard-option-cards">
                <button
                  type="button"
                  className={`tru-wizard-option-card ${details.toParkingDistance === 'unknown' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ toParkingDistance: 'unknown' })}
                >
                  <HelpCircle className="w-5 h-5" />
                  <span>I don't know</span>
                  {details.toParkingDistance === 'unknown' && <Check className="w-4 h-4 check-icon" />}
                </button>
                <button
                  type="button"
                  className={`tru-wizard-option-card ${details.toParkingDistance === 'less75' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ toParkingDistance: 'less75' })}
                >
                  <Footprints className="w-5 h-5" />
                  <span>Less than 75 feet</span>
                  {details.toParkingDistance === 'less75' && <Check className="w-4 h-4 check-icon" />}
                </button>
                <button
                  type="button"
                  className={`tru-wizard-option-card ${details.toParkingDistance === 'more75' ? 'is-active' : ''}`}
                  onClick={() => updateDetails({ toParkingDistance: 'more75' })}
                >
                  <Footprints className="w-5 h-5" />
                  <span>More than 75 feet</span>
                  {details.toParkingDistance === 'more75' && <Check className="w-4 h-4 check-icon" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="tru-wizard-continue"
            disabled={!canContinue()}
            onClick={goNext}
          >
            <span>Start Building Inventory</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button type="button" className="tru-wizard-back" onClick={goBack}>
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      )}
    </div>
  );
}
