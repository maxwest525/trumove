 import { useState, useRef, useCallback, useEffect } from "react";
 import { X, GripHorizontal } from "lucide-react";
 import { cn } from "@/lib/utils";
 
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
 
 const saveState = (storageKey: string, position: { x: number; y: number }, size: { width: number; height: number }) => {
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
   footer
 }: DraggableModalProps) {
   const [position, setPosition] = useState(() => {
     const stored = getStoredState(storageKey);
     return stored?.position ?? { x: 100, y: 60 };
   });
   const [size, setSize] = useState(() => {
     const stored = getStoredState(storageKey);
     return stored?.size ?? { width: defaultWidth, height: defaultHeight };
   });
   const [isDragging, setIsDragging] = useState(false);
   const [isResizing, setIsResizing] = useState(false);
   const [hasInitialized, setHasInitialized] = useState(false);
   const dragOffset = useRef({ x: 0, y: 0 });
   const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
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
 
   const handleMouseDown = useCallback((e: React.MouseEvent) => {
     e.preventDefault();
     setIsDragging(true);
     dragOffset.current = {
       x: e.clientX - position.x,
       y: e.clientY - position.y
     };
   }, [position]);
 
   const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
     e.preventDefault();
     e.stopPropagation();
     setIsResizing(true);
     resizeStart.current = {
       x: e.clientX,
       y: e.clientY,
       width: size.width,
       height: size.height
     };
   }, [size]);
 
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
         const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.current.width + deltaX));
         const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.current.height + deltaY));
         currentSize = { width: newWidth, height: newHeight };
         setSize(currentSize);
       }
     };
 
     const handleMouseUp = () => {
       // Save to localStorage when drag/resize ends
       if (isDragging || isResizing) {
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
   }, [isDragging, isResizing, size.width, minWidth, maxWidth, minHeight, maxHeight, storageKey]);
 
   if (!isOpen) return null;
 
   return (
     <>
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
             "flex items-center justify-between px-4 py-3 shrink-0 cursor-grab",
             headerClassName
           )}
           style={headerStyle}
           onMouseDown={handleMouseDown}
         >
           <div className="flex items-center gap-2 flex-1">
             <GripHorizontal className="w-4 h-4 text-white/50 flex-shrink-0" />
             {title}
           </div>
           
           <button
             onClick={onClose}
             className="p-1.5 rounded-md hover:bg-white/20 transition-colors flex-shrink-0"
             title="Close"
           >
             <X className="w-4 h-4 text-white" />
           </button>
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
       </div>
     </>
   );
 }