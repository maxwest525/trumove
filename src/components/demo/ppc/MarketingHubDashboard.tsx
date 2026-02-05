 import { Button } from "@/components/ui/button";
 import { Card, CardContent } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import {
  Layout, TrendingUp, Zap, Search, Globe, FlaskConical,
  ArrowRight, Target, Users, DollarSign, BarChart3,
  Play, Sparkles, MessageSquare, Bot, ChevronRight
 } from "lucide-react";
import { TrudyMarketingChat } from "./TrudyMarketingChat";
import { useState } from "react";
 
 interface FeatureCard {
   id: string;
   title: string;
   description: string;
   icon: React.ElementType;
   stats: { label: string; value: string };
   color: string;
   gradient: string;
 }
 
 interface MarketingHubDashboardProps {
   onNavigate: (section: string) => void;
   stats: {
     totalSpend: number;
     conversions: number;
     activePages: number;
     testsRunning: number;
   };
 }
 
 const FEATURE_CARDS: FeatureCard[] = [
   {
     id: 'landing',
     title: 'Create Landing Page',
     description: 'Build high-converting pages with AI in minutes',
     icon: Layout,
     stats: { label: 'Active Pages', value: '4' },
     color: '#7C3AED',
     gradient: 'from-purple-500/20 to-purple-600/10',
   },
   {
     id: 'performance',
     title: 'Track Performance',
     description: 'See real-time analytics & conversion data',
     icon: TrendingUp,
     stats: { label: 'This Week', value: '+24%' },
     color: '#10B981',
     gradient: 'from-emerald-500/20 to-emerald-600/10',
   },
   {
     id: 'abtest',
     title: 'Run A/B Tests',
     description: 'Optimize with data-driven experiments',
     icon: FlaskConical,
     stats: { label: 'Tests Running', value: '2' },
     color: '#EC4899',
     gradient: 'from-pink-500/20 to-pink-600/10',
   },
   {
     id: 'keywords',
     title: 'Find Keywords',
     description: 'Discover high-intent search terms',
     icon: Search,
     stats: { label: 'Opportunities', value: '28' },
     color: '#F59E0B',
     gradient: 'from-amber-500/20 to-amber-600/10',
   },
   {
     id: 'seo',
     title: 'Check SEO Score',
     description: 'Audit & fix technical issues',
     icon: Globe,
     stats: { label: 'Score', value: '87/100' },
     color: '#3B82F6',
     gradient: 'from-blue-500/20 to-blue-600/10',
   },
   {
     id: 'campaigns',
     title: 'Optimize Campaigns',
     description: 'AI-powered ad optimization',
     icon: Zap,
     stats: { label: 'ROAS', value: '4.2x' },
     color: '#EF4444',
     gradient: 'from-red-500/20 to-red-600/10',
   },
 ];
 
export function MarketingHubDashboard({ onNavigate, stats }: MarketingHubDashboardProps) {
  const [showTrudyPanel, setShowTrudyPanel] = useState(true);

   return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-1 space-y-6 p-4 overflow-y-auto transition-all ${showTrudyPanel ? 'pr-2' : ''}`}>
       {/* Welcome Header */}
       <div className="text-center space-y-2 py-4">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
           <Sparkles className="w-4 h-4" />
           Your Marketing Hub
         </div>
         <h2 className="text-2xl font-bold text-foreground">What do you want to do?</h2>
         <p className="text-muted-foreground max-w-md mx-auto">
           Choose an action below to get started. AI will guide you through each step.
         </p>
       </div>
 
       {/* Quick Stats Bar */}
       <div className="grid grid-cols-4 gap-3">
         {[
           { label: 'Total Spend', value: `$${stats.totalSpend.toLocaleString()}`, icon: DollarSign, color: '#7C3AED' },
           { label: 'Conversions', value: stats.conversions.toString(), icon: Target, color: '#10B981' },
           { label: 'Active Pages', value: stats.activePages.toString(), icon: Layout, color: '#3B82F6' },
           { label: 'Tests Running', value: stats.testsRunning.toString(), icon: FlaskConical, color: '#EC4899' },
         ].map((stat) => (
           <div 
             key={stat.label} 
             className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border"
           >
             <div 
               className="w-9 h-9 rounded-lg flex items-center justify-center"
               style={{ background: `${stat.color}15` }}
             >
               <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
             </div>
             <div>
               <p className="text-lg font-bold text-foreground">{stat.value}</p>
               <p className="text-xs text-muted-foreground">{stat.label}</p>
             </div>
           </div>
         ))}
       </div>
 
       {/* Feature Cards Grid */}
       <div className="grid grid-cols-3 gap-4">
         {FEATURE_CARDS.map((card) => (
           <Card 
             key={card.id}
             className={`group cursor-pointer border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 bg-gradient-to-br ${card.gradient}`}
             onClick={() => onNavigate(card.id)}
           >
             <CardContent className="p-5 space-y-4">
               <div className="flex items-start justify-between">
                 <div 
                   className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                   style={{ background: `${card.color}20` }}
                 >
                   <card.icon className="w-6 h-6" style={{ color: card.color }} />
                 </div>
                 <Badge variant="secondary" className="text-xs">
                   {card.stats.label}: {card.stats.value}
                 </Badge>
               </div>
               
               <div>
                 <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                   {card.title}
                 </h3>
                 <p className="text-sm text-muted-foreground mt-1">
                   {card.description}
                 </p>
               </div>
 
               <Button 
                 variant="ghost" 
                 size="sm" 
                 className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
               >
                 Get Started
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Button>
             </CardContent>
           </Card>
         ))}
       </div>
 
       {/* Quick Create CTA */}
      <Card 
        className="border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => setShowTrudyPanel(true)}
      >
         <CardContent className="p-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Bot className="w-7 h-7 text-primary" />
             </div>
             <div>
              <h3 className="font-semibold text-lg text-foreground">Ask Trudy</h3>
               <p className="text-muted-foreground">
                "Create an ad with a llama" — Trudy designs & launches it for you
               </p>
             </div>
           </div>
           <Button 
             size="lg" 
             className="gap-2"
             style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}
            onClick={(e) => {
              e.stopPropagation();
              setShowTrudyPanel(true);
            }}
           >
            <MessageSquare className="w-4 h-4" />
            Chat with Trudy
           </Button>
         </CardContent>
       </Card>
      </div>

      {/* Trudy Chat Panel */}
      {showTrudyPanel && (
        <div className="w-[380px] border-l border-border flex flex-col bg-background">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Trudy AI Assistant</span>
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
          className="absolute right-4 bottom-4 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        >
          <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}
     </div>
   );
 }