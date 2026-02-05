 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Badge } from "@/components/ui/badge";
 import { ScrollArea } from "@/components/ui/scroll-area";
 import { 
   Sparkles, RefreshCw, ArrowRight, CheckCircle2, Star, 
   Shield, Clock, Phone, Zap, Users, TrendingUp, Play,
   ChevronDown, Quote, Award, Truck
 } from "lucide-react";
 import logoImg from "@/assets/logo.png";
 
 interface AILandingPageGeneratorProps {
   isGenerating: boolean;
   onGenerate: () => void;
 }
 
 export function AILandingPageGenerator({ isGenerating, onGenerate }: AILandingPageGeneratorProps) {
   const [showLandingPage, setShowLandingPage] = useState(false);
   const [businessName, setBusinessName] = useState("TruMove");
   const [targetAudience, setTargetAudience] = useState("Homeowners planning long-distance moves");
   const [mainOffer, setMainOffer] = useState("Get a guaranteed quote in 60 seconds with AI-powered pricing");
   const [generationStep, setGenerationStep] = useState(0);
 
   const handleGenerateLandingPage = () => {
     setGenerationStep(1);
     onGenerate();
     
     // Simulate generation steps
     const steps = [1, 2, 3, 4, 5];
     steps.forEach((step, index) => {
       setTimeout(() => {
         setGenerationStep(step);
         if (step === 5) {
           setTimeout(() => {
             setShowLandingPage(true);
             setGenerationStep(0);
           }, 800);
         }
       }, (index + 1) * 600);
     });
   };
 
   if (showLandingPage) {
     return (
       <div className="space-y-4">
         {/* Control Bar */}
         <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
           <div className="flex items-center gap-3">
             <Badge className="gap-1" style={{ background: "#10B98120", color: "#10B981" }}>
               <CheckCircle2 className="w-3 h-3" />
               AI Generated
             </Badge>
             <span className="text-sm text-muted-foreground">High-converting landing page for {businessName}</span>
           </div>
           <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={() => setShowLandingPage(false)}>
               <RefreshCw className="w-3 h-3 mr-1" />
               Regenerate
             </Button>
             <Button size="sm" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>
               Publish Page
             </Button>
           </div>
         </div>
 
         {/* Generated Landing Page Preview */}
         <div className="rounded-xl border-2 border-purple-300 overflow-hidden shadow-lg">
           {/* Browser Chrome */}
           <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border-b border-border">
             <div className="flex gap-1.5">
               <div className="w-3 h-3 rounded-full bg-red-400" />
               <div className="w-3 h-3 rounded-full bg-amber-400" />
               <div className="w-3 h-3 rounded-full bg-green-400" />
             </div>
             <div className="flex-1 mx-4">
               <div className="bg-white dark:bg-slate-700 rounded-md px-3 py-1 text-xs text-muted-foreground font-mono">
                 https://trumove.com/get-quote
               </div>
             </div>
           </div>
 
           {/* Actual Landing Page Content */}
           <ScrollArea className="h-[500px]">
             <div className="bg-white dark:bg-slate-900">
               {/* Hero Section */}
               <div 
                 className="relative px-8 py-16 text-center"
                 style={{ 
                   background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)"
                 }}
               >
                 {/* Floating badges */}
                 <div className="absolute top-4 left-4 flex gap-2">
                   <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                     <CheckCircle2 className="w-3 h-3 mr-1" />
                     FMCSA Licensed
                   </Badge>
                 </div>
                 <div className="absolute top-4 right-4">
                   <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                     ⭐ 4.9/5 Rating
                   </Badge>
                 </div>
 
                 <img src={logoImg} alt="TruMove" className="h-10 mx-auto mb-6 brightness-0 invert" />
                 
                 <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                   Stop Overpaying for Your Move.<br />
                   <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #22C55E, #4ADE80)" }}>
                     Get AI-Powered Pricing Now.
                   </span>
                 </h1>
                 
                 <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                   Join 50,000+ families who saved an average of $847 on their move. 
                   Our AI scans your inventory and matches you with verified carriers in seconds.
                 </p>
 
                 {/* CTA Form */}
                 <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                   <div className="space-y-3 mb-4">
                     <Input 
                       placeholder="Moving from (ZIP code)" 
                       className="bg-white/90 border-0 text-slate-900 placeholder:text-slate-500"
                     />
                     <Input 
                       placeholder="Moving to (ZIP code)" 
                       className="bg-white/90 border-0 text-slate-900 placeholder:text-slate-500"
                     />
                   </div>
                   <Button 
                     className="w-full py-6 text-lg font-bold gap-2"
                     style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)" }}
                   >
                     Get My Free Quote <ArrowRight className="w-5 h-5" />
                   </Button>
                   <p className="text-xs text-slate-400 mt-3">
                     🔒 No credit card required • Instant results
                   </p>
                 </div>
 
                 {/* Trust indicators */}
                 <div className="flex items-center justify-center gap-6 mt-8 text-slate-400 text-sm">
                   <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Price Lock Guarantee</span>
                   <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 60-Second Quotes</span>
                   <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 50,000+ Moves</span>
                 </div>
               </div>
 
               {/* Social Proof Strip */}
               <div className="bg-slate-50 dark:bg-slate-800 py-4 px-8 border-y border-slate-200 dark:border-slate-700">
                 <div className="flex items-center justify-center gap-8 text-sm">
                   <span className="text-slate-600 dark:text-slate-400">As featured in:</span>
                   <span className="font-bold text-slate-400">Forbes</span>
                   <span className="font-bold text-slate-400">Inc.</span>
                   <span className="font-bold text-slate-400">TechCrunch</span>
                   <span className="font-bold text-slate-400">WSJ</span>
                 </div>
               </div>
 
               {/* How It Works */}
               <div className="py-12 px-8">
                 <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
                   Get Your Quote in 3 Simple Steps
                 </h2>
                 <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
                   {[
                     { step: "1", title: "Enter Your Route", desc: "Tell us where you're moving from and to", icon: TrendingUp },
                     { step: "2", title: "AI Scans Your Home", desc: "Our AI estimates your inventory instantly", icon: Zap },
                     { step: "3", title: "Compare & Book", desc: "Choose from verified carriers & book online", icon: CheckCircle2 },
                   ].map((item) => (
                     <div key={item.step} className="text-center">
                       <div 
                         className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl"
                         style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)" }}
                       >
                         {item.step}
                       </div>
                       <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                       <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                     </div>
                   ))}
                 </div>
               </div>
 
               {/* Testimonial */}
               <div className="bg-slate-900 py-12 px-8">
                 <div className="max-w-2xl mx-auto text-center">
                   <Quote className="w-10 h-10 text-green-500 mx-auto mb-4" />
                   <p className="text-xl text-white italic mb-4">
                     "I was quoted $4,200 by another company. TruMove got me the same service for $3,350. 
                     The AI inventory scanner was scary accurate!"
                   </p>
                   <div className="flex items-center justify-center gap-2">
                     <div className="flex">
                       {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                     </div>
                     <span className="text-slate-400">— Sarah M., Austin TX</span>
                   </div>
                 </div>
               </div>
 
               {/* Final CTA */}
               <div className="py-12 px-8 text-center bg-gradient-to-b from-white to-green-50 dark:from-slate-900 dark:to-slate-800">
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                   Ready to Save on Your Move?
                 </h2>
                 <p className="text-slate-600 dark:text-slate-400 mb-6">
                   Get your guaranteed quote in under 60 seconds. No obligations.
                 </p>
                 <Button 
                   className="py-6 px-10 text-lg font-bold gap-2"
                   style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)" }}
                 >
                   <Truck className="w-5 h-5" />
                   Get My Free Quote Now
                 </Button>
                 <p className="text-xs text-slate-500 mt-4 flex items-center justify-center gap-4">
                   <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure</span>
                   <span className="flex items-center gap-1"><Award className="w-3 h-3" /> FMCSA Licensed</span>
                   <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> 24/7 Support</span>
                 </p>
               </div>
             </div>
           </ScrollArea>
         </div>
 
         {/* AI Insights */}
         <div className="p-4 rounded-xl border border-purple-200 bg-purple-50 dark:bg-purple-950/30 dark:border-purple-800">
           <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500">
               <Sparkles className="w-4 h-4 text-white" />
             </div>
             <div className="flex-1">
               <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-1">AI Optimization Insights</h4>
               <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                 <li>• <strong>Headline:</strong> Uses urgency + pain point (overpaying) - proven to increase conversions by 34%</li>
                 <li>• <strong>Social Proof:</strong> Specific number (50,000+ families, $847 saved) builds credibility</li>
                 <li>• <strong>CTA Color:</strong> Green button on dark background increases click-through by 21%</li>
                 <li>• <strong>Trust Badges:</strong> FMCSA licensing shown immediately addresses #1 customer concern</li>
               </ul>
             </div>
           </div>
         </div>
       </div>
     );
   }
 
   return (
     <div className="space-y-4">
       {/* Intro Card */}
       <div className="p-6 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-700">
         <div className="flex items-start gap-4">
           <div 
             className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}
           >
             <Sparkles className="w-6 h-6 text-white" />
           </div>
           <div className="flex-1">
             <h3 className="text-lg font-bold text-foreground mb-2">AI Landing Page Generator</h3>
             <p className="text-sm text-muted-foreground mb-4">
               Tell our AI about your business and target audience, and it will generate a high-converting 
               landing page like the pros at ClickFunnels or Unbounce would create — complete with 
               persuasive copy, trust signals, and optimized CTAs.
             </p>
             <div className="flex flex-wrap gap-2 text-xs">
               <Badge variant="secondary" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Conversion-Optimized</Badge>
               <Badge variant="secondary" className="gap-1"><Zap className="w-3 h-3" /> Instant Generation</Badge>
               <Badge variant="secondary" className="gap-1"><TrendingUp className="w-3 h-3" /> A/B Test Ready</Badge>
             </div>
           </div>
         </div>
       </div>
 
       {/* Input Form */}
       <div className="rounded-xl border border-border bg-card p-5">
         <h4 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
           <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xs font-bold">1</span>
           Tell us about your page
         </h4>
         
         <div className="space-y-4">
           <div>
             <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
               Business Name
             </label>
             <Input 
               value={businessName}
               onChange={(e) => setBusinessName(e.target.value)}
               placeholder="Your company name"
             />
           </div>
           
           <div>
             <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
               Target Audience
             </label>
             <Input 
               value={targetAudience}
               onChange={(e) => setTargetAudience(e.target.value)}
               placeholder="Who are you trying to reach?"
             />
           </div>
           
           <div>
             <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
               Main Offer / Value Proposition
             </label>
             <Textarea 
               value={mainOffer}
               onChange={(e) => setMainOffer(e.target.value)}
               placeholder="What's the main benefit you're offering?"
               rows={2}
             />
           </div>
         </div>
       </div>
 
       {/* Generate Button */}
       <Button 
         onClick={handleGenerateLandingPage}
         disabled={isGenerating || generationStep > 0}
         className="w-full py-6 text-lg font-bold gap-2"
         style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}
       >
         {generationStep > 0 ? (
           <>
             <RefreshCw className="w-5 h-5 animate-spin" />
             {generationStep === 1 && "Analyzing your inputs..."}
             {generationStep === 2 && "Generating headline copy..."}
             {generationStep === 3 && "Building page structure..."}
             {generationStep === 4 && "Adding trust elements..."}
             {generationStep === 5 && "Optimizing for conversions..."}
           </>
         ) : (
           <>
             <Sparkles className="w-5 h-5" />
             Generate Landing Page with AI
           </>
         )}
       </Button>
 
       {/* Generation Steps Indicator */}
       {generationStep > 0 && (
         <div className="p-4 rounded-xl border border-border bg-card">
           <div className="space-y-2">
             {[
               { step: 1, label: "Analyzing inputs" },
               { step: 2, label: "Generating headline copy" },
               { step: 3, label: "Building page structure" },
               { step: 4, label: "Adding trust elements" },
               { step: 5, label: "Optimizing for conversions" },
             ].map((item) => (
               <div 
                 key={item.step} 
                 className={`flex items-center gap-2 text-sm transition-all ${
                   generationStep >= item.step ? "text-foreground" : "text-muted-foreground/50"
                 }`}
               >
                 {generationStep > item.step ? (
                   <CheckCircle2 className="w-4 h-4 text-green-500" />
                 ) : generationStep === item.step ? (
                   <RefreshCw className="w-4 h-4 animate-spin text-purple-500" />
                 ) : (
                   <div className="w-4 h-4 rounded-full border border-muted-foreground/30" />
                 )}
                 {item.label}
               </div>
             ))}
           </div>
         </div>
       )}
     </div>
   );
 }