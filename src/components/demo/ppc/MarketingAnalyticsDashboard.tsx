 import { useState } from "react";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
 import { ScrollArea } from "@/components/ui/scroll-area";
 import {
   TrendingUp, TrendingDown, DollarSign, Users, Globe, Target,
   Smartphone, Monitor, MapPin, BarChart3, PieChart, Hash, Zap,
   CheckCircle2, AlertTriangle, ArrowRight, ExternalLink, Star
 } from "lucide-react";
 
 interface KeywordData {
   keyword: string;
   clicks: number;
   impressions: number;
   ctr: number;
   conversions: number;
   cpa: number;
   trend: 'up' | 'down' | 'stable';
   recommendation: string;
 }
 
 interface PlatformData {
   platform: string;
   spend: number;
   conversions: number;
   cpa: number;
   roas: number;
   trending: 'up' | 'down' | 'stable';
 }
 
 interface GeographicData {
   state: string;
   city: string;
   conversions: number;
   revenue: number;
   convRate: number;
 }
 
 interface DemographicData {
   segment: string;
   percentage: number;
   conversions: number;
   avgOrderValue: number;
   device: string;
 }
 
 // Best performing mock data
 const BEST_KEYWORDS: KeywordData[] = [
   { keyword: "ai moving estimate", clicks: 1847, impressions: 23400, ctr: 7.89, conversions: 289, cpa: 8.09, trend: 'up', recommendation: "🏆 TOP PERFORMER - 340% YoY growth, lowest CPA. Increase budget 50%" },
   { keyword: "cross country movers near me", clicks: 3892, impressions: 67340, ctr: 5.78, conversions: 387, cpa: 18.40, trend: 'up', recommendation: "Local intent signals immediate need. 42% higher conversion rate" },
   { keyword: "long distance moving company", clicks: 4521, impressions: 89420, ctr: 5.06, conversions: 412, cpa: 20.01, trend: 'up', recommendation: "High intent + low competition. Users 3.2x more likely to convert" },
   { keyword: "moving cost calculator", clicks: 5124, impressions: 124500, ctr: 4.12, conversions: 298, cpa: 16.41, trend: 'stable', recommendation: "Tool-based intent captures early funnel. Create dedicated calculator page" },
   { keyword: "furniture moving service", clicks: 2129, impressions: 45670, ctr: 4.66, conversions: 178, cpa: 22.36, trend: 'stable', recommendation: "Specific service intent. Users often bundle with full-service moves" },
 ];
 
 const BEST_PLATFORMS: PlatformData[] = [
   { platform: "Google Search", spend: 12450, conversions: 892, cpa: 13.96, roas: 4.2, trending: 'up' },
   { platform: "Google Display", spend: 4230, conversions: 234, cpa: 18.08, roas: 2.8, trending: 'stable' },
   { platform: "Meta (Facebook/IG)", spend: 6780, conversions: 412, cpa: 16.46, roas: 3.1, trending: 'up' },
   { platform: "Microsoft Ads", spend: 2340, conversions: 156, cpa: 15.00, roas: 3.4, trending: 'up' },
   { platform: "TikTok", spend: 1890, conversions: 89, cpa: 21.24, roas: 1.9, trending: 'down' },
 ];
 
 const BEST_LOCATIONS: GeographicData[] = [
   { state: "California", city: "Los Angeles", conversions: 521, revenue: 78150, convRate: 7.61 },
   { state: "Texas", city: "Houston", conversions: 398, revenue: 59700, convRate: 7.60 },
   { state: "Florida", city: "Miami", conversions: 367, revenue: 55050, convRate: 7.50 },
   { state: "New York", city: "NYC", conversions: 289, revenue: 43350, convRate: 8.10 },
   { state: "Arizona", city: "Phoenix", conversions: 167, revenue: 25050, convRate: 7.82 },
 ];
 
 const BEST_DEMOGRAPHICS: DemographicData[] = [
   { segment: "Homeowners 35-54", percentage: 38, conversions: 812, avgOrderValue: 3240, device: "Desktop 62%" },
   { segment: "Young Professionals 25-34", percentage: 28, conversions: 492, avgOrderValue: 2180, device: "Mobile 71%" },
   { segment: "Retirees 55+", percentage: 18, conversions: 378, avgOrderValue: 4120, device: "Desktop 78%" },
   { segment: "Corporate Relocation", percentage: 4, conversions: 54, avgOrderValue: 8900, device: "Desktop 91%" },
 ];
 
 interface MarketingAnalyticsDashboardProps {
   onProceedToCreate: () => void;
 }
 
 export function MarketingAnalyticsDashboard({ onProceedToCreate }: MarketingAnalyticsDashboardProps) {
   const [activeTab, setActiveTab] = useState<'keywords' | 'platforms' | 'geo' | 'demo' | 'seo'>('keywords');
 
   const totalSpend = BEST_PLATFORMS.reduce((sum, p) => sum + p.spend, 0);
   const totalConversions = BEST_PLATFORMS.reduce((sum, p) => sum + p.conversions, 0);
   const avgCPA = totalSpend / totalConversions;
   const avgROAS = BEST_PLATFORMS.reduce((sum, p) => sum + p.roas, 0) / BEST_PLATFORMS.length;
 
   return (
     <div className="space-y-6">
       {/* Header Stats */}
       <div className="grid grid-cols-4 gap-4">
         <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-muted-foreground">Total Spend</p>
                 <p className="text-2xl font-bold">${totalSpend.toLocaleString()}</p>
               </div>
               <DollarSign className="w-8 h-8 text-green-500" />
             </div>
           </CardContent>
         </Card>
         <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-muted-foreground">Conversions</p>
                 <p className="text-2xl font-bold">{totalConversions.toLocaleString()}</p>
               </div>
               <Users className="w-8 h-8 text-blue-500" />
             </div>
           </CardContent>
         </Card>
         <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-muted-foreground">Avg. CPA</p>
                 <p className="text-2xl font-bold">${avgCPA.toFixed(2)}</p>
               </div>
               <Target className="w-8 h-8 text-purple-500" />
             </div>
           </CardContent>
         </Card>
         <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-muted-foreground">Avg. ROAS</p>
                 <p className="text-2xl font-bold">{avgROAS.toFixed(1)}x</p>
               </div>
               <TrendingUp className="w-8 h-8 text-amber-500" />
             </div>
           </CardContent>
         </Card>
       </div>
 
       {/* Tabs */}
       <div className="flex items-center gap-2 border-b pb-2">
         {[
           { id: 'keywords', label: 'Keywords', icon: Hash },
           { id: 'platforms', label: 'Platforms', icon: BarChart3 },
           { id: 'geo', label: 'Geographic', icon: Globe },
           { id: 'demo', label: 'Demographics', icon: Users },
           { id: 'seo', label: 'SEO Insights', icon: Target },
         ].map(tab => (
           <Button
             key={tab.id}
             variant={activeTab === tab.id ? 'default' : 'ghost'}
             size="sm"
             onClick={() => setActiveTab(tab.id as typeof activeTab)}
             className="gap-1.5"
           >
             <tab.icon className="w-3.5 h-3.5" />
             {tab.label}
           </Button>
         ))}
       </div>
 
       {/* Tab Content */}
       <ScrollArea className="h-[400px]">
         {activeTab === 'keywords' && (
           <div className="space-y-3">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold flex items-center gap-2">
                 <Star className="w-4 h-4 text-amber-500" />
                 Top Performing Keywords
               </h3>
               <Badge className="bg-green-500/10 text-green-600 border-green-500/30">Sorted by ROI</Badge>
             </div>
             {BEST_KEYWORDS.map((kw, i) => (
               <Card key={i} className={i === 0 ? 'border-green-500/50 bg-green-500/5' : ''}>
                 <CardContent className="p-4">
                   <div className="flex items-start justify-between mb-2">
                     <div className="flex items-center gap-2">
                       {i === 0 && <Badge className="bg-amber-500 text-white">🏆 #1</Badge>}
                       <span className="font-medium">{kw.keyword}</span>
                       {kw.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                       {kw.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                     </div>
                     <Badge variant="outline" className="text-xs">${kw.cpa.toFixed(2)} CPA</Badge>
                   </div>
                   <div className="grid grid-cols-4 gap-4 text-sm mb-2">
                     <div><span className="text-muted-foreground">Clicks:</span> {kw.clicks.toLocaleString()}</div>
                     <div><span className="text-muted-foreground">CTR:</span> {kw.ctr.toFixed(2)}%</div>
                     <div><span className="text-muted-foreground">Conv:</span> {kw.conversions}</div>
                     <div><span className="text-muted-foreground">Impr:</span> {kw.impressions.toLocaleString()}</div>
                   </div>
                   <p className="text-sm text-muted-foreground bg-muted/50 rounded px-2 py-1">{kw.recommendation}</p>
                 </CardContent>
               </Card>
             ))}
           </div>
         )}
 
         {activeTab === 'platforms' && (
           <div className="space-y-3">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold flex items-center gap-2">
                 <BarChart3 className="w-4 h-4 text-blue-500" />
                 Platform Performance
               </h3>
               <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30">By ROAS</Badge>
             </div>
             {BEST_PLATFORMS.sort((a, b) => b.roas - a.roas).map((p, i) => (
               <Card key={i} className={p.roas >= 4 ? 'border-green-500/50 bg-green-500/5' : p.roas < 2 ? 'border-red-500/30 bg-red-500/5' : ''}>
                 <CardContent className="p-4">
                   <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2">
                       <span className="font-medium">{p.platform}</span>
                       {p.trending === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                       {p.trending === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                     </div>
                     <div className="flex items-center gap-2">
                       <Badge variant={p.roas >= 3 ? 'default' : 'destructive'}>{p.roas}x ROAS</Badge>
                       {p.roas < 2 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                     </div>
                   </div>
                   <div className="grid grid-cols-3 gap-4 text-sm">
                     <div><span className="text-muted-foreground">Spend:</span> ${p.spend.toLocaleString()}</div>
                     <div><span className="text-muted-foreground">Conversions:</span> {p.conversions}</div>
                     <div><span className="text-muted-foreground">CPA:</span> ${p.cpa.toFixed(2)}</div>
                   </div>
                 </CardContent>
               </Card>
             ))}
             <div className="mt-4 p-4 bg-muted/30 rounded-lg">
               <p className="text-sm font-medium mb-1">💡 AI Recommendation:</p>
               <p className="text-sm text-muted-foreground">Shift 20% of TikTok budget to Google Search for better ROAS. Consider pausing TikTok until creative refresh.</p>
             </div>
           </div>
         )}
 
         {activeTab === 'geo' && (
           <div className="space-y-3">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold flex items-center gap-2">
                 <Globe className="w-4 h-4 text-green-500" />
                 Top Performing Locations
               </h3>
               <Badge className="bg-green-500/10 text-green-600 border-green-500/30">By Revenue</Badge>
             </div>
             {BEST_LOCATIONS.map((loc, i) => (
               <Card key={i}>
                 <CardContent className="p-4">
                   <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-muted-foreground" />
                       <span className="font-medium">{loc.state}</span>
                       <span className="text-sm text-muted-foreground">({loc.city})</span>
                     </div>
                     <Badge variant="outline">${loc.revenue.toLocaleString()} revenue</Badge>
                   </div>
                   <div className="grid grid-cols-2 gap-4 text-sm">
                     <div><span className="text-muted-foreground">Conversions:</span> {loc.conversions}</div>
                     <div><span className="text-muted-foreground">Conv Rate:</span> {loc.convRate}%</div>
                   </div>
                 </CardContent>
               </Card>
             ))}
             <div className="mt-4 p-4 bg-muted/30 rounded-lg">
               <p className="text-sm font-medium mb-1">💡 AI Recommendation:</p>
               <p className="text-sm text-muted-foreground">New York has highest conv rate (8.10%) but lower volume. Increase geo-targeting budget 25% for NYC metro.</p>
             </div>
           </div>
         )}
 
         {activeTab === 'demo' && (
           <div className="space-y-3">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold flex items-center gap-2">
                 <Users className="w-4 h-4 text-purple-500" />
                 Best Converting Demographics
               </h3>
               <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30">By AOV</Badge>
             </div>
             {BEST_DEMOGRAPHICS.map((demo, i) => (
               <Card key={i}>
                 <CardContent className="p-4">
                   <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2">
                       <span className="font-medium">{demo.segment}</span>
                       <Badge variant="secondary" className="text-xs">{demo.percentage}% of traffic</Badge>
                     </div>
                     <Badge className="bg-green-500/10 text-green-600">${demo.avgOrderValue.toLocaleString()} AOV</Badge>
                   </div>
                   <div className="grid grid-cols-2 gap-4 text-sm">
                     <div><span className="text-muted-foreground">Conversions:</span> {demo.conversions}</div>
                     <div className="flex items-center gap-1">
                       {demo.device.includes('Mobile') ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                       <span className="text-muted-foreground">{demo.device}</span>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             ))}
             <div className="mt-4 p-4 bg-muted/30 rounded-lg">
               <p className="text-sm font-medium mb-1">💡 AI Recommendation:</p>
               <p className="text-sm text-muted-foreground">Corporate Relocation segment has $8,900 AOV (highest). Create dedicated B2B landing page with case studies.</p>
             </div>
           </div>
         )}
 
         {activeTab === 'seo' && (
           <div className="space-y-4">
             <Card>
               <CardHeader className="pb-2">
                 <CardTitle className="text-base flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4 text-green-500" />
                   SEO Opportunities
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                 <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                   <p className="font-medium text-sm">"ai moving estimate" - Position 1.2</p>
                   <p className="text-xs text-muted-foreground">Emerging keyword with 340% YoY growth. Create pillar content page.</p>
                 </div>
                 <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                   <p className="font-medium text-sm">"moving cost calculator [city]" - Low competition</p>
                   <p className="text-xs text-muted-foreground">Create city-specific calculator pages for local SEO boost.</p>
                 </div>
                 <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                   <p className="font-medium text-sm">"cross country moving tips 2025" - Featured snippet opportunity</p>
                   <p className="text-xs text-muted-foreground">Create comprehensive guide to capture featured snippet.</p>
                 </div>
               </CardContent>
             </Card>
 
             {/* Domain Purchase CTA */}
             <Card className="border-primary/30 bg-primary/5">
               <CardContent className="p-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <h4 className="font-semibold mb-1">Need a Domain?</h4>
                     <p className="text-sm text-muted-foreground">Register your landing page domain</p>
                   </div>
                   <Button variant="outline" size="sm" className="gap-1.5" asChild>
                     <a href="https://www.godaddy.com/domains" target="_blank" rel="noopener noreferrer">
                       Buy Domain <ExternalLink className="w-3.5 h-3.5" />
                     </a>
                   </Button>
                 </div>
               </CardContent>
             </Card>
           </div>
         )}
       </ScrollArea>
 
       {/* Action Button */}
       <div className="pt-4 border-t">
         <Button onClick={onProceedToCreate} className="w-full gap-2" size="lg">
           <Zap className="w-4 h-4" />
           Create Landing Page Based on This Data
           <ArrowRight className="w-4 h-4" />
         </Button>
         <p className="text-xs text-center text-muted-foreground mt-2">
           AI will pre-populate targeting based on your best performing segments
         </p>
       </div>
     </div>
   );
 }