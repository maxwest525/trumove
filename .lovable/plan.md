

# Fix Hero Backdrop Overlaying Quote Wizard and Why TruMove Card

## Problem

The hero headline backdrop (`::before` pseudo-element) with the extended `inset: -150px -250px` is large enough to overlap both the quote wizard form AND the "Why TruMove" card below it. While we added `z-index: 20` to `.tru-form-card`, the `.tru-why-card-premium` doesn't have an explicit z-index, so it's being overlaid by the backdrop.

---

## Solution

Add `z-index: 20` to the `.tru-why-card-premium` class so both the quote wizard and the Why TruMove card stack above the hero header's backdrop.

---

## Implementation

### Change: Add z-index to Why TruMove card

```css
/* Line 26323-26335 */
.tru-why-card-premium {
  position: relative;
  z-index: 20;  /* ADD - Stack above hero backdrop */
  background: hsl(var(--background) / 0.85);
  backdrop-filter: blur(12px);
  /* ... rest unchanged ... */
}
```

---

## Summary of Changes

| File | Line | Change |
|------|------|--------|
| `src/index.css` | 26324 | Add `z-index: 20;` after `position: relative;` to stack Why TruMove card above backdrop |

---

## Design Notes

- **z-index: 20**: Matches the form card's z-index, ensuring both cards appear above the hero header section (z-index: 10) and its backdrop
- **position: relative**: Already exists on `.tru-why-card-premium`, which is required for z-index to work
- This is a one-line fix

---

## Expected Result

- Quote wizard form cards appear above the hero backdrop
- Why TruMove card appears above the hero backdrop  
- The backdrop seamlessly fades behind the headline AND behind all cards
- No visual overlap issues with any card elements

