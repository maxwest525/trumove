

# Feature Carousel & Quote Headline Improvements

## Overview
This plan addresses four improvements:
1. Update the memory file with the new headline text
2. Add white border/stroke around carousel preview images
3. Make carousel rotation smoother with better animation settings
4. Make "GET YOUR QUOTE NOW!" headline bigger

---

## Changes

### 1. Update Memory File

**File: `.lovable/plan.md`**

Update to reflect the implemented headline change:

```markdown
# Memory: Quote Wizard Headline Update

## Overview
The Step 1 headline in the quote wizard was updated from "Build Your Free Estimate Now!" to "GET YOUR QUOTE NOW!" in all caps.

## Implementation
- File: `src/pages/Index.tsx` (line 1043)
- Class: `.tru-qb-question.tru-qb-question-decorated`
```

---

### 2. White Border on Carousel Images

**File: `src/index.css` (lines 16729-16737)**

Add a white border/stroke to the carousel preview images:

```css
/* From */
.features-carousel-card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  border-radius: 4px;
  transition: transform 0.4s ease;
}

/* To */
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
```

---

### 3. Smoother Carousel Animation

The current carousel uses `dragFree: true` which causes the choppy, erratic movement. We'll update the Embla options for smoother scrolling.

**File: `src/components/FeatureCarousel.tsx` (line 98)**

```tsx
/* From */
opts={{ align: "start", loop: true, dragFree: true }}

/* To */
opts={{ 
  align: "start", 
  loop: true, 
  dragFree: false,
  duration: 30,
  skipSnaps: false
}}
```

| Setting | Effect |
|---------|--------|
| `dragFree: false` | Snaps to slides instead of free-floating |
| `duration: 30` | Smoother, longer animation (higher = slower/smoother) |
| `skipSnaps: false` | Always lands on a slide position |

---

### 4. Bigger "GET YOUR QUOTE NOW!" Headline

**File: `src/index.css` (lines 14404-14414)**

Increase the headline font size:

```css
/* From */
.tru-qb-question {
  font-size: clamp(17px, 2.8vw, 20px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: hsl(var(--tm-ink));
  margin-top: 4px;
  margin-bottom: 4px;
  padding-bottom: 16px;
  text-align: center;
  width: 100%;
}

/* To */
.tru-qb-question {
  font-size: clamp(22px, 3.5vw, 28px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: hsl(var(--tm-ink));
  margin-top: 4px;
  margin-bottom: 4px;
  padding-bottom: 16px;
  text-align: center;
  width: 100%;
}
```

| Property | Before | After |
|----------|--------|-------|
| font-size | 17-20px | 22-28px |
| font-weight | 700 | 800 |
| letter-spacing | -0.01em | -0.02em (tighter) |

---

## Summary

| Change | File | Lines |
|--------|------|-------|
| Memory update | `.lovable/plan.md` | All |
| White image border | `src/index.css` | 16729-16737 |
| Smooth carousel | `src/components/FeatureCarousel.tsx` | 98 |
| Bigger headline | `src/index.css` | 14404-14414 |

