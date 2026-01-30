

# Move AI Inventory Section Higher + Add Live Scan Preview

## Overview
Move the "Start Your AI Inventory Analysis" section significantly higher on the page (directly after the hero form ends) and add a small working preview showing a simulated room scan with items being detected and added to an inventory list in real-time.

---

## Current Layout

```
1. Hero Header (TruMove A Smarter Way To Move)
2. Quote Form
3. Why TruMove Card + Carousel
4. </tru-hero-wrapper>
5. AI Inventory Analysis Section ← TOO LOW
6. Stats Strip (Black)
7. Route Analysis Section
8. Consult Section
9. How It Works
```

## Proposed Layout

```
1. Hero Header
2. Quote Form
3. Why TruMove Card + Carousel
4. </tru-hero-wrapper>
5. AI Inventory Analysis Section ← MOVED UP (padding reduced)
   + LIVE SCAN PREVIEW COMPONENT ← NEW
6. Stats Strip (Black)
7. Route Analysis Section
...
```

---

## Changes

### 1. Move AI Section Higher & Reduce Top Spacing
**File:** `src/index.css`

Reduce the padding on `.tru-ai-steps-section` to bring it closer to the hero wrapper:

```css
.tru-ai-steps-section {
  padding: 24px 24px 48px; /* Reduced top padding from 48px to 24px */
  margin-top: -32px; /* Pull up into hero area slightly */
  background: hsl(var(--background));
  position: relative;
  z-index: 5;
}
```

### 2. Add Live Scan Preview Component
**File:** `src/pages/Index.tsx`

Create a new inline component that shows:
- A small room image (simulated camera view)
- A scanning animation overlay
- A live inventory list that items get added to progressively
- Auto-starts when section is in view

This will replace the static image preview with an interactive demo:

```tsx
// New component: LiveScanPreview
// Shows a looping demo of items being detected:
// - Room image with scanning indicator
// - Items appear one by one with animations
// - Running totals for weight/volume
```

### 3. Update Preview Block Structure
**File:** `src/pages/Index.tsx` (lines 1294-1318)

Replace the static preview block with the new interactive live scan preview:

```tsx
{/* Live Scan Preview Block */}
<div className="tru-ai-preview-block tru-ai-preview-live">
  <div className="tru-ai-live-scanner">
    <img src={sampleRoomLiving} alt="Room being scanned" />
    <div className="tru-ai-scanner-overlay">
      <div className="tru-ai-scanner-line" /> {/* Animated scan line */}
      <Camera className="w-6 h-6" />
    </div>
  </div>
  <div className="tru-ai-live-inventory">
    <div className="tru-ai-live-header">
      <Sparkles className="w-4 h-4" />
      <span>Live Detection</span>
    </div>
    <div className="tru-ai-live-items">
      {/* Items animate in one by one */}
      {demoItems.slice(0, visibleCount).map((item, i) => (
        <div key={i} className="tru-ai-live-item animate-in">
          <img src={item.image} alt={item.name} />
          <span>{item.name}</span>
          <span className="tru-ai-live-weight">{item.weight} lbs</span>
        </div>
      ))}
    </div>
    <div className="tru-ai-live-totals">
      <span>{totalItems} items</span>
      <span>{totalWeight} lbs</span>
      <span>{totalCuFt} cu ft</span>
    </div>
  </div>
</div>
```

### 4. Add CSS Styles for Live Scan Preview
**File:** `src/index.css`

```css
/* Live Scan Preview */
.tru-ai-preview-live {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.tru-ai-live-scanner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/10;
}

.tru-ai-scanner-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(var(--primary) / 0.15);
}

.tru-ai-scanner-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, hsl(var(--primary)), transparent);
  animation: scan-sweep 2s ease-in-out infinite;
}

@keyframes scan-sweep {
  0%, 100% { top: 10%; }
  50% { top: 90%; }
}

.tru-ai-live-inventory {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.tru-ai-live-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-bottom: 1px solid hsl(var(--border) / 0.5);
  animation: slideIn 0.3s ease-out;
}

.tru-ai-live-totals {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid hsl(var(--border));
  display: flex;
  justify-content: space-between;
  font-weight: 700;
}
```

### 5. Add State & Effect for Live Demo
**File:** `src/pages/Index.tsx`

Add state to manage the live demo animation:

```tsx
// Demo items for live preview
const SCAN_DEMO_ITEMS = [
  { name: "3-Seat Sofa", weight: 350, cuft: 45, image: "/inventory/living-room/sofa-3-cushion.png" },
  { name: "Coffee Table", weight: 45, cuft: 8, image: "/inventory/living-room/coffee-table.png" },
  { name: "TV Stand", weight: 80, cuft: 12, image: "/inventory/living-room/tv-stand.png" },
  { name: "Armchair", weight: 85, cuft: 18, image: "/inventory/living-room/armchair.png" },
];

const [liveDemoCount, setLiveDemoCount] = useState(0);

// Auto-advance demo items
useEffect(() => {
  const interval = setInterval(() => {
    setLiveDemoCount(prev => (prev + 1) % (SCAN_DEMO_ITEMS.length + 1));
  }, 1500);
  return () => clearInterval(interval);
}, []);
```

---

## Summary

| Change | File | Description |
|--------|------|-------------|
| Reduce section spacing | `src/index.css` | Less top padding, pull section up |
| Add live scanner component | `src/pages/Index.tsx` | Animated room scan with items appearing |
| Add scanner CSS | `src/index.css` | Scan line animation, item slide-in effects |
| Add demo state | `src/pages/Index.tsx` | useEffect to cycle through demo items |

## Visual Result
- The "Start Your AI Inventory Analysis" section appears immediately after the hero form
- A split view shows a room being scanned on the left and items populating a list on the right
- Items animate in one-by-one with weight/volume totals updating in real-time
- The demo loops continuously to catch user attention
- Creates an engaging preview of the AI scanning feature without requiring user action

