import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useConversation } from "@elevenlabs/react";
import ReactMarkdown from "react-markdown";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { PageContext, QuickAction } from "./pageContextConfig";
import { cn } from "@/lib/utils";
import trudyAvatar from "@/assets/trudy-avatar.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatContainerProps {
  agentId?: string;
  onSwitchToQuickQuote?: () => void;
  pageContext?: PageContext;
}

// Default context fallback
const defaultContext: PageContext = {
  key: 'general',
  firstMessage: "Hi! I'm your TruMove AI assistant. I can help you with moving quotes, answer questions about our services, or connect you with a specialist. What can I help you with today?",
  quickActions: [],
  agentContext: "General moving assistance.",
};

export default function AIChatContainer({ agentId, onSwitchToQuickQuote, pageContext = defaultContext }: AIChatContainerProps) {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const hasConnected = useRef(false);
  const pageContextRef = useRef(pageContext);

  // Store pageContext in ref to use in callbacks
  useEffect(() => {
    pageContextRef.current = pageContext;
  }, [pageContext]);

  // ElevenLabs Conversational AI hook
  const conversation = useConversation({
    textOnly: true,
    onConnect: () => {
      console.log("Connected to ElevenLabs agent");
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
      // Add page-specific welcome message
      addAssistantMessage(pageContextRef.current.firstMessage);
      // Send contextual update to agent about which page user is on
      if (pageContextRef.current.agentContext) {
        conversation.sendContextualUpdate?.(pageContextRef.current.agentContext);
      }
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs agent");
      setIsConnected(false);
    },
    onMessage: (message: unknown) => {
      console.log("Message received:", message);
      
      // Type guard for message object - supports both text-only and WebRTC formats
      const msg = message as { 
        type?: string; 
        source?: string;
        role?: string;
        message?: string;
        agent_response_event?: { agent_response?: string }; 
        agent_response_correction_event?: { corrected_agent_response?: string } 
      };
      
      // Handle text-only agent messages (simpler format)
      if (msg.source === "ai" && msg.role === "agent" && msg.message) {
        setIsThinking(false);
        addAssistantMessage(msg.message);
        return;
      }
      
      // Handle WebRTC agent responses (original format)
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

      if (!data?.signed_url) {
        throw new Error("No signed URL received from server");
      }

      // Start the conversation session with WebSocket (for text-only agents)
      await conversation.startSession({
        signedUrl: data.signed_url,
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

  const handleQuickAction = useCallback((quickAction: QuickAction) => {
    switch (quickAction.action) {
      case 'quote':
        onSwitchToQuickQuote?.();
        break;
      case 'navigate':
        if (quickAction.target) {
          navigate(quickAction.target);
        }
        break;
      case 'call':
        window.location.href = "tel:+18001234567";
        break;
      case 'message':
        if (quickAction.message) {
          handleSend(quickAction.message);
        }
        break;
    }
  }, [navigate, onSwitchToQuickQuote, handleSend]);

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar-small bg-primary/10">
            <img src={trudyAvatar} alt="Trudy" className="w-6 h-6 rounded-full object-cover" />
          </div>
          <div className="chat-header-info">
            <span className="chat-header-name">Trudy with TruMove</span>
            <span className="chat-header-status">
              <span className={cn("chat-status-dot", isConnected && "bg-primary")}></span>
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
                <img src={trudyAvatar} alt="Trudy" className="w-8 h-8 rounded-full object-cover" />
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
        {isConnected && messages.length === 1 && !isThinking && pageContext.quickActions.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 py-3">
            {pageContext.quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                    index === 0 
                      ? "bg-primary/10 text-primary hover:bg-primary/20" 
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {action.label}
                </button>
              );
            })}
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

    </div>
  );
}
