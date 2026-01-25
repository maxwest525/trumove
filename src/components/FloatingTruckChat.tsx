import React, { useState } from 'react';
import { Truck, Sparkles } from 'lucide-react';
import ChatModal from './chat/ChatModal';

interface FloatingTruckChatProps {
  className?: string;
}

export default function FloatingTruckChat({ className = '' }: FloatingTruckChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton] = useState(true);

  return (
    <>
      {/* Floating Pill Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 z-50
          px-5 py-3 rounded-full
          bg-card text-foreground
          border border-border
          shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.25),0_0_0_1px_hsl(var(--primary)/0.1)]
          flex items-center gap-3
          transition-all duration-300 ease-out
          hover:shadow-[0_8px_32px_-4px_hsl(var(--primary)/0.35),0_0_0_1px_hsl(var(--primary)/0.2)]
          hover:scale-[1.02] hover:-translate-y-0.5
          focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
          ${!showButton ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}
          ${className}
        `}
        aria-label="AI Moving Helper"
      >
        {/* Truck Icon Container */}
        <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 border border-primary/20">
          <Truck className="w-5 h-5 text-primary animate-truck-bounce" />
          {/* Sparkle indicator */}
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-primary animate-pulse" />
        </div>
        
        {/* Text Label */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold leading-tight">AI Moving Helper</span>
          <span className="text-xs text-muted-foreground leading-tight">Ask me anything</span>
        </div>
        
        {/* Status indicator */}
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse ml-1" />
      </button>

      {/* Chat Modal */}
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
