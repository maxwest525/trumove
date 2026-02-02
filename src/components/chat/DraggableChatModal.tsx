import { useState, useRef, useCallback, useEffect } from "react";
import { X, Minimize2, Maximize2, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "tm_popout_chat_modal";

interface StoredModalState {
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const getStoredState = (): StoredModalState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Failed to load modal state from localStorage");
  }
  return null;
};

const saveState = (position: { x: number; y: number }, size: { width: number; height: number }) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ position, size }));
  } catch (e) {
    console.warn("Failed to save modal state to localStorage");
  }
};

interface DraggableChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isPopout?: boolean; // When true, hides maximize/resize controls
}

export default function DraggableChatModal({ 
  isOpen, 
  onClose, 
  title,
  children,
  isPopout = false
}: DraggableChatModalProps) {
  const [position, setPosition] = useState(() => {
    const stored = getStoredState();
    return stored?.position ?? { x: 100, y: 100 };
  });
  const [size, setSize] = useState(() => {
    const stored = getStoredState();
    return stored?.size ?? { width: 280, height: 360 };
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const prevSize = useRef({ width: 280, height: 360, x: 100, y: 100 });

  // Initialize position on first open - use stored or center
  useEffect(() => {
    if (isOpen && !hasInitialized && !isMaximized) {
      const stored = getStoredState();
      if (stored) {
        // Validate stored position is still within viewport
        const maxX = window.innerWidth - stored.size.width;
        const maxY = window.innerHeight - 50;
        setPosition({
          x: Math.max(0, Math.min(maxX, stored.position.x)),
          y: Math.max(0, Math.min(maxY, stored.position.y))
        });
        setSize(stored.size);
      } else {
        // Center if no stored state
        const centerX = (window.innerWidth - size.width) / 2;
        const centerY = (window.innerHeight - size.height) / 2;
        setPosition({ x: Math.max(20, centerX), y: Math.max(20, centerY) });
      }
      setHasInitialized(true);
    }
  }, [isOpen, hasInitialized, isMaximized, size.width, size.height]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  }, [position, isMaximized]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    };
  }, [size, isMaximized]);

  useEffect(() => {
    let currentPosition = position;
    let currentSize = size;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragOffset.current.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 50, e.clientY - dragOffset.current.y));
        currentPosition = { x: newX, y: newY };
        setPosition(currentPosition);
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        const newWidth = Math.max(220, Math.min(600, resizeStart.current.width + deltaX));
        const newHeight = Math.max(280, Math.min(600, resizeStart.current.height + deltaY));
        currentSize = { width: newWidth, height: newHeight };
        setSize(currentSize);
      }
    };

    const handleMouseUp = () => {
      // Save to localStorage when drag/resize ends
      if (isDragging || isResizing) {
        saveState(currentPosition, currentSize);
      }
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, size.width]);

  const handleMaximize = () => {
    if (isPopout) return; // Disable maximize for popout modals
    
    if (isMaximized) {
      setPosition({ x: prevSize.current.x, y: prevSize.current.y });
      setSize({ width: prevSize.current.width, height: prevSize.current.height });
    } else {
      prevSize.current = { ...size, x: position.x, y: position.y };
      // 25% smaller - use 75% of available space
      const maxWidth = (window.innerWidth - 40) * 0.75;
      const maxHeight = (window.innerHeight - 40) * 0.75;
      setPosition({ 
        x: (window.innerWidth - maxWidth) / 2, 
        y: (window.innerHeight - maxHeight) / 2 
      });
      setSize({ width: maxWidth, height: maxHeight });
    }
    setIsMaximized(!isMaximized);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Draggable Modal - No backdrop for non-blocking interaction */}
      <div
        ref={modalRef}
        className={cn(
          "fixed z-[70] bg-background border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden",
          isDragging && "cursor-grabbing",
          isResizing && "cursor-se-resize"
        )}
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
        }}
      >
        {/* Header - Draggable */}
        <div 
          className={cn(
            "flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b border-border shrink-0",
            !isMaximized && "cursor-grab"
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <GripHorizontal className="w-4 h-4 text-muted-foreground/50" />
            <span className="font-semibold text-sm text-foreground">{title}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Only show maximize button if not a popout modal */}
            {!isPopout && (
              <button
                onClick={handleMaximize}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                title={isMaximized ? "Restore" : "Maximize"}
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
        
        {/* Resize Handle - Hidden for popout modals */}
        {!isMaximized && !isPopout && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={handleResizeMouseDown}
          >
            <svg
              className="w-4 h-4 text-muted-foreground/30"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M14 14H10V12H12V10H14V14Z" />
              <path d="M14 8H12V6H14V8Z" />
              <path d="M8 14H6V12H8V14Z" />
            </svg>
          </div>
        )}
      </div>
    </>
  );
}
