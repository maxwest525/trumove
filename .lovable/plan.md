

# DraggableModal Maximize & Snap Features

## Overview
Enhance the reusable `DraggableModal` component with two new features:
1. **Maximize button** - Fills the entire screen with a single click, with ability to restore
2. **Snap-to-edges/center** - When dragging near screen boundaries or center, shows visual guides and snaps into position

---

## Implementation Plan

### Part 1: Maximize Button

**Add new state and logic:**
- Add `isMaximized` state to track fullscreen mode
- Store pre-maximize position/size for restoration
- Add maximize/restore button next to close button in header

**Behavior:**
- Click maximize → Modal fills viewport (with 20px margin)
- Click restore → Returns to previous position/size
- Maximized state is NOT persisted to localStorage (always opens restored)

```text
Header Layout:
┌─────────────────────────────────────────────────┐
│ [≡] Title + Badges          [□] Maximize  [✕]  │
└─────────────────────────────────────────────────┘
                                ↑ New button
```

---

### Part 2: Snap-to-Edges/Center

**Snap zones (40px threshold):**
- **Center**: When within 40px of screen center (both axes)
- **Left edge**: When x < 40px → snap to x=20
- **Right edge**: When x > viewport - width - 40 → snap to right edge
- **Top edge**: When y < 40px → snap to y=20
- **Bottom edge**: When y > viewport - height - 40 → snap to bottom

**Visual feedback:**
- Show snap indicator lines/highlights when in snap zone
- Subtle animation when snapping into place

**Implementation:**
- During drag, check if position is near snap zones
- Show visual guides for active snap zones
- On mouse up, apply snap if in zone

```text
Snap Zones Visualization:
┌─────────────────────────────────────────────────┐
│ ↑ Top snap zone (40px)                          │
│ ←──────────────  Center  ──────────────→        │
│                    ⊕                            │
│ ← Left snap        │           Right snap →    │
│   zone (40px)      │             zone (40px)   │
│                    ↓                            │
│              Bottom snap zone (40px)            │
└─────────────────────────────────────────────────┘
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/ui/DraggableModal.tsx` | Add maximize button, snap logic, and visual indicators |

---

## Technical Details

### New State Variables
```typescript
const [isMaximized, setIsMaximized] = useState(false);
const [snapZone, setSnapZone] = useState<'center' | 'left' | 'right' | 'top' | 'bottom' | null>(null);
const preMaximizeState = useRef({ position: { x: 0, y: 0 }, size: { width: 0, height: 0 } });
```

### New Imports
```typescript
import { X, GripHorizontal, Maximize2, Minimize2 } from "lucide-react";
```

### Maximize Handler
```typescript
const handleMaximize = () => {
  if (isMaximized) {
    // Restore
    setPosition(preMaximizeState.current.position);
    setSize(preMaximizeState.current.size);
  } else {
    // Save current state and maximize
    preMaximizeState.current = { position, size };
    setPosition({ x: 20, y: 20 });
    setSize({ 
      width: window.innerWidth - 40, 
      height: window.innerHeight - 40 
    });
  }
  setIsMaximized(!isMaximized);
};
```

### Snap Detection (in handleMouseMove)
```typescript
const SNAP_THRESHOLD = 40;
const SNAP_MARGIN = 20;

// During drag, detect snap zones
const centerX = (window.innerWidth - size.width) / 2;
const centerY = (window.innerHeight - size.height) / 2;

let detectedSnap: typeof snapZone = null;

// Center snap (both axes must be close)
if (Math.abs(newX - centerX) < SNAP_THRESHOLD && 
    Math.abs(newY - centerY) < SNAP_THRESHOLD) {
  detectedSnap = 'center';
}
// Edge snaps
else if (newX < SNAP_THRESHOLD) detectedSnap = 'left';
else if (newX > window.innerWidth - size.width - SNAP_THRESHOLD) detectedSnap = 'right';
else if (newY < SNAP_THRESHOLD) detectedSnap = 'top';
else if (newY > window.innerHeight - size.height - SNAP_THRESHOLD) detectedSnap = 'bottom';

setSnapZone(detectedSnap);
```

### Apply Snap on Mouse Up
```typescript
const handleMouseUp = () => {
  if (isDragging && snapZone) {
    // Apply snap position
    const snappedPosition = getSnappedPosition(snapZone, size);
    setPosition(snappedPosition);
    saveState(storageKey, snappedPosition, size);
  }
  setSnapZone(null);
  setIsDragging(false);
  setIsResizing(false);
};
```

### Snap Visual Indicators
```typescript
{/* Snap guide lines */}
{isDragging && snapZone && (
  <>
    {snapZone === 'center' && (
      <div className="fixed inset-0 pointer-events-none z-[105]">
        {/* Vertical center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-purple-500/50" />
        {/* Horizontal center line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-purple-500/50" />
      </div>
    )}
    {snapZone === 'left' && (
      <div className="fixed left-5 top-0 bottom-0 w-0.5 bg-blue-500/50 z-[105]" />
    )}
    {/* ... similar for other edges */}
  </>
)}
```

---

## UI Preview

**Header with maximize button:**
```text
┌────────────────────────────────────────────────────────┐
│ [≡] Landing Page Preview  [Template]   [□] [✕]        │
└────────────────────────────────────────────────────────┘
                                          ↑    ↑
                                     Maximize  Close
```

**Snap indicator when dragging near center:**
```text
          │
          │  (purple center lines appear)
──────────┼──────────
          │
     ┌────┴────┐
     │  Modal  │
     └─────────┘
```

---

## Summary
- Adds maximize/restore button to header (toggles fullscreen mode)
- Detects 5 snap zones: center, left, right, top, bottom
- Shows visual guide lines when in snap zone during drag
- Snaps to position on mouse release
- Clean, reusable enhancement to the shared component

