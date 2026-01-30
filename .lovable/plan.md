

# Fix Carousel Card Count & Remove White Border

## Problem Analysis

Based on my code exploration, there are two distinct issues:

### Issue 1: 5th Card Peeking Through
The carousel items use `flex: 0 0 calc(25% - 4px)` but the parent container has 8px left padding in `.features-carousel-content`, and each item has 8px horizontal padding. The math doesn't quite work out:
- 4 cards at `calc(25% - 4px)` = ~99% + 4 × 8px (item padding) = overflow

The 4px reduction isn't enough to compensate for all the internal padding, allowing part of a 5th card to show.

### Issue 2: White Border
The white border appears because:
1. `.tru-hero-content-inner` has `max-width: 520px` (line 1572) which constrains the card width
2. When the hero container was widened to `1720px`, the card container stayed at 520px, creating visual imbalance
3. The `.tru-why-card-premium` card has background/border styling that may be creating visual artifacts at the edges

---

## Solution

### Fix 1: More Aggressive Card Width Reduction
Change from `calc(25% - 4px)` to `calc(25% - 6px)` to better account for the cumulative padding:

```css
.features-carousel-item {
  flex: 0 0 calc(25% - 6px) !important;
}
```

### Fix 2: Remove Content Inner Max-Width Constraint
Remove or increase the `max-width: 520px` on `.tru-hero-content-inner` to allow the Why TruMove card to fill the available space:

```css
.tru-hero-content-inner {
  max-width: none;  /* Remove constraint */
}
```

### Fix 3: Ensure No Overflow Creates Visual Artifacts
Ensure the content panel properly clips at the edges without creating visible borders:

```css
.tru-hero-content-panel {
  overflow-x: clip;
}
```

---

## Implementation

### File: `src/index.css`

**1. Lines 16706-16719 - Reduce item width further:**

```css
.features-carousel-item {
  flex: 0 0 calc(25% - 6px) !important;  /* From -4px to -6px */
  min-width: 0;
  padding: 0 8px !important;
  margin: 0 !important;
  position: relative;
  overflow: visible !important;
  box-sizing: border-box;
  z-index: 1;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

**2. Lines 1564-1573 - Remove max-width constraint from content inner:**

```css
.tru-hero-content-inner {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  max-width: none;  /* Changed from 520px */
}
```

**3. Lines 1551-1562 - Add overflow-x: clip to content panel:**

```css
.tru-hero-content-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: flex-start;
  height: auto;
  grid-row: 2;
  grid-column: 2;
  padding-left: 16px;
  padding-right: 32px;
  padding-top: 0;
  overflow-x: clip;  /* Add this */
}
```

**4. Update responsive breakpoints (lines 16890-16916):**

```css
@media (max-width: 1279px) {
  .features-carousel-item {
    flex: 0 0 calc(33.333% - 6px) !important;
  }
}

@media (max-width: 1024px) {
  .features-carousel-item {
    flex: 0 0 calc(50% - 6px) !important;
  }
}

@media (max-width: 640px) {
  .features-carousel-item {
    flex: 0 0 calc(100% - 6px) !important;
    padding: 0 4px !important;
  }
}
```

---

## Technical Summary

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 16708 | `calc(25% - 4px)` → `calc(25% - 6px)` |
| `src/index.css` | 1572 | `max-width: 520px` → `max-width: none` |
| `src/index.css` | 1562 | Add `overflow-x: clip` to `.tru-hero-content-panel` |
| `src/index.css` | 16892 | `calc(33.333% - 4px)` → `calc(33.333% - 6px)` |
| `src/index.css` | 16899 | `calc(50% - 4px)` → `calc(50% - 6px)` |
| `src/index.css` | 16914 | `calc(100% - 4px)` → `calc(100% - 6px)` |

---

## Expected Result

- Exactly 4 carousel cards visible on desktop with no 5th card peeking through
- Why TruMove card expands to use available width without constraints
- No white border artifacts at the edges
- Clean visual boundaries with proper clipping
- Responsive breakpoints work correctly at all screen sizes

