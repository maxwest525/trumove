import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles, ArrowRight, CheckCircle2,
  Building2, MapPin, Loader2, Target, Zap, Phone
} from "lucide-react";

interface OneClickPageCreatorProps {
  onComplete: (pageData: PageData) => void;
  onCancel: () => void;
}

interface PageData {
  goal: string;
  businessName: string;
  location: string;
  phone: string;
  service: string;
  uniqueValue: string;
}

const SERVICE_OPTIONS = [
  'Long Distance Moving',
  'Local Moving', 
  'Commercial Moving',
  'Packing Services',
  'Storage'
];

export function OneClickPageCreator({ onComplete, onCancel }: OneClickPageCreatorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pageData, setPageData] = useState<PageData>({
    goal: 'quote',
    businessName: 'TruMove',
    location: '',
    phone: '',
    service: 'Long Distance Moving',
    uniqueValue: '',
  });

  const [generationStep, setGenerationStep] = useState(0);
  const generationSteps = [
    'Analyzing your business...',
    'Writing compelling headlines...',
    'Adding trust elements...',
    'Optimizing for conversions...',
    'Finalizing your page...',
  ];

  const handleCreate = () => {
    if (!pageData.businessName || !pageData.location) return;
    
    setIsGenerating(true);
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      setGenerationStep(currentStep);
      
      if (currentStep >= generationSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete(pageData);
        }, 400);
      }
    }, 500);
  };

  const canCreate = pageData.businessName && pageData.location;

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
          </div>
        </div>
        
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-foreground">Creating your page...</h2>
          <p className="text-sm text-muted-foreground">AI is building your high-converting landing page</p>
        </div>

        <div className="w-full max-w-xs space-y-3">
          <Progress value={(generationStep / generationSteps.length) * 100} className="h-2" />
          <div className="space-y-1.5">
            {generationSteps.map((stepText, i) => (
              <div 
                key={i}
                className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                  i < generationStep ? 'text-primary' : i === generationStep ? 'text-foreground' : 'text-muted-foreground/40'
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
    <div className="max-w-md mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Zap className="w-4 h-4" />
          30-Second Setup
        </div>
        <h1 className="text-2xl font-bold text-foreground">Create Your Landing Page</h1>
        <p className="text-sm text-muted-foreground">Fill in basics, AI does the rest</p>
      </div>

      {/* Simple Form - Like Lead Capture */}
      <div className="space-y-4">
        {/* Business Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center gap-2 text-foreground">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            Business Name *
          </label>
          <Input
            placeholder="Your Company Name"
            value={pageData.businessName}
            onChange={(e) => setPageData(prev => ({ ...prev, businessName: e.target.value }))}
            className="h-12 text-base"
          />
        </div>

        {/* Target Location */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center gap-2 text-foreground">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Target Location *
          </label>
          <Input
            placeholder="e.g., Los Angeles, CA or Nationwide"
            value={pageData.location}
            onChange={(e) => setPageData(prev => ({ ...prev, location: e.target.value }))}
            className="h-12 text-base"
          />
        </div>

        {/* Phone (Optional) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center gap-2 text-foreground">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Phone <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <Input
            placeholder="1-800-XXX-XXXX"
            value={pageData.phone}
            onChange={(e) => setPageData(prev => ({ ...prev, phone: e.target.value }))}
            className="h-12 text-base"
          />
        </div>

        {/* Service Type */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center gap-2 text-foreground">
            <Target className="w-4 h-4 text-muted-foreground" />
            Service Type
          </label>
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map((service) => (
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
      </div>

      {/* What You'll Get */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
        <div className="text-sm font-medium text-foreground">Your page will include:</div>
        <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
          {[
            'Hero with CTA',
            'Quote form',
            'Trust badges',
            'Mobile optimized',
            'SEO ready',
            'Analytics'
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1 gap-2 h-12"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}
          onClick={handleCreate}
          disabled={!canCreate}
        >
          <Sparkles className="w-4 h-4" />
          Create Page
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        ✨ AI generates headlines, copy, and layout automatically
      </p>
    </div>
  );
}
