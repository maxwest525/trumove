
# Fix Hero Backdrop Stacking and Cutoff Issue

## Problem Analysis

The hero headline backdrop is overlaying the quote wizard and Why TruMove cards because of a z-index stacking issue:

1. **Header section** (`.tru-hero-header-section.tru-hero-header-refined`) has `z-index: 10`
2. **Content panels** (`.tru-hero-content-panel` and `.tru-hero-right-half`) only have `z-index: 1`
3. **Backdrop** (`::before` pseudo-element) has `z-index: -1` relative to its parent, but since the parent has `z-index: 10`, the backdrop effectively stacks at `z-index: 9`
4. This puts the backdrop ABOVE the content panels (which are at `z-index: 1`)

The visible cutoff on the right side is caused by the backdrop extending 250px beyond its container, hitting the `overflow: hidden` on `.tru-hero.tru-hero-split`.

---

## Solution

Increase the z-index of the hero content panels to be higher than the header section so they stack above the backdrop:

- Change `.tru-hero-content-panel` and `.tru-hero-right-half` from `z-index: 1` to `z-index: 15`
- This ensures these panels (and their child cards) stack above the header's backdrop

---

## Implementation

### File: `src/index.css`

**Change at lines 24670-24676:**

```css
/* Ensure hero content stays above particles AND header backdrop */
.tru-hero-top-section,
.tru-hero-content-panel,
.tru-hero-right-half {
  position: relative;
  z-index: 15;  /* Changed from 1 to 15 - stack above header backdrop (z-index: 10) */
}
```

---

## Technical Summary

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 24675 | Change `z-index: 1` → `z-index: 15` |

---

## Design Notes

- **z-index: 15**: Higher than the header's `z-index: 10`, ensuring content panels stack above the backdrop
- **z-index: 20 on cards**: `.tru-form-card` and `.tru-why-card-premium` already have `z-index: 20`, which will still work correctly since their parent container is now higher
- The `.tru-hero-top-section` is also updated for consistency, though it's less critical
- The cutoff appearance is actually the mask gradient fading to transparency - with proper z-stacking, this will be hidden behind the cards as intended

---

## Expected Result

- Quote wizard and Why TruMove cards appear above the hero backdrop
- The backdrop gradient fades seamlessly behind the headline
- No visible cutoff edges overlaying the cards
- All card interactions (hover effects, carousels) continue to work correctly
