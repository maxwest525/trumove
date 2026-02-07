import { useState } from "react";
import { MessageCircle, X, Send, Truck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "bot" | "user";
  content: string;
  timestamp: Date;
}

const QUICK_REPLIES = [
  "Get a quote",
  "Track my shipment",
  "Shipping rates",
  "Contact support"
];

const BOT_RESPONSES: Record<string, string> = {
  "get a quote": "I'd be happy to help you get a quote! Just fill out our quick form above, or tell me: What year, make, and model vehicle are you looking to ship?",
  "track my shipment": "To track your shipment, please provide your order number or the email address associated with your booking. I'll pull up your tracking details right away!",
  "shipping rates": "Our rates depend on distance, vehicle type, and transport method. Open carrier starts around $0.40/mile, while enclosed is about $0.60/mile. Want me to calculate a specific route?",
  "contact support": "You can reach our team at 1-800-555-MOVE or email support@howardvanlines.com. We're available Mon-Sat, 8am-8pm EST. Would you like me to have someone call you?",
  "default": "Thanks for reaching out! I'm Hank, your Howard Van Lines assistant. I can help with quotes, tracking, rates, or connect you with our team. What can I do for you today?"
};

export default function HankChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      content: "Howdy! I'm Hank, your Howard Van Lines assistant. 🚗 How can I help you ship your vehicle today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response = BOT_RESPONSES.default;

      for (const [key, value] of Object.entries(BOT_RESPONSES)) {
        if (key !== "default" && lowerText.includes(key)) {
          response = value;
          break;
        }
      }

      const botMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "bot",
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "hvl-hank-button",
          isOpen && "hidden"
        )}
        aria-label="Chat with Hank"
      >
        <div className="hvl-hank-icon">
          <Truck className="w-5 h-5" />
          <Sparkles className="hvl-hank-sparkle" />
        </div>
        <div className="hvl-hank-text">
          <span className="hvl-hank-title">Chat with Hank</span>
          <span className="hvl-hank-subtitle">Get instant answers</span>
        </div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="hvl-hank-modal">
          {/* Header */}
          <div className="hvl-hank-header">
            <div className="hvl-hank-header-left">
              <div className="hvl-hank-avatar">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="hvl-hank-name">Hank</span>
                <span className="hvl-hank-status">
                  <span className="hvl-hank-status-dot" />
                  Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hvl-hank-close">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="hvl-hank-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "hvl-hank-message",
                  msg.sender === "user" ? "is-user" : "is-bot"
                )}
              >
                {msg.content}
              </div>
            ))}
            {isTyping && (
              <div className="hvl-hank-message is-bot">
                <span className="hvl-hank-typing">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}

            {/* Quick Replies */}
            {messages.length === 1 && !isTyping && (
              <div className="hvl-hank-quick-replies">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="hvl-hank-quick-btn"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="hvl-hank-input-area">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
              placeholder="Ask Hank anything..."
              className="hvl-hank-input"
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim()}
              className="hvl-hank-send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
