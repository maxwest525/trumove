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
  PhoneCall, PhoneIncoming, PhoneOutgoing, Voicemail,
  UserPlus, DollarSign, Truck, MapPin, Star, Bell,
  Search, Filter, MoreHorizontal, Plus, ChevronRight,
  Activity, Target, Zap, AlertCircle, RefreshCw
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

// Enhanced demo data for Granot CRM
const GRANOT_DEMO_LEADS = [
  { name: "Sarah Johnson", status: "Hot", value: "$4,200", move: "NYC → Miami", date: "Feb 15", phone: "(555) 123-4567", email: "sarah.j@email.com", lastContact: "2 hours ago" },
  { name: "Michael Chen", status: "Warm", value: "$2,800", move: "LA → Seattle", date: "Feb 18", phone: "(555) 234-5678", email: "m.chen@email.com", lastContact: "Yesterday" },
  { name: "Emily Rodriguez", status: "New", value: "$3,500", move: "Chicago → Denver", date: "Feb 22", phone: "(555) 345-6789", email: "emily.r@email.com", lastContact: "Just now" },
  { name: "David Kim", status: "Hot", value: "$5,100", move: "Boston → Austin", date: "Feb 12", phone: "(555) 456-7890", email: "d.kim@email.com", lastContact: "3 hours ago" },
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
  { stage: "New Leads", count: 12, value: "$38K", color: "bg-blue-500" },
  { stage: "Contacted", count: 18, value: "$52K", color: "bg-yellow-500" },
  { stage: "Quoted", count: 9, value: "$31K", color: "bg-orange-500" },
  { stage: "Negotiating", count: 5, value: "$16K", color: "bg-purple-500" },
  { stage: "Won", count: 23, value: "$89K", color: "bg-primary" },
];

// Fake demo data for RingCentral
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

function GranotDemoVisual() {
  const [activeView, setActiveView] = useState<"dashboard" | "pipeline" | "calendar" | "activity">("dashboard");
  const [selectedLead, setSelectedLead] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {/* Dashboard Navigation */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30">
        {[
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
          { id: "pipeline", label: "Pipeline", icon: Target },
          { id: "calendar", label: "Schedule", icon: Calendar },
          { id: "activity", label: "Activity", icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as typeof activeView)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
              activeView === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard View */}
      {activeView === "dashboard" && (
        <div className="space-y-3">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2">
            {GRANOT_DEMO_STATS.map((stat) => (
              <div key={stat.label} className="p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-1">
                  <stat.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] text-primary font-medium">{stat.change}</span>
                </div>
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-3">
            {/* Lead Pipeline Mini */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hot Leads</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <ScrollArea className="h-[180px]">
                <div className="divide-y divide-border">
                  {GRANOT_DEMO_LEADS.map((lead, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedLead(selectedLead === i ? null : i)}
                      className={`px-3 py-2 cursor-pointer transition-colors ${
                        selectedLead === i ? "bg-primary/10" : "hover:bg-muted/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Users className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs text-foreground truncate">{lead.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{lead.move}</div>
                        </div>
                        <Badge 
                          variant={lead.status === "Hot" ? "default" : "secondary"} 
                          className={`text-[9px] ${lead.status === "Hot" ? "bg-primary" : ""}`}
                        >
                          {lead.value}
                        </Badge>
                      </div>
                      {selectedLead === i && (
                        <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                          <div className="flex gap-1 mt-2">
                            <Button size="sm" className="h-6 text-[10px] flex-1 gap-1">
                              <Phone className="w-3 h-3" /> Call
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 text-[10px] flex-1 gap-1">
                              <Mail className="w-3 h-3" /> Email
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent Activity</span>
                <RefreshCw className="w-3 h-3 text-muted-foreground" />
              </div>
              <ScrollArea className="h-[180px]">
                <div className="divide-y divide-border">
                  {GRANOT_RECENT_ACTIVITY.map((item, i) => (
                    <div key={i} className="px-3 py-2 flex items-center gap-2 hover:bg-muted/20 transition-colors">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.type === "booking" ? "bg-primary/20" : 
                        item.type === "lead" ? "bg-blue-500/20" : "bg-muted/50"
                      }`}>
                        <item.icon className={`w-3 h-3 ${
                          item.type === "booking" ? "text-primary" :
                          item.type === "lead" ? "text-blue-500" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-foreground truncate">{item.text}</div>
                        <div className="text-[10px] text-muted-foreground">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Weekly Bookings Chart */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground">Weekly Performance</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[9px]">This Week</Badge>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-primary/20 rounded-t transition-all hover:bg-primary/40 relative group"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {Math.round(h / 10)} bookings
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-muted-foreground">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>
      )}

      {/* Pipeline View */}
      {activeView === "pipeline" && (
        <div className="space-y-3">
          {/* Pipeline Funnel */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sales Funnel</span>
              <Badge variant="secondary" className="text-[10px]">$226K Total</Badge>
            </div>
            <div className="p-3 space-y-2">
              {GRANOT_PIPELINE_STAGES.map((stage, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-20 text-xs text-muted-foreground truncate">{stage.stage}</div>
                  <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full ${stage.color} transition-all`}
                      style={{ width: `${(stage.count / 23) * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                      <span className="text-[10px] font-medium text-foreground">{stage.count}</span>
                      <span className="text-[10px] font-medium text-foreground">{stage.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Cards */}
          <div className="grid grid-cols-5 gap-2">
            {GRANOT_PIPELINE_STAGES.map((stage, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-2 text-center">
                <div className={`w-2 h-2 rounded-full ${stage.color} mx-auto mb-1`} />
                <div className="text-lg font-bold text-foreground">{stage.count}</div>
                <div className="text-[9px] text-muted-foreground truncate">{stage.stage}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar View */}
      {activeView === "calendar" && (
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Upcoming Moves</span>
              <Badge variant="secondary" className="text-[10px]">3 This Week</Badge>
            </div>
            <div className="divide-y divide-border">
              {GRANOT_UPCOMING_MOVES.map((move, i) => (
                <div key={i} className="px-3 py-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{move.customer}</div>
                        <div className="text-[10px] text-muted-foreground">{move.crew}</div>
                      </div>
                    </div>
                    <Badge 
                      variant={move.status === "Confirmed" ? "default" : move.status === "In Progress" ? "secondary" : "outline"}
                      className={`text-[9px] ${move.status === "Confirmed" ? "bg-primary" : ""}`}
                    >
                      {move.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{move.from}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>{move.to}</span>
                    <span className="ml-auto font-medium text-foreground">{move.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Calendar Grid */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-xs font-semibold text-muted-foreground mb-2">February 2025</div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-[9px] text-muted-foreground font-medium py-1">{d}</div>
              ))}
              {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                <div 
                  key={day}
                  className={`text-[10px] py-1 rounded cursor-pointer transition-colors ${
                    [10, 11, 12].includes(day) 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : [15, 18, 22].includes(day)
                        ? "bg-primary/20 text-primary font-medium"
                        : "hover:bg-muted/50"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity View */}
      {activeView === "activity" && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Activity Log</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">
                <Filter className="w-3 h-3 mr-1" /> Filter
              </Button>
            </div>
          </div>
          <ScrollArea className="h-[280px]">
            <div className="divide-y divide-border">
              {[...GRANOT_RECENT_ACTIVITY, ...GRANOT_RECENT_ACTIVITY].map((item, i) => (
                <div key={i} className="px-3 py-3 flex items-start gap-3 hover:bg-muted/20 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.type === "booking" ? "bg-primary/20" : 
                    item.type === "lead" ? "bg-blue-500/20" : 
                    item.type === "call" ? "bg-green-500/20" : "bg-muted/50"
                  }`}>
                    <item.icon className={`w-4 h-4 ${
                      item.type === "booking" ? "text-primary" :
                      item.type === "lead" ? "text-blue-500" :
                      item.type === "call" ? "text-green-500" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground">{item.text}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.time}</div>
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

      {/* Live Demo Badge */}
      <div className="flex items-center justify-center gap-2 py-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Live Demo Mode</span>
      </div>
    </div>
  );
}

function RingCentralDemoVisual() {
  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        {RINGCENTRAL_DEMO_STATS.map((stat) => (
          <div key={stat.label} className="p-3 rounded-lg bg-muted/40 text-center">
            <div className="text-lg font-bold text-foreground">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Call Log Preview */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent Calls</span>
          <Badge variant="secondary" className="text-[10px]">Live Demo</Badge>
        </div>
        <div className="divide-y divide-border">
          {RINGCENTRAL_DEMO_CALLS.map((call, i) => {
            const Icon = call.type === "incoming" ? PhoneIncoming : 
                         call.type === "outgoing" ? PhoneOutgoing :
                         call.type === "voicemail" ? Voicemail : Phone;
            const iconColor = call.status === "missed" ? "text-destructive" : 
                              call.status === "voicemail" ? "text-amber-500" : "text-primary";
            
            return (
              <div key={i} className="px-3 py-2 flex items-center gap-3 hover:bg-muted/20 transition-colors">
                <div className={`w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground truncate">{call.name}</div>
                  <div className="text-[11px] text-muted-foreground capitalize">{call.type} call</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-mono text-sm text-foreground">{call.duration}</div>
                  <div className="text-[11px] text-muted-foreground">{call.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Call Widget */}
      <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <PhoneCall className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-foreground">No Active Call</div>
            <div className="text-sm text-muted-foreground">Click to start a new call</div>
          </div>
          <Button size="sm" className="gap-2">
            <Phone className="w-4 h-4" />
            New Call
          </Button>
        </div>
      </div>
    </div>
  );
}

export function IntegrationModal({ open, onOpenChange, integration }: IntegrationModalProps) {
  const isGranot = integration === "granot";
  const features = isGranot ? GRANOT_FEATURES : RINGCENTRAL_FEATURES;
  const title = isGranot ? "Granot CRM" : "RingCentral";
  const subtitle = isGranot 
    ? "Moving industry CRM built for brokers and carriers"
    : "Unified communications for moving companies";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            {isGranot ? (
              <div className="w-10 h-10 rounded-lg bg-primary/80 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Phone className="w-5 h-5 text-accent-foreground" />
              </div>
            )}
            <div>
              <span className="block">{title}</span>
              <span className="text-sm font-normal text-muted-foreground">{subtitle}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="demo" className="mt-4">
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
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-primary" />
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
              <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Professional</span>
                  <Badge className="bg-primary">$99/mo</Badge>
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
          <Button size="sm" className="gap-2">
            Connect {title}
            <ArrowRight className="w-4 h-4" />
          </Button>
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
