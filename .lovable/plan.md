
# Reinstate Hero Header with Eye-Catching Visibility

## Problem
The hero headline "TruMove A Smarter Way To Move" is completely invisible. The shimmer animation uses `-webkit-text-fill-color: transparent` which makes the text invisible against the background.

## Current State
- The hero header section exists in `src/pages/Index.tsx` (lines 752-761)
- The headline has class `tru-headline-animated` which applies a gradient shimmer effect
- The CSS uses `background-clip: text` and `-webkit-text-fill-color: transparent` 
- This makes the text invisible because the gradient isn't contrasting enough with the background

## Solution
Fix the shimmer animation to use high-contrast colors that remain visible over the hero background. Add a text-shadow for additional legibility.

---

## Changes

### 1. Fix Shimmer Animation for Visibility
**File:** `src/index.css` (lines 25266-25282)

Replace the current shimmer with a white/green gradient that's visible over dark backgrounds:

```css
/* Eye-catching headline animation - gradient shimmer (visible over hero) */
.tru-headline-animated {
  background: linear-gradient(
    90deg,
    hsl(0 0% 100%) 0%,
    hsl(142 72% 65%) 25%,
    hsl(0 0% 100%) 50%,
    hsl(142 72% 65%) 75%,
    hsl(0 0% 100%) 100%
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: headline-shimmer 2.5s ease-in-out infinite;
  /* Add text shadow for legibility over any background */
  filter: drop-shadow(0 2px 8px hsl(0 0% 0% / 0.4));
}
```

---

### 2. Enhance Subheadline Visibility
**File:** `src/index.css` (lines 25257-25264)

Make the subheadline white with better contrast:

```css
.tru-hero-subheadline-refined {
  font-size: clamp(16px, 2vw, 22px);
  line-height: 1.5;
  color: hsl(0 0% 100% / 0.95);
  max-width: 600px;
  margin: 0 auto;
  font-weight: 500;
  text-shadow: 0 2px 12px hsl(0 0% 0% / 0.5);
  letter-spacing: 0.02em;
}
```

---

### 3. Ensure Header Section Has Proper Z-Index and Background
**File:** `src/index.css` (lines 25218-25222)

Add a subtle dark gradient backdrop behind the header:

```css
.tru-hero-header-section.tru-hero-header-refined {
  position: relative;
  padding: 24px 48px 32px;
  text-align: center;
  z-index: 10;
}

.tru-hero-header-section.tru-hero-header-refined::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    hsl(0 0% 0% / 0.35) 0%,
    hsl(0 0% 0% / 0.15) 100%
  );
  border-radius: 12px;
  z-index: -1;
}
```

---

### 4. Boost Main Headline Styling
**File:** `src/index.css` (lines 25247-25254)

Ensure the headline has proper sizing and prominence:

```css
/* Refined headline - visible and prominent */
.tru-hero-header-refined .tru-hero-headline-main {
  font-size: clamp(36px, 5.5vw, 64px);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
```

---

## Summary

| Task | File | Change |
|------|------|--------|
| Fix shimmer visibility | `src/index.css` | White/green gradient + drop-shadow filter |
| Enhance subheadline | `src/index.css` | White text with text-shadow |
| Add header backdrop | `src/index.css` | Subtle dark gradient behind header |
| Boost headline sizing | `src/index.css` | Larger font, flex layout for centering |

## Visual Result
- Hero headline "TruMove A Smarter Way To Move" will be prominently visible with a white-to-green shimmer
- Subheadline "Moving. The Way Its Supposed To Be" will be white and readable
- Subtle dark backdrop behind the header text ensures readability over any hero image
- The shimmer animation will catch the eye while maintaining legibility
