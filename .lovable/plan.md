
# Fix Plan: Hero Background + Route Bar Bugs

## Issues Identified from Screenshot

### Issue 1: Hero Background NOT Spanning Full Width
**Current Problem**: The hero image only appears on the LEFT half of the screen, not spanning the full width behind the form and content as intended.

**Root Cause**: The `.tru-hero-bg-image` is absolutely positioned with `inset: 0`, but it's positioned relative to `.tru-hero.tru-hero-split` which has `max-width: 1480px` and `margin: 0 auto`. This constrains the background to the grid container instead of the full viewport.

**Solution**: Move the hero background image OUTSIDE the constrained grid, OR make the background break out of its container with negative margins or a fixed/viewport-based position.

---

### Issue 2: Route Bar Text Concatenated on Same Line
**Current Problem**: Text displays as "OriginEnter origin" instead of:
```
Origin
Enter origin
```

**Root Cause**: The `.tru-qb-route-bar-endpoint-text` has `flex-direction: column` but there may be a conflicting style, or the `<span>` elements for label and value need `display: block` to force line breaks.

**Solution**: Add explicit `display: block` to both `.tru-qb-route-bar-label` and `.tru-qb-route-bar-value` to ensure they stack vertically.

---

## Technical Fixes

### File: `src/index.css`

**Fix 1: Hero Background Full Width**

Move the background image to use viewport-relative positioning instead of parent-relative:

```css
.tru-hero-bg-image {
  position: fixed;  /* or use calc to break out */
  left: 0;
  right: 0;
  top: 0;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
```

OR keep it absolute but make it break out of the constrained parent:

```css
.tru-hero-bg-image {
  position: absolute;
  left: 50%;
  right: auto;
  top: 0;
  bottom: 0;
  width: 100vw;
  transform: translateX(-50%);
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
```

**Fix 2: Route Bar Text Stacking**

Force span elements to be block-level:

```css
.tru-qb-route-bar-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(var(--tm-ink) / 0.4);
}

.tru-qb-route-bar-value {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  transition: color 0.2s ease;
}
```

---

## Summary

| Issue | Current State | Fix |
|-------|---------------|-----|
| Hero BG half-width | Constrained to grid container | Use viewport-relative sizing with `width: 100vw` and `left: 50%; transform: translateX(-50%)` |
| Route text concatenated | Spans displaying inline | Add `display: block` to label/value spans |
| Gradient too dark | Shows 35-95% opacity | Already correct in CSS - may need lighter values at top |

---

## Files to Modify

1. `src/index.css` - Fix hero background positioning and route bar text display
