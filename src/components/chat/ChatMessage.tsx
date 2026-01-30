import { cn } from "@/lib/utils";
import trudyAvatar from "@/assets/trudy-avatar.png";

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
          <img src={trudyAvatar} alt="Trudy" className="w-8 h-8 rounded-full object-cover" />
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
