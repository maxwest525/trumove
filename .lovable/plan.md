

# Smoother Carousel Rotation

## Overview
The "Why TruMove?" carousel currently rotates with the default Embla Carousel transition speed, which can feel abrupt. We'll configure smoother animation parameters.

---

## Changes

### 1. Add Smooth Duration to Carousel Config
**File:** `src/pages/Index.tsx` (line 1262)

Add `duration` option to the Embla carousel configuration for a smoother slide transition:

```tsx
// FROM:
opts={{ align: "start", loop: true }}

// TO:
opts={{ align: "start", loop: true, duration: 35 }}
```

The `duration` value (in scroll animation speed factor) of 35 creates a smoother, more elegant transition between slides. Higher values = slower/smoother animations (default is around 25).

---

### 2. Enhance CSS Transition Smoothness
**File:** `src/index.css` (line 25467-25469)

Add CSS transition to the carousel content for additional smoothness:

```css
/* FROM: */
.tru-why-carousel-content {
  margin-left: 0;
}

/* TO: */
.tru-why-carousel-content {
  margin-left: 0;
  transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

---

### 3. Smooth Out Item Transitions
**File:** `src/index.css` (line 25471-25477)

Enhance the carousel item transition for opacity and transforms:

```css
/* FROM: */
.tru-why-carousel-item {
  padding-left: 4px;
  padding-right: 4px;
  position: relative;
  z-index: 1;
  transition: opacity 0.3s ease, z-index 0s 0.2s;
}

/* TO: */
.tru-why-carousel-item {
  padding-left: 4px;
  padding-right: 4px;
  position: relative;
  z-index: 1;
  transition: opacity 0.5s ease-out, z-index 0s 0.3s, transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

---

## Summary

| Task | File | Change |
|------|------|--------|
| Embla duration config | `src/pages/Index.tsx` | Add `duration: 35` for smoother scroll |
| Content CSS transition | `src/index.css` | Add 0.5s cubic-bezier transform transition |
| Item CSS transitions | `src/index.css` | Enhance opacity/transform transitions |

## Visual Result
- Carousel slides will glide smoothly between cards instead of snapping
- The 35 duration factor creates an elegant, professional-feeling animation
- CSS transitions add additional polish to opacity and transform changes

