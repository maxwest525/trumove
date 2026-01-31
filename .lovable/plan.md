
# Center TruMove Logo to Page Center

## Overview
Center the TruMove logo horizontally to the center of the entire page, ensuring it appears perfectly centered regardless of the form panel on the right.

---

## Current Structure
The hero header uses `.tru-hero-header-stacked` which is already set up with flexbox centering, but it's constrained within the hero grid layout. The logo is centered within its container, but not centered relative to the full page width.

---

## Technical Changes

### File: `src/index.css`

**Update `.tru-hero-header-stacked` to position absolutely and center on page:**

Update lines 80-100:
```css
/* Stacked hero header layout - logo on top, page-centered */
.tru-hero-header-stacked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 48px;
  width: 100%;
  max-width: 800px;
  z-index: 10;
}
```

This will:
- Position the header absolutely within the hero section
- Use `left: 50%` and `transform: translateX(-50%)` to center it horizontally on the page
- Place it near the top of the hero section
- Keep all content (logo and headline) centered

---

## Summary of Changes

| Element | Before | After |
|---------|--------|-------|
| Header positioning | Static (grid flow) | Absolute, centered on page |
| Horizontal alignment | Centered in container | Centered on viewport |
| Vertical position | Grid flow | Fixed at top: 48px |

---

## Files Modified
- `src/index.css` - Update `.tru-hero-header-stacked` positioning
