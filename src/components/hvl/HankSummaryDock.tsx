import { useState, useRef, useCallback, useEffect } from "react";
import { Car, GripHorizontal, X, MapPin, Calendar, Truck, ArrowRight, Hand, ChevronRight, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface HankSummaryDockProps {
  year: string;
  make: string;
  model: string;
  transportType: "open" | "enclosed" | "";
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate?: Date;
}

// Vehicle image mapping
const VEHICLE_IMAGES: Record<string, string> = {
  Toyota: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format",
  Honda: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop&auto=format",
  Nissan: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=250&fit=crop&auto=format",
  Mazda: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=400&h=250&fit=crop&auto=format",
  Subaru: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=400&h=250&fit=crop&auto=format",
  Lexus: "https://images.unsplash.com/photo-1622194993627-c3de0bcee890?w=400&h=250&fit=crop&auto=format",
  Ford: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=400&h=250&fit=crop&auto=format",
  Chevrolet: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop&auto=format",
  Dodge: "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=400&h=250&fit=crop&auto=format",
  Jeep: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop&auto=format",
  Tesla: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop&auto=format",
  BMW: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop&auto=format",
  "Mercedes-Benz": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop&auto=format",
  Audi: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop&auto=format",
  Porsche: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop&auto=format",
  Hyundai: "https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=400&h=250&fit=crop&auto=format",
  Kia: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=400&h=250&fit=crop&auto=format",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=250&fit=crop&auto=format";

function getVehicleImageUrl(make: string): string {
  return VEHICLE_IMAGES[make] || DEFAULT_IMAGE;
}

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

// Storage key for draggable position
const STORAGE_KEY = "hvl_summary_dock_pos_v1";

export function HankSummaryDock({
  year,
  make,
  model,
  transportType,
  pickupLocation,
  dropoffLocation,
  pickupDate
}: HankSummaryDockProps) {
  // Hank chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      content: "Want to book your auto transport but have questions? That's what I'm here for. What do you have questions about?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  // Transport Summary state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  
  // Position state - only used when dragged
  const [position, setPosition] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.hasBeenDragged) {
          return parsed;
        }
      }
    } catch {}
    return { x: 0, y: 0, hasBeenDragged: false };
  });
  const dragOffset = useRef({ x: 0, y: 0 });

  const imageUrl = getVehicleImageUrl(make);

  // Show summary when vehicle is selected
  useEffect(() => {
    if (year && make && model) {
      setShowSummary(false);
      setImageLoaded(false);
      const timer = setTimeout(() => setShowSummary(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowSummary(false);
    }
  }, [year, make, model]);

  // Save position to localStorage when dragged
  useEffect(() => {
    if (!isDragging && hasBeenDragged) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...position, hasBeenDragged: true }));
      } catch {}
    }
  }, [position, isDragging, hasBeenDragged]);

  // Hank message handling
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

  // Drag handling for summary
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    // Get current element position
    const element = e.currentTarget.closest('.hvl-summary-dock-summary') as HTMLElement;
    if (element) {
      const rect = element.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setHasBeenDragged(true);
        const newX = Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragOffset.current.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.current.y));
        setPosition({ x: newX, y: newY, hasBeenDragged: true });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const hasRouteInfo = pickupLocation || dropoffLocation || pickupDate;
  const showConnector = showSummary && !isChatOpen && !isDragging && !hasBeenDragged;

  return (
    <>
      {/* Main Dock - Fixed position 70px from form */}
      <div className="hvl-summary-dock">
        {/* Hank Pill - Always at top of dock */}
        <button
          onClick={() => setIsChatOpen(true)}
          className={cn(
            "hvl-dock-hank-pill",
            isChatOpen && "hidden"
          )}
          aria-label="Chat with Hank"
        >
          <div className="hvl-dock-hank-arrow">
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="hvl-dock-hank-icon">
            <Hand className="w-5 h-5" />
          </div>
        </button>

        {/* Connector Line - visible when both Hank pill and Summary are shown */}
        <div className={cn("hvl-dock-connector", !showConnector && "is-hidden")} />

        {/* Transport Summary - Below Hank in dock, or freely positioned if dragged */}
        {showSummary && (
          <div 
            className={cn(
              "hvl-summary-dock-summary",
              isDragging && "is-dragging",
              hasBeenDragged && "is-detached"
            )}
            style={hasBeenDragged ? { position: 'fixed', left: position.x, top: position.y } : undefined}
          >
            {/* Header - Draggable */}
            <div 
              className="hvl-vehicle-modal-header"
              onMouseDown={handleMouseDown}
            >
              <div className="hvl-vehicle-modal-grip">
                <GripHorizontal className="w-3.5 h-3.5" />
                <span>Transport Summary</span>
              </div>
              <div className="hvl-vehicle-modal-actions">
                <button 
                  className="hvl-vehicle-modal-btn hvl-vehicle-modal-close"
                  onClick={() => setShowSummary(false)}
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Vehicle Image */}
            <div className="hvl-vehicle-modal-image-wrap">
              {!imageLoaded && (
                <div className="hvl-vehicle-modal-placeholder">
                  <Car className="w-10 h-10 animate-pulse" />
                </div>
              )}
              <img
                src={imageUrl}
                alt={`${year} ${make} ${model}`}
                className={cn("hvl-vehicle-modal-image", imageLoaded && "loaded")}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="hvl-vehicle-modal-shine" />
              
              {/* Vehicle Title Overlay */}
              <div className="hvl-summary-vehicle-overlay">
                <h4>{year} {make} {model}</h4>
                {transportType && (
                  <span className="hvl-summary-transport-badge">
                    <Truck className="w-3 h-3" />
                    {transportType === "open" ? "Open Carrier" : "Enclosed Carrier"}
                  </span>
                )}
              </div>
            </div>

            {/* Summary Details */}
            <div className="hvl-summary-details">
              {/* Route */}
              {(pickupLocation || dropoffLocation) && (
                <div className="hvl-summary-route">
                  <div className="hvl-summary-route-row">
                    <div className="hvl-summary-location">
                      <div className="hvl-summary-location-dot hvl-summary-dot-from" />
                      <div className="hvl-summary-location-text">
                        <span className="hvl-summary-label">From</span>
                        <span className="hvl-summary-value">{pickupLocation || "—"}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="hvl-summary-location">
                      <div className="hvl-summary-location-dot hvl-summary-dot-to" />
                      <div className="hvl-summary-location-text">
                        <span className="hvl-summary-label">To</span>
                        <span className="hvl-summary-value">{dropoffLocation || "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Date */}
              {pickupDate && (
                <div className="hvl-summary-date">
                  <Calendar className="w-4 h-4" />
                  <div className="hvl-summary-date-text">
                    <span className="hvl-summary-label">Pickup Date</span>
                    <span className="hvl-summary-value">{format(pickupDate, "MMM d, yyyy")}</span>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!hasRouteInfo && (
                <div className="hvl-summary-empty">
                  <MapPin className="w-4 h-4" />
                  <span>Add route details to see full summary</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hank Chat Modal - Positioned separately when open */}
      {isChatOpen && (
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
            <button onClick={() => setIsChatOpen(false)} className="hvl-hank-close">
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

export default HankSummaryDock;
