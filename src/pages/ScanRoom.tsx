import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import { 
  Scan, Camera, Sparkles, CheckCircle, ArrowRight, 
  Smartphone, Box, Clock, Shield, Video, Zap
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
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-bold text-foreground mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Coming Soon</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6">
            Scan Your Room,<br />
            <span className="tru-qb-title-accent">Build Your Inventory</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Point your phone camera at any room. Our AI instantly identifies furniture, 
            measures dimensions, and builds your moving inventory — no typing required.
          </p>

          {/* Demo Animation Placeholder */}
          <div className="relative max-w-lg mx-auto mb-12">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/5 to-primary/20 border-2 border-dashed border-primary/30 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Scan className="w-10 h-10 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  AI Room Scanning Demo
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Coming Q2 2026
                </p>
              </div>
            </div>
            
            {/* Floating Feature Cards */}
            <div className="absolute -left-4 top-1/4 bg-card rounded-xl shadow-lg border border-border/60 p-3 max-w-[140px] animate-float">
              <div className="flex items-center gap-2 mb-1">
                <Box className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">Sofa 3-Seat</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Auto-detected</p>
            </div>
            
            <div className="absolute -right-4 top-1/2 bg-card rounded-xl shadow-lg border border-border/60 p-3 max-w-[140px] animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2 mb-1">
                <Box className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">Coffee Table</span>
              </div>
              <p className="text-[10px] text-muted-foreground">45 lbs • 8 cu ft</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-card border border-border/60">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold mb-2">1. Open Your Camera</h3>
              <p className="text-sm text-muted-foreground">
                Launch TruMove on your phone and tap "Scan Room" to activate the AI camera.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-card border border-border/60">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold mb-2">2. Pan Around</h3>
              <p className="text-sm text-muted-foreground">
                Slowly pan your camera around the room. AI identifies and tags each piece of furniture.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-card border border-border/60">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold mb-2">3. Review & Submit</h3>
              <p className="text-sm text-muted-foreground">
                Edit quantities, add notes, then get an instant quote based on your actual items.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why You'll Love It</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Zap, title: "Instant Detection", desc: "AI recognizes 500+ furniture types in seconds" },
              { icon: Clock, title: "Save 30+ Minutes", desc: "No manual entry — just point and scan" },
              { icon: Shield, title: "Accurate Estimates", desc: "Real measurements mean realistic quotes" },
              { icon: Video, title: "Video Assist Option", desc: "Live specialist can help via video if needed" },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/40">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Early Access Signup */}
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-8 text-center">
            {!submitted ? (
              <>
                <h2 className="text-xl font-bold mb-2">Get Early Access</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Be the first to try Scan Your Room when it launches.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
              <div className="py-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">You're on the list!</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  We'll email you as soon as Scan Your Room is ready.
                </p>
                <button
                  onClick={() => navigate("/online-estimate")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Try AI Estimator Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CTA to current tools */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            Can't wait? Try our current AI-powered inventory tools.
          </p>
          <button
            onClick={() => navigate("/online-estimate")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-sm font-semibold hover:bg-muted/50 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            Use AI Inventory Builder
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </SiteShell>
  );
}
