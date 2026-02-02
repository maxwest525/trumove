import { useState } from "react";
import { Video, Phone, Mail, MessageSquare, Play, Monitor, Settings, Volume2, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContactHubProps {
  onStartVideoCall: () => void;
  bookingCode: string;
  setBookingCode: (code: string) => void;
  onJoinRoom: () => void;
  audioOutputDevices: MediaDeviceInfo[];
  videoInputDevices: MediaDeviceInfo[];
  selectedSpeaker: string;
  setSelectedSpeaker: (id: string) => void;
  selectedCamera: string;
  setSelectedCamera: (id: string) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

export function ContactHub({
  onStartVideoCall,
  bookingCode,
  setBookingCode,
  onJoinRoom,
  audioOutputDevices,
  videoInputDevices,
  selectedSpeaker,
  setSelectedSpeaker,
  selectedCamera,
  setSelectedCamera,
  volume,
  setVolume,
}: ContactHubProps) {
  const isMuted = volume === 0;

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full max-w-2xl">
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

      {/* Booking ID Search - Larger, more readable */}
      <div className="w-full max-w-lg mb-6">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border-2 border-white/20">
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

      {/* Screen Share Info - More readable */}
      <div className="flex items-center gap-3 text-white/70 max-w-lg">
        <Monitor className="w-5 h-5 text-sky-400 shrink-0" />
        <p className="text-sm text-left">
          <span className="font-bold text-white">Screen Sharing Available</span> — 
          Collaborate on inventory, documents, and profiles.
        </p>
      </div>

      {/* Bottom Controls Row */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        {/* Settings and Volume - Left */}
        <div className="flex items-center gap-2">
          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-popover border border-border shadow-xl z-50">
              {/* Camera Selection */}
              <DropdownMenuLabel className="text-xs font-semibold flex items-center gap-2">
                <Video className="w-3.5 h-3.5" />
                Camera
              </DropdownMenuLabel>
              {videoInputDevices.length > 0 ? (
                videoInputDevices.map((device) => (
                  <DropdownMenuItem 
                    key={device.deviceId} 
                    className={cn(
                      "text-xs cursor-pointer",
                      selectedCamera === device.deviceId && "bg-accent"
                    )}
                    onClick={() => {
                      setSelectedCamera(device.deviceId);
                      toast.success(`Camera: ${device.label || 'Camera'}`);
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      {selectedCamera === device.deviceId && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      )}
                      <span className="truncate">{device.label || 'Default Camera'}</span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  No cameras found
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              {/* Speaker Selection */}
              <DropdownMenuLabel className="text-xs font-semibold flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5" />
                Speaker
              </DropdownMenuLabel>
              {audioOutputDevices.length > 0 ? (
                audioOutputDevices.map((device) => (
                  <DropdownMenuItem 
                    key={device.deviceId} 
                    className={cn(
                      "text-xs cursor-pointer",
                      selectedSpeaker === device.deviceId && "bg-accent"
                    )}
                    onClick={() => {
                      setSelectedSpeaker(device.deviceId);
                      toast.success(`Speaker: ${device.label || 'Speaker'}`);
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      {selectedSpeaker === device.deviceId && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      )}
                      <span className="truncate">{device.label || 'Default Speaker'}</span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  Default Speaker
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Volume */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm",
                  isMuted && "border-amber-500/50"
                )}
              >
                <Volume2 className={cn("w-5 h-5", isMuted && "text-amber-400")} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 p-3 bg-popover border border-border shadow-xl z-50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Volume</span>
                  <span className="text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-sky-500
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs h-7"
                  onClick={() => setVolume(volume === 0 ? 0.75 : 0)}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Demo Mode - Right */}
        <button
          onClick={onStartVideoCall}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border-2 border-white/20 text-white font-medium hover:bg-white/20 transition-colors"
        >
          <Play className="w-4 h-4" />
          Try Demo Mode
        </button>
      </div>
    </div>
  );
}
