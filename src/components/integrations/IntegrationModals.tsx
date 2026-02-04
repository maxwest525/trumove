import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Phone, Calendar, MessageSquare, BarChart3, 
  FileText, Mail, Video, Headphones, Clock, 
  CheckCircle2, ArrowRight, ExternalLink, TrendingUp,
  PhoneCall, PhoneIncoming, PhoneOutgoing, Voicemail,
  UserPlus, DollarSign, Truck, MapPin, Star
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

// Fake demo data for Granot CRM
const GRANOT_DEMO_LEADS = [
  { name: "Sarah Johnson", status: "Hot", value: "$4,200", move: "NYC → Miami", date: "Feb 15" },
  { name: "Michael Chen", status: "Warm", value: "$2,800", move: "LA → Seattle", date: "Feb 18" },
  { name: "Emily Rodriguez", status: "New", value: "$3,500", move: "Chicago → Denver", date: "Feb 22" },
  { name: "David Kim", status: "Hot", value: "$5,100", move: "Boston → Austin", date: "Feb 12" },
];

const GRANOT_DEMO_STATS = [
  { label: "Active Leads", value: "47", change: "+12%" },
  { label: "Booked This Month", value: "23", change: "+8%" },
  { label: "Revenue Pipeline", value: "$142K", change: "+18%" },
  { label: "Conversion Rate", value: "34%", change: "+5%" },
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
  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        {GRANOT_DEMO_STATS.map((stat) => (
          <div key={stat.label} className="p-3 rounded-lg bg-muted/40 text-center">
            <div className="text-lg font-bold text-foreground">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{stat.label}</div>
            <div className="text-[10px] text-primary font-medium">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Preview */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lead Pipeline</span>
          <Badge variant="secondary" className="text-[10px]">Live Demo</Badge>
        </div>
        <div className="divide-y divide-border">
          {GRANOT_DEMO_LEADS.map((lead, i) => (
            <div key={i} className="px-3 py-2 flex items-center gap-3 hover:bg-muted/20 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground truncate">{lead.name}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {lead.move}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-semibold text-sm text-foreground">{lead.value}</div>
                <Badge 
                  variant={lead.status === "Hot" ? "default" : "secondary"} 
                  className={`text-[9px] ${lead.status === "Hot" ? "bg-primary" : ""}`}
                >
                  {lead.status}
                </Badge>
              </div>
              <div className="text-[11px] text-muted-foreground flex-shrink-0 w-12 text-right">
                {lead.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Chart */}
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground">Weekly Bookings</span>
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <div className="flex items-end gap-1 h-12">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 bg-primary/20 rounded-t transition-all hover:bg-primary/40"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[9px] text-muted-foreground">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
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
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-card border-border">
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
