

# Make Hero Headline Backdrop Slightly Darker

## Goal

Increase the opacity of the seamlessly blending backdrop behind the hero headline while maintaining the beautiful fade-to-nothing effect.

---

## Current Values

```css
background: radial-gradient(
  ellipse 70% 80% at 50% 50%,
  hsl(0 0% 0% / 0.25) 0%,    /* 25% at center */
  hsl(0 0% 0% / 0.15) 30%,   /* 15% at 30% */
  hsl(0 0% 0% / 0.05) 60%,   /* 5% at 60% */
  transparent 85%
);
```

---

## New Values

Increase each stop by ~10-12% opacity while keeping the same fade structure:

```css
background: radial-gradient(
  ellipse 70% 80% at 50% 50%,
  hsl(0 0% 0% / 0.38) 0%,    /* 38% at center (+13%) */
  hsl(0 0% 0% / 0.25) 30%,   /* 25% at 30% (+10%) */
  hsl(0 0% 0% / 0.10) 60%,   /* 10% at 60% (+5%) */
  transparent 85%
);
```

---

## Summary of Changes

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 26131-26137 | Increase radial-gradient opacity values for darker backdrop |

---

## Expected Result

- Backdrop is noticeably darker, improving text legibility
- Seamless edge blending is preserved (no visible edges)
- The gradient still fades smoothly to transparent

