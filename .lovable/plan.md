
# Restore Hero Header & Remove Grey Overlay

## What Happened
In my last edit, I mistakenly removed the main hero header section (the "TruMove A Smarter Way To Move" headline). You wanted only the grey background/overlay removed, not the header itself.

---

## The Fix

### 1. Restore the Hero Header
**File:** `src/pages/Index.tsx`

Add back the hero header section after line 750 (after the analyzing overlay closes):

```tsx
{/* Hero Header with Headline + Short Subheadline */}
<div className="tru-hero-header-section tru-hero-header-refined">
  <h1 className="tru-hero-headline-main">
    <img src={logoImg} alt="TruMove" className="tru-hero-headline-logo" />
    A Smarter Way To <span className="tru-hero-headline-accent">Move</span>
  </h1>
</div>
```

---

### 2. Remove the Grey Overlay
**File:** `src/index.css`

The grey overlay is coming from `.tru-hero-particles-overlay` (lines 23764-23775). Change its background from a semi-transparent gradient to fully transparent:

```css
/* FROM: */
.tru-hero-particles-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 100% 80% at 50% 30%,
    transparent 0%,
    hsl(var(--background) / 0.2) 50%,
    hsl(var(--background) / 0.5) 100%
  );
  pointer-events: none;
  z-index: 0;
}

/* TO: */
.tru-hero-particles-overlay {
  position: absolute;
  inset: 0;
  background: transparent;
  pointer-events: none;
  z-index: 0;
}
```

---

## Summary

| Task | File | Change |
|------|------|--------|
| Restore header | `src/pages/Index.tsx` | Re-add `tru-hero-header-section` div with logo + headline |
| Remove grey overlay | `src/index.css` | Set `.tru-hero-particles-overlay` background to `transparent` |

## Visual Result
- The "TruMove A Smarter Way To Move" header will return above the form
- The grey/white semi-transparent overlay behind the hero will be completely removed
- The hero background image will be fully visible with no tinting
