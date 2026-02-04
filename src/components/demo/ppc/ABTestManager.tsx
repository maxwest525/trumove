import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ABTest } from "./types";
import { DraggableABTestCard } from "./DraggableABTestCard";
import { generateABTestPDF } from "./pdfExport";
import { toast } from "sonner";
import {
  Plus, Download, Mail, Share2, FlaskConical,
  Layout, Layers, Zap, ArrowUpDown
} from "lucide-react";

interface ABTestManagerProps {
  tests: ABTest[];
  setTests: React.Dispatch<React.SetStateAction<ABTest[]>>;
  liveMode: boolean;
  onEmailExport: () => void;
}

export function ABTestManager({ tests, setTests, liveMode, onEmailExport }: ABTestManagerProps) {
  const [showNewTest, setShowNewTest] = useState(false);
  const [newTestName, setNewTestName] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTests((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        toast.success("Test order updated");
        return newOrder;
      });
    }
  };

  const handleCreateTest = () => {
    if (!newTestName.trim()) {
      toast.error("Please enter a test name");
      return;
    }
    
    const newTest: ABTest = {
      id: Date.now(),
      name: newTestName,
      status: "running",
      startDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      variants: [
        { name: "Control", visitors: 0, conversions: 0, rate: 0 },
        { name: "Variant A", visitors: 0, conversions: 0, rate: 0 },
      ],
      winner: "-",
      confidence: 0,
      lift: "0%"
    };
    
    setTests(prev => [newTest, ...prev]);
    setShowNewTest(false);
    setNewTestName("");
    toast.success("New A/B test created!");
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const generatedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      generateABTestPDF({ tests, generatedDate });
      toast.success("PDF report downloaded!");
    } catch (error) {
      toast.error("Failed to generate PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `https://trumove.ai/reports/abtest/${Date.now()}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Shareable link copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">A/B Test Manager</h3>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" />
            Drag to reorder
          </span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <Download className="w-3 h-3" />
            PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={onEmailExport}
          >
            <Mail className="w-3 h-3" />
            Email
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={handleShare}
          >
            <Share2 className="w-3 h-3" />
            Share
          </Button>
          <Button 
            size="sm" 
            className="gap-2"
            onClick={() => setShowNewTest(true)}
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}
          >
            <Plus className="w-4 h-4" />
            Create Test
          </Button>
        </div>
      </div>

      {/* New Test Form */}
      {showNewTest && (
        <div className="p-4 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/50 dark:bg-purple-950/20">
          <div className="flex items-center gap-3 mb-3">
            <FlaskConical className="w-5 h-5" style={{ color: "#7C3AED" }} />
            <h4 className="font-semibold text-foreground">New A/B Test</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Test Name</label>
              <Input 
                placeholder="e.g., Homepage CTA Color" 
                value={newTestName}
                onChange={(e) => setNewTestName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Test Type</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Layers className="w-3 h-3" />
                  Element
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Layout className="w-3 h-3" />
                  Page
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg border border-border bg-card">
              <div className="text-xs font-medium text-muted-foreground mb-2">Control (Original)</div>
              <div className="aspect-video rounded bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Current Version</span>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-dashed border-purple-300 bg-purple-50/30">
              <div className="text-xs font-medium mb-2" style={{ color: "#7C3AED" }}>Variant A</div>
              <div className="aspect-video rounded bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/70 transition-colors">
                <Plus className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowNewTest(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreateTest} style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>
              <Zap className="w-3 h-3 mr-1" />
              Launch Test
            </Button>
          </div>
        </div>
      )}

      {/* Draggable Tests List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tests.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tests.map((test) => (
              <DraggableABTestCard
                key={test.id}
                test={test}
                liveMode={liveMode}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
