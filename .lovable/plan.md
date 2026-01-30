

# Hero Header Backdrop Edge Fade

## Goal

Add a subtle fade-out effect to the edges of the hero header backdrop, creating a softer, more organic appearance instead of hard rectangular edges.

---

## Current Implementation

The backdrop is created using a `::before` pseudo-element on `.tru-hero-header-section.tru-hero-header-refined` with:
- A linear gradient from 35% black opacity at top to 20% at bottom
- A 16px border radius
- Backdrop blur effect

---

## Implementation

### File: `src/index.css`

#### Change: Add mask-image for edge fade (lines 26062-26074)

```css
/* Before */
.tru-hero-header-section.tru-hero-header-refined::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    hsl(0 0% 0% / 0.35) 0%,
    hsl(0 0% 0% / 0.20) 100%
  );
  border-radius: 16px;
  z-index: -1;
  backdrop-filter: blur(8px);
}

/* After */
.tru-hero-header-section.tru-hero-header-refined::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    hsl(0 0% 0% / 0.35) 0%,
    hsl(0 0% 0% / 0.20) 100%
  );
  border-radius: 16px;
  z-index: -1;
  backdrop-filter: blur(8px);
  -webkit-mask-image: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    black 60%,
    transparent 100%
  );
  mask-image: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    black 60%,
    transparent 100%
  );
}
```

---

## Summary of Changes

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 26062-26074 | Add CSS mask-image property for subtle edge fade |

---

## Expected Result

- The hero header backdrop will subtly fade out toward its edges
- Creates a softer, more organic appearance
- The center of the backdrop remains fully opaque for text legibility
- Edges blend smoothly into the hero background
- Works in both light and dark modes

