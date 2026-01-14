import { cn } from "@/lib/utils";

interface ChatMessageProps {
  sender: 'bot' | 'user';
  content: string;
  timestamp?: Date;
}

export default function ChatMessage({ sender, content, timestamp }: ChatMessageProps) {
  return (
    <div className={cn("chat-message", sender === 'bot' ? "is-bot" : "is-user")}>
      {sender === 'bot' && (
        <div className="chat-avatar">
          <svg viewBox="0 0 24 24" fill="none" className="chat-avatar-icon">
            <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <div className="chat-bubble">
        <span className="chat-bubble-text">{content}</span>
        {timestamp && (
          <span className="chat-bubble-time">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}
