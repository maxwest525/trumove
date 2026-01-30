import trudyAvatar from "@/assets/trudy-avatar.png";

export default function TypingIndicator() {
  return (
    <div className="chat-message is-bot">
      <div className="chat-avatar">
        <img src={trudyAvatar} alt="Trudy" className="w-8 h-8 rounded-full object-cover" />
      </div>
      <div className="chat-bubble">
        <div className="chat-typing">
          <span className="chat-typing-dot"></span>
          <span className="chat-typing-dot"></span>
          <span className="chat-typing-dot"></span>
        </div>
      </div>
    </div>
  );
}
