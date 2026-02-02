import { Video, Phone, Mail, MessageSquare, Search, ArrowRight } from "lucide-react";
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
      <div className="text-center mb-10">
        <h3 className="text-3xl font-black text-white mb-3">
          Ready to Connect
        </h3>
        <p className="text-white/80 text-base max-w-md mx-auto">
          How would you like to reach us?
        </p>
      </div>

      {/* Primary Action Buttons - Larger, clearer design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
        <button
          onClick={onStartVideoCall}
          className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-white/10 border-2 border-white/20 hover:bg-sky-500/20 hover:border-sky-400/50 transition-all duration-200"
        >
          <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center group-hover:bg-sky-500/30 transition-colors">
            <Video className="w-8 h-8 text-sky-400" />
          </div>
          <span className="text-base font-bold text-white">Video Call</span>
        </button>

        <button
          onClick={handleVoiceCall}
          className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-white/10 border-2 border-white/20 hover:bg-amber-500/20 hover:border-amber-400/50 transition-all duration-200"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
            <Phone className="w-8 h-8 text-amber-400" />
          </div>
          <span className="text-base font-bold text-white">Voice Call</span>
        </button>

        <button
          onClick={handleEmail}
          className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-white/10 border-2 border-white/20 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all duration-200"
        >
          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
            <Mail className="w-8 h-8 text-purple-400" />
          </div>
          <span className="text-base font-bold text-white">Email Us</span>
        </button>

        <button
          onClick={handleText}
          className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-white/10 border-2 border-white/20 hover:bg-teal-500/20 hover:border-teal-400/50 transition-all duration-200"
        >
          <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
            <MessageSquare className="w-8 h-8 text-teal-400" />
          </div>
          <span className="text-base font-bold text-white">Text Us</span>
        </button>
      </div>

      {/* Booking ID Search - Positioned at bottom */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border-2 border-white/20 max-w-lg mx-auto">
          <Search className="w-5 h-5 text-white/60 shrink-0" />
          <Input
            value={bookingCode}
            onChange={(e) => setBookingCode(e.target.value)}
            placeholder="Enter Booking or Shipment ID"
            className="flex-1 h-10 bg-transparent border-0 text-white text-base placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0"
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
            className="h-10 px-5 bg-foreground text-background hover:bg-foreground/90 font-bold"
          >
            Join
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
