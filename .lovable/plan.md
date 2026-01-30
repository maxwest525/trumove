

# Make Carousel Image Border More Visible

## Issue
The white border (`2px solid white`) was added to carousel preview images, but it's not visible enough or may be getting clipped by the parent container's `overflow: hidden`.

---

## Current State
```css
.features-carousel-card-image-wrapper img {
  border: 2px solid white;
  box-shadow: 0 2px 8px hsl(var(--tm-ink) / 0.1);
}
```

The border exists but may be:
1. Clipped by the parent wrapper's `overflow: hidden`
2. Too thin to notice (2px)
3. Blending with the image content

---

## Solution

### Option 1: Apply border to the wrapper instead (recommended)

Move the border to the image wrapper so it's not clipped:

**File: `src/index.css` (lines 16738-16747)**

```css
/* From */
.features-carousel-card-image-wrapper {
  flex: 1;
  min-height: 0;
  background: hsl(var(--muted) / 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: auto;
}

/* To */
.features-carousel-card-image-wrapper {
  flex: 1;
  min-height: 0;
  background: hsl(var(--muted) / 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: auto;
  border: 3px solid white;
  box-shadow: 0 2px 12px hsl(var(--tm-ink) / 0.15);
}
```

### Option 2: Remove border from img (cleanup)

**File: `src/index.css` (lines 16750-16759)**

```css
/* From */
.features-carousel-card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  border-radius: 4px;
  transition: transform 0.4s ease;
  border: 2px solid white;
  box-shadow: 0 2px 8px hsl(var(--tm-ink) / 0.1);
}

/* To */
.features-carousel-card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  border-radius: 0;
  transition: transform 0.4s ease;
}
```

---

## Summary

| Change | Effect |
|--------|--------|
| Move border to wrapper | 3px white border visible around entire image area |
| Add stronger shadow | More depth and visual separation |
| Remove inner border/radius | Cleaner look, no clipping issues |

