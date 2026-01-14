import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import { Phone, Video, ArrowRight, ChevronLeft, Check, Car, Package, CalendarIcon, MapPin, Home, Truck, Mail, Boxes, Brain, Sparkles } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import MoveMap from "@/components/MoveMap";
import TechIndicatorStrip from "@/components/TechIndicatorStrip";

// Format date as MM/DD/YY
const formatShortDate = (date: Date) => {
  return format(date, "MM/dd/yy");
};

// Expanded ZIP to city lookup for common US cities
const ZIP_LOOKUP: Record<string, string> = {
  // California
  "90210": "Beverly Hills, CA", "90001": "Los Angeles, CA", "90012": "Los Angeles, CA",
  "92101": "San Diego, CA", "95101": "San Jose, CA", "94102": "San Francisco, CA",
  "94601": "Oakland, CA", "92801": "Anaheim, CA", "92627": "Costa Mesa, CA",
  "90802": "Long Beach, CA", "93301": "Bakersfield, CA", "95814": "Sacramento, CA",
  "92612": "Irvine, CA", "91101": "Pasadena, CA", "92701": "Santa Ana, CA",
  // New York
  "10001": "New York, NY", "10016": "New York, NY", "10019": "New York, NY",
  "11201": "Brooklyn, NY", "10451": "Bronx, NY", "11101": "Queens, NY",
  "10301": "Staten Island, NY", "10701": "Yonkers, NY", "12201": "Albany, NY",
  "14201": "Buffalo, NY", "13201": "Syracuse, NY", "14604": "Rochester, NY",
  // Texas
  "77001": "Houston, TX", "77002": "Houston, TX", "75201": "Dallas, TX",
  "78201": "San Antonio, TX", "73301": "Austin, TX", "78701": "Austin, TX",
  "76101": "Fort Worth, TX", "79901": "El Paso, TX", "78401": "Corpus Christi, TX",
  "79401": "Lubbock, TX", "76001": "Arlington, TX", "75001": "Addison, TX",
  // Florida
  "33101": "Miami, FL", "33139": "Miami Beach, FL", "32801": "Orlando, FL",
  "33602": "Tampa, FL", "33301": "Fort Lauderdale, FL", "33401": "West Palm Beach, FL",
  "32301": "Tallahassee, FL", "32099": "Jacksonville, FL", "33901": "Fort Myers, FL",
  "34201": "Bradenton, FL", "33498": "Boca Raton, FL", "34102": "Naples, FL",
  // Illinois
  "60601": "Chicago, IL", "60602": "Chicago, IL", "60614": "Chicago, IL",
  "61101": "Rockford, IL", "62701": "Springfield, IL", "61602": "Peoria, IL",
  // Other major cities
  "85001": "Phoenix, AZ", "85701": "Tucson, AZ", "85201": "Mesa, AZ",
  "19101": "Philadelphia, PA", "15201": "Pittsburgh, PA",
  "98101": "Seattle, WA", "98401": "Tacoma, WA", "99201": "Spokane, WA",
  "80201": "Denver, CO", "80901": "Colorado Springs, CO", "80301": "Boulder, CO",
  "02101": "Boston, MA", "02139": "Cambridge, MA", "01101": "Springfield, MA",
  "20001": "Washington, DC", "20500": "Washington, DC",
  "30301": "Atlanta, GA", "31401": "Savannah, GA", "30901": "Augusta, GA",
  "89101": "Las Vegas, NV", "89501": "Reno, NV",
  "97201": "Portland, OR", "97401": "Eugene, OR",
  "48201": "Detroit, MI", "49501": "Grand Rapids, MI", "48601": "Saginaw, MI",
  "55401": "Minneapolis, MN", "55101": "Saint Paul, MN",
  "63101": "St. Louis, MO", "64101": "Kansas City, MO",
  "28201": "Charlotte, NC", "27601": "Raleigh, NC", "27401": "Greensboro, NC",
  "37201": "Nashville, TN", "38101": "Memphis, TN", "37901": "Knoxville, TN",
  "46201": "Indianapolis, IN", "46801": "Fort Wayne, IN",
  "44101": "Cleveland, OH", "43201": "Columbus, OH", "45201": "Cincinnati, OH",
  "53201": "Milwaukee, WI", "53701": "Madison, WI",
  "70112": "New Orleans, LA", "70801": "Baton Rouge, LA",
  "84101": "Salt Lake City, UT", "84601": "Provo, UT",
  "23219": "Richmond, VA", "23451": "Virginia Beach, VA", "22301": "Alexandria, VA",
  "21201": "Baltimore, MD", "20901": "Silver Spring, MD",
  "06101": "Hartford, CT", "06510": "New Haven, CT",
  "87101": "Albuquerque, NM", "87501": "Santa Fe, NM",
  "73101": "Oklahoma City, OK", "74101": "Tulsa, OK",
  "40201": "Louisville, KY", "40501": "Lexington, KY",
  "29401": "Charleston, SC", "29201": "Columbia, SC",
  "35201": "Birmingham, AL", "36101": "Montgomery, AL",
  "96801": "Honolulu, HI", "99501": "Anchorage, AK",
};

interface LocationSuggestion {
  zip: string;
  city: string;
  display: string;
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

async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  const suggestions: LocationSuggestion[] = [];
  const queryLower = query.toLowerCase().trim();
  const isNumeric = /^\d+$/.test(query);
  
  for (const [zip, city] of Object.entries(ZIP_LOOKUP)) {
    if (isNumeric) {
      if (zip.startsWith(query)) {
        suggestions.push({ zip, city, display: `${city} (${zip})` });
      }
    } else {
      if (city.toLowerCase().includes(queryLower)) {
        suggestions.push({ zip, city, display: `${city} (${zip})` });
      }
    }
  }
  
  if (isNumeric && suggestions.length < 4 && query.length >= 3) {
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${query.padEnd(5, '0').slice(0, 5)}`);
      if (res.ok) {
        const data = await res.json();
        const cityName = `${data.places[0]["place name"]}, ${data.places[0]["state abbreviation"]}`;
        const fullZip = data["post code"];
        if (!suggestions.find(s => s.zip === fullZip)) {
          suggestions.push({ zip: fullZip, city: cityName, display: `${cityName} (${fullZip})` });
        }
      }
    } catch {}
  }
  
  return suggestions.slice(0, 5);
}

const MOVE_SIZES = [
  { value: "Studio", label: "Studio" },
  { value: "1 Bedroom", label: "1 Bed" },
  { value: "2 Bedroom", label: "2 Bed" },
  { value: "3 Bedroom", label: "3 Bed" },
  { value: "4+ Bedroom", label: "4+ Bed" },
  { value: "Office", label: "Office" },
];

// Focus mode step labels
const FOCUS_STEPS = ['from', 'to', 'date', 'size', 'vehicle', 'packing', 'email', 'phone', 'complete'] as const;
type FocusStep = typeof FOCUS_STEPS[number];

export default function Index() {
  const navigate = useNavigate();
  
  // Focus mode state
  const [focusStep, setFocusStep] = useState<FocusStep>('from');
  const [aiMessage, setAiMessage] = useState("");
  const [showEstimate, setShowEstimate] = useState(false);
  const [estimateRange, setEstimateRange] = useState({ min: 0, max: 0 });
  
  const [formData, setFormData] = useState({
    fromZip: "", toZip: "", moveDate: null as Date | null, 
    size: "", hasCar: null as boolean | null, needsPacking: null as boolean | null,
    email: "", phone: ""
  });
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  // Validation helpers
  const zipOk = (z: string) => /^\d{5}$/.test(z.trim());
  const phoneOk = (p: string) => (p.replace(/\D/g, "")).length >= 10;
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  // Calculate rough estimate based on current data
  const calculateEstimate = () => {
    let base = 1500;
    
    if (formData.size === "Studio") base = 800;
    else if (formData.size === "1 Bedroom") base = 1200;
    else if (formData.size === "2 Bedroom") base = 2200;
    else if (formData.size === "3 Bedroom") base = 3500;
    else if (formData.size === "4+ Bedroom") base = 5000;
    else if (formData.size === "Office") base = 3000;
    
    if (formData.hasCar) base += 800;
    if (formData.needsPacking) base += 600;
    
    const variance = base * 0.2;
    return { min: Math.round(base - variance), max: Math.round(base + variance) };
  };

  // Location lookup effect
  useEffect(() => {
    if (zipOk(formData.fromZip)) {
      lookupZip(formData.fromZip).then(city => setFromCity(city || ""));
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    } else if (fromInput.length >= 2) {
      searchLocations(fromInput).then(s => {
        setFromSuggestions(s);
        setShowFromSuggestions(s.length > 0);
      });
      setFromCity("");
    } else {
      setFromCity("");
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  }, [formData.fromZip, fromInput]);

  useEffect(() => {
    if (zipOk(formData.toZip)) {
      lookupZip(formData.toZip).then(city => setToCity(city || ""));
      setToSuggestions([]);
      setShowToSuggestions(false);
    } else if (toInput.length >= 2) {
      searchLocations(toInput).then(s => {
        setToSuggestions(s);
        setShowToSuggestions(s.length > 0);
      });
      setToCity("");
    } else {
      setToCity("");
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  }, [formData.toZip, toInput]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const fromContainer = fromInputRef.current?.closest('.tru-focus-input-wrap');
      const toContainer = toInputRef.current?.closest('.tru-focus-input-wrap');
      
      if (fromContainer && !fromContainer.contains(target)) {
        setShowFromSuggestions(false);
      }
      if (toContainer && !toContainer.contains(target)) {
        setShowToSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update estimate when relevant fields change
  useEffect(() => {
    if (formData.size) {
      setEstimateRange(calculateEstimate());
      setShowEstimate(true);
    }
  }, [formData.size, formData.hasCar, formData.needsPacking]);

  // Get current step index for progress
  const currentStepIndex = FOCUS_STEPS.indexOf(focusStep);
  const completedSteps = currentStepIndex;

  // AI Message generator
  const generateAiMessage = (step: FocusStep) => {
    switch (step) {
      case 'to':
        return fromCity 
          ? `Perfect! ${fromCity.split(',')[0]} — we have vetted movers ready in your area.`
          : "Got it! We have vetted movers ready in your area.";
      case 'date':
        if (fromCity && toCity) {
          return `${toCity.split(',')[0]} confirmed! Analyzing the best carriers for this route...`;
        }
        return "Destination locked in! Analyzing the best carriers for this route...";
      case 'size':
        if (formData.moveDate) {
          const month = format(formData.moveDate, "MMMM");
          return `${month} is a great time to move — typically 15% lower demand than summer.`;
        }
        return "Date saved! Now let's size up your move.";
      case 'vehicle':
        return `${formData.size} move noted. Our AI is already filtering carriers with the right equipment.`;
      case 'packing':
        return formData.hasCar 
          ? "We'll include auto transport carriers in your options."
          : "No problem — household items only.";
      case 'email':
        return formData.needsPacking
          ? "Packing services added! This typically adds 1-2 crew members to your move."
          : "Got it — you'll handle packing. That keeps costs down!";
      case 'phone':
        return "Almost done! Just need your phone for move-day coordination.";
      case 'complete':
        return "You're all set! Choose how you'd like to proceed.";
      default:
        return "";
    }
  };

  // Handle step advancement
  const advanceStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < FOCUS_STEPS.length) {
      const nextStep = FOCUS_STEPS[nextIndex];
      setAiMessage(generateAiMessage(nextStep));
      setFocusStep(nextStep);
    }
  };

  // Validate current step
  const validateCurrentStep = (): boolean => {
    setErrors({});
    switch (focusStep) {
      case 'from':
        if (!zipOk(formData.fromZip)) {
          setErrors({ fromZip: true });
          return false;
        }
        return true;
      case 'to':
        if (!zipOk(formData.toZip)) {
          setErrors({ toZip: true });
          return false;
        }
        return true;
      case 'date':
        if (!formData.moveDate) {
          setErrors({ moveDate: true });
          return false;
        }
        return true;
      case 'size':
        if (!formData.size) {
          setErrors({ size: true });
          return false;
        }
        return true;
      case 'vehicle':
        if (formData.hasCar === null) {
          setErrors({ hasCar: true });
          return false;
        }
        return true;
      case 'packing':
        if (formData.needsPacking === null) {
          setErrors({ needsPacking: true });
          return false;
        }
        return true;
      case 'email':
        if (!emailOk(formData.email)) {
          setErrors({ email: true });
          return false;
        }
        return true;
      case 'phone':
        if (!phoneOk(formData.phone)) {
          setErrors({ phone: true });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleContinue = () => {
    if (validateCurrentStep()) {
      advanceStep();
    }
  };

  // Handle Enter key for text inputs
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleContinue();
    }
  };

  // Go back to previous step
  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setFocusStep(FOCUS_STEPS[prevIndex]);
      setAiMessage("");
    }
  };

  const handleIntent = (intent: string) => {
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

  // Render progress dots
  const renderProgressDots = () => (
    <div className="tru-progress-dots">
      {FOCUS_STEPS.slice(0, -1).map((step, idx) => (
        <span 
          key={step} 
          className={cn(
            "tru-progress-dot",
            idx < completedSteps && "is-complete",
            idx === completedSteps && "is-current"
          )} 
        />
      ))}
    </div>
  );

  // Render confirmed badges for completed fields
  const renderConfirmedBadge = (text: string) => (
    <div className="tru-confirmed-badge">
      <Check className="tru-confirmed-badge-icon" />
      <span>{text}</span>
    </div>
  );

  // Render AI bubble
  const renderAiBubble = () => {
    if (!aiMessage) return null;
    return (
      <div className="tru-ai-bubble">
        <Brain className="tru-ai-icon" />
        <span className="tru-ai-text">{aiMessage}</span>
      </div>
    );
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (focusStep) {
      case 'from':
        return (
          <div className="tru-focus-hero">
            <h2 className="tru-focus-question">Where are you moving from?</h2>
            <p className="tru-focus-subtext">Enter your current ZIP code or city</p>
            <div className="tru-focus-input-wrap">
              <input
                ref={fromInputRef}
                type="text"
                className={cn("tru-focus-input", errors.fromZip && "is-error")}
                placeholder="ZIP or City"
                value={zipOk(formData.fromZip) ? formData.fromZip : fromInput}
                onChange={e => {
                  const val = e.target.value;
                  const isNumeric = /^\d+$/.test(val);
                  if (isNumeric) {
                    const numVal = val.slice(0, 5);
                    setFormData(p => ({ ...p, fromZip: numVal }));
                    setFromInput(numVal);
                    if (zipOk(numVal)) setErrors({});
                  } else {
                    setFromInput(val);
                    setFormData(p => ({ ...p, fromZip: "" }));
                  }
                }}
                onFocus={() => fromSuggestions.length > 0 && setShowFromSuggestions(true)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <div className="tru-zip-suggestions" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8 }}>
                  {fromSuggestions.map(s => (
                    <button
                      key={s.zip}
                      type="button"
                      className="tru-zip-suggestion"
                      onClick={() => {
                        setFormData(p => ({ ...p, fromZip: s.zip }));
                        setFromInput(s.zip);
                        setShowFromSuggestions(false);
                        setErrors({});
                      }}
                    >
                      <span className="tru-zip-suggestion-city">{s.display}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {fromCity && <div className="tru-confirmed-badge" style={{ marginTop: 12 }}><MapPin className="tru-confirmed-badge-icon" /><span>{fromCity}</span></div>}
            <button 
              type="button" 
              className="tru-focus-continue" 
              onClick={handleContinue}
              disabled={!zipOk(formData.fromZip)}
            >
              <span>Continue</span>
              <ArrowRight className="tru-focus-continue-icon" />
            </button>
            <TechIndicatorStrip />
            {renderProgressDots()}
          </div>
        );

      case 'to':
        return (
          <div className="tru-focus-hero">
            {renderConfirmedBadge(fromCity || formData.fromZip)}
            <h2 className="tru-focus-question">Where are you moving to?</h2>
            <p className="tru-focus-subtext">Enter your destination ZIP code or city</p>
            {renderAiBubble()}
            <div className="tru-focus-input-wrap">
              <input
                ref={toInputRef}
                type="text"
                className={cn("tru-focus-input", errors.toZip && "is-error")}
                placeholder="ZIP or City"
                value={zipOk(formData.toZip) ? formData.toZip : toInput}
                onChange={e => {
                  const val = e.target.value;
                  const isNumeric = /^\d+$/.test(val);
                  if (isNumeric) {
                    const numVal = val.slice(0, 5);
                    setFormData(p => ({ ...p, toZip: numVal }));
                    setToInput(numVal);
                    if (zipOk(numVal)) setErrors({});
                  } else {
                    setToInput(val);
                    setFormData(p => ({ ...p, toZip: "" }));
                  }
                }}
                onFocus={() => toSuggestions.length > 0 && setShowToSuggestions(true)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              {showToSuggestions && toSuggestions.length > 0 && (
                <div className="tru-zip-suggestions" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8 }}>
                  {toSuggestions.map(s => (
                    <button
                      key={s.zip}
                      type="button"
                      className="tru-zip-suggestion"
                      onClick={() => {
                        setFormData(p => ({ ...p, toZip: s.zip }));
                        setToInput(s.zip);
                        setShowToSuggestions(false);
                        setErrors({});
                      }}
                    >
                      <span className="tru-zip-suggestion-city">{s.display}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {toCity && <div className="tru-confirmed-badge" style={{ marginTop: 12 }}><MapPin className="tru-confirmed-badge-icon" /><span>{toCity}</span></div>}
            <button 
              type="button" 
              className="tru-focus-continue" 
              onClick={handleContinue}
              disabled={!zipOk(formData.toZip)}
            >
              <span>Continue</span>
              <ArrowRight className="tru-focus-continue-icon" />
            </button>
            <button type="button" className="tru-back-link" onClick={goBack} style={{ marginTop: 12 }}>
              <ChevronLeft className="tru-back-icon" />
              <span>Back</span>
            </button>
            {renderProgressDots()}
          </div>
        );

      case 'date':
        return (
          <div className="tru-focus-hero">
            {renderConfirmedBadge(`${fromCity || formData.fromZip} → ${toCity || formData.toZip}`)}
            <h2 className="tru-focus-question">When would you like to move?</h2>
            <p className="tru-focus-subtext">Pick your ideal move date</p>
            {renderAiBubble()}
            
            {/* Show map reveal */}
            <div className="tru-map-reveal">
              <MoveMap fromZip={formData.fromZip} toZip={formData.toZip} />
            </div>

            <div className="tru-focus-input-wrap" style={{ marginTop: 20 }}>
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "tru-focus-date-btn",
                      !formData.moveDate && "is-placeholder"
                    )}
                  >
                    <CalendarIcon className="tru-focus-date-icon" />
                    <span>
                      {formData.moveDate 
                        ? format(formData.moveDate, "MMMM d, yyyy")
                        : "Select a date"
                      }
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="tru-date-popover" align="center">
                  <CalendarComponent
                    mode="single"
                    selected={formData.moveDate || undefined}
                    onSelect={(date) => {
                      setFormData(p => ({ ...p, moveDate: date || null }));
                      setDatePopoverOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    className="tru-calendar-popup pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <button 
              type="button" 
              className="tru-focus-continue" 
              onClick={handleContinue}
              disabled={!formData.moveDate}
            >
              <span>Continue</span>
              <ArrowRight className="tru-focus-continue-icon" />
            </button>
            <button type="button" className="tru-back-link" onClick={goBack} style={{ marginTop: 12 }}>
              <ChevronLeft className="tru-back-icon" />
              <span>Back</span>
            </button>
            {renderProgressDots()}
          </div>
        );

      case 'size':
        return (
          <div className="tru-focus-hero">
            {renderConfirmedBadge(formData.moveDate ? format(formData.moveDate, "MMM d, yyyy") : "")}
            <h2 className="tru-focus-question">What size is your move?</h2>
            <p className="tru-focus-subtext">This helps us match you with the right carriers</p>
            {renderAiBubble()}
            <div className="tru-focus-size-grid">
              {MOVE_SIZES.map(size => (
                <button
                  key={size.value}
                  type="button"
                  className={cn("tru-focus-size-btn", formData.size === size.value && "is-selected")}
                  onClick={() => {
                    setFormData(p => ({ ...p, size: size.value }));
                    setTimeout(handleContinue, 300);
                  }}
                >
                  {formData.size === size.value && <Check className="tru-focus-size-check" />}
                  <span>{size.label}</span>
                </button>
              ))}
            </div>
            <button type="button" className="tru-back-link" onClick={goBack} style={{ marginTop: 24 }}>
              <ChevronLeft className="tru-back-icon" />
              <span>Back</span>
            </button>
            {renderProgressDots()}
          </div>
        );

      case 'vehicle':
        return (
          <div className="tru-focus-hero">
            {renderConfirmedBadge(formData.size)}
            <h2 className="tru-focus-question">Shipping a vehicle?</h2>
            <p className="tru-focus-subtext">We can include auto transport in your quote</p>
            {renderAiBubble()}
            
            {showEstimate && (
              <div className="tru-live-estimate">
                <span className="tru-estimate-label">Estimated Range</span>
                <span className="tru-estimate-value">${estimateRange.min.toLocaleString()} - ${estimateRange.max.toLocaleString()}</span>
                <span className="tru-estimate-note">Refining as you answer...</span>
              </div>
            )}

            <div className="tru-focus-toggle-group" style={{ marginTop: 24 }}>
              <button
                type="button"
                className={cn("tru-focus-toggle-btn", formData.hasCar === true && "is-active")}
                onClick={() => {
                  setFormData(p => ({ ...p, hasCar: true }));
                  setTimeout(handleContinue, 300);
                }}
              >
                <Car className="tru-focus-toggle-icon" />
                <span>Yes</span>
              </button>
              <button
                type="button"
                className={cn("tru-focus-toggle-btn", formData.hasCar === false && "is-active")}
                onClick={() => {
                  setFormData(p => ({ ...p, hasCar: false }));
                  setTimeout(handleContinue, 300);
                }}
              >
                <span>No</span>
              </button>
            </div>
            <button type="button" className="tru-back-link" onClick={goBack} style={{ marginTop: 24 }}>
              <ChevronLeft className="tru-back-icon" />
              <span>Back</span>
            </button>
            {renderProgressDots()}
          </div>
        );

      case 'packing':
        return (
          <div className="tru-focus-hero">
            {formData.hasCar && renderConfirmedBadge("Vehicle included")}
            <h2 className="tru-focus-question">Need packing help?</h2>
            <p className="tru-focus-subtext">Professional packers can save you time and stress</p>
            {renderAiBubble()}
            
            {showEstimate && (
              <div className="tru-live-estimate">
                <span className="tru-estimate-label">Estimated Range</span>
                <span className="tru-estimate-value">${estimateRange.min.toLocaleString()} - ${estimateRange.max.toLocaleString()}</span>
                <span className="tru-estimate-note">Refining as you answer...</span>
              </div>
            )}

            <div className="tru-focus-toggle-group" style={{ marginTop: 24 }}>
              <button
                type="button"
                className={cn("tru-focus-toggle-btn", formData.needsPacking === true && "is-active")}
                onClick={() => {
                  setFormData(p => ({ ...p, needsPacking: true }));
                  setTimeout(handleContinue, 300);
                }}
              >
                <Package className="tru-focus-toggle-icon" />
                <span>Yes</span>
              </button>
              <button
                type="button"
                className={cn("tru-focus-toggle-btn", formData.needsPacking === false && "is-active")}
                onClick={() => {
                  setFormData(p => ({ ...p, needsPacking: false }));
                  setTimeout(handleContinue, 300);
                }}
              >
                <span>No</span>
              </button>
            </div>
            <button type="button" className="tru-back-link" onClick={goBack} style={{ marginTop: 24 }}>
              <ChevronLeft className="tru-back-icon" />
              <span>Back</span>
            </button>
            {renderProgressDots()}
          </div>
        );

      case 'email':
        return (
          <div className="tru-focus-hero">
            <h2 className="tru-focus-question">What's your email?</h2>
            <p className="tru-focus-subtext">We'll send your quote and move details here</p>
            {renderAiBubble()}
            
            {showEstimate && (
              <div className="tru-live-estimate">
                <span className="tru-estimate-label">Your Estimate</span>
                <span className="tru-estimate-value">${estimateRange.min.toLocaleString()} - ${estimateRange.max.toLocaleString()}</span>
              </div>
            )}

            <div className="tru-focus-input-wrap" style={{ marginTop: 24 }}>
              <input
                type="email"
                className={cn("tru-focus-input", errors.email && "is-error")}
                placeholder="you@email.com"
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            <button 
              type="button" 
              className="tru-focus-continue" 
              onClick={handleContinue}
              disabled={!emailOk(formData.email)}
            >
              <span>Continue</span>
              <ArrowRight className="tru-focus-continue-icon" />
            </button>
            <button type="button" className="tru-back-link" onClick={goBack} style={{ marginTop: 12 }}>
              <ChevronLeft className="tru-back-icon" />
              <span>Back</span>
            </button>
            {renderProgressDots()}
          </div>
        );

      case 'phone':
        return (
          <div className="tru-focus-hero">
            <h2 className="tru-focus-question">What's your phone number?</h2>
            <p className="tru-focus-subtext">For move-day coordination only — no spam, ever</p>
            {renderAiBubble()}
            <div className="tru-focus-input-wrap">
              <input
                type="tel"
                className={cn("tru-focus-input", errors.phone && "is-error")}
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            <button 
              type="button" 
              className="tru-focus-continue" 
              onClick={handleContinue}
              disabled={!phoneOk(formData.phone)}
            >
              <span>Get My Quote</span>
              <Sparkles className="tru-focus-continue-icon" />
            </button>
            <button type="button" className="tru-back-link" onClick={goBack} style={{ marginTop: 12 }}>
              <ChevronLeft className="tru-back-icon" />
              <span>Back</span>
            </button>
            {renderProgressDots()}
          </div>
        );

      case 'complete':
        return (
          <div className="tru-focus-hero">
            <div className="tru-confirmed-badge" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid hsl(142 76% 36%)' }}>
              <Check className="tru-confirmed-badge-icon" style={{ color: 'hsl(142 76% 36%)' }} />
              <span style={{ color: 'hsl(142 76% 30%)' }}>Quote Ready!</span>
            </div>
            <h2 className="tru-focus-question">You're all set!</h2>
            <p className="tru-focus-subtext">Choose how you'd like to proceed</p>
            {renderAiBubble()}
            
            {showEstimate && (
              <div className="tru-live-estimate">
                <span className="tru-estimate-label">Your Estimated Move</span>
                <span className="tru-estimate-value">${estimateRange.min.toLocaleString()} - ${estimateRange.max.toLocaleString()}</span>
                <span className="tru-estimate-note">{fromCity || formData.fromZip} → {toCity || formData.toZip}</span>
              </div>
            )}

            {/* Move Summary */}
            <div className="tru-move-summary" style={{ maxWidth: 380, width: '100%', marginTop: 20 }}>
              <div className="tru-summary-header">Your Move Summary</div>
              <div className="tru-summary-content">
                <div className="tru-summary-row">
                  <MapPin className="tru-summary-icon-dark" />
                  <span>{fromCity || formData.fromZip} → {toCity || formData.toZip}</span>
                </div>
                <div className="tru-summary-row">
                  <CalendarIcon className="tru-summary-icon-dark" />
                  <span>{formData.moveDate ? format(formData.moveDate, "MMMM d, yyyy") : "Date not set"}</span>
                </div>
                <div className="tru-summary-badges">
                  <span className="tru-summary-badge">
                    <Home className="tru-summary-badge-icon" />
                    {formData.size}
                  </span>
                  {formData.hasCar && (
                    <span className="tru-summary-badge">
                      <Car className="tru-summary-badge-icon" />
                      Vehicle
                    </span>
                  )}
                  {formData.needsPacking && (
                    <span className="tru-summary-badge">
                      <Package className="tru-summary-badge-icon" />
                      Packing
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Options */}
            <div className="tru-cta-grid" style={{ maxWidth: 380, width: '100%', marginTop: 20 }}>
              <button type="button" className="tru-cta-option" onClick={() => handleIntent("specialist")}>
                <Phone className="tru-cta-icon" />
                <div className="tru-cta-content">
                  <span className="tru-cta-title">Talk to Specialist</span>
                  <span className="tru-cta-desc">Get personalized guidance</span>
                </div>
              </button>
              <button type="button" className="tru-cta-option" onClick={() => handleIntent("virtual")}>
                <Video className="tru-cta-icon" />
                <div className="tru-cta-content">
                  <span className="tru-cta-title">Book Virtual Meet</span>
                  <span className="tru-cta-desc">Schedule your specialist</span>
                </div>
              </button>
            </div>
            
            <button type="button" className="tru-focus-continue" onClick={() => handleIntent("builder")} style={{ marginTop: 16 }}>
              <Boxes className="tru-focus-continue-icon" style={{ marginRight: 4 }} />
              <span>Build My Move Online</span>
              <ArrowRight className="tru-focus-continue-icon" />
            </button>
            
            <button type="button" className="tru-back-link" onClick={goBack} style={{ marginTop: 12 }}>
              <ChevronLeft className="tru-back-icon" />
              <span>Edit answers</span>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

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

              {/* PREMIUM WIZARD CONSOLE - Now with Focus Mode */}
              <div className="tru-hero-visual">
                <div className="tru-form-card">
                  {/* Header */}
                  <div className="tru-form-header">
                    <div className="tru-form-header-top">
                      <img src={logo} alt="TruMove" className="tru-form-logo" />
                      <div className="tru-form-status">
                        <span className="tru-status-dot"></span>
                        <span className="tru-status-text">Online</span>
                      </div>
                    </div>
                  </div>

                  {/* Focus Mode Content */}
                  <div className="tru-form-body">
                    {renderStepContent()}
                  </div>

                  {/* Trust footer */}
                  <div className="tru-form-footer">
                    <span className="tru-form-disclaimer">By submitting, you agree we may contact you by phone, text, or email, including via automated technology. Consent is not required to purchase services.</span>
                    <span className="tru-form-secure">🔒 Your info is secure & never sold.</span>
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
