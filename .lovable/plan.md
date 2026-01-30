

# Multi-Part Update: Chat Label, Carousel Cards & Animation Fix

## Overview
This plan addresses four related issues: updating the floating chat secondary label, making carousel cards smaller to fit 3 per view with legible fonts, fixing the jerky carousel animation, and correcting the "TruDy" capitalization.

---

## Changes

### 1. Update Floating Chat Label
**File:** `src/components/FloatingTruckChat.tsx`

Change the secondary label from "Ask Me Anything" to "Here to Help".

**Line 92:**
```tsx
// From:
<span className="text-xs leading-tight text-primary font-semibold">Ask Me Anything</span>

// To:
<span className="text-xs leading-tight text-primary font-semibold">Here to Help</span>
```

---

### 2. Fix "TruDy" → "Trudy" Capitalization
**File:** `src/pages/Index.tsx`

**Line 1323:**
```tsx
// From:
{ title: "TruDy AI Assistant", desc: "Your virtual moving assistant, available 24/7.", ...

// To:
{ title: "Trudy AI Assistant", desc: "Your virtual moving assistant, available 24/7.", ...
```

---

### 3. Make Carousel Show 3 Cards with Larger Fonts
**File:** `src/pages/Index.tsx`

Change from `basis-1/2` (2 cards) to `basis-1/3` (3 cards).

**Line 1325:**
```tsx
// From:
<CarouselItem key={index} className="tru-why-carousel-item basis-1/2">

// To:
<CarouselItem key={index} className="tru-why-carousel-item basis-1/3">
```

**File:** `src/index.css`

Increase font sizes for better legibility at the smaller card size:

**Lines 25449-25461:**
```css
/* Title: 10px → 11px */
.tru-why-carousel-card-title {
  font-size: 11px;
  font-weight: 700;
  color: hsl(var(--foreground));
  margin: 0 0 2px 0;
}

/* Description: 8px → 9px */
.tru-why-carousel-card-desc {
  font-size: 9px;
  font-weight: 400;
  color: hsl(var(--muted-foreground));
  line-height: 1.3;
  margin: 0;
}
```

---

### 4. Fix Carousel Animation (Remove Conflicting CSS Transition)
**File:** `src/index.css`

The jerky "shift slide" is caused by CSS transitions conflicting with Embla's JavaScript-based scrolling. Remove the problematic transition.

**Lines 25413-25415 - Remove entirely:**
```css
/* DELETE THIS: */
.tru-why-carousel-content > div {
  transition: transform 0.5s ease-out;
}
```

Also update the carousel item transition to be smoother:

**Line 25420:**
```css
/* From: */
transition: opacity 0.4s ease, transform 0.4s ease;

/* To: */
transition: opacity 0.3s ease;
```

---

## Summary of Files Modified

| File | Changes |
|------|---------|
| `src/components/FloatingTruckChat.tsx` | Label: "Ask Me Anything" → "Here to Help" |
| `src/pages/Index.tsx` | "TruDy" → "Trudy", `basis-1/2` → `basis-1/3` |
| `src/index.css` | Remove conflicting transition, increase fonts |

