import { useState } from "react";
import { AlertTriangle, X, ChevronRight, Zap, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DetectedKeyword } from "@/hooks/useKeywordDetection";
import { TalkTrackCard } from "./TalkTrackCard";

interface KeywordPromptBannerProps {
  detections: DetectedKeyword[];
  onDismiss: (patternId: string) => void;
  onTalkTrackUsed?: (talkTrackId: string) => void;
}

export function KeywordPromptBanner({ 
  detections, 
  onDismiss,
  onTalkTrackUsed
}: KeywordPromptBannerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (detections.length === 0) return null;

  const priorityColors = {
    high: {
      bg: 'bg-destructive/10',
      border: 'border-destructive/40',
      text: 'text-destructive',
      icon: 'text-destructive'
    },
    medium: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/40',
      text: 'text-orange-600',
      icon: 'text-orange-500'
    },
    low: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/40',
      text: 'text-blue-600',
      icon: 'text-blue-500'
    }
  };

  return (
    <div className="space-y-2">
      {detections.map(detection => {
        const colors = priorityColors[detection.pattern.priority];
        const isExpanded = expandedId === detection.pattern.id;

        return (
          <div
            key={detection.pattern.id}
            className={cn(
              "rounded-lg border-2 transition-all overflow-hidden",
              colors.bg,
              colors.border,
              detection.pattern.priority === 'high' && "animate-pulse"
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-2 p-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                colors.bg
              )}>
                <Zap className={cn("w-4 h-4", colors.icon)} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-bold uppercase", colors.text)}>
                    {detection.pattern.priority === 'high' ? '🔥 Detected' : 'Detected'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    "{detection.matchedKeyword}"
                  </span>
                </div>
                <div className="text-sm font-medium">
                  {detection.talkTrack?.title || 'Suggested Response'}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setExpandedId(isExpanded ? null : detection.pattern.id)}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {isExpanded ? 'Hide' : 'View Script'}
                  <ChevronRight className={cn(
                    "w-4 h-4 ml-1 transition-transform",
                    isExpanded && "rotate-90"
                  )} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDismiss(detection.pattern.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Expanded Talk Track */}
            {isExpanded && detection.talkTrack && (
              <div className="px-3 pb-3 border-t border-border/50 pt-3">
                <TalkTrackCard 
                  track={detection.talkTrack} 
                  defaultExpanded={true}
                />
                {onTalkTrackUsed && (
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      onTalkTrackUsed(detection.talkTrack!.id);
                      onDismiss(detection.pattern.id);
                    }}
                  >
                    Mark as Used & Dismiss
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
