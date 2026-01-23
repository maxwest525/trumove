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
        {/* Trust Strip - Top */}
        <section className="tru-scan-trust-strip-slim">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="tru-scan-trust-row-slim">
              <div className="tru-scan-trust-item-slim">
                <Smartphone className="w-3.5 h-3.5" />
                <span>No App Required</span>
              </div>
              <div className="tru-scan-trust-item-slim">
                <Zap className="w-3.5 h-3.5" />
                <span>500+ Item Types</span>
              </div>
              <div className="tru-scan-trust-item-slim">
                <Ruler className="w-3.5 h-3.5" />
                <span>Auto Dimensions</span>
              </div>
              <div className="tru-scan-trust-item-slim">
                <Clock className="w-3.5 h-3.5" />
                <span>Save 30+ Minutes</span>
              </div>
              <div className="tru-scan-trust-item-slim">
                <Shield className="w-3.5 h-3.5" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </section>

        {/* Centered Header Section */}
        <section className="tru-scan-header-section">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="tru-scan-main-headline">
              Build Your <span className="text-primary">Virtual Inventory</span>
            </h1>
            <p className="tru-scan-main-subheadline">
              Add your household items or scan your rooms so we can accurately model what you are moving and plan your route with confidence.
            </p>
            
            <div className="tru-scan-header-buttons">
              <button
                onClick={startDemo}
                disabled={isScanning}
                className="tru-scan-header-btn-outline"
              >
                <Scan className="w-4 h-4" />
                Start Scanning Now
              </button>
              <Link to="/online-estimate" className="tru-scan-header-btn-secondary">
                Switch to Manual Builder
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works - Between Header and Demo */}
        <section className="tru-scan-how-section-inline">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="tru-scan-how-title-inline">From Video to Quote in 3 Steps</h2>
            
            <div className="tru-scan-how-steps-inline">
              <div className="tru-scan-how-step-inline">
                <div className="tru-scan-how-num-inline">1</div>
                <div className="tru-scan-how-text-inline">
                  <strong>Record Walkthrough</strong>
                  <span>Pan each room slowly</span>
                </div>
              </div>
              
              <ChevronRight className="tru-scan-how-arrow-inline" />
              
              <div className="tru-scan-how-step-inline">
                <div className="tru-scan-how-num-inline">2</div>
                <div className="tru-scan-how-text-inline">
                  <strong>AI Identifies Items</strong>
                  <span>Tagged & measured instantly</span>
                </div>
              </div>
              
              <ChevronRight className="tru-scan-how-arrow-inline" />
              
              <div className="tru-scan-how-step-inline">
                <div className="tru-scan-how-num-inline">3</div>
                <div className="tru-scan-how-text-inline">
                  <strong>Get Your Quote</strong>
                  <span>Accurate & instant</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Demo Section */}
        <section className="tru-scan-split-demo">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="tru-scan-split-grid">
              {/* Left: Scanner Video/Preview */}
              <div className="tru-scan-split-left">
                <div className="tru-scan-video-container">
                  <img 
                    src={previewImage} 
                    alt="AI Room Scanner" 
                    className="tru-scan-video-preview"
                  />
                  
                  {isScanning && (
                    <div className="tru-scan-video-overlay">
                      <div className="tru-scan-video-scanline" />
                    </div>
                  )}
                  
                  {/* Detection Pills Overlay - Matching reference design */}
                  {detectedItems.length > 0 && (
                    <div className="tru-scan-video-pills">
                      {detectedItems.slice(-3).map((item, idx) => (
                        <div 
                          key={item.id}
                          className="tru-scan-detection-pill"
                          style={{ 
                            top: `${15 + idx * 22}%`,
                            left: `${10 + idx * 18}%`
                          }}
                        >
                          <div className="tru-scan-pill-icon">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div className="tru-scan-pill-content">
                            <span className="tru-scan-pill-name">{item.name}</span>
                            <span className="tru-scan-pill-meta">~{item.weight} lbs • {item.cuft} cu ft</span>
                          </div>
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Status Bar - Bottom */}
                  <div className="tru-scan-video-status-bar">
                    <div className="tru-scan-status-left">
                      {isScanning ? (
                        <>
                          <div className="tru-scan-status-pulse" />
                          <span>Scanning...</span>
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
                      className="tru-scan-status-btn"
                    >
                      {isScanning ? (
                        <>
                          <div className="tru-scan-spinner-small" />
                          <span>{detectedItems.length}/{DEMO_ITEMS.length}</span>
                        </>
                      ) : (
                        <>
                          <Scan className="w-4 h-4" />
                          <span>Start Scan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Inventory List - Manual Builder Style */}
              <div className="tru-scan-split-right">
                <div className="tru-scan-inv-panel">
                  <div className="tru-scan-inv-panel-header">
                    <h3>
                      <Package className="w-5 h-5" />
                      Detected Inventory
                    </h3>
                    <span className="tru-scan-inv-badge">{detectedItems.length} items</span>
                  </div>
                  
                  <div className="tru-scan-inv-list">
                    {detectedItems.length === 0 ? (
                      <div className="tru-scan-inv-empty">
                        <Scan className="w-8 h-8" />
                        <p>Items will appear here as they're detected</p>
                        <span>Click "Start Scanning Now" above to begin</span>
                      </div>
                    ) : (
                      detectedItems.map((item, idx) => (
                        <div 
                          key={item.id} 
                          className="tru-scan-inv-row"
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <div className="tru-scan-inv-thumb-wrap">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="tru-scan-inv-thumb"
                            />
                          </div>
                          <div className="tru-scan-inv-info">
                            <span className="tru-scan-inv-name">{item.name}</span>
                            <span className="tru-scan-inv-meta">{item.weight} lbs • {item.cuft} cu ft</span>
                          </div>
                          <div className="tru-scan-inv-qty">1</div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {detectedItems.length > 0 && (
                    <div className="tru-scan-inv-footer">
                      <div className="tru-scan-inv-totals">
                        <div className="tru-scan-inv-total">
                          <span>Total Weight</span>
                          <strong>{totalWeight.toLocaleString()} lbs</strong>
                        </div>
                        <div className="tru-scan-inv-total">
                          <span>Total Volume</span>
                          <strong>{totalCuFt} cu ft</strong>
                        </div>
                      </div>
                      <Link to="/online-estimate" className="tru-scan-inv-continue">
                        Continue to Quote
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
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
