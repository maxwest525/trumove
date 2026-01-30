
# Make Move Summary Modal Float Over Why TruMove

## Overview
Change the Move Summary Modal from being in document flow (pushing content down) to floating/overlaying on top of the Why TruMove card.

---

## Current Behavior
- Move Summary Modal and Why TruMove card are stacked vertically in a flex column
- When Move Summary appears, it pushes Why TruMove down by its height + 16px gap
- The layout shifts when location data is entered

## Target Behavior
- Move Summary Modal floats/overlays on top of Why TruMove card
- Why TruMove stays in a fixed position regardless of Move Summary visibility
- Move Summary appears as a floating card positioned at the top of the stacked cards area

---

## Changes

### 1. Update Stacked Cards Container
**File:** `src/index.css` (lines 25831-25835)

Add `position: relative` to serve as the positioning context for the floating modal:

```css
.tru-hero-stacked-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative; /* Add positioning context */
}
```

### 2. Update Move Summary Modal Positioning
**File:** `src/index.css` (lines 83-91)

Make the modal absolutely positioned to float over content:

```css
.tru-move-summary-modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--primary) / 0.2);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px hsl(var(--tm-ink) / 0.15);
  animation: slideInRight 0.4s ease-out;
  margin-bottom: 0; /* Remove margin since it's floating */
}
```

### 3. Add Backdrop/Overlay Effect (Optional Enhancement)
**File:** `src/index.css`

Add a subtle backdrop blur effect behind the floating modal for better visual separation:

```css
.tru-move-summary-modal::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: hsl(var(--background) / 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 18px;
  z-index: -1;
}
```

---

## Summary

| Change | File | Description |
|--------|------|-------------|
| Add position: relative | `src/index.css` | Stacked cards container becomes positioning context |
| Change to position: absolute | `src/index.css` | Move Summary floats instead of pushing content |
| Add z-index: 10 | `src/index.css` | Ensure modal stays on top |
| Remove margin-bottom | `src/index.css` | No longer needed for floating element |
| Enhanced shadow | `src/index.css` | Stronger shadow for floating appearance |

## Visual Result
- Why TruMove card stays in its original position
- Move Summary Modal floats elegantly on top when location data is entered
- The modal has a slightly stronger shadow to indicate it's floating
- Layout is stable - no content shifting when modal appears/disappears
