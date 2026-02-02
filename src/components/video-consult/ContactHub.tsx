import { Video, Phone, Mail, MessageSquare, Search, PhoneCall, Headset, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      <div className="text-center mb-12">
        <h3 className="text-3xl font-black text-white mb-4">
          Ready to Connect
        </h3>
        <p className="text-white/80 text-lg max-w-lg mx-auto leading-relaxed">
          Choose how you'd like to reach our moving specialists
        </p>
      </div>

      {/* Primary Action Buttons - Brand-styled with hover animations */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
        {/* Video Call - Primary brand green */}
        <button
          onClick={onStartVideoCall}
          className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-b from-white/12 to-white/5 border-2 border-white/15 hover:border-primary/50 hover:bg-primary/15 hover:shadow-[0_0_30px_-5px] hover:shadow-primary/40 hover:scale-105 active:scale-100 transition-all duration-300 ease-out"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 border border-primary/25 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_-2px] group-hover:shadow-primary/50 transition-all duration-300 ease-out">
            <Video className="w-7 h-7 text-primary" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-white group-hover:text-primary transition-colors duration-200">Video Call</span>
        </button>

        {/* Voice Call - Warm amber/orange */}
        <button
          onClick={handleVoiceCall}
          className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-b from-white/12 to-white/5 border-2 border-white/15 hover:border-amber-400/50 hover:bg-amber-500/15 hover:shadow-[0_0_30px_-5px] hover:shadow-amber-500/40 hover:scale-105 active:scale-100 transition-all duration-300 ease-out"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/25 to-amber-500/10 border border-amber-500/25 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_-2px] group-hover:shadow-amber-500/50 transition-all duration-300 ease-out">
            <PhoneCall className="w-7 h-7 text-amber-400" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors duration-200">Voice Call</span>
        </button>

        {/* Email - Cool blue/indigo */}
        <button
          onClick={handleEmail}
          className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-b from-white/12 to-white/5 border-2 border-white/15 hover:border-sky-400/50 hover:bg-sky-500/15 hover:shadow-[0_0_30px_-5px] hover:shadow-sky-500/40 hover:scale-105 active:scale-100 transition-all duration-300 ease-out"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500/25 to-sky-500/10 border border-sky-500/25 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_-2px] group-hover:shadow-sky-500/50 transition-all duration-300 ease-out">
            <Mail className="w-7 h-7 text-sky-400" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors duration-200">Email Us</span>
        </button>

        {/* Text/SMS - Teal/cyan */}
        <button
          onClick={handleText}
          className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-b from-white/12 to-white/5 border-2 border-white/15 hover:border-teal-400/50 hover:bg-teal-500/15 hover:shadow-[0_0_30px_-5px] hover:shadow-teal-500/40 hover:scale-105 active:scale-100 transition-all duration-300 ease-out"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500/25 to-teal-500/10 border border-teal-500/25 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_-2px] group-hover:shadow-teal-500/50 transition-all duration-300 ease-out">
            <Send className="w-7 h-7 text-teal-400" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors duration-200">Text Us</span>
        </button>
      </div>

      {/* Booking ID Search - Compact at bottom */}
      <div className="absolute bottom-5 left-6 right-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 max-w-xs mx-auto">
          <Search className="w-3.5 h-3.5 text-white/60 shrink-0" />
          <Input
            value={bookingCode}
            onChange={(e) => setBookingCode(e.target.value)}
            placeholder="Booking ID"
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
            disabled={!bookingCode.trim()}
            className="h-6 px-2.5 bg-foreground text-background hover:bg-foreground/90 font-semibold text-[11px]"
          >
            Join
          </Button>
        </div>
      </div>
    </div>
  );
}
