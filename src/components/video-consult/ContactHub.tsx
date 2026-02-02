import { Video, Phone, Mail, MessageSquare, Search, PhoneCall, Headset, Send, Loader2 } from "lucide-react";
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

      {/* Primary Action Buttons - Dark premium style with subtle accents */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full max-w-3xl">
        {/* Video Call */}
        <button
          onClick={onStartVideoCall}
          className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-900 border-2 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800 hover:scale-[1.02] active:scale-100 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-all duration-200">
            <Video className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold text-slate-300 group-hover:text-white text-center transition-colors">Video Call</span>
        </button>

        {/* Voice Call */}
        <button
          onClick={handleVoiceCall}
          className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-900 border-2 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800 hover:scale-[1.02] active:scale-100 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-all duration-200">
            <PhoneCall className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold text-slate-300 group-hover:text-white text-center transition-colors">Voice Call</span>
        </button>

        {/* Email */}
        <button
          onClick={handleEmail}
          className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-900 border-2 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800 hover:scale-[1.02] active:scale-100 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-all duration-200">
            <Mail className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold text-slate-300 group-hover:text-white text-center transition-colors">Email Us</span>
        </button>

        {/* Text/SMS */}
        <button
          onClick={handleText}
          className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-900 border-2 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800 hover:scale-[1.02] active:scale-100 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-all duration-200">
            <Send className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold text-slate-300 group-hover:text-white text-center transition-colors">Text Us</span>
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