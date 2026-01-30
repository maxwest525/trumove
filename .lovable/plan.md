

# Fix Carousel Preview Card Sizing - Show Only 4 Cards

## Problem Analysis

The carousel currently has conflicting sizing rules:

1. **In JSX (`FeatureCarousel.tsx` line 153)**: `basis-1/2 md:basis-1/4` - shows 2 cards by default, 4 on md+
2. **In CSS (`index.css` line 16708)**: `flex: 0 0 25% !important` - forces 25% width (4 cards)

The CSS `!important` rule should override the Tailwind classes, but there may be specificity issues or the Tailwind classes are being applied after. Additionally, the padding on items (`padding: 0 8px`) affects the visible card width.

---

## Solution

Ensure consistent 4-card display by:
1. Updating the JSX to use `basis-1/4` only (remove `basis-1/2`)
2. Confirming the CSS properly enforces 25% width for 4 visible cards

---

## Implementation

### File: `src/components/FeatureCarousel.tsx`

**Line 153 - Remove the mobile-first 2-card sizing:**

```tsx
// Before:
<CarouselItem key={index} className="features-carousel-item basis-1/2 md:basis-1/4">

// After:
<CarouselItem key={index} className="features-carousel-item">
```

The CSS class `.features-carousel-item` already handles the sizing with `flex: 0 0 25% !important`, and the responsive breakpoints in CSS handle tablet/mobile sizing correctly. Removing the Tailwind basis classes eliminates any potential conflict.

---

## Technical Summary

| File | Line | Change |
|------|------|--------|
| `src/components/FeatureCarousel.tsx` | 153 | Remove `basis-1/2 md:basis-1/4` from className |

---

## Design Notes

- **Desktop (1280px+)**: 4 cards visible (25% each via CSS)
- **Large tablet (1024-1279px)**: 3 cards visible (33.333% via CSS media query)
- **Tablet (641-1024px)**: 2 cards visible (50% via CSS media query)
- **Mobile (≤640px)**: 1 card visible (100% via CSS media query)

The CSS already has proper responsive breakpoints at lines 16890-16930. By removing the conflicting Tailwind classes, the CSS rules will apply cleanly without any specificity battles.

---

## Expected Result

- Exactly 4 cards visible at a time on desktop screens
- Smooth responsive behavior as screen size decreases
- No conflicting sizing rules between Tailwind and custom CSS

