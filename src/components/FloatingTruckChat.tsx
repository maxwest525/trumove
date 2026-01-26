import React, { useState } from 'react';
import { Truck, Sparkles, X } from 'lucide-react';
import ChatModal from './chat/ChatModal';

interface FloatingTruckChatProps {
  className?: string;
}

export default function FloatingTruckChat({ className = '' }: FloatingTruckChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton] = useState(true);
  
  // Hide state with localStorage persistence
  const [isHidden, setIsHidden] = useState(() => {
    return localStorage.getItem('tm_ai_helper_hidden') === 'true';
  });

  const handleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHidden(true);
    localStorage.setItem('tm_ai_helper_hidden', 'true');
  };

  // Don't render if hidden
  if (isHidden) return null;

  return (
    <>
      {/* Floating Pill Button - High visibility with pulse animation */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-24 right-6 z-50
          px-5 py-3.5 rounded-full
          bg-foreground text-background
          border-2 border-primary/30
          shadow-[0_8px_32px_-4px_hsl(var(--primary)/0.4),0_4px_16px_-2px_hsl(var(--tm-ink)/0.3)]
          flex items-center gap-3
          transition-all duration-300 ease-out
          hover:shadow-[0_12px_40px_-4px_hsl(var(--primary)/0.5),0_6px_20px_-2px_hsl(var(--tm-ink)/0.35)]
          hover:scale-[1.03] hover:-translate-y-1
          focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2
          ${!showButton ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}
          ${className}
        `}
        aria-label="AI Moving Helper"
      >
        {/* Truck Icon Container */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-background/20 border border-background/30">
          <Truck className="w-5 h-5 text-background animate-truck-bounce" />
          {/* Sparkle indicator */}
          <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-background animate-pulse" />
        </div>
        
        {/* Text Label */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold leading-tight text-background">AI Moving Helper</span>
          <span className="text-xs leading-tight text-background/70">Ask me anything</span>
        </div>
        
        {/* Status indicator - smaller and more subtle */}
        <span className="w-2 h-2 rounded-full bg-primary ml-1" />
        
        {/* Small dismiss X button */}
        <button
          onClick={handleHide}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
          aria-label="Hide AI Helper"
        >
          <X className="w-3 h-3" />
        </button>
      </button>

      {/* Chat Modal */}
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
