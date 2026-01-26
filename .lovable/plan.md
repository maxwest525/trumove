
# Fix Carousel Card Spacing and Clipping Issues

## Problem Analysis
Looking at the screenshots, there are multiple issues:
1. **Cards being cut off** - borders are clipped on the sides
2. **Inconsistent gaps** - some cards are touching while others have space between them
3. **Layout math conflicts** - Embla carousel has built-in spacing that conflicts with our custom CSS

## Root Cause
The Embla carousel component (`carousel.tsx`) has hardcoded spacing:
- `CarouselContent` applies `-ml-4` (negative 16px margin)
- `CarouselItem` applies `pl-4` (16px padding left)

Our custom CSS tries to override with `gap: 20px` but these conflict, creating inconsistent spacing.

## Solution
Rather than fighting Embla's default spacing system, we need to **work with it** or **fully override it**. The cleanest approach is to fully override the defaults and use a consistent gap-based system.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Fix carousel spacing calculations and ensure consistent gaps |

---

## Detailed Changes

### `src/index.css` (lines 14720-14735)

**Current Problem:**
```css
.features-carousel-content {
  gap: 20px;
  margin-left: 0 !important;  /* Overrides -ml-4 */
  padding: 8px 4px;
}

.features-carousel-item {
  flex: 0 0 calc(25% - 15px) !important;
  padding: 0 !important;  /* Overrides pl-4 */
}
```

The math doesn't account properly for 4 cards with gaps. With `gap: 20px` and 4 cards, there are 3 gaps total = 60px. Each card should be `calc((100% - 60px) / 4)`.

**Fixed CSS:**

```css
/* Carousel content - fully reset Embla defaults */
.features-carousel-content {
  display: flex;
  gap: 16px;  /* Consistent gap between all cards */
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 8px 8px;  /* Equal horizontal padding to prevent edge clipping */
}

/* 4 cards visible - proper calculation:
   Total gaps = 3 × 16px = 48px
   Each card = (100% - 48px) / 4 */
.features-carousel-item {
  flex: 0 0 calc((100% - 48px) / 4) !important;
  min-width: 0;
  padding: 0 !important;
  margin: 0 !important;
  position: relative;
  overflow: visible;
}

/* Ensure card fills its container with consistent sizing */
.features-carousel-card {
  width: 100%;
  box-sizing: border-box;
}
```

**Key calculations:**
- **Gap**: 16px (consistent, divisible number)
- **Total gap space**: 3 gaps × 16px = 48px
- **Each card width**: `calc((100% - 48px) / 4)` = exactly 25% minus share of gaps
- **Container padding**: 8px on each side to prevent border clipping

### Responsive Breakpoints Update

Also need to fix the responsive widths:

```css
/* 3 cards on tablet: 2 gaps × 16px = 32px */
@media (max-width: 1024px) {
  .features-carousel-item {
    flex: 0 0 calc((100% - 32px) / 3) !important;
  }
}

/* 2 cards on small tablet: 1 gap × 16px = 16px */
@media (max-width: 768px) {
  .features-carousel-item {
    flex: 0 0 calc((100% - 16px) / 2) !important;
  }
}

/* 1 card on mobile: 0 gaps */
@media (max-width: 480px) {
  .features-carousel-item {
    flex: 0 0 100% !important;
  }
}
```

---

## Visual Summary

### Current State (Broken)
```
|[Card]|[Card]  [Card][Card]|
   ^       ^        ^
   cut    big gap   touching
```

### After Fix (Correct)
```
| [Card] [Card] [Card] [Card] |
    16px   16px   16px
   ^--- consistent gaps ---^
```

---

## Summary of Changes

| Property | Current | New |
|----------|---------|-----|
| `gap` | 20px | 16px |
| `padding` | 8px 4px | 8px 8px |
| Card width | `calc(25% - 15px)` | `calc((100% - 48px) / 4)` |
| 3-card width | `calc(33.333% - 13.33px)` | `calc((100% - 32px) / 3)` |
| 2-card width | `calc(50% - 10px)` | `calc((100% - 16px) / 2)` |

---

## Expected Result
- All 4 cards visible with exactly 16px gap between each
- No cards cut off on sides (8px padding buffer)
- Consistent spacing throughout scrolling
- Cards never touch each other
- Proper responsive behavior at different screen sizes
