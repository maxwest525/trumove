import { useState, useEffect } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { DailyVideoRoom } from "@/components/video-consult/DailyVideoRoom";
import { Video, Phone, Boxes, Camera, Calendar, ArrowRight, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Preview images
import previewAiScanner from "@/assets/preview-ai-scanner.jpg";
import sampleRoomLiving from "@/assets/sample-room-living.jpg";

// Scroll to top on mount
const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};

export default function Book() {
  useScrollToTop();
  const navigate = useNavigate();
  
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [bookingCode, setBookingCode] = useState("");
  const [isDemo, setIsDemo] = useState(false);

  // Handle join room with booking code
  const handleJoinRoom = () => {
    if (!bookingCode.trim()) {
      toast.error("Please enter a booking code");
      return;
    }
    
    // In production, validate booking code against backend
    // For demo, simulate joining
    if (bookingCode.toLowerCase() === "demo" || bookingCode === "12345") {
      setRoomUrl("https://trumove.daily.co/demo-room");
      setIsDemo(true);
      toast.success("Joining demo room...");
    } else {
      // In production, lookup the room URL from the booking code
      setRoomUrl(`https://trumove.daily.co/${bookingCode}`);
      toast.success("Connecting to your session...");
    }
  };

  // Handle demo mode
  const handleStartDemo = () => {
    setRoomUrl("https://trumove.daily.co/demo-room");
    setIsDemo(true);
    setBookingCode("demo");
    toast.success("🎬 Demo mode activated");
  };

  // Handle leaving room
  const handleLeaveRoom = () => {
    setRoomUrl(null);
    setIsDemo(false);
    setBookingCode("");
  };

  return (
    <SiteShell>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase mb-4">
              <Video className="w-3.5 h-3.5" />
              Live Session
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
              TruMove Video Consult
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Connect with a specialist for personalized move guidance, quote review, or inventory walkthrough.
            </p>
          </div>

          {/* Main Video Window */}
          <Card className="mb-8 overflow-hidden border-2 border-border/60 bg-gradient-to-b from-muted/30 to-background">
            <CardContent className="p-0">
              <div className="relative aspect-video min-h-[400px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                {roomUrl ? (
                  <DailyVideoRoom 
                    roomUrl={roomUrl}
                    userName="Guest"
                    onLeave={handleLeaveRoom}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="text-center p-8">
                    {/* Placeholder video state */}
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                      <Users className="w-12 h-12 text-white/30" />
                    </div>
                    <h3 className="text-xl font-bold text-white/90 mb-2">
                      Ready to Connect
                    </h3>
                    <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">
                      Enter your booking code below to join your scheduled session, or start a demo.
                    </p>
                    
                    {/* Join Form */}
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
                      <Input
                        value={bookingCode}
                        onChange={(e) => setBookingCode(e.target.value)}
                        placeholder="Enter booking code..."
                        className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                        onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                      />
                      <Button 
                        onClick={handleJoinRoom}
                        className="h-12 px-6 font-bold"
                        disabled={!bookingCode.trim()}
                      >
                        Join Room
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    
                    <button
                      onClick={handleStartDemo}
                      className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Try Demo Mode
                    </button>
                  </div>
                )}
                
                {/* Demo badge */}
                {isDemo && roomUrl && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-amber-500/90 text-white text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    DEMO MODE
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Quick Call */}
            <a
              href="tel:+16097277647"
              className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">Quick Call</div>
                <div className="text-xs text-muted-foreground">(609) 727-7647</div>
              </div>
            </a>

            {/* Build Inventory Manually */}
            <button
              onClick={() => navigate("/online-estimate")}
              className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-border/60">
                <img 
                  src={sampleRoomLiving} 
                  alt="Manual inventory" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">Build Inventory</div>
                <div className="text-xs text-muted-foreground">Manual entry</div>
              </div>
            </button>

            {/* AI Inventory Scanner */}
            <button
              onClick={() => navigate("/scan-room")}
              className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-border/60">
                <img 
                  src={previewAiScanner} 
                  alt="AI scanner" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">AI Scanner</div>
                <div className="text-xs text-muted-foreground">Snap & detect</div>
              </div>
            </button>

            {/* Schedule New Consult */}
            <a
              href="https://calendly.com/trumove"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">Schedule</div>
                <div className="text-xs text-muted-foreground">Book a time</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
