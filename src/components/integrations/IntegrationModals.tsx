import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, Phone, Calendar, MessageSquare, BarChart3, 
  FileText, Mail, Video, Headphones, Clock, 
  CheckCircle2, ArrowRight, ExternalLink, TrendingUp,
  PhoneIncoming, PhoneOutgoing, Voicemail,
  UserPlus, DollarSign, Truck, MapPin, Bell,
  Filter, MoreHorizontal, Plus,
  Activity, Target, RefreshCw
} from "lucide-react";

interface IntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: "granot" | "ringcentral";
}

const GRANOT_FEATURES = [
  { icon: Users, title: "Contact Management", desc: "Full customer profiles with move history" },
  { icon: Calendar, title: "Move Scheduling", desc: "Drag-and-drop calendar with crew assignments" },
  { icon: FileText, title: "Quote Generation", desc: "Automated estimates from inventory data" },
  { icon: BarChart3, title: "Pipeline Analytics", desc: "Track leads from inquiry to booking" },
  { icon: Mail, title: "Email Campaigns", desc: "Automated follow-ups and promotions" },
  { icon: CheckCircle2, title: "Task Automation", desc: "Workflow triggers and reminders" },
];

const RINGCENTRAL_FEATURES = [
  { icon: Phone, title: "Cloud Phone System", desc: "VoIP calling with call recording" },
  { icon: Video, title: "Video Meetings", desc: "HD video consults with screen share" },
  { icon: MessageSquare, title: "Team Messaging", desc: "Real-time chat with file sharing" },
  { icon: Headphones, title: "Contact Center", desc: "IVR, queues, and call routing" },
  { icon: Clock, title: "Call Analytics", desc: "Track response times and volumes" },
  { icon: CheckCircle2, title: "CRM Integration", desc: "Sync calls with Granot CRM" },
];

const GRANOT_DEMO_LEADS = [
  { name: "Sarah Johnson", status: "Hot", value: "$4,200", move: "NYC → Miami", phone: "(555) 123-4567", email: "sarah.j@email.com" },
  { name: "Michael Chen", status: "Warm", value: "$2,800", move: "LA → Seattle", phone: "(555) 234-5678", email: "m.chen@email.com" },
  { name: "Emily Rodriguez", status: "New", value: "$3,500", move: "Chicago → Denver", phone: "(555) 345-6789", email: "emily.r@email.com" },
  { name: "David Kim", status: "Hot", value: "$5,100", move: "Boston → Austin", phone: "(555) 456-7890", email: "d.kim@email.com" },
];

const GRANOT_DEMO_STATS = [
  { label: "Active Leads", value: "47", change: "+12%", icon: Users },
  { label: "Booked This Month", value: "23", change: "+8%", icon: CheckCircle2 },
  { label: "Revenue Pipeline", value: "$142K", change: "+18%", icon: DollarSign },
  { label: "Conversion Rate", value: "34%", change: "+5%", icon: Target },
];

const GRANOT_RECENT_ACTIVITY = [
  { type: "call", text: "Called Sarah Johnson", time: "2 min ago", icon: Phone },
  { type: "email", text: "Sent estimate to Michael Chen", time: "15 min ago", icon: Mail },
  { type: "booking", text: "New booking: David Kim", time: "1 hr ago", icon: CheckCircle2 },
  { type: "lead", text: "New lead: Emily Rodriguez", time: "2 hrs ago", icon: UserPlus },
  { type: "task", text: "Follow-up reminder: James Wilson", time: "3 hrs ago", icon: Bell },
];

const GRANOT_UPCOMING_MOVES = [
  { customer: "Robert Taylor", from: "Phoenix, AZ", to: "Portland, OR", date: "Feb 10", crew: "Team Alpha", status: "Confirmed" },
  { customer: "Lisa Wang", from: "Denver, CO", to: "San Diego, CA", date: "Feb 11", crew: "Team Beta", status: "In Progress" },
  { customer: "David Kim", from: "Boston, MA", to: "Austin, TX", date: "Feb 12", crew: "Team Gamma", status: "Pending" },
];

const GRANOT_PIPELINE_STAGES = [
  { stage: "New Leads", count: 12, value: "$38K", color: "#3B82F6" },
  { stage: "Contacted", count: 18, value: "$52K", color: "#FBBF24" },
  { stage: "Quoted", count: 9, value: "$31K", color: "#F97316" },
  { stage: "Negotiating", count: 5, value: "$16K", color: "#8B5CF6" },
  { stage: "Won", count: 23, value: "$89K", color: "#4CAF50" },
];

const RINGCENTRAL_DEMO_CALLS = [
  { type: "incoming", name: "Sarah Johnson", duration: "4:32", time: "2 min ago", status: "answered" },
  { type: "outgoing", name: "Michael Chen", duration: "2:15", time: "15 min ago", status: "completed" },
  { type: "missed", name: "Unknown", duration: "-", time: "32 min ago", status: "missed" },
  { type: "voicemail", name: "Emily Rodriguez", duration: "0:45", time: "1 hr ago", status: "voicemail" },
];

const RINGCENTRAL_DEMO_STATS = [
  { label: "Calls Today", value: "34" },
  { label: "Avg Duration", value: "3:42" },
  { label: "Answer Rate", value: "92%" },
  { label: "Queue Wait", value: "0:18" },
];

// ============ GRANOT CRM DEMO ============
function GranotDemoVisual() {
  const [activeView, setActiveView] = useState<"dashboard" | "pipeline" | "calendar" | "activity">("dashboard");
  const [selectedLead, setSelectedLead] = useState<number | null>(null);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "2px solid #1B365D", background: "#FFFFFF" }}>
      {/* Granot Header - Navy/Green branding */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: "linear-gradient(90deg, #1B365D 0%, #2E4A7D 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#4CAF50" }}>
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Granot</span>
          <Badge className="text-[10px]" style={{ background: "#4CAF50", color: "white" }}>CRM</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors relative">
            <Bell className="w-4 h-4 text-white/80" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: "#4CAF50" }} />
          </button>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: "#4CAF50", color: "white" }}>JD</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 px-3 py-2" style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        {[
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
          { id: "pipeline", label: "Pipeline", icon: Target },
          { id: "calendar", label: "Schedule", icon: Calendar },
          { id: "activity", label: "Activity", icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as typeof activeView)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: activeView === tab.id ? "#1B365D" : "transparent",
              color: activeView === tab.id ? "white" : "#64748B",
            }}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-4 max-h-[350px] overflow-y-auto" style={{ background: "#FFFFFF" }}>
        {/* Dashboard View */}
        {activeView === "dashboard" && (
          <div className="space-y-3">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-2">
              {GRANOT_DEMO_STATS.map((stat) => (
                <div key={stat.label} className="p-3 rounded-lg hover:shadow-md transition-all cursor-pointer" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <div className="flex items-center justify-between mb-1">
                    <stat.icon className="w-4 h-4" style={{ color: "#1B365D" }} />
                    <span className="text-[10px] font-medium" style={{ color: "#4CAF50" }}>{stat.change}</span>
                  </div>
                  <div className="text-xl font-bold" style={{ color: "#1B365D" }}>{stat.value}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-3">
              {/* Hot Leads */}
              <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
                <div className="px-3 py-2 flex items-center justify-between" style={{ background: "#1B365D" }}>
                  <span className="text-xs font-semibold text-white">Hot Leads</span>
                  <Plus className="w-3 h-3 text-white/70" />
                </div>
                <div className="divide-y" style={{ borderColor: "#E2E8F0" }}>
                  {GRANOT_DEMO_LEADS.map((lead, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedLead(selectedLead === i ? null : i)}
                      className="px-3 py-2 cursor-pointer transition-colors hover:bg-gray-50"
                      style={{ background: selectedLead === i ? "#F0FDF4" : "transparent" }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#E8F5E9" }}>
                          <Users className="w-3.5 h-3.5" style={{ color: "#4CAF50" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs text-gray-900 truncate">{lead.name}</div>
                          <div className="text-[10px] text-gray-500 truncate">{lead.move}</div>
                        </div>
                        <Badge 
                          className="text-[9px]"
                          style={{ 
                            background: lead.status === "Hot" ? "#EF4444" : lead.status === "Warm" ? "#F59E0B" : "#6B7280",
                            color: "white"
                          }}
                        >
                          {lead.value}
                        </Badge>
                      </div>
                      {selectedLead === i && (
                        <div className="mt-2 pt-2 space-y-1" style={{ borderTop: "1px solid #E2E8F0" }}>
                          <div className="flex items-center gap-2 text-[10px] text-gray-600">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-600">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                          <div className="flex gap-1 mt-2">
                            <button className="flex-1 py-1 rounded text-[10px] font-medium text-white" style={{ background: "#4CAF50" }}>
                              Call
                            </button>
                            <button className="flex-1 py-1 rounded text-[10px] font-medium" style={{ background: "#E2E8F0", color: "#1B365D" }}>
                              Email
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
                <div className="px-3 py-2 flex items-center justify-between" style={{ background: "#1B365D" }}>
                  <span className="text-xs font-semibold text-white">Recent Activity</span>
                  <RefreshCw className="w-3 h-3 text-white/70" />
                </div>
                <div className="divide-y" style={{ borderColor: "#E2E8F0" }}>
                  {GRANOT_RECENT_ACTIVITY.slice(0, 4).map((item, i) => (
                    <div key={i} className="px-3 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ 
                        background: item.type === "booking" ? "#E8F5E9" : item.type === "lead" ? "#E3F2FD" : "#F5F5F5"
                      }}>
                        <item.icon className="w-3 h-3" style={{ 
                          color: item.type === "booking" ? "#4CAF50" : item.type === "lead" ? "#2196F3" : "#757575"
                        }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-900 truncate">{item.text}</div>
                        <div className="text-[10px] text-gray-500">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="rounded-lg p-3" style={{ border: "1px solid #E2E8F0" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-700">Weekly Performance</span>
                <TrendingUp className="w-4 h-4" style={{ color: "#4CAF50" }} />
              </div>
              <div className="flex items-end gap-1 h-16">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full rounded-t transition-all hover:opacity-80"
                      style={{ height: `${h}%`, background: "linear-gradient(180deg, #4CAF50 0%, #1B365D 100%)" }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-gray-500">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
        )}

        {/* Pipeline View */}
        {activeView === "pipeline" && (
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
              <div className="px-3 py-2" style={{ background: "#1B365D" }}>
                <span className="text-xs font-semibold text-white">Sales Funnel</span>
              </div>
              <div className="p-3 space-y-2">
                {GRANOT_PIPELINE_STAGES.map((stage, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-20 text-xs text-gray-600 truncate">{stage.stage}</div>
                    <div className="flex-1 h-6 rounded-full overflow-hidden relative" style={{ background: "#F1F5F9" }}>
                      <div 
                        className="h-full transition-all"
                        style={{ width: `${(stage.count / 23) * 100}%`, background: stage.color }}
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-2">
                        <span className="text-[10px] font-medium text-gray-700">{stage.count}</span>
                        <span className="text-[10px] font-medium text-gray-700">{stage.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {GRANOT_PIPELINE_STAGES.map((stage, i) => (
                <div key={i} className="rounded-lg p-2 text-center" style={{ border: "1px solid #E2E8F0" }}>
                  <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: stage.color }} />
                  <div className="text-lg font-bold" style={{ color: "#1B365D" }}>{stage.count}</div>
                  <div className="text-[9px] text-gray-500 truncate">{stage.stage}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar View */}
        {activeView === "calendar" && (
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
              <div className="px-3 py-2" style={{ background: "#1B365D" }}>
                <span className="text-xs font-semibold text-white">Upcoming Moves</span>
              </div>
              <div className="divide-y" style={{ borderColor: "#E2E8F0" }}>
                {GRANOT_UPCOMING_MOVES.map((move, i) => (
                  <div key={i} className="px-3 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#E8F5E9" }}>
                          <Truck className="w-4 h-4" style={{ color: "#4CAF50" }} />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{move.customer}</div>
                          <div className="text-[10px] text-gray-500">{move.crew}</div>
                        </div>
                      </div>
                      <Badge 
                        className="text-[9px]"
                        style={{ 
                          background: move.status === "Confirmed" ? "#E8F5E9" : move.status === "In Progress" ? "#FFF8E1" : "#F5F5F5",
                          color: move.status === "Confirmed" ? "#4CAF50" : move.status === "In Progress" ? "#F59E0B" : "#757575"
                        }}
                      >
                        {move.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{move.from}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>{move.to}</span>
                      <span className="ml-auto font-medium" style={{ color: "#1B365D" }}>{move.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity View */}
        {activeView === "activity" && (
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
            <div className="px-3 py-2 flex items-center justify-between" style={{ background: "#1B365D" }}>
              <span className="text-xs font-semibold text-white">Activity Log</span>
              <Filter className="w-3 h-3 text-white/70" />
            </div>
            <ScrollArea className="h-[280px]">
              <div className="divide-y" style={{ borderColor: "#E2E8F0" }}>
                {[...GRANOT_RECENT_ACTIVITY, ...GRANOT_RECENT_ACTIVITY].map((item, i) => (
                  <div key={i} className="px-3 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ 
                      background: item.type === "booking" ? "#E8F5E9" : item.type === "lead" ? "#E3F2FD" : "#F5F5F5"
                    }}>
                      <item.icon className="w-4 h-4" style={{ 
                        color: item.type === "booking" ? "#4CAF50" : item.type === "lead" ? "#2196F3" : "#757575"
                      }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">{item.text}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.time}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Live Demo Badge */}
      <div className="flex items-center justify-center gap-2 py-2" style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4CAF50" }} />
        <span className="text-[10px] text-gray-500 uppercase tracking-wide">Live Demo Mode</span>
      </div>
    </div>
  );
}

// ============ RINGCENTRAL DEMO ============
function RingCentralDemoVisual() {
  const [activeTab, setActiveTab] = useState<"calls" | "messages" | "video">("calls");

  const RC_MESSAGES = [
    { from: "Marketing Team", preview: "Q1 campaign results are in...", time: "11:30 AM", unread: true },
    { from: "John Smith", preview: "Thanks for the follow-up call!", time: "10:20 AM", unread: true },
    { from: "Support Queue", preview: "New ticket assigned to you", time: "9:15 AM", unread: false },
  ];

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "2px solid #0684BC", background: "#FFFFFF" }}>
      {/* RingCentral Header - Orange/Blue branding */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: "linear-gradient(90deg, #FF6A00 0%, #FF8533 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "white" }}>
            <Phone className="w-5 h-5" style={{ color: "#FF6A00" }} />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">RingCentral</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="text-[10px]" style={{ background: "white", color: "#FF6A00" }}>MVP</Badge>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-medium text-white">AG</div>
        </div>
      </div>

      {/* Tab Navigation - RingCentral Blue */}
      <div className="flex" style={{ background: "#0684BC" }}>
        {[
          { id: "calls", label: "Phone", icon: Phone },
          { id: "messages", label: "Message", icon: MessageSquare },
          { id: "video", label: "Video", icon: Video },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors relative"
            style={{ color: "white", opacity: activeTab === tab.id ? 1 : 0.7 }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#FF6A00" }} />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-h-[350px] overflow-y-auto">
        {activeTab === "calls" && (
          <div>
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-px" style={{ background: "#E5E7EB" }}>
              {RINGCENTRAL_DEMO_STATS.map((stat) => (
                <div key={stat.label} className="p-3 text-center" style={{ background: "#F8FAFC" }}>
                  <div className="text-lg font-bold" style={{ color: "#0684BC" }}>{stat.value}</div>
                  <div className="text-[10px] text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Call Log */}
            <div className="divide-y" style={{ borderColor: "#E5E7EB" }}>
              {RINGCENTRAL_DEMO_CALLS.map((call, i) => {
                const Icon = call.type === "incoming" ? PhoneIncoming : 
                             call.type === "outgoing" ? PhoneOutgoing :
                             call.type === "voicemail" ? Voicemail : Phone;
                return (
                  <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: call.status === "missed" ? "#FEE2E2" : 
                                   call.status === "voicemail" ? "#FEF3C7" : "#E0F7FA"
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ 
                        color: call.status === "missed" ? "#DC2626" : 
                               call.status === "voicemail" ? "#D97706" : "#0684BC"
                      }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{call.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{call.type} call</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-gray-900">{call.duration}</div>
                      <div className="text-xs text-gray-500">{call.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dial Button */}
            <div className="p-4 flex justify-center">
              <button 
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                style={{ background: "#FF6A00" }}
              >
                <Phone className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="divide-y" style={{ borderColor: "#E5E7EB" }}>
            {RC_MESSAGES.map((msg, i) => (
              <div 
                key={i} 
                className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ background: msg.unread ? "#FFF7ED" : "transparent" }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#0684BC" }}>
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{msg.from}</span>
                    {msg.unread && <span className="w-2 h-2 rounded-full" style={{ background: "#FF6A00" }} />}
                  </div>
                  <div className="text-sm text-gray-500 truncate">{msg.preview}</div>
                </div>
                <div className="text-xs text-gray-400">{msg.time}</div>
              </div>
            ))}
            <div className="p-4 flex justify-center">
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
                style={{ background: "#0684BC" }}
              >
                <Mail className="w-4 h-4" />
                New Message
              </button>
            </div>
          </div>
        )}

        {activeTab === "video" && (
          <div className="p-4 space-y-4">
            <div className="rounded-xl p-4" style={{ background: "#FFF7ED", border: "1px solid #FDBA74" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: "#C2410C" }}>Next Meeting</span>
                <Badge style={{ background: "#FF6A00", color: "white" }}>In 30 min</Badge>
              </div>
              <div className="font-semibold text-lg text-gray-900 mb-1">Weekly Team Sync</div>
              <div className="text-sm text-gray-600 mb-3">2:00 PM - 3:00 PM • 6 participants</div>
              <button 
                className="w-full py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2"
                style={{ background: "#0684BC" }}
              >
                <Video className="w-4 h-4" />
                Join Meeting
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-xl text-center hover:bg-gray-50 transition-colors" style={{ border: "1px solid #E5E7EB" }}>
                <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: "#E0F7FA" }}>
                  <Video className="w-5 h-5" style={{ color: "#0684BC" }} />
                </div>
                <div className="text-sm font-medium text-gray-900">Start Meeting</div>
              </button>
              <button className="p-4 rounded-xl text-center hover:bg-gray-50 transition-colors" style={{ border: "1px solid #E5E7EB" }}>
                <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: "#FFF7ED" }}>
                  <Calendar className="w-5 h-5" style={{ color: "#FF6A00" }} />
                </div>
                <div className="text-sm font-medium text-gray-900">Schedule</div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Call Widget */}
      <div className="p-3 flex items-center justify-between" style={{ background: "#10B981" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Active Call</div>
            <div className="text-xs text-white/80">John Smith • 02:34</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <Voicemail className="w-4 h-4 text-white" />
          </button>
          <button className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors">
            <Phone className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ INTEGRATION MODAL ============
export function IntegrationModal({ open, onOpenChange, integration }: IntegrationModalProps) {
  const isGranot = integration === "granot";
  const features = isGranot ? GRANOT_FEATURES : RINGCENTRAL_FEATURES;
  const title = isGranot ? "Granot CRM" : "RingCentral";
  const subtitle = isGranot 
    ? "Moving industry CRM built for brokers and carriers"
    : "Unified communications for moving companies";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Branded Header */}
        <DialogHeader 
          className="px-6 pt-6 pb-4"
          style={{ 
            background: isGranot 
              ? "linear-gradient(135deg, #1B365D 0%, #2E4A7D 100%)" 
              : "linear-gradient(90deg, #FF6A00 0%, #FF8533 100%)"
          }}
        >
          <DialogTitle className="flex items-center gap-3 text-xl">
            {isGranot ? (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#4CAF50" }}>
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "white" }}>
                <Phone className="w-5 h-5" style={{ color: "#FF6A00" }} />
              </div>
            )}
            <div>
              <span className="block text-white">{title}</span>
              <span className="text-sm font-normal text-white/80">{subtitle}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Tabs defaultValue="demo">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="demo" className="mt-4">
              {isGranot ? <GranotDemoVisual /> : <RingCentralDemoVisual />}
            </TabsContent>

            <TabsContent value="features" className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature) => (
                  <div 
                    key={feature.title}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div 
                      className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: isGranot ? "#1B365D20" : "#FF6A0020" }}
                    >
                      <feature.icon className="w-4 h-4" style={{ color: isGranot ? "#1B365D" : "#FF6A00" }} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{feature.title}</div>
                      <div className="text-xs text-muted-foreground">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="mt-4">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Starter</span>
                    <Badge variant="secondary">$49/mo</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isGranot 
                      ? "Up to 500 contacts, 2 users, basic reporting"
                      : "5 users, 1000 minutes, video meetings"}
                  </p>
                </div>
                <div 
                  className="p-4 rounded-lg border-2"
                  style={{ 
                    borderColor: isGranot ? "#4CAF50" : "#FF6A00",
                    background: isGranot ? "#4CAF5010" : "#FF6A0010"
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Professional</span>
                    <Badge style={{ background: isGranot ? "#4CAF50" : "#FF6A00", color: "white" }}>$99/mo</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isGranot 
                      ? "Unlimited contacts, 10 users, advanced analytics"
                      : "25 users, unlimited minutes, contact center"}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Enterprise</span>
                    <Badge variant="secondary">Custom</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isGranot 
                      ? "White-label, API access, dedicated support"
                      : "Unlimited users, SLA, dedicated account manager"}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ExternalLink className="w-4 h-4" />
              Visit Website
            </Button>
            <Button 
              size="sm" 
              className="gap-2 text-white"
              style={{ background: isGranot ? "#4CAF50" : "#FF6A00" }}
            >
              Connect {title}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function IntegrationTabs() {
  const [granotOpen, setGranotOpen] = useState(false);
  const [ringcentralOpen, setRingcentralOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setGranotOpen(true)}
          className="integration-tab integration-tab-granot"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Granot CRM</span>
        </button>
        <button
          onClick={() => setRingcentralOpen(true)}
          className="integration-tab integration-tab-ringcentral"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>RingCentral</span>
        </button>
      </div>

      <IntegrationModal 
        open={granotOpen} 
        onOpenChange={setGranotOpen} 
        integration="granot" 
      />
      <IntegrationModal 
        open={ringcentralOpen} 
        onOpenChange={setRingcentralOpen} 
        integration="ringcentral" 
      />
    </>
  );
}
