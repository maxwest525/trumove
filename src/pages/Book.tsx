import { useState, useEffect } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { DailyVideoRoom } from "@/components/video-consult/DailyVideoRoom";
import { Video, Phone, Boxes, Camera, Calendar, ArrowRight, Play, Users, Monitor, Mic, MicOff, VideoOff, MessageSquare } from "lucide-react";
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

// Fake Screen Share Preview - Visual placeholder
function FakeScreenSharePreview() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center">
      {/* Fake loading screen share UI */}
      <div className="relative w-full max-w-[480px] mx-auto">
        {/* Fake window chrome */}
        <div className="bg-slate-700 rounded-t-lg px-3 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-slate-600 rounded px-3 py-0.5 text-[10px] text-white/50 font-mono">
              Inventory Builder — trumove.lovable.app
            </div>
          </div>
        </div>
        {/* Fake content area */}
        <div className="bg-slate-800 rounded-b-lg p-4 border border-slate-600/50 min-h-[200px]">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-slate-600/50 rounded w-3/4" />
            <div className="h-4 bg-slate-600/50 rounded w-1/2" />
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="h-12 bg-slate-600/40 rounded" />
              <div className="h-12 bg-slate-600/40 rounded" />
              <div className="h-12 bg-slate-600/40 rounded" />
            </div>
            <div className="h-8 bg-primary/20 rounded w-full mt-4" />
          </div>
        </div>
      </div>
      {/* Status text */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
          <Monitor className="w-4 h-4 text-primary animate-pulse" />
          <span>Preparing screen share...</span>
        </div>
        <p className="text-white/40 text-xs mt-1">Click "Share Screen" to start collaborating</p>
      </div>
    </div>
  );
}

// Demo Video Placeholder Component - shows fake video call experience
function DemoVideoPlaceholder({ onLeave }: { onLeave: () => void }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ from: string; text: string }[]>([
    { from: "Support", text: "Hi! I'm here to help you with your move." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleShareScreen = () => {
    setIsScreenSharing(!isScreenSharing);
    if (!isScreenSharing) {
      toast.success("Screen sharing started - Both parties can now view and collaborate on documents");
    } else {
      toast("Screen sharing stopped");
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { from: "You", text: newMessage }]);
      setNewMessage("");
      // Simulate support response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { from: "Support", text: "I can see your screen now. Let me help you with the inventory." }]);
      }, 1500);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Main video area */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Simulated remote video or screen share */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isScreenSharing ? (
            <FakeScreenSharePreview />
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <p className="text-white/80 font-medium">TruMove Support</p>
              <p className="text-white/50 text-sm">Connected</p>
            </div>
          )}
        </div>

        {/* Self view (picture-in-picture) */}
        <div className="absolute bottom-4 right-4 w-32 h-24 rounded-lg overflow-hidden border-2 border-white/20 bg-slate-700">
          {isVideoOff ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-800">
              <VideoOff className="w-6 h-6 text-white/40" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-600">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white/80 text-sm font-bold">You</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat panel (collapsed) */}
        <div className="absolute top-4 right-4 w-64 bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
          <div className="p-2 border-b border-white/10 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-white/60" />
            <span className="text-xs font-medium text-white/80">Chat</span>
          </div>
          <div className="h-24 overflow-y-auto p-2 space-y-1">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`text-xs ${msg.from === "You" ? "text-primary" : "text-white/70"}`}>
                <span className="font-bold">{msg.from}:</span> {msg.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-white/10 flex gap-1">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 text-xs bg-white/10 border-0 rounded px-2 py-1 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Connection status */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-amber-500/90 text-white text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            DEMO MODE
          </div>
          <div className="px-3 py-1.5 rounded-full bg-green-500/90 text-white text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white" />
            Connected
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="h-16 bg-slate-900 border-t border-white/10 flex items-center justify-center gap-3 px-4">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
            isMuted ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
            isVideoOff ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>

        {/* Share Screen Button - Prominent */}
        <button
          onClick={handleShareScreen}
          className={`h-11 px-5 rounded-full flex items-center justify-center gap-2 font-bold text-sm transition-all ${
            isScreenSharing 
              ? "bg-primary text-primary-foreground ring-2 ring-primary/50" 
              : "bg-white/10 text-white hover:bg-primary/80 hover:text-white"
          }`}
        >
          <Monitor className="w-5 h-5" />
          {isScreenSharing ? "Stop Sharing" : "Share Screen"}
        </button>

        <button
          onClick={onLeave}
          className="w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <Phone className="w-5 h-5 rotate-[135deg]" />
        </button>
      </div>
    </div>
  );
}

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
      setRoomUrl("demo-mode");
      setIsDemo(true);
      toast.success("🎬 Joining demo room...");
    } else {
      // In production, lookup the room URL from the booking code
      setRoomUrl(`https://trumove.daily.co/${bookingCode}`);
      toast.success("Connecting to your session...");
    }
  };

  // Handle demo mode
  const handleStartDemo = () => {
    setRoomUrl("demo-mode");
    setIsDemo(true);
    setBookingCode("demo");
    toast.success("🎬 Demo mode activated - Try the controls!");
  };

  // Handle leaving room
  const handleLeaveRoom = () => {
    setRoomUrl(null);
    setIsDemo(false);
    setBookingCode("");
    toast("Session ended");
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
                  isDemo ? (
                    <DemoVideoPlaceholder onLeave={handleLeaveRoom} />
                  ) : (
                    <DailyVideoRoom 
                      roomUrl={roomUrl}
                      userName="Guest"
                      onLeave={handleLeaveRoom}
                      className="w-full h-full"
                    />
                  )
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
                    
                    {/* Screen sharing info */}
                    <div className="mt-6 pt-6 border-t border-white/10 max-w-md mx-auto">
                      <div className="flex items-center gap-3 text-white/60">
                        <Monitor className="w-5 h-5 text-primary" />
                        <p className="text-xs text-left">
                          <span className="font-semibold text-white/80">Screen Sharing Available</span><br />
                          Both you and support can share screens to collaborate on inventory, documents, and profiles.
                        </p>
                      </div>
                    </div>
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
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-border/60">
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
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-border/60">
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
