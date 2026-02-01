

# Plan: Video Consult Enhancements - Whiteboard, Trudy Chat, UI Polish

## Overview
This plan addresses 5 enhancements to the Video Consult page:

1. **Full whiteboard functionality** with drawing tools and real-time collaboration
2. **Trudy AI button opens the chat modal** (dispatch custom event)
3. **Improve Virtual Video Controls header** to look more like a proper header
4. **Add input field to chat panel** for Trudy AI communication
5. **Shrink booking/shipment ID input field** to be less prominent

---

## Visual Layout Changes

```text
VIRTUAL VIDEO CONTROLS HEADER (Enhanced):
+------------------------------------------------------------------+
|  ═══════════════  VIRTUAL VIDEO CONTROLS  ═══════════════        |
+------------------------------------------------------------------+

WHITEBOARD MODAL:
+------------------------------------------------------------------+
|  [X] Virtual Whiteboard                                    LIVE  |
+------------------------------------------------------------------+
|  TOOLS: [✏️ Pen] [🧹 Eraser] | COLORS: [● ● ● ● ● ● ● ●]        |
|  SIZES: [○ ○ ○ ○] | ACTIONS: [↩ Undo] [↪ Redo] [🗑 Clear]        |
+------------------------------------------------------------------+
|                                                                   |
|                         CANVAS AREA                               |
|                                                                   |
+------------------------------------------------------------------+

BOOKING INPUT (Compact):
+------------------------------------------------------------------+
|  Booking Code: [TM-2026-XXXX____] [Join] [Call]                  |
+------------------------------------------------------------------+
```

---

## Changes

### 1. NEW FILE: `src/components/video-consult/WhiteboardCanvas.tsx`

Create a full-featured whiteboard component with:

**Features:**
- Pen and Eraser tools
- 8-color palette (black, red, orange, green, blue, purple, pink, white)
- 4 brush sizes (2, 4, 8, 16px)
- Undo/Redo functionality with stroke history stacks
- Clear canvas action
- Real-time drawing with smooth strokes

**Implementation:**
```tsx
// State management
const [strokes, setStrokes] = useState<Stroke[]>([]);
const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
const [redoStack, setRedoStack] = useState<Stroke[][]>([]);
const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
const [color, setColor] = useState("#000000");
const [brushSize, setBrushSize] = useState(4);

// Canvas rendering via useEffect
// Mouse event handlers for drawing
```

---

### 2. FILE: `src/pages/Book.tsx` - Add Whiteboard Modal State & Import

**Add new state variable** (near line 934):
```tsx
const [showWhiteboardModal, setShowWhiteboardModal] = useState(false);
```

**Add import** at top:
```tsx
import { WhiteboardCanvas } from "@/components/video-consult/WhiteboardCanvas";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
```

**Add `User` to lucide imports:**
```tsx
import { User } from "lucide-react"; // Add to existing imports
```

---

### 3. FILE: `src/pages/Book.tsx` - Update Trudy AI Button (lines 1390-1398)

**BEFORE:**
```tsx
<Button 
  variant="outline"
  className="h-10 px-3 border border-border bg-background hover:bg-muted"
  onClick={() => toast.info("Trudy AI is available in the chat panel")}
>
  <Bot className="w-4 h-4 mr-1.5" />
  Trudy AI
</Button>
```

**AFTER:**
```tsx
<Button 
  variant="outline"
  className="h-10 px-3 border border-border bg-background hover:bg-muted"
  onClick={() => window.dispatchEvent(new CustomEvent('openTrudyChat'))}
>
  <Bot className="w-4 h-4 mr-1.5" />
  Trudy AI
</Button>
```

This dispatches the `openTrudyChat` custom event that `FloatingTruckChat` already listens for.

---

### 4. FILE: `src/pages/Book.tsx` - Update Whiteboard Button (lines 1400-1408)

**BEFORE:**
```tsx
<Button 
  variant="outline"
  className="h-10 px-3 border border-border bg-background hover:bg-muted"
  onClick={() => toast.info("Whiteboard feature coming soon")}
>
  <PenTool className="w-4 h-4 mr-1.5" />
  Whiteboard
</Button>
```

**AFTER:**
```tsx
<Button 
  variant="outline"
  className="h-10 px-3 border border-border bg-background hover:bg-muted"
  onClick={() => setShowWhiteboardModal(true)}
>
  <PenTool className="w-4 h-4 mr-1.5" />
  Whiteboard
</Button>
```

---

### 5. FILE: `src/pages/Book.tsx` - Improve Controls Header (lines 1329-1332)

**BEFORE:**
```tsx
<h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 w-full text-center">
  Virtual Video Controls
</h3>
```

**AFTER:**
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

This creates a centered header with horizontal lines on each side for a more polished look.

---

### 6. FILE: `src/pages/Book.tsx` - Shrink Booking Input (lines 1445-1475)

**Key changes:**
- Reduce input height from `h-11` to `h-9`
- Reduce button heights from `h-11` to `h-9`
- Shrink button text and padding
- Condense the label

**BEFORE:**
```tsx
<label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
  Enter Booking Code or Shipment ID
</label>
<Input className="flex-1 h-11 bg-background border border-border" ... />
<Button className="h-11 px-4 bg-foreground ..." ... >
```

**AFTER:**
```tsx
<label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
  Booking Code or Shipment ID
</label>
<Input className="flex-1 h-9 text-sm bg-background border border-border" ... />
<Button className="h-9 px-3 text-sm bg-foreground ..." ... >
  <Video className="w-3.5 h-3.5 mr-1.5" />
  Join
</Button>
<Button className="h-9 px-3 text-sm ..." ... >
  <Phone className="w-3.5 h-3.5 mr-1.5" />
  Call
</Button>
```

---

### 7. FILE: `src/pages/Book.tsx` - Add Whiteboard Modal (after line 1498)

Add new modal dialog before the closing Footer:

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

### 8. FILE: `src/pages/Book.tsx` - Enhanced Schedule Modal with Contact Form

Update the schedule modal (lines 1480-1498) to include contact fields and TCPA consent:

**Add state variables** (near line 934):
```tsx
const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
const [scheduleTime, setScheduleTime] = useState<string>("");
const [scheduleName, setScheduleName] = useState("");
const [schedulePhone, setSchedulePhone] = useState("");
const [scheduleEmail, setScheduleEmail] = useState("");
const [scheduleTcpaConsent, setScheduleTcpaConsent] = useState(false);
```

**Enhanced modal content:**
- Calendar date/time selection triggers form reveal
- Contact fields: Name, Phone, Email
- TCPA consent checkbox with legal text
- Validation before submission
- Form reset on successful submission

---

## Summary of Changes

| Component | Change |
|-----------|--------|
| **WhiteboardCanvas.tsx** | NEW - Full drawing canvas with tools, colors, sizes, undo/redo |
| **Trudy AI button** | Opens FloatingTruckChat via custom event dispatch |
| **Whiteboard button** | Opens whiteboard modal |
| **Controls header** | Decorative style with horizontal lines and bold typography |
| **Booking input** | Reduced to h-9, compact buttons, shorter label |
| **Schedule modal** | Added contact form fields + TCPA consent |
| **Whiteboard modal** | NEW - Dialog with WhiteboardCanvas and LIVE badge |

---

## Files to Create/Modify

1. **CREATE**: `src/components/video-consult/WhiteboardCanvas.tsx`
2. **MODIFY**: `src/pages/Book.tsx`

