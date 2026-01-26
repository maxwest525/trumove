
# Feature Carousel Update Plan

## Overview
Update the Features Carousel section with a section headline, consistent card sizing (no scaling), proper spacing, 4-card desktop layout, autoplay with hover pause, and fixed image sizing. Also clean up legacy CSS conflicts causing border artifacts.

---

## Files to Modify

1. **`src/components/FeatureCarousel.tsx`** - Component logic
2. **`src/index.css`** - Carousel-specific CSS (lines 14652-15181)
3. **`src/pages/Index.tsx`** - Section wrapper and headline

---

## Implementation Details

### 1. Add Section Headline and Spacing (Index.tsx)

**Changes to make:**
- Update the `.tru-feature-carousel-fullwidth` section to include a headline
- Add "A Smarter Way To Move" as an h2 above the carousel
- Increase margin-top on the section for 64px spacing from form

```text
Section structure:
<section class="tru-feature-carousel-fullwidth">
  <h2 class="features-carousel-headline">A Smarter Way To Move</h2>
  <FeatureCarousel />
</section>
```

---

### 2. Component Updates (FeatureCarousel.tsx)

**A. Remove Center Card Emphasis**
- Remove `data-active` attribute from cards entirely
- All cards remain the same size at all times
- Remove the `current` state tracking (no longer needed for emphasis)

**B. Enable Autoplay with Pause on Hover/Interaction**
- Add autoplay interval of 5 seconds (calm, not distracting)
- Add `isPaused` state to track hover/interaction
- Add `onMouseEnter` and `onMouseLeave` handlers to pause autoplay
- Carousel continues to support arrow clicks and swipes

**C. Carousel Options**
- Change alignment from "center" to "start" for consistent layout
- Keep `loop: true` for infinite scrolling
- Set `dragFree: true` for natural swipe feel

```text
New component state:
- isPaused: boolean (tracks hover state)
- Autoplay useEffect with 5s interval, pauses when isPaused is true
```

---

### 3. CSS Refactoring (index.css)

**A. Section Spacing**
```css
.tru-feature-carousel-fullwidth {
  margin-top: 64px;  /* Increased from current spacing */
  padding-top: 32px;
  padding-bottom: 32px;
}
```

**B. Section Headline Styling**
```css
.features-carousel-headline {
  text-align: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: hsl(var(--foreground));
  margin-bottom: 32px;
}
```

**C. Card Sizing - Smaller, Consistent**
```css
.features-carousel-card {
  height: 280px;  /* Reduced from 320px */
  /* Remove ALL transform/scale rules */
  transform: none !important; /* Override any inherited transforms */
}
```

**D. Remove All Scaling/Emphasis (Critical)**
```css
/* DELETE these rules entirely: */
.features-carousel-card[data-active="true"] { ... }
.features-carousel-card[data-active="false"] { ... }
```

**E. 4-Card Desktop Layout with 24px Gaps**
```css
.features-carousel-content {
  gap: 24px;
}

.features-carousel-item {
  flex: 0 0 calc(25% - 18px); /* 4 cards with 24px gaps */
}
```

**F. Fixed Image Wrapper - Consistent Across All Cards**
```css
.features-carousel-card-image-wrapper {
  height: 150px;        /* Fixed height, same for all */
  width: 100%;
  padding: 8px;         /* Tight padding as requested */
  background: hsl(var(--muted) / 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;     /* Allow controlled cropping */
}

.features-carousel-card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;    /* Fill the container with controlled cropping */
  object-position: center 30%; /* Focus on upper portion */
  border-radius: 4px;
}
```

**G. Clean Up Legacy Conflicts (Critical)**

Remove or override these conflicting legacy styles:

| Legacy Rule | Action |
|-------------|--------|
| `.tru-value-card-carousel { overflow: hidden }` | Scope to `.tru-value-card-carousel` only, not affecting new classes |
| `.tru-value-card-carousel:hover { transform: translateY(-2px) }` | Already scoped to legacy class |
| `.features-carousel-card[data-active]` rules | DELETE entirely |
| Duplicate carousel indicators | Leave legacy `.tru-carousel-dot` but ensure not rendered in new component |

**H. Border Artifact Fix**
```css
.features-carousel-card {
  /* Ensure stable borders with no transform clipping */
  transform: none;
  will-change: auto; /* Prevent compositor layer issues */
  box-sizing: border-box;
}

/* Remove :active scale to prevent border flicker */
.features-carousel-card:active {
  transform: none; /* Was scale(0.99), now stable */
}
```

**I. Responsive Breakpoints**

Desktop (1280px+): 4 cards
```css
.features-carousel-item {
  flex: 0 0 calc(25% - 18px);
}
```

Large Tablet (1024px - 1279px): 3 cards
```css
@media (max-width: 1279px) {
  .features-carousel-item {
    flex: 0 0 calc(33.333% - 16px);
  }
}
```

Tablet (768px - 1023px): 2 cards
```css
@media (max-width: 1024px) {
  .features-carousel-item {
    flex: 0 0 calc(50% - 12px);
  }
}
```

Mobile (below 768px): 1 card
```css
@media (max-width: 640px) {
  .features-carousel-item {
    flex: 0 0 100%;
  }
}
```

---

## Technical Summary

### Files Modified

1. **`src/pages/Index.tsx`**
   - Add h2 headline "A Smarter Way To Move" above FeatureCarousel

2. **`src/components/FeatureCarousel.tsx`**
   - Add autoplay with 5-second interval
   - Add isPaused state and hover handlers for autoplay pause
   - Remove data-active tracking (no center emphasis)
   - Update carousel opts alignment

3. **`src/index.css`**
   - Add `.features-carousel-headline` styles
   - Update `.tru-feature-carousel-fullwidth` with 64px margin-top
   - Change card height to 280px (smaller)
   - Set 4-card desktop layout (25% width)
   - Fixed image wrapper at 150px height with 8px padding
   - Use object-fit: cover for edge-to-edge images
   - DELETE all data-active scaling rules
   - Remove :active transform to prevent border artifacts
   - Keep legacy `.tru-value-*` styles isolated for backwards compatibility
   - Add responsive breakpoints for 3/2/1 cards

### Key Changes Summary

| Aspect | Before | After |
|--------|--------|-------|
| Section headline | None | "A Smarter Way To Move" |
| Spacing from form | ~32px | 64px minimum |
| Desktop cards | 3 with center emphasis | 4, all same size |
| Card gaps | ~24px (inconsistent) | 24px (consistent) |
| Card height | 320px | 280px |
| Image height | 180px | 150px |
| Image fit | object-fit: contain | object-fit: cover |
| Center scaling | scale(1.03) | None |
| Autoplay | OFF | ON (5s, pause on hover) |
| Border artifacts | Present | Fixed (no transforms) |
