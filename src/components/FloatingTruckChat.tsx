import React, { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';
import ChatModal from './chat/ChatModal';

interface FloatingTruckChatProps {
  className?: string;
}

export default function FloatingTruckChat({ className = '' }: FloatingTruckChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showButton, setShowButton] = useState(true);

  return (
    <>
      {/* Floating Truck Button */}
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed bottom-6 right-6 z-50
          w-16 h-16 rounded-full
          bg-primary text-primary-foreground
          shadow-lg shadow-primary/30
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-xl hover:shadow-primary/40
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
          ${!showButton ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}
          ${className}
        `}
        aria-label="AI Moving Assistant"
      >
        {/* Pulse ring animation */}
        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
        
        {/* Truck Icon with driving animation */}
        <div className="relative z-10 flex items-center justify-center">
          <Truck className="w-7 h-7 animate-truck-bounce" />
        </div>
        
        {/* Tooltip */}
        <span
          className={`
            absolute right-full mr-3 px-3 py-2
            bg-card text-card-foreground text-sm font-medium
            rounded-lg whitespace-nowrap shadow-lg border border-border
            transition-all duration-200
            ${isHovered && showButton ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}
          `}
        >
          <span className="flex items-center gap-2">
            <span className="text-primary">●</span>
            AI Moving Assistant
          </span>
        </span>
      </button>

      {/* Chat Modal */}
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
