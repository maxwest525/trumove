import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import { 
  Scan, Camera, Sparkles, CheckCircle, ArrowRight, 
  Smartphone, Box, Clock, Shield, Zap, ChevronRight,
  Eye, Cpu, Upload, ListChecks
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Hero Section - Compact */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-xs font-bold text-foreground mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Coming Q2 2026</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-4">
            Scan Your Room,<br />
            <span className="tru-qb-title-accent">Build Your Inventory</span>
          </h1>
          
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Point your phone camera at any room. AI instantly identifies furniture, 
            measures dimensions, and builds your moving inventory.
          </p>
        </div>

        {/* Interactive Demo Preview */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 overflow-hidden relative">
            {/* Scan Grid Overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
            </div>
            
            {/* Scanning Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-primary/40 flex items-center justify-center animate-pulse">
                  <Scan className="w-12 h-12 text-primary" />
                </div>
                {/* Scanning rings */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
              </div>
            </div>
            
            {/* Detection Labels - Floating cards */}
            <div className="absolute top-6 left-6 bg-card/95 backdrop-blur-sm rounded-lg border border-primary/40 p-2.5 shadow-xl animate-float">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
                  <Box className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Sofa, 3-Seat</span>
                  <span className="text-[10px] text-muted-foreground">~350 lbs • 45 cu ft</span>
                </div>
                <CheckCircle className="w-4 h-4 text-primary ml-2" />
              </div>
            </div>
            
            <div className="absolute bottom-6 right-6 bg-card/95 backdrop-blur-sm rounded-lg border border-primary/40 p-2.5 shadow-xl animate-float" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
                  <Box className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Coffee Table</span>
                  <span className="text-[10px] text-muted-foreground">~45 lbs • 8 cu ft</span>
                </div>
                <CheckCircle className="w-4 h-4 text-primary ml-2" />
              </div>
            </div>
            
            <div className="absolute top-1/2 right-8 -translate-y-1/2 bg-card/95 backdrop-blur-sm rounded-lg border border-emerald-500/40 p-2.5 shadow-xl animate-float" style={{ animationDelay: '1.2s' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-emerald-500/20 flex items-center justify-center">
                  <Box className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <span className="text-xs font-bold block">TV Stand</span>
                  <span className="text-[10px] text-muted-foreground">~80 lbs • 12 cu ft</span>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500 ml-2" />
              </div>
            </div>
            
            {/* Stats overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md rounded-full px-4 py-2">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-white">12 items</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-white">AI Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works - Workflow Style */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-center mb-6">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
            {/* Step 1 */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/60">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xs font-bold block">1. Open Camera</span>
                <span className="text-[10px] text-muted-foreground">Launch TruMove app</span>
              </div>
            </div>
            
            <ChevronRight className="w-5 h-5 text-muted-foreground/40 hidden md:block" />
            
            {/* Step 2 */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/60">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xs font-bold block">2. Pan Room</span>
                <span className="text-[10px] text-muted-foreground">AI detects & tags items</span>
              </div>
            </div>
            
            <ChevronRight className="w-5 h-5 text-muted-foreground/40 hidden md:block" />
            
            {/* Step 3 */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/60">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ListChecks className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xs font-bold block">3. Review List</span>
                <span className="text-[10px] text-muted-foreground">Edit & get instant quote</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features - Compact Grid */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-center mb-4">Why You'll Love It</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Zap, title: "Instant Detection", desc: "500+ furniture types" },
              { icon: Clock, title: "Save 30+ Min", desc: "No manual entry" },
              { icon: Shield, title: "Accurate", desc: "Real measurements" },
              { icon: Upload, title: "Seamless", desc: "Syncs to your quote" },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/30 border border-border/40">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-xs font-bold">{feature.title}</h4>
                <p className="text-[10px] text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Early Access Signup - Compact */}
        <div className="max-w-sm mx-auto mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-6 text-center">
            {!submitted ? (
              <>
                <h2 className="text-lg font-bold mb-1">Get Early Access</h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Be the first to try Scan Your Room.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full tru-qb-continue disabled:opacity-50"
                  >
                    {isSubmitting ? "Joining..." : "Join Waitlist"}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-2">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-base font-bold mb-1">You're on the list!</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  We'll email you when it's ready.
                </p>
                <Link
                  to="/online-estimate"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Try AI Estimator Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* CTA to current tools */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-3">
            Can't wait? Try our AI-powered inventory tools now.
          </p>
          <button
            onClick={() => navigate("/online-estimate")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/60 bg-card text-sm font-semibold hover:bg-muted/50 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            Build Inventory Manually
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </SiteShell>
  );
}