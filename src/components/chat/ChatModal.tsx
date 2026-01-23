import { X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatContainer from "./ChatContainer";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFromLocation?: string;
  initialToLocation?: string;
}

export default function ChatModal({ isOpen, onClose, initialFromLocation, initialToLocation }: ChatModalProps) {
  const navigate = useNavigate();

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
          <div className="chat-modal-title">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>TruMove AI Assistant</span>
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
          <ChatContainer 
            initialFromLocation={initialFromLocation}
            initialToLocation={initialToLocation}
          />
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
