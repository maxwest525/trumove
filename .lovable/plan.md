
# Fix Hero Header Backdrop & Adjust Stats Strip

## Issues Identified

### 1. Hero Header Backdrop - Black Background & Banding Lines
The `::before` pseudo-element on `.tru-hero-header-section.tru-hero-header-refined` (lines 26300-26315) is causing:
- Visible black radial gradient behind the headline
- Gradient banding artifacts from the stepped opacity values

**Current problematic code:**
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

### 2. Stats Strip Overlap
The `-175px` margin is already in place, but user wants to verify/adjust the value.

---

## Solution

### Fix 1: Remove the Black Backdrop Entirely

The simplest solution is to **completely remove** the `::before` pseudo-element. The headline already has strong text shadows that provide sufficient contrast against the background image.

**Replace lines 26300-26315 with:**
```css
/* Removed ::before backdrop - text shadows provide sufficient contrast */
```

### Fix 2: Adjust Stats Strip Overlap (if needed)

The current value is `-175px`. If this needs adjustment, change line 29014:

| Current | Suggested Alternatives |
|---------|----------------------|
| `-175px` | `-150px` (less overlap) |
| `-175px` | `-200px` (more overlap) |

For now, keep at `-175px` unless user specifies a different value.

---

## Technical Summary

| File | Line(s) | Change |
|------|---------|--------|
| `src/index.css` | 26300-26315 | Remove `::before` pseudo-element entirely |
| `src/index.css` | 29014 | Keep `-175px` or adjust per user feedback |

---

## Expected Result

- No visible black box or banding behind the hero headline
- Headline text remains readable via existing text-shadow styling
- Clean, unobstructed view of the family background image behind the headline
- Stats strip overlap unchanged at -175px (can adjust if user provides new value)
