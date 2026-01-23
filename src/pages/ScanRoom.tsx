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
            <div className="tru-scan-trust-row-slim tru-scan-trust-spread">
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
                className="tru-scan-header-btn-primary"
              >
                <span className="tru-scan-btn-arrows">&lt;&gt;</span>
                Analyze Route
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link to="/online-estimate" className="tru-scan-header-btn-secondary">
                Switch to Manual Builder
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works - Full Width Dark Divider Bar */}
        <section className="tru-scan-steps-bar">
          <div className="tru-scan-steps-bar-inner">
            <h2 className="tru-scan-steps-bar-title">From Video to Quote in 3 Steps</h2>
            <div className="tru-scan-steps-bar-line" />
            <div className="tru-scan-steps-bar-items">
              <div className="tru-scan-step-bar-item">
                <span className="tru-scan-step-bar-num">1</span>
                <span className="tru-scan-step-bar-label">Record Walkthrough</span>
              </div>
              <ChevronRight className="tru-scan-step-bar-arrow" />
              <div className="tru-scan-step-bar-item">
                <span className="tru-scan-step-bar-num">2</span>
                <span className="tru-scan-step-bar-label">AI Identifies Items</span>
              </div>
              <ChevronRight className="tru-scan-step-bar-arrow" />
              <div className="tru-scan-step-bar-item">
                <span className="tru-scan-step-bar-num">3</span>
                <span className="tru-scan-step-bar-label">Get Your Quote</span>
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
                  
                  {/* Always show scanning overlay with grid pattern */}
                  <div className="tru-scan-video-overlay">
                    <div className="tru-scan-grid-pattern" />
                    {isScanning && <div className="tru-scan-video-scanline" />}
                  </div>
                  
                  {/* Status Pills Bar - Bottom */}
                  <div className="tru-scan-status-pills">
                    <div className="tru-scan-status-pill">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{detectedItems.length} items detected</span>
                    </div>
                    <div className="tru-scan-status-divider" />
                    <div className="tru-scan-status-pill tru-scan-status-pill-active">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>{isScanning ? "Scanning..." : "AI Active"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Inventory List - Manual Builder Style */}
              <div className="tru-scan-split-right">
                <div className="tru-scan-inv-panel-v2">
                  <div className="tru-scan-inv-header-v2">
                    <h3>Detected Inventory</h3>
                    <span className="tru-scan-inv-count">{detectedItems.length}</span>
                  </div>
                  
                  <div className="tru-scan-inv-grid">
                    {detectedItems.length === 0 ? (
                      <div className="tru-scan-inv-empty-v2">
                        <Scan className="w-10 h-10" />
                        <p>Items will appear here as they're detected</p>
                        <span>Click "Analyze Route" above to begin</span>
                      </div>
                    ) : (
                      detectedItems.map((item, idx) => (
                        <div 
                          key={item.id} 
                          className="tru-scan-inv-card"
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <div className="tru-scan-inv-card-img">
                            <img 
                              src={item.image} 
                              alt={item.name}
                            />
                            <span className="tru-scan-inv-card-qty">1</span>
                          </div>
                          <div className="tru-scan-inv-card-info">
                            <span className="tru-scan-inv-card-name">{item.name}</span>
                            <span className="tru-scan-inv-card-meta">{item.cuft} cu ft</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {detectedItems.length > 0 && (
                    <div className="tru-scan-inv-footer-v2">
                      <div className="tru-scan-inv-stats">
                        <div className="tru-scan-inv-stat">
                          <span>{detectedItems.length}</span>
                          <label>Items</label>
                        </div>
                        <div className="tru-scan-inv-stat">
                          <span>{totalCuFt}</span>
                          <label>Cu Ft</label>
                        </div>
                        <div className="tru-scan-inv-stat">
                          <span>{totalWeight.toLocaleString()}</span>
                          <label>Lbs</label>
                        </div>
                      </div>
                      <Link to="/online-estimate" className="tru-scan-inv-continue-v2">
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
