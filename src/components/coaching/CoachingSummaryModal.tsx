import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AdminCoachingSummary } from "@/components/coaching/AdminCoachingSummary";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, RefreshCw } from "lucide-react";

interface CoachingSummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CoachingSummaryModal({ open, onOpenChange }: CoachingSummaryModalProps) {
  const [isLiveMode, setIsLiveMode] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-semibold">Team Coaching Overview</DialogTitle>
              <Badge variant="secondary" className="text-xs">Admin View</Badge>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border",
                  isLiveMode 
                    ? "bg-green-500/10 text-green-600 border-green-500/30" 
                    : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                )}
              >
                {isLiveMode ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Live Updates
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    Enable Live
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          <AdminCoachingSummary isLiveMode={isLiveMode} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
