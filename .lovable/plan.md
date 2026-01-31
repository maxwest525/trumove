
# Enhance Scanner Line and Add Furniture Identification

## Overview
Two enhancements to the AI scanner preview:
1. Improve the green scanner line animation to be more visible and smooth
2. Add animated bounding boxes that appear to identify furniture as the scanner passes over them

---

## Current State

| Element | Current Behavior |
|---------|-----------------|
| Scanner line | Animates top-to-bottom-to-top (10% → 90% → 10%) over 2.5s |
| Furniture identification | None - items just appear in detection list |

---

## Changes Required

### 1. Enhance Scanner Line Animation
**File: `src/index.css`**

Make the scanner line thicker, brighter, and add a glow trail effect:

```css
.tru-ai-scanner-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, hsl(var(--primary)) 20%, hsl(var(--primary)) 80%, transparent 100%);
  box-shadow: 
    0 0 12px hsl(var(--primary)),
    0 0 24px hsl(var(--primary) / 0.6),
    0 0 36px hsl(var(--primary) / 0.3);
  animation: scan-sweep 2.5s ease-in-out infinite;
}

/* Add trailing glow effect */
.tru-ai-scanner-line::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 20px;
  top: -10px;
  background: linear-gradient(to bottom, transparent, hsl(var(--primary) / 0.15), transparent);
}
```

---

### 2. Add Furniture Identification Boxes
**File: `src/pages/Index.tsx`**

Add positioned bounding boxes that appear sequentially as items are "detected":

```tsx
// Define furniture positions in the sample living room image
const FURNITURE_POSITIONS = [
  { id: 0, name: "3-Seat Sofa", top: "55%", left: "10%", width: "45%", height: "35%" },
  { id: 1, name: "Coffee Table", top: "70%", left: "45%", width: "20%", height: "15%" },
  { id: 2, name: "TV Stand", top: "25%", left: "55%", width: "25%", height: "30%" },
  { id: 3, name: "Armchair", top: "50%", left: "70%", width: "20%", height: "30%" },
  { id: 4, name: "Floor Lamp", top: "20%", left: "85%", width: "10%", height: "40%" },
];
```

Update the `ScannerPreview` component to accept `visibleCount` and render detection boxes:

```tsx
function ScannerPreview({ isRunning, onStartDemo, visibleCount }: ScannerPreviewProps) {
  return (
    <div className="tru-ai-live-scanner">
      <img src={sampleRoomLiving} alt="Room being scanned" />
      {isRunning && (
        <>
          <div className="tru-ai-scanner-overlay">
            <div className="tru-ai-scanner-line" />
          </div>
          {/* Furniture detection boxes */}
          {FURNITURE_POSITIONS.slice(0, visibleCount).map((item, i) => (
            <div 
              key={item.id}
              className="tru-ai-detection-box"
              style={{ 
                top: item.top, 
                left: item.left, 
                width: item.width, 
                height: item.height 
              }}
            >
              <span className="tru-ai-detection-label">{item.name}</span>
            </div>
          ))}
        </>
      )}
      ...
    </div>
  );
}
```

---

### 3. Style the Detection Boxes
**File: `src/index.css`**

Add animated bounding box styling with labels:

```css
.tru-ai-detection-box {
  position: absolute;
  border: 2px solid hsl(var(--primary));
  border-radius: 8px;
  background: hsl(var(--primary) / 0.1);
  box-shadow: 
    0 0 8px hsl(var(--primary) / 0.4),
    inset 0 0 20px hsl(var(--primary) / 0.05);
  animation: detection-pulse 2s ease-in-out infinite, detection-appear 0.3s ease-out;
  pointer-events: none;
  z-index: 10;
}

@keyframes detection-appear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes detection-pulse {
  0%, 100% {
    box-shadow: 
      0 0 8px hsl(var(--primary) / 0.4),
      inset 0 0 20px hsl(var(--primary) / 0.05);
  }
  50% {
    box-shadow: 
      0 0 16px hsl(var(--primary) / 0.6),
      inset 0 0 30px hsl(var(--primary) / 0.1);
  }
}

.tru-ai-detection-label {
  position: absolute;
  top: -24px;
  left: 0;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 8px hsl(var(--primary) / 0.4);
}
```

---

### 4. Lift State for Shared visibleCount
**File: `src/pages/Index.tsx`**

Move the `visibleCount` state from `DetectionList` up to the parent so both the scanner preview and detection list share it:

```tsx
// In the AI Move Estimator section component
const [visibleCount, setVisibleCount] = useState(0);

useEffect(() => {
  if (!isRunning) {
    setVisibleCount(0);
    return;
  }
  const interval = setInterval(() => {
    setVisibleCount(prev => prev >= SCAN_DEMO_ITEMS.length ? prev : prev + 1);
  }, 800);
  return () => clearInterval(interval);
}, [isRunning]);

// Pass to both components
<ScannerPreview isRunning={isRunning} onStartDemo={...} visibleCount={visibleCount} />
<DetectionList visibleCount={visibleCount} />
```

---

## Technical Summary

| Element | Before | After |
|---------|--------|-------|
| Scanner line height | 2px | 3px with glow trail |
| Scanner line glow | Single 8px shadow | Triple-layered 12/24/36px glow |
| Furniture boxes | None | Green animated bounding boxes |
| Detection labels | None | Green pill labels above boxes |
| State management | visibleCount in DetectionList | Lifted to parent, shared |

---

### Files Modified
- `src/pages/Index.tsx` - Add furniture positions, lift state, render detection boxes
- `src/index.css` - Enhanced scanner line, detection box styles
