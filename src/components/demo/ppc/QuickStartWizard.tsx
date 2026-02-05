 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Badge } from "@/components/ui/badge";
 import { Progress } from "@/components/ui/progress";
 import {
   Sparkles, ArrowRight, ArrowLeft, CheckCircle2,
   FileText, Calculator, Users, MapPin, Award,
   Building2, Phone, Globe, Target, Loader2,
   Layout, MessageSquare, Star, Zap
 } from "lucide-react";
 
 interface QuickStartWizardProps {
   onComplete: (pageData: PageData) => void;
   onCancel: () => void;
   initialData?: Partial<PageData>;
 }
 
 interface PageData {
   goal: string;
   businessName: string;
   location: string;
   phone: string;
   service: string;
   uniqueValue: string;
 }
 
 interface GoalOption {
   id: string;
   title: string;
   description: string;
   icon: React.ElementType;
   color: string;
   conversionRate: string;
 }
 
 const GOALS: GoalOption[] = [
   {
     id: 'quote',
     title: 'Get Quote Requests',
     description: 'Capture leads with a fast quote form',
     icon: FileText,
     color: '#7C3AED',
     conversionRate: '12.4%',
   },
   {
     id: 'compare',
     title: 'Compare Services',
     description: 'Show why you\'re better than competitors',
     icon: Award,
     color: '#10B981',
     conversionRate: '8.7%',
   },
   {
     id: 'calculator',
     title: 'Calculate Costs',
     description: 'Interactive pricing calculator',
     icon: Calculator,
     color: '#F59E0B',
     conversionRate: '15.8%',
   },
   {
     id: 'testimonials',
     title: 'Show Testimonials',
     description: 'Build trust with customer reviews',
     icon: Users,
     color: '#EC4899',
     conversionRate: '6.7%',
   },
   {
     id: 'local',
     title: 'Target Local Area',
     description: 'Location-specific landing page',
     icon: MapPin,
     color: '#3B82F6',
     conversionRate: '9.2%',
   },
 ];
 
 export function QuickStartWizard({ onComplete, onCancel, initialData }: QuickStartWizardProps) {
   const [step, setStep] = useState(1);
   const [isGenerating, setIsGenerating] = useState(false);
   const [pageData, setPageData] = useState<PageData>({
     goal: initialData?.goal || '',
     businessName: initialData?.businessName || 'TruMove',
     location: initialData?.location || '',
     phone: initialData?.phone || '',
     service: initialData?.service || 'Long Distance Moving',
     uniqueValue: initialData?.uniqueValue || '',
   });
 
   const [generationStep, setGenerationStep] = useState(0);
   const generationSteps = [
     'Analyzing your business...',
     'Writing compelling headlines...',
     'Adding trust elements...',
     'Optimizing for conversions...',
     'Finalizing your page...',
   ];
 
   const totalSteps = 3;
   const progress = (step / totalSteps) * 100;
 
   const handleNext = () => {
     if (step < totalSteps) {
       setStep(step + 1);
     } else {
       handleGenerate();
     }
   };
 
   const handleBack = () => {
     if (step > 1) {
       setStep(step - 1);
     } else {
       onCancel();
     }
   };
 
   const handleGenerate = () => {
     setIsGenerating(true);
     let currentStep = 0;
     
     const interval = setInterval(() => {
       currentStep++;
       setGenerationStep(currentStep);
       
       if (currentStep >= generationSteps.length) {
         clearInterval(interval);
         setTimeout(() => {
           onComplete(pageData);
         }, 500);
       }
     }, 600);
   };
 
   const canProceed = () => {
     switch (step) {
       case 1: return !!pageData.goal;
       case 2: return !!pageData.businessName && !!pageData.location;
       case 3: return true;
       default: return false;
     }
   };
 
   if (isGenerating) {
     return (
       <div className="flex flex-col items-center justify-center py-16 space-y-8">
         <div className="relative">
           <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
             <Sparkles className="w-12 h-12 text-white animate-pulse" />
           </div>
           <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
             <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
           </div>
         </div>
         
         <div className="text-center space-y-2">
           <h2 className="text-2xl font-bold text-foreground">Creating your page...</h2>
           <p className="text-muted-foreground">AI is building your high-converting landing page</p>
         </div>
 
         <div className="w-full max-w-xs space-y-4">
           <Progress value={(generationStep / generationSteps.length) * 100} className="h-2" />
           <div className="space-y-2">
             {generationSteps.map((stepText, i) => (
               <div 
                 key={i}
                 className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                   i < generationStep ? 'text-primary' : i === generationStep ? 'text-foreground' : 'text-muted-foreground/50'
                 }`}
               >
                 {i < generationStep ? (
                   <CheckCircle2 className="w-4 h-4 text-primary" />
                 ) : i === generationStep ? (
                   <Loader2 className="w-4 h-4 animate-spin" />
                 ) : (
                   <div className="w-4 h-4 rounded-full border border-muted-foreground/30" />
                 )}
                 {stepText}
               </div>
             ))}
           </div>
         </div>
       </div>
     );
   }
 
   return (
     <div className="space-y-6 p-4">
       {/* Progress Header */}
       <div className="space-y-3">
         <div className="flex items-center justify-between text-sm">
           <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
           <Badge variant="secondary" className="gap-1">
             <Zap className="w-3 h-3" />
             Quick Create
           </Badge>
         </div>
         <Progress value={progress} className="h-2" />
       </div>
 
       {/* Step 1: Choose Goal */}
       {step === 1 && (
         <div className="space-y-6">
           <div className="text-center space-y-2">
             <h2 className="text-xl font-bold text-foreground">What's your landing page for?</h2>
             <p className="text-muted-foreground">Choose a goal and we'll optimize for conversions</p>
           </div>
 
           <div className="grid grid-cols-1 gap-3">
             {GOALS.map((goal) => (
               <Card
                 key={goal.id}
                 className={`cursor-pointer transition-all duration-200 ${
                   pageData.goal === goal.id
                     ? 'border-2 border-primary bg-primary/5 shadow-lg shadow-primary/10'
                     : 'border-2 border-transparent hover:border-primary/30'
                 }`}
                 onClick={() => setPageData(prev => ({ ...prev, goal: goal.id }))}
               >
                 <CardContent className="p-4 flex items-center gap-4">
                   <div 
                     className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                     style={{ background: `${goal.color}20` }}
                   >
                     <goal.icon className="w-6 h-6" style={{ color: goal.color }} />
                   </div>
                   <div className="flex-1 min-w-0">
                     <h3 className="font-semibold text-foreground">{goal.title}</h3>
                     <p className="text-sm text-muted-foreground">{goal.description}</p>
                   </div>
                   <div className="text-right shrink-0">
                     <Badge 
                       variant="secondary" 
                       className="text-xs"
                       style={{ background: `${goal.color}15`, color: goal.color }}
                     >
                       {goal.conversionRate} avg
                     </Badge>
                   </div>
                   {pageData.goal === goal.id && (
                     <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                   )}
                 </CardContent>
               </Card>
             ))}
           </div>
         </div>
       )}
 
       {/* Step 2: Business Details */}
       {step === 2 && (
         <div className="space-y-6">
           <div className="text-center space-y-2">
             <h2 className="text-xl font-bold text-foreground">Quick Details</h2>
             <p className="text-muted-foreground">Just the essentials — AI fills in the rest</p>
           </div>
 
           <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
             <CardContent className="p-6 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                     <Building2 className="w-4 h-4 text-muted-foreground" />
                     Business Name
                   </label>
                   <Input
                     placeholder="Your Company Name"
                     value={pageData.businessName}
                     onChange={(e) => setPageData(prev => ({ ...prev, businessName: e.target.value }))}
                     className="h-11"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                     <Phone className="w-4 h-4 text-muted-foreground" />
                     Phone (optional)
                   </label>
                   <Input
                     placeholder="1-800-XXX-XXXX"
                     value={pageData.phone}
                     onChange={(e) => setPageData(prev => ({ ...prev, phone: e.target.value }))}
                     className="h-11"
                   />
                 </div>
               </div>
 
               <div className="space-y-2">
                 <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                   <MapPin className="w-4 h-4 text-muted-foreground" />
                   Target Location
                 </label>
                 <Input
                   placeholder="e.g., California, Los Angeles, or Nationwide"
                   value={pageData.location}
                   onChange={(e) => setPageData(prev => ({ ...prev, location: e.target.value }))}
                   className="h-11"
                 />
               </div>
 
               <div className="space-y-2">
                 <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                   <Target className="w-4 h-4 text-muted-foreground" />
                   Main Service
                 </label>
                 <div className="flex flex-wrap gap-2">
                   {['Long Distance Moving', 'Local Moving', 'Commercial Moving', 'Packing', 'Storage'].map((service) => (
                     <Badge
                       key={service}
                       variant={pageData.service === service ? 'default' : 'outline'}
                       className="cursor-pointer py-2 px-3 text-sm transition-all hover:scale-105"
                       onClick={() => setPageData(prev => ({ ...prev, service }))}
                     >
                       {service}
                     </Badge>
                   ))}
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
       )}
 
       {/* Step 3: Optional Extras */}
       {step === 3 && (
         <div className="space-y-6">
           <div className="text-center space-y-2">
             <h2 className="text-xl font-bold text-foreground">Make It Unique (Optional)</h2>
             <p className="text-muted-foreground">Add your secret sauce — or skip and let AI decide</p>
           </div>
 
           <Card className="border-2 border-primary/20">
             <CardContent className="p-6 space-y-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                   <Star className="w-4 h-4 text-amber-500" />
                   What makes you different?
                 </label>
                 <Textarea
                   placeholder="e.g., 50,000+ happy customers, AI-powered quotes in 60 seconds, Price-match guarantee..."
                   value={pageData.uniqueValue}
                   onChange={(e) => setPageData(prev => ({ ...prev, uniqueValue: e.target.value }))}
                   className="min-h-[100px]"
                 />
                 <p className="text-xs text-muted-foreground">
                   💡 Leave blank and AI will generate compelling unique selling points
                 </p>
               </div>
 
               {/* Preview of what will be created */}
               <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                 <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                   <Layout className="w-4 h-4 text-primary" />
                   Your page will include:
                 </div>
                 <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                   <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                     Hero section with CTA
                   </div>
                   <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                     Trust badges & reviews
                   </div>
                   <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                     Lead capture form
                   </div>
                   <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                     Mobile optimized
                   </div>
                   <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                     SEO meta tags
                   </div>
                   <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                     Analytics tracking
                   </div>
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
       )}
 
       {/* Navigation Buttons */}
       <div className="flex gap-3 pt-4">
         <Button 
           variant="outline" 
           className="flex-1 gap-2"
           onClick={handleBack}
         >
           <ArrowLeft className="w-4 h-4" />
           {step === 1 ? 'Cancel' : 'Back'}
         </Button>
         <Button 
           className="flex-1 gap-2"
           style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}
           onClick={handleNext}
           disabled={!canProceed()}
         >
           {step === totalSteps ? (
             <>
               <Sparkles className="w-4 h-4" />
               Create Page
             </>
           ) : (
             <>
               Continue
               <ArrowRight className="w-4 h-4" />
             </>
           )}
         </Button>
       </div>
     </div>
   );
 }