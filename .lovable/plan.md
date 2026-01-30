

# Fix Hero Backdrop Overlaying Cards

## Problem

The hero headline backdrop (`::before` pseudo-element) with the extended `inset: -150px -250px` is now large enough to overlap the form cards below it. Even though the pseudo-element has `z-index: -1`, the parent `.tru-hero-header-section.tru-hero-header-refined` has `z-index: 10`, creating a stacking context where the backdrop can appear over other elements.

---

## Solution

Add `position: relative` and `z-index: 20` to the `.tru-form-card` so it explicitly stacks above the header section's stacking context.

---

## Implementation

### Change: Add z-index to form card

```css
/* Line 7235-7249 */
.tru-form-card {
  position: relative;
  z-index: 20;  /* ADD - Stack above hero backdrop */
  width: 100%;
  max-width: 600px;
  /* ... rest unchanged ... */
}
```

---

## Summary of Changes

| File | Line | Change |
|------|------|--------|
| `src/index.css` | 7237 | Add `z-index: 20;` after `position: relative;` to stack cards above backdrop |

---

## Design Notes

- **z-index: 20**: Higher than the hero header's `z-index: 10`, ensuring cards always appear above the backdrop
- **position: relative**: Already exists, which is required for z-index to work
- This is the minimal fix - only one line added

---

## Expected Result

- Form cards will appear above the hero backdrop
- The backdrop seamlessly fades behind the headline AND behind the cards
- No visual overlap issues

