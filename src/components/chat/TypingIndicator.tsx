export default function TypingIndicator() {
  return (
    <div className="chat-message is-bot">
      <div className="chat-avatar">
        <svg viewBox="0 0 24 24" fill="none" className="chat-avatar-icon">
          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
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
