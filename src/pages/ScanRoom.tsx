import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import { 
  Scan, Camera, Sparkles, CheckCircle, ArrowRight, 
  Smartphone, Box, Clock, Shield, Zap, ChevronRight,
  Eye, Cpu, Upload, ListChecks, Play, Video, FileText,
  Users, Ruler, Package, Plus, Minus
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import previewImage from "@/assets/preview-ai-scanner.jpg";

// Simulated detected items for the live demo
const DEMO_ITEMS = [
  // Living Room
  { id: 1, name: "3-Seat Sofa", room: "Living Room", weight: 350, cuft: 45, image: "/inventory/living-room/sofa-3-cushion.png" },
  { id: 2, name: "Coffee Table", room: "Living Room", weight: 45, cuft: 8, image: "/inventory/living-room/coffee-table.png" },
  { id: 3, name: "TV Stand", room: "Living Room", weight: 80, cuft: 12, image: "/inventory/living-room/tv-stand.png" },
  { id: 4, name: "Armchair", room: "Living Room", weight: 85, cuft: 18, image: "/inventory/living-room/armchair.png" },
  // Bedroom
  { id: 5, name: "Queen Bed", room: "Bedroom", weight: 180, cuft: 55, image: "/inventory/bedroom/bed-queen.png" },
  { id: 6, name: "Dresser", room: "Bedroom", weight: 150, cuft: 32, image: "/inventory/bedroom/dresser.png" },
  { id: 7, name: "Nightstand", room: "Bedroom", weight: 35, cuft: 6, image: "/inventory/bedroom/nightstand.png" },
  { id: 8, name: "Chest of Drawers", room: "Bedroom", weight: 120, cuft: 24, image: "/inventory/bedroom/chest-of-drawers.png" },
  // Kitchen
  { id: 9, name: "Kitchen Table", room: "Kitchen", weight: 85, cuft: 18, image: "/inventory/kitchen/kitchen-table.png" },
  { id: 10, name: "Kitchen Chair", room: "Kitchen", weight: 20, cuft: 4, image: "/inventory/kitchen/kitchen-chair.png" },
  { id: 11, name: "Microwave", room: "Kitchen", weight: 35, cuft: 3, image: "/inventory/appliances/microwave.png" },
  { id: 12, name: "Bar Stool", room: "Kitchen", weight: 25, cuft: 5, image: "/inventory/kitchen/bar-stool.png" },
];

export default function ScanRoom() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [detectedItems, setDetectedItems] = useState<typeof DEMO_ITEMS>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Simulate live detection
  useEffect(() => {
    if (isScanning && detectedItems.length < DEMO_ITEMS.length) {
      const timer = setTimeout(() => {
        setDetectedItems(prev => [...prev, DEMO_ITEMS[prev.length]]);
      }, 1200);
      return () => clearTimeout(timer);
    } else if (detectedItems.length >= DEMO_ITEMS.length) {
      setIsScanning(false);
    }
  }, [isScanning, detectedItems]);

  const startDemo = () => {
    setDetectedItems([]);
    setIsScanning(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const earlyAccess = JSON.parse(localStorage.getItem("tm_early_access") || "[]");
    earlyAccess.push({ email, phone, feature: "scan-room", ts: Date.now() });
    localStorage.setItem("tm_early_access", JSON.stringify(earlyAccess));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    toast({
      title: "You're on the list!",
      description: "We'll notify you when Scan Your Room launches.",
    });
  };

  const totalWeight = detectedItems.reduce((sum, item) => sum + item.weight, 0);
  const totalCuFt = detectedItems.reduce((sum, item) => sum + item.cuft, 0);

  return (
    <SiteShell>
      <div className="tru-scan-page">
        {/* Hero Section */}
        <section className="tru-scan-hero">
          <div className="tru-scan-hero-content">
            <div className="tru-scan-badge">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coming Q2 2026</span>
            </div>
            
            <h1 className="tru-scan-headline">
              Scan Your Room,
              <span className="tru-scan-headline-accent">Build Your Inventory</span>
            </h1>
            
            <p className="tru-scan-subheadline">
              Point your phone camera at any room. AI instantly identifies furniture, 
              measures dimensions, and builds your moving inventory — automatically.
            </p>

            <div className="tru-scan-hero-cta">
              <button
                onClick={() => document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' })}
                className="tru-scan-primary-btn"
              >
                <Sparkles className="w-4 h-4" />
                Get Early Access
              </button>
              <Link to="/online-estimate" className="tru-scan-secondary-btn">
                Try Manual Builder
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Hero Visual - Premium Preview Card Style */}
          <div className="tru-scan-hero-visual">
            <div className="tru-scan-preview-card">
              <div className="tru-scan-preview-glow" />
              <div className="tru-scan-preview-glow-secondary" />
              
              <div className="tru-scan-preview-image-wrap">
                <img 
                  src={previewImage} 
                  alt="AI Room Scanner Preview" 
                  className="tru-scan-preview-image"
                />
                
                <div className="tru-scan-preview-overlay" />
                
                <div className="tru-scan-scanning-overlay">
                  <div className="tru-scan-grid" />
                  <div className="tru-scan-line" />
                </div>
                
                {/* Detection Labels */}
                <div className="tru-scan-detection-label tru-scan-label-1">
                  <div className="tru-scan-label-icon">
                    <Box className="w-4 h-4" />
                  </div>
                  <div className="tru-scan-label-content">
                    <span className="tru-scan-label-title">Sofa, 3-Seat</span>
                    <span className="tru-scan-label-meta">~350 lbs • 45 cu ft</span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                
                <div className="tru-scan-detection-label tru-scan-label-2">
                  <div className="tru-scan-label-icon">
                    <Box className="w-4 h-4" />
                  </div>
                  <div className="tru-scan-label-content">
                    <span className="tru-scan-label-title">Coffee Table</span>
                    <span className="tru-scan-label-meta">~45 lbs • 8 cu ft</span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                
                <div className="tru-scan-detection-label tru-scan-label-3">
                  <div className="tru-scan-label-icon">
                    <Box className="w-4 h-4" />
                  </div>
                  <div className="tru-scan-label-content">
                    <span className="tru-scan-label-title">TV Stand</span>
                    <span className="tru-scan-label-meta">~80 lbs • 12 cu ft</span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>

                
                <div className="tru-scan-stats-bar">
                  <div className="tru-scan-stat">
                    <Eye className="w-3.5 h-3.5" />
                    <span>12 items detected</span>
                  </div>
                  <div className="tru-scan-stat-divider" />
                  <div className="tru-scan-stat">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>AI Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Inventory Demo Section */}
        <section className="tru-scan-demo-section">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="tru-scan-demo-header-centered">
              <h2 className="tru-scan-demo-headline">Watch AI Build Your Inventory</h2>
              <p className="tru-scan-demo-subline">Click scan to see real-time furniture detection across multiple rooms</p>
            </div>
            
            <div className="tru-scan-demo-unified">
              {/* Scanner Preview */}
              <div className="tru-scan-demo-scanner-mini">
                <img 
                  src={previewImage} 
                  alt="Room scan" 
                  className="tru-scan-demo-image"
                />
                {isScanning && (
                  <div className="tru-scan-demo-scanning">
                    <div className="tru-scan-demo-line" />
                  </div>
                )}
                
                <div className="tru-scan-demo-status">
                  {isScanning ? (
                    <>
                      <div className="tru-scan-demo-pulse" />
                      <span>Scanning... {detectedItems.length}/{DEMO_ITEMS.length} items</span>
                    </>
                  ) : detectedItems.length > 0 ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Scan complete</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>Ready to scan</span>
                    </>
                  )}
                </div>
                
                <button 
                  onClick={startDemo}
                  disabled={isScanning}
                  className="tru-scan-demo-btn-overlay"
                >
                  {isScanning ? (
                    <>
                      <div className="tru-scan-spinner" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4" />
                      {detectedItems.length > 0 ? 'Scan Again' : 'Start Scan'}
                    </>
                  )}
                </button>
              </div>

              {/* Live Inventory Grid */}
              <div className="tru-scan-demo-inv-grid">
                <div className="tru-scan-demo-inv-header">
                  <h3>Detected Items</h3>
                  <span className="tru-scan-demo-inv-count">{detectedItems.length} of {DEMO_ITEMS.length}</span>
                </div>
                
                <div className="tru-scan-demo-inv-items">
                  {detectedItems.length === 0 ? (
                    <div className="tru-scan-demo-inv-empty">
                      <Package className="w-6 h-6" />
                      <p>Click "Start Scan" to begin</p>
                    </div>
                  ) : (
                    detectedItems.map((item, idx) => (
                      <div 
                        key={item.id} 
                        className="tru-scan-demo-inv-card"
                        style={{ animationDelay: `${idx * 0.08}s` }}
                      >
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="tru-scan-demo-inv-img"
                        />
                        <div className="tru-scan-demo-inv-details">
                          <span className="tru-scan-demo-inv-name">{item.name}</span>
                          <span className="tru-scan-demo-inv-room">{item.room}</span>
                        </div>
                        <CheckCircle className="w-3.5 h-3.5 text-primary" />
                      </div>
                    ))
                  )}
                </div>
                
                {detectedItems.length > 0 && (
                  <div className="tru-scan-demo-inv-summary">
                    <div className="tru-scan-demo-inv-stat">
                      <span>Weight</span>
                      <strong>{totalWeight.toLocaleString()} lbs</strong>
                    </div>
                    <div className="tru-scan-demo-inv-stat">
                      <span>Volume</span>
                      <strong>{totalCuFt} cu ft</strong>
                    </div>
                    <Link to="/online-estimate" className="tru-scan-demo-continue-btn">
                      Continue to Quote
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Condensed Features Strip */}
        <section className="tru-scan-features-strip">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="tru-scan-features-row">
              <div className="tru-scan-feature-chip">
                <div className="tru-scan-chip-icon">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="tru-scan-chip-text">
                  <strong>No App Required</strong>
                  <span>Works in any browser</span>
                </div>
              </div>
              
              <div className="tru-scan-feature-chip">
                <div className="tru-scan-chip-icon">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="tru-scan-chip-text">
                  <strong>500+ Item Types</strong>
                  <span>Instant recognition</span>
                </div>
              </div>
              
              <div className="tru-scan-feature-chip">
                <div className="tru-scan-chip-icon">
                  <Ruler className="w-5 h-5" />
                </div>
                <div className="tru-scan-chip-text">
                  <strong>Auto Dimensions</strong>
                  <span>Real measurements</span>
                </div>
              </div>
              
              <div className="tru-scan-feature-chip">
                <div className="tru-scan-chip-icon">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="tru-scan-chip-text">
                  <strong>Save 30+ Minutes</strong>
                  <span>vs. manual entry</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Compact Horizontal */}
        <section className="tru-scan-how-section">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="tru-scan-how-title">From Video to Quote in 3 Steps</h2>
            
            <div className="tru-scan-how-steps">
              <div className="tru-scan-how-step">
                <div className="tru-scan-how-num">1</div>
                <Video className="w-6 h-6" />
                <div className="tru-scan-how-text">
                  <strong>Record Walkthrough</strong>
                  <span>Pan each room slowly</span>
                </div>
              </div>
              
              <ChevronRight className="tru-scan-how-arrow" />
              
              <div className="tru-scan-how-step">
                <div className="tru-scan-how-num">2</div>
                <Cpu className="w-6 h-6" />
                <div className="tru-scan-how-text">
                  <strong>AI Identifies Items</strong>
                  <span>Tagged & measured instantly</span>
                </div>
              </div>
              
              <ChevronRight className="tru-scan-how-arrow" />
              
              <div className="tru-scan-how-step">
                <div className="tru-scan-how-num">3</div>
                <FileText className="w-6 h-6" />
                <div className="tru-scan-how-text">
                  <strong>Get Your Quote</strong>
                  <span>Accurate & instant</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Early Access CTA */}
        <section id="early-access" className="tru-scan-section tru-scan-cta-section">
          <div className="tru-scan-cta-card">
            <div className="tru-scan-cta-glow" />
            
            {!submitted ? (
              <>
                <div className="tru-scan-cta-icon">
                  <Scan className="w-8 h-8" />
                </div>
                <h2 className="tru-scan-cta-title">Get Early Access</h2>
                <p className="tru-scan-cta-desc">
                  Be the first to try Scan Your Room when it launches.
                </p>
                
                <form onSubmit={handleSubmit} className="tru-scan-cta-form">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="tru-scan-input"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="tru-scan-input"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="tru-scan-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="tru-scan-spinner" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Join the Waitlist
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="tru-scan-success">
                <div className="tru-scan-success-icon">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="tru-scan-success-title">You're on the list!</h3>
                <p className="tru-scan-success-desc">
                  We'll email you when Scan Your Room is ready.
                </p>
                <Link to="/online-estimate" className="tru-scan-success-link">
                  Try AI Estimator Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="tru-scan-bottom-cta">
          <p className="tru-scan-bottom-text">
            Can't wait? Try our AI-powered inventory tools now.
          </p>
          <button
            onClick={() => navigate("/online-estimate")}
            className="tru-scan-alt-btn"
          >
            <Sparkles className="w-4 h-4" />
            Build Inventory Manually
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </div>
    </SiteShell>
  );
}
