
# Make Scanner Badge Functional and Match Button Styling

## Overview
Three changes to the scanner preview:
1. Make the "Ready to Scan" / "Pause Scan" badge clickable to toggle the demo
2. Update badge styling to match the "Start AI Analysis Demo" button (dark background, white text, green text on hover)
3. Ensure no grey overlay appears before the demo starts

---

## Changes Required

### 1. Make Badge Clickable (Toggle Scan)
**File: `src/pages/Index.tsx` (Lines 307-310)**

Convert the badge `<div>` to a `<button>` and wire it to toggle the demo:

```tsx
// Before
<div className="tru-ai-scanner-badge">
  <Scan className="w-4 h-4" />
  <span>{isRunning ? "Pause Scan" : "Ready to Scan"}</span>
</div>

// After
<button 
  className="tru-ai-scanner-badge"
  onClick={onStartDemo}
>
  <Scan className="w-4 h-4" />
  <span>{isRunning ? "Pause Scan" : "Ready to Scan"}</span>
</button>
```

---

### 2. Update Badge Styling to Match Button
**File: `src/index.css` (Lines 2432-2447)**

Change from light background with green text to dark background with white text (matching the start button):

```css
/* Before */
.tru-ai-scanner-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: hsl(var(--background) / 0.95);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: hsl(var(--primary));
  border: 1px solid hsl(var(--primary) / 0.3);
}

/* After */
.tru-ai-scanner-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: hsl(var(--foreground));
  color: hsl(var(--background));
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  z-index: 15;
  box-shadow: 0 4px 16px hsl(var(--tm-ink) / 0.4);
  transition: all 0.2s ease;
}

.tru-ai-scanner-badge:hover {
  background: hsl(var(--foreground));
  color: hsl(var(--primary));
  transform: scale(1.05);
  box-shadow: 0 6px 20px hsl(var(--primary) / 0.5);
}
```

---

### 3. Remove Any Potential Grey Overlay
**File: `src/index.css`**

Ensure the `.tru-ai-live-scanner` has no pseudo-elements or filters that could create a grey appearance:

```css
/* Add explicit rule to prevent any overlay */
.tru-ai-live-scanner::before,
.tru-ai-live-scanner::after {
  display: none;
}

.tru-ai-live-scanner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: none;
  opacity: 1;
}
```

---

## Technical Summary

| Element | Before | After |
|---------|--------|-------|
| Badge element | `<div>` (not clickable) | `<button>` (toggles scan) |
| Badge background | Light with blur | Dark (matches start button) |
| Badge text color | Green | White (green on hover) |
| Badge on click | Nothing | Pauses/resumes scan |
| Hover effect | None | Scale + green text |
| Image filters | Potentially inherited | Explicitly `filter: none` |

---

### Files Modified
- `src/pages/Index.tsx` - Convert badge to clickable button
- `src/index.css` - Update badge styling and ensure no grey overlay
