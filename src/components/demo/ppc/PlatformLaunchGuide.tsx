 import { useState } from "react";
 import { X, ExternalLink, Copy, Download, Check, ChevronRight, DollarSign, Users, Target } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { toast } from "sonner";
 
 interface PlatformLaunchGuideProps {
   platform: "google" | "meta" | "tiktok";
   onClose: () => void;
   adImage?: string;
   adCopy?: {
     headline: string;
     description: string;
     cta: string;
   };
 }
 
 const PLATFORM_CONFIG = {
   google: {
     name: "Google Ads",
     url: "https://ads.google.com",
     color: "bg-blue-500",
     gradient: "from-blue-500 to-blue-600",
     steps: [
       { step: 1, title: "Go to Google Ads", description: "Visit ads.google.com and sign in to your account" },
       { step: 2, title: "Create New Campaign", description: "Click the '+' button and select 'New Campaign'" },
       { step: 3, title: "Choose Your Goal", description: "Select 'Leads' or 'Website traffic' for moving services" },
       { step: 4, title: "Select Campaign Type", description: "Choose 'Search' for text ads or 'Display' for image ads" },
       { step: 5, title: "Set Your Budget", description: "Start with $50-100/day for testing. Adjust based on results." },
       { step: 6, title: "Upload Your Creative", description: "Use the image and copy we generated below" },
       { step: 7, title: "Review & Launch", description: "Double-check settings and click 'Publish Campaign'" },
     ],
     budget: "$50-100/day",
     audience: "Search intent keywords",
   },
   meta: {
     name: "Meta (Facebook/Instagram)",
     url: "https://business.facebook.com/adsmanager",
     color: "bg-indigo-500",
     gradient: "from-indigo-500 to-purple-600",
     steps: [
       { step: 1, title: "Open Ads Manager", description: "Go to business.facebook.com/adsmanager" },
       { step: 2, title: "Click Create", description: "Click the green 'Create' button to start a new campaign" },
       { step: 3, title: "Choose Objective", description: "Select 'Lead generation' or 'Traffic' for best results" },
       { step: 4, title: "Define Your Audience", description: "Target people moving to/from your service area" },
       { step: 5, title: "Set Placements", description: "Use 'Advantage+ placements' or select Feed & Stories" },
       { step: 6, title: "Upload Creative", description: "Add your generated image and copy the ad text" },
       { step: 7, title: "Set Budget & Schedule", description: "Start with $30-50/day lifetime or daily budget" },
       { step: 8, title: "Review & Publish", description: "Check preview and click 'Publish'" },
     ],
     budget: "$30-50/day",
     audience: "Demographics + interests",
   },
   tiktok: {
     name: "TikTok Ads",
     url: "https://ads.tiktok.com",
     color: "bg-pink-500",
     gradient: "from-pink-500 to-red-500",
     steps: [
       { step: 1, title: "Access TikTok Ads Manager", description: "Go to ads.tiktok.com and sign in" },
       { step: 2, title: "Create Campaign", description: "Click 'Create' and choose your advertising objective" },
       { step: 3, title: "Select Objective", description: "Choose 'Website conversions' or 'Lead generation'" },
       { step: 4, title: "Set Up Ad Group", description: "Define targeting: age 25-55, homeowners, moving interest" },
       { step: 5, title: "Choose Placements", description: "Select TikTok feed or automatic placements" },
       { step: 6, title: "Create Your Ad", description: "Upload image/video. For static images, TikTok will animate" },
       { step: 7, title: "Set Budget", description: "Minimum $20/day. Recommend $50+/day for moving services" },
       { step: 8, title: "Submit for Review", description: "TikTok reviews ads in 24-48 hours before going live" },
     ],
     budget: "$50+/day",
     audience: "Age 25-55, life events",
   },
 };
 
 const DEFAULT_COPY = {
   headline: "TruMove - AI-Powered Moving Quotes",
   description: "Get accurate quotes in 60 seconds. Compare verified movers. No hidden fees. Trusted by 50,000+ families.",
   cta: "Get Free Quote",
 };
 
 export function PlatformLaunchGuide({ platform, onClose, adImage, adCopy = DEFAULT_COPY }: PlatformLaunchGuideProps) {
   const [copiedField, setCopiedField] = useState<string | null>(null);
   const config = PLATFORM_CONFIG[platform];
 
   const handleCopy = async (text: string, field: string) => {
     await navigator.clipboard.writeText(text);
     setCopiedField(field);
     toast.success(`${field} copied to clipboard!`);
     setTimeout(() => setCopiedField(null), 2000);
   };
 
   const handleDownloadImage = () => {
     if (!adImage) return;
     const link = document.createElement("a");
     link.href = adImage;
     link.download = `trumove-${platform}-ad.png`;
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
     toast.success("Image downloaded!");
   };
 
   return (
     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
       <div className="bg-background rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl border border-border">
         {/* Header */}
         <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                 <Target className="w-6 h-6" />
               </div>
               <div>
                 <h2 className="text-xl font-bold">Launch on {config.name}</h2>
                 <p className="text-white/80 text-sm">Follow these steps to go live</p>
               </div>
             </div>
             <button
               onClick={onClose}
               className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
             >
               <X className="w-4 h-4" />
             </button>
           </div>
           
           {/* Quick Stats */}
           <div className="flex gap-4">
             <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
               <DollarSign className="w-4 h-4" />
               <span className="text-sm font-medium">{config.budget} recommended</span>
             </div>
             <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
               <Users className="w-4 h-4" />
               <span className="text-sm font-medium">{config.audience}</span>
             </div>
           </div>
         </div>
 
         {/* Content */}
         <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
           {/* Step-by-Step Guide */}
           <div className="mb-6">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Step-by-Step Guide</h3>
             <div className="space-y-3">
               {config.steps.map((step, index) => (
                 <div 
                   key={step.step}
                   className="flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                 >
                   <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                     {step.step}
                   </div>
                   <div className="flex-1">
                     <h4 className="font-medium text-foreground">{step.title}</h4>
                     <p className="text-sm text-muted-foreground">{step.description}</p>
                   </div>
                   <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                 </div>
               ))}
             </div>
           </div>
 
           {/* Creative Assets */}
           <div className="border-t border-border pt-6">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Your Creative Assets</h3>
             
             <div className="grid grid-cols-2 gap-4">
               {/* Image Preview */}
               <div className="space-y-2">
                 <span className="text-xs font-medium text-muted-foreground">Ad Image</span>
                 {adImage ? (
                   <div className="relative rounded-xl overflow-hidden border border-border aspect-square bg-muted">
                     <img src={adImage} alt="Ad creative" className="w-full h-full object-cover" />
                     <Button
                       size="sm"
                       className="absolute bottom-2 right-2 h-7 text-xs gap-1"
                       onClick={handleDownloadImage}
                     >
                       <Download className="w-3 h-3" />
                       Download
                     </Button>
                   </div>
                 ) : (
                   <div className="rounded-xl border border-dashed border-border aspect-square bg-muted/50 flex items-center justify-center">
                     <span className="text-sm text-muted-foreground">No image generated</span>
                   </div>
                 )}
               </div>
 
               {/* Ad Copy */}
               <div className="space-y-3">
                 <span className="text-xs font-medium text-muted-foreground">Ad Copy</span>
                 
                 {/* Headline */}
                 <div className="p-3 rounded-xl bg-muted/50 border border-border">
                   <div className="flex items-center justify-between mb-1">
                     <span className="text-[10px] uppercase text-muted-foreground font-medium">Headline</span>
                     <button
                       onClick={() => handleCopy(adCopy.headline, "Headline")}
                       className="text-xs text-primary hover:underline flex items-center gap-1"
                     >
                       {copiedField === "Headline" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                       {copiedField === "Headline" ? "Copied!" : "Copy"}
                     </button>
                   </div>
                   <p className="text-sm font-medium">{adCopy.headline}</p>
                 </div>
 
                 {/* Description */}
                 <div className="p-3 rounded-xl bg-muted/50 border border-border">
                   <div className="flex items-center justify-between mb-1">
                     <span className="text-[10px] uppercase text-muted-foreground font-medium">Description</span>
                     <button
                       onClick={() => handleCopy(adCopy.description, "Description")}
                       className="text-xs text-primary hover:underline flex items-center gap-1"
                     >
                       {copiedField === "Description" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                       {copiedField === "Description" ? "Copied!" : "Copy"}
                     </button>
                   </div>
                   <p className="text-sm">{adCopy.description}</p>
                 </div>
 
                 {/* CTA */}
                 <div className="p-3 rounded-xl bg-muted/50 border border-border">
                   <div className="flex items-center justify-between mb-1">
                     <span className="text-[10px] uppercase text-muted-foreground font-medium">Call to Action</span>
                     <button
                       onClick={() => handleCopy(adCopy.cta, "CTA")}
                       className="text-xs text-primary hover:underline flex items-center gap-1"
                     >
                       {copiedField === "CTA" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                       {copiedField === "CTA" ? "Copied!" : "Copy"}
                     </button>
                   </div>
                   <p className="text-sm font-medium">{adCopy.cta}</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
 
         {/* Footer */}
         <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
           <Button variant="ghost" onClick={onClose}>
             Close
           </Button>
           <Button 
             className={`bg-gradient-to-r ${config.gradient} hover:opacity-90 gap-2`}
             onClick={() => window.open(config.url, "_blank")}
           >
             Open {config.name}
             <ExternalLink className="w-4 h-4" />
           </Button>
         </div>
       </div>
     </div>
   );
 }