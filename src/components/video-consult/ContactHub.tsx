import { Video, Phone, Mail, MessageSquare, Search, PhoneCall, Headset, Send, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ContactHubProps {
  onStartVideoCall: () => void;
  bookingCode: string;
  setBookingCode: (code: string) => void;
  onJoinRoom: () => void;
}

export function ContactHub({
  onStartVideoCall,
  bookingCode,
  setBookingCode,
  onJoinRoom,
}: ContactHubProps) {
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Simulate booking lookup with loading state
  useEffect(() => {
    if (bookingCode.trim().length >= 4) {
      setIsLookingUp(true);
      const timer = setTimeout(() => {
        setIsLookingUp(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [bookingCode]);

  const handleVoiceCall = () => {
    window.location.href = "tel:+18005551234";
  };

  const handleEmail = () => {
    window.location.href = "mailto:support@trumove.com?subject=Moving Inquiry";
  };

  const handleText = () => {
    window.location.href = "sms:+18005551234";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 relative">
      {/* Header - Larger, more readable text */}
      <div className="text-center mb-10">
        <h3 className="text-3xl font-black text-white mb-4">
          Ready to Connect
        </h3>
        <p className="text-white/80 text-lg max-w-lg mx-auto leading-relaxed">
          Choose how you'd like to reach our moving specialists
        </p>
      </div>

      {/* Primary Action Buttons - Premium dark style matching screenshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full max-w-3xl">
        {/* Video Call - Primary brand green */}
        <button
          onClick={onStartVideoCall}
          className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-950 border-2 border-primary/30 hover:border-primary hover:shadow-[0_0_30px_-5px] hover:shadow-primary/50 hover:scale-[1.03] active:scale-100 transition-all duration-300 ease-out"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center group-hover:bg-primary/25 group-hover:scale-110 transition-all duration-300 ease-out">
            <Video className="w-6 h-6 text-primary" strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors duration-200">Video Call</span>
            <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
          </div>
        </button>

        {/* Voice Call - Warm amber/orange */}
        <button
          onClick={handleVoiceCall}
          className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-950 border-2 border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_30px_-5px] hover:shadow-amber-500/50 hover:scale-[1.03] active:scale-100 transition-all duration-300 ease-out"
        >
          <div className="w-12 h-12 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-500/25 group-hover:scale-110 transition-all duration-300 ease-out">
            <PhoneCall className="w-6 h-6 text-amber-400" strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors duration-200">Voice Call</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
          </div>
        </button>

        {/* Email - Cool blue/indigo */}
        <button
          onClick={handleEmail}
          className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-950 border-2 border-sky-500/30 hover:border-sky-400 hover:shadow-[0_0_30px_-5px] hover:shadow-sky-500/50 hover:scale-[1.03] active:scale-100 transition-all duration-300 ease-out"
        >
          <div className="w-12 h-12 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center group-hover:bg-sky-500/25 group-hover:scale-110 transition-all duration-300 ease-out">
            <Mail className="w-6 h-6 text-sky-400" strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors duration-200">Email Us</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
          </div>
        </button>

        {/* Text/SMS - Teal/cyan */}
        <button
          onClick={handleText}
          className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-950 border-2 border-teal-500/30 hover:border-teal-400 hover:shadow-[0_0_30px_-5px] hover:shadow-teal-500/50 hover:scale-[1.03] active:scale-100 transition-all duration-300 ease-out"
        >
          <div className="w-12 h-12 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center group-hover:bg-teal-500/25 group-hover:scale-110 transition-all duration-300 ease-out">
            <Send className="w-6 h-6 text-teal-400" strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors duration-200">Text Us</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
          </div>
        </button>
      </div>

      {/* Booking ID Search - Compact at bottom */}
      <div className="absolute bottom-5 left-6 right-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 max-w-sm mx-auto">
          {isLookingUp ? (
            <Loader2 className="w-3.5 h-3.5 text-primary shrink-0 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5 text-white/60 shrink-0" />
          )}
          <Input
            value={bookingCode}
            onChange={(e) => setBookingCode(e.target.value)}
            placeholder="Have a Booking ID or Shipping #?"
            className="flex-1 h-7 bg-transparent border-0 text-white text-xs placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onJoinRoom();
              }
            }}
          />
          <Button
            size="sm"
            onClick={onJoinRoom}
            disabled={!bookingCode.trim() || isLookingUp}
            className={cn(
              "h-6 px-2.5 font-semibold text-[11px] transition-all",
              bookingCode.trim() && !isLookingUp
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-foreground text-background hover:bg-foreground/90"
            )}
          >
            {isLookingUp ? <Loader2 className="w-3 h-3 animate-spin" /> : "Join"}
          </Button>
        </div>
      </div>
    </div>
  );
}