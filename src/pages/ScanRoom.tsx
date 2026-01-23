import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import { 
  Scan, Camera, Sparkles, CheckCircle, ArrowRight, 
  Smartphone, Box, Clock, Shield, Zap, ChevronRight,
  Eye, Cpu, Upload, ListChecks, Play
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import previewImage from "@/assets/preview-ai-scanner.jpg";

export default function ScanRoom() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store in localStorage for now
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

  const steps = [
    { icon: Smartphone, title: "Open Camera", desc: "Launch TruMove app" },
    { icon: Camera, title: "Pan Room", desc: "AI detects & tags items" },
    { icon: ListChecks, title: "Review List", desc: "Edit & get instant quote" },
  ];

  const features = [
    { icon: Zap, title: "Instant Detection", desc: "500+ furniture types", color: "primary" },
    { icon: Clock, title: "Save 30+ Min", desc: "No manual entry", color: "primary" },
    { icon: Shield, title: "Accurate", desc: "Real measurements", color: "primary" },
    { icon: Upload, title: "Seamless", desc: "Syncs to your quote", color: "primary" },
  ];

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
              {/* Glow effects */}
              <div className="tru-scan-preview-glow" />
              <div className="tru-scan-preview-glow-secondary" />
              
              {/* Main preview image */}
              <div className="tru-scan-preview-image-wrap">
                <img 
                  src={previewImage} 
                  alt="AI Room Scanner Preview" 
                  className="tru-scan-preview-image"
                />
                
                {/* Overlay gradient */}
                <div className="tru-scan-preview-overlay" />
                
                {/* Scanning animation overlay */}
                <div className="tru-scan-scanning-overlay">
                  <div className="tru-scan-grid" />
                  <div className="tru-scan-line" />
                </div>
                
                {/* Detection Labels - Floating */}
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

                {/* Play button overlay */}
                <button className="tru-scan-play-btn">
                  <Play className="w-6 h-6" />
                </button>
                
                {/* Stats bar */}
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

        {/* How It Works Section */}
        <section className="tru-scan-section">
          <div className="tru-scan-section-header">
            <span className="tru-scan-section-eyebrow">Simple Process</span>
            <h2 className="tru-scan-section-title">How It Works</h2>
          </div>
          
          <div className="tru-scan-steps">
            {steps.map((step, i) => (
              <div key={i} className="tru-scan-step-wrapper">
                <div className="tru-scan-step">
                  <div className="tru-scan-step-number">{i + 1}</div>
                  <div className="tru-scan-step-icon">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="tru-scan-step-title">{step.title}</h3>
                  <p className="tru-scan-step-desc">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="tru-scan-step-connector">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="tru-scan-section tru-scan-features-section">
          <div className="tru-scan-section-header">
            <span className="tru-scan-section-eyebrow">Powerful Features</span>
            <h2 className="tru-scan-section-title">Why You'll Love It</h2>
          </div>
          
          <div className="tru-scan-features">
            {features.map((feature, i) => (
              <div key={i} className="tru-scan-feature">
                <div className="tru-scan-feature-icon">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="tru-scan-feature-title">{feature.title}</h3>
                <p className="tru-scan-feature-desc">{feature.desc}</p>
              </div>
            ))}
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
