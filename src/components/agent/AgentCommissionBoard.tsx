import { useState } from "react";
import DraggableModal from "@/components/ui/DraggableModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, Medal, Award, TrendingUp, DollarSign, 
  Briefcase, Star, Crown, Flame, Target, ChevronUp, 
  ChevronDown, Minus, Sparkles, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentCommissionBoardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEMO_AGENTS = [
  { 
    id: 1, 
    name: "Sarah Mitchell", 
    avatar: "SM", 
    deposits: 47500, 
    jobs: 32, 
    premium: 12800, 
    commission: 8950,
    conversionRate: 68,
    avgJobValue: 1484,
    trend: "up",
    streak: 5,
  },
  { 
    id: 2, 
    name: "Marcus Johnson", 
    avatar: "MJ", 
    deposits: 42300, 
    jobs: 28, 
    premium: 9500, 
    commission: 7820,
    conversionRate: 62,
    avgJobValue: 1511,
    trend: "up",
    streak: 3,
  },
  { 
    id: 3, 
    name: "Emily Rodriguez", 
    avatar: "ER", 
    deposits: 38900, 
    jobs: 25, 
    premium: 8200, 
    commission: 7150,
    conversionRate: 58,
    avgJobValue: 1556,
    trend: "same",
    streak: 0,
  },
  { 
    id: 4, 
    name: "David Kim", 
    avatar: "DK", 
    deposits: 35200, 
    jobs: 24, 
    premium: 7800, 
    commission: 6480,
    conversionRate: 55,
    avgJobValue: 1467,
    trend: "down",
    streak: 0,
  },
  { 
    id: 5, 
    name: "Jessica Thompson", 
    avatar: "JT", 
    deposits: 31800, 
    jobs: 21, 
    premium: 6500, 
    commission: 5890,
    conversionRate: 52,
    avgJobValue: 1514,
    trend: "up",
    streak: 2,
  },
  { 
    id: 6, 
    name: "Michael Chen", 
    avatar: "MC", 
    deposits: 28400, 
    jobs: 19, 
    premium: 5800, 
    commission: 5240,
    conversionRate: 48,
    avgJobValue: 1495,
    trend: "down",
    streak: 0,
  },
  { 
    id: 7, 
    name: "Amanda Foster", 
    avatar: "AF", 
    deposits: 25100, 
    jobs: 17, 
    premium: 4900, 
    commission: 4650,
    conversionRate: 45,
    avgJobValue: 1476,
    trend: "up",
    streak: 1,
  },
  { 
    id: 8, 
    name: "Robert Williams", 
    avatar: "RW", 
    deposits: 22800, 
    jobs: 15, 
    premium: 4200, 
    commission: 4180,
    conversionRate: 42,
    avgJobValue: 1520,
    trend: "same",
    streak: 0,
  },
];

type SortKey = "deposits" | "jobs" | "premium" | "commission" | "conversionRate";

const SORT_OPTIONS: { key: SortKey; label: string; icon: typeof DollarSign }[] = [
  { key: "deposits", label: "Deposits", icon: DollarSign },
  { key: "jobs", label: "Jobs", icon: Briefcase },
  { key: "premium", label: "Premium", icon: Star },
  { key: "commission", label: "Commission", icon: Trophy },
  { key: "conversionRate", label: "Conversion", icon: Target },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2: return <Medal className="w-5 h-5 text-gray-400" />;
    case 3: return <Award className="w-5 h-5 text-amber-600" />;
    default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
  }
};

const getRankBadgeStyle = (rank: number) => {
  switch (rank) {
    case 1: return "bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-yellow-300";
    case 2: return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 border-gray-200";
    case 3: return "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
};

export function AgentCommissionBoard({ open, onOpenChange }: AgentCommissionBoardProps) {
  const [sortKey, setSortKey] = useState<SortKey>("commission");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">("month");

  const sortedAgents = [...DEMO_AGENTS].sort((a, b) => b[sortKey] - a[sortKey]);

  const totalDeposits = DEMO_AGENTS.reduce((sum, a) => sum + a.deposits, 0);
  const totalJobs = DEMO_AGENTS.reduce((sum, a) => sum + a.jobs, 0);
  const totalCommission = DEMO_AGENTS.reduce((sum, a) => sum + a.commission, 0);

  return (
    <DraggableModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      storageKey="tm_commission_board"
      defaultWidth={800}
      defaultHeight={600}
      minWidth={600}
      minHeight={450}
      headerStyle={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)" }}
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/20">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white">Commission Leaderboard</span>
            <Badge className="ml-2 text-[9px] bg-white/20 text-white">Live Rankings</Badge>
          </div>
        </div>
      }
    >
      <div className="h-full flex flex-col bg-background">
        {/* Stats Strip */}
        <div className="grid grid-cols-4 gap-3 p-4 border-b border-border bg-muted/30">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalDeposits)}</div>
            <div className="text-xs text-muted-foreground">Total Deposits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalJobs}</div>
            <div className="text-xs text-muted-foreground">Total Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(totalCommission)}</div>
            <div className="text-xs text-muted-foreground">Total Commission</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">8</div>
            <div className="text-xs text-muted-foreground">Active Agents</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Rank by:</span>
            <div className="flex gap-1">
              {SORT_OPTIONS.map((option) => (
                <Button
                  key={option.key}
                  variant={sortKey === option.key ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-7 text-xs gap-1",
                    sortKey === option.key && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setSortKey(option.key)}
                >
                  <option.icon className="w-3 h-3" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
              <TabsList className="h-7">
                <TabsTrigger value="week" className="text-xs h-5 px-2">Week</TabsTrigger>
                <TabsTrigger value="month" className="text-xs h-5 px-2">Month</TabsTrigger>
                <TabsTrigger value="quarter" className="text-xs h-5 px-2">Quarter</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {sortedAgents.map((agent, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              
              return (
                <div
                  key={agent.id}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl border transition-all hover:shadow-md",
                    isTopThree ? "bg-gradient-to-r from-muted/50 to-background" : "bg-background",
                    rank === 1 && "border-yellow-300 shadow-lg shadow-yellow-100/50"
                  )}
                >
                  {/* Rank */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0",
                    getRankBadgeStyle(rank)
                  )}>
                    {getRankIcon(rank)}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                      rank === 1 ? "bg-yellow-100 text-yellow-700" :
                      rank === 2 ? "bg-gray-100 text-gray-700" :
                      rank === 3 ? "bg-amber-100 text-amber-700" :
                      "bg-primary/10 text-primary"
                    )}>
                      {agent.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        {agent.name}
                        {agent.streak >= 3 && (
                          <span className="flex items-center gap-0.5 text-orange-500">
                            <Flame className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">{agent.streak}</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        {agent.trend === "up" && <ChevronUp className="w-3 h-3 text-green-500" />}
                        {agent.trend === "down" && <ChevronDown className="w-3 h-3 text-red-500" />}
                        {agent.trend === "same" && <Minus className="w-3 h-3 text-muted-foreground" />}
                        {agent.conversionRate}% conversion
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <div className={cn("text-center", sortKey === "deposits" && "font-bold text-primary")}>
                      <div className="text-sm font-semibold">{formatCurrency(agent.deposits)}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">Deposits</div>
                    </div>
                    <div className={cn("text-center", sortKey === "jobs" && "font-bold text-primary")}>
                      <div className="text-sm font-semibold">{agent.jobs}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">Jobs</div>
                    </div>
                    <div className={cn("text-center", sortKey === "premium" && "font-bold text-primary")}>
                      <div className="text-sm font-semibold">{formatCurrency(agent.premium)}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">Premium</div>
                    </div>
                    <div className={cn("text-center", sortKey === "commission" && "font-bold text-primary")}>
                      <div className="text-sm font-semibold text-green-600">{formatCurrency(agent.commission)}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">Commission</div>
                    </div>
                  </div>

                  {/* Trend Indicator */}
                  <div className="shrink-0">
                    {agent.trend === "up" && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                        Rising
                      </div>
                    )}
                    {agent.trend === "down" && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                        <ChevronDown className="w-3 h-3" />
                        Falling
                      </div>
                    )}
                    {agent.trend === "same" && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                        <Minus className="w-3 h-3" />
                        Steady
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Last updated: Just now
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
            <TrendingUp className="w-3 h-3" />
            Export Report
          </Button>
        </div>
      </div>
    </DraggableModal>
  );
}
