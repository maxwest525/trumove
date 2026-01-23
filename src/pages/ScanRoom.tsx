import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import { 
  Scan, Camera, Sparkles, CheckCircle, ArrowRight, 
  Smartphone, Box, Clock, Shield, Zap, ChevronRight,
  Eye, Cpu, Upload, ListChecks, Play, Video, FileText,
  Users, Ruler, Package, Plus, Minus, X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import previewImage from "@/assets/preview-ai-scanner.jpg";

// Simulated detected items for the live demo
const DEMO_ITEMS = [
  { id: 1, name: "3-Seat Sofa", room: "Living Room", weight: 350, cuft: 45, image: "/inventory/living-room/sofa-3-cushion.png" },
  { id: 2, name: "Coffee Table", room: "Living Room", weight: 45, cuft: 8, image: "/inventory/living-room/coffee-table.png" },
  { id: 3, name: "TV Stand", room: "Living Room", weight: 80, cuft: 12, image: "/inventory/living-room/tv-stand.png" },
  { id: 4, name: "Floor Lamp", room: "Living Room", weight: 15, cuft: 3, image: "/inventory/living-room/lamp-floor.png" },
  { id: 5, name: "Bookcase, Large", room: "Living Room", weight: 120, cuft: 28, image: "/inventory/living-room/bookcase-large.png" },
  { id: 6, name: "Armchair", room: "Living Room", weight: 85, cuft: 18, image: "/inventory/living-room/armchair.png" },
];

export default function ScanRoom() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [detectedItems, setDetectedItems] = useState<typeof DEMO_ITEMS>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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
        {/* Video Modal */}
        {showVideo && (
          <div className="tru-scan-video-modal" onClick={() => setShowVideo(false)}>
            <div className="tru-scan-video-container" onClick={(e) => e.stopPropagation()}>
              <button 
                className="tru-scan-video-close"
                onClick={() => setShowVideo(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
                title="AI Room Scanner Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="tru-scan-video-iframe"
              />
            </div>
          </div>
        )}

        {/* Compact Hero + Demo Combined */}
        <section className="tru-scan-hero tru-scan-hero-expanded">
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

          {/* Hero Visual with Integrated Demo */}
          <div className="tru-scan-hero-visual tru-scan-hero-visual-expanded">
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
                
                {isScanning && (
                  <div className="tru-scan-scanning-overlay">
                    <div className="tru-scan-grid" />
                    <div className="tru-scan-line" />
                  </div>
                )}
                
                {/* Detection Labels - only show when scanning or complete */}
                {detectedItems.length >= 1 && (
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
                )}
                
                {detectedItems.length >= 2 && (
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
                )}
                
                {detectedItems.length >= 3 && (
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
                )}

                <button 
                  className="tru-scan-play-btn"
                  onClick={() => setShowVideo(true)}
                >
                  <Play className="w-6 h-6" />
                </button>
                
                <div className="tru-scan-stats-bar">
                  <div className="tru-scan-stat">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{detectedItems.length} items detected</span>
                  </div>
                  <div className="tru-scan-stat-divider" />
                  <div className="tru-scan-stat">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{isScanning ? 'Scanning...' : 'AI Active'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inline Demo Controls + Inventory */}
            <div className="tru-scan-inline-demo">
              <button 
                onClick={startDemo}
                disabled={isScanning}
                className="tru-scan-demo-btn-inline"
              >
                {isScanning ? (
                  <>
                    <div className="tru-scan-spinner" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    {detectedItems.length > 0 ? 'Scan Again' : 'Try Demo Scan'}
                  </>
                )}
              </button>
              
              {detectedItems.length > 0 && (
                <div className="tru-scan-inline-stats">
                  <span><strong>{detectedItems.length}</strong> items</span>
                  <span><strong>{totalWeight.toLocaleString()}</strong> lbs</span>
                  <span><strong>{totalCuFt}</strong> cu ft</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Live Inventory Builder - Now inline below hero */}
        {detectedItems.length > 0 && (
          <section className="tru-scan-inventory-section">
            <div className="container max-w-5xl mx-auto px-4">
              <div className="tru-scan-inventory-header">
                <h3>Detected Inventory</h3>
                <span className="tru-scan-inventory-count">{detectedItems.length} items • {totalWeight.toLocaleString()} lbs</span>
              </div>
              
              <div className="tru-scan-inventory-grid">
                {detectedItems.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="tru-scan-inventory-card"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="tru-scan-inventory-img"
                    />
                    <div className="tru-scan-inventory-info">
                      <span className="tru-scan-inventory-name">{item.name}</span>
                      <span className="tru-scan-inventory-meta">{item.weight} lbs • {item.cuft} cu ft</span>
                    </div>
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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
