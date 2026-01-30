

# Fix Hero Backdrop Hard Edge Cutoff on All Sides

## Problem

The backdrop pseudo-element has visible hard edges on **all four sides** (top, bottom, left, and right). The current inset of `-40px -100px` is too small, causing the element boundaries to be visible even though the gradient fades toward transparent.

---

## Solution

1. **Extend inset on all sides significantly** - Change from `-40px -100px` to `-150px -250px` to push all edges far beyond the visible area
2. **Adjust the gradient ellipse to be more balanced** - Use `60% 70%` to keep the dark area focused on text while allowing extended fade in all directions
3. **Create a more gradual 5-stop fade** - Ensures smooth transition from dark to transparent
4. **Widen the mask in both dimensions** - Use `160% 130%` so the mask fade completes well before any element edges

---

## Current Values

```css
.tru-hero-header-section.tru-hero-header-refined::before {
  inset: -40px -100px;
  background: radial-gradient(
    ellipse 90% 85% at 50% 50%,
    hsl(0 0% 0% / 0.50) 0%,
    hsl(0 0% 0% / 0.35) 30%,
    hsl(0 0% 0% / 0.15) 60%,
    transparent 90%
  );
  -webkit-mask-image: radial-gradient(
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

## New Values

```css
.tru-hero-header-section.tru-hero-header-refined::before {
  /* Push ALL edges much further out - top/bottom AND left/right */
  inset: -150px -250px;
  background: radial-gradient(
    /* Balanced ellipse for all-direction fade */
    ellipse 60% 70% at 50% 50%,
    hsl(0 0% 0% / 0.50) 0%,
    hsl(0 0% 0% / 0.38) 25%,
    hsl(0 0% 0% / 0.20) 45%,
    hsl(0 0% 0% / 0.08) 65%,
    transparent 80%
  );
  /* Wider mask in BOTH dimensions for seamless fade on all sides */
  -webkit-mask-image: radial-gradient(
    ellipse 160% 130% at 50% 50%,
    black 0%,
    black 20%,
    rgba(0,0,0,0.7) 40%,
    rgba(0,0,0,0.3) 60%,
    transparent 75%
  );
  mask-image: radial-gradient(
    ellipse 160% 130% at 50% 50%,
    black 0%,
    black 20%,
    rgba(0,0,0,0.7) 40%,
    rgba(0,0,0,0.3) 60%,
    transparent 75%
  );
}
```

---

## Summary of Changes

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 26147 | Change `inset: -40px -100px` → `-150px -250px` to push ALL edges far beyond view |
| `src/index.css` | 26148-26154 | Adjust gradient to `60% 70%` ellipse with 5-stop fade ending at 80% |
| `src/index.css` | 26159-26172 | Widen mask to `160% 130%` with 5-stop fade ending at 75% |

---

## Design Notes

- **Extended vertical inset (-150px)**: Fixes top/bottom cutoff issue
- **Extended horizontal inset (-250px)**: Fixes left/right cutoff issue
- **Balanced ellipse (60% 70%)**: Proportional fade in all directions
- **5-stop gradients**: Much smoother transition curves
- **Earlier transparency (80%/75%)**: Gradient fully fades well before element boundaries

---

## Expected Result

- No visible hard edges or cutoff lines on any side (top, bottom, left, right)
- Backdrop seamlessly blends into the hero background image in all directions
- Dark area remains focused behind the headline text
- Natural, organic fade that feels like a soft vignette

