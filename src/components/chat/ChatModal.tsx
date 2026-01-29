import { useState } from "react";
import { X, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatContainer from "./ChatContainer";
import AIChatContainer from "./AIChatContainer";
import { getPageContext, PageContext } from "./pageContextConfig";
import { cn } from "@/lib/utils";

type ChatMode = "ai" | "quick-quote";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFromLocation?: string;
  initialToLocation?: string;
  defaultMode?: ChatMode;
  pagePath?: string;
}

export default function ChatModal({ 
  isOpen, 
  onClose, 
  initialFromLocation, 
  initialToLocation,
  defaultMode = "ai",
  pagePath = "/"
}: ChatModalProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ChatMode>(defaultMode);
  const pageContext = getPageContext(pagePath);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="chat-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Panel */}
      <div className="chat-modal-panel" role="dialog" aria-modal="true" aria-label="AI Chat Assistant">
        <div className="chat-modal-header">
          {/* Mode Toggle */}
          <div className="flex items-center gap-1 p-0.5 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => setMode("ai")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                mode === "ai" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="w-3 h-3" />
              Ask TruDy
            </button>
            <button
              type="button"
              onClick={() => setMode("quick-quote")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                mode === "quick-quote" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Zap className="w-3 h-3" />
              Quick Quote
            </button>
          </div>
          
          <button 
            type="button" 
            className="chat-modal-close"
            onClick={onClose}
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="chat-modal-body">
          {mode === "ai" ? (
            <AIChatContainer 
              pageContext={pageContext}
              onSwitchToQuickQuote={() => setMode("quick-quote")}
            />
          ) : (
            <ChatContainer 
              initialFromLocation={initialFromLocation}
              initialToLocation={initialToLocation}
            />
          )}
        </div>
        
        <div className="chat-modal-footer">
          <span>Prefer to build your own quote?</span>
          <button 
            type="button" 
            className="chat-modal-link"
            onClick={() => {
              onClose();
              navigate("/online-estimate");
            }}
          >
            Use the form instead →
          </button>
        </div>
      </div>
    </>
  );
}
