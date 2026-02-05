import { useState } from "react";
import { ChevronDown, ChevronRight, Lightbulb, MessageSquare, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { TalkTrack } from "./types";
import { toast } from "sonner";

interface TalkTrackCardProps {
  track: TalkTrack;
  defaultExpanded?: boolean;
}

export function TalkTrackCard({ track, defaultExpanded = false }: TalkTrackCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const categoryColors = {
    objection: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-600', label: 'Objection' },
    upsell: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-600', label: 'Upsell' },
    compliance: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-600', label: 'Compliance' },
    closing: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-600', label: 'Closing' },
  };

  const colors = categoryColors[track.category];

  const handleCopy = () => {
    navigator.clipboard.writeText(track.script);
    setCopied(true);
    toast.success("Script copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "rounded-lg border transition-all",
      colors.border,
      colors.bg
    )}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 p-3 text-left"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
        <MessageSquare className={cn("w-4 h-4 flex-shrink-0", colors.text)} />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{track.title}</div>
        </div>
        <span className={cn("text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded", colors.bg, colors.text)}>
          {colors.label}
        </span>
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Script */}
          <div className="relative">
            <div className="bg-background rounded-lg p-3 text-sm leading-relaxed border">
              "{track.script}"
            </div>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-muted hover:bg-muted-foreground/20 transition-colors"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Lightbulb className="w-3 h-3" />
              Quick Tips
            </div>
            <ul className="space-y-1">
              {track.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
