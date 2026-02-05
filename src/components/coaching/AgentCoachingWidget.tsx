import { useState } from "react";
import { 
  Headphones, ChevronDown, ChevronUp, AlertTriangle, 
  CheckCircle2, MessageSquare, Shield, Clock, X, Minimize2, Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CoachingChecklist } from "./CoachingChecklist";
import { TalkTrackCard } from "./TalkTrackCard";
import { 
  DEMO_CHECKLIST, 
  DEMO_TALK_TRACKS, 
  DEMO_COMPLIANCE_ALERTS,
  ComplianceAlert 
} from "./types";

interface AgentCoachingWidgetProps {
  customerName?: string;
  moveRoute?: string;
  callDuration?: string;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

export function AgentCoachingWidget({ 
  customerName = "John Anderson",
  moveRoute = "NYC → Miami",
  callDuration = "4:32",
  onMinimize,
  isMinimized = false
}: AgentCoachingWidgetProps) {
  const [activeTab, setActiveTab] = useState<'checklist' | 'scripts' | 'compliance'>('checklist');
  const [alerts, setAlerts] = useState<ComplianceAlert[]>(DEMO_COMPLIANCE_ALERTS);
  const [checklistOpen, setChecklistOpen] = useState(true);
  const [scriptsOpen, setScriptsOpen] = useState(true);

  const unacknowledgedAlerts = alerts.filter(a => !a.isAcknowledged);
  const criticalAlerts = unacknowledgedAlerts.filter(a => a.severity === 'critical');

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, isAcknowledged: true } : a
    ));
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onMinimize}
          className="h-12 px-4 rounded-full shadow-lg bg-primary hover:bg-primary/90 gap-2"
        >
          <Headphones className="w-5 h-5" />
          <span>Call Coach</span>
          {criticalAlerts.length > 0 && (
            <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {criticalAlerts.length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[500px]">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">Call Coach</div>
              <div className="text-[10px] opacity-80">Real-time guidance</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 text-xs">
              <Clock className="w-3 h-3" />
              {callDuration}
            </div>
            {onMinimize && (
              <button onClick={onMinimize} className="p-1 hover:bg-white/20 rounded">
                <Minimize2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Customer info */}
        <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between">
          <div className="text-xs">
            <span className="opacity-70">Customer: </span>
            <span className="font-medium">{customerName}</span>
          </div>
          <div className="text-xs opacity-70">{moveRoute}</div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-destructive/10 border-b border-destructive/30 px-3 py-2">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-medium flex-1">
              {criticalAlerts.length} compliance item{criticalAlerts.length > 1 ? 's' : ''} required
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: 'checklist', label: 'Checklist', icon: CheckCircle2 },
          { id: 'scripts', label: 'Scripts', icon: MessageSquare },
          { id: 'compliance', label: 'Alerts', icon: Shield, count: unacknowledgedAlerts.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors",
              activeTab === tab.id 
                ? "text-primary border-b-2 border-primary bg-primary/5" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.count && tab.count > 0 && (
              <Badge variant="secondary" className="h-4 min-w-4 p-0 flex items-center justify-center text-[10px]">
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-3">
        {activeTab === 'checklist' && (
          <CoachingChecklist items={DEMO_CHECKLIST} />
        )}

        {activeTab === 'scripts' && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground mb-2">
              Click to expand talk tracks for common situations
            </div>
            {DEMO_TALK_TRACKS.map(track => (
              <TalkTrackCard key={track.id} track={track} />
            ))}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-2">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border transition-all",
                  alert.isAcknowledged 
                    ? "bg-muted/50 border-muted opacity-60" 
                    : alert.severity === 'critical'
                      ? "bg-destructive/10 border-destructive/30"
                      : alert.severity === 'warning'
                        ? "bg-orange-500/10 border-orange-500/30"
                        : "bg-blue-500/10 border-blue-500/30"
                )}
              >
                {alert.isAcknowledged ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <AlertTriangle className={cn(
                    "w-4 h-4 flex-shrink-0",
                    alert.severity === 'critical' ? "text-destructive" :
                    alert.severity === 'warning' ? "text-orange-500" : "text-blue-500"
                  )} />
                )}
                <span className={cn(
                  "text-xs flex-1",
                  alert.isAcknowledged && "line-through"
                )}>
                  {alert.label}
                </span>
                {!alert.isAcknowledged && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-[10px]"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    Done
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
