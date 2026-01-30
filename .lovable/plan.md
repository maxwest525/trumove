
# Fix Hero Backdrop Cutoff Issue - Complete Solution

## Root Cause Analysis

The issue is **NOT a z-index problem** - we've already correctly set the content panels to `z-index: 15` and the cards to `z-index: 20`. The visible cutoff is caused by:

1. **`.tru-hero.tru-hero-split`** has `overflow: hidden` (line 24667) - required to contain the particle animation
2. **The backdrop pseudo-element** extends `-250px` beyond its container on the right side via `inset: -150px -250px`
3. **The overflow: hidden** clips this extension, creating the visible hard edge you're seeing

The backdrop is being cut off at the container boundary because it physically extends beyond the `overflow: hidden` container.

---

## Solution Strategy

Instead of trying to extend the backdrop beyond the container (which gets clipped), we need to **contain the backdrop within the hero container** and make it work within those boundaries.

### Option A: Reduce backdrop extension and adjust gradient (Recommended)
- Change `inset` from `-150px -250px` to `-150px -100px` (less horizontal extension)
- Adjust the gradient mask to fade more aggressively near the edges
- This keeps the backdrop effect while preventing the hard cutoff

### Option B: Apply backdrop differently
- Remove the pseudo-element approach
- Apply a gradient overlay directly on the header section that doesn't extend beyond

---

## Implementation

### File: `src/index.css`

**Lines 26144-26179 - Adjust backdrop sizing and fade:**

```css
.tru-hero-header-section.tru-hero-header-refined::before {
  content: '';
  position: absolute;
  /* REDUCED: Stay within container bounds to avoid overflow clipping */
  inset: -100px -80px;  /* Changed from -150px -250px */
  background: radial-gradient(
    /* Tighter ellipse centered on headline */
    ellipse 80% 80% at 50% 50%,  /* Changed from 60% 70% */
    hsl(0 0% 0% / 0.50) 0%,
    hsl(0 0% 0% / 0.38) 20%,     /* Faster fade */
    hsl(0 0% 0% / 0.18) 40%,
    hsl(0 0% 0% / 0.06) 60%,
    transparent 75%              /* Changed from 80% */
  );
  z-index: -1;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  /* Tighter mask to fade completely before hitting container edges */
  -webkit-mask-image: radial-gradient(
    ellipse 100% 100% at 50% 50%,  /* Changed from 160% 130% */
    black 0%,
    black 15%,
    rgba(0,0,0,0.6) 35%,
    rgba(0,0,0,0.2) 55%,
    transparent 70%               /* Changed from 75% */
  );
  mask-image: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    black 0%,
    black 15%,
    rgba(0,0,0,0.6) 35%,
    rgba(0,0,0,0.2) 55%,
    transparent 70%
  );
  pointer-events: none;
}
```

---

## Technical Summary

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 26148 | Change `inset: -150px -250px` → `inset: -100px -80px` |
| `src/index.css` | 26149-26157 | Adjust gradient to fade faster |
| `src/index.css` | 26162-26177 | Tighten mask to fade before container edge |

---

## Why This Works

- **Before**: Backdrop extended 250px beyond container → got clipped by `overflow: hidden` → hard visible edge
- **After**: Backdrop stays within container bounds → gradient fades to transparent naturally → no visible edge

The backdrop will still provide the same legibility enhancement for the headline text, but now it fades to transparent BEFORE reaching the container boundary, eliminating the cutoff entirely.

---

## Alternative: Remove overflow hidden (NOT recommended)

We could remove `overflow: hidden` from `.tru-hero.tru-hero-split`, but this would cause issues with:
- Particle animation bleeding outside the hero section
- Potential horizontal scrolling issues
- Other visual elements extending beyond intended bounds

The recommended approach keeps the containment while fixing the visual issue.
