
# Enhance Hero Header, Update "Why TruMove?" Card & Adjust Carousel

## Overview
Five changes to enhance visual appeal and readability:
1. Add subheader "Moving. The Way Its Supposed To Be" below the main headline
2. Add eye-catching animation/effects to header and subheader
3. Adjust carousel card image aspect ratio for better balance
4. Remove trust strip (FMCSA/Licensed badges) from the card
5. Change card header from "Your Move. Your Terms." to "Why TruMove?"

---

## Changes

### 1. Add Subheader & Eye-Catching Effects to Hero Header
**File:** `src/pages/Index.tsx` (lines 752-758)

Update the hero header section:

```tsx
{/* Hero Header with Headline + Short Subheadline */}
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

### 2. Add Eye-Catching CSS Animations
**File:** `src/index.css`

Add new animation styles for the headline and subheadline:

```css
/* Animated headline - gradient shimmer effect */
.tru-headline-animated {
  background: linear-gradient(
    90deg,
    hsl(var(--tm-ink)) 0%,
    hsl(var(--primary)) 25%,
    hsl(var(--tm-ink)) 50%,
    hsl(var(--primary)) 75%,
    hsl(var(--tm-ink)) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: headline-shimmer 4s ease-in-out infinite;
}

@keyframes headline-shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Subheadline with fade-in and subtle glow */
.tru-subheadline-animated {
  animation: subheadline-fade 1.5s ease-out forwards;
  text-shadow: 0 0 20px hsl(var(--primary) / 0.3);
}

@keyframes subheadline-fade {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

---

### 3. Change Card Header to "Why TruMove?"
**File:** `src/pages/Index.tsx` (line 1291)

```tsx
// FROM:
<h3 className="tru-why-title-premium">
  Your Move. Your Terms.
</h3>

// TO:
<h3 className="tru-why-title-premium">
  Why TruMove?
</h3>
```

---

### 4. Remove Trust Badges from Card
**File:** `src/pages/Index.tsx` (lines 1347-1357)

Delete the entire trust badges section:

```tsx
// DELETE THIS SECTION:
{/* Trust Badges */}
<div className="tru-why-trust-badges">
  <div className="tru-why-trust-badge">
    <CheckCircle className="w-3.5 h-3.5" />
    <span>FMCSA VERIFIED</span>
  </div>
  <div className="tru-why-trust-badge">
    <CheckCircle className="w-3.5 h-3.5" />
    <span>LICENSED BROKER</span>
  </div>
</div>
```

---

### 5. Adjust Carousel Card Image Aspect Ratio
**File:** `src/index.css` (line 25457)

Make images taller for better balance with the larger text:

```css
/* FROM: */
.tru-why-carousel-card-image {
  width: 100%;
  aspect-ratio: 2 / 1;
  overflow: hidden;
  background: hsl(var(--muted));
}

/* TO: */
.tru-why-carousel-card-image {
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: hsl(var(--muted));
}
```

---

## Summary

| Task | File | Change |
|------|------|--------|
| Add subheader | `src/pages/Index.tsx` | Add "Moving. The Way Its Supposed To Be" paragraph |
| Eye-catching effects | `src/index.css` | Gradient shimmer on headline, fade-in glow on subheader |
| Change card header | `src/pages/Index.tsx` | "Your Move. Your Terms." → "Why TruMove?" |
| Remove trust strip | `src/pages/Index.tsx` | Delete `tru-why-trust-badges` div |
| Adjust carousel images | `src/index.css` | Change aspect-ratio from `2/1` to `16/10` |

## Visual Result
- Hero header will have an animated gradient shimmer effect that catches the eye
- New subheader "Moving. The Way Its Supposed To Be" fades in with a subtle green glow
- Carousel card images will be taller (16:10 ratio) to balance with the larger text
- Card title now reads "Why TruMove?" - cleaner and more direct
- Trust badges removed from the card for a cleaner look
