import { useState, useEffect } from "react";
import { 
  BarChart3, TrendingUp, Users, Phone, AlertTriangle, 
  Trophy, Clock, CheckCircle2, Target, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from "recharts";
import { DEMO_TEAM_METRICS, DEMO_AGENT_PERFORMANCE } from "./types";

interface AdminCoachingSummaryProps {
  isLiveMode?: boolean;
}

export function AdminCoachingSummary({ isLiveMode = false }: AdminCoachingSummaryProps) {
  const [metrics, setMetrics] = useState(DEMO_TEAM_METRICS);
  const [agents] = useState(DEMO_AGENT_PERFORMANCE);

  // Simulated live updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalCalls: prev.totalCalls + (Math.random() > 0.7 ? 1 : 0),
        avgComplianceScore: Math.min(100, prev.avgComplianceScore + (Math.random() > 0.8 ? 0.1 : -0.05)),
        conversionRate: Math.max(30, Math.min(50, prev.conversionRate + (Math.random() > 0.5 ? 0.2 : -0.1))),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const complianceData = [
    { name: 'Excellent (90+)', value: 45, color: '#22c55e' },
    { name: 'Good (80-89)', value: 35, color: '#eab308' },
    { name: 'Needs Work (<80)', value: 20, color: '#ef4444' },
  ];

  const qaScoreTrend = [
    { week: 'Week 1', score: 85 },
    { week: 'Week 2', score: 87 },
    { week: 'Week 3', score: 84 },
    { week: 'Week 4', score: 89 },
    { week: 'Week 5', score: 91 },
    { week: 'Week 6', score: 93 },
  ];

  return (
    <div className="space-y-4">
      {/* Top Stats */}
      <div className="grid grid-cols-5 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className={cn(
                "text-2xl font-bold transition-all",
                isLiveMode && "animate-pulse"
              )}>
                {metrics.totalCalls}
              </div>
              <div className="text-xs text-muted-foreground">Total Calls</div>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {metrics.avgComplianceScore.toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Compliance</div>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.conversionRate.toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Conversion</div>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.avgHandleTime}</div>
              <div className="text-xs text-muted-foreground">Avg Handle</div>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{metrics.alertsCount}</div>
              <div className="text-xs text-muted-foreground">Alerts</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Calls by Hour */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Calls by Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.callsByHour}>
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fontSize: 10 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: 12, 
                      borderRadius: 8,
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }} 
                  />
                  <Bar 
                    dataKey="calls" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Compliance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceData}
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {complianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Agents']}
                    contentStyle={{ 
                      fontSize: 12, 
                      borderRadius: 8,
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {complianceData.map(item => (
                <div key={item.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-[10px] text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* QA Score Trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              QA Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={qaScoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 10 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[80, 100]}
                    tick={{ fontSize: 10 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'QA Score']}
                    contentStyle={{ 
                      fontSize: 12, 
                      borderRadius: 8,
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Top Performers - This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {metrics.topPerformers.map((performer, index) => (
              <div
                key={performer.name}
                className={cn(
                  "p-3 rounded-lg border text-center transition-all hover:shadow-md",
                  index === 0 && "border-yellow-500/50 bg-yellow-500/5",
                  index === 1 && "border-gray-400/50 bg-gray-400/5",
                  index === 2 && "border-orange-500/50 bg-orange-500/5"
                )}
              >
                <div className="relative inline-block mb-2">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {performer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {index < 3 && (
                    <div className={cn(
                      "absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
                      index === 0 ? "bg-yellow-500" :
                      index === 1 ? "bg-gray-400" : "bg-orange-500"
                    )}>
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="font-medium text-sm truncate">{performer.name.split(' ')[0]}</div>
                <div className="text-lg font-bold text-primary">{performer.score}%</div>
                <div className="text-[10px] text-muted-foreground">Compliance</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
