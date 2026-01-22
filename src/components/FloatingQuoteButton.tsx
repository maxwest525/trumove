import { Sparkles } from 'lucide-react';

interface FloatingQuoteButtonProps {
  onChatOpen: () => void;
}

export default function FloatingQuoteButton({ onChatOpen }: FloatingQuoteButtonProps) {
  return (
    <div className="tru-floating-quote is-visible">
      {/* AI Moving Helper Button */}
      <button className="tru-floating-toggle" onClick={onChatOpen}>
        <Sparkles className="w-4 h-4" />
        <span>AI Moving Helper</span>
      </button>
    </div>
  );
}
