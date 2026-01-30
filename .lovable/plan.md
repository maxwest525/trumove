

# Enhance Move Summary Modal with Close Button and Visual Flair

## Overview
Add a close button (X) to the top right, increase the satellite image sizes, and add more visual flair to the floating Move Summary modal.

---

## Current State
- No close button - users can't dismiss the modal
- Satellite images are 100x100px
- Basic styling without much visual flair
- Plain header without decorative elements

## Target State
- X close button in top right corner
- Larger satellite images (140x140px)
- Gradient accent stripe at top
- Subtle animated glow/border effect
- More polished header with decorative sparkle

---

## Changes

### 1. Add onClose Prop and Close Button to Component
**File:** `src/pages/Index.tsx` (lines 148-270)

Update the interface to accept an `onClose` callback:

```tsx
interface MoveSummaryModalProps {
  fromCity: string;
  toCity: string;
  distance: number;
  fromCoords: [number, number] | null;
  toCoords: [number, number] | null;
  moveDate?: Date | null;
  estimatedDuration?: string;
  onClose?: () => void;
}
```

Add close button inside the modal:

```tsx
<div className="tru-move-summary-modal">
  {/* Top Accent Stripe */}
  <div className="tru-move-summary-accent" />
  
  {/* Close Button */}
  {onClose && (
    <button 
      onClick={onClose} 
      className="tru-move-summary-close"
      aria-label="Close move summary"
    >
      <X className="w-4 h-4" />
    </button>
  )}
  
  {/* Header with Sparkle */}
  <div className="tru-move-summary-header">
    <Sparkles className="w-5 h-5" />
    <h3>Building your personalized move profile</h3>
  </div>
  ...
</div>
```

### 2. Add State to Track Modal Dismissal
**File:** `src/pages/Index.tsx`

Add state to control modal visibility and reset when locations change:

```tsx
const [showMoveSummary, setShowMoveSummary] = useState(true);

// Reset visibility when locations change
useEffect(() => {
  if (fromCity || toCity) {
    setShowMoveSummary(true);
  }
}, [fromCity, toCity]);
```

### 3. Update Modal Rendering with onClose Prop
**File:** `src/pages/Index.tsx`

Pass the onClose prop and conditionally render:

```tsx
{showMoveSummary && (
  <MoveSummaryModal 
    fromCity={fromCity}
    toCity={toCity}
    distance={distance}
    fromCoords={fromCoords}
    toCoords={toCoords}
    moveDate={moveDate}
    estimatedDuration={estimatedDuration}
    onClose={() => setShowMoveSummary(false)}
  />
)}
```

### 4. Add CSS for Close Button
**File:** `src/index.css`

```css
/* Close Button */
.tru-move-summary-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: hsl(var(--muted));
  border: none;
  cursor: pointer;
  color: hsl(var(--muted-foreground));
  transition: all 0.2s ease;
  z-index: 5;
}

.tru-move-summary-close:hover {
  background: hsl(var(--destructive) / 0.1);
  color: hsl(var(--destructive));
}
```

### 5. Increase Satellite Image Size
**File:** `src/index.css` (lines 154-158)

Update the large map class from 100x100 to 140x140:

```css
.tru-move-summary-map.tru-move-summary-map-lg {
  width: 140px;
  height: 140px;
  border: 2px solid hsl(var(--primary) / 0.3);
  box-shadow: 0 4px 12px hsl(var(--tm-ink) / 0.15);
}
```

### 6. Add Top Accent Stripe
**File:** `src/index.css`

```css
/* Top Accent Stripe */
.tru-move-summary-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    hsl(var(--primary)), 
    hsl(var(--primary) / 0.6), 
    hsl(var(--primary))
  );
  border-radius: 16px 16px 0 0;
}
```

### 7. Add Animated Glow Border Effect
**File:** `src/index.css`

Update the modal styling with animated glow:

```css
.tru-move-summary-modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--primary) / 0.25);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 
    0 8px 32px hsl(var(--tm-ink) / 0.12),
    0 0 0 1px hsl(var(--primary) / 0.1),
    inset 0 1px 0 hsl(255 255 255 / 0.05);
  animation: slideInRight 0.4s ease-out, glowPulse 3s ease-in-out infinite;
  overflow: hidden;
}

@keyframes glowPulse {
  0%, 100% {
    box-shadow: 
      0 8px 32px hsl(var(--tm-ink) / 0.12),
      0 0 0 1px hsl(var(--primary) / 0.1);
  }
  50% {
    box-shadow: 
      0 8px 32px hsl(var(--tm-ink) / 0.15),
      0 0 16px hsl(var(--primary) / 0.15);
  }
}
```

### 8. Enhance Header with Sparkle Animation
**File:** `src/index.css`

```css
.tru-move-summary-header svg {
  color: hsl(var(--primary));
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
```

---

## Technical Details

### Icon Import
Add `X` and `Sparkles` to the icon imports in Index.tsx:
```tsx
import { X, Sparkles, ... } from "lucide-react";
```

### Files Modified
| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Add onClose prop, close button, state management, change CheckCircle to Sparkles |
| `src/index.css` | Close button styles, larger maps, accent stripe, animated glow |

---

## Summary

| Feature | Description |
|---------|-------------|
| Close button (X) | Top right, subtle with hover effect |
| Larger images | 140x140px satellite thumbnails with green border |
| Accent stripe | 3px gradient bar at top of modal |
| Animated glow | Subtle pulsing box-shadow effect |
| Sparkle icon | Animated sparkle replacing checkmark in header |
| Enhanced borders | Green-tinted borders with inset highlight |

## Visual Result
- Users can dismiss the modal by clicking X in top right
- Satellite images are 40% larger (140px vs 100px) for better visibility
- Premium feel with animated glow, accent stripe, and sparkle animation
- Modal feels more polished and interactive

