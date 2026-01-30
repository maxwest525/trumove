
# Fix Carousel to Show Exactly 4 Cards - No 5th Card Visible

## Problem Analysis

Looking at your screenshot, the 5th card ("TruMove Specialist") is peeking through on the right side. This happens because:

1. **Container padding**: `.features-carousel-content` has `padding: 8px 24px 8px 8px` (24px on right)
2. **Item padding**: Each `.features-carousel-item` has `padding: 0 8px` for spacing between cards
3. **25% width calculation**: The `flex: 0 0 25%` is calculated on the container width, but the combined padding creates space for a 5th card to peek through

## Solution

Adjust the item width calculation to account for the total padding, ensuring exactly 4 cards fit with no overflow:

### Option 1: Use calc() for precise sizing (Recommended)
Calculate the exact width accounting for padding: `calc(25% - 4px)` or similar adjustment

### Option 2: Add overflow:hidden to carousel container
Add `overflow-x: clip` to the parent container (not `hidden` which would break hover effects)

---

## Implementation

### File: `src/index.css`

**Lines 16706-16719 - Adjust item width:**

```css
/* 4 cards visible - exact 25% with padding accounted for */
.features-carousel-item {
  flex: 0 0 calc(25% - 4px) !important;  /* Reduced to prevent 5th card peek */
  min-width: 0;
  padding: 0 8px !important;
  margin: 0 !important;
  position: relative;
  overflow: visible !important;
  box-sizing: border-box;
  z-index: 1;
  /* Scroll snap point */
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

**Lines 16696-16704 - Also adjust content padding:**

```css
.features-carousel-content {
  display: flex;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 8px 0 8px 8px;  /* Remove right padding - let cards fill space */
  /* Smooth scroll snap enhancement */
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
```

**Additionally, update responsive breakpoints (lines 16890-16894, 16897-16900, 16912-16916):**

```css
/* Responsive: 3 cards on large tablet */
@media (max-width: 1279px) {
  .features-carousel-item {
    flex: 0 0 calc(33.333% - 4px) !important;
  }
}

/* Responsive: 2 cards on tablet */
@media (max-width: 1024px) {
  .features-carousel-item {
    flex: 0 0 calc(50% - 4px) !important;
  }
}

/* Responsive: 1 card on mobile */
@media (max-width: 640px) {
  .features-carousel-item {
    flex: 0 0 calc(100% - 4px) !important;
    padding: 0 4px !important;
  }
}
```

---

## Technical Summary

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 16700 | Remove right padding: `padding: 8px 0 8px 8px` |
| `src/index.css` | 16708 | Use calc: `flex: 0 0 calc(25% - 4px)` |
| `src/index.css` | 16892 | Update tablet: `flex: 0 0 calc(33.333% - 4px)` |
| `src/index.css` | 16899 | Update tablet: `flex: 0 0 calc(50% - 4px)` |
| `src/index.css` | 16914 | Update mobile: `flex: 0 0 calc(100% - 4px)` |

---

## Expected Result

- Exactly 4 cards visible on desktop with no 5th card peeking through
- Proper responsive behavior at all breakpoints (3 cards → 2 cards → 1 card)
- Hover pop-out effects still work correctly
- Smooth scroll snap behavior maintained
