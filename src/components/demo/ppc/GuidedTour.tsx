 import { useState, useEffect } from "react";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import {
   Layout, TrendingUp, FlaskConical, Search, Globe, Zap,
   ArrowRight, ArrowLeft, X, Sparkles, CheckCircle2
 } from "lucide-react";
 
 interface TourStep {
   id: string;
   title: string;
   description: string;
   icon: React.ElementType;
   color: string;
   tip: string;
 }
 
 const TOUR_STEPS: TourStep[] = [
   {
     id: "landing",
     title: "Create Landing Pages",
     description: "Build high-converting pages with AI in minutes. Choose from templates or let AI generate custom designs.",
     icon: Layout,
     color: "#7C3AED",
     tip: "Pro tip: Pages with video convert 86% better"
   },
   {
     id: "performance",
     title: "Track Performance",
     description: "Monitor all your marketing KPIs in one place - clicks, conversions, ROAS, and more in real-time.",
     icon: TrendingUp,
     color: "#10B981",
     tip: "Pro tip: Check analytics daily for quick wins"
   },
   {
     id: "abtest",
     title: "Run A/B Tests",
     description: "Optimize with data-driven experiments. Test headlines, CTAs, layouts, and images automatically.",
     icon: FlaskConical,
     color: "#EC4899",
     tip: "Pro tip: Test one element at a time for clear results"
   },
   {
     id: "keywords",
     title: "Keyword Research",
     description: "Discover high-intent search terms that your competitors are missing. Get CPC and volume data.",
     icon: Search,
     color: "#F59E0B",
     tip: "Pro tip: Long-tail keywords often convert better"
   },
   {
     id: "seo",
     title: "SEO Audit",
     description: "Scan your pages for technical issues and get AI-powered fixes to improve rankings.",
     icon: Globe,
     color: "#3B82F6",
     tip: "Pro tip: Fix critical errors first for biggest impact"
   },
   {
     id: "campaigns",
     title: "Campaign Optimization",
     description: "AI analyzes your ad performance and suggests budget shifts for maximum ROAS.",
     icon: Zap,
     color: "#EF4444",
     tip: "Pro tip: Pause underperforming ads to save budget"
   },
 ];
 
 interface GuidedTourProps {
   isOpen: boolean;
   onClose: () => void;
   onComplete: () => void;
   onNavigate: (section: string) => void;
 }
 
 export function GuidedTour({ isOpen, onClose, onComplete, onNavigate }: GuidedTourProps) {
   const [currentStep, setCurrentStep] = useState(0);
   const [completedSteps, setCompletedSteps] = useState<string[]>([]);
 
   useEffect(() => {
     if (isOpen) {
       setCurrentStep(0);
       setCompletedSteps([]);
     }
   }, [isOpen]);
 
   if (!isOpen) return null;
 
   const step = TOUR_STEPS[currentStep];
   const StepIcon = step.icon;
   const isLastStep = currentStep === TOUR_STEPS.length - 1;
 
   const handleNext = () => {
     setCompletedSteps(prev => [...prev, step.id]);
     if (isLastStep) {
       onComplete();
     } else {
       setCurrentStep(prev => prev + 1);
     }
   };
 
   const handlePrev = () => {
     if (currentStep > 0) {
       setCurrentStep(prev => prev - 1);
     }
   };
 
   const handleTryIt = () => {
     onNavigate(step.id);
     onClose();
   };
 
   return (
     <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
       <div className="bg-card rounded-2xl shadow-2xl w-[480px] overflow-hidden border border-border">
         {/* Header */}
         <div 
           className="p-6 text-white relative"
           style={{ background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}CC 100%)` }}
         >
           <button
             onClick={onClose}
             className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
           >
             <X className="w-4 h-4" />
           </button>
           
           <div className="flex items-center gap-3 mb-4">
             <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
               <StepIcon className="w-7 h-7" />
             </div>
             <div>
               <Badge className="bg-white/20 text-white text-[10px] mb-1">
                 Step {currentStep + 1} of {TOUR_STEPS.length}
               </Badge>
               <h3 className="text-xl font-bold">{step.title}</h3>
             </div>
           </div>
           
           {/* Progress dots */}
           <div className="flex gap-1.5">
             {TOUR_STEPS.map((_, i) => (
               <div 
                 key={i}
                 className={`h-1 flex-1 rounded-full transition-all ${
                   i < currentStep ? 'bg-white' : i === currentStep ? 'bg-white/80' : 'bg-white/30'
                 }`}
               />
             ))}
           </div>
         </div>
 
         {/* Content */}
         <div className="p-6 space-y-4">
           <p className="text-foreground leading-relaxed">
             {step.description}
           </p>
           
           <div className="p-3 rounded-lg bg-muted/50 border border-border flex items-start gap-2">
             <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
             <p className="text-sm text-muted-foreground">{step.tip}</p>
           </div>
 
           {/* Completed Steps */}
           {completedSteps.length > 0 && (
             <div className="flex flex-wrap gap-1.5">
               {completedSteps.map(stepId => {
                 const completedStep = TOUR_STEPS.find(s => s.id === stepId);
                 return completedStep ? (
                   <Badge key={stepId} variant="secondary" className="text-[10px] gap-1">
                     <CheckCircle2 className="w-3 h-3 text-green-500" />
                     {completedStep.title}
                   </Badge>
                 ) : null;
               })}
             </div>
           )}
         </div>
 
         {/* Footer */}
         <div className="px-6 pb-6 flex items-center justify-between">
           <Button
             variant="ghost"
             size="sm"
             onClick={handlePrev}
             disabled={currentStep === 0}
             className="gap-1"
           >
             <ArrowLeft className="w-4 h-4" />
             Back
           </Button>
           
           <div className="flex gap-2">
             <Button
               variant="outline"
               size="sm"
               onClick={handleTryIt}
               className="gap-1"
             >
               Try It Now
               <ArrowRight className="w-4 h-4" />
             </Button>
             <Button
               size="sm"
               onClick={handleNext}
               className="gap-1"
               style={{ background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}CC 100%)` }}
             >
               {isLastStep ? (
                 <>
                   <CheckCircle2 className="w-4 h-4" />
                   Finish Tour
                 </>
               ) : (
                 <>
                   Next
                   <ArrowRight className="w-4 h-4" />
                 </>
               )}
             </Button>
           </div>
         </div>
       </div>
     </div>
   );
 }