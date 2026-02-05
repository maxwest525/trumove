import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layout, TrendingUp, Zap, Target, Rocket,
  ArrowRight, DollarSign, BarChart3,
  Bot, ChevronRight, Sparkles, Image, Play
} from "lucide-react";
import { TrudyMarketingChat } from "./TrudyMarketingChat";
import { cn } from "@/lib/utils";

interface MarketingHubDashboardProps {
  onNavigate: (section: string) => void;
  onQuickCreate?: (type: 'ad' | 'landing' | 'campaign') => void;
  stats: {
    totalSpend: number;
    conversions: number;
    activePages: number;
    testsRunning: number;
  };
}

// BIG one-click action cards
const QUICK_ACTIONS = [
  {
    id: 'create-ad',
    type: 'ad' as const,
    title: 'Create Ad',
    subtitle: 'Google or Meta ad in 1 click',
    icon: Target,
    color: '#7C3AED',
    gradient: 'from-purple-500 to-purple-600',
    popular: true,
  },
  {
    id: 'create-landing',
    type: 'landing' as const,
    title: 'Landing Page',
    subtitle: 'High-converting page instantly',
    icon: Layout,
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'create-campaign',
    type: 'campaign' as const,
    title: 'Full Campaign',
    subtitle: 'Ad + Landing + Tracking',
    icon: Rocket,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
  },
];

export function MarketingHubDashboard({ onNavigate, onQuickCreate, stats }: MarketingHubDashboardProps) {
  const [showTrudyPanel, setShowTrudyPanel] = useState(false);

  const handleQuickAction = (type: 'ad' | 'landing' | 'campaign') => {
    if (onQuickCreate) {
      onQuickCreate(type);
    } else {
      // Fallback to navigation
      if (type === 'landing') onNavigate('landing');
      else if (type === 'ad') onNavigate('campaigns');
      else onNavigate('landing');
    }
  };

  return (
    <div className="flex h-full relative">
      {/* Main Content */}
      <div className={cn("flex-1 space-y-5 p-5 overflow-y-auto transition-all", showTrudyPanel && "pr-2")}>
        {/* Hero Section - What do you want to create? */}
        <div className="text-center space-y-2 py-4">
          <h1 className="text-2xl font-bold text-foreground">What do you want to create?</h1>
          <p className="text-muted-foreground">Pick one and we'll handle the rest — super simple</p>
        </div>

        {/* BIG Action Cards - One Click Creates */}
        <div className="grid grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Card
              key={action.id}
              onClick={() => handleQuickAction(action.type)}
              className={cn(
                "group cursor-pointer border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden",
                "border-transparent hover:border-primary/50"
              )}
            >
              {action.popular && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              <CardContent className="p-6 text-center space-y-4">
                <div 
                  className={cn(
                    "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-br transition-transform group-hover:scale-110",
                    action.gradient
                  )}
                >
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{action.subtitle}</p>
                </div>
                <Button 
                  size="sm" 
                  className="w-full gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(135deg, ${action.color}, ${action.color}CC)` }}
                >
                  Create Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
              {/* Bottom gradient bar on hover */}
              <div 
                className={cn("h-1 w-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r", action.gradient)}
              />
            </Card>
          ))}
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total Spend', value: `$${stats.totalSpend.toLocaleString()}`, icon: DollarSign, color: '#7C3AED' },
            { label: 'Conversions', value: stats.conversions.toString(), icon: Target, color: '#10B981' },
            { label: 'Active Pages', value: stats.activePages.toString(), icon: Layout, color: '#3B82F6' },
            { label: 'Tests Running', value: stats.testsRunning.toString(), icon: BarChart3, color: '#EC4899' },
          ].map((stat) => (
            <div 
              key={stat.label} 
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => onNavigate('performance')}
            >
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${stat.color}15` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Actions - View existing */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Card 
            className="cursor-pointer hover:border-primary/50 transition-all group"
            onClick={() => onNavigate('performance')}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">View Analytics</h4>
                <p className="text-xs text-muted-foreground">See all your performance data</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:border-primary/50 transition-all group"
            onClick={() => onNavigate('landing')}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Layout className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">Manage Pages</h4>
                <p className="text-xs text-muted-foreground">{stats.activePages} active landing pages</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trudy Chat Panel */}
      {showTrudyPanel && (
        <div className="w-[360px] border-l border-border flex flex-col bg-background">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Ask Trudy</span>
            </div>
            <button
              onClick={() => setShowTrudyPanel(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <TrudyMarketingChat 
              onNavigate={onNavigate}
              onCreateLandingPage={() => onNavigate('landing')}
            />
          </div>
        </div>
      )}

      {/* Collapsed Trudy Toggle */}
      {!showTrudyPanel && (
        <button
          onClick={() => setShowTrudyPanel(true)}
          className="absolute right-4 bottom-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        >
          <Bot className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}