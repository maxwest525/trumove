

# Darken Hero Backdrop and Smooth Side Edges

## Problem

1. The backdrop needs to be even darker for better text legibility
2. The sides of the backdrop have visible cutoff edges because the ellipse width is only 70%

---

## Solution

1. Increase the opacity values in the radial gradient for a darker effect
2. Widen the ellipse from `70% 80%` to `90% 85%` for smoother horizontal fade
3. Extend the horizontal inset further to give more fade room
4. Adjust the mask to be wider horizontally for seamless side blending

---

## Current Values

```css
.tru-hero-header-section.tru-hero-header-refined::before {
  inset: -40px -60px;
  background: radial-gradient(
    ellipse 70% 80% at 50% 50%,
    hsl(0 0% 0% / 0.38) 0%,
    hsl(0 0% 0% / 0.25) 30%,
    hsl(0 0% 0% / 0.10) 60%,
    transparent 85%
  );
  -webkit-mask-image: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    black 0%,
    black 20%,
    rgba(0,0,0,0.5) 50%,
    transparent 80%
  );
}
```

---

## New Values

```css
.tru-hero-header-section.tru-hero-header-refined::before {
  /* Extend horizontal spread for smoother side fade */
  inset: -40px -100px;
  background: radial-gradient(
    /* Wider ellipse for smoother sides */
    ellipse 90% 85% at 50% 50%,
    hsl(0 0% 0% / 0.50) 0%,    /* 50% at center (+12%) */
    hsl(0 0% 0% / 0.35) 30%,   /* 35% at 30% (+10%) */
    hsl(0 0% 0% / 0.15) 60%,   /* 15% at 60% (+5%) */
    transparent 90%            /* Extended fade out point */
  );
  -webkit-mask-image: radial-gradient(
    /* Wider horizontal mask for smooth side blending */
    ellipse 120% 100% at 50% 50%,
    black 0%,
    black 25%,
    rgba(0,0,0,0.6) 55%,
    transparent 85%
  );
  mask-image: radial-gradient(
    ellipse 120% 100% at 50% 50%,
    black 0%,
    black 25%,
    rgba(0,0,0,0.6) 55%,
    transparent 85%
  );
}
```

---

## Summary of Changes

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 26130 | Change `inset: -40px -60px` → `-40px -100px` for wider horizontal spread |
| `src/index.css` | 26131-26137 | Widen ellipse to `90% 85%`, increase opacity values, extend fade to 90% |
| `src/index.css` | 26142-26155 | Widen mask ellipse to `120% 100%` for smoother horizontal edge blending |

---

## Expected Result

- Backdrop is noticeably darker (50% center vs 38%)
- Side edges fade smoothly with no visible cutoff
- The wider ellipse and extended inset create seamless horizontal blending
- Vertical edges remain soft and natural

