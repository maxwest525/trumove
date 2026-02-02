import { useState, useRef, useCallback, useEffect } from "react";
import { X, Minimize2, Maximize2, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface DraggableChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function DraggableChatModal({ 
  isOpen, 
  onClose, 
  title,
  children 
}: DraggableChatModalProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 380, height: 500 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const prevSize = useRef({ width: 380, height: 500, x: 100, y: 100 });

  // Center on open
  useEffect(() => {
    if (isOpen && !isMaximized) {
      const centerX = (window.innerWidth - size.width) / 2;
      const centerY = (window.innerHeight - size.height) / 2;
      setPosition({ x: Math.max(20, centerX), y: Math.max(20, centerY) });
    }
  }, [isOpen]);

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
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragOffset.current.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 50, e.clientY - dragOffset.current.y));
        setPosition({ x: newX, y: newY });
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        const newWidth = Math.max(300, Math.min(800, resizeStart.current.width + deltaX));
        const newHeight = Math.max(400, Math.min(800, resizeStart.current.height + deltaY));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
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
    if (isMaximized) {
      setPosition({ x: prevSize.current.x, y: prevSize.current.y });
      setSize({ width: prevSize.current.width, height: prevSize.current.height });
    } else {
      prevSize.current = { ...size, x: position.x, y: position.y };
      setPosition({ x: 20, y: 20 });
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 });
    }
    setIsMaximized(!isMaximized);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - click to close */}
      <div 
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Draggable Modal */}
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
        
        {/* Resize Handle */}
        {!isMaximized && (
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
