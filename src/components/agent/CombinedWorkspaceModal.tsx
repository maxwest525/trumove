import { useState } from "react";
import DraggableModal from "@/components/ui/DraggableModal";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, Phone, Maximize2, Minimize2, 
  PanelLeftClose, PanelRightClose, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Import the demo visual components - we'll need to extract them
import { useState as useStateImport, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Calendar, MessageSquare, 
  FileText, Mail, Video, Headphones, Clock, 
  CheckCircle2, TrendingUp,
  PhoneIncoming, PhoneOutgoing, Voicemail,
  DollarSign, Truck, MapPin, Bell,
  Plus, Activity, Sparkles,
  Package, Shield
} from "lucide-react";

interface CombinedWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Inline the demo data and components for self-contained functionality
const GRANOT_DEMO_STATS = [
  { label: "Open Jobs", value: "47", change: "+12%", icon: Package },
  { label: "In Transit", value: "12", change: "+3", icon: Truck },
  { label: "Pending A/R", value: "$142K", change: "-8%", icon: DollarSign },
  { label: "This Month", value: "$89K", change: "+18%", icon: TrendingUp },
];

const GRANOT_DEMO_LEADS = [
  { name: "Sarah Johnson", status: "Hot", value: "$4,200", move: "NYC → Miami", phone: "(555) 123-4567" },
  { name: "Michael Chen", status: "Warm", value: "$2,800", move: "LA → Seattle", phone: "(555) 234-5678" },
  { name: "Emily Rodriguez", status: "New", value: "$3,500", move: "Chicago → Denver", phone: "(555) 345-6789" },
  { name: "David Kim", status: "Hot", value: "$5,100", move: "Boston → Austin", phone: "(555) 456-7890" },
];

const RINGCENTRAL_DEMO_CALLS = [
  { type: "incoming", name: "Sarah Johnson", duration: "4:32", time: "2 min ago", status: "answered" },
  { type: "outgoing", name: "Michael Chen", duration: "2:15", time: "15 min ago", status: "completed" },
  { type: "missed", name: "Unknown", duration: "-", time: "32 min ago", status: "missed" },
  { type: "voicemail", name: "Emily Rodriguez", duration: "0:45", time: "1 hr ago", status: "voicemail" },
];

const RINGCENTRAL_DEMO_STATS = [
  { label: "Total Calls", value: "847", sub: "This week" },
  { label: "Active Users", value: "24", sub: "Online now" },
  { label: "Avg Handle", value: "4:12", sub: "Per call" },
  { label: "SLA Met", value: "94.2%", sub: "Target: 90%" },
];

// Compact Granot Panel
function GranotPanel({ isLive }: { isLive: boolean }) {
  const [selectedLead, setSelectedLead] = useState<number | null>(null);

  return (
    <div className="h-full flex flex-col" style={{ background: "#FFFFFF" }}>
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between shrink-0" style={{ background: "linear-gradient(90deg, #1B365D 0%, #2E4A7D 100%)" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "#4CAF50" }}>
            <BarChart3 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white text-sm">Granot CRM</span>
          {isLive && (
            <Badge className="text-[9px] h-4 bg-green-500/20 text-green-300">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse mr-1" />
              Live
            </Badge>
          )}
        </div>
        <Bell className="w-3.5 h-3.5 text-white/70" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-1 p-2 shrink-0" style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        {GRANOT_DEMO_STATS.map((stat) => (
          <div key={stat.label} className="p-1.5 rounded text-center" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <div className="text-sm font-bold" style={{ color: "#1B365D" }}>{stat.value}</div>
            <div className="text-[8px] text-gray-500 uppercase">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Leads List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-1.5 flex items-center justify-between" style={{ background: "#1B365D" }}>
          <span className="text-[10px] font-semibold text-white">Active Jobs</span>
          <Plus className="w-3 h-3 text-white/70" />
        </div>
        <div className="divide-y" style={{ borderColor: "#E2E8F0" }}>
          {GRANOT_DEMO_LEADS.map((lead, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedLead(selectedLead === i ? null : i)}
              className="px-2 py-2 cursor-pointer transition-colors hover:bg-gray-50"
              style={{ background: selectedLead === i ? "#F0FDF4" : "transparent" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#E8F5E9" }}>
                  <Users className="w-3 h-3" style={{ color: "#4CAF50" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[11px] text-gray-900 truncate">{lead.name}</div>
                  <div className="text-[9px] text-gray-500 truncate">{lead.move}</div>
                </div>
                <Badge 
                  className="text-[8px] h-4"
                  style={{ 
                    background: lead.status === "Hot" ? "#EF4444" : lead.status === "Warm" ? "#F59E0B" : "#6B7280",
                    color: "white"
                  }}
                >
                  {lead.value}
                </Badge>
              </div>
              {selectedLead === i && (
                <div className="mt-1.5 pt-1.5 flex gap-1" style={{ borderTop: "1px solid #E2E8F0" }}>
                  <button className="flex-1 py-1 rounded text-[9px] font-medium text-white flex items-center justify-center gap-1" style={{ background: "#4CAF50" }}>
                    <Phone className="w-3 h-3" />
                    Call
                  </button>
                  <button className="flex-1 py-1 rounded text-[9px] font-medium flex items-center justify-center gap-1" style={{ background: "#E2E8F0", color: "#1B365D" }}>
                    <Mail className="w-3 h-3" />
                    Email
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Compact RingCentral Panel
function RingCentralPanel({ isLive }: { isLive: boolean }) {
  const [selectedCall, setSelectedCall] = useState<number | null>(null);

  const getCallIcon = (type: string) => {
    switch(type) {
      case 'incoming': return PhoneIncoming;
      case 'outgoing': return PhoneOutgoing;
      case 'voicemail': return Voicemail;
      default: return Phone;
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "#FFFFFF" }}>
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between shrink-0" style={{ background: "linear-gradient(90deg, #0684BC 0%, #0073AE 100%)" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "#FF6A00" }}>
            <Phone className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white text-sm">RingCentral</span>
          {isLive && (
            <Badge className="text-[9px] h-4 bg-orange-500/20 text-orange-200">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse mr-1" />
              Active
            </Badge>
          )}
        </div>
        <Headphones className="w-3.5 h-3.5 text-white/70" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-1 p-2 shrink-0" style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        {RINGCENTRAL_DEMO_STATS.map((stat) => (
          <div key={stat.label} className="p-1.5 rounded text-center" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <div className="text-sm font-bold" style={{ color: "#0684BC" }}>{stat.value}</div>
            <div className="text-[8px] text-gray-500 uppercase">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Call Log */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-1.5 flex items-center justify-between" style={{ background: "#0684BC" }}>
          <span className="text-[10px] font-semibold text-white">Recent Calls</span>
          <RefreshCw className={cn("w-3 h-3 text-white/70", isLive && "animate-spin")} />
        </div>
        <div className="divide-y" style={{ borderColor: "#E2E8F0" }}>
          {RINGCENTRAL_DEMO_CALLS.map((call, i) => {
            const CallIcon = getCallIcon(call.type);
            return (
              <div 
                key={i} 
                onClick={() => setSelectedCall(selectedCall === i ? null : i)}
                className="px-2 py-2 cursor-pointer transition-colors hover:bg-gray-50"
                style={{ background: selectedCall === i ? "#EFF6FF" : "transparent" }}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                    call.status === "missed" ? "bg-red-100" : "bg-blue-100"
                  )}>
                    <CallIcon className={cn(
                      "w-3 h-3",
                      call.status === "missed" ? "text-red-500" : "text-blue-500"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[11px] text-gray-900 truncate">{call.name}</div>
                    <div className="text-[9px] text-gray-500">{call.time} · {call.duration}</div>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={cn(
                      "text-[8px] h-4",
                      call.status === "missed" && "bg-red-100 text-red-600"
                    )}
                  >
                    {call.status}
                  </Badge>
                </div>
                {selectedCall === i && (
                  <div className="mt-1.5 pt-1.5 flex gap-1" style={{ borderTop: "1px solid #E2E8F0" }}>
                    <button className="flex-1 py-1 rounded text-[9px] font-medium text-white flex items-center justify-center gap-1" style={{ background: "#FF6A00" }}>
                      <Phone className="w-3 h-3" />
                      Call Back
                    </button>
                    <button className="flex-1 py-1 rounded text-[9px] font-medium flex items-center justify-center gap-1" style={{ background: "#E2E8F0", color: "#0684BC" }}>
                      <MessageSquare className="w-3 h-3" />
                      SMS
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dial Pad Quick Access */}
      <div className="p-2 shrink-0" style={{ borderTop: "1px solid #E2E8F0", background: "#F8FAFC" }}>
        <Button 
          className="w-full h-8 text-xs gap-2 text-white"
          style={{ background: "#FF6A00" }}
        >
          <Phone className="w-3.5 h-3.5" />
          New Call
        </Button>
      </div>
    </div>
  );
}

export function CombinedWorkspaceModal({ open, onOpenChange }: CombinedWorkspaceModalProps) {
  const [isLive, setIsLive] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const handleToggleLive = () => {
    setIsLive(!isLive);
    toast.success(isLive ? "Demo mode enabled" : "Live mode enabled", {
      description: isLive ? "Showing static data" : "Showing real-time updates"
    });
  };

  return (
    <DraggableModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      storageKey="tm_combined_workspace"
      defaultWidth={900}
      defaultHeight={550}
      minWidth={600}
      minHeight={400}
      headerStyle={{ background: "linear-gradient(135deg, #1B365D 0%, #0684BC 100%)" }}
      title={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "#4CAF50" }}>
              <BarChart3 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white/50">+</span>
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "#FF6A00" }}>
              <Phone className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <span className="font-bold text-white">Agent Workspace</span>
          <Badge className="text-[9px] bg-white/20 text-white">Split View</Badge>
        </div>
      }
      footer={
        <div className="flex items-center justify-between p-2 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLeftCollapsed(!leftCollapsed)}
              className={cn(
                "px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors",
                leftCollapsed ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
              )}
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
              CRM
            </button>
            <button
              onClick={() => setRightCollapsed(!rightCollapsed)}
              className={cn(
                "px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors",
                rightCollapsed ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
              )}
            >
              <PanelRightClose className="w-3.5 h-3.5" />
              Dialer
            </button>
          </div>
          <button
            onClick={handleToggleLive}
            className={cn(
              "px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all",
              isLive ? "bg-green-500 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <Sparkles className="w-3 h-3" />
            {isLive ? "Live" : "Demo"}
          </button>
        </div>
      }
    >
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {!leftCollapsed && (
          <>
            <ResizablePanel defaultSize={50} minSize={30}>
              <GranotPanel isLive={isLive} />
            </ResizablePanel>
            {!rightCollapsed && <ResizableHandle withHandle />}
          </>
        )}
        
        {!rightCollapsed && (
          <ResizablePanel defaultSize={leftCollapsed ? 100 : 50} minSize={30}>
            <RingCentralPanel isLive={isLive} />
          </ResizablePanel>
        )}

        {leftCollapsed && rightCollapsed && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">Both panels are hidden. Click the panel icons to show them.</p>
          </div>
        )}
      </ResizablePanelGroup>
    </DraggableModal>
  );
}
