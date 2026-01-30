

# Fix Modal Z-Index + Remove White Shadow Artifact

## Issues Identified

### Issue 1: Modal Still Behind Why TruMove Card
The `.tru-why-card-premium` has:
- `position: relative`
- `z-index: 20`
- `overflow: visible` (to allow carousel hover effects)

This creates a stacking context. Even though the modal has `z-index: 9999`, the hero's `.tru-hero-content-panel` with `overflow-x: clip` creates isolation. Additionally, the hero section itself has `position: relative` which can interfere with z-index layering.

**Solution**: Remove the `z-index: 20` from `.tru-why-card-premium` since it's not needed (no other elements in the hero compete with it), and ensure the modal's container doesn't get caught in the hero's stacking context.

### Issue 2: White Box/Shadow on Right Side of Carousel
This is caused by the `::after` pseudo-element on `.features-carousel-container` (lines 16682-16692):

```css
.features-carousel-container::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 48px;
  background: linear-gradient(to right, transparent, hsl(var(--background)));
  pointer-events: none;
  z-index: 5;
}
```

This was meant to create a fade effect hinting at more cards, but with the widened hero bounds and layout changes, it's now appearing as a white rectangle/shadow on the edge.

**Solution**: Remove or hide this `::after` pseudo-element since the carousel is now edge-to-edge and doesn't need a fade hint.

---

## Implementation

### File: `src/index.css`

**Change 1 - Lines 26323-26336: Remove z-index from Why TruMove card**

```css
.tru-why-card-premium {
  position: relative;
  /* z-index: 20; -- REMOVE THIS */
  background: hsl(var(--background) / 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid transparent;
  border-radius: 20px;
  overflow: visible;
  box-shadow: 
    0 6px 16px hsl(var(--tm-ink) / 0.12),
    0 12px 40px hsl(var(--primary) / 0.10);
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
```

**Change 2 - Lines 16682-16692: Remove the white fade gradient pseudo-element**

```css
/* Fade gradient - DISABLED to prevent white shadow artifact */
.features-carousel-container::after {
  display: none;
}
```

Or alternatively, just remove the entire rule block.

---

## Technical Summary

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 26325 | Remove `z-index: 20` from `.tru-why-card-premium` |
| `src/index.css` | 16682-16692 | Add `display: none` or remove the `::after` fade gradient |

---

## Expected Result

- Modal will properly appear on top of all page elements including the Why TruMove card
- White shadow/box artifact on the right side of the carousel will be eliminated
- Carousel hover effects continue to work correctly (they use their own z-index logic)
- No visual regression in the Why TruMove card styling

