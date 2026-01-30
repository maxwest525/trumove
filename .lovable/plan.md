
# Fix Invisible Hero Headline

## Problem Analysis
The hero headline "TruMove A Smarter Way To Move" is invisible because:

1. **Color conflict**: The `.tru-headline-animated` class applies `-webkit-text-fill-color: transparent` with a white/green gradient
2. **Light background**: The hero shows a bright house image, making white text invisible
3. **Insufficient backdrop**: The dark gradient backdrop behind the header is too subtle (35% to 15% opacity)

Looking at the reference image you provided, the headline needs a **dark background** behind it to make the white/green shimmer text visible.

---

## Solution
Make the hero header section have a stronger dark backdrop so the white/green gradient text is visible. Also ensure the text colors provide enough contrast.

---

## Changes

### 1. Strengthen Header Backdrop
**File:** `src/index.css` (lines 25225-25236)

The current backdrop is too subtle at 35%→15% opacity. Increase it significantly:

```css
.tru-hero-header-section.tru-hero-header-refined::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    hsl(0 0% 0% / 0.75) 0%,
    hsl(0 0% 0% / 0.55) 100%
  );
  border-radius: 16px;
  z-index: -1;
  backdrop-filter: blur(8px);
}
```

### 2. Ensure Headline Text Has Proper Contrast
**File:** `src/index.css` (lines 25287-25302)

The shimmer gradient is correct but needs a stronger drop-shadow for edge definition:

```css
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
  filter: drop-shadow(0 2px 12px hsl(0 0% 0% / 0.6)) drop-shadow(0 4px 20px hsl(0 0% 0% / 0.4));
}
```

### 3. Increase Subheadline Visibility  
**File:** `src/index.css` (lines 25275-25284)

Ensure the subheadline has strong contrast:

```css
.tru-hero-subheadline-refined {
  font-size: clamp(18px, 2.5vw, 26px);
  line-height: 1.5;
  color: hsl(0 0% 100%);
  max-width: 600px;
  margin: 0 auto;
  font-weight: 600;
  text-shadow: 0 2px 16px hsl(0 0% 0% / 0.7), 0 4px 24px hsl(0 0% 0% / 0.5);
  letter-spacing: 0.02em;
}
```

### 4. Add More Padding to Header Section
**File:** `src/index.css` (lines 25218-25223)

Give the backdrop more visual presence:

```css
.tru-hero-header-section.tru-hero-header-refined {
  position: relative;
  padding: 32px 56px 40px;
  text-align: center;
  z-index: 10;
  margin-bottom: 24px;
}
```

---

## Summary

| Change | File | Description |
|--------|------|-------------|
| Stronger backdrop | `src/index.css` | Increase opacity from 35%→75%, add blur |
| Enhanced drop-shadow | `src/index.css` | Stronger shadow on headline text |
| Subheadline contrast | `src/index.css` | White text with heavy shadow |
| More padding | `src/index.css` | Larger backdrop area |

## Visual Result
- The headline "TruMove A Smarter Way To Move" will appear prominently with a semi-transparent dark backdrop
- The white/green shimmer gradient will be clearly visible
- The subheadline "Moving. The Way Its Supposed To Be" will be white and readable
- The backdrop provides consistent readability regardless of the background image brightness
