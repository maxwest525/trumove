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
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Ready to Connect
        </h3>
        <p className="text-white/60 text-sm max-w-md mx-auto">
          How would you like to reach us?
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-3 gap-4 mb-4 w-full max-w-lg">
        <button
          onClick={onStartVideoCall}
          className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 transition-all duration-200"
        >
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Video className="w-7 h-7 text-primary" />
          </div>
          <span className="text-sm font-semibold text-white">Start Video Call</span>
        </button>

        <button
          onClick={handleVoiceCall}
          className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 transition-all duration-200"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
            <Phone className="w-7 h-7 text-emerald-400" />
          </div>
          <span className="text-sm font-semibold text-white">Start Voice Call</span>
        </button>

        <button
          onClick={handleEmail}
          className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 transition-all duration-200"
        >
          <div className="w-14 h-14 rounded-full bg-sky-500/20 flex items-center justify-center group-hover:bg-sky-500/30 transition-colors">
            <Mail className="w-7 h-7 text-sky-400" />
          </div>
          <span className="text-sm font-semibold text-white">Send Email</span>
        </button>
      </div>

      {/* Secondary Action - Text */}
      <button
        onClick={handleText}
        className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 transition-all duration-200 mb-8"
      >
        <MessageSquare className="w-5 h-5 text-amber-400" />
        <span className="text-sm font-semibold text-white">Send a Text</span>
      </button>

      {/* Booking ID Search */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
          <Search className="w-4 h-4 text-white/40 shrink-0" />
          <Input
            value={bookingCode}
            onChange={(e) => setBookingCode(e.target.value)}
            placeholder="Enter Booking or Shipment ID"
            className="flex-1 h-8 bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
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
            className="h-8 px-4 bg-primary hover:bg-primary/90"
          >
            Join
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>

      {/* Screen Share Info */}
      <div className="flex items-center gap-3 text-white/50 max-w-md mb-6">
        <Monitor className="w-5 h-5 text-primary shrink-0" />
        <p className="text-xs text-left">
          <span className="font-semibold text-white/70">Screen Sharing Available</span><br />
          Both you and support can share screens to collaborate on inventory, documents, and profiles.
        </p>
      </div>

      {/* Settings and Volume Controls - Bottom Left */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Settings className="w-4 h-4" />
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
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
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
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
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
                "h-9 w-9 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm",
                isMuted && "border-amber-500/50"
              )}
            >
              <Volume2 className={cn("w-4 h-4", isMuted && "text-amber-400")} />
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
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
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

      {/* Demo Mode Link - Bottom Right */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={onStartVideoCall}
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors"
        >
          <Play className="w-4 h-4" />
          Try Demo Mode
        </button>
      </div>
    </div>
  );
}
