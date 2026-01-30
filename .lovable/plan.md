

# Fix: Feature Carousel Not Rendered on Homepage

## Issue
The `FeatureCarousel.tsx` component with all the requested features (135% hover scaling, click modal, 3px white border) exists but is **never imported or used** on any page.

The homepage (`Index.tsx`) uses a **different inline carousel** with class names `tru-why-carousel-*` that doesn't have these features.

---

## Current State

| Component | Location | Hover Scale | Click Modal | White Border |
|-----------|----------|-------------|-------------|--------------|
| `FeatureCarousel.tsx` | Unused | 135% | Yes | 3px white |
| Inline carousel | `Index.tsx` line 1501 | 8% | No | No |

---

## Solution: Replace Inline Carousel with FeatureCarousel Component

### Step 1: Import FeatureCarousel in Index.tsx

**File: `src/pages/Index.tsx`**

Add import near other component imports (around line 18):

```tsx
import FeatureCarousel from "@/components/FeatureCarousel";
```

### Step 2: Replace Inline Carousel with Component

**File: `src/pages/Index.tsx` (lines 1495-1538)**

Replace the entire inline carousel section:

```tsx
{/* From - inline carousel (lines 1495-1538) */}
<div 
  className="tru-why-inline-carousel"
  onMouseEnter={() => setIsHeroCarouselPaused(true)}
  onMouseLeave={() => setIsHeroCarouselPaused(false)}
>
  <Carousel ... >
    {/* ... inline card mapping ... */}
  </Carousel>
</div>

{/* To - FeatureCarousel component */}
<FeatureCarousel />
```

### Step 3: Clean Up Unused State (Optional)

Since the inline carousel state is no longer needed, remove:
- `heroCarouselApi` state (line 540)
- `isHeroCarouselPaused` state (line 541)
- Auto-cycling effect (lines 543-552)

---

## Alternative: Apply Features to Existing Carousel

If you prefer keeping the inline carousel structure:

### Update CSS for `tru-why-carousel-*`

**File: `src/index.css`**

1. Add white border to card images:
```css
.tru-why-carousel-card-image {
  border: 3px solid white;
  box-shadow: 0 2px 12px hsl(var(--tm-ink) / 0.15);
}
```

2. Increase hover scale:
```css
.tru-why-carousel-card:hover {
  transform: scale(1.35) translateZ(0);
  z-index: 100;
}
```

3. Add overflow visible to containers:
```css
.tru-why-inline-carousel,
.tru-why-carousel,
.tru-why-carousel-content {
  overflow: visible !important;
}

.tru-why-carousel-item {
  overflow: visible !important;
}
```

4. Add modal functionality would require:
   - Adding state for `selectedFeature`
   - Adding Dialog component to Index.tsx
   - Updating click handlers

---

## Recommended Approach

**Use Option 1 (Replace with FeatureCarousel component)** because:
- The component already has all features implemented and tested
- Cleaner code - single source of truth
- Modal functionality already works
- Less code duplication

---

## Summary

| Task | Action |
|------|--------|
| Import FeatureCarousel | Add import to Index.tsx |
| Replace inline carousel | Swap inline JSX for `<FeatureCarousel />` |
| (Optional) Clean up | Remove unused carousel state |

