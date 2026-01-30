
# Fix Analyzing Route Modal Z-Index Issue

## Problem

The "Analyzing Route" modal that appears when a zip code is entered is appearing behind the header and hero elements instead of on top of everything.

## Root Cause

There's a conflicting CSS rule at lines 1541-1548 in `index.css`:

```css
.tru-hero.tru-hero-split > .tru-analyze-fullpage-overlay {
  position: absolute;  /* This overrides position: fixed! */
  grid-column: unset;
  grid-row: unset;
}
```

This rule was added to prevent the overlay from disrupting the grid layout, but it also overrides the `position: fixed` from the main modal styling (line 13959), which means:

1. The overlay is positioned relative to the hero section, not the viewport
2. The hero section creates its own stacking context, so `z-index: 1000` on the overlay is only relative to other hero children
3. The header (also `z-index: 1000`) is outside this stacking context, so it appears on top

---

## Solution

1. **Remove the modal from the grid override rule** - Keep particles and particles-overlay but exclude the analyze overlay
2. **Increase modal z-index** - Bump from `1000` to `9999` to ensure it's above everything including the header

---

## Implementation

### File: `src/index.css`

**Change 1 - Lines 1541-1548: Remove modal from grid override**

```css
/* Before */
.tru-hero.tru-hero-split > .tru-hero-particles,
.tru-hero.tru-hero-split > .tru-hero-particles-overlay,
.tru-hero.tru-hero-split > .tru-analyze-fullpage-overlay {
  position: absolute;
  grid-column: unset;
  grid-row: unset;
}

/* After */
.tru-hero.tru-hero-split > .tru-hero-particles,
.tru-hero.tru-hero-split > .tru-hero-particles-overlay {
  position: absolute;
  grid-column: unset;
  grid-row: unset;
}
```

**Change 2 - Line 13961: Increase modal z-index**

```css
/* Before */
.tru-analyze-fullpage-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  ...
}

/* After */
.tru-analyze-fullpage-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  ...
}
```

---

## Technical Summary

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 1541-1548 | Remove `.tru-analyze-fullpage-overlay` from grid override selector |
| `src/index.css` | 13961 | Change `z-index: 1000` to `z-index: 9999` |

---

## Expected Result

- Modal appears on top of all page content including header
- Modal maintains its fixed positioning for proper viewport coverage
- Backdrop blur effect works correctly
- Hero grid layout remains unaffected (particles still work as expected)
