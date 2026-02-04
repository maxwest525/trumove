import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Phone, Calendar, MessageSquare, BarChart3, 
  FileText, Mail, Video, Headphones, Clock, 
  CheckCircle2, ArrowRight, ExternalLink
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

export function IntegrationModal({ open, onOpenChange, integration }: IntegrationModalProps) {
  const isGranot = integration === "granot";
  const features = isGranot ? GRANOT_FEATURES : RINGCENTRAL_FEATURES;
  const title = isGranot ? "Granot CRM" : "RingCentral";
  const subtitle = isGranot 
    ? "Moving industry CRM built for brokers and carriers"
    : "Unified communications for moving companies";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
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

        <Tabs defaultValue="features" className="mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
          </TabsList>

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

          <TabsContent value="demo" className="mt-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                {isGranot ? (
                  <Users className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <Video className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">Interactive Demo Coming Soon</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Experience {title} with a fully interactive sandbox environment.
              </p>
              <Button className="gap-2">
                Request Early Access
                <ArrowRight className="w-4 h-4" />
              </Button>
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
