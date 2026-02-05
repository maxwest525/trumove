 import { useState, useEffect } from "react";
 import { 
   Sparkles, Lightbulb, TrendingUp, Target, AlertTriangle, 
   CheckCircle2, Copy, RefreshCw, Zap, Users, DollarSign,
   Clock, Shield, Star, Heart, ArrowRight, ChevronDown, ChevronUp
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { toast } from "sonner";
 import { cn } from "@/lib/utils";
 
 interface Recommendation {
   id: string;
   type: 'improvement' | 'warning' | 'optimization' | 'best-practice';
   title: string;
   description: string;
   suggestedText?: string;
   impact: 'high' | 'medium' | 'low';
   category: string;
 }
 
 interface AIEditRecommendationsProps {
   sectionType: 'headline' | 'subheadline' | 'body' | 'cta' | 'testimonial';
   currentContent: string;
   onApplySuggestion: (newText: string) => void;
   isExpanded?: boolean;
   targetAudience?: string;
   targetLocation?: string;
 }
 
 // Comprehensive recommendations database by section type
 const RECOMMENDATIONS_DATABASE: Record<string, Recommendation[]> = {
   headline: [
     {
       id: "headline-power-words",
       type: "improvement",
       title: "Add Power Words",
       description: "Headlines with power words like 'Free', 'Guaranteed', 'Instant' convert 23% higher. Consider adding urgency or value-focused words.",
       suggestedText: "Get Your FREE Moving Quote — Guaranteed Lowest Price",
       impact: "high",
       category: "Conversion"
     },
     {
       id: "headline-numbers",
       type: "best-practice",
       title: "Include Specific Numbers",
       description: "Headlines with numbers are 36% more engaging. Use specific stats like '$847 saved' or '60 seconds' to build credibility.",
       suggestedText: "Save $847 on Your Move — Get a Quote in 60 Seconds",
       impact: "high",
       category: "Credibility"
     },
     {
       id: "headline-length",
       type: "optimization",
       title: "Optimize Length (6-12 words)",
       description: "Headlines between 6-12 words have the highest click-through rates. Yours should be punchy and scannable.",
       suggestedText: "Stop Overpaying. Get AI-Powered Moving Quotes Now.",
       impact: "medium",
       category: "Readability"
     },
     {
       id: "headline-question",
       type: "improvement",
       title: "Try a Question Format",
       description: "Question headlines engage readers by making them think. They can increase engagement by up to 18%.",
       suggestedText: "Why Pay More? Get the Lowest Moving Quote Guaranteed",
       impact: "medium",
       category: "Engagement"
     },
     {
       id: "headline-pain-point",
       type: "best-practice",
       title: "Address the Pain Point First",
       description: "Lead with the problem your audience faces, then present your solution. Pain-agitate-solve formula works.",
       suggestedText: "Tired of Hidden Moving Fees? Get Transparent AI Pricing",
       impact: "high",
       category: "Psychology"
     }
   ],
   subheadline: [
     {
       id: "sub-value-prop",
       type: "improvement",
       title: "Clarify Your Value Proposition",
       description: "Subheadlines should expand on the headline with a clear benefit. Answer: 'What's in it for me?'",
       suggestedText: "Join 50,000+ families who saved an average of $847 with AI-powered pricing",
       impact: "high",
       category: "Value"
     },
     {
       id: "sub-social-proof",
       type: "best-practice",
       title: "Add Social Proof Element",
       description: "Mentioning customer counts or ratings in subheadlines increases trust by 42%.",
       suggestedText: "Rated 4.9/5 by 50,000+ Happy Customers Nationwide",
       impact: "high",
       category: "Trust"
     },
     {
       id: "sub-urgency",
       type: "optimization",
       title: "Create Subtle Urgency",
       description: "Subheadlines with time-based elements ('today', 'now', 'limited') drive faster action.",
       suggestedText: "Get Your Personalized Quote Today — Prices Lock for 30 Days",
       impact: "medium",
       category: "Urgency"
     },
     {
       id: "sub-differentiation",
       type: "improvement",
       title: "Highlight What Makes You Different",
       description: "Stand out from competitors by mentioning your unique technology or approach.",
       suggestedText: "The Only Moving Platform with AI Inventory Scanning & Real-Time GPS Tracking",
       impact: "medium",
       category: "Differentiation"
     }
   ],
   body: [
     {
       id: "body-benefits",
       type: "improvement",
       title: "Focus on Benefits, Not Features",
       description: "Customers care about outcomes. Convert features into benefits (e.g., 'AI scanning' → 'No manual inventory').",
       suggestedText: "Skip the tedious inventory lists. Our AI scans your home in minutes and matches you with verified carriers who compete for your business — saving you time and money.",
       impact: "high",
       category: "Copywriting"
     },
     {
       id: "body-scannable",
       type: "best-practice",
       title: "Make it Scannable",
       description: "Use short paragraphs, bullet points, and bold key phrases. 79% of users scan rather than read.",
       suggestedText: "✓ AI-powered instant quotes\n✓ Verified, insured carriers only\n✓ Price lock guarantee — no surprises\n✓ 24/7 live customer support",
       impact: "medium",
       category: "UX"
     },
     {
       id: "body-objections",
       type: "optimization",
       title: "Address Common Objections",
       description: "Proactively handle concerns like hidden fees, reliability, and timing to remove friction.",
       suggestedText: "Worried about hidden fees? Our price lock guarantee means the quote you see is the price you pay. No surprises on moving day, ever.",
       impact: "high",
       category: "Conversion"
     },
     {
       id: "body-stats",
       type: "improvement",
       title: "Add Credibility Statistics",
       description: "Specific numbers and percentages make claims more believable and trustworthy.",
       suggestedText: "Our AI analyzes over 2.3 million data points to give you the most accurate quote — with 99.2% pricing accuracy across 50,000+ moves.",
       impact: "medium",
       category: "Trust"
     }
   ],
   cta: [
     {
       id: "cta-action-verb",
       type: "best-practice",
       title: "Start with a Strong Action Verb",
       description: "CTAs starting with verbs like 'Get', 'Start', 'Claim' outperform passive phrases by 28%.",
       suggestedText: "Get My Free Quote Now",
       impact: "high",
       category: "Action"
     },
     {
       id: "cta-value",
       type: "improvement",
       title: "Communicate the Value",
       description: "Tell users what they'll get, not just what to do. 'Get My Free Quote' beats 'Submit'.",
       suggestedText: "Claim My $200 Discount",
       impact: "high",
       category: "Value"
     },
     {
       id: "cta-first-person",
       type: "optimization",
       title: "Use First Person ('My' vs 'Your')",
       description: "First-person CTAs ('Get My Quote') convert 24% better than second-person ('Get Your Quote').",
       suggestedText: "Start My Free Quote",
       impact: "medium",
       category: "Psychology"
     },
     {
       id: "cta-urgency",
       type: "improvement",
       title: "Add Urgency Element",
       description: "Adding time pressure ('Now', 'Today', 'Limited') increases click-through rates.",
       suggestedText: "Lock in My Price Today",
       impact: "medium",
       category: "Urgency"
     },
     {
       id: "cta-reduce-risk",
       type: "best-practice",
       title: "Reduce Perceived Risk",
       description: "Words like 'Free', 'No obligation', 'Instant' lower the barrier to clicking.",
       suggestedText: "Get Free Instant Quote — No Credit Card",
       impact: "high",
       category: "Trust"
     }
   ],
   testimonial: [
     {
       id: "testimonial-specific",
       type: "improvement",
       title: "Add Specific Details",
       description: "Testimonials with numbers and specifics are 68% more believable. Include savings, time, or experience details.",
       suggestedText: "I was quoted $4,200 by two other companies. TruMove's AI got me the exact same service for $3,350 — and they delivered 2 days early!",
       impact: "high",
       category: "Credibility"
     },
     {
       id: "testimonial-transformation",
       type: "best-practice",
       title: "Show Before/After Transformation",
       description: "The best testimonials show the journey from problem to solution. What was their situation before?",
       suggestedText: "I dreaded moving after a nightmare experience years ago. TruMove changed everything — the AI scanner was incredibly accurate, and my belongings arrived exactly as promised.",
       impact: "high",
       category: "Storytelling"
     },
     {
       id: "testimonial-emotion",
       type: "optimization",
       title: "Include Emotional Language",
       description: "Testimonials with emotional words ('thrilled', 'relieved', 'amazed') connect better with readers.",
       suggestedText: "I'm absolutely thrilled! The whole process was stress-free. For the first time ever, moving was actually... easy.",
       impact: "medium",
       category: "Connection"
     },
     {
       id: "testimonial-objection",
       type: "improvement",
       title: "Address a Common Objection",
       description: "Use testimonials to counter doubts. If people worry about hidden fees, show a testimonial about transparent pricing.",
       suggestedText: "I was skeptical about 'no hidden fees' — I've heard that before. But with TruMove, the final bill matched the quote down to the penny. Finally, a company that keeps their word.",
       impact: "high",
       category: "Trust"
     }
   ]
 };
 
 // Dynamic recommendations based on content analysis
 function analyzeContent(type: string, content: string): Recommendation[] {
   const dynamicRecs: Recommendation[] = [];
   const lowerContent = content.toLowerCase();
   
   // Check for common issues
   if (content.length < 20 && (type === 'headline' || type === 'body')) {
     dynamicRecs.push({
       id: "too-short",
       type: "warning",
       title: "Content May Be Too Short",
       description: "Short content can lack persuasive power. Consider adding more detail or benefits.",
       impact: "medium",
       category: "Length"
     });
   }
   
   if (content.length > 150 && type === 'headline') {
     dynamicRecs.push({
       id: "too-long",
       type: "warning",
       title: "Headline May Be Too Long",
       description: "Long headlines are harder to scan. Try to keep it under 12 words for maximum impact.",
       impact: "medium",
       category: "Length"
     });
   }
   
   // Check for weak words
   const weakWords = ['good', 'nice', 'great', 'best', 'quality'];
   if (weakWords.some(w => lowerContent.includes(w))) {
     dynamicRecs.push({
       id: "weak-words",
       type: "optimization",
       title: "Replace Generic Words",
       description: "Words like 'good', 'best', 'quality' are overused. Use specific, measurable claims instead.",
       impact: "medium",
       category: "Specificity"
     });
   }
   
   // Check for missing numbers
   if (!/\d/.test(content) && (type === 'headline' || type === 'subheadline')) {
     dynamicRecs.push({
       id: "no-numbers",
       type: "improvement",
       title: "Consider Adding Numbers",
       description: "Specific numbers ($847 saved, 60 seconds, 50K+ customers) make claims more credible.",
       impact: "medium",
       category: "Credibility"
     });
   }
   
   // Check CTA strength
   if (type === 'cta') {
     const weakCTAs = ['submit', 'click here', 'learn more', 'continue'];
     if (weakCTAs.some(w => lowerContent.includes(w))) {
       dynamicRecs.push({
         id: "weak-cta",
         type: "warning",
         title: "Strengthen Your CTA",
         description: "Generic CTAs like 'Submit' or 'Learn More' underperform. Use value-driven language.",
         suggestedText: "Get My Free Quote",
         impact: "high",
         category: "Conversion"
       });
     }
   }
   
   return dynamicRecs;
 }
 
 export function AIEditRecommendations({
   sectionType,
   currentContent,
   onApplySuggestion,
   isExpanded = true,
   targetAudience,
   targetLocation
 }: AIEditRecommendationsProps) {
   const [isLoading, setIsLoading] = useState(true);
   const [showAll, setShowAll] = useState(false);
   const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
   
   // Simulate AI loading
   useEffect(() => {
     setIsLoading(true);
     const timer = setTimeout(() => setIsLoading(false), 600);
     return () => clearTimeout(timer);
   }, [sectionType, currentContent]);
   
   // Get recommendations
   const staticRecs = RECOMMENDATIONS_DATABASE[sectionType] || [];
   const dynamicRecs = analyzeContent(sectionType, currentContent);
   const allRecommendations = [...dynamicRecs, ...staticRecs];
   
   // Sort by impact
   const sortedRecs = allRecommendations.sort((a, b) => {
     const impactOrder = { high: 0, medium: 1, low: 2 };
     return impactOrder[a.impact] - impactOrder[b.impact];
   });
   
   const displayRecs = showAll ? sortedRecs : sortedRecs.slice(0, 3);
   
   const handleApply = (rec: Recommendation) => {
     if (rec.suggestedText) {
       onApplySuggestion(rec.suggestedText);
       setAppliedIds(prev => new Set(prev).add(rec.id));
       toast.success("Suggestion applied!", {
         description: "Review and customize the text as needed"
       });
     }
   };
   
   const handleCopy = (text: string) => {
     navigator.clipboard.writeText(text);
     toast.success("Copied to clipboard");
   };
   
   const getTypeIcon = (type: string) => {
     switch (type) {
       case 'improvement': return <TrendingUp className="w-3.5 h-3.5" />;
       case 'warning': return <AlertTriangle className="w-3.5 h-3.5" />;
       case 'optimization': return <Target className="w-3.5 h-3.5" />;
       case 'best-practice': return <CheckCircle2 className="w-3.5 h-3.5" />;
       default: return <Lightbulb className="w-3.5 h-3.5" />;
     }
   };
   
   const getTypeColor = (type: string) => {
     switch (type) {
       case 'improvement': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
       case 'warning': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
       case 'optimization': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400';
       case 'best-practice': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
       default: return 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';
     }
   };
   
   const getImpactBadge = (impact: string) => {
     switch (impact) {
       case 'high': return <Badge className="text-[9px] px-1.5 py-0 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0">High Impact</Badge>;
       case 'medium': return <Badge className="text-[9px] px-1.5 py-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">Medium</Badge>;
       case 'low': return <Badge className="text-[9px] px-1.5 py-0 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-0">Low</Badge>;
       default: return null;
     }
   };
   
   if (!isExpanded) return null;
   
   return (
     <div className="mt-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200 dark:border-purple-800">
       {/* Header */}
       <div className="flex items-center justify-between mb-3">
         <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
             <Sparkles className="w-3.5 h-3.5 text-white" />
           </div>
           <span className="font-semibold text-sm text-foreground">AI Recommendations</span>
           <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400">
             {sortedRecs.length} suggestions
           </Badge>
         </div>
         {isLoading && (
           <RefreshCw className="w-4 h-4 text-purple-500 animate-spin" />
         )}
       </div>
       
       {/* Context Info */}
       {(targetAudience || targetLocation) && (
         <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
           <span>Optimized for:</span>
           {targetAudience && (
             <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
               <Users className="w-2.5 h-2.5 mr-1" />
               {targetAudience.split(' ').slice(0, 2).join(' ')}
             </Badge>
           )}
           {targetLocation && (
             <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
               {targetLocation.split(',')[0]}
             </Badge>
           )}
         </div>
       )}
       
       {/* Recommendations List */}
       {isLoading ? (
         <div className="space-y-2">
           {[1, 2, 3].map(i => (
             <div key={i} className="h-20 rounded-lg bg-white/50 dark:bg-slate-800/50 animate-pulse" />
           ))}
         </div>
       ) : (
         <div className="space-y-2">
           {displayRecs.map((rec) => (
             <div 
               key={rec.id}
               className={cn(
                 "p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 transition-all",
                 appliedIds.has(rec.id) && "opacity-50 border-green-300 dark:border-green-700"
               )}
             >
               <div className="flex items-start justify-between gap-2 mb-2">
                 <div className="flex items-center gap-2">
                   <div className={cn("p-1 rounded", getTypeColor(rec.type))}>
                     {getTypeIcon(rec.type)}
                   </div>
                   <span className="font-medium text-sm text-foreground">{rec.title}</span>
                 </div>
                 <div className="flex items-center gap-1">
                   {getImpactBadge(rec.impact)}
                   <Badge variant="outline" className="text-[9px] px-1 py-0 border-slate-200 dark:border-slate-700 text-muted-foreground">
                     {rec.category}
                   </Badge>
                 </div>
               </div>
               
               <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                 {rec.description}
               </p>
               
               {rec.suggestedText && (
                 <div className="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600">
                   <p className="text-xs text-foreground italic mb-2">"{rec.suggestedText}"</p>
                   <div className="flex items-center gap-2">
                     <Button
                       size="sm"
                       variant="default"
                       className="h-6 text-[10px] px-2 gap-1"
                       onClick={() => handleApply(rec)}
                       disabled={appliedIds.has(rec.id)}
                     >
                       {appliedIds.has(rec.id) ? (
                         <>
                           <CheckCircle2 className="w-3 h-3" /> Applied
                         </>
                       ) : (
                         <>
                           <Zap className="w-3 h-3" /> Apply
                         </>
                       )}
                     </Button>
                     <Button
                       size="sm"
                       variant="ghost"
                       className="h-6 text-[10px] px-2 gap-1"
                       onClick={() => handleCopy(rec.suggestedText!)}
                     >
                       <Copy className="w-3 h-3" /> Copy
                     </Button>
                   </div>
                 </div>
               )}
             </div>
           ))}
         </div>
       )}
       
       {/* Show More/Less */}
       {sortedRecs.length > 3 && (
         <button
           onClick={() => setShowAll(!showAll)}
           className="w-full mt-3 py-2 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center justify-center gap-1"
         >
           {showAll ? (
             <>
               <ChevronUp className="w-3.5 h-3.5" /> Show Less
             </>
           ) : (
             <>
               <ChevronDown className="w-3.5 h-3.5" /> Show {sortedRecs.length - 3} More Suggestions
             </>
           )}
         </button>
       )}
       
       {/* Pro Tip */}
       <div className="mt-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
         <p className="text-[10px] text-amber-700 dark:text-amber-400 flex items-start gap-1.5">
           <Lightbulb className="w-3 h-3 flex-shrink-0 mt-0.5" />
           <span>
             <strong>Pro tip:</strong> A/B test different versions of your {sectionType}. Even small changes can improve conversion rates by 10-30%.
           </span>
         </p>
       </div>
     </div>
   );
 }