import React, { useState } from 'react';
import { Sparkles, X, MessageCircle } from 'lucide-react';
import ChatModal from './chat/ChatModal';

interface FloatingChatButtonProps {
  className?: string;
}

export default function FloatingChatButton({ className = '' }: FloatingChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-primary text-primary-foreground
          shadow-lg shadow-primary/30
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-xl hover:shadow-primary/40
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
          ${className}
        `}
        aria-label="Open AI Chat"
      >
        {/* Pulse ring animation */}
        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
        
        {/* Icon */}
        <Sparkles className="w-6 h-6 relative z-10" />
        
        {/* Tooltip */}
        <span
          className={`
            absolute right-full mr-3 px-3 py-1.5
            bg-foreground text-background text-sm font-medium
            rounded-lg whitespace-nowrap
            transition-all duration-200
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}
          `}
        >
          Chat with AI
        </span>
      </button>

      {/* Chat Modal */}
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
