

# Adjust AI Scanner Section: Spacing, Overlay, and Button Styling

## Overview
Make four visual adjustments to the AI Move Estimator section:
1. Adjust spacing between section title and scanner/detection boxes
2. Remove grey overlay from scanner preview
3. Match scanner button color to "Start Demo" button styling
4. Change button text to "Start AI Analysis Demo" with green text on hover

---

## Changes Required

### 1. Adjust Spacing Between Title and Boxes
**File: `src/index.css`**

Reduce the gap between the section title/accent line and the three-column grid by adjusting the `margin-top` on the center and right columns from -10px to a larger negative value:

```css
/* Before */
.tru-ai-center-column {
  margin-top: -10px;
}

.tru-ai-right-column {
  margin-top: -10px;
}

/* After */
.tru-ai-center-column {
  margin-top: -20px;
}

.tru-ai-right-column {
  margin-top: -20px;
}
```

---

### 2. Remove Grey Overlay from Scanner Preview
**File: `src/index.css` (Lines 2406-2414)**

Remove the background tint from the scanner overlay while keeping the scanning line visible:

```css
/* Before */
.tru-ai-scanner-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(var(--primary) / 0.08);
  pointer-events: none;
}

/* After */
.tru-ai-scanner-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  pointer-events: none;
}
```

---

### 3. Update Scanner Button to Match Start Demo Styling
**File: `src/index.css` (Lines 2271-2295)**

The button already uses `background: hsl(var(--foreground))` which matches the "Start Demo" button styling. No changes needed for base state.

---

### 4. Change Button Text and Hover Style
**File: `src/pages/Index.tsx` (Line 315)**

Update the button text from "Start Demo" to "Start AI Analysis Demo":

```tsx
/* Before */
{isRunning ? "Running..." : "Start Demo"}

/* After */
{isRunning ? "Running..." : "Start AI Analysis Demo"}
```

**File: `src/index.css` (Lines 2291-2295)**

Update hover state to keep black background but change font to green:

```css
/* Before */
.tru-ai-scanner-start-btn:hover {
  background: hsl(var(--primary));
  transform: scale(1.05);
  box-shadow: 0 6px 20px hsl(var(--primary) / 0.5);
}

/* After */
.tru-ai-scanner-start-btn:hover {
  background: hsl(var(--foreground));
  color: hsl(var(--primary));
  transform: scale(1.05);
  box-shadow: 0 6px 20px hsl(var(--primary) / 0.5);
}
```

---

## Technical Summary

| Change | Before | After |
|--------|--------|-------|
| Column margin-top | -10px | -20px |
| Overlay background | hsl(var(--primary) / 0.08) | transparent |
| Button text | "Start Demo" | "Start AI Analysis Demo" |
| Hover background | hsl(var(--primary)) | hsl(var(--foreground)) |
| Hover text color | (inherited) | hsl(var(--primary)) (green) |

---

### Files Modified
- `src/index.css` - Spacing, overlay, and button hover changes
- `src/pages/Index.tsx` - Button text update

