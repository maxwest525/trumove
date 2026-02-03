
## Plan: Fix Feature Carousel to Show Exactly 4 Cards Without Edge Cut-offs

### Problem
The feature carousel in the "Why TruMove" section shows partial/cut-off cards on the left and right edges. Cards are peeking outside the carousel container bounds.

### Root Cause
- The carousel has `overflow: visible` forced on all container elements (`.features-carousel`, `.features-carousel-container`, `.features-carousel-content`)
- The `CarouselContent` component is using `allowOverflow={true}` which removes the `overflow-hidden` wrapper
- Card hover effects use `scale(1.22)` which was the original reason for allowing overflow, but this causes cards at edges to be partially visible

### Solution
Restructure the carousel to clip content at container edges while still allowing hover effects to work within the visible area. This involves:

1. **Update FeatureCarousel.tsx**
   - Remove `allowOverflow` prop from `CarouselContent` to restore default clipping behavior
   - Add a dedicated container with proper overflow handling

2. **Update index.css carousel styles**
   - Remove `overflow: visible !important` from carousel containers
   - Add `overflow: hidden` to the main container to clip cards at boundaries
   - Adjust inner container to allow cards room for hover scaling within visible bounds
   - Add small internal padding so hover effects have room to breathe without breaking container edges

### Technical Details

**FeatureCarousel.tsx changes:**
```tsx
// Change from:
<CarouselContent className="features-carousel-content" allowOverflow>

// To:
<CarouselContent className="features-carousel-content">
```

**index.css changes:**
```css
/* Container clips content at edges */
.features-carousel {
  overflow: hidden;  /* Clip cards at boundaries */
  padding: 16px 0;   /* Internal breathing room for hover effects */
}

/* Remove the forced overflow: visible */
.features-carousel,
.features-carousel-container,
.features-carousel-content {
  /* Remove: overflow: visible !important; */
}

/* Reduce hover scale slightly so it doesn't feel cramped */
.features-carousel-card:hover {
  transform: scale(1.12) translateZ(0);  /* Reduced from 1.22 */
}

/* Ensure card sizing fills exactly 4 slots */
.features-carousel-item {
  flex: 0 0 25% !important;  /* Clean 25% for 4 cards */
  padding: 0 6px !important; /* Smaller gap between cards */
}
```

### Expected Result
- Exactly 4 cards visible at any time
- No partial cards visible at left or right edges
- Cards still scale up on hover but stay within the container bounds
- Smooth scrolling/rotation continues to work with autoplay
