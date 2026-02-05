 import { useState, useRef, useCallback, useEffect } from "react";
import { X, GripHorizontal, Maximize2, Minimize2 } from "lucide-react";
 import { cn } from "@/lib/utils";
 
type SnapZone = 'center' | 'left' | 'right' | 'top' | 'bottom' | null;

const SNAP_THRESHOLD = 40;
const SNAP_MARGIN = 20;

 interface StoredModalState {
   position: { x: number; y: number };
   size: { width: number; height: number };
 }
 
 const getStoredState = (storageKey: string): StoredModalState | null => {
   try {
     const stored = localStorage.getItem(storageKey);
     if (stored) {
       return JSON.parse(stored);
     }
   } catch (e) {
     console.warn("Failed to load modal state from localStorage");
   }
   return null;
 };
 
const saveState = (
  storageKey: string, 
  position: { x: number; y: number }, 
  size: { width: number; height: number }
) => {
   try {
     localStorage.setItem(storageKey, JSON.stringify({ position, size }));
   } catch (e) {
     console.warn("Failed to save modal state to localStorage");
   }
 };
 
 interface DraggableModalProps {
   isOpen: boolean;
   onClose: () => void;
   title: React.ReactNode;
   children: React.ReactNode;
   storageKey: string;
   defaultWidth?: number;
   defaultHeight?: number;
   minWidth?: number;
   minHeight?: number;
   maxWidth?: number;
   maxHeight?: number;
   headerClassName?: string;
   headerStyle?: React.CSSProperties;
   footer?: React.ReactNode;
  showMaximize?: boolean;
 }
 
 export default function DraggableModal({ 
   isOpen, 
   onClose, 
   title,
   children,
   storageKey,
   defaultWidth = 800,
   defaultHeight = 600,
   minWidth = 400,
   minHeight = 300,
   maxWidth = 1200,
   maxHeight = 900,
   headerClassName,
   headerStyle,
  footer,
  showMaximize = true
 }: DraggableModalProps) {
   const [position, setPosition] = useState(() => {
     const stored = getStoredState(storageKey);
     return stored?.position ?? { x: 100, y: 60 };
   });
   const [size, setSize] = useState(() => {
     const stored = getStoredState(storageKey);
     return stored?.size ?? { width: defaultWidth, height: defaultHeight };
   });
  const [isMaximized, setIsMaximized] = useState(false);
  const [snapZone, setSnapZone] = useState<SnapZone>(null);
   const [isDragging, setIsDragging] = useState(false);
   const [isResizing, setIsResizing] = useState(false);
   const [hasInitialized, setHasInitialized] = useState(false);
   const dragOffset = useRef({ x: 0, y: 0 });
   const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const preMaximizeState = useRef({ position: { x: 0, y: 0 }, size: { width: 0, height: 0 } });
   const modalRef = useRef<HTMLDivElement>(null);
 
   // Initialize position on first open - use stored or center
   useEffect(() => {
     if (isOpen && !hasInitialized) {
       const stored = getStoredState(storageKey);
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
   }, [isOpen, hasInitialized, storageKey, size.width, size.height]);
 
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

  const handleMaximize = useCallback(() => {
    if (isMaximized) {
      // Restore
      setPosition(preMaximizeState.current.position);
      setSize(preMaximizeState.current.size);
    } else {
      // Save current state and maximize
      preMaximizeState.current = { position, size };
      setPosition({ x: SNAP_MARGIN, y: SNAP_MARGIN });
      setSize({ 
        width: window.innerWidth - SNAP_MARGIN * 2, 
        height: window.innerHeight - SNAP_MARGIN * 2 
      });
    }
    setIsMaximized(!isMaximized);
  }, [isMaximized, position, size]);

   const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return; // Disable drag when maximized
     e.preventDefault();
     setIsDragging(true);
     dragOffset.current = {
       x: e.clientX - position.x,
       y: e.clientY - position.y
     };
  }, [position, isMaximized]);
 
   const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return; // Disable resize when maximized
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
         const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.current.width + deltaX));
         const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.current.height + deltaY));
         currentSize = { width: newWidth, height: newHeight };
         setSize(currentSize);
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
        saveState(storageKey, currentPosition, size);
        setSnapZone(null);
      }
      if (isResizing) {
        saveState(storageKey, currentPosition, currentSize);
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
  }, [isDragging, isResizing, size.width, size.height, minWidth, maxWidth, minHeight, maxHeight, storageKey, getSnappedPosition, size]);
 
   if (!isOpen) return null;
 
   return (
     <>
      {/* Snap guide lines */}
      {isDragging && snapZone && (
        <>
          {snapZone === 'center' && (
            <div className="fixed inset-0 pointer-events-none z-[105]">
              {/* Vertical center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-purple-500/60 -translate-x-1/2" />
              {/* Horizontal center line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-purple-500/60 -translate-y-1/2" />
              {/* Center crosshair glow */}
              <div className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/30 border border-purple-500/60" />
            </div>
          )}
          {snapZone === 'left' && (
            <div className="fixed top-0 bottom-0 w-1 bg-blue-500/60 z-[105] transition-all" style={{ left: SNAP_MARGIN }} />
          )}
          {snapZone === 'right' && (
            <div className="fixed top-0 bottom-0 w-1 bg-blue-500/60 z-[105] transition-all" style={{ right: SNAP_MARGIN }} />
          )}
          {snapZone === 'top' && (
            <div className="fixed left-0 right-0 h-1 bg-blue-500/60 z-[105] transition-all" style={{ top: SNAP_MARGIN }} />
          )}
          {snapZone === 'bottom' && (
            <div className="fixed left-0 right-0 h-1 bg-blue-500/60 z-[105] transition-all" style={{ bottom: SNAP_MARGIN }} />
          )}
        </>
      )}

       {/* Semi-transparent backdrop */}
       <div 
          className="fixed inset-0 bg-black/30 z-[100]"
         onClick={onClose}
       />
       
       {/* Draggable Modal */}
       <div
         ref={modalRef}
         className={cn(
            "fixed z-[110] bg-background border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden",
          isDragging && "cursor-grabbing select-none",
          isResizing && "cursor-se-resize select-none",
          snapZone && "transition-none"
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
            "flex items-center justify-between px-4 py-3 shrink-0",
            !isMaximized && "cursor-grab",
            isMaximized && "cursor-default",
             headerClassName
           )}
           style={headerStyle}
           onMouseDown={handleMouseDown}
         >
           <div className="flex items-center gap-2 flex-1">
             <GripHorizontal className="w-4 h-4 text-white/50 flex-shrink-0" />
             {title}
           </div>
           
          <div className="flex items-center gap-1 flex-shrink-0">
            {showMaximize && (
              <button
                onClick={handleMaximize}
                className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
                title={isMaximized ? "Restore" : "Maximize"}
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4 text-white" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-white" />
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
         </div>
         
         {/* Content */}
         <div className="flex-1 overflow-hidden flex flex-col">
           {children}
         </div>
         
         {/* Footer */}
         {footer && (
           <div className="shrink-0">
             {footer}
           </div>
         )}
         
         {/* Resize Handle */}
        {!isMaximized && (
          <div
            className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize"
            onMouseDown={handleResizeMouseDown}
           >
            <svg
              className="w-5 h-5 text-muted-foreground/40"
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