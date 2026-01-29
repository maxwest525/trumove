import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import ChatModal from './chat/ChatModal';

interface FloatingChatButtonProps {
  className?: string;
}

export default function FloatingChatButton({ className = '' }: FloatingChatButtonProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Only show after scrolling past quote builder
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 600);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          bg-foreground text-background
          shadow-lg shadow-[0_4px_16px_hsl(var(--primary)/0.3)]
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-xl hover:shadow-[0_8px_24px_hsl(var(--primary)/0.4)]
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
          ${!showButton ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}
          ${className}
        `}
        aria-label="AI Moving Helper"
      >
        {/* Icon */}
        <Sparkles className="w-6 h-6 relative z-10" />
        
        {/* Tooltip */}
        <span
          className={`
            absolute right-full mr-3 px-3 py-1.5
            bg-foreground text-background text-sm font-medium
            rounded-lg whitespace-nowrap
            transition-all duration-200
            ${isHovered && showButton ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}
          `}
        >
          AI Moving Helper
        </span>
      </button>

      {/* Chat Modal */}
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} pagePath={location.pathname} />
    </>
  );
}
