import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Layout, TrendingUp, Target, Rocket,
  ArrowRight, DollarSign, BarChart3,
  Bot, ChevronRight, Sparkles, Building2, MapPin, Zap
} from "lucide-react";
import { TrudyMarketingChat } from "./TrudyMarketingChat";
import { ConnectedAccountsPanel } from "./ConnectedAccountsPanel";
import { cn } from "@/lib/utils";

interface MarketingHubDashboardProps {
  onNavigate: (section: string) => void;
  onQuickCreate?: (type: 'ad' | 'landing' | 'campaign') => void;
  liveMode?: boolean;
  stats: {
    totalSpend: number;
    conversions: number;
    activePages: number;
    testsRunning: number;
  };
}

export function MarketingHubDashboard({ onNavigate, onQuickCreate, liveMode = false, stats }: MarketingHubDashboardProps) {
  const [showTrudyPanel, setShowTrudyPanel] = useState(false);
  const [businessName, setBusinessName] = useState("TruMove");
  const [location, setLocation] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleQuickCreate = () => {
    if (!businessName || !location) return;
    setIsCreating(true);
    // Short delay then navigate to creation flow with prefilled data
    setTimeout(() => {
      setIsCreating(false);
      if (onQuickCreate) {
        onQuickCreate('landing');
      }
    }, 300);
  };

  return (
    <div className="flex h-full relative">
      {/* Main Content */}
      <div className={cn("flex-1 space-y-5 p-5 overflow-y-auto transition-all", showTrudyPanel && "pr-2")}>
        
        {/* Simple Form Hero - Like a Lead Form */}
        <Card className="border-2 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent overflow-hidden">
          <CardContent className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Zap className="w-4 h-4" />
                30-Second Setup
              </div>
              <h1 className="text-2xl font-bold text-foreground">Create a Landing Page</h1>
              <p className="text-muted-foreground">Fill in 2 fields, AI does the rest</p>
            </div>

            {/* Super Simple Form */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  Business Name
                </label>
                <Input
                  placeholder="Your Company Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Target Location
                </label>
                <Input
                  placeholder="e.g., Los Angeles or Nationwide"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
            </div>

            <Button 
              className="w-full h-12 gap-2 text-base"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}
              onClick={handleQuickCreate}
              disabled={!businessName || !location || isCreating}
            >
              <Sparkles className="w-5 h-5" />
              Create My Landing Page
              <ArrowRight className="w-5 h-5" />
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              ✨ AI generates headlines, copy, trust badges, forms, and SEO automatically
            </p>
          </CardContent>
        </Card>

        {/* Quick Links Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Create Ad', icon: Target, color: '#7C3AED', type: 'ad' as const },
            { label: 'Full Campaign', icon: Rocket, color: '#F59E0B', type: 'campaign' as const },
            { label: 'View Analytics', icon: BarChart3, color: '#10B981', onClick: () => onNavigate('performance') },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => item.onClick ? item.onClick() : onQuickCreate?.(item.type!)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/50 transition-all group"
            >
              <item.icon className="w-4 h-4" style={{ color: item.color }} />
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Connected Accounts Panel */}
        <ConnectedAccountsPanel compact liveMode={liveMode} />

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