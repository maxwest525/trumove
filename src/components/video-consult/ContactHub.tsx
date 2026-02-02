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

      {/* Primary Action Buttons - Brand-styled with refined icons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full max-w-3xl">
        {/* Video Call - Primary brand green */}
        <button
          onClick={onStartVideoCall}
          className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border-2 border-white/20 hover:border-primary/60 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300 p-4">
            <Video className="w-9 h-9 text-primary" strokeWidth={2} />
          </div>
          <span className="text-base font-bold text-white group-hover:text-primary transition-colors">Video Call</span>
        </button>

        {/* Voice Call - Warm amber/orange */}
        <button
          onClick={handleVoiceCall}
          className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border-2 border-white/20 hover:border-amber-400/60 hover:bg-amber-500/20 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
        >
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-amber-400/50 transition-all duration-300 p-4">
            <PhoneCall className="w-9 h-9 text-amber-400" strokeWidth={2} />
          </div>
          <span className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">Voice Call</span>
        </button>

        {/* Email - Cool blue/indigo */}
        <button
          onClick={handleEmail}
          className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border-2 border-white/20 hover:border-blue-400/60 hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
        >
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-400/50 transition-all duration-300 p-4">
            <Mail className="w-9 h-9 text-blue-400" strokeWidth={2} />
          </div>
          <span className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">Email Us</span>
        </button>

        {/* Text/SMS - Teal/cyan */}
        <button
          onClick={handleText}
          className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border-2 border-white/20 hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
        >
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-400/50 transition-all duration-300 p-4">
            <Send className="w-9 h-9 text-cyan-400" strokeWidth={2} />
          </div>
          <span className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">Text Us</span>
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
