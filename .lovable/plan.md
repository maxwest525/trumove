
# Fix Carousel Card Spacing, Add Fade Gradient, and Fix Blurry Font

## Problems Identified

1. **Inconsistent Gap Spacing**: The Embla carousel component (`carousel.tsx`) has hardcoded Tailwind classes:
   - `CarouselContent` applies `-ml-4` (negative 16px margin-left)
   - `CarouselItem` applies `pl-4` (16px padding-left)
   
   These conflict with our CSS overrides. Even with `!important`, the combination of Tailwind's `pl-4` padding and our `gap: 16px` creates double-spacing issues.

2. **No Fade Gradient**: Need a subtle fade on the right edge to hint at more cards.

3. **Blurry Font**: Likely caused by subpixel rendering or transform artifacts.

---

## Solution Overview

| Issue | Fix |
|-------|-----|
| Inconsistent gaps | Modify `carousel.tsx` to not apply default spacing when custom classes are used |
| Fade gradient | Add a `::after` pseudo-element with gradient overlay |
| Blurry fonts | Add `-webkit-font-smoothing` and `text-rendering` properties |

---

## Files to Modify

### 1. `src/components/ui/carousel.tsx`

**Problem**: Lines 142 and 160 apply hardcoded Tailwind spacing classes that conflict with our custom CSS.

**Solution**: Update `CarouselContent` and `CarouselItem` to check for custom classes and skip default spacing.

**Changes at Line 142** (CarouselContent):
```tsx
// Before:
className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}

// After - only apply default margin if no custom class overrides it:
className={cn("flex", orientation === "horizontal" && !className?.includes('features-carousel') ? "-ml-4" : "", orientation === "vertical" ? "-mt-4 flex-col" : "", className)}
```

**Changes at Line 160** (CarouselItem):
```tsx
// Before:
className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}

// After - skip default padding if custom class provided:
className={cn("min-w-0 shrink-0 grow-0", orientation === "horizontal" && !className?.includes('features-carousel') ? "pl-4 basis-full" : "", orientation === "vertical" ? "pt-4" : "", className)}
```

---

### 2. `src/index.css` - Carousel Fixes

**Add fade gradient overlay** (new rule after `.features-carousel-container`):

```css
/* Fade gradient on right edge to hint at more cards */
.features-carousel-container::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 60px;
  background: linear-gradient(to right, transparent, hsl(var(--background) / 0.8));
  pointer-events: none;
  z-index: 5;
}
```

**Fix font blurriness** (add to `.features-carousel-card` around line 14741):

```css
.features-carousel-card {
  /* ...existing styles... */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

**Remove conflicting padding/margin overrides** from `.features-carousel-item` (simplify):

```css
.features-carousel-item {
  flex: 0 0 calc((100% - 48px) / 4) !important;
  min-width: 0;
  padding-left: 0 !important;  /* Explicitly target pl-4 */
  margin: 0;
}
```

---

## Detailed Line-by-Line Changes

### `src/components/ui/carousel.tsx`

| Line | Current | New |
|------|---------|-----|
| 142 | `className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}` | `className={cn("flex", orientation === "vertical" && "-mt-4 flex-col", className)}` |
| 160 | `className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}` | `className={cn("min-w-0 shrink-0 grow-0", orientation === "vertical" && "pt-4", className)}` |

The cleanest fix is to simply **remove the horizontal spacing defaults** from the shared component and let the CSS handle it. Vertical orientation keeps its defaults.

---

### `src/index.css` (around lines 14716-14740)

**Updated `.features-carousel-container`:**
```css
.features-carousel-container {
  width: 100%;
  max-width: 100%;
  padding: 0;
  position: relative;
  overflow: hidden;
}

/* Fade gradient on right edge */
.features-carousel-container::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 48px;
  background: linear-gradient(to right, transparent, hsl(var(--background)));
  pointer-events: none;
  z-index: 5;
}
```

**Updated `.features-carousel-content`:**
```css
.features-carousel-content {
  display: flex;
  gap: 16px;
  padding: 8px 0;
}
```

**Updated `.features-carousel-item`:**
```css
.features-carousel-item {
  flex: 0 0 calc((100% - 48px) / 4) !important;
  min-width: 0;
}
```

**Updated `.features-carousel-card`:**
```css
.features-carousel-card {
  /* ...existing styles... */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

---

## Summary of All Changes

| File | Lines | Change |
|------|-------|--------|
| `carousel.tsx` | 142 | Remove `-ml-4` for horizontal orientation |
| `carousel.tsx` | 160 | Remove `pl-4` and `basis-full` for horizontal orientation |
| `index.css` | 14716-14717 | Add `::after` gradient for fade effect |
| `index.css` | 14720-14726 | Simplify content styles (no !important needed) |
| `index.css` | 14731-14738 | Simplify item styles |
| `index.css` | 14741-14758 | Add font smoothing properties |

---

## Expected Results

1. **Consistent 16px gaps** between all 4 visible cards
2. **Subtle fade gradient** on right edge hinting at more content
3. **Crisp, non-blurry fonts** on card titles and descriptions
4. **No cards touching or having variable spacing**
5. **No card borders being cut off**
