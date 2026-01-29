import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useConversation } from "@elevenlabs/react";
import ReactMarkdown from "react-markdown";
import { Phone, Video, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatContainerProps {
  agentId?: string;
  onSwitchToQuickQuote?: () => void;
}

export default function AIChatContainer({ agentId, onSwitchToQuickQuote }: AIChatContainerProps) {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const hasConnected = useRef(false);

  // ElevenLabs Conversational AI hook
  const conversation = useConversation({
    textOnly: true,
    onConnect: () => {
      console.log("Connected to ElevenLabs agent");
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
      // Add welcome message
      addAssistantMessage("Hi! I'm your TruMove AI assistant. I can help you with moving quotes, answer questions about our services, or connect you with a specialist. What can I help you with today?");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs agent");
      setIsConnected(false);
    },
    onMessage: (message: unknown) => {
      console.log("Message received:", message);
      
      // Type guard for message object
      const msg = message as { type?: string; agent_response_event?: { agent_response?: string }; agent_response_correction_event?: { corrected_agent_response?: string } };
      
      // Handle agent responses
      if (msg.type === "agent_response") {
        setIsThinking(false);
        const agentText = msg.agent_response_event?.agent_response;
        if (agentText) {
          addAssistantMessage(agentText);
        }
      }
      
      // Handle corrected responses (when user interrupts)
      if (msg.type === "agent_response_correction") {
        const correctedText = msg.agent_response_correction_event?.corrected_agent_response;
        if (correctedText) {
          // Update the last assistant message with corrected content
          setMessages(prev => {
            const updated = [...prev];
            for (let i = updated.length - 1; i >= 0; i--) {
              if (updated[i].role === "assistant") {
                updated[i] = { ...updated[i], content: correctedText };
                break;
              }
            }
            return updated;
          });
        }
      }
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      setIsConnecting(false);
      setError("Connection error. Please try again.");
      setIsThinking(false);
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    const container = messagesEndRef.current?.closest('.chat-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isThinking]);

  // Connect to ElevenLabs on mount
  useEffect(() => {
    if (!hasConnected.current) {
      hasConnected.current = true;
      connectToAgent();
    }
  }, []);

  const connectToAgent = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Fetch conversation token from edge function
      const { data, error: fetchError } = await supabase.functions.invoke(
        "elevenlabs-conversation-token",
        { body: agentId ? { agentId } : {} }
      );

      if (fetchError) {
        console.error("Token fetch error:", fetchError);
        throw new Error(fetchError.message || "Failed to get conversation token");
      }

      if (!data?.token) {
        throw new Error("No token received from server");
      }

      // Start the conversation session
      await conversation.startSession({
        conversationToken: data.token,
      });
    } catch (err) {
      console.error("Connection error:", err);
      setIsConnecting(false);
      setError(err instanceof Error ? err.message : "Failed to connect");
    }
  };

  const addAssistantMessage = useCallback((content: string) => {
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}-${Math.random()}`,
      role: "assistant",
      content,
      timestamp: new Date(),
    }]);
  }, []);

  const handleSend = useCallback((text: string) => {
    if (!isConnected || !text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}-${Math.random()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    }]);

    // Show thinking indicator
    setIsThinking(true);

    // Send to ElevenLabs
    conversation.sendUserMessage(text);
  }, [isConnected, conversation]);

  const handleQuickAction = (action: string) => {
    if (action === "quote") {
      onSwitchToQuickQuote?.();
    } else if (action === "video") {
      navigate("/book");
    } else if (action === "call") {
      window.location.href = "tel:+18001234567";
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar-small bg-primary/10">
            <svg viewBox="0 0 24 24" fill="none" className="chat-avatar-icon text-primary">
              <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="chat-header-info">
            <span className="chat-header-name">TruMove AI</span>
            <span className="chat-header-status">
              <span className={cn("chat-status-dot", isConnected && "bg-green-500")}></span>
              {isConnecting ? "Connecting..." : isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {/* Connection State */}
        {isConnecting && messages.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Connecting to AI assistant...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <p className="text-destructive text-sm">{error}</p>
            <button
              onClick={connectToAgent}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("chat-message", msg.role === "assistant" ? "is-bot" : "is-user")}
          >
            {msg.role === "assistant" && (
              <div className="chat-avatar">
                <svg viewBox="0 0 24 24" fill="none" className="chat-avatar-icon">
                  <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            <div className="chat-bubble">
              <div className="chat-bubble-text prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {/* Thinking Indicator */}
        {isThinking && <TypingIndicator />}

        {/* Quick Actions - shown after initial connection */}
        {isConnected && messages.length === 1 && !isThinking && (
          <div className="flex flex-wrap gap-2 px-4 py-3">
            <button
              onClick={() => handleQuickAction("quote")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Zap className="w-3 h-3" />
              Quick Quote
            </button>
            <button
              onClick={() => handleQuickAction("video")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground hover:bg-accent transition-colors"
            >
              <Video className="w-3 h-3" />
              Video Consult
            </button>
            <button
              onClick={() => handleQuickAction("call")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground hover:bg-accent transition-colors"
            >
              <Phone className="w-3 h-3" />
              Call Us
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        placeholder={isConnected ? "Ask me anything about your move..." : "Connecting..."}
        onSend={handleSend}
        disabled={!isConnected || isThinking}
      />

      {/* Footer */}
      <div className="chat-footer">
        <span>Need a structured quote?</span>
        <button type="button" className="chat-form-link" onClick={onSwitchToQuickQuote}>
          Use Quick Quote →
        </button>
      </div>
    </div>
  );
}
