import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Pencil, Check, X, Sparkles, RefreshCw, Eye, 
  Type, FileText, Zap, Image, Palette, Save,
  Undo2, ChevronRight, Loader2, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EditableSection {
  id: string;
  label: string;
  type: 'headline' | 'subheadline' | 'body' | 'cta' | 'testimonial';
  content: string;
  maxLength?: number;
  aiSuggestions?: string[];
}

interface PostGenerationEditorProps {
  sections: EditableSection[];
  onSave: (sections: EditableSection[]) => void;
  onCancel: () => void;
  businessName: string;
  targetLocation: string;
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  headline: Type,
  subheadline: Type,
  body: FileText,
  cta: Zap,
  testimonial: FileText,
};

export function PostGenerationEditor({ 
  sections: initialSections, 
  onSave, 
  onCancel,
  businessName,
  targetLocation
}: PostGenerationEditorProps) {
  const [sections, setSections] = useState<EditableSection[]>(initialSections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  // AI suggestions per section type
  const generateAISuggestions = async (sectionId: string, type: string) => {
    setIsGeneratingAI(sectionId);
    
    // Simulate AI generation
    await new Promise(r => setTimeout(r, 1500));
    
    const suggestions: Record<string, string[]> = {
      headline: [
        `${businessName} - ${targetLocation}'s Most Trusted Movers`,
        `Stop Overpaying for Your Move`,
        `Move Smarter with ${businessName}`,
        `Your Stress-Free Move Starts Here`,
      ],
      subheadline: [
        `Get AI-Powered Pricing in 60 Seconds`,
        `Join 50,000+ Happy Families`,
        `Licensed, Insured & 5-Star Rated`,
        `Free Quotes. Zero Hidden Fees.`,
      ],
      body: [
        `Experience the difference with ${businessName}. Our AI-powered platform scans your inventory and matches you with verified carriers in seconds. Save an average of $847 on your next move.`,
        `Moving doesn't have to be stressful. Get instant quotes from pre-vetted carriers, track your shipment in real-time, and enjoy white-glove service at competitive prices.`,
      ],
      cta: [
        `Get My Free Quote`,
        `Start My Move`,
        `Calculate My Cost`,
        `Book Now & Save`,
        `Claim My Discount`,
      ],
      testimonial: [
        `"The AI estimate was spot-on. Saved us over $1,000 compared to other quotes!" - Sarah M., ${targetLocation}`,
        `"From quote to delivery, everything was seamless. Best moving experience ever." - Mike T.`,
      ],
    };

    setSections(prev => prev.map(s => 
      s.id === sectionId 
        ? { ...s, aiSuggestions: suggestions[type] || suggestions.headline }
        : s
    ));
    setIsGeneratingAI(null);
  };

  const handleStartEdit = (section: EditableSection) => {
    setEditingId(section.id);
    setTempValue(section.content);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    setSections(prev => prev.map(s => 
      s.id === editingId ? { ...s, content: tempValue } : s
    ));
    setEditingId(null);
    setTempValue("");
    setHasChanges(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTempValue("");
  };

  const handleApplySuggestion = (sectionId: string, suggestion: string) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, content: suggestion, aiSuggestions: undefined } : s
    ));
    setHasChanges(true);
    toast.success("Suggestion applied!");
  };

  const handleSaveAll = () => {
    onSave(sections);
    toast.success("Changes saved successfully!");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Pencil className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Customize Your Page</h2>
            <p className="text-xs text-muted-foreground">Edit content or use AI suggestions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={handleSaveAll}
            disabled={!hasChanges}
            className="gap-1"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-3 border-b border-border">
          <TabsList className="h-9">
            <TabsTrigger value="content" className="text-xs gap-1">
              <Type className="w-3.5 h-3.5" />
              Content
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs gap-1">
              <Palette className="w-3.5 h-3.5" />
              Style
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs gap-1">
              <Eye className="w-3.5 h-3.5" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="content" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {sections.map((section) => {
                const IconComponent = SECTION_ICONS[section.type] || FileText;
                const isEditing = editingId === section.id;
                const isGenerating = isGeneratingAI === section.id;

                return (
                  <Card key={section.id} className={cn(
                    "transition-all",
                    isEditing && "ring-2 ring-primary"
                  )}>
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-muted-foreground" />
                          <CardTitle className="text-sm">{section.label}</CardTitle>
                          <Badge variant="outline" className="text-[9px] uppercase">
                            {section.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {!isEditing && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 px-2 text-xs"
                                onClick={() => generateAISuggestions(section.id, section.type)}
                                disabled={isGenerating}
                              >
                                {isGenerating ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                                )}
                                AI Ideas
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 px-2 text-xs"
                                onClick={() => handleStartEdit(section)}
                              >
                                <Pencil className="w-3.5 h-3.5 mr-1" />
                                Edit
                              </Button>
                            </>
                          )}
                          {isEditing && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 px-2 text-xs text-destructive"
                                onClick={handleCancelEdit}
                              >
                                <X className="w-3.5 h-3.5 mr-1" />
                                Cancel
                              </Button>
                              <Button 
                                size="sm" 
                                className="h-7 px-2 text-xs"
                                onClick={handleSaveEdit}
                              >
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Save
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 px-4 pb-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          {section.type === 'body' || section.type === 'testimonial' ? (
                            <Textarea
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="min-h-[100px]"
                              maxLength={section.maxLength}
                            />
                          ) : (
                            <Input
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              maxLength={section.maxLength}
                            />
                          )}
                          {section.maxLength && (
                            <p className={cn(
                              "text-xs text-right",
                              tempValue.length > section.maxLength * 0.9 
                                ? "text-orange-500" 
                                : "text-muted-foreground"
                            )}>
                              {tempValue.length}/{section.maxLength}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3">
                          {section.content}
                        </p>
                      )}

                      {/* AI Suggestions */}
                      {section.aiSuggestions && section.aiSuggestions.length > 0 && !isEditing && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-primary">
                            <Sparkles className="w-3 h-3" />
                            <span className="font-medium">AI Suggestions</span>
                          </div>
                          <div className="space-y-1.5">
                            {section.aiSuggestions.map((suggestion, i) => (
                              <button
                                key={i}
                                onClick={() => handleApplySuggestion(section.id, suggestion)}
                                className="w-full text-left p-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-xs flex items-center gap-2 group"
                              >
                                <span className="flex-1 line-clamp-2">{suggestion}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="style" className="flex-1 m-0 p-4">
          <div className="text-center text-muted-foreground py-8">
            <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Style customization available in full editor</p>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 m-0 p-4">
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="space-y-4 text-center">
                <h1 className="text-2xl font-bold text-foreground">
                  {sections.find(s => s.type === 'headline')?.content}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {sections.find(s => s.type === 'subheadline')?.content}
                </p>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                  {sections.find(s => s.type === 'body')?.content}
                </p>
                <Button size="lg" className="mt-4">
                  {sections.find(s => s.type === 'cta')?.content || 'Get Quote'}
                </Button>
                {sections.find(s => s.type === 'testimonial') && (
                  <blockquote className="italic text-sm text-muted-foreground border-l-2 border-primary pl-4 mt-6 text-left max-w-md mx-auto">
                    {sections.find(s => s.type === 'testimonial')?.content}
                  </blockquote>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer with status */}
      {hasChanges && (
        <div className="p-3 border-t border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Unsaved changes
          </div>
          <Button size="sm" onClick={handleSaveAll} className="gap-1">
            <CheckCircle2 className="w-4 h-4" />
            Save All
          </Button>
        </div>
      )}
    </div>
  );
}
