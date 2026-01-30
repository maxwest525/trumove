
# Fix Carousel Cards - Only Hovered Card Should Expand

## Problem

When hovering over any carousel card, **all cards** in the carousel become visible beyond the container boundaries. This is because the `:has()` selector on the parent container (`.tru-why-card-premium`) changes `overflow` from `hidden` to `visible` for the entire container - revealing all 7 cards instead of just the 4 visible ones.

## Root Cause

The Embla carousel positions cards using `transform: translate3d()` to slide them in/out of view. With `overflow: hidden`, cards outside the visible area are clipped. When we switch to `overflow: visible`, **all cards become visible** - not just the hovered one.

## Solution

Instead of toggling `overflow` on the parent container, we need a different approach:

1. **Keep `overflow: hidden` on the carousel container** - This clips off-screen cards correctly
2. **Use `z-index` layering** on the hovered card so it appears **above** the overflow clipping context
3. **Apply the expanded scale only to the actually hovered card** (already working via `:hover`)
4. **Remove the `:has()` overflow toggling** that exposes all cards

The key insight: A child with high `z-index` cannot escape a parent with `overflow: hidden`. So we need to restructure so the hover expansion doesn't need to break the overflow boundary - OR use `clip-path` instead which can be escaped.

**Alternative approach**: Use `clip-path: inset(0)` instead of `overflow: hidden`. Unlike overflow, elements with `position: fixed` or high stacking contexts can escape clip-path in certain conditions.

**Best approach**: Limit the hover scale effect to stay within the container bounds (e.g., scale 1.1 instead of 1.35) so it doesn't need to break boundaries.

---

## Implementation

### File: `src/index.css`

#### Change 1: Remove the `:has()` overflow toggles (lines 1356-1359 and 26224-26227)

These rules are causing all cards to become visible:

```css
/* DELETE this rule - lines 1356-1359 */
.tru-hero-wrapper:has(.features-carousel-card:hover) {
  overflow-x: visible;
}

/* DELETE this rule - lines 26224-26227 */
.tru-why-card-premium:has(.features-carousel-card:hover) {
  overflow: visible;
}
```

#### Change 2: Reduce hover scale to fit within container (line 16679-16686)

Change from 1.35x (which breaks boundaries) to 1.15x (which stays within):

```css
/* Before */
.features-carousel-card:hover {
  transform: scale(1.35) translateZ(0);
  z-index: 100;
  ...
}

/* After */
.features-carousel-card:hover {
  transform: scale(1.15) translateZ(0);
  z-index: 100;
  ...
}
```

Also update the `:active` state (line 16694-16696):

```css
.features-carousel-card:active {
  transform: scale(1.15) translateZ(0);
}
```

---

## Summary of Changes

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 1356-1359 | Remove `.tru-hero-wrapper:has(.features-carousel-card:hover)` rule |
| `src/index.css` | 16679-16686 | Change hover scale from `1.35` to `1.15` |
| `src/index.css` | 16694-16696 | Change active scale from `1.35` to `1.15` |
| `src/index.css` | 26224-26227 | Remove `.tru-why-card-premium:has(.features-carousel-card:hover)` rule |

---

## Expected Result

- Only the card being hovered will enlarge (1.15x scale)
- Cards outside the visible carousel area remain hidden
- The carousel maintains its proper 4-card visible layout
- Hover effect is still noticeable but stays within container boundaries
