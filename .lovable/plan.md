
# Add Smooth Scroll Snap Behavior to Feature Carousel

## Goal

Enhance the feature carousel with smoother, more refined scroll snap behavior that feels premium and responsive.

---

## Current State

The carousel uses Embla Carousel with these options:
```javascript
opts={{ align: "start", loop: true, dragFree: false, duration: 30, skipSnaps: false }}
```

- `dragFree: false` - Already snaps to slides
- `skipSnaps: false` - Doesn't skip snap points during fast scrolling
- `duration: 30` - Animation duration (relatively fast)

---

## Implementation

### 1. Enhance Embla Options (FeatureCarousel.tsx)

Update the carousel options for smoother snapping:

| Option | Current | New | Effect |
|--------|---------|-----|--------|
| `duration` | 30 | 25 | Slightly faster snap animation for snappier feel |
| `dragThreshold` | (default) | 10 | Lower threshold for more responsive drag detection |
| `inViewThreshold` | (default) | 0.7 | Cards become "active" when 70% visible |

### 2. Add CSS Scroll Snap Properties (index.css)

Add native CSS scroll snap as a progressive enhancement for touch devices:

```css
/* Scroll snap enhancement */
.features-carousel-container {
  scroll-behavior: smooth;
}

.features-carousel-content {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.features-carousel-item {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

### 3. Add Smooth Deceleration Animation (index.css)

Add a subtle animation class that Embla applies during settling:

```css
/* Smooth scroll deceleration */
.features-carousel-content {
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

---

## Technical Details

### File Changes

| File | Change |
|------|--------|
| `src/components/FeatureCarousel.tsx` | Update Embla opts with refined duration and thresholds |
| `src/index.css` | Add CSS scroll-snap properties and smooth transitions |

### Embla + CSS Scroll Snap

Embla Carousel handles its own snapping via JavaScript transforms, but adding CSS scroll-snap properties provides:
- Native momentum scrolling on touch devices
- Fallback behavior if JavaScript is delayed
- Smoother feel on mobile Safari/iOS

---

## Summary of Changes

### File: `src/components/FeatureCarousel.tsx`

**Line 140**: Update carousel options

```javascript
// Before
opts={{ align: "start", loop: true, dragFree: false, duration: 30, skipSnaps: false }}

// After
opts={{ 
  align: "start", 
  loop: true, 
  dragFree: false, 
  duration: 25, 
  skipSnaps: false,
  dragThreshold: 10,
  inViewThreshold: 0.7
}}
```

### File: `src/index.css`

**After line 16682** (inside `.features-carousel-content`): Add scroll snap and smooth transition

```css
.features-carousel-content {
  display: flex;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 8px 24px 8px 8px;
  /* Smooth scroll snap enhancement */
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
```

**After line 16693** (inside `.features-carousel-item`): Add scroll snap alignment

```css
.features-carousel-item {
  flex: 0 0 25% !important;
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

---

## Expected Result

- Cards snap smoothly to position with refined animation timing
- Touch scrolling feels native with momentum deceleration
- Faster, more responsive drag detection
- Cards register as "active" sooner for better visual feedback
- Mobile experience enhanced with native scroll-snap fallback
