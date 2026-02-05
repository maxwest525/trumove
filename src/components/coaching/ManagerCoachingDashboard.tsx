import { useState, useEffect } from "react";
import { 
  Headphones, Phone, PhoneOff, Volume2, MessageSquare, 
  Users, Clock, TrendingUp, AlertTriangle, Send, Eye,
  Mic, MicOff, Radio, BarChart3, User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  DEMO_ACTIVE_CALLS,
  DEMO_AGENT_PERFORMANCE,
  ActiveCall,
  AgentPerformance
} from "./types";

interface ManagerCoachingDashboardProps {
  isLiveMode?: boolean;
}

export function ManagerCoachingDashboard({ isLiveMode = false }: ManagerCoachingDashboardProps) {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>(DEMO_ACTIVE_CALLS);
  const [agents, setAgents] = useState<AgentPerformance[]>(DEMO_AGENT_PERFORMANCE);
  const [selectedCall, setSelectedCall] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<string | null>(null);
  const [whisperMessage, setWhisperMessage] = useState("");

  // Simulated live updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      // Update call durations
      setActiveCalls(prev => prev.map(call => ({
        ...call,
        complianceScore: Math.min(100, call.complianceScore + (Math.random() > 0.7 ? 2 : 0))
      })));

      // Randomly update agent stats
      setAgents(prev => prev.map(agent => ({
        ...agent,
        callsToday: agent.status === 'on-call' ? agent.callsToday : agent.callsToday + (Math.random() > 0.9 ? 1 : 0)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const getCallDuration = (startTime: Date) => {
    const diff = Date.now() - startTime.getTime();
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleListen = (callId: string) => {
    if (isListening === callId) {
      setIsListening(null);
      toast.info("Stopped listening");
    } else {
      setIsListening(callId);
      toast.success("Now listening to call (simulated)");
    }
  };

  const handleWhisper = (callId: string) => {
    if (!whisperMessage.trim()) {
      toast.error("Enter a message to whisper");
      return;
    }
    const call = activeCalls.find(c => c.id === callId);
    toast.success(`Whispered to ${call?.agentName}: "${whisperMessage}"`);
    setWhisperMessage("");
  };

  const handleBarge = (callId: string) => {
    const call = activeCalls.find(c => c.id === callId);
    toast.info(`Barged into call with ${call?.customerName} (simulated)`);
  };

  const handleCoach = (agentId: string) => {
    const agent = agents.find(a => a.agentId === agentId);
    toast.success(`Sent coaching tip to ${agent?.agentName}`);
  };

  const statusColors = {
    available: 'bg-green-500',
    'on-call': 'bg-blue-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-400'
  };

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold">{activeCalls.length}</div>
              <div className="text-[10px] text-muted-foreground">Active Calls</div>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold">{agents.filter(a => a.status !== 'offline').length}</div>
              <div className="text-[10px] text-muted-foreground">Agents Online</div>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold">91%</div>
              <div className="text-[10px] text-muted-foreground">Avg Compliance</div>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <div className="text-xl font-bold">2</div>
              <div className="text-[10px] text-muted-foreground">Needs Coaching</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Active Calls Panel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Radio className={cn("w-4 h-4", isLiveMode && "text-red-500 animate-pulse")} />
              Active Calls
              {isLiveMode && <Badge variant="destructive" className="text-[9px]">LIVE</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              <div className="space-y-2">
                {activeCalls.map(call => (
                  <div
                    key={call.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all cursor-pointer",
                      selectedCall === call.id ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30",
                      isListening === call.id && "ring-2 ring-green-500"
                    )}
                    onClick={() => setSelectedCall(selectedCall === call.id ? null : call.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{call.agentName}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {call.customerName} • {call.moveRoute}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3" />
                          {getCallDuration(call.startTime)}
                        </div>
                        <Badge 
                          variant={call.status === 'active' ? 'default' : 'secondary'}
                          className="text-[9px] mt-1"
                        >
                          {call.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Compliance Score */}
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">Compliance</span>
                        <span className={cn(
                          "font-medium",
                          call.complianceScore >= 90 ? "text-green-600" :
                          call.complianceScore >= 70 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {call.complianceScore}%
                        </span>
                      </div>
                      <Progress 
                        value={call.complianceScore} 
                        className="h-1.5"
                      />
                    </div>

                    {/* Actions */}
                    {selectedCall === call.id && (
                      <div className="pt-2 border-t space-y-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={isListening === call.id ? "default" : "outline"}
                            className="flex-1 h-7 text-xs gap-1"
                            onClick={(e) => { e.stopPropagation(); handleListen(call.id); }}
                          >
                            {isListening === call.id ? (
                              <><Volume2 className="w-3 h-3" /> Listening</>
                            ) : (
                              <><Headphones className="w-3 h-3" /> Listen</>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs gap-1"
                            onClick={(e) => { e.stopPropagation(); handleBarge(call.id); }}
                          >
                            <PhoneOff className="w-3 h-3" /> Barge
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          <Input
                            placeholder="Whisper message..."
                            value={whisperMessage}
                            onChange={(e) => setWhisperMessage(e.target.value)}
                            className="h-7 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button
                            size="sm"
                            className="h-7 px-2"
                            onClick={(e) => { e.stopPropagation(); handleWhisper(call.id); }}
                          >
                            <Send className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Agent Performance Panel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Agent Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              <div className="space-y-2">
                {agents.map(agent => (
                  <div
                    key={agent.agentId}
                    className="p-3 rounded-lg border hover:border-muted-foreground/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {agent.agentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                            statusColors[agent.status]
                          )} />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{agent.agentName}</div>
                          <div className="text-[10px] text-muted-foreground capitalize">{agent.status.replace('-', ' ')}</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs gap-1"
                        onClick={() => handleCoach(agent.agentId)}
                      >
                        <MessageSquare className="w-3 h-3" />
                        Coach
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <div className="text-sm font-semibold">{agent.callsToday}</div>
                        <div className="text-[9px] text-muted-foreground">Calls</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{agent.avgHandleTime}</div>
                        <div className="text-[9px] text-muted-foreground">Avg Time</div>
                      </div>
                      <div>
                        <div className={cn(
                          "text-sm font-semibold",
                          agent.complianceRate >= 90 ? "text-green-600" :
                          agent.complianceRate >= 80 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {agent.complianceRate}%
                        </div>
                        <div className="text-[9px] text-muted-foreground">Compliance</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-primary">{agent.conversionRate}%</div>
                        <div className="text-[9px] text-muted-foreground">Convert</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
