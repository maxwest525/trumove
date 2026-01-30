

# UI Enhancements: Animations, Hover Effects & Form Cleanup

## Overview
Four enhancements based on your feedback:
1. Adjust shimmer animation speed/colors to be more eye-catching
2. Add hover effects to the "Why TruMove?" card
3. Add enlarged modal preview when hovering carousel cards
4. Remove the "Origin / Mileage / Destination" route summary strip from the form

---

## Changes

### 1. Enhance Shimmer Animation
**File:** `src/index.css` (lines 25266-25286)

Make the shimmer faster (2.5s instead of 4s) and use more vibrant green tones:

```css
/* FROM: */
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
  animation: headline-shimmer 4s ease-in-out infinite;
}

/* TO: */
.tru-headline-animated {
  background: linear-gradient(
    90deg,
    hsl(var(--tm-ink)) 0%,
    hsl(142 72% 45%) 20%,
    hsl(var(--tm-ink)) 40%,
    hsl(142 72% 55%) 60%,
    hsl(var(--tm-ink)) 80%,
    hsl(142 72% 45%) 100%
  );
  background-size: 300% 100%;
  animation: headline-shimmer 2.5s ease-in-out infinite;
}
```

---

### 2. Add Hover Effects to "Why TruMove?" Card
**File:** `src/index.css` (after line 25374)

Add a subtle lift, glow, and border highlight on hover:

```css
.tru-why-card-premium {
  /* existing styles... */
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.tru-why-card-premium:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 40px hsl(var(--primary) / 0.15),
    0 4px 16px hsl(var(--tm-ink) / 0.1);
  border: 1px solid hsl(var(--primary) / 0.2);
}
```

---

### 3. Add Enlarged Modal on Carousel Card Hover
**File:** `src/index.css`

Add a CSS-powered enlarged preview that appears on hover:

```css
/* Enlarged modal on hover */
.tru-why-carousel-card {
  position: relative;
}

.tru-why-carousel-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: hsl(var(--tm-ink) / 0);
  border-radius: 8px;
  transition: background 0.2s ease;
  pointer-events: none;
}

.tru-why-carousel-card:hover::after {
  background: hsl(var(--tm-ink) / 0.03);
}

/* Scale up on hover for enlarged effect */
.tru-why-carousel-card:hover {
  transform: scale(1.08) translateY(-4px);
  z-index: 20;
  box-shadow: 
    0 16px 48px hsl(var(--tm-ink) / 0.2),
    0 8px 24px hsl(var(--primary) / 0.1);
  border-color: hsl(var(--primary) / 0.4);
}

/* Ensure proper stacking context */
.tru-why-carousel-item {
  position: relative;
  z-index: 1;
  transition: z-index 0s 0.2s;
}

.tru-why-carousel-item:hover {
  z-index: 20;
  transition: z-index 0s;
}
```

---

### 4. Remove Route Summary Strip from Form
**File:** `src/pages/Index.tsx` (lines 876-926)

Delete the entire "Permanent Route Summary Strip" section:

```tsx
// DELETE THIS ENTIRE BLOCK (lines 876-926):
{/* Permanent Route Summary Strip - Always visible */}
<div className="tru-qb-route-summary tru-qb-route-summary-permanent">
  <div className="tru-qb-route-summary-inner">
    {/* Origin */}
    <div className={`tru-qb-route-summary-item ...`}>
      ...
    </div>
    
    {/* Distance */}
    <div className={`tru-qb-route-summary-distance ...`}>
      ...
    </div>
    
    {/* Destination */}
    <div className={`tru-qb-route-summary-item ...`}>
      ...
    </div>
  </div>
</div>
```

This removes the section shown in your screenshot with "ORIGIN / — mi / DESTINATION".

---

## Summary

| Task | File | Change |
|------|------|--------|
| Faster/brighter shimmer | `src/index.css` | 2.5s animation, more vibrant greens, 300% background |
| Card hover effects | `src/index.css` | Add lift, glow, and border on `.tru-why-card-premium:hover` |
| Enlarged carousel preview | `src/index.css` | Scale 1.08x with shadow on `.tru-why-carousel-card:hover` |
| Remove route summary | `src/pages/Index.tsx` | Delete `tru-qb-route-summary-permanent` div (lines 876-926) |

## Visual Result
- Hero headline shimmer will be faster and more noticeable with brighter green tones
- "Why TruMove?" card will lift up with a green glow when hovered
- Carousel cards will enlarge smoothly on hover, creating an eye-catching modal-like effect
- The form will be cleaner without the Origin/Mileage/Destination strip

