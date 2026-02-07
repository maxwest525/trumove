import { useState, useCallback, useRef, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { X, Send, Truck, Sparkles, Mic, MicOff, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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

export default function HankChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      content: "Howdy! I'm Hank, your Howard Van Lines AI assistant. 🚗 How can I help you ship your vehicle today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [aiMode, setAiMode] = useState<"text" | "voice">("text");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ElevenLabs conversation hook
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to Hank AI");
    },
    onDisconnect: () => {
      console.log("Disconnected from Hank AI");
    },
    onMessage: (message: any) => {
      // Handle incoming messages - check for agent_response
      if (message?.agent_response_event?.agent_response) {
        addBotMessage(message.agent_response_event.agent_response);
      } else if (message?.user_transcription_event?.user_transcript) {
        addUserMessage(message.user_transcription_event.user_transcript);
      }
    },
    onError: (error) => {
      console.error("Hank AI error:", error);
      addBotMessage("Sorry, I'm having trouble connecting. Please try again or use the form above for your quote.");
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      sender: "bot",
      content,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      sender: "user",
      content,
      timestamp: new Date()
    }]);
  };

  // Start voice conversation
  const startVoiceConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const { data, error } = await supabase.functions.invoke("elevenlabs-conversation-token");

      if (error || !data?.signed_url) {
        throw new Error("Failed to get conversation token");
      }

      await conversation.startSession({
        signedUrl: data.signed_url,
      });

      setAiMode("voice");
      addBotMessage("I'm listening! Go ahead and speak your question.");
    } catch (error) {
      console.error("Failed to start voice conversation:", error);
      addBotMessage("I couldn't access your microphone. Please check permissions or type your question instead.");
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

  // Stop voice conversation
  const stopVoiceConversation = useCallback(async () => {
    await conversation.endSession();
    setAiMode("text");
  }, [conversation]);

  // Send text message via AI
  const handleSendAI = async (text: string) => {
    if (!text.trim()) return;
    addUserMessage(text);
    setInputValue("");

    // If not connected, connect first then send
    if (conversation.status !== "connected") {
      try {
        const { data, error } = await supabase.functions.invoke("elevenlabs-conversation-token");
        
        if (error || !data?.signed_url) {
          throw new Error("Failed to get token");
        }

        await conversation.startSession({
          signedUrl: data.signed_url,
        });

        // Small delay then send message
        setTimeout(() => {
          conversation.sendUserMessage(text);
        }, 500);
      } catch (error) {
        console.error("Failed to connect:", error);
        // Fallback to simple response
        addBotMessage("I'm having trouble connecting to my AI brain right now. Please fill out the quote form above or call us at 1-800-555-MOVE!");
      }
    } else {
      conversation.sendUserMessage(text);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendAI(reply);
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
          <span className="hvl-hank-subtitle">AI-powered answers</span>
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
                <span className="hvl-hank-name">Hank AI</span>
                <span className="hvl-hank-status">
                  <span className="hvl-hank-status-dot" />
                  {conversation.status === "connected" ? "AI Connected" : "Online"}
                </span>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsOpen(false);
                if (conversation.status === "connected") {
                  conversation.endSession();
                }
              }} 
              className="hvl-hank-close"
            >
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
            
            {/* Speaking indicator */}
            {conversation.isSpeaking && (
              <div className="hvl-hank-message is-bot">
                <span className="hvl-hank-speaking">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>Hank is speaking...</span>
                </span>
              </div>
            )}

            {/* Quick Replies */}
            {messages.length === 1 && conversation.status !== "connected" && (
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
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="hvl-hank-input-area">
            {/* Voice toggle button */}
            <button
              onClick={conversation.status === "connected" && aiMode === "voice" 
                ? stopVoiceConversation 
                : startVoiceConversation
              }
              disabled={isConnecting}
              className={cn(
                "hvl-hank-voice-btn",
                conversation.status === "connected" && aiMode === "voice" && "is-active"
              )}
              title={conversation.status === "connected" ? "Stop voice" : "Start voice chat"}
            >
              {isConnecting ? (
                <div className="hvl-hank-voice-loading" />
              ) : conversation.status === "connected" && aiMode === "voice" ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendAI(inputValue)}
              placeholder="Ask Hank anything..."
              className="hvl-hank-input"
            />
            <button
              onClick={() => handleSendAI(inputValue)}
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
