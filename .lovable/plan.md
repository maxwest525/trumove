

# Remove Arrows from Feature Carousel

## Overview
Remove the previous/next arrow navigation buttons from the feature carousel, keeping only the auto-scroll and drag functionality.

---

## Current State

In `src/components/FeatureCarousel.tsx` (lines 120-121):

```tsx
<CarouselPrevious className="features-carousel-prev" />
<CarouselNext className="features-carousel-next" />
```

These render the left/right arrow buttons on the carousel.

---

## Solution

Simply remove both arrow components from the JSX.

**File: `src/components/FeatureCarousel.tsx`**

Delete lines 120-121:

```tsx
// Remove these two lines:
<CarouselPrevious className="features-carousel-prev" />
<CarouselNext className="features-carousel-next" />
```

---

## Result

The carousel will still function via:
- Auto-scroll (4 second intervals)
- Mouse/touch drag
- Keyboard navigation (arrow keys when focused)

Only the visible arrow buttons will be removed.

