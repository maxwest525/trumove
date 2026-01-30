

# Fix Header Backdrop Gradient Banding Lines

## Problem

The header backdrop on the hero section is showing visible lines/banding. This is caused by the radial gradient on the `::before` pseudo-element at lines 26238-26273, which uses multiple opacity stops that create visible banding artifacts, especially at:
- `hsl(0 0% 0% / 0.50)` to `hsl(0 0% 0% / 0.38)` (sharp jump)
- Combined with mask-image gradients that add more edge definition

## Root Cause

The current gradient has discrete opacity stops that create visible "rings" or lines:
```css
background: radial-gradient(
  ellipse 80% 80% at 50% 50%,
  hsl(0 0% 0% / 0.50) 0%,
  hsl(0 0% 0% / 0.38) 20%,
  hsl(0 0% 0% / 0.18) 40%,
  hsl(0 0% 0% / 0.06) 60%,
  transparent 75%
);
```

## Solution

Replace the stepped radial gradient with a single, smooth gradient that has minimal opacity jumps. Also simplify the mask-image to avoid double-banding artifacts.

---

## Implementation

### File: `src/index.css` (Lines 26238-26273)

**Replace the current `::before` pseudo-element with a smoother version:**

```css
.tru-hero-header-section.tru-hero-header-refined::before {
  content: '';
  position: absolute;
  inset: -80px -60px;
  background: radial-gradient(
    ellipse 90% 90% at 50% 50%,
    hsl(0 0% 0% / 0.35) 0%,
    hsl(0 0% 0% / 0.25) 30%,
    hsl(0 0% 0% / 0.10) 55%,
    transparent 80%
  );
  z-index: -1;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  pointer-events: none;
}
```

**Key Changes:**
1. **Smoother gradient stops** - Fewer stops with gentler opacity transitions (0.35 → 0.25 → 0.10 → 0) instead of 5 abrupt stops
2. **Remove mask-image entirely** - The mask-image was adding additional gradient banding on top of the background gradient
3. **Slightly smaller inset** - Tighter bounds to avoid edge artifacts
4. **Reduced blur** - 3px instead of 4px to reduce any blur-edge artifacts

---

## Technical Summary

| Property | Before | After |
|----------|--------|-------|
| Gradient stops | 5 stops (0.50, 0.38, 0.18, 0.06, 0) | 4 stops (0.35, 0.25, 0.10, 0) |
| Mask-image | Yes (adding more edges) | Removed |
| Inset | -100px -80px | -80px -60px |
| Blur | 4px | 3px |

---

## Expected Result

- No visible lines or banding in the header backdrop
- Smooth, subtle dark vignette behind headline text for readability
- Clean fade to transparent edges without artifacts

