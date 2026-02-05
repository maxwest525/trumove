 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { Badge } from "@/components/ui/badge";
 import {
   Sparkles, Rocket, BarChart3, ArrowRight,
   Building2, MapPin, Target, CheckCircle2,
   Loader2
 } from "lucide-react";
 
 interface WelcomeFlowProps {
   onComplete: (mode: 'quickstart' | 'explore') => void;
   onQuickCreate: (businessInfo: { name: string; location: string; service: string }) => void;
 }
 
 export function WelcomeFlow({ onComplete, onQuickCreate }: WelcomeFlowProps) {
   const [step, setStep] = useState<'welcome' | 'quick-setup' | 'loading'>('welcome');
   const [businessInfo, setBusinessInfo] = useState({
     name: '',
     location: '',
     service: 'Long Distance Moving'
   });
 
   const handleQuickStart = () => {
     setStep('quick-setup');
   };
 
   const handleCreatePage = () => {
     setStep('loading');
     setTimeout(() => {
       onQuickCreate(businessInfo);
     }, 2500);
   };
 
   const services = [
     'Long Distance Moving',
     'Local Moving',
     'Commercial Moving',
     'Packing Services',
     'Storage Solutions'
   ];
 
   if (step === 'loading') {
     return (
       <div className="flex flex-col items-center justify-center h-full py-20 space-y-6">
         <div className="relative">
           <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
             <Sparkles className="w-10 h-10 text-white" />
           </div>
           <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
             <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
           </div>
         </div>
         <div className="text-center space-y-2">
           <h2 className="text-2xl font-bold text-foreground">Creating your page...</h2>
           <p className="text-muted-foreground">AI is building your high-converting landing page</p>
         </div>
         <div className="space-y-2 text-center max-w-xs">
           {[
             { text: 'Analyzing top performers...', done: true },
             { text: 'Writing compelling headlines...', done: true },
             { text: 'Adding trust elements...', done: false },
             { text: 'Optimizing for conversions...', done: false },
           ].map((item, i) => (
             <div 
               key={i}
               className={`flex items-center gap-2 text-sm transition-all duration-500 ${
                 item.done ? 'text-primary' : 'text-muted-foreground'
               }`}
               style={{ opacity: item.done ? 1 : 0.5 }}
             >
               {item.done ? (
                 <CheckCircle2 className="w-4 h-4" />
               ) : (
                 <Loader2 className="w-4 h-4 animate-spin" />
               )}
               {item.text}
             </div>
           ))}
         </div>
       </div>
     );
   }
 
   if (step === 'quick-setup') {
     return (
       <div className="flex flex-col items-center justify-center h-full py-12 px-6 space-y-8 max-w-xl mx-auto">
         <div className="text-center space-y-2">
           <Badge className="gap-1 bg-primary/10 text-primary border-primary/30 mb-2">
             <Sparkles className="w-3 h-3" />
             Quick Start
           </Badge>
           <h2 className="text-2xl font-bold text-foreground">Tell us about your business</h2>
           <p className="text-muted-foreground">Just 3 quick details — AI handles the rest</p>
         </div>
 
         <Card className="w-full border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
           <CardContent className="p-6 space-y-5">
             <div className="space-y-2">
               <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                 <Building2 className="w-4 h-4 text-muted-foreground" />
                 Business Name
               </label>
               <Input
                 placeholder="e.g., TruMove Relocations"
                 value={businessInfo.name}
                 onChange={(e) => setBusinessInfo(prev => ({ ...prev, name: e.target.value }))}
                 className="h-12 text-base"
               />
             </div>
 
             <div className="space-y-2">
               <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                 <MapPin className="w-4 h-4 text-muted-foreground" />
                 Primary Service Area
               </label>
               <Input
                 placeholder="e.g., California, New York"
                 value={businessInfo.location}
                 onChange={(e) => setBusinessInfo(prev => ({ ...prev, location: e.target.value }))}
                 className="h-12 text-base"
               />
             </div>
 
             <div className="space-y-2">
               <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                 <Target className="w-4 h-4 text-muted-foreground" />
                 Main Service
               </label>
               <div className="flex flex-wrap gap-2">
                 {services.map((service) => (
                   <Badge
                     key={service}
                     variant={businessInfo.service === service ? 'default' : 'outline'}
                     className="cursor-pointer py-2 px-3 text-sm transition-all hover:scale-105"
                     onClick={() => setBusinessInfo(prev => ({ ...prev, service }))}
                   >
                     {service}
                   </Badge>
                 ))}
               </div>
             </div>
           </CardContent>
         </Card>
 
         <div className="flex gap-3 w-full">
           <Button 
             variant="outline" 
             className="flex-1"
             onClick={() => setStep('welcome')}
           >
             Back
           </Button>
           <Button 
             className="flex-1 gap-2"
             style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}
             onClick={handleCreatePage}
             disabled={!businessInfo.name || !businessInfo.location}
           >
             <Sparkles className="w-4 h-4" />
             Create My Page
           </Button>
         </div>
       </div>
     );
   }
 
   return (
     <div className="flex flex-col items-center justify-center h-full py-12 px-6 space-y-8">
       {/* Welcome Header */}
       <div className="text-center space-y-3">
         <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
           <Sparkles className="w-10 h-10 text-white" />
         </div>
         <h1 className="text-3xl font-bold text-foreground">Welcome to Your Marketing Hub! 🎉</h1>
         <p className="text-lg text-muted-foreground max-w-md">
           Let's set up your first marketing campaign in under 5 minutes.
         </p>
       </div>
 
       {/* Action Cards */}
       <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
         <Card 
           className="group cursor-pointer border-2 border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all bg-gradient-to-br from-primary/10 to-transparent"
           onClick={handleQuickStart}
         >
           <CardContent className="p-6 text-center space-y-3">
             <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
               <Rocket className="w-7 h-7 text-primary" />
             </div>
             <div>
               <h3 className="font-semibold text-lg text-foreground">Quick Start</h3>
               <p className="text-sm text-muted-foreground mt-1">
                 Create my first landing page
               </p>
             </div>
             <Button 
               variant="ghost" 
               size="sm" 
               className="gap-1 w-full group-hover:bg-primary group-hover:text-primary-foreground"
             >
               Start Now <ArrowRight className="w-4 h-4" />
             </Button>
           </CardContent>
         </Card>
 
         <Card 
           className="group cursor-pointer border-2 hover:border-muted-foreground/50 hover:shadow-lg transition-all"
           onClick={() => onComplete('explore')}
         >
           <CardContent className="p-6 text-center space-y-3">
             <div className="mx-auto w-14 h-14 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
               <BarChart3 className="w-7 h-7 text-muted-foreground" />
             </div>
             <div>
               <h3 className="font-semibold text-lg text-foreground">Explore</h3>
               <p className="text-sm text-muted-foreground mt-1">
                 Show me around first
               </p>
             </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 w-full"
              >
                Browse Features <ArrowRight className="w-4 h-4" />
              </Button>
           </CardContent>
         </Card>
       </div>
 
       {/* Skip link */}
       <button 
         className="text-sm text-muted-foreground hover:text-primary transition-colors"
         onClick={() => onComplete('explore')}
       >
         Skip for now →
       </button>
     </div>
   );
 }