

# Fix Why TruMove Card Cutoff - Widen Hero Bounds

## Problem Analysis

The "Why TruMove" card is being cut off on the right side because:

1. **Hero container max-width**: `.tru-hero.tru-hero-split` has `max-width: 1480px`
2. **Grid layout**: `grid-template-columns: 520px 1fr` - form column is 520px, content panel takes remainder
3. **Overflow hidden**: The parent container clips all overflow content
4. **Padding**: Right padding of `48px` further reduces available width for the content panel

On larger screens, the right content panel has limited space, causing the Why TruMove card and its hover/shadow effects to be clipped.

---

## Solution

Widen the hero container bounds to give more space for the right panel:

1. Increase `max-width` from `1480px` to `1680px` (or remove it entirely)
2. Increase right padding from `48px` to `64px` to maintain visual breathing room
3. Optionally reduce left column width slightly to give more space to the content panel

---

## Implementation

### File: `src/index.css`

**Lines 1390-1401 - Widen hero container:**

```css
.tru-hero.tru-hero-split {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 500px 1fr;  /* Reduced from 520px */
  grid-template-rows: auto 1fr;
  gap: 32px 48px;                     /* Reduced column gap from 64px */
  align-items: start;
  padding: 48px 64px 24px 48px;       /* Increased right padding */
  max-width: 1720px;                   /* Widened from 1480px */
  margin: 0 auto;
}
```

**Lines 1551-1562 - Give content panel more breathing room:**

```css
.tru-hero-content-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: flex-start;
  height: auto;
  grid-row: 2;
  grid-column: 2;
  padding-left: 16px;    /* Reduced from 24px */
  padding-right: 32px;   /* Increased from 24px */
  padding-top: 0;
}
```

---

## Technical Summary

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 1394 | `grid-template-columns: 500px 1fr` (from 520px) |
| `src/index.css` | 1396 | `gap: 32px 48px` (from 32px 64px) |
| `src/index.css` | 1398 | `padding: 48px 64px 24px 48px` (increased right) |
| `src/index.css` | 1399 | `max-width: 1720px` (from 1480px) |
| `src/index.css` | 1559 | `padding-left: 16px` (from 24px) |
| `src/index.css` | 1560 | `padding-right: 32px` (from 24px) |

---

## Design Notes

- **max-width: 1720px**: Gives an additional 240px of total width for the content
- **grid-template-columns: 500px 1fr**: Slightly narrower form column frees up more space for the Why TruMove card
- **gap: 32px 48px**: Reduced column gap from 64px to 48px, allowing more content space
- **padding adjustments**: Balanced padding that maintains visual hierarchy while maximizing content area
- The right panel now has more room for the card's shadows and hover effects without clipping

---

## Expected Result

- Why TruMove card displays fully without being cut off
- Card hover effects and shadows render completely
- Form card maintains proper proportions
- Layout remains balanced and visually appealing on wide screens

