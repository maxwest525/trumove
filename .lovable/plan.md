

# Increase Shadow Blur Radius for More Dramatic Hero Underglow

## Overview
Increase the blur radius values on all hero text shadows to create a softer, more expansive, and dramatic dark underglow effect.

---

## Current State

| Element | Current Shadow Blur Radii |
|---------|--------------------------|
| `.tru-hero-headline-main` | 4px, 12px, 24px |
| `.tru-hero-subheadline` | 4px, 12px, 20px |
| `.tru-hero-subheadline-refined` | 4px, 16px, 24px |
| `.tru-headline-animated` | 12px, 24px, 40px |

---

## Changes Required

### 1. Increase Headline Blur Radius
**File: `src/index.css` (Lines 1443-1449)**

Double the blur radius for a wider, more dramatic spread:

```css
/* Before */
.tru-hero-headline-main {
  text-shadow: 
    0 2px 4px hsl(0 0% 0% / 0.7),
    0 4px 12px hsl(0 0% 0% / 0.5),
    0 8px 24px hsl(0 0% 0% / 0.35);
}

/* After */
.tru-hero-headline-main {
  text-shadow: 
    0 3px 8px hsl(0 0% 0% / 0.7),
    0 6px 24px hsl(0 0% 0% / 0.5),
    0 12px 48px hsl(0 0% 0% / 0.35);
}
```

### 2. Increase Subheadline Blur Radius
**File: `src/index.css` (Lines 1754-1762)**

```css
/* Before */
.tru-hero-subheadline {
  text-shadow: 
    0 2px 4px hsl(0 0% 0% / 0.6),
    0 4px 12px hsl(0 0% 0% / 0.4),
    0 8px 20px hsl(0 0% 0% / 0.25);
}

/* After */
.tru-hero-subheadline {
  text-shadow: 
    0 3px 8px hsl(0 0% 0% / 0.6),
    0 6px 20px hsl(0 0% 0% / 0.4),
    0 10px 40px hsl(0 0% 0% / 0.25);
}
```

### 3. Increase Refined Subheadline Blur Radius ("Moving. The Way Its Supposed To Be")
**File: `src/index.css` (Lines 26370-26383)**

```css
/* Before */
.tru-hero-subheadline-refined {
  text-shadow: 
    0 2px 4px hsl(0 0% 0% / 0.7),
    0 4px 16px hsl(0 0% 0% / 0.5),
    0 8px 24px hsl(0 0% 0% / 0.35);
}

/* After */
.tru-hero-subheadline-refined {
  text-shadow: 
    0 3px 8px hsl(0 0% 0% / 0.7),
    0 6px 28px hsl(0 0% 0% / 0.5),
    0 12px 48px hsl(0 0% 0% / 0.35);
}
```

### 4. Increase Animated Headline Blur Radius
**File: `src/index.css` (Lines 26386-26393)**

```css
/* Before */
.tru-headline-animated {
  text-shadow: 
    0 2px 12px hsl(0 0% 0% / 0.7),
    0 4px 24px hsl(0 0% 0% / 0.5),
    0 0 40px hsl(142 72% 50% / 0.3);
}

/* After */
.tru-headline-animated {
  text-shadow: 
    0 3px 16px hsl(0 0% 0% / 0.7),
    0 6px 40px hsl(0 0% 0% / 0.5),
    0 0 60px hsl(142 72% 50% / 0.3);
}
```

---

## Technical Summary

| Element | Before (blur) | After (blur) |
|---------|---------------|--------------|
| Headline | 4px / 12px / 24px | 8px / 24px / 48px |
| Subheadline | 4px / 12px / 20px | 8px / 20px / 40px |
| Refined Subheadline | 4px / 16px / 24px | 8px / 28px / 48px |
| Animated Headline | 12px / 24px / 40px | 16px / 40px / 60px |

The increased blur radius values (roughly doubled) combined with slightly increased Y-offsets will create a much wider, softer, and more dramatic underglow that extends further beneath the text.

---

### Files Modified
- `src/index.css` - Update all hero text shadow blur radius values

