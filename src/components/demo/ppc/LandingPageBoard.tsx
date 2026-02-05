 import { useState } from "react";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { ScrollArea } from "@/components/ui/scroll-area";
 import { Progress } from "@/components/ui/progress";
 import {
   Play, Pause, Trash2, Edit3, Eye, TrendingUp, TrendingDown,
   DollarSign, Users, Target, MoreVertical, Plus, ExternalLink,
  AlertTriangle, CheckCircle2, XCircle, Globe
 } from "lucide-react";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import { toast } from "sonner";
import { LandingPage } from "./types";
 
export const INITIAL_MOCK_PAGES: LandingPage[] = [
   {
     id: '1',
     name: 'AI Moving Quote - California',
     template: 'Quote Funnel',
     status: 'active',
     dailyBudget: 150,
     totalSpend: 2847,
     conversions: 234,
     conversionRate: 8.2,
     cpa: 12.17,
     trend: 'up',
     url: 'trumove.com/quote-ca',
     createdAt: '2025-01-15',
    performance: 'excellent',
    customDomain: 'moves.trumove.com',
    domainStatus: 'active'
   },
   {
     id: '2',
     name: 'Cost Calculator - Texas',
     template: 'Calculator',
     status: 'active',
     dailyBudget: 100,
     totalSpend: 1923,
     conversions: 145,
     conversionRate: 7.5,
     cpa: 13.26,
     trend: 'stable',
     url: 'trumove.com/calc-tx',
     createdAt: '2025-01-20',
    performance: 'good',
    customDomain: null,
    domainStatus: null
   },
   {
     id: '3',
     name: 'Comparison Page - National',
     template: 'Comparison',
     status: 'paused',
     dailyBudget: 75,
     totalSpend: 892,
     conversions: 42,
     conversionRate: 4.7,
     cpa: 21.24,
     trend: 'down',
     url: 'trumove.com/compare',
     createdAt: '2025-01-10',
    performance: 'poor',
    customDomain: null,
    domainStatus: null
   },
   {
     id: '4',
     name: 'Testimonial Focus - Florida',
     template: 'Testimonial',
     status: 'active',
     dailyBudget: 80,
     totalSpend: 567,
     conversions: 38,
     conversionRate: 6.7,
     cpa: 14.92,
     trend: 'up',
     url: 'trumove.com/reviews-fl',
     createdAt: '2025-01-28',
    performance: 'new',
    customDomain: null,
    domainStatus: null
   },
 ];
 
 interface LandingPageBoardProps {
   onCreateNew: () => void;
   onEditPage: (pageId: string) => void;
  pages: LandingPage[];
  onPagesChange: (pages: LandingPage[]) => void;
 }
 
export function LandingPageBoard({ onCreateNew, onEditPage, pages, onPagesChange }: LandingPageBoardProps) {
   const [budgetInputs, setBudgetInputs] = useState<Record<string, string>>({});
 
   const totalSpend = pages.reduce((sum, p) => sum + p.totalSpend, 0);
   const totalConversions = pages.reduce((sum, p) => sum + p.conversions, 0);
   const activePages = pages.filter(p => p.status === 'active').length;
   const avgCPA = totalSpend / totalConversions;
 
   const toggleStatus = (id: string) => {
    const updatedPages = pages.map(p => {
       if (p.id === id) {
        const newStatus: 'active' | 'paused' = p.status === 'active' ? 'paused' : 'active';
         toast.success(`Page ${newStatus === 'active' ? 'activated' : 'paused'}`, {
           description: p.name
         });
         return { ...p, status: newStatus };
       }
       return p;
    });
    onPagesChange(updatedPages);
   };
 
   const deletePage = (id: string) => {
     const page = pages.find(p => p.id === id);
    onPagesChange(pages.filter(p => p.id !== id));
     toast.success('Page deleted', { description: page?.name });
   };
 
   const updateBudget = (id: string, newBudget: number) => {
    onPagesChange(pages.map(p => 
       p.id === id ? { ...p, dailyBudget: newBudget } : p
     ));
     toast.success('Budget updated');
     setBudgetInputs(prev => ({ ...prev, [id]: '' }));
   };
 
   const getPerformanceColor = (perf: LandingPage['performance']) => {
     switch (perf) {
       case 'excellent': return 'text-green-500 bg-green-500/10 border-green-500/30';
       case 'good': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
       case 'poor': return 'text-red-500 bg-red-500/10 border-red-500/30';
       case 'new': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
     }
   };
 
   const getPerformanceIcon = (perf: LandingPage['performance']) => {
     switch (perf) {
       case 'excellent': return <CheckCircle2 className="w-3.5 h-3.5" />;
       case 'good': return <TrendingUp className="w-3.5 h-3.5" />;
       case 'poor': return <AlertTriangle className="w-3.5 h-3.5" />;
       case 'new': return <Target className="w-3.5 h-3.5" />;
     }
   };
 
   return (
     <div className="space-y-6">
       {/* Overview Stats */}
       <div className="grid grid-cols-4 gap-4">
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-muted-foreground">Total Spend</p>
                 <p className="text-2xl font-bold">${totalSpend.toLocaleString()}</p>
               </div>
               <DollarSign className="w-8 h-8 text-muted-foreground/50" />
             </div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-muted-foreground">Total Conversions</p>
                 <p className="text-2xl font-bold">{totalConversions}</p>
               </div>
               <Users className="w-8 h-8 text-muted-foreground/50" />
             </div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-muted-foreground">Avg. CPA</p>
                 <p className="text-2xl font-bold">${avgCPA.toFixed(2)}</p>
               </div>
               <Target className="w-8 h-8 text-muted-foreground/50" />
             </div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-muted-foreground">Active Pages</p>
                 <p className="text-2xl font-bold">{activePages} / {pages.length}</p>
               </div>
               <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                 <Play className="w-4 h-4 text-green-500" />
               </div>
             </div>
           </CardContent>
         </Card>
       </div>
 
       {/* Create New Button */}
       <div className="flex items-center justify-between">
         <h3 className="font-semibold">Your Landing Pages</h3>
         <Button onClick={onCreateNew} size="sm" className="gap-1.5">
           <Plus className="w-4 h-4" /> New Page
         </Button>
       </div>
 
       {/* Pages List */}
       <ScrollArea className="h-[420px]">
         <div className="space-y-3">
           {pages.map((page) => (
             <Card 
               key={page.id} 
               className={`transition-all ${page.status === 'paused' ? 'opacity-60' : ''} ${page.performance === 'poor' ? 'border-red-500/30' : ''}`}
             >
               <CardContent className="p-4">
                 <div className="flex items-start justify-between mb-3">
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                       <h4 className="font-medium">{page.name}</h4>
                       <Badge variant={page.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                         {page.status === 'active' ? <Play className="w-2.5 h-2.5 mr-1" /> : <Pause className="w-2.5 h-2.5 mr-1" />}
                         {page.status}
                       </Badge>
                       <Badge className={`text-xs ${getPerformanceColor(page.performance)}`}>
                         {getPerformanceIcon(page.performance)}
                         <span className="ml-1">{page.performance}</span>
                       </Badge>
                     </div>
                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
                       <span>{page.template}</span>
                       <span>•</span>
                       <a href="#" className="flex items-center gap-1 hover:text-primary transition-colors">
                         {page.url} <ExternalLink className="w-3 h-3" />
                       </a>
                     </div>
                    {page.customDomain && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Globe className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{page.customDomain}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-[9px] ${page.domainStatus === 'active' ? 'bg-green-500/10 text-green-600' : page.domainStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-red-500/10 text-red-600'}`}
                        >
                          {page.domainStatus}
                        </Badge>
                      </div>
                    )}
                   </div>
 
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-8 w-8">
                         <MoreVertical className="w-4 h-4" />
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                       <DropdownMenuItem onClick={() => onEditPage(page.id)}>
                         <Edit3 className="w-4 h-4 mr-2" /> Edit Page
                       </DropdownMenuItem>
                       <DropdownMenuItem>
                         <Eye className="w-4 h-4 mr-2" /> Preview
                       </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => toggleStatus(page.id)}>
                         {page.status === 'active' ? (
                           <><Pause className="w-4 h-4 mr-2" /> Pause</>
                         ) : (
                           <><Play className="w-4 h-4 mr-2" /> Activate</>
                         )}
                       </DropdownMenuItem>
                       <DropdownMenuItem 
                         className="text-destructive focus:text-destructive"
                         onClick={() => deletePage(page.id)}
                       >
                         <Trash2 className="w-4 h-4 mr-2" /> Delete
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 </div>
 
                 {/* Stats Row */}
                 <div className="grid grid-cols-5 gap-4 text-sm mb-3">
                   <div>
                     <span className="text-muted-foreground block text-xs">Spend</span>
                     <span className="font-medium">${page.totalSpend.toLocaleString()}</span>
                   </div>
                   <div>
                     <span className="text-muted-foreground block text-xs">Conversions</span>
                     <span className="font-medium flex items-center gap-1">
                       {page.conversions}
                       {page.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                       {page.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                     </span>
                   </div>
                   <div>
                     <span className="text-muted-foreground block text-xs">Conv. Rate</span>
                     <span className="font-medium">{page.conversionRate}%</span>
                   </div>
                   <div>
                     <span className="text-muted-foreground block text-xs">CPA</span>
                     <span className={`font-medium ${page.cpa > 20 ? 'text-red-500' : page.cpa < 15 ? 'text-green-500' : ''}`}>
                       ${page.cpa.toFixed(2)}
                     </span>
                   </div>
                   <div>
                     <span className="text-muted-foreground block text-xs">Daily Budget</span>
                     <div className="flex items-center gap-1">
                       <Input
                         type="number"
                         value={budgetInputs[page.id] ?? page.dailyBudget}
                         onChange={(e) => setBudgetInputs(prev => ({ ...prev, [page.id]: e.target.value }))}
                         onBlur={() => {
                           const val = parseFloat(budgetInputs[page.id]);
                           if (!isNaN(val) && val > 0) {
                             updateBudget(page.id, val);
                           }
                         }}
                         className="h-7 w-20 text-sm"
                       />
                     </div>
                   </div>
                 </div>
 
                 {/* Budget Progress */}
                 <div className="space-y-1">
                   <div className="flex items-center justify-between text-xs text-muted-foreground">
                     <span>Monthly budget usage</span>
                     <span>${page.totalSpend} / ${page.dailyBudget * 30}</span>
                   </div>
                   <Progress value={(page.totalSpend / (page.dailyBudget * 30)) * 100} className="h-1.5" />
                 </div>
 
                 {/* Quick Actions */}
                 <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                   <Button 
                     variant="outline" 
                     size="sm" 
                     className="gap-1.5 flex-1"
                     onClick={() => onEditPage(page.id)}
                   >
                     <Edit3 className="w-3.5 h-3.5" /> Edit
                   </Button>
                   <Button 
                     variant={page.status === 'active' ? 'secondary' : 'default'}
                     size="sm" 
                     className="gap-1.5 flex-1"
                     onClick={() => toggleStatus(page.id)}
                   >
                     {page.status === 'active' ? (
                       <><Pause className="w-3.5 h-3.5" /> Pause</>
                     ) : (
                       <><Play className="w-3.5 h-3.5" /> Activate</>
                     )}
                   </Button>
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     className="gap-1.5 text-destructive hover:text-destructive"
                     onClick={() => deletePage(page.id)}
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </Button>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       </ScrollArea>
     </div>
   );
 }