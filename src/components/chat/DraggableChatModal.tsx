import { useState, useRef, useCallback, useEffect } from "react";
import { X, Minimize2, Maximize2, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "tm_popout_chat_modal";

type SnapZone = 'center' | 'left' | 'right' | 'top' | 'bottom' | null;
type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null;

const SNAP_THRESHOLD = 40;
const SNAP_MARGIN = 20;
const RESIZE_SNAP_THRESHOLD = 30;

// Common size presets for snap-to-grid resizing
const SIZE_PRESETS = [
  { width: 320, height: 400, label: "Compact" },
  { width: 380, height: 480, label: "Standard" },
  { width: 480, height: 560, label: "Large" },
  { width: 560, height: 640, label: "XL" },
];

const findNearestPreset = (width: number, height: number) => {
  for (const preset of SIZE_PRESETS) {
    if (
      Math.abs(width - preset.width) < RESIZE_SNAP_THRESHOLD &&
      Math.abs(height - preset.height) < RESIZE_SNAP_THRESHOLD
    ) {
      return preset;
    }
  }
  return null;
};

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
    return stored?.size ?? { width: 380, height: 480 };
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const [snapZone, setSnapZone] = useState<SnapZone>(null);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null);
  const [sizePresetHint, setSizePresetHint] = useState<typeof SIZE_PRESETS[0] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const prevSize = useRef({ width: 280, height: 360, x: 100, y: 100 });
  
  const minWidth = 220;
  const maxWidth = 600;
  const minHeight = 280;
  const maxHeight = 700;

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

  const getSnappedPosition = useCallback((zone: SnapZone, currentSize: { width: number; height: number }) => {
    switch (zone) {
      case 'center':
        return {
          x: (window.innerWidth - currentSize.width) / 2,
          y: (window.innerHeight - currentSize.height) / 2
        };
      case 'left':
        return { x: SNAP_MARGIN, y: position.y };
      case 'right':
        return { x: window.innerWidth - currentSize.width - SNAP_MARGIN, y: position.y };
      case 'top':
        return { x: position.x, y: SNAP_MARGIN };
      case 'bottom':
        return { x: position.x, y: window.innerHeight - currentSize.height - SNAP_MARGIN };
      default:
        return position;
    }
  }, [position]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  }, [position, isMaximized]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, direction: ResizeDirection = 'se') => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
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
    let currentSnapZone: SnapZone = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragOffset.current.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 50, e.clientY - dragOffset.current.y));
        currentPosition = { x: newX, y: newY };
        setPosition(currentPosition);

        // Detect snap zones
        const centerX = (window.innerWidth - size.width) / 2;
        const centerY = (window.innerHeight - size.height) / 2;

        let detectedSnap: SnapZone = null;

        // Center snap (both axes must be close)
        if (Math.abs(newX - centerX) < SNAP_THRESHOLD && 
            Math.abs(newY - centerY) < SNAP_THRESHOLD) {
          detectedSnap = 'center';
        }
        // Edge snaps
        else if (newX < SNAP_THRESHOLD) {
          detectedSnap = 'left';
        } else if (newX > window.innerWidth - size.width - SNAP_THRESHOLD) {
          detectedSnap = 'right';
        } else if (newY < SNAP_THRESHOLD) {
          detectedSnap = 'top';
        } else if (newY > window.innerHeight - size.height - SNAP_THRESHOLD) {
          detectedSnap = 'bottom';
        }

        currentSnapZone = detectedSnap;
        setSnapZone(detectedSnap);
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        
        let newWidth = resizeStart.current.width;
        let newHeight = resizeStart.current.height;
        let newX = position.x;
        let newY = position.y;
        
        // Handle different resize directions
        if (resizeDirection?.includes('e')) {
          newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.current.width + deltaX));
        }
        if (resizeDirection?.includes('w')) {
          const widthChange = Math.min(resizeStart.current.width - minWidth, Math.max(-(maxWidth - resizeStart.current.width), -deltaX));
          newWidth = resizeStart.current.width + widthChange;
          newX = position.x - widthChange + (resizeStart.current.width - size.width);
        }
        if (resizeDirection?.includes('s')) {
          newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.current.height + deltaY));
        }
        if (resizeDirection?.includes('n')) {
          const heightChange = Math.min(resizeStart.current.height - minHeight, Math.max(-(maxHeight - resizeStart.current.height), -deltaY));
          newHeight = resizeStart.current.height + heightChange;
          newY = position.y - heightChange + (resizeStart.current.height - size.height);
        }
        
        // Check for size preset snap
        const nearestPreset = findNearestPreset(newWidth, newHeight);
        setSizePresetHint(nearestPreset);
        
        currentSize = { width: newWidth, height: newHeight };
        setSize(currentSize);
        
        if (resizeDirection?.includes('w') || resizeDirection?.includes('n')) {
          setPosition({ x: newX, y: newY });
          currentPosition = { x: newX, y: newY };
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        // Apply snap if in zone
        if (currentSnapZone) {
          const snappedPosition = getSnappedPosition(currentSnapZone, size);
          currentPosition = snappedPosition;
          setPosition(snappedPosition);
        }
        saveState(currentPosition, size);
        setSnapZone(null);
      }
      if (isResizing) {
        // Apply size preset snap if near one
        if (sizePresetHint) {
          currentSize = { width: sizePresetHint.width, height: sizePresetHint.height };
          setSize(currentSize);
        }
        saveState(currentPosition, currentSize);
        setSizePresetHint(null);
        setResizeDirection(null);
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
  }, [isDragging, isResizing, size.width, size.height, getSnappedPosition, size, resizeDirection, position, sizePresetHint]);

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
      {/* Snap guide lines */}
      {isDragging && snapZone && (
        <>
          {snapZone === 'center' && (
            <div className="fixed inset-0 pointer-events-none z-[65]">
              {/* Vertical center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/60 -translate-x-1/2" />
              {/* Horizontal center line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/60 -translate-y-1/2" />
              {/* Center crosshair glow */}
              <div className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 border border-primary/60" />
            </div>
          )}
          {snapZone === 'left' && (
            <div className="fixed top-0 bottom-0 w-1 bg-primary/60 z-[65] transition-all" style={{ left: SNAP_MARGIN }} />
          )}
          {snapZone === 'right' && (
            <div className="fixed top-0 bottom-0 w-1 bg-primary/60 z-[65] transition-all" style={{ right: SNAP_MARGIN }} />
          )}
          {snapZone === 'top' && (
            <div className="fixed left-0 right-0 h-1 bg-primary/60 z-[65] transition-all" style={{ top: SNAP_MARGIN }} />
          )}
          {snapZone === 'bottom' && (
            <div className="fixed left-0 right-0 h-1 bg-primary/60 z-[65] transition-all" style={{ bottom: SNAP_MARGIN }} />
          )}
        </>
      )}

      {/* Size preset hint badge */}
      {isResizing && sizePresetHint && (
        <div 
          className="fixed z-[75] px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-lg animate-pulse"
          style={{
            left: position.x + size.width / 2,
            top: position.y + size.height + 8,
            transform: 'translateX(-50%)'
          }}
        >
          📐 Snap to {sizePresetHint.label} ({sizePresetHint.width}×{sizePresetHint.height})
        </div>
      )}

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
          <>
            {/* Corner resize handles */}
            {/* SE Corner */}
            <div
              className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize group/handle"
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
            >
              <div className="absolute bottom-1 right-1 w-3 h-3 opacity-40 group-hover/handle:opacity-100 transition-opacity">
                <div className="absolute bottom-0 right-0 w-2 h-0.5 bg-muted-foreground group-hover/handle:bg-primary group-hover/handle:shadow-[0_0_6px_hsl(var(--primary))]" />
                <div className="absolute bottom-0 right-0 w-0.5 h-2 bg-muted-foreground group-hover/handle:bg-primary group-hover/handle:shadow-[0_0_6px_hsl(var(--primary))]" />
              </div>
            </div>
            
            {/* SW Corner */}
            <div
              className="absolute bottom-0 left-0 w-5 h-5 cursor-sw-resize group/handle"
              onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
            >
              <div className="absolute bottom-1 left-1 w-3 h-3 opacity-40 group-hover/handle:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 w-2 h-0.5 bg-muted-foreground group-hover/handle:bg-primary group-hover/handle:shadow-[0_0_6px_hsl(var(--primary))]" />
                <div className="absolute bottom-0 left-0 w-0.5 h-2 bg-muted-foreground group-hover/handle:bg-primary group-hover/handle:shadow-[0_0_6px_hsl(var(--primary))]" />
              </div>
            </div>
            
            {/* NE Corner */}
            <div
              className="absolute top-0 right-0 w-5 h-5 cursor-ne-resize group/handle"
              onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
            >
              <div className="absolute top-1 right-1 w-3 h-3 opacity-40 group-hover/handle:opacity-100 transition-opacity">
                <div className="absolute top-0 right-0 w-2 h-0.5 bg-muted-foreground group-hover/handle:bg-primary group-hover/handle:shadow-[0_0_6px_hsl(var(--primary))]" />
                <div className="absolute top-0 right-0 w-0.5 h-2 bg-muted-foreground group-hover/handle:bg-primary group-hover/handle:shadow-[0_0_6px_hsl(var(--primary))]" />
              </div>
            </div>
            
            {/* NW Corner */}
            <div
              className="absolute top-0 left-0 w-5 h-5 cursor-nw-resize group/handle"
              onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
            >
              <div className="absolute top-1 left-1 w-3 h-3 opacity-40 group-hover/handle:opacity-100 transition-opacity">
                <div className="absolute top-0 left-0 w-2 h-0.5 bg-muted-foreground group-hover/handle:bg-primary group-hover/handle:shadow-[0_0_6px_hsl(var(--primary))]" />
                <div className="absolute top-0 left-0 w-0.5 h-2 bg-muted-foreground group-hover/handle:bg-primary group-hover/handle:shadow-[0_0_6px_hsl(var(--primary))]" />
              </div>
            </div>
            
            {/* Edge resize handles */}
            <div className="absolute top-5 bottom-5 right-0 w-1.5 cursor-e-resize hover:bg-primary/20 transition-colors" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
            <div className="absolute top-5 bottom-5 left-0 w-1.5 cursor-w-resize hover:bg-primary/20 transition-colors" onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
            <div className="absolute left-5 right-5 top-0 h-1.5 cursor-n-resize hover:bg-primary/20 transition-colors" onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
            <div className="absolute left-5 right-5 bottom-0 h-1.5 cursor-s-resize hover:bg-primary/20 transition-colors" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
          </>
        )}
      </div>
    </>
  );
}
