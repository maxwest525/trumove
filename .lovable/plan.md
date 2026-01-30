

# Fix Subtitle Position - Move Back Inside Backdrop

## Overview
Revert the subtitle back inside the `.tru-hero-header-section` container so it stays directly under the headline within the backdrop, while keeping the reduced padding.

---

## The Problem

When the subtitle was moved outside the backdrop container, the hero's flex layout pushed it to the bottom of the section instead of keeping it directly below the headline.

---

## Fix

### File: `src/pages/Index.tsx`

Move the subtitle `<p>` tag back inside the backdrop container:

```tsx
{/* Current - BROKEN */}
<div className="tru-hero-header-section tru-hero-header-refined">
  <h1 className="tru-hero-headline-main tru-headline-animated">
    <img src={logoImg} alt="TruMove" className="tru-hero-headline-logo" />
    A Smarter Way To <span className="tru-hero-headline-accent">Move</span>
  </h1>
</div>
<p className="tru-hero-subheadline-refined tru-subheadline-animated">
  Moving. The Way Its Supposed To Be
</p>

{/* Fixed - Back inside container */}
<div className="tru-hero-header-section tru-hero-header-refined">
  <h1 className="tru-hero-headline-main tru-headline-animated">
    <img src={logoImg} alt="TruMove" className="tru-hero-headline-logo" />
    A Smarter Way To <span className="tru-hero-headline-accent">Move</span>
  </h1>
  <p className="tru-hero-subheadline-refined tru-subheadline-animated">
    Moving. The Way Its Supposed To Be
  </p>
</div>
```

---

## Result

The subtitle will return to its position directly under the headline, both wrapped inside the backdrop container. The tighter padding we applied earlier (12px 28px 14px) will remain in effect.

