import { useState, useEffect, RefObject } from 'react';
import { Calculator, Sparkles } from 'lucide-react';

interface FloatingQuoteButtonProps {
  quoteBuilderRef: RefObject<HTMLDivElement>;
  onChatOpen: () => void;
}

export default function FloatingQuoteButton({ quoteBuilderRef, onChatOpen }: FloatingQuoteButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show button when quote builder is NOT visible
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' }
    );

    if (quoteBuilderRef.current) {
      observer.observe(quoteBuilderRef.current);
    }

    return () => observer.disconnect();
  }, [quoteBuilderRef]);

  const scrollToQuoteBuilder = () => {
    quoteBuilderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className={`tru-floating-quote ${isVisible ? 'is-visible' : ''}`}>
      {/* Main Button - Jump to Quote Builder */}
      <button className="tru-floating-quote-btn" onClick={scrollToQuoteBuilder}>
        <Calculator className="w-5 h-5" />
        <span>Build Your Quote</span>
      </button>

      {/* Toggle to AI Chat */}
      <button className="tru-floating-toggle" onClick={onChatOpen}>
        <Sparkles className="w-4 h-4" />
        <span>AI Chat</span>
      </button>
    </div>
  );
}
