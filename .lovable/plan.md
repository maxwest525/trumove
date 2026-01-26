
# Feature Carousel Redesign - Image-Forward, Near-Square Cards

## Overview
Complete refactoring of the feature carousel to create image-forward, near-square cards where preview images are the visual focus and never cropped. This update affects ONLY the carousel section - no changes to the main form or other page elements.

## Current State Analysis

### Current Issues Identified
1. **Cards are too rectangular** - Current `min-height: 200px` with `max-height: 100px` for images creates a text-heavy layout
2. **Images are cropped/clipped** - `object-fit: cover` and `max-height: 100px` constraints cut off image content
3. **`overflow: hidden`** on cards clips previews
4. **Image height is constrained** - Images only get 40-50% of card space, should be 60-70%
5. **No center card emphasis** - All cards appear the same, no active slide visual hierarchy
6. **Autoplay runs by default** - Should be disabled per requirements

### Files to Modify
- `src/components/FeatureCarousel.tsx` - Component logic
- `src/index.css` - All carousel-specific CSS (lines ~14650-14960)

---

## Implementation Plan

### 1. Update Carousel Options (FeatureCarousel.tsx)

**Changes:**
- Change `align: "start"` to `align: "center"` for center-focused carousel
- Remove autoplay effect entirely (delete the `useEffect` that handles autoplay)
- Add active slide tracking for center card emphasis
- Add `data-active` attribute to enable CSS-based emphasis on center card

### 2. Card Structure Redesign (FeatureCarousel.tsx)

**New card HTML structure:**
```text
.features-carousel-card (near-square container)
  .features-carousel-card-header (30-40% height)
    .features-carousel-card-icon
    .features-carousel-card-text
      h3.features-carousel-card-title
      p.features-carousel-card-desc
  .features-carousel-card-image-wrapper (60-70% height, fixed)
    img (object-fit: contain, centered)
```

### 3. CSS Refactoring (index.css)

#### A. Container Scoping
All new styles scoped under `.features-carousel` wrapper to prevent conflicts with legacy code.

#### B. Card Dimensions - Near-Square (5:4 Ratio)
```text
Desktop:
- Card width: ~400px (calculated from 3-card layout with gaps)
- Card height: 320px (fixed)
- Aspect ratio: ~5:4

Mobile:
- Card width: 100% (1 card visible)
- Card height: 320px (maintain proportions)
```

#### C. Content Distribution
```text
Card Total Height: 320px
  - Header Section: 100-120px (~35%)
  - Image Wrapper: 180-200px (~60%)
  - Padding: ~20px (~5%)
```

#### D. Image Container Fix
```css
/* Fixed-height image wrapper */
.features-carousel-card-image-wrapper {
  height: 180px; /* Fixed, never changes */
  background: hsl(var(--muted) / 0.3); /* Subtle neutral fill */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible; /* Prevent clipping */
}

/* Image must be fully visible */
.features-carousel-card-image-wrapper img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain; /* Never crop */
}
```

#### E. Center Card Emphasis
```css
.features-carousel-card[data-active="true"] {
  transform: scale(1.03);
  box-shadow: 0 8px 32px hsl(var(--tm-ink) / 0.12);
  z-index: 5;
}

.features-carousel-card[data-active="false"] {
  transform: scale(0.97);
  opacity: 0.85;
}
```

#### F. Typography Rules
```css
/* Headline: 1-2 lines max */
.features-carousel-card-title {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Subheadline: 1-2 lines max */
.features-carousel-card-desc {
  font-size: 0.875rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 4. Carousel Layout Behavior

#### Desktop (3 cards with peek)
```css
.features-carousel-item {
  flex: 0 0 calc(33.333% - 16px);
  /* Center card fully visible, sides peek */
}
```

#### Tablet (2 cards)
```css
@media (max-width: 1024px) {
  .features-carousel-item {
    flex: 0 0 calc(50% - 12px);
  }
}
```

#### Mobile (1 card, swipeable)
```css
@media (max-width: 640px) {
  .features-carousel-item {
    flex: 0 0 100%;
  }
  .features-carousel-card {
    height: 320px; /* Maintain near-square */
  }
}
```

### 5. Override/Remove Legacy Conflicts

The following existing rules will be overridden or reset:

| Existing Rule | Problem | Fix |
|---------------|---------|-----|
| `.tru-value-card-carousel { overflow: hidden }` | Clips images | Set `overflow: visible` |
| `.tru-value-card-carousel-preview { max-height: 100px }` | Constrains images | Remove constraint |
| `.tru-preview-always-visible { max-height: 100px }` | Limits image area | Set fixed height 180px |
| `img { object-fit: cover }` | Crops images | Use `object-fit: contain` |
| Legacy `.tru-value-card-icon` styles | Conflicting rules | Scope new rules higher |

### 6. Autoplay Disabled

Remove the autoplay `useEffect` hook entirely from `FeatureCarousel.tsx`:
```tsx
// DELETE this entire block:
useEffect(() => {
  if (!api || isPaused) return;
  const interval = setInterval(() => {
    api.scrollNext();
  }, autoplayInterval);
  return () => clearInterval(interval);
}, [api, isPaused, autoplayInterval]);
```

---

## Visual Reference

```text
Desktop Layout (3 cards, center emphasized):

     [  Card 1  ]  [  CARD 2  ]  [  Card 3  ]
        0.97x       1.03x scale     0.97x
       opacity        active       opacity
        0.85                         0.85

Single Card Structure:
┌────────────────────────────┐
│ [●] Title Here             │  ← Header 35%
│     Short description...   │
├────────────────────────────┤
│                            │
│     ┌──────────────┐       │  ← Image 60%
│     │   Preview    │       │     (object-fit: contain)
│     │    Image     │       │
│     └──────────────┘       │
│                            │
└────────────────────────────┘
```

---

## Technical Summary

### Files Modified
1. **`src/components/FeatureCarousel.tsx`**
   - Change carousel alignment to center
   - Remove autoplay logic
   - Add active slide tracking
   - Update class names to new scoped structure

2. **`src/index.css`**
   - Add new `.features-carousel` scoped styles
   - Define fixed card height (320px)
   - Fixed image wrapper height (180px)
   - Set `object-fit: contain` on images
   - Add center card scale/shadow emphasis
   - Typography clamping rules
   - Responsive breakpoints for tablet/mobile
   - Override legacy conflicting rules

### Key CSS Properties
- Card: `height: 320px` (fixed)
- Image wrapper: `height: 180px` (fixed)
- Image: `object-fit: contain` (never crop)
- Center emphasis: `scale(1.03)` with enhanced shadow
- Non-active cards: `scale(0.97)` with reduced opacity
