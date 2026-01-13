import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import { Phone, Video, ArrowRight, ChevronLeft, Check, Car, Package, CalendarIcon, MapPin, Home, Truck, Mail, Boxes } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

// Format date with ordinal suffix (Jan 1st, 2026)
const formatDateWithOrdinal = (date: Date) => {
  const day = date.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? 'st'
    : day === 2 || day === 22 ? 'nd'
    : day === 3 || day === 23 ? 'rd'
    : 'th';
  return format(date, `MMM d`) + suffix + format(date, `, yyyy`);
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
  
  // Search local lookup for matches (both ZIP and city)
  for (const [zip, city] of Object.entries(ZIP_LOOKUP)) {
    if (isNumeric) {
      // If numeric, search by ZIP prefix
      if (zip.startsWith(query)) {
        suggestions.push({ zip, city, display: `${city} (${zip})` });
      }
    } else {
      // If text, search by city name
      if (city.toLowerCase().includes(queryLower)) {
        suggestions.push({ zip, city, display: `${city} (${zip})` });
      }
    }
  }
  
  // If searching by city name and not enough local results, try the API
  if (!isNumeric && suggestions.length < 4 && query.length >= 2) {
    // Try a few common ZIP prefixes to find matching cities
    const stateAbbrevs: Record<string, string[]> = {
      'new york': ['100', '101', '102', '103', '104', '110', '111', '112', '113', '114'],
      'los angeles': ['900', '901', '902', '903', '904'],
      'chicago': ['606', '607', '608'],
      'houston': ['770', '771', '772', '773', '774'],
      'miami': ['331', '332', '333'],
      'atlanta': ['303', '304', '305'],
      'boston': ['021', '022'],
      'seattle': ['981', '980'],
      'denver': ['802', '803'],
      'dallas': ['752', '753', '754'],
      'san francisco': ['941', '940'],
      'austin': ['787', '786'],
      'phoenix': ['850', '851', '852'],
      'orlando': ['328', '327', '326'],
      'tampa': ['336', '335', '334'],
    };
    
    for (const [cityKey, zips] of Object.entries(stateAbbrevs)) {
      if (cityKey.includes(queryLower)) {
        for (const zipPrefix of zips.slice(0, 2)) {
          try {
            const res = await fetch(`https://api.zippopotam.us/us/${zipPrefix}01`);
            if (res.ok) {
              const data = await res.json();
              const cityName = `${data.places[0]["place name"]}, ${data.places[0]["state abbreviation"]}`;
              const fullZip = data["post code"];
              if (!suggestions.find(s => s.zip === fullZip)) {
                suggestions.push({ zip: fullZip, city: cityName, display: `${cityName} (${fullZip})` });
              }
            }
          } catch {}
          if (suggestions.length >= 4) break;
        }
      }
      if (suggestions.length >= 4) break;
    }
  }
  
  // If numeric and not enough local results, try API
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
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromLoading, setFromLoading] = useState(false);
  const [toLoading, setToLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [truckAnimating, setTruckAnimating] = useState(true);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  // Validation helpers
  const zipOk = (z: string) => /^\d{5}$/.test(z.trim());
  const phoneOk = (p: string) => (p.replace(/\D/g, "")).length >= 10;
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  // Truck animation handler
  const replayTruck = () => {
    setTruckAnimating(false);
    setTimeout(() => setTruckAnimating(true), 50);
  };

  // Check if both ZIPs are valid for route line
  const bothZipsValid = zipOk(formData.fromZip) && zipOk(formData.toZip);

  // Location lookup and suggestions effect
  useEffect(() => {
    if (zipOk(formData.fromZip)) {
      lookupZip(formData.fromZip).then(city => setFromCity(city || ""));
      setFromSuggestions([]);
      setShowFromSuggestions(false);
      setFromLoading(false);
    } else if (fromInput.length >= 2) {
      setFromLoading(true);
      searchLocations(fromInput).then(s => {
        setFromSuggestions(s);
        setShowFromSuggestions(s.length > 0);
        setFromLoading(false);
      });
      setFromCity("");
    } else {
      setFromCity("");
      setFromSuggestions([]);
      setShowFromSuggestions(false);
      setFromLoading(false);
    }
  }, [formData.fromZip, fromInput]);

  useEffect(() => {
    if (zipOk(formData.toZip)) {
      lookupZip(formData.toZip).then(city => setToCity(city || ""));
      setToSuggestions([]);
      setShowToSuggestions(false);
      setToLoading(false);
    } else if (toInput.length >= 2) {
      setToLoading(true);
      searchLocations(toInput).then(s => {
        setToSuggestions(s);
        setShowToSuggestions(s.length > 0);
        setToLoading(false);
      });
      setToCity("");
    } else {
      setToCity("");
      setToSuggestions([]);
      setShowToSuggestions(false);
      setToLoading(false);
    }
  }, [formData.toZip, toInput]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const fromContainer = fromInputRef.current?.closest('.tru-zip-field');
      const toContainer = toInputRef.current?.closest('.tru-zip-field');
      
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
                  {/* Header */}
                  <div className="tru-form-header">
                    <div className="tru-form-header-top">
                      <img src={logo} alt="TruMove" className="tru-form-logo" />
                      <div className="tru-form-status">
                        <span className="tru-status-dot"></span>
                        <span className="tru-status-text">Online</span>
                      </div>
                    </div>
                    <div className="tru-form-flow-header">
                      <div className="tru-flow-breadcrumb">
                        <span className={cn("tru-flow-crumb", currentStep >= 1 && "is-active")}>Start TruMove</span>
                        <span className="tru-flow-sep">•</span>
                        <span className={cn("tru-flow-crumb", currentStep >= 2 && "is-active")}>Build Inventory</span>
                        <span className="tru-flow-sep">•</span>
                        <span className={cn("tru-flow-crumb", currentStep >= 3 && "is-active")}>Get Estimate</span>
                      </div>
                      {/* Truck Animation - Full Width Under Breadcrumb */}
                      <div className="tru-truck-line">
                        <div 
                          className={cn("tru-truck", truckAnimating && "is-animating")}
                          onClick={replayTruck}
                          title="Click to replay!"
                        >
                          <Truck className="tru-truck-icon" />
                        </div>
                      </div>
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
                        {/* ZIP Codes Side by Side with Route Line Between */}
                        <div className="tru-zip-row">
                          {/* From Location */}
                          <div className="tru-input-group tru-zip-group">
                            <label className="tru-input-label">Moving from</label>
                            <div className="tru-zip-field">
                              <div className={cn("tru-input-wrapper", errors.fromZip && "is-error")}>
                                <input 
                                  ref={fromInputRef}
                                  type="text" 
                                  className="tru-input"
                                  placeholder="ZIP or City"
                                  value={zipOk(formData.fromZip) ? formData.fromZip : fromInput}
                                  onChange={e => {
                                    const val = e.target.value;
                                    const isNumeric = /^\d+$/.test(val);
                                    if (isNumeric) {
                                      const numVal = val.slice(0, 5);
                                      setFormData(p => ({ ...p, fromZip: numVal }));
                                      setFromInput(numVal);
                                      if (zipOk(numVal)) setErrors(prev => ({ ...prev, fromZip: false }));
                                    } else {
                                      setFromInput(val);
                                      setFormData(p => ({ ...p, fromZip: "" }));
                                    }
                                  }}
                                  onFocus={() => fromSuggestions.length > 0 && setShowFromSuggestions(true)}
                                />
                              </div>
                              {(showFromSuggestions && fromSuggestions.length > 0) || fromLoading ? (
                                <div className="tru-zip-suggestions">
                                  {fromLoading ? (
                                    <div className="tru-zip-loading">
                                      <span className="tru-zip-loading-spinner" />
                                      <span>Searching...</span>
                                    </div>
                                  ) : (
                                    fromSuggestions.map(s => (
                                      <button
                                        key={s.zip}
                                        type="button"
                                        className="tru-zip-suggestion"
                                        onClick={() => {
                                          setFormData(p => ({ ...p, fromZip: s.zip }));
                                          setFromInput(s.zip);
                                          setShowFromSuggestions(false);
                                          setErrors(prev => ({ ...prev, fromZip: false }));
                                        }}
                                      >
                                        <span className="tru-zip-suggestion-city">{s.display}</span>
                                      </button>
                                    ))
                                  )}
                                </div>
                              ) : null}
                              {fromCity && <span className="tru-zip-city-badge">{fromCity}</span>}
                              {errors.fromZip && <span className="tru-field-error">Select a location</span>}
                            </div>
                          </div>

                          {/* Route Line Between ZIPs */}
                          <div className={cn("tru-route-connector", bothZipsValid && "is-visible")}>
                            <span className="tru-route-dot"></span>
                            <span className="tru-route-dashes"></span>
                            <span className="tru-route-arrow">→</span>
                            <span className="tru-route-dot"></span>
                          </div>

                          {/* To Location */}
                          <div className="tru-input-group tru-zip-group">
                            <label className="tru-input-label">Moving to</label>
                            <div className="tru-zip-field">
                              <div className={cn("tru-input-wrapper", errors.toZip && "is-error")}>
                                <input 
                                  ref={toInputRef}
                                  type="text" 
                                  className="tru-input"
                                  placeholder="ZIP or City"
                                  value={zipOk(formData.toZip) ? formData.toZip : toInput}
                                  onChange={e => {
                                    const val = e.target.value;
                                    const isNumeric = /^\d+$/.test(val);
                                    if (isNumeric) {
                                      const numVal = val.slice(0, 5);
                                      setFormData(p => ({ ...p, toZip: numVal }));
                                      setToInput(numVal);
                                      if (zipOk(numVal)) setErrors(prev => ({ ...prev, toZip: false }));
                                    } else {
                                      setToInput(val);
                                      setFormData(p => ({ ...p, toZip: "" }));
                                    }
                                  }}
                                  onFocus={() => toSuggestions.length > 0 && setShowToSuggestions(true)}
                                />
                              </div>
                              {(showToSuggestions && toSuggestions.length > 0) || toLoading ? (
                                <div className="tru-zip-suggestions">
                                  {toLoading ? (
                                    <div className="tru-zip-loading">
                                      <span className="tru-zip-loading-spinner" />
                                      <span>Searching...</span>
                                    </div>
                                  ) : (
                                    toSuggestions.map(s => (
                                      <button
                                        key={s.zip}
                                        type="button"
                                        className="tru-zip-suggestion"
                                        onClick={() => {
                                          setFormData(p => ({ ...p, toZip: s.zip }));
                                          setToInput(s.zip);
                                          setShowToSuggestions(false);
                                          setErrors(prev => ({ ...prev, toZip: false }));
                                        }}
                                      >
                                        <span className="tru-zip-suggestion-city">{s.display}</span>
                                      </button>
                                    ))
                                  )}
                                </div>
                              ) : null}
                              {toCity && <span className="tru-zip-city-badge">{toCity}</span>}
                              {errors.toZip && <span className="tru-field-error">Select a location</span>}
                            </div>
                          </div>
                        </div>

                        {/* Date Picker with Popover */}
                        <div className="tru-input-group">
                          <label className="tru-input-label">Move Date</label>
                          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className={cn(
                                  "tru-date-input",
                                  errors.moveDate && "is-error",
                                  !formData.moveDate && "is-placeholder"
                                )}
                              >
                                <CalendarIcon className="tru-date-icon" />
                                <span>
                                  {formData.moveDate 
                                    ? formatDateWithOrdinal(formData.moveDate)
                                    : "Select a date..."
                                  }
                                </span>
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="tru-date-popover" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={formData.moveDate || undefined}
                                onSelect={(date) => {
                                  setFormData(p => ({ ...p, moveDate: date || null }));
                                  if (date) setErrors(prev => ({ ...prev, moveDate: false }));
                                  setDatePopoverOpen(false);
                                }}
                                disabled={(date) => date < new Date()}
                                className="tru-calendar-popup pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          {errors.moveDate && <span className="tru-field-error">Please select a move date</span>}
                        </div>

                        <button type="button" className="tru-btn tru-btn-primary" onClick={nextStep}>
                          <Boxes className="tru-btn-icon" />
                          <span>Continue with Online Move Builder</span>
                          <ArrowRight className="tru-btn-icon" />
                        </button>

                        {/* Alternative CTA Options */}
                        <div className="tru-cta-grid tru-cta-grid-alt">
                          <a href="tel:+18001234567" className="tru-cta-option">
                            <Phone className="tru-cta-icon" />
                            <div className="tru-cta-content">
                              <span className="tru-cta-title">Talk to Specialist</span>
                              <span className="tru-cta-desc">Get personalized guidance</span>
                            </div>
                          </a>
                          <button type="button" className="tru-cta-option" onClick={() => navigate("/book")}>
                            <Video className="tru-cta-icon" />
                            <div className="tru-cta-content">
                              <span className="tru-cta-title">Book Virtual Meet</span>
                              <span className="tru-cta-desc">Schedule your specialist</span>
                            </div>
                          </button>
                        </div>
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
                          <label className="tru-input-label">Shipping a vehicle?</label>
                          <div className="tru-toggle-with-icon">
                            <div className={`tru-toggle-group tru-toggle-wide ${errors.hasCar ? "is-error" : ""}`}>
                              <button 
                                type="button"
                                className={cn("tru-toggle-btn", formData.hasCar === true && "is-active")}
                                onClick={() => setFormData(p => ({ ...p, hasCar: true }))}
                              >
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
                            <Car className={`tru-toggle-side-icon ${formData.hasCar === true ? "active" : ""}`} />
                          </div>
                        </div>
                        {errors.hasCar && <span className="tru-field-error">Please select an option</span>}

                        {/* Packing Toggle */}
                        <div className="tru-input-group">
                          <label className="tru-input-label">Need packing help?</label>
                          <div className="tru-toggle-with-icon">
                            <div className={`tru-toggle-group tru-toggle-wide ${errors.needsPacking ? "is-error" : ""}`}>
                              <button 
                                type="button"
                                className={cn("tru-toggle-btn", formData.needsPacking === true && "is-active")}
                                onClick={() => setFormData(p => ({ ...p, needsPacking: true }))}
                              >
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
                            <Package className={`tru-toggle-side-icon ${formData.needsPacking === true ? "active" : ""}`} />
                          </div>
                        </div>
                        {errors.needsPacking && <span className="tru-field-error">Please select an option</span>}

                        {/* Summary Pills - Show Selected Values */}
                        <div className="tru-selection-pills">
                          {bothZipsValid && (
                            <span className="tru-selection-pill">
                              <MapPin className="tru-selection-pill-icon" />
                              {formData.fromZip} → {formData.toZip}
                            </span>
                          )}
                          {formData.moveDate && (
                            <span className="tru-selection-pill">
                              <CalendarIcon className="tru-selection-pill-icon" />
                              {format(formData.moveDate, "MMM d")}
                              {(() => {
                                const day = formData.moveDate.getDate();
                                const suffix = day === 1 || day === 21 || day === 31 ? 'st'
                                  : day === 2 || day === 22 ? 'nd'
                                  : day === 3 || day === 23 ? 'rd' : 'th';
                                return suffix;
                              })()}
                            </span>
                          )}
                          {formData.size && (
                            <span className="tru-selection-pill">
                              <Home className="tru-selection-pill-icon" />
                              {formData.size}
                            </span>
                          )}
                          {formData.hasCar === true && (
                            <span className="tru-selection-pill">
                              <Car className="tru-selection-pill-icon" />
                              Vehicle
                            </span>
                          )}
                          {formData.needsPacking === true && (
                            <span className="tru-selection-pill">
                              <Package className="tru-selection-pill-icon" />
                              Packing
                            </span>
                          )}
                        </div>

                        <div className="tru-btn-row">
                          <button type="button" className="tru-back-link" onClick={prevStep}>
                            <ChevronLeft className="tru-back-icon" />
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
                        {/* Contact Fields with End Icons */}
                        <div className="tru-input-group">
                          <label className="tru-input-label">Email</label>
                          <div className="tru-input-with-icon">
                            <div className={cn("tru-input-wrapper", errors.email && "is-error")}>
                              <input 
                                type="email" 
                                className="tru-input"
                                placeholder="you@email.com"
                                value={formData.email}
                                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                              />
                            </div>
                            <Mail className={`tru-toggle-side-icon ${emailOk(formData.email) ? "active" : ""}`} />
                          </div>
                        </div>
                        {errors.email && <span className="tru-field-error">Enter a valid email address</span>}

                        <div className="tru-input-group">
                          <label className="tru-input-label">Phone</label>
                          <div className="tru-input-with-icon">
                            <div className={cn("tru-input-wrapper", errors.phone && "is-error")}>
                              <input 
                                type="tel" 
                                className="tru-input"
                                placeholder="(555) 123-4567"
                                value={formData.phone}
                                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                              />
                            </div>
                            <Phone className={`tru-toggle-side-icon ${phoneOk(formData.phone) ? "active" : ""}`} />
                          </div>
                        </div>
                        {errors.phone && <span className="tru-field-error">Enter a valid phone number</span>}

                        {/* Move Summary */}
                        <div className="tru-move-summary">
                          <div className="tru-summary-header">Your Move Summary</div>
                          <div className="tru-summary-content-grid">
                            <div className="tru-summary-main">
                              <div className="tru-summary-row">
                                <MapPin className="tru-summary-icon-dark" />
                                <span>{fromCity || formData.fromZip} → {toCity || formData.toZip}</span>
                              </div>
                              <div className="tru-summary-row">
                                <CalendarIcon className="tru-summary-icon-dark" />
                                <span>{formData.moveDate ? formatDateWithOrdinal(formData.moveDate) : "Date not set"}</span>
                              </div>
                              <div className="tru-summary-badges">
                                <span className="tru-summary-badge">
                                  <Home className="tru-summary-badge-icon" />
                                  {formData.size || "Size TBD"}
                                </span>
                                <span className="tru-summary-badge">
                                  <Car className="tru-summary-badge-icon" />
                                  {formData.hasCar ? "Vehicle" : "No Vehicle"}
                                </span>
                                <span className="tru-summary-badge">
                                  <Package className="tru-summary-badge-icon" />
                                  {formData.needsPacking ? "Packing" : "No Packing"}
                                </span>
                              </div>
                            </div>
                            <div className="tru-summary-decoration">
                              <Truck className="tru-summary-truck-lg" />
                            </div>
                          </div>
                        </div>

                        {/* CTA Section */}
                        <div className="tru-cta-section">
                          <div className="tru-cta-grid">
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
                          
                          {/* Back + Builder Row */}
                          <div className="tru-action-row">
                            <button type="button" className="tru-back-link" onClick={prevStep}>
                              <ChevronLeft className="tru-back-icon" />
                              <span>Back</span>
                            </button>
                            <button type="button" className="tru-btn tru-btn-hero" onClick={() => handleIntent("builder")}>
                              <span>Build My Move Online</span>
                              <ArrowRight className="tru-btn-icon" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {formError && <div className="tru-form-error">{formError}</div>}

                    {/* Disclaimer */}
                    <p className="tru-form-disclaimer">
                      By submitting, you agree we may contact you by phone, text, or email, including via automated technology. Consent is not required to purchase services.
                    </p>
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
