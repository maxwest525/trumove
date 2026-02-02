import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { DailyVideoRoom } from "@/components/video-consult/DailyVideoRoom";
import { 
  Video, Phone, Boxes, Camera, Calendar, ArrowRight, Play, Users, Monitor, 
  Mic, MicOff, VideoOff, MessageSquare, Plus, Minus, X, Package, Search, Send, Mail,
  Sofa, Bed, UtensilsCrossed, Laptop, Wrench, LayoutGrid, List, Sparkles, Truck,
  Shield, BadgeCheck, FileText, Clock, Bot, Headphones, Volume2, VolumeX,
  Maximize2, Minimize2, Settings, CalendarDays, PenTool, User, Headset,
  PhoneCall, PictureInPicture2, PictureInPictureIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.png";
import AIChatContainer from "@/components/chat/AIChatContainer";
import { getPageContext } from "@/components/chat/pageContextConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { BookingCalendar } from "@/components/video-consult/BookingCalendar";
import { WhiteboardCanvas } from "@/components/video-consult/WhiteboardCanvas";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
// Trust strip items now inline in header

// Preview images
import previewAiScanner from "@/assets/preview-ai-scanner.jpg";
import sampleRoomLiving from "@/assets/sample-room-living.jpg";
import trudyAvatar from "@/assets/trudy-avatar.png";
import trudyVideoCall from "@/assets/trudy-video-call.jpg";

// Scroll to top on mount
const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};

// Fake Agent View - Full-bleed video feed style like a real call with subtle animation
function FakeAgentView({ 
  isMicMuted, 
  setIsMicMuted, 
  audioOutputDevices,
  videoInputDevices,
  selectedSpeaker,
  setSelectedSpeaker,
  selectedCamera,
  setSelectedCamera,
  volume,
  setVolume
}: { 
  isMicMuted: boolean; 
  setIsMicMuted: (val: boolean) => void;
  audioOutputDevices: MediaDeviceInfo[];
  videoInputDevices: MediaDeviceInfo[];
  selectedSpeaker: string;
  setSelectedSpeaker: (id: string) => void;
  selectedCamera: string;
  setSelectedCamera: (id: string) => void;
  volume: number;
  setVolume: (vol: number) => void;
}) {
  const isMuted = volume === 0;
  
  return (
    <div className="absolute inset-0">
      {/* Full-bleed agent "video" with professional background */}
      <div className="absolute inset-0">
        {/* Trudy Martinez on video call - fills the space with subtle zoom animation */}
        <img 
          src={trudyVideoCall}
          alt="Trudy Martinez" 
          className="w-full h-full object-cover animate-subtle-zoom"
        />
        {/* Subtle gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/30" />
      </div>
      
      {/* LIVE indicator - top left */}
      <div className="absolute top-4 left-4 px-2 py-1 rounded bg-red-600 text-white text-xs font-bold flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        LIVE
      </div>
      
      {/* Top Right - Settings Dropdown for Camera/Speaker */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-black/50 border border-white/30 text-white hover:bg-black/70 backdrop-blur-sm"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-popover border border-border shadow-xl z-50">
            {/* Camera Selection */}
            <DropdownMenuLabel className="text-xs font-semibold flex items-center gap-2">
              <Camera className="w-3.5 h-3.5" />
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
      </div>
      
      {/* Name badge overlay - bottom left */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm">
        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
        <div>
          <p className="text-white font-bold text-xs">Trudy Martinez</p>
          <p className="text-white/60 text-[10px]">Senior Moving Specialist</p>
        </div>
      </div>
      
      {/* Bottom Right Audio Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        {/* Volume Control with Slider */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full bg-black/50 border border-white/30 text-white hover:bg-black/70 backdrop-blur-sm",
                isMuted && "border-amber-500/50"
              )}
              title="Volume control"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-amber-400" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-3 bg-popover border border-border shadow-xl z-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Volume</span>
                <span className="text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <VolumeX className="w-4 h-4 text-muted-foreground" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-sky-500
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                />
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </div>
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
        
        {/* Mic Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-full bg-black/50 border border-white/30 text-white hover:bg-black/70 backdrop-blur-sm",
            isMicMuted && "bg-destructive/60 border-destructive/50 text-white"
          )}
          onClick={() => setIsMicMuted(!isMicMuted)}
          title={isMicMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}

// Play typing sound effect using Web Audio API
function playTypingSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Soft click-like sound
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Silently fail if audio isn't available
  }
}

// Enhanced typing indicator with sound and ripple effect
function LiveAgentTypingIndicator({ withSound = true }: { withSound?: boolean }) {
  useEffect(() => {
    if (!withSound) return;
    
    // Play typing sounds at intervals
    const interval = setInterval(() => {
      playTypingSound();
    }, 400);
    
    // Play first sound immediately
    playTypingSound();
    
    return () => clearInterval(interval);
  }, [withSound]);

  return (
    <div className="flex items-start gap-2 py-2">
      {/* Avatar with ripple effect */}
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
          <User className="w-4 h-4 text-foreground" />
        </div>
        {/* Pulsing ripple */}
        <span className="absolute inset-0 rounded-full border-2 border-primary/60 animate-ping" />
      </div>
      
      {/* Typing bubble */}
      <div className="bg-white/10 rounded-lg rounded-bl-sm px-3 py-2.5">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      
      {/* Typing status */}
      <span className="text-[10px] text-white/50 self-center">typing...</span>
    </div>
  );
}

// Typing indicator for Trudy chat (simpler version)
function ChatTypingIndicator() {
  return (
    <div className="flex items-center gap-1 text-xs text-white/50 py-1">
      <span className="font-bold text-white/70">Trudy</span>
      <span className="flex gap-0.5 ml-1">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
      </span>
    </div>
  );
}

// Queue position indicator for live agent with dynamic countdown
function AgentQueueIndicator({ 
  position, 
  waitSeconds,
  onRequestCallback
}: { 
  position: number; 
  waitSeconds: number;
  onRequestCallback?: () => void;
}) {
  const [displayPosition, setDisplayPosition] = useState(position);
  const [isHighlighted, setIsHighlighted] = useState(false);
  
  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Update display position when prop changes
  useEffect(() => {
    if (position !== displayPosition) {
      setIsHighlighted(true);
      setTimeout(() => {
        setDisplayPosition(position);
        setIsHighlighted(false);
      }, 300);
    }
  }, [position, displayPosition]);
  
  const progressPercent = Math.max(10, Math.min(90, 100 - (waitSeconds / 180) * 100));

  return (
    <div className={cn(
      "bg-gradient-to-r from-amber-900/30 to-orange-900/20 border border-amber-500/30 rounded-lg px-3 py-2 mb-3 transition-all duration-300",
      isHighlighted && "ring-1 ring-primary"
    )}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
          <Users className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-white/80 text-xs">Position</span>
            <span className={cn(
              "text-sm font-bold transition-all",
              isHighlighted ? "text-primary" : "text-white"
            )}>
              #{displayPosition}
            </span>
            <span className="text-white/40 text-xs">•</span>
            <span className="text-amber-300 font-mono text-xs font-medium">
              ~{formatTime(waitSeconds)}
            </span>
          </div>
        </div>
        {/* Skip queue button */}
        <button
          onClick={onRequestCallback}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors"
        >
          <PhoneCall className="w-3 h-3" />
          Callback
        </button>
      </div>
    </div>
  );
}

// Agent status badge component
function AgentStatusBadge({ status }: { status: 'available' | 'busy' }) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
      status === 'available' 
        ? "bg-emerald-900 text-emerald-300" 
        : "bg-amber-900 text-amber-300"
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === 'available' 
          ? "bg-emerald-400 animate-pulse" 
          : "bg-amber-400 animate-pulse"
      )} />
      {status === 'available' ? 'Available' : 'Busy'}
    </div>
  );
}

// Room configuration for the inventory builder
const ROOM_CONFIG_DEMO = [
  { id: 'Living Room', label: 'Living Room', icon: Sofa },
  { id: 'Bedroom', label: 'Bedroom', icon: Bed },
  { id: 'Kitchen', label: 'Kitchen', icon: UtensilsCrossed },
  { id: 'Dining Room', label: 'Dining', icon: UtensilsCrossed },
  { id: 'Office', label: 'Office', icon: Laptop },
  { id: 'Garage', label: 'Garage', icon: Wrench },
];

// Inventory items organized by room with images
const inventoryItemsByRoom: Record<string, { name: string; weight: number; image: string }[]> = {
  'Living Room': [
    { name: "3-Cushion Sofa", weight: 180, image: "/inventory/living-room/sofa-3-cushion.png" },
    { name: "55\" Plasma TV", weight: 65, image: "/inventory/living-room/tv-plasma.png" },
    { name: "Armchair", weight: 85, image: "/inventory/living-room/armchair.png" },
    { name: "Coffee Table", weight: 45, image: "/inventory/living-room/coffee-table.png" },
    { name: "End Table", weight: 25, image: "/inventory/living-room/end-table.png" },
    { name: "Bookcase, Medium", weight: 80, image: "/inventory/living-room/bookcase-medium.png" },
    { name: "TV Stand", weight: 50, image: "/inventory/living-room/tv-stand.png" },
    { name: "Floor Lamp", weight: 15, image: "/inventory/living-room/lamp-floor.png" },
  ],
  'Bedroom': [
    { name: "Queen Bed", weight: 150, image: "/inventory/bedroom/bed-queen.png" },
    { name: "Dresser", weight: 120, image: "/inventory/bedroom/dresser.png" },
    { name: "Nightstand", weight: 35, image: "/inventory/bedroom/nightstand.png" },
    { name: "Chest of Drawers", weight: 90, image: "/inventory/bedroom/chest-of-drawers.png" },
    { name: "Wardrobe", weight: 150, image: "/inventory/bedroom/wardrobe.png" },
    { name: "Vanity Dresser", weight: 80, image: "/inventory/bedroom/dresser-vanity.png" },
    { name: "King Bed", weight: 200, image: "/inventory/bedroom/bed-king.png" },
    { name: "Headboard", weight: 40, image: "/inventory/bedroom/headboard.png" },
  ],
  'Kitchen': [
    { name: "Refrigerator", weight: 250, image: "/inventory/appliances/refrigerator.png" },
    { name: "Kitchen Table", weight: 60, image: "/inventory/kitchen/kitchen-table.png" },
    { name: "Kitchen Chair", weight: 15, image: "/inventory/kitchen/kitchen-chair.png" },
    { name: "Microwave", weight: 40, image: "/inventory/appliances/microwave.png" },
    { name: "Bar Stool", weight: 20, image: "/inventory/kitchen/bar-stool.png" },
    { name: "Baker's Rack", weight: 45, image: "/inventory/kitchen/bakers-rack.png" },
    { name: "High Chair", weight: 12, image: "/inventory/kitchen/high-chair.png" },
    { name: "Wine Rack", weight: 25, image: "/inventory/kitchen/wine-rack.png" },
  ],
  'Dining Room': [
    { name: "Dining Table", weight: 120, image: "/inventory/dining-room/dining-table.png" },
    { name: "Dining Chair", weight: 20, image: "/inventory/dining-room/dining-chair.png" },
    { name: "China Cabinet", weight: 180, image: "/inventory/dining-room/china-cabinet.png" },
    { name: "Buffet", weight: 150, image: "/inventory/dining-room/buffet.png" },
    { name: "Server", weight: 80, image: "/inventory/dining-room/server.png" },
    { name: "Rug, Large", weight: 35, image: "/inventory/dining-room/rug-large.png" },
  ],
  'Office': [
    { name: "Desk", weight: 100, image: "/inventory/office/desk.png" },
    { name: "Office Chair", weight: 35, image: "/inventory/office/office-chair.png" },
    { name: "File Cabinet", weight: 80, image: "/inventory/office/file-cabinet.png" },
    { name: "Bookcase", weight: 70, image: "/inventory/living-room/bookcase-medium.png" },
    { name: "Computer", weight: 25, image: "/inventory/office/computer.png" },
    { name: "Printer", weight: 30, image: "/inventory/office/printer.png" },
  ],
  'Garage': [
    { name: "Workbench", weight: 100, image: "/inventory/garage/workbench.png" },
    { name: "Tool Chest", weight: 80, image: "/inventory/garage/tool-chest.png" },
    { name: "Bicycle", weight: 25, image: "/inventory/garage/bicycle.png" },
    { name: "Lawn Mower", weight: 80, image: "/inventory/patio/lawn-mower.png" },
    { name: "Snow Blower", weight: 90, image: "/inventory/patio/snow-blower.png" },
    { name: "Wheelbarrow", weight: 25, image: "/inventory/patio/wheelbarrow.png" },
  ],
};

// Inventory Share Modal - Full InventoryBuilder-style interface
function InventoryShareModal({ onClose }: { onClose: () => void }) {
  const [activeRoom, setActiveRoom] = useState('Living Room');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'Living Room-3-Cushion Sofa': 1,
    'Living Room-55" Plasma TV': 1,
    'Living Room-Armchair': 2,
    'Living Room-Coffee Table': 1,
    'Bedroom-Queen Bed': 1,
    'Bedroom-Dresser': 1,
    'Bedroom-Nightstand': 2,
    'Kitchen-Refrigerator': 1,
  });

  const updateQuantity = (room: string, itemName: string, delta: number) => {
    const key = `${room}-${itemName}`;
    setQuantities(prev => {
      const newQty = Math.max(0, (prev[key] || 0) + delta);
      if (newQty === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: newQty };
    });
  };

  const getRoomCount = (roomId: string) => {
    return Object.entries(quantities)
      .filter(([key]) => key.startsWith(`${roomId}-`))
      .reduce((sum, [, qty]) => sum + qty, 0);
  };

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalWeight = Object.entries(quantities).reduce((sum, [key, qty]) => {
    const [room, ...nameParts] = key.split('-');
    const itemName = nameParts.join('-');
    const item = inventoryItemsByRoom[room]?.find(i => i.name === itemName);
    return sum + (item?.weight || 0) * qty;
  }, 0);

  const roomItems = inventoryItemsByRoom[activeRoom] || [];
  
  // Filter items based on search query
  const filteredItems = searchQuery.trim() 
    ? roomItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : roomItems;

  return (
    <div className="absolute inset-4 flex items-center justify-center z-10">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-600">
        {/* Window Chrome */}
        <div className="px-4 py-3 bg-slate-100 dark:bg-slate-700 flex items-center gap-2 border-b border-slate-200 dark:border-slate-600">
          <div className="flex gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Customer's Screen - My Move Inventory
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/20 text-primary flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live
          </span>
        </div>
        
        {/* Main Content - Sidebar + Grid */}
        <div className="flex h-[360px]">
          {/* Left Sidebar - Room Navigation */}
          <div className="w-36 border-r border-slate-200 dark:border-slate-600 p-3 space-y-1 bg-slate-50 dark:bg-slate-800/50">
            <div className="text-[10px] font-black tracking-wider uppercase text-slate-400 mb-2 px-2">
              Rooms
            </div>
            {ROOM_CONFIG_DEMO.map((room) => {
              const Icon = room.icon;
              const count = getRoomCount(room.id);
              const isActive = activeRoom === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-xs font-semibold transition-all",
                    isActive 
                      ? "border-2 border-primary bg-primary/10 text-slate-800 dark:text-white" 
                      : "border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate flex-1">{room.label}</span>
                  {count > 0 && (
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                      isActive ? "bg-slate-800 dark:bg-white text-white dark:text-slate-800" : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Content - Item Grid */}
          <div className="flex-1 flex flex-col">
            {/* Search Bar + View Toggle Header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              {/* Room Label */}
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">{activeRoom}</span>
              
              {/* View Toggle */}
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    viewMode === 'grid' 
                      ? "bg-primary/20 text-primary" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    viewMode === 'list' 
                      ? "bg-primary/20 text-primary" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Item Grid */}
            <div className="flex-1 p-3 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <Search className="w-8 h-8 text-slate-300 dark:text-slate-500 mb-3" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    No items found
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Try a different search term
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-4 gap-2">
                  {filteredItems.map((item) => {
                    const qty = quantities[`${activeRoom}-${item.name}`] || 0;
                    return (
                      <div 
                        key={item.name}
                        className={cn(
                          "flex flex-col items-center p-2 rounded-xl border-2 transition-all",
                          qty > 0 
                            ? "border-primary/40 bg-primary/5" 
                            : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                        )}
                      >
                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-1 border border-slate-100">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-contain mix-blend-multiply" />
                        </div>
                        <span className="text-[10px] font-medium text-center line-clamp-2 h-7 text-slate-700 dark:text-slate-200">{item.name}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <button
                            onClick={() => updateQuantity(activeRoom, item.name, -1)}
                            disabled={qty === 0}
                            className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-slate-700 dark:text-white">{qty}</span>
                          <button
                            onClick={() => updateQuantity(activeRoom, item.name, 1)}
                            className="w-5 h-5 rounded flex items-center justify-center bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredItems.map((item) => {
                    const qty = quantities[`${activeRoom}-${item.name}`] || 0;
                    return (
                      <div 
                        key={item.name}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg border transition-all",
                          qty > 0 
                            ? "border-primary/40 bg-primary/5" 
                            : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                        )}
                      >
                        <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center border border-slate-100">
                          <img src={item.image} alt={item.name} className="w-8 h-8 object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.weight} lbs</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(activeRoom, item.name, -1)}
                            disabled={qty === 0}
                            className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 flex items-center justify-center disabled:opacity-30 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-slate-700 dark:text-white">{qty}</span>
                          <button
                            onClick={() => updateQuantity(activeRoom, item.name, 1)}
                            className="w-6 h-6 rounded bg-primary/20 hover:bg-primary/30 flex items-center justify-center text-primary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Totals */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-600 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">{totalItems} items • Est. {totalWeight.toLocaleString()} lbs</span>
          <span className="text-xs text-primary font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live sharing with Trudy
          </span>
        </div>
      </div>
    </div>
  );
}

// Screen Share Preview Modal - Shows inventory as "Agent's View"
function ScreenSharePreviewModal({ onClose }: { onClose: () => void }) {
  const [activeRoom, setActiveRoom] = useState('Living Room');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'Living Room-3-Cushion Sofa': 1,
    'Living Room-55" Plasma TV': 1,
    'Living Room-Armchair': 2,
    'Living Room-Coffee Table': 1,
    'Bedroom-Queen Bed': 1,
    'Bedroom-Dresser': 1,
    'Bedroom-Nightstand': 2,
    'Kitchen-Refrigerator': 1,
  });

  const updateQuantity = (room: string, itemName: string, delta: number) => {
    const key = `${room}-${itemName}`;
    setQuantities(prev => {
      const newQty = Math.max(0, (prev[key] || 0) + delta);
      if (newQty === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: newQty };
    });
  };

  const getRoomCount = (roomId: string) => {
    return Object.entries(quantities)
      .filter(([key]) => key.startsWith(`${roomId}-`))
      .reduce((sum, [, qty]) => sum + qty, 0);
  };

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalWeight = Object.entries(quantities).reduce((sum, [key, qty]) => {
    const [room, ...nameParts] = key.split('-');
    const itemName = nameParts.join('-');
    const item = inventoryItemsByRoom[room]?.find(i => i.name === itemName);
    return sum + (item?.weight || 0) * qty;
  }, 0);

  const roomItems = inventoryItemsByRoom[activeRoom] || [];
  const filteredItems = searchQuery.trim() 
    ? roomItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : roomItems;

  return (
    <div className="w-full max-w-xl mx-4 max-h-[calc(100%-32px)]">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-600">
        {/* Window Chrome with "Agent's View" indicator */}
        <div className="px-4 py-3 bg-slate-100 dark:bg-slate-700 flex items-center gap-2 border-b border-slate-200 dark:border-slate-600">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Agent's View - Your Inventory
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 flex items-center gap-1 mr-2">
            <Monitor className="w-3 h-3" />
            Sharing
          </span>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="Close preview"
          >
            <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
        
        {/* Main Content - Sidebar + Grid */}
        <div className="flex h-[280px]">
          {/* Left Sidebar - Room Navigation */}
          <div className="w-36 border-r border-slate-200 dark:border-slate-600 p-3 space-y-1 bg-slate-50 dark:bg-slate-800/50">
            <div className="text-[10px] font-black tracking-wider uppercase text-slate-400 mb-2 px-2">
              Rooms
            </div>
            {ROOM_CONFIG_DEMO.map((room) => {
              const Icon = room.icon;
              const count = getRoomCount(room.id);
              const isActive = activeRoom === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-xs font-semibold transition-all",
                    isActive 
                      ? "border-2 border-primary bg-primary/10 text-slate-800 dark:text-white" 
                      : "border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate flex-1">{room.label}</span>
                  {count > 0 && (
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                      isActive ? "bg-slate-800 dark:bg-white text-white dark:text-slate-800" : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Content - Item Grid */}
          <div className="flex-1 flex flex-col">
            {/* Search Bar + View Toggle Header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">{activeRoom}</span>
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    viewMode === 'grid' 
                      ? "bg-primary/20 text-primary" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    viewMode === 'list' 
                      ? "bg-primary/20 text-primary" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Item Grid */}
            <div className="flex-1 p-3 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <Search className="w-8 h-8 text-slate-300 dark:text-slate-500 mb-3" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    No items found
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Try a different search term
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-4 gap-2">
                  {filteredItems.map((item) => {
                    const qty = quantities[`${activeRoom}-${item.name}`] || 0;
                    return (
                      <div 
                        key={item.name}
                        className={cn(
                          "flex flex-col items-center p-2 rounded-xl border-2 transition-all",
                          qty > 0 
                            ? "border-primary/40 bg-primary/5" 
                            : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                        )}
                      >
                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-1 border border-slate-100">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-contain mix-blend-multiply" />
                        </div>
                        <span className="text-[10px] font-medium text-center line-clamp-2 h-7 text-slate-700 dark:text-slate-200">{item.name}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <button
                            onClick={() => updateQuantity(activeRoom, item.name, -1)}
                            disabled={qty === 0}
                            className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-slate-700 dark:text-white">{qty}</span>
                          <button
                            onClick={() => updateQuantity(activeRoom, item.name, 1)}
                            className="w-5 h-5 rounded flex items-center justify-center bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const qty = quantities[`${activeRoom}-${item.name}`] || 0;
                    return (
                      <div 
                        key={item.name}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg border-2 transition-all",
                          qty > 0 
                            ? "border-primary/40 bg-primary/5" 
                            : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                        )}
                      >
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-slate-100">
                          <img src={item.image} alt={item.name} className="w-8 h-8 object-contain mix-blend-multiply" />
                        </div>
                        <span className="flex-1 text-xs font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(activeRoom, item.name, -1)}
                            disabled={qty === 0}
                            className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 flex items-center justify-center disabled:opacity-30 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-slate-700 dark:text-white">{qty}</span>
                          <button
                            onClick={() => updateQuantity(activeRoom, item.name, 1)}
                            className="w-6 h-6 rounded bg-primary/20 hover:bg-primary/30 flex items-center justify-center text-primary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Totals */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-600 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">{totalItems} items • Est. {totalWeight.toLocaleString()} lbs</span>
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Agent can see your screen
          </span>
        </div>
      </div>
    </div>
  );
}

// Trudy's contextual responses
const trudyResponses = [
  "Great question! I'm checking that for you now.",
  "That's a common concern - let me explain how we handle that.",
  "Absolutely! I'll make a note of that in your profile.",
  "I see that on my end. Let's walk through it together.",
  "Good thinking! That's exactly what I'd recommend.",
  "Let me pull up those details for you real quick.",
];

// Demo Video Placeholder Component - shows fake video call experience
function DemoVideoPlaceholder({ onLeave, isPiP = false }: { onLeave: () => void; isPiP?: boolean }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ from: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasRunTimeline, setHasRunTimeline] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('default');
  const [selectedCamera, setSelectedCamera] = useState<string>('default');
  const [volume, setVolume] = useState<number>(0.75);

  // Fetch all media devices
  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        // Request permission to get device labels
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true }).catch(() => {});
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        
        setAudioOutputDevices(audioOutputs);
        setVideoInputDevices(videoInputs);
        
        // Set default selections
        if (audioOutputs.length > 0 && selectedSpeaker === 'default') {
          setSelectedSpeaker(audioOutputs[0].deviceId);
        }
        if (videoInputs.length > 0 && selectedCamera === 'default') {
          setSelectedCamera(videoInputs[0].deviceId);
        }
      } catch (error) {
        console.log('Could not enumerate media devices:', error);
      }
    };
    getMediaDevices();
  }, []);

  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format duration as M:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulated Trudy conversation timeline - feels like she just answered
  useEffect(() => {
    if (hasRunTimeline) return;
    setHasRunTimeline(true);

    const timeline: { delay: number; text?: string; typing?: boolean }[] = [
      { delay: 300, text: "Welcome to TruMove! I'm Trudy, your personal moving consultant. 👋" },
      { delay: 3500, typing: true },
      { delay: 5500, text: "I see you're exploring your options - great timing! I can help you get an accurate quote, explain our services, or walk you through the moving process." },
      { delay: 10000, typing: true },
      { delay: 12000, text: "Want to share your screen so I can see your inventory? Or I can answer any questions you have about pricing, timelines, or logistics!" },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    timeline.forEach((event) => {
      const timeout = setTimeout(() => {
        if (event.typing) {
          setIsTyping(true);
        } else if (event.text) {
          setIsTyping(false);
          setChatMessages(prev => [...prev, { from: "Trudy", text: event.text! }]);
        }
      }, event.delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [hasRunTimeline]);

  const handleShareScreen = () => {
    setIsScreenSharing(!isScreenSharing);
    if (!isScreenSharing) {
      toast.success("Screen sharing started");
      // Trudy responds to screen share
      setTimeout(() => {
        setIsTyping(true);
      }, 800);
      setTimeout(() => {
        setIsTyping(false);
        setChatMessages(prev => [...prev, { 
          from: "Trudy", 
          text: "Perfect! I can see your inventory now. Let me walk you through each item..." 
        }]);
      }, 2000);
    } else {
      toast("Screen sharing stopped");
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, { from: "You", text: newMessage }]);
      setNewMessage("");
      // Show typing then respond
      setTimeout(() => setIsTyping(true), 500);
      setTimeout(() => {
        setIsTyping(false);
        const response = trudyResponses[Math.floor(Math.random() * trudyResponses.length)];
        setChatMessages(prev => [...prev, { from: "Trudy", text: response }]);
      }, 2000);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Main video area */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Agent always visible (dimmed when screen sharing) */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${isScreenSharing ? 'opacity-30' : 'opacity-100'}`}>
          <FakeAgentView 
            isMicMuted={isMuted} 
            setIsMicMuted={setIsMuted} 
            audioOutputDevices={audioOutputDevices}
            videoInputDevices={videoInputDevices}
            selectedSpeaker={selectedSpeaker}
            setSelectedSpeaker={setSelectedSpeaker}
            selectedCamera={selectedCamera}
            setSelectedCamera={setSelectedCamera}
            volume={volume}
            setVolume={setVolume}
          />
        </div>
        
        {/* Screen share modal overlay */}
        {isScreenSharing && (
          <InventoryShareModal onClose={() => setIsScreenSharing(false)} />
        )}

        {/* Self view (picture-in-picture) - Scaled for PiP mode */}
        <div className={cn(
          "absolute rounded-xl overflow-hidden border-2 border-white/30 bg-slate-800 shadow-xl",
          isPiP ? "bottom-2 right-2 w-16 h-12 rounded-lg border" : "bottom-4 right-4 w-36 h-28"
        )}>
          {isVideoOff ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-800">
              <VideoOff className={isPiP ? "w-3 h-3 text-white/40" : "w-6 h-6 text-white/40"} />
            </div>
          ) : (
            <div className="w-full h-full relative">
              {/* Simulated webcam with gradient - looks like real video feed */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={cn(
                  "rounded-full bg-primary/20 border border-white/30 flex items-center justify-center",
                  isPiP ? "w-6 h-6" : "w-14 h-14 border-2"
                )}>
                  <span className={cn("text-white font-bold", isPiP ? "text-[8px]" : "text-lg")}>You</span>
                </div>
              </div>
              {/* Muted indicator */}
              {isMuted && (
                <div className={cn(
                  "absolute rounded-full bg-red-500",
                  isPiP ? "bottom-0.5 right-0.5 p-0.5" : "bottom-2 right-2 p-1.5"
                )}>
                  <MicOff className={isPiP ? "w-1.5 h-1.5 text-white" : "w-3 h-3 text-white"} />
                </div>
              )}
            </div>
          )}
          {!isPiP && (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium">
              You
            </div>
          )}
        </div>

        {/* Chat removed - available in right side panel */}

        {/* Connection status - looks like a real call - hide in PiP */}
        {!isPiP && (
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-green-500/90 text-white text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Connected • {formatDuration(callDuration)}
            </div>
          </div>
        )}

        {/* PiP compact status badge */}
        {isPiP && (
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            LIVE • {formatDuration(callDuration)}
          </div>
        )}

        {/* Call quality indicator - hide in PiP */}
        {!isPiP && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
            <div className="flex gap-0.5">
              <div className="w-1 h-3 rounded-sm bg-green-400" />
              <div className="w-1 h-3 rounded-sm bg-green-400" />
              <div className="w-1 h-3 rounded-sm bg-green-400" />
              <div className="w-1 h-2 rounded-sm bg-green-400/50" />
            </div>
            <span className="text-[10px] text-white/70 font-medium">HD</span>
          </div>
        )}
      </div>

      {/* Control bar - compact in PiP */}
      <div className={cn(
        "bg-slate-900 border-t border-white/10 flex items-center justify-center px-2",
        isPiP ? "h-10 gap-2" : "h-16 gap-3 px-4"
      )}>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={cn(
            "rounded-full flex items-center justify-center transition-colors",
            isPiP ? "w-7 h-7" : "w-11 h-11",
            isMuted ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
          )}
        >
          {isMuted ? <MicOff className={isPiP ? "w-3.5 h-3.5" : "w-5 h-5"} /> : <Mic className={isPiP ? "w-3.5 h-3.5" : "w-5 h-5"} />}
        </button>
        
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={cn(
            "rounded-full flex items-center justify-center transition-colors",
            isPiP ? "w-7 h-7" : "w-11 h-11",
            isVideoOff ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
          )}
        >
          {isVideoOff ? <VideoOff className={isPiP ? "w-3.5 h-3.5" : "w-5 h-5"} /> : <Video className={isPiP ? "w-3.5 h-3.5" : "w-5 h-5"} />}
        </button>

        {/* Screen share button - hide in PiP */}
        {!isPiP && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleShareScreen}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center transition-colors",
                  isScreenSharing ? "bg-primary text-primary-foreground" : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                <Monitor className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isScreenSharing ? "Stop Sharing" : "Share Screen"}</p>
            </TooltipContent>
          </Tooltip>
        )}

        <button
          onClick={onLeave}
          className={cn(
            "rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors",
            isPiP ? "w-7 h-7" : "w-11 h-11"
          )}
        >
          <Phone className={cn("rotate-[135deg]", isPiP ? "w-3.5 h-3.5" : "w-5 h-5")} />
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
  const [chatMode, setChatMode] = useState<'trudy' | 'liveagent' | 'support'>('trudy');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [showScreenSharePreview, setShowScreenSharePreview] = useState(false);
  const [shareAudio, setShareAudio] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showWhiteboardModal, setShowWhiteboardModal] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("default");
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  
  // Schedule form state
  const [scheduleName, setScheduleName] = useState("");
  const [schedulePhone, setSchedulePhone] = useState("");
  const [scheduleEmail, setScheduleEmail] = useState("");
  const [scheduleTcpaConsent, setScheduleTcpaConsent] = useState(false);
  
  // Live Support chat state
  const [liveChatMessages, setLiveChatMessages] = useState<{id: string; text: string; isUser: boolean; time: Date}[]>([]);
  const [liveChatInput, setLiveChatInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  
  // Agent status and queue state
  const [agentStatus, setAgentStatus] = useState<'available' | 'busy'>('available');
  const [queuePosition, setQueuePosition] = useState(2);
  const [queueWaitSeconds, setQueueWaitSeconds] = useState(120);
  const [agentConnected, setAgentConnected] = useState(false);
  
  // Callback request modal state
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  
  // Picture-in-picture state
  const [isPiP, setIsPiP] = useState(false);
  const [pipPosition, setPipPosition] = useState({ x: 0, y: 0 }); // 0,0 = default position (bottom-right)
  const [pipSize, setPipSize] = useState({ width: 320, height: 200 }); // Default PiP size
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState<'tl' | 'tr' | 'bl' | 'br' | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number; startPosX: number; startPosY: number } | null>(null);
  const pipRef = useRef<HTMLDivElement>(null);
  
  // Expanded video modal state (draggable + resizable)
  const [expandedVideoPosition, setExpandedVideoPosition] = useState({ x: 0, y: 0 });
  const [expandedVideoSize, setExpandedVideoSize] = useState({ width: 900, height: 600 });
  const [isExpandedDragging, setIsExpandedDragging] = useState(false);
  const [isExpandedResizing, setIsExpandedResizing] = useState(false);
  const expandedDragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const expandedResizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);
  
  // PiP drag handlers
  const handlePipMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start drag from the header area (not buttons)
    if ((e.target as HTMLElement).closest('button')) return;
    
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: pipPosition.x,
      startPosY: pipPosition.y
    };
  }, [pipPosition]);
  
  // PiP resize handlers
  const handlePipResizeStart = useCallback((e: React.MouseEvent, corner: 'tl' | 'tr' | 'bl' | 'br') => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeCorner(corner);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: pipSize.width,
      startHeight: pipSize.height,
      startPosX: pipPosition.x,
      startPosY: pipPosition.y
    };
  }, [pipSize, pipPosition]);
  
  // Combined PiP drag and resize effect
  useEffect(() => {
    if (!isDragging && !isResizing) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;
        
        setPipPosition({
          x: dragRef.current.startPosX - deltaX,
          y: dragRef.current.startPosY - deltaY
        });
      }
      
      if (isResizing && resizeRef.current && resizeCorner) {
        const deltaX = e.clientX - resizeRef.current.startX;
        const deltaY = e.clientY - resizeRef.current.startY;
        
        const minWidth = 240;
        const maxWidth = 560;
        const minHeight = 150;
        const maxHeight = 400;
        
        let newWidth = resizeRef.current.startWidth;
        let newHeight = resizeRef.current.startHeight;
        let newPosX = resizeRef.current.startPosX;
        let newPosY = resizeRef.current.startPosY;
        
        // Handle each corner differently
        if (resizeCorner === 'br') {
          // Bottom-right: expand towards bottom-right (decrease position)
          newWidth = Math.min(maxWidth, Math.max(minWidth, resizeRef.current.startWidth + deltaX));
          newHeight = Math.min(maxHeight, Math.max(minHeight, resizeRef.current.startHeight + deltaY));
        } else if (resizeCorner === 'bl') {
          // Bottom-left: expand towards bottom-left
          newWidth = Math.min(maxWidth, Math.max(minWidth, resizeRef.current.startWidth - deltaX));
          newHeight = Math.min(maxHeight, Math.max(minHeight, resizeRef.current.startHeight + deltaY));
          newPosX = resizeRef.current.startPosX + (resizeRef.current.startWidth - newWidth);
        } else if (resizeCorner === 'tr') {
          // Top-right: expand towards top-right
          newWidth = Math.min(maxWidth, Math.max(minWidth, resizeRef.current.startWidth + deltaX));
          newHeight = Math.min(maxHeight, Math.max(minHeight, resizeRef.current.startHeight - deltaY));
          newPosY = resizeRef.current.startPosY + (resizeRef.current.startHeight - newHeight);
        } else if (resizeCorner === 'tl') {
          // Top-left: expand towards top-left
          newWidth = Math.min(maxWidth, Math.max(minWidth, resizeRef.current.startWidth - deltaX));
          newHeight = Math.min(maxHeight, Math.max(minHeight, resizeRef.current.startHeight - deltaY));
          newPosX = resizeRef.current.startPosX + (resizeRef.current.startWidth - newWidth);
          newPosY = resizeRef.current.startPosY + (resizeRef.current.startHeight - newHeight);
        }
        
        setPipSize({ width: newWidth, height: newHeight });
        setPipPosition({ x: newPosX, y: newPosY });
      }
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        // Snap to nearest corner
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const centerX = windowWidth - pipPosition.x - pipSize.width / 2;
        const centerY = windowHeight - pipPosition.y - pipSize.height / 2;
        
        const isLeft = centerX < windowWidth / 2;
        const isTop = centerY < windowHeight / 2;
        
        const padding = 24;
        setPipPosition({
          x: isLeft ? windowWidth - pipSize.width - padding : padding,
          y: isTop ? windowHeight - pipSize.height - padding : padding + 72
        });
      }
      
      setIsDragging(false);
      setIsResizing(false);
      setResizeCorner(null);
      dragRef.current = null;
      resizeRef.current = null;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeCorner, pipPosition, pipSize]);
  
  // Expanded video modal drag handlers
  const handleExpandedDragStart = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    setIsExpandedDragging(true);
    expandedDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: expandedVideoPosition.x,
      startPosY: expandedVideoPosition.y
    };
  }, [expandedVideoPosition]);
  
  const handleExpandedResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpandedResizing(true);
    expandedResizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: expandedVideoSize.width,
      startHeight: expandedVideoSize.height
    };
  }, [expandedVideoSize]);
  
  useEffect(() => {
    if (!isExpandedDragging && !isExpandedResizing) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isExpandedDragging && expandedDragRef.current) {
        const deltaX = e.clientX - expandedDragRef.current.startX;
        const deltaY = e.clientY - expandedDragRef.current.startY;
        setExpandedVideoPosition({
          x: expandedDragRef.current.startPosX + deltaX,
          y: expandedDragRef.current.startPosY + deltaY
        });
      }
      
      if (isExpandedResizing && expandedResizeRef.current) {
        const deltaX = e.clientX - expandedResizeRef.current.startX;
        const deltaY = e.clientY - expandedResizeRef.current.startY;
        const newWidth = Math.min(1400, Math.max(500, expandedResizeRef.current.startWidth + deltaX));
        const newHeight = Math.min(900, Math.max(350, expandedResizeRef.current.startHeight + deltaY));
        setExpandedVideoSize({ width: newWidth, height: newHeight });
      }
    };
    
    const handleMouseUp = () => {
      setIsExpandedDragging(false);
      setIsExpandedResizing(false);
      expandedDragRef.current = null;
      expandedResizeRef.current = null;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isExpandedDragging, isExpandedResizing]);
  
  // Queue opt-in state (user must click to join queue)
  const [hasJoinedQueue, setHasJoinedQueue] = useState(false);
  
  // Simulate agent availability changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance to toggle between available and busy
      if (Math.random() > 0.7) {
        setAgentStatus(prev => prev === 'available' ? 'busy' : 'available');
      }
    }, 30000 + Math.random() * 30000); // Every 30-60 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Dynamic queue countdown timer (only runs when user has joined queue)
  useEffect(() => {
    if (!hasJoinedQueue || agentConnected || liveChatMessages.length > 0) return;
    
    const interval = setInterval(() => {
      setQueueWaitSeconds(prev => {
        if (prev <= 1) {
          // Agent connected!
          setAgentConnected(true);
          setQueuePosition(0);
          return 0;
        }
        
        // Decrement position when crossing thresholds
        if (prev === 60 && queuePosition > 1) {
          setQueuePosition(p => Math.max(1, p - 1));
        }
        
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [roomUrl, agentConnected, liveChatMessages.length, queuePosition]);
  
  // Get page context for AI chat
  const pageContext = getPageContext('/book');

  // Video modal toggle handler (opens expanded video in a modal)
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Enumerate audio output devices
  useEffect(() => {
    const enumerateDevices = async () => {
      try {
        // Request permission first (needed for full device labels)
        await navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          stream.getTracks().forEach(track => track.stop());
        }).catch(() => {});
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
        setAudioOutputDevices(audioOutputs);
      } catch (error) {
        console.log('Could not enumerate audio devices:', error);
      }
    };
    
    enumerateDevices();
    
    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', enumerateDevices);
    return () => navigator.mediaDevices.removeEventListener('devicechange', enumerateDevices);
  }, []);

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
    // Stop screen sharing if active
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      setShowScreenSharePreview(false);
    }
    setRoomUrl(null);
    setIsDemo(false);
    setBookingCode("");
    toast("Session ended");
  };

  // Handle screen share toggle
  const handleScreenShare = async () => {
    if (!roomUrl) {
      toast.info("Join a session first to share your screen");
      return;
    }

    if (isScreenSharing && screenStream) {
      // Stop screen sharing
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      setShowScreenSharePreview(false);
      toast.success("Screen sharing stopped");
    } else {
      try {
        // Request screen share with audio toggle
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { 
            displaySurface: "monitor",
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: shareAudio
        });
        
        setScreenStream(stream);
        setIsScreenSharing(true);
        setShowScreenSharePreview(true);
        toast.success("Screen sharing started!");
        
        // Listen for when user stops sharing via browser UI
        stream.getVideoTracks()[0].onended = () => {
          setScreenStream(null);
          setIsScreenSharing(false);
          setShowScreenSharePreview(false);
          toast.info("Screen sharing ended");
        };
      } catch (error) {
        if ((error as Error).name === 'NotAllowedError') {
          toast.info("Screen sharing was cancelled");
        } else {
          console.error("Screen share error:", error);
          toast.error("Could not start screen sharing");
        }
      }
    }
  };

  return (
    <div className="video-consult-page">
      {/* Site Header - Sticky */}
      <div className="sticky top-0 z-[100]">
        <Header />
      </div>
      
      {/* Sticky Header Block */}
      <div className="sticky top-[102px] z-40">
        <header className="video-consult-header">
          {/* Left - Logo & Title */}
          <div className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="TruMove" 
              className="h-6 brightness-0 invert"
            />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/90">
              Video Consult Center
            </span>
          </div>

          {/* Center - Trust Items (inline) */}
          <div className="video-consult-header-trust">
            <div className="video-consult-header-trust-item">
              <Shield className="w-4 h-4" />
              <span>SECURE VIDEO</span>
            </div>
            <span className="video-consult-trust-dot">•</span>
            <div className="video-consult-header-trust-item">
              <BadgeCheck className="w-4 h-4" />
              <span>LICENSED BROKER</span>
            </div>
            <span className="video-consult-trust-dot">•</span>
            <div className="video-consult-header-trust-item">
              <Monitor className="w-4 h-4" />
              <span>SCREEN SHARING</span>
            </div>
            <span className="video-consult-trust-dot">•</span>
            <div className="video-consult-header-trust-item">
              <FileText className="w-4 h-4" />
              <span>QUOTE REVIEW</span>
            </div>
            <span className="video-consult-trust-dot">•</span>
            <div className="video-consult-header-trust-item">
              <Clock className="w-4 h-4" />
              <span>NO OBLIGATION</span>
            </div>
          </div>

          {/* Right - Shipment ID (matching tracking page) */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] text-white/80 uppercase tracking-wider">Shipment ID</div>
              <div className="text-sm font-mono text-white">TM-2026-{String(Date.now()).slice(-8)}</div>
            </div>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl mx-auto">

          {/* Section Header - matches Build Your Move styling */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">
              Virtual Video <span className="tru-qb-title-accent">Call</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Connect face-to-face with our moving specialists for a personalized consultation. 
              Share your screen to walk through your inventory together in real-time.
            </p>
          </div>

          {/* Two-Column Grid: Video + Chat Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6 mb-8">
            {/* Main Video Window */}
            <Card id="video-consult-container" className="overflow-hidden border-2 border-primary/20 bg-gradient-to-b from-muted/30 to-background shadow-lg shadow-primary/5 ring-1 ring-white/5">
              <CardContent className="p-0">
                <div className="relative min-h-[400px] h-[560px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center ring-1 ring-inset ring-white/10">
                  {/* Top controls - Fullscreen and PiP */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                    {roomUrl && (
                      <button
                        onClick={() => setIsPiP(!isPiP)}
                        className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors border border-white/20"
                        title={isPiP ? "Exit Picture-in-Picture" : "Picture-in-Picture"}
                      >
                        <PictureInPicture2 className={cn("w-4 h-4", isPiP ? "text-primary" : "text-white")} />
                      </button>
                    )}
                    <button
                      onClick={toggleFullscreen}
                      className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors border border-white/20"
                      title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                  {roomUrl ? (
                    isDemo ? (
                      <DemoVideoPlaceholder onLeave={handleLeaveRoom} />
                    ) : (
                      <>
                        <DailyVideoRoom 
                          roomUrl={roomUrl}
                          userName="Guest"
                          onLeave={handleLeaveRoom}
                          className="w-full h-full"
                        />
                        {/* Screen Share Preview Modal - when actively sharing */}
                        {showScreenSharePreview && isScreenSharing && (
                          <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center animate-fade-in">
                            <div className="animate-scale-in">
                              <ScreenSharePreviewModal onClose={() => setShowScreenSharePreview(false)} />
                            </div>
                          </div>
                        )}
                      </>
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
                        Use the booking controls below to join your scheduled session, or start a demo.
                      </p>
                      
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

            {/* Chat Panel - Right Side */}
            <div className="video-consult-chat-panel border-2 border-primary/20 shadow-lg shadow-primary/5 ring-1 ring-white/5">
              {/* Tab Selector - 3 Options */}
              <div className="video-consult-chat-tabs">
                <button 
                  className={chatMode === 'trudy' ? 'active' : ''}
                  onClick={() => setChatMode('trudy')}
                  title="Talk to Trudy AI Assistant"
                >
                  <span className="relative inline-flex">
                    <Truck className="w-4 h-4" />
                    <Sparkles className="absolute -top-1 -right-1.5 w-2.5 h-2.5 text-primary" />
                  </span>
                  Trudy AI
                </button>
                <button 
                  className={chatMode === 'liveagent' ? 'active' : ''}
                  onClick={() => setChatMode('liveagent')}
                  title="Chat with a live person"
                >
                  <User className="w-4 h-4" />
                  Live Agent
                </button>
                <button 
                  className={chatMode === 'support' ? 'active' : ''}
                  onClick={() => setChatMode('support')}
                  title="Call, Email, or Schedule"
                >
                  <Headphones className="w-4 h-4" />
                  Support
                </button>
              </div>
              
              {/* Chat Content */}
              <div className="video-consult-chat-content">
                {chatMode === 'trudy' && (
                  <div className="video-consult-specialist-panel live-agent-panel h-full flex flex-col">
                    {/* Compact Header */}
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border shrink-0">
                      <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center relative shrink-0">
                        <Truck className="w-4 h-4 text-foreground" />
                        <Sparkles className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-foreground font-bold text-xs">Trudy AI Assistant</h4>
                        <p className="text-primary text-[10px] font-medium">Available 24/7</p>
                      </div>
                    </div>
                    
                    {/* Sample Questions - Compact */}
                    <div className="flex-1 overflow-y-auto min-h-0">
                      <p className="text-muted-foreground text-xs mb-2">
                        Trudy can help you with:
                      </p>
                      <ul className="space-y-1.5 text-xs text-foreground/80">
                        <li className="flex items-start gap-1.5">
                          <span className="text-primary">•</span>
                          "How much will my move cost?"
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-primary">•</span>
                          "What's included in full-service packing?"
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-primary">•</span>
                          "Can you explain the insurance options?"
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-primary">•</span>
                          "Do you offer storage between moves?"
                        </li>
                      </ul>
                    </div>
                    
                    {/* CTA Button - Compact */}
                    <div className="mt-auto pt-2 shrink-0">
                      <Button 
                        className="w-full h-9 bg-foreground hover:bg-foreground/90 text-background font-bold text-xs group"
                        onClick={() => window.dispatchEvent(new CustomEvent('openTrudyChat'))}
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
                        Chat with Trudy Now
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <p className="text-center text-muted-foreground text-[9px] mt-1">
                        Opens in floating chat window
                      </p>
                    </div>
                  </div>
                )}
                
                {chatMode === 'liveagent' && (
                  <div className="video-consult-specialist-panel live-agent-panel h-full flex flex-col">
                    {/* Compact Header with Status Badge */}
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border shrink-0">
                      <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center relative shrink-0">
                        <User className="w-4 h-4 text-foreground" />
                        <span className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background",
                          agentStatus === 'available' ? "bg-sky-500" : "bg-amber-400"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-foreground">Live Agent Chat</h4>
                        <AgentStatusBadge status={agentStatus} />
                      </div>
                    </div>
                    
                    {/* Connect to Agent / Queue Section - Compact */}
                    {liveChatMessages.length === 0 && !isAgentTyping && !agentConnected && (
                      <div className="shrink-0 mb-2">
                        {!hasJoinedQueue ? (
                          <div className="bg-muted/50 border border-border rounded-lg p-3">
                            <p className="text-muted-foreground text-xs text-center mb-2">
                              Ready to chat with a live agent?
                            </p>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => setHasJoinedQueue(true)}
                                className="flex-1 h-8 text-xs bg-foreground text-background hover:bg-foreground/90"
                                size="sm"
                              >
                                <Users className="w-3 h-3 mr-1.5" />
                                Join Queue
                              </Button>
                              <Button
                                onClick={() => setShowCallbackModal(true)}
                                variant="outline"
                                className="flex-1 h-8 text-xs"
                                size="sm"
                              >
                                <PhoneCall className="w-3 h-3 mr-1.5" />
                                Callback
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <AgentQueueIndicator 
                            position={queuePosition} 
                            waitSeconds={queueWaitSeconds}
                            onRequestCallback={() => setShowCallbackModal(true)}
                          />
                        )}
                      </div>
                    )}
                    
                    {/* Messages Area - Flexible height */}
                    <div className="flex-1 overflow-y-auto space-y-2 mb-2 min-h-0 bg-muted/30 border border-border rounded-lg p-3">
                      {liveChatMessages.length === 0 && !isAgentTyping ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-4">
                          <MessageSquare className="w-8 h-8 text-muted-foreground/40 mb-2" />
                          <p className="text-muted-foreground text-xs">
                            {hasJoinedQueue ? "Waiting for agent..." : "Connect to start chatting"}
                          </p>
                        </div>
                      ) : (
                        <>
                          {liveChatMessages.map((msg) => (
                            <div 
                              key={msg.id} 
                              className={cn(
                                "flex",
                                msg.isUser ? "justify-end" : "justify-start"
                              )}
                            >
                              <div className={cn(
                                "max-w-[85%] px-3 py-2 rounded-lg text-xs shadow-sm",
                                msg.isUser 
                                  ? "bg-primary text-primary-foreground rounded-br-sm" 
                                  : "bg-card border border-border text-card-foreground rounded-bl-sm"
                              )}>
                                <p>{msg.text}</p>
                                <span className="text-[9px] opacity-60 mt-1 block">
                                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))}
                          {isAgentTyping && <LiveAgentTypingIndicator withSound={true} />}
                        </>
                      )}
                    </div>
                    
                    {/* Chat Input - Compact */}
                    <div className="flex items-center gap-2 mt-auto pt-2 shrink-0">
                      <Input 
                        value={liveChatInput}
                        onChange={(e) => setLiveChatInput(e.target.value)}
                        placeholder={roomUrl ? "Type your message..." : "Join call to chat"}
                        disabled={!roomUrl}
                        className="flex-1 h-9 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && liveChatInput.trim() && roomUrl) {
                            const newMsg = {
                              id: `msg-${Date.now()}`,
                              text: liveChatInput.trim(),
                              isUser: true,
                              time: new Date()
                            };
                            setLiveChatMessages(prev => [...prev, newMsg]);
                            setLiveChatInput('');
                            
                            setTimeout(() => setIsAgentTyping(true), 500);
                            setTimeout(() => {
                              setIsAgentTyping(false);
                              const responses = [
                                "Thanks for reaching out! How can I help you today?",
                                "Got it! Let me look into that for you.",
                                "Great question - I'm happy to assist with that.",
                                "I'm here to help! Let me check on this.",
                              ];
                              setLiveChatMessages(prev => [...prev, {
                                id: `msg-${Date.now()}`,
                                text: responses[Math.floor(Math.random() * responses.length)],
                                isUser: false,
                                time: new Date()
                              }]);
                            }, 2000 + Math.random() * 1500);
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        disabled={!roomUrl || !liveChatInput.trim()}
                        className="h-9 w-9 shrink-0 bg-foreground text-background hover:bg-foreground/90"
                        onClick={() => {
                          if (liveChatInput.trim() && roomUrl) {
                            const newMsg = {
                              id: `msg-${Date.now()}`,
                              text: liveChatInput.trim(),
                              isUser: true,
                              time: new Date()
                            };
                            setLiveChatMessages(prev => [...prev, newMsg]);
                            setLiveChatInput('');
                            
                            setTimeout(() => setIsAgentTyping(true), 500);
                            setTimeout(() => {
                              setIsAgentTyping(false);
                              const responses = [
                                "Thanks for reaching out! How can I help you today?",
                                "Got it! Let me look into that for you.",
                                "Great question - I'm happy to assist with that.",
                              ];
                              setLiveChatMessages(prev => [...prev, {
                                id: `msg-${Date.now()}`,
                                text: responses[Math.floor(Math.random() * responses.length)],
                                isUser: false,
                                time: new Date()
                              }]);
                            }, 2000 + Math.random() * 1500);
                          }
                        }}
                      >
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {chatMode === 'support' && (
                  <div className="video-consult-specialist-panel live-agent-panel h-full flex flex-col">
                    {/* Contact Options Header - Compact */}
                    <div className="pb-2 border-b border-border mb-3 shrink-0">
                      <h4 className="text-foreground font-bold text-xs mb-2">Contact Support</h4>
                      <div className="flex gap-1.5">
                        <Button 
                          size="sm"
                          className="flex-1 h-7 text-[10px] bg-foreground hover:bg-foreground/90 text-background font-bold"
                          onClick={() => window.location.href = "tel:+18001234567"}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline" 
                          className="flex-1 h-7 text-[10px] border-border bg-background text-foreground hover:bg-muted font-semibold"
                          onClick={() => setShowScheduleModal(true)}
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          Schedule
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline" 
                          className="flex-1 h-7 text-[10px] border-border bg-background text-foreground hover:bg-muted font-semibold"
                          onClick={() => window.open('mailto:support@trumove.com')}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Button>
                      </div>
                    </div>
                    
                    {/* Live Chat Section */}
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="flex items-center gap-2 mb-2 shrink-0">
                        <MessageSquare className="w-3.5 h-3.5 text-primary" />
                        <span className="text-foreground/80 text-xs font-medium">Live Chat</span>
                        {roomUrl && (
                          <span className="px-1.5 py-0.5 rounded bg-green-600/20 text-green-600 dark:text-green-400 text-[9px] font-bold">
                            LIVE
                          </span>
                        )}
                      </div>
                      
                      {/* Messages Area - Flexible */}
                      <div className="flex-1 overflow-y-auto space-y-2 mb-2 min-h-0 bg-muted/30 border border-border rounded-lg p-2">
                        {!roomUrl ? (
                          <p className="text-muted-foreground text-xs text-center py-3">
                            Join a video call to chat live
                          </p>
                        ) : liveChatMessages.length === 0 ? (
                          <p className="text-muted-foreground text-xs text-center py-3">
                            Send a message to start chatting
                          </p>
                        ) : (
                          liveChatMessages.map((msg) => (
                            <div 
                              key={msg.id} 
                              className={cn(
                                "flex",
                                msg.isUser ? "justify-end" : "justify-start"
                              )}
                            >
                              <div className={cn(
                                "max-w-[80%] px-2 py-1.5 rounded-lg text-xs",
                                msg.isUser 
                                  ? "bg-primary text-primary-foreground rounded-br-sm" 
                                  : "bg-muted text-foreground rounded-bl-sm"
                              )}>
                                <p>{msg.text}</p>
                                <span className="text-[9px] opacity-60 mt-0.5 block">
                                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                        {/* Typing Indicator */}
                        {isAgentTyping && <ChatTypingIndicator />}
                      </div>
                      
                      {/* Chat Input - Compact */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Input 
                          value={liveChatInput}
                          onChange={(e) => setLiveChatInput(e.target.value)}
                          placeholder={roomUrl ? "Type a message..." : "Join call to chat"}
                          disabled={!roomUrl}
                          className="flex-1 h-8 text-xs disabled:opacity-50"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && liveChatInput.trim() && roomUrl) {
                              const newMsg = {
                                id: `msg-${Date.now()}`,
                                text: liveChatInput.trim(),
                                isUser: true,
                                time: new Date()
                              };
                              setLiveChatMessages(prev => [...prev, newMsg]);
                              setLiveChatInput('');
                              
                              // Show typing indicator after 500ms
                              setTimeout(() => {
                                setIsAgentTyping(true);
                              }, 500);
                              
                              // Hide typing and show response after 1.5-2.5 seconds
                              setTimeout(() => {
                                setIsAgentTyping(false);
                                const agentResponses = [
                                  "Thanks for your message! I'm reviewing your inventory now.",
                                  "Got it! Let me check on that for you.",
                                  "Great question! Based on what I see, I can help with that.",
                                  "I'm here to help! Let me look into this.",
                                ];
                                const response = agentResponses[Math.floor(Math.random() * agentResponses.length)];
                                setLiveChatMessages(prev => [...prev, {
                                  id: `msg-${Date.now()}`,
                                  text: response,
                                  isUser: false,
                                  time: new Date()
                                }]);
                              }, 2000 + Math.random() * 500);
                            }
                          }}
                        />
                        <Button 
                          size="icon"
                          disabled={!roomUrl || !liveChatInput.trim()}
                          className="h-8 w-8 bg-primary hover:bg-primary/90 disabled:opacity-50"
                          onClick={() => {
                            if (liveChatInput.trim() && roomUrl) {
                              const newMsg = {
                                id: `msg-${Date.now()}`,
                                text: liveChatInput.trim(),
                                isUser: true,
                                time: new Date()
                              };
                              setLiveChatMessages(prev => [...prev, newMsg]);
                              setLiveChatInput('');
                              
                              // Show typing indicator after 500ms
                              setTimeout(() => {
                                setIsAgentTyping(true);
                              }, 500);
                              
                              // Hide typing and show response after 1.5-2.5 seconds
                              setTimeout(() => {
                                setIsAgentTyping(false);
                                const agentResponses = [
                                  "Thanks for your message! I'm reviewing your inventory now.",
                                  "Got it! Let me check on that for you.",
                                  "Great question! Based on what I see, I can help with that.",
                                  "I'm here to help! Let me look into this.",
                                ];
                                const response = agentResponses[Math.floor(Math.random() * agentResponses.length)];
                                setLiveChatMessages(prev => [...prev, {
                                  id: `msg-${Date.now()}`,
                                  text: response,
                                  isUser: false,
                                  time: new Date()
                                }]);
                              }, 2000 + Math.random() * 500);
                            }
                          }}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Controls - Light themed card */}
          <div className="video-consult-booking-controls animate-fade-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
            {/* Header with decorative lines */}
            <div className="flex items-center gap-3 w-full mb-4">
              <div className="flex-1 h-px bg-border" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground px-2">
                Virtual Video Controls
              </h3>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            {/* Top Row: All Control Buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-center mb-4">
              {/* Screen Share */}
              <Button 
                variant="outline" 
                className={cn(
                  "h-10 px-3 border border-border bg-background hover:bg-muted",
                  isScreenSharing && "border-foreground/50 bg-foreground/10"
                )}
                onClick={handleScreenShare}
              >
                <Monitor className="w-4 h-4 mr-1.5" />
                {isScreenSharing ? "Stop Share" : "Share Screen"}
              </Button>
              
              
              {/* Schedule Time */}
              <Button 
                variant="outline"
                className="h-10 px-3 border border-border bg-background hover:bg-muted"
                onClick={() => setShowScheduleModal(true)}
              >
                <CalendarDays className="w-4 h-4 mr-1.5" />
                Schedule
              </Button>
              
              {/* Trudy AI Service - Opens global chat */}
              <Button 
                variant="outline"
                className="h-10 px-3 border border-border bg-background hover:bg-muted"
                onClick={() => window.dispatchEvent(new CustomEvent('openTrudyChat'))}
              >
                <Bot className="w-4 h-4 mr-1.5" />
                Trudy AI
              </Button>
              
              {/* Virtual Whiteboard */}
              <Button 
                variant="outline"
                className="h-10 px-3 border border-border bg-background hover:bg-muted"
                onClick={() => setShowWhiteboardModal(true)}
              >
                <PenTool className="w-4 h-4 mr-1.5" />
                Whiteboard
              </Button>
              
              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-10 w-10 border border-border bg-background hover:bg-muted"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <DropdownMenuLabel>Video Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    Quality: Auto ✓
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Quality: High
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Quality: Medium
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuItem className="cursor-pointer">
                    Sound Alerts: On ✓
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Divider */}
            <div className="w-full border-t border-border mb-4" />
            
            {/* Bottom Section: Booking Input + Actions */}
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value)}
                  placeholder="Booking Code or Shipment ID"
                  className="flex-1 h-8 text-xs bg-background border border-border placeholder:text-muted-foreground/60"
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                />
                <Button 
                  onClick={handleJoinRoom} 
                  disabled={!bookingCode.trim()}
                  className="h-8 px-2.5 text-xs bg-foreground text-background hover:bg-foreground/90 font-semibold"
                >
                  <Video className="w-3 h-3 mr-1" />
                  Join
                </Button>
                <Button 
                  variant="outline"
                  className="h-8 px-2.5 text-xs border border-border bg-background hover:bg-muted font-semibold"
                  onClick={() => window.location.href = "tel:+16097277647"}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Schedule Time Modal with Contact Form */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule a Call with Your Agent</DialogTitle>
          </DialogHeader>
          <BookingCalendar 
            onSelect={(date, time) => {
              // Validate ALL required fields
              if (!date || !time) {
                toast.error("Please select both a date and time");
                return;
              }
              if (!scheduleName.trim()) {
                toast.error("Please enter your name");
                return;
              }
              if (!schedulePhone.trim()) {
                toast.error("Please enter your phone number");
                return;
              }
              if (!scheduleEmail.trim()) {
                toast.error("Please enter your email address");
                return;
              }
              if (!scheduleTcpaConsent) {
                toast.error("Please consent to be contacted to continue");
                return;
              }
              
              // All fields valid - submit
              toast.success(`Scheduled for ${time} on ${date.toLocaleDateString()}`);
              // Reset form
              setScheduleName("");
              setSchedulePhone("");
              setScheduleEmail("");
              setScheduleTcpaConsent(false);
              setShowScheduleModal(false);
            }} 
          />
          
          {/* Contact Information Fields */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="schedule-name" className="text-xs">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="schedule-name"
                  value={scheduleName}
                  onChange={(e) => setScheduleName(e.target.value)}
                  placeholder="Your name"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="schedule-phone" className="text-xs">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="schedule-phone"
                  value={schedulePhone}
                  onChange={(e) => setSchedulePhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="h-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="schedule-email" className="text-xs">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="schedule-email"
                type="email"
                value={scheduleEmail}
                onChange={(e) => setScheduleEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-9"
              />
            </div>
            
            {/* TCPA Consent */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="tcpa-consent"
                checked={scheduleTcpaConsent}
                onCheckedChange={(checked) => setScheduleTcpaConsent(checked === true)}
                className="mt-0.5"
              />
              <Label htmlFor="tcpa-consent" className="text-[11px] text-muted-foreground leading-tight cursor-pointer">
                I consent to receive calls and texts at the phone number provided, including by autodialer. 
                Consent is not a condition of purchase. Message and data rates may apply. <span className="text-destructive">*</span>
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Whiteboard Modal */}
      <Dialog open={showWhiteboardModal} onOpenChange={setShowWhiteboardModal}>
        <DialogContent className="sm:max-w-4xl h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Virtual Whiteboard</DialogTitle>
              <span className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 mr-8">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
            </div>
          </DialogHeader>
          <WhiteboardCanvas />
        </DialogContent>
      </Dialog>
      
      {/* Expanded Video Modal - Custom Draggable/Resizable Window */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div 
            className={cn(
              "relative rounded-xl overflow-hidden shadow-2xl border border-border bg-card",
              (isExpandedDragging || isExpandedResizing) && "select-none"
            )}
            style={{
              width: expandedVideoSize.width,
              height: expandedVideoSize.height,
              transform: `translate(${expandedVideoPosition.x}px, ${expandedVideoPosition.y}px)`
            }}
          >
            {/* Draggable header */}
            <div 
              className="h-10 bg-muted flex items-center justify-between px-4 cursor-grab active:cursor-grabbing border-b border-border"
              onMouseDown={handleExpandedDragStart}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive cursor-pointer hover:opacity-80" onClick={() => setIsFullscreen(false)} />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer hover:opacity-80" onClick={() => setExpandedVideoSize({ width: 640, height: 400 })} />
                  <div className="w-3 h-3 rounded-full bg-green-500 cursor-pointer hover:opacity-80" onClick={() => setExpandedVideoSize({ width: 1200, height: 750 })} />
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-foreground" />
                  <span className="text-sm font-semibold text-foreground select-none">Video Consultation</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-red-600 text-white text-[10px] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setIsFullscreen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Video content */}
            <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center" style={{ height: expandedVideoSize.height - 40 }}>
              {roomUrl ? (
                isDemo ? (
                  <DemoVideoPlaceholder onLeave={() => { handleLeaveRoom(); setIsFullscreen(false); }} />
                ) : (
                  <DailyVideoRoom 
                    roomUrl={roomUrl}
                    userName="Guest"
                    onLeave={() => { handleLeaveRoom(); setIsFullscreen(false); }}
                    className="w-full h-full"
                  />
                )
              ) : (
                <div className="text-center p-8">
                  <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12 text-white/30" />
                  </div>
                  <h3 className="text-xl font-bold text-white/90 mb-2">
                    No Active Session
                  </h3>
                  <p className="text-white/50 text-sm mb-6">
                    Close this window and join a session first.
                  </p>
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
            
            {/* Resize handle - bottom right */}
            <div 
              className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize group"
              onMouseDown={handleExpandedResizeStart}
            >
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors" />
            </div>
          </div>
        </div>
      )}
      
      {/* Callback Request Modal */}
      <Dialog open={showCallbackModal} onOpenChange={setShowCallbackModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-primary" />
              Request a Callback
            </DialogTitle>
          </DialogHeader>
          
          {callbackSubmitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Callback Requested!</h3>
              <p className="text-muted-foreground text-sm mb-4">
                An agent will call you at <span className="font-semibold">{callbackPhone}</span> within 5 minutes.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCallbackModal(false);
                  setCallbackSubmitted(false);
                  setCallbackPhone('');
                }}
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Skip the queue! Enter your phone number and an agent will call you back shortly.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="callback-phone">Phone Number</Label>
                <Input
                  id="callback-phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={callbackPhone}
                  onChange={(e) => setCallbackPhone(e.target.value)}
                  className="h-11"
                />
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="ghost" onClick={() => setShowCallbackModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (callbackPhone.trim().length >= 10) {
                      setCallbackSubmitted(true);
                      toast.success("Callback requested! An agent will call you shortly.");
                    } else {
                      toast.error("Please enter a valid phone number");
                    }
                  }}
                  disabled={!callbackPhone.trim()}
                >
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Request Callback
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Picture-in-Picture Floating Video - Draggable & Resizable */}
      {isPiP && roomUrl && (
        <div 
          ref={pipRef}
          className={cn(
            "fixed z-50 rounded-xl overflow-hidden shadow-2xl border-2 border-primary/30 bg-card ring-1 ring-white/10",
            !isDragging && !isResizing && "animate-in slide-in-from-right-4 duration-300",
            (isDragging || isResizing) && "select-none"
          )}
          style={{
            right: Math.max(24, pipPosition.x),
            bottom: Math.max(96, pipPosition.y),
            width: pipSize.width,
          }}
        >
          {/* Draggable header */}
          <div 
            className="h-7 bg-muted flex items-center justify-between px-2.5 cursor-grab active:cursor-grabbing border-b border-border"
            onMouseDown={handlePipMouseDown}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground font-medium select-none">Video Call</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setIsPiP(false); toggleFullscreen(); }}
                className="w-5 h-5 rounded flex items-center justify-center hover:bg-accent transition-colors"
                title="Expand"
              >
                <Maximize2 className="w-3 h-3 text-muted-foreground" />
              </button>
              <button
                onClick={() => { setIsPiP(false); setPipPosition({ x: 0, y: 0 }); setPipSize({ width: 320, height: 200 }); }}
                className="w-5 h-5 rounded flex items-center justify-center hover:bg-accent transition-colors"
                title="Close"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          </div>
          
          <div className="relative" style={{ height: pipSize.height }}>
            {isDemo ? (
              <DemoVideoPlaceholder onLeave={() => { handleLeaveRoom(); setIsPiP(false); }} isPiP />
            ) : (
              <DailyVideoRoom 
                roomUrl={roomUrl}
                userName="Guest"
                onLeave={() => { handleLeaveRoom(); setIsPiP(false); }}
                className="w-full h-full"
              />
            )}
          </div>
          
          {/* Resize handles - all four corners */}
          <div 
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize group z-10"
            onMouseDown={(e) => handlePipResizeStart(e, 'tl')}
          >
            <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors" />
          </div>
          <div 
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize group z-10"
            onMouseDown={(e) => handlePipResizeStart(e, 'tr')}
          >
            <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors" />
          </div>
          <div 
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize group z-10"
            onMouseDown={(e) => handlePipResizeStart(e, 'bl')}
          >
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors" />
          </div>
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group z-10"
            onMouseDown={(e) => handlePipResizeStart(e, 'br')}
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors" />
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
