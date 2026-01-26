
# Card Hover Fix & AI Helper Slide-to-Minimize

## Overview
Two UI refinements:
1. Fix card border artifacts during hover enlargement with smoother shadow transitions
2. Redesign the AI Helper minimize behavior to slide partially offscreen instead of collapsing to a small circle

---

## 1. Card Hover Border Fix

### Problem
The `transform: scale(1.08)` on `.is-enlarged` causes border clipping/erasure due to compositor layer issues and the scaling interaction with the parent container.

### Solution
- Reduce scale from `1.08` to `1.04` (subtler, less prone to artifacts)
- Add `transition` specifically for `transform`, `box-shadow`, and `border-color`
- Use `backface-visibility: hidden` to improve rendering
- Add a more gradual shadow transition for smoothness
- Ensure parent `.features-carousel-item` has `overflow: visible` to prevent clipping

### Changes to `src/index.css`

**Update base `.features-carousel-card` transition:**
```css
.features-carousel-card {
  /* existing styles */
  transition: transform 300ms ease, border-color 250ms ease, box-shadow 300ms ease;
  backface-visibility: hidden;
}
```

**Update `.is-enlarged` class:**
```css
.features-carousel-card.is-enlarged {
  transform: scale(1.04);  /* Reduced from 1.08 */
  z-index: 20;
  box-shadow: 
    0 12px 32px hsl(var(--tm-ink) / 0.12),
    0 0 0 1px hsl(var(--primary) / 0.2);  /* Inset border effect */
  border-color: hsl(var(--primary) / 0.5);
}
```

**Ensure parent allows overflow:**
```css
.features-carousel-item {
  overflow: visible !important;
}
```

---

## 2. AI Helper Slide-to-Minimize

### Current Behavior
- When hidden: Shows a small circular button with waving hand
- Dismiss button: Just a hand icon

### New Behavior
- Default: Open (fully visible pill button) - no change
- Dismiss button: Hand icon + arrow (pointing right) indicating slide direction
- When minimized: The entire pill slides partially offscreen to the right
  - Only ~60px visible (enough to see the hand icon and click)
  - Clicking slides it back in

### Changes to `src/components/FloatingTruckChat.tsx`

**A. Import additional icons:**
```tsx
import { Truck, Sparkles, Hand, ChevronRight, ChevronLeft } from 'lucide-react';
```

**B. Replace isHidden with isMinimized for clarity:**
```tsx
const [isMinimized, setIsMinimized] = useState(() => {
  return localStorage.getItem('tm_ai_helper_minimized') === 'true';
});
```

**C. Dismiss button with hand + arrow:**
```tsx
<button
  onClick={handleMinimize}
  className="dismiss-button"
  aria-label="Minimize AI Helper"
>
  <Hand className="w-3.5 h-3.5" />
  <ChevronRight className="w-3 h-3" />
</button>
```

**D. Minimized state - pill slides right, partially visible:**

Instead of replacing with a small circle, keep the full pill but apply a slide transform:

```tsx
<button
  onClick={isMinimized ? handleReopen : () => setIsOpen(true)}
  className={`
    fixed bottom-24 right-6 z-50
    px-5 py-3.5 rounded-full
    /* ... existing styles ... */
    ${isMinimized ? 'translate-x-[calc(100%-48px)]' : 'translate-x-0'}
    transition-transform duration-300 ease-out
  `}
>
  {/* When minimized, show ChevronLeft + Hand to indicate "pull back" */}
  {isMinimized ? (
    <div className="flex items-center gap-1 mr-auto">
      <ChevronLeft className="w-4 h-4 text-background" />
      <Hand className="w-4 h-4 text-background animate-wave" />
    </div>
  ) : (
    <>
      {/* Normal visible content */}
    </>
  )}
</button>
```

### Alternative simpler approach - Minimized indicator strip:

When minimized, show a vertical strip on the right edge with:
- Waving hand icon
- Left-pointing arrow
- Click to expand

```tsx
// When minimized - show a vertical strip on the right edge
if (isMinimized) {
  return (
    <button
      onClick={handleReopen}
      className="fixed bottom-24 right-0 z-50 
        px-2 py-4 
        bg-foreground text-background 
        rounded-l-xl
        shadow-lg 
        flex flex-col items-center gap-2
        transition-all duration-300 
        hover:px-3 hover:shadow-xl
        group"
      aria-label="Open AI Helper"
    >
      <ChevronLeft className="w-4 h-4 text-background/70 group-hover:text-background transition-colors" />
      <Hand className="w-5 h-5 text-background animate-wave" />
    </button>
  );
}
```

This approach:
- Shows a thin vertical strip attached to right edge (`right-0`)
- Rounded left corners only (`rounded-l-xl`)
- Contains left arrow + waving hand stacked vertically
- Expands slightly on hover to encourage clicking
- Clearly indicates "slide me back"

---

## Files Modified

1. **`src/index.css`** (lines ~14726-14945)
   - Add `transition` properties to `.features-carousel-card` for smooth transform
   - Add `backface-visibility: hidden` to prevent flicker
   - Reduce `.is-enlarged` scale from `1.08` to `1.04`
   - Update shadow to include subtle inset border effect
   - Ensure `.features-carousel-item` has `overflow: visible`

2. **`src/components/FloatingTruckChat.tsx`**
   - Import `ChevronRight` and `ChevronLeft` from lucide-react
   - Rename `isHidden` to `isMinimized` for clarity
   - Update localStorage key to `tm_ai_helper_minimized`
   - Update dismiss button to show Hand + ChevronRight
   - Replace minimized state with vertical edge strip design

---

## Visual Reference

### Card Hover (Before vs After)
```text
Before:                          After:
┌─────────┐  scale(1.08)        ┌─────────┐  scale(1.04)
│  ===    │  border erased      │  ===    │  border preserved
│         │                     │         │  smooth shadow
│  [IMG]  │                     │  [IMG]  │
└─────────┘                     └─────────┘
```

### AI Helper Minimized State
```text
Visible pill (default):          Minimized (edge strip):

┌──────────────────────────┐                    ┌────┐
│ 🚚 AI Moving Helper  ⚫ 👋→│       →→→        ←│ 👋 │
│    Ask me anything       │                    └────┘
└──────────────────────────┘            (right edge of screen)
```
