

# Resize Hero Backdrop to Match Red Box Reference

## Overview
Adjust the hero backdrop to be tighter and only cover the logo and headline "A Smarter Way To Move", excluding the subtitle from the backdrop area.

---

## Current State

The backdrop currently wraps around both elements:
- ✅ Logo + Headline: "A Smarter Way To Move"
- ❌ Subtitle: "Moving. The Way Its Supposed To Be" (should be outside the backdrop)

The CSS class `.tru-hero-header-section.tru-hero-header-refined` applies the backdrop to the entire container including the subtitle.

---

## Proposed Changes

### File: `src/pages/Index.tsx`

**Move the subtitle outside the backdrop container:**

```tsx
{/* Before */}
<div className="tru-hero-header-section tru-hero-header-refined">
  <h1 className="tru-hero-headline-main tru-headline-animated">
    <img src={logoImg} alt="TruMove" className="tru-hero-headline-logo" />
    A Smarter Way To <span className="tru-hero-headline-accent">Move</span>
  </h1>
  <p className="tru-hero-subheadline-refined tru-subheadline-animated">
    Moving. The Way Its Supposed To Be
  </p>
</div>

{/* After */}
<div className="tru-hero-header-section tru-hero-header-refined">
  <h1 className="tru-hero-headline-main tru-headline-animated">
    <img src={logoImg} alt="TruMove" className="tru-hero-headline-logo" />
    A Smarter Way To <span className="tru-hero-headline-accent">Move</span>
  </h1>
</div>
<p className="tru-hero-subheadline-refined tru-subheadline-animated">
  Moving. The Way Its Supposed To Be
</p>
```

### File: `src/index.css`

**1. Reduce padding on the backdrop (line 25907):**

Make the backdrop fit more snugly around just the headline:

```css
/* From */
padding: 20px 36px 24px;

/* To */
padding: 12px 28px 14px;
```

**2. Add styling adjustments for the now-external subtitle:**

Ensure the subtitle (now outside the backdrop) has proper spacing and visibility:

```css
/* Add new styles for standalone subtitle */
.tru-hero-subheadline-refined.tru-subheadline-animated {
  margin-top: 12px;
  /* existing styles continue to work */
}
```

---

## Visual Result

| Element | Before | After |
|---------|--------|-------|
| Backdrop covers | Headline + Subtitle | Headline only |
| Backdrop padding | `20px 36px 24px` | `12px 28px 14px` |
| Subtitle position | Inside backdrop | Below backdrop, standalone |

The backdrop will now match the approximate size of the red box in your screenshot - just around the logo and "A Smarter Way To Move" headline.

