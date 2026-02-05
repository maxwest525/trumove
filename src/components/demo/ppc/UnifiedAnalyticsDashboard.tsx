 import { useState } from "react";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
 import { ScrollArea } from "@/components/ui/scroll-area";
 import { Progress } from "@/components/ui/progress";
 import {
   TrendingUp, TrendingDown, DollarSign, Users, Globe, Target,
   Smartphone, Monitor, MapPin, BarChart3, PieChart, Hash, Zap,
   CheckCircle2, AlertTriangle, Star, Search, Layout, FlaskConical,
   ArrowRight, MousePointer, Eye, Clock, Percent
 } from "lucide-react";
 
export interface AnalyticsPrefillData {
  keywords: string[];
  locations: string[];
  audience: string;
  topKeyword: string;
  avgCPA: number;
  topLocation: string;
}

interface UnifiedAnalyticsDashboardProps {
  onCreateLandingPage: (prefillData: AnalyticsPrefillData) => void;
  liveMode?: boolean;
}
 
 // Consolidated data
 const KEYWORDS_DATA = [
   { keyword: "ai moving estimate", clicks: 1847, ctr: 7.89, conversions: 289, cpa: 8.09, trend: 'up' as const, position: 1.2 },
   { keyword: "cross country movers near me", clicks: 3892, ctr: 5.78, conversions: 387, cpa: 18.40, trend: 'up' as const, position: 3.4 },
   { keyword: "long distance moving company", clicks: 4521, ctr: 5.06, conversions: 412, cpa: 20.01, trend: 'up' as const, position: 2.1 },
   { keyword: "moving cost calculator", clicks: 5124, ctr: 4.12, conversions: 298, cpa: 16.41, trend: 'stable' as const, position: 4.8 },
   { keyword: "furniture moving service", clicks: 2129, ctr: 4.66, conversions: 178, cpa: 22.36, trend: 'down' as const, position: 5.2 },
 ];
 
 const PLATFORM_DATA = [
   { platform: "Google Search", spend: 12450, conversions: 892, cpa: 13.96, roas: 4.2, trending: 'up' as const },
   { platform: "Google Display", spend: 4230, conversions: 234, cpa: 18.08, roas: 2.8, trending: 'stable' as const },
   { platform: "Meta (FB/IG)", spend: 6780, conversions: 412, cpa: 16.46, roas: 3.1, trending: 'up' as const },
   { platform: "Microsoft Ads", spend: 2340, conversions: 156, cpa: 15.00, roas: 3.4, trending: 'up' as const },
 ];
 
 const GEO_DATA = [
   { state: "California", city: "Los Angeles", conversions: 521, revenue: 78150, rate: 7.61 },
   { state: "Texas", city: "Houston", conversions: 398, revenue: 59700, rate: 7.60 },
   { state: "Florida", city: "Miami", conversions: 367, revenue: 55050, rate: 7.50 },
   { state: "New York", city: "NYC", conversions: 289, revenue: 43350, rate: 8.10 },
 ];
 
 const DEMO_DATA = [
   { segment: "Homeowners 35-54", percentage: 38, conversions: 812, aov: 3240, device: "Desktop" },
   { segment: "Young Professionals 25-34", percentage: 28, conversions: 492, aov: 2180, device: "Mobile" },
   { segment: "Retirees 55+", percentage: 18, conversions: 378, aov: 4120, device: "Desktop" },
   { segment: "Corporate Relocation", percentage: 4, conversions: 54, aov: 8900, device: "Desktop" },
 ];
 
 const SEO_SCORES = [
   { label: "Performance", score: 87, color: "#10B981" },
   { label: "Accessibility", score: 92, color: "#3B82F6" },
   { label: "Best Practices", score: 85, color: "#8B5CF6" },
   { label: "SEO", score: 94, color: "#F59E0B" },
 ];
 
 const AB_TESTS = [
   { name: "Homepage Hero CTA", status: "running", winner: "Variant A", lift: "+24.6%", confidence: 94 },
   { name: "Quote Form Layout", status: "running", winner: "Multi Step", lift: "+29.0%", confidence: 89 },
   { name: "Pricing Display", status: "completed", winner: "Starting At", lift: "+28.4%", confidence: 98 },
 ];
 
 const FUNNEL_DATA = [
   { stage: "Landing Views", count: 28450, rate: 100 },
   { stage: "Quote Started", count: 8234, rate: 28.9 },
   { stage: "Quote Completed", count: 2847, rate: 10.0 },
   { stage: "Booking Made", count: 847, rate: 3.0 },
 ];
 
export function UnifiedAnalyticsDashboard({ onCreateLandingPage, liveMode }: UnifiedAnalyticsDashboardProps) {
  // Totals
  const totalSpend = PLATFORM_DATA.reduce((sum, p) => sum + p.spend, 0);
  const totalConversions = PLATFORM_DATA.reduce((sum, p) => sum + p.conversions, 0);
  const avgCPA = totalSpend / totalConversions;
  const avgROAS = PLATFORM_DATA.reduce((sum, p) => sum + p.roas, 0) / PLATFORM_DATA.length;
  const totalClicks = KEYWORDS_DATA.reduce((sum, k) => sum + k.clicks, 0);
  const avgCTR = KEYWORDS_DATA.reduce((sum, k) => sum + k.ctr, 0) / KEYWORDS_DATA.length;

  // Build prefill data from analytics
  const handleCreateLandingPage = () => {
    const prefillData: AnalyticsPrefillData = {
      keywords: KEYWORDS_DATA.map(k => k.keyword),
      locations: GEO_DATA.map(g => `${g.city}, ${g.state}`),
      audience: DEMO_DATA.sort((a, b) => b.conversions - a.conversions)[0]?.segment || "Homeowners",
      topKeyword: KEYWORDS_DATA.sort((a, b) => b.conversions - a.conversions)[0]?.keyword || "",
      avgCPA: avgCPA,
      topLocation: `${GEO_DATA[0]?.city}, ${GEO_DATA[0]?.state}`,
    };
    onCreateLandingPage(prefillData);
  };
 
   return (
     <ScrollArea className="h-full">
       <div className="p-4 space-y-4">
         {/* KPI Strip - 8 Key Metrics */}
         <div className="grid grid-cols-8 gap-2">
           {[
             { label: "Spend", value: `$${(totalSpend / 1000).toFixed(1)}K`, icon: DollarSign, color: "#10B981" },
             { label: "Clicks", value: totalClicks.toLocaleString(), icon: MousePointer, color: "#3B82F6" },
             { label: "CTR", value: `${avgCTR.toFixed(1)}%`, icon: Percent, color: "#8B5CF6" },
             { label: "Conversions", value: totalConversions.toLocaleString(), icon: Target, color: "#EC4899" },
             { label: "CPA", value: `$${avgCPA.toFixed(0)}`, icon: DollarSign, color: "#F59E0B" },
             { label: "ROAS", value: `${avgROAS.toFixed(1)}x`, icon: TrendingUp, color: "#10B981" },
             { label: "SEO Score", value: "87", icon: Globe, color: "#3B82F6" },
             { label: "A/B Lifts", value: "+27%", icon: FlaskConical, color: "#EC4899" },
           ].map((stat) => (
             <div key={stat.label} className="p-2 rounded-lg bg-muted/50 border border-border text-center">
               <stat.icon className="w-4 h-4 mx-auto mb-1" style={{ color: stat.color }} />
               <p className="text-sm font-bold text-foreground">{stat.value}</p>
               <p className="text-[10px] text-muted-foreground">{stat.label}</p>
             </div>
           ))}
         </div>
 
         {/* Main Grid - 3 Columns */}
         <div className="grid grid-cols-3 gap-4">
           {/* Column 1: Keywords + SEO */}
           <div className="space-y-4">
             {/* Top Keywords */}
             <Card className="border-border">
               <CardHeader className="pb-2 pt-3 px-3">
                 <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                   <Hash className="w-3.5 h-3.5 text-amber-500" />
                   Top Keywords
                   {liveMode && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                 </CardTitle>
               </CardHeader>
               <CardContent className="px-3 pb-3 space-y-1.5">
                 {KEYWORDS_DATA.slice(0, 5).map((kw, i) => (
                   <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                     <div className="flex items-center gap-2 min-w-0">
                       <span className="text-[10px] text-muted-foreground w-3">{i + 1}.</span>
                       <span className="text-xs font-medium truncate">{kw.keyword}</span>
                       {kw.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500 shrink-0" />}
                       {kw.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500 shrink-0" />}
                     </div>
                     <div className="flex items-center gap-2 shrink-0">
                       <Badge variant="outline" className="text-[9px] h-4">{kw.ctr}% CTR</Badge>
                       <Badge className="text-[9px] h-4 bg-green-500/10 text-green-600">${kw.cpa}</Badge>
                     </div>
                   </div>
                 ))}
               </CardContent>
             </Card>
 
             {/* SEO Scores */}
             <Card className="border-border">
               <CardHeader className="pb-2 pt-3 px-3">
                 <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                   <Globe className="w-3.5 h-3.5 text-blue-500" />
                   SEO Scores
                 </CardTitle>
               </CardHeader>
               <CardContent className="px-3 pb-3 space-y-2">
                 {SEO_SCORES.map((item) => (
                   <div key={item.label} className="space-y-1">
                     <div className="flex justify-between text-xs">
                       <span className="text-muted-foreground">{item.label}</span>
                       <span className="font-medium" style={{ color: item.color }}>{item.score}</span>
                     </div>
                     <Progress value={item.score} className="h-1.5" />
                   </div>
                 ))}
               </CardContent>
             </Card>
 
             {/* SEO Issues Quick List */}
             <Card className="border-border">
               <CardHeader className="pb-2 pt-3 px-3">
                 <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                   <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                   SEO Issues
                 </CardTitle>
               </CardHeader>
               <CardContent className="px-3 pb-3 space-y-1.5">
                 <div className="flex items-center gap-2 text-xs">
                   <span className="w-2 h-2 rounded-full bg-red-500" />
                   <span className="text-muted-foreground">Missing meta on /services</span>
                 </div>
                 <div className="flex items-center gap-2 text-xs">
                   <span className="w-2 h-2 rounded-full bg-amber-500" />
                   <span className="text-muted-foreground">H1 too long (72 chars)</span>
                 </div>
                 <div className="flex items-center gap-2 text-xs">
                   <span className="w-2 h-2 rounded-full bg-amber-500" />
                   <span className="text-muted-foreground">3 images missing alt</span>
                 </div>
                 <div className="flex items-center gap-2 text-xs">
                   <CheckCircle2 className="w-3 h-3 text-green-500" />
                   <span className="text-muted-foreground">SSL + Mobile OK</span>
                 </div>
               </CardContent>
             </Card>
           </div>
 
           {/* Column 2: Platforms + A/B Tests */}
           <div className="space-y-4">
             {/* Platform Performance */}
             <Card className="border-border">
               <CardHeader className="pb-2 pt-3 px-3">
                 <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                   <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
                   Platform ROAS
                   {liveMode && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                 </CardTitle>
               </CardHeader>
               <CardContent className="px-3 pb-3 space-y-2">
                 {PLATFORM_DATA.map((p) => (
                   <div key={p.platform} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                     <div className="flex items-center gap-2">
                       <span className="text-xs font-medium">{p.platform}</span>
                       {p.trending === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="text-[10px] text-muted-foreground">${(p.spend / 1000).toFixed(1)}K</span>
                       <Badge variant={p.roas >= 3.5 ? 'default' : p.roas >= 2.5 ? 'secondary' : 'destructive'} className="text-[9px] h-4">
                         {p.roas}x
                       </Badge>
                     </div>
                   </div>
                 ))}
               </CardContent>
             </Card>
 
             {/* A/B Tests */}
             <Card className="border-border">
               <CardHeader className="pb-2 pt-3 px-3">
                 <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                   <FlaskConical className="w-3.5 h-3.5 text-pink-500" />
                   A/B Test Results
                 </CardTitle>
               </CardHeader>
               <CardContent className="px-3 pb-3 space-y-2">
                 {AB_TESTS.map((test) => (
                   <div key={test.name} className="p-2 rounded-lg bg-muted/50 space-y-1">
                     <div className="flex items-center justify-between">
                       <span className="text-xs font-medium">{test.name}</span>
                       <Badge variant={test.status === 'running' ? 'default' : 'secondary'} className="text-[9px] h-4">
                         {test.status}
                       </Badge>
                     </div>
                     <div className="flex items-center justify-between text-[10px]">
                       <span className="text-muted-foreground">Winner: {test.winner}</span>
                       <span className="text-green-600 font-medium">{test.lift}</span>
                     </div>
                     <Progress value={test.confidence} className="h-1" />
                     <span className="text-[9px] text-muted-foreground">{test.confidence}% confidence</span>
                   </div>
                 ))}
               </CardContent>
             </Card>
 
             {/* Conversion Funnel */}
             <Card className="border-border">
               <CardHeader className="pb-2 pt-3 px-3">
                 <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                   <Target className="w-3.5 h-3.5 text-green-500" />
                   Conversion Funnel
                 </CardTitle>
               </CardHeader>
               <CardContent className="px-3 pb-3 space-y-2">
                 {FUNNEL_DATA.map((stage, i) => (
                   <div key={stage.stage} className="space-y-1">
                     <div className="flex justify-between text-xs">
                       <span className="text-muted-foreground">{stage.stage}</span>
                       <span className="font-medium">{stage.count.toLocaleString()}</span>
                     </div>
                     <div className="h-3 bg-muted rounded-full overflow-hidden">
                       <div 
                         className="h-full rounded-full transition-all"
                         style={{ 
                           width: `${stage.rate}%`,
                           background: `linear-gradient(90deg, #10B981 0%, #3B82F6 100%)`,
                           opacity: 1 - (i * 0.15)
                         }}
                       />
                     </div>
                     <span className="text-[9px] text-muted-foreground">{stage.rate}%</span>
                   </div>
                 ))}
               </CardContent>
             </Card>
           </div>
 
           {/* Column 3: Geo + Demographics */}
           <div className="space-y-4">
             {/* Geographic Performance */}
             <Card className="border-border">
               <CardHeader className="pb-2 pt-3 px-3">
                 <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                   <MapPin className="w-3.5 h-3.5 text-red-500" />
                   Top Locations
                 </CardTitle>
               </CardHeader>
               <CardContent className="px-3 pb-3 space-y-1.5">
                 {GEO_DATA.map((loc) => (
                   <div key={loc.city} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                     <div className="flex items-center gap-2">
                       <span className="text-xs font-medium">{loc.city}</span>
                       <span className="text-[10px] text-muted-foreground">{loc.state}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="text-[10px] text-muted-foreground">{loc.conversions}</span>
                       <Badge variant="outline" className="text-[9px] h-4">{loc.rate}%</Badge>
                     </div>
                   </div>
                 ))}
               </CardContent>
             </Card>
 
             {/* Demographics */}
             <Card className="border-border">
               <CardHeader className="pb-2 pt-3 px-3">
                 <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                   <Users className="w-3.5 h-3.5 text-indigo-500" />
                   Demographics
                 </CardTitle>
               </CardHeader>
               <CardContent className="px-3 pb-3 space-y-2">
                 {DEMO_DATA.map((demo) => (
                   <div key={demo.segment} className="p-2 rounded-lg bg-muted/50 space-y-1">
                     <div className="flex items-center justify-between">
                       <span className="text-xs font-medium">{demo.segment}</span>
                       <Badge className="text-[9px] h-4 bg-green-500/10 text-green-600">${demo.aov}</Badge>
                     </div>
                     <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                       <span>{demo.percentage}% of traffic</span>
                       <div className="flex items-center gap-1">
                         {demo.device === "Mobile" ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                         {demo.device}
                       </div>
                     </div>
                   </div>
                 ))}
               </CardContent>
             </Card>
 
             {/* AI Recommendations */}
             <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
               <CardHeader className="pb-2 pt-3 px-3">
                 <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                   <Zap className="w-3.5 h-3.5 text-primary" />
                   AI Recommendations
                 </CardTitle>
               </CardHeader>
               <CardContent className="px-3 pb-3 space-y-2 text-xs">
                 <div className="p-2 rounded bg-background/50">
                   <span className="text-green-600">↑</span> Increase NYC budget 25% (8.1% conv rate)
                 </div>
                 <div className="p-2 rounded bg-background/50">
                   <span className="text-amber-600">→</span> Shift TikTok spend to Google (1.9x vs 4.2x ROAS)
                 </div>
                 <div className="p-2 rounded bg-background/50">
                   <span className="text-blue-600">+</span> Add B2B targeting ($8,900 AOV segment)
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
 
         {/* Action Bar */}
         <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-pink-500/5">
           <CardContent className="p-3 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Star className="w-5 h-5 text-primary" />
               <div>
                 <p className="text-sm font-medium">Ready to optimize?</p>
                 <p className="text-xs text-muted-foreground">Create an AI-powered landing page based on these insights</p>
               </div>
             </div>
            <Button onClick={handleCreateLandingPage} className="gap-2" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>
              <Layout className="w-4 h-4" />
              Create Landing Page Based on This Data
              <ArrowRight className="w-4 h-4" />
            </Button>
           </CardContent>
         </Card>
       </div>
     </ScrollArea>
   );
 }