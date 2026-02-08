import { useState } from "react";
import { X, Send, Truck, Mic, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "bot" | "user";
  content: string;
}

const QUICK_REPLIES = [
  "How much does it cost?",
  "How long does shipping take?",
  "Is my car insured?",
  "Open vs enclosed?"
];

export default function HankChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      content: "Looking to ship your vehicle and have questions? That's exactly what I'm here for. What would you like to know?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const addMessage = (content: string, sender: "bot" | "user") => {
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      sender,
      content
    }]);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    addMessage(text, "user");
    setInputValue("");

    // Demo responses
    setTimeout(() => {
      let response = "Great question! For the best answer, go ahead and fill out the quote form above — it only takes 60 seconds. Or call us at 1-800-555-MOVE!";
      
      if (text.toLowerCase().includes("cost") || text.toLowerCase().includes("price") || text.toLowerCase().includes("much")) {
        response = "Auto transport typically runs $500–$1,500 depending on distance, vehicle type, and whether you choose open or enclosed shipping. Fill out the quick form above for an instant personalized quote!";
      } else if (text.toLowerCase().includes("long") || text.toLowerCase().includes("time") || text.toLowerCase().includes("days")) {
        response = "Most cross-country shipments take 7–14 days, while regional moves are usually 3–7 days. We'll give you a guaranteed pickup window when you book!";
      } else if (text.toLowerCase().includes("insur")) {
        response = "Yes! Every vehicle is fully insured during transport. We carry $1M in cargo insurance, and you'll receive proof of coverage before pickup.";
      } else if (text.toLowerCase().includes("open") || text.toLowerCase().includes("enclosed")) {
        response = "Open carriers are more affordable and work great for most vehicles. Enclosed carriers offer premium protection for luxury, classic, or high-value cars. Which sounds right for you?";
      }

      addMessage(response, "bot");
    }, 800);
  };

  return (
    <>
      {/* Compact Pill Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "hvl-hank-pill",
          isOpen && "hidden"
        )}
        aria-label="Chat with Hank"
      >
        {isExpanded ? (
          <>
            <div className="hvl-hank-pill-icon">
              <Mic className="w-5 h-5" />
            </div>
            <div className="hvl-hank-pill-text">
              <span className="hvl-hank-pill-title">Questions?</span>
              <span className="hvl-hank-pill-subtitle">Ask Hank</span>
            </div>
            <button 
              className="hvl-hank-pill-collapse"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div 
            className="hvl-hank-pill-icon hvl-hank-pill-icon-only"
            onClick={() => setIsExpanded(true)}
          >
            <Mic className="w-5 h-5" />
          </div>
        )}
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
                  Auto Transport Expert
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
            
            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="hvl-hank-quick-replies">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
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
              placeholder="Type your question..."
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
