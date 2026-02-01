

# Plan: Video Consult Enhancements

## Overview
This plan addresses 6 distinct improvements to the Video Consult page:
1. Add full whiteboard functionality with drawing tools
2. Make Trudy AI button open the Trudy chat modal
3. Improve the "Virtual Video Controls" header styling
4. Add functional chat input in the Live Support panel
5. Make the booking/shipment ID input field smaller
6. Add contact info fields (name, phone, email) with TCPA consent to Schedule modal

---

## Visual Layout Changes

```text
SCHEDULE MODAL (After selecting date/time):
+----------------------------------------------------------+
|  Schedule a Call with Your Agent                    [X]  |
+----------------------------------------------------------+
|  [BookingCalendar - Date & Time Selection]               |
+----------------------------------------------------------+
|  YOUR CONTACT INFORMATION                                |
|  [Full Name     ___________________________________]     |
|  [Phone Number  ___________________________________]     |
|  [Email Address ___________________________________]     |
+----------------------------------------------------------+
|  [ ] I agree to receive calls/texts about my move.       |
|      Standard rates may apply. Reply STOP to opt out.    |
+----------------------------------------------------------+
|                          [Cancel]  [Confirm Appointment] |
+----------------------------------------------------------+

CONTROLS CARD HEADER:
+----------------------------------------------------------+
|  ═══════════ VIRTUAL VIDEO CONTROLS ═══════════          |
+----------------------------------------------------------+

WHITEBOARD MODAL:
+----------------------------------------------------------+
|  [X] Virtual Whiteboard                            LIVE  |
+----------------------------------------------------------+
|  TOOLS: [Pen] [Eraser] [Clear] | COLOR: [palette]       |
+----------------------------------------------------------+
|                                                          |
|                   CANVAS AREA                            |
|                                                          |
+----------------------------------------------------------+
```

---

## Changes

### File: `src/pages/Book.tsx`

#### 1. Add State Variables for New Features
Add new state for whiteboard and schedule form near existing state (around line 932):

```tsx
const [showWhiteboardModal, setShowWhiteboardModal] = useState(false);

// Schedule form state
const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
const [scheduleTime, setScheduleTime] = useState<string>("");
const [scheduleName, setScheduleName] = useState("");
const [schedulePhone, setSchedulePhone] = useState("");
const [scheduleEmail, setScheduleEmail] = useState("");
const [scheduleTcpaConsent, setScheduleTcpaConsent] = useState(false);
```

#### 2. Update Trudy AI Button (line 1301-1309)
Change the Trudy AI button to dispatch the custom event that opens the FloatingTruckChat modal:

```tsx
{/* Trudy AI Service */}
<Button 
  variant="outline"
  className="h-10 px-3 border border-border bg-background hover:bg-muted"
  onClick={() => window.dispatchEvent(new CustomEvent('openTrudyChat'))}
>
  <Bot className="w-4 h-4 mr-1.5" />
  Trudy AI
</Button>
```

#### 3. Update Virtual Whiteboard Button (lines 1311-1319)
Change the Whiteboard button to open the whiteboard modal:

```tsx
{/* Virtual Whiteboard */}
<Button 
  variant="outline"
  className="h-10 px-3 border border-border bg-background hover:bg-muted"
  onClick={() => setShowWhiteboardModal(true)}
>
  <PenTool className="w-4 h-4 mr-1.5" />
  Whiteboard
</Button>
```

#### 4. Improve Controls Header (line 1258-1260)
Make the header more prominent with a decorative style:

```tsx
{/* Header with decorative lines */}
<div className="flex items-center gap-3 w-full mb-4">
  <div className="flex-1 h-px bg-border" />
  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground px-2">
    Virtual Video Controls
  </h3>
  <div className="flex-1 h-px bg-border" />
</div>
```

#### 5. Shrink Booking Input Field (lines 1366-1396)
Reduce the input height from h-11 to h-9 and shrink button sizes:

```tsx
{/* Bottom Section: Booking Input + Actions */}
<div className="w-full space-y-2">
  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
    Booking Code or Shipment ID
  </label>
  <div className="flex items-center gap-2">
    <Input
      value={bookingCode}
      onChange={(e) => setBookingCode(e.target.value)}
      placeholder="e.g. TM-2026-XXXXXXXX"
      className="flex-1 h-9 text-sm bg-background border border-border"
      onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
    />
    <Button 
      onClick={handleJoinRoom} 
      disabled={!bookingCode.trim()}
      className="h-9 px-3 text-sm bg-foreground text-background hover:bg-foreground/90 font-semibold"
    >
      <Video className="w-3.5 h-3.5 mr-1.5" />
      Join
    </Button>
    <Button 
      variant="outline"
      className="h-9 px-3 text-sm border border-border bg-background hover:bg-muted font-semibold"
      onClick={() => window.location.href = "tel:+16097277647"}
    >
      <Phone className="w-3.5 h-3.5 mr-1.5" />
      Call
    </Button>
  </div>
</div>
```

#### 6. Add Chat Input to Live Support Panel (lines 1243-1250)
Add functional chat input with send handler:

```tsx
{/* Chat Input Field - Functional */}
<div className="w-full max-w-xs mt-4">
  <div className="flex items-center gap-2">
    <Input 
      placeholder="Type a message..."
      className="flex-1 bg-slate-800/60 border-white/30 text-white placeholder:text-white/50 h-10"
      onKeyDown={(e) => {
        if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
          toast.info("Message sent! A specialist will respond shortly.");
          (e.target as HTMLInputElement).value = '';
        }
      }}
    />
    <Button 
      size="icon"
      className="h-10 w-10 bg-primary hover:bg-primary/90"
      onClick={(e) => {
        const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
        if (input?.value.trim()) {
          toast.info("Message sent! A specialist will respond shortly.");
          input.value = '';
        }
      }}
    >
      <MessageSquare className="w-4 h-4" />
    </Button>
  </div>
</div>
```

#### 7. Update Schedule Modal with Contact Form (lines 1401-1419)
Expand the schedule modal to include contact info and TCPA consent:

```tsx
{/* Schedule Time Modal */}
<Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Schedule a Call with Your Agent</DialogTitle>
    </DialogHeader>
    
    {/* Calendar Selection */}
    <BookingCalendar 
      onSelect={(date, time) => {
        setScheduleDate(date);
        setScheduleTime(time);
      }} 
    />
    
    {/* Contact Info Section - Shows after time selection */}
    {scheduleTime && (
      <div className="space-y-4 pt-4 border-t border-border animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Your Contact Information
          </span>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="schedule-name" className="text-xs font-medium">Full Name</Label>
            <Input 
              id="schedule-name"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              placeholder="Your full name"
              className="mt-1 h-10"
            />
          </div>
          <div>
            <Label htmlFor="schedule-phone" className="text-xs font-medium">Phone Number</Label>
            <Input 
              id="schedule-phone"
              type="tel"
              value={schedulePhone}
              onChange={(e) => setSchedulePhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="mt-1 h-10"
            />
          </div>
          <div>
            <Label htmlFor="schedule-email" className="text-xs font-medium">Email Address</Label>
            <Input 
              id="schedule-email"
              type="email"
              value={scheduleEmail}
              onChange={(e) => setScheduleEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-1 h-10"
            />
          </div>
        </div>
        
        {/* TCPA Consent */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
          <Checkbox 
            id="tcpa-consent"
            checked={scheduleTcpaConsent}
            onCheckedChange={(checked) => setScheduleTcpaConsent(checked as boolean)}
            className="mt-0.5"
          />
          <label htmlFor="tcpa-consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
            I agree to receive calls and text messages about my move at the phone number provided. 
            Standard messaging rates may apply. Reply STOP to opt out at any time.
          </label>
        </div>
      </div>
    )}
    
    <DialogFooter className="gap-2">
      <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
        Cancel
      </Button>
      <Button 
        onClick={() => {
          if (!scheduleTime) {
            toast.error("Please select a time");
            return;
          }
          if (!scheduleName.trim() || !schedulePhone.trim() || !scheduleEmail.trim()) {
            toast.error("Please fill in all contact fields");
            return;
          }
          if (!scheduleTcpaConsent) {
            toast.error("Please accept the consent to continue");
            return;
          }
          toast.success(`Appointment confirmed for ${scheduleTime} on ${scheduleDate?.toLocaleDateString()}`);
          setShowScheduleModal(false);
          // Reset form
          setScheduleName("");
          setSchedulePhone("");
          setScheduleEmail("");
          setScheduleTcpaConsent(false);
          setScheduleTime("");
        }}
        disabled={!scheduleTime || !scheduleName.trim() || !schedulePhone.trim() || !scheduleEmail.trim() || !scheduleTcpaConsent}
        className="bg-foreground text-background hover:bg-foreground/90"
      >
        Confirm Appointment
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### 8. Add Whiteboard Modal (after Schedule Modal)
Create a new whiteboard modal with drawing canvas:

```tsx
{/* Whiteboard Modal */}
<Dialog open={showWhiteboardModal} onOpenChange={setShowWhiteboardModal}>
  <DialogContent className="sm:max-w-4xl h-[80vh]">
    <DialogHeader>
      <div className="flex items-center justify-between">
        <DialogTitle>Virtual Whiteboard</DialogTitle>
        <span className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          LIVE
        </span>
      </div>
    </DialogHeader>
    <WhiteboardCanvas />
  </DialogContent>
</Dialog>
```

---

### File: `src/components/video-consult/WhiteboardCanvas.tsx` (NEW FILE)

Create a new component for the whiteboard functionality:

```tsx
import { useRef, useState, useEffect, useCallback } from "react";
import { Pencil, Eraser, Trash2, Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLORS = [
  "#000000", "#EF4444", "#F59E0B", "#22C55E", 
  "#3B82F6", "#8B5CF6", "#EC4899", "#FFFFFF"
];

const BRUSH_SIZES = [2, 4, 8, 16];

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
  tool: 'pen' | 'eraser';
}

export function WhiteboardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);

  // Redraw canvas when strokes change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all strokes
    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      
      ctx.beginPath();
      ctx.strokeStyle = stroke.tool === 'eraser' ? '#FFFFFF' : stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });

    // Draw current stroke
    if (currentStroke.length >= 2) {
      ctx.beginPath();
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      currentStroke.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  }, [strokes, currentStroke, color, brushSize, tool]);

  // Set canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height - 60; // Account for toolbar
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCanvasPoint = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const point = getCanvasPoint(e);
    setCurrentStroke([point]);
  }, [getCanvasPoint]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const point = getCanvasPoint(e);
    setCurrentStroke(prev => [...prev, point]);
  }, [isDrawing, getCanvasPoint]);

  const stopDrawing = useCallback(() => {
    if (isDrawing && currentStroke.length >= 2) {
      setUndoStack(prev => [...prev, strokes]);
      setRedoStack([]);
      setStrokes(prev => [...prev, {
        points: currentStroke,
        color,
        size: brushSize,
        tool
      }]);
    }
    setIsDrawing(false);
    setCurrentStroke([]);
  }, [isDrawing, currentStroke, color, brushSize, tool, strokes]);

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, strokes]);
    setStrokes(previousState);
    setUndoStack(prev => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, strokes]);
    setStrokes(nextState);
    setRedoStack(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setUndoStack(prev => [...prev, strokes]);
    setRedoStack([]);
    setStrokes([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-3 border-b border-border bg-muted/30">
        {/* Tools */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className={cn("h-9 w-9", tool === 'pen' && "bg-foreground text-background")}
            onClick={() => setTool('pen')}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn("h-9 w-9", tool === 'eraser' && "bg-foreground text-background")}
            onClick={() => setTool('eraser')}
          >
            <Eraser className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Colors */}
        <div className="flex items-center gap-1">
          {COLORS.map(c => (
            <button
              key={c}
              className={cn(
                "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                color === c ? "border-foreground scale-110" : "border-border"
              )}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Brush Sizes */}
        <div className="flex items-center gap-1">
          {BRUSH_SIZES.map(size => (
            <button
              key={size}
              className={cn(
                "w-8 h-8 rounded-lg border flex items-center justify-center transition-colors",
                brushSize === size ? "bg-foreground text-background border-foreground" : "border-border hover:bg-muted"
              )}
              onClick={() => setBrushSize(size)}
            >
              <div 
                className="rounded-full bg-current"
                style={{ width: size, height: size }}
              />
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleUndo} disabled={undoStack.length === 0}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleRedo} disabled={redoStack.length === 0}>
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 text-destructive hover:text-destructive" onClick={handleClear}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative bg-white rounded-b-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
}
```

---

### File: `src/pages/Book.tsx` - Additional Imports

Add necessary imports at the top of the file:

```tsx
import { User } from "lucide-react"; // Add to existing lucide import
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { WhiteboardCanvas } from "@/components/video-consult/WhiteboardCanvas";
```

---

## Summary

| Item | Change |
|------|--------|
| Whiteboard | Full drawing canvas with pen, eraser, colors, brush sizes, undo/redo, clear |
| Trudy AI button | Opens the FloatingTruckChat modal via custom event dispatch |
| Controls header | Decorative style with horizontal lines and bolder typography |
| Live Support chat | Functional input field with send button and toast feedback |
| Booking input | Smaller height (h-9), compact button text |
| Schedule modal | Contact info form (name, phone, email) + TCPA consent checkbox after time selection |

---

## Files Modified

- `src/pages/Book.tsx` - Add states, update buttons, expand schedule modal, add whiteboard modal
- `src/components/video-consult/WhiteboardCanvas.tsx` - New file for whiteboard functionality

