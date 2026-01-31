

# Make Hero Underglow Shadows More Intense

## Overview
Increase the opacity values on all hero text shadows to create a more dramatic, visible dark underglow effect.

---

## Current State

The headline and subheadline currently use these shadow values:

| Element | Current Opacity Levels |
|---------|----------------------|
| `.tru-hero-headline-main` | 0.5, 0.35, 0.25 |
| `.tru-hero-subheadline-refined` | 0.5, 0.35, 0.25 |
| `.tru-hero-subheadline` | 0.35, 0.2 |
| `.tru-headline-animated` | 0.7, 0.5 |

---

## Changes Required

### 1. Intensify Headline Shadow
**File: `src/index.css` (Lines 1443-1449)**

Increase opacity to near-maximum levels:

```css
/* Before */
.tru-hero-headline-main {
  text-shadow: 
    0 2px 4px hsl(0 0% 0% / 0.5),
    0 4px 12px hsl(0 0% 0% / 0.35),
    0 8px 24px hsl(0 0% 0% / 0.25);
}

/* After */
.tru-hero-headline-main {
  text-shadow: 
    0 2px 4px hsl(0 0% 0% / 0.7),
    0 4px 12px hsl(0 0% 0% / 0.5),
    0 8px 24px hsl(0 0% 0% / 0.35);
}
```

### 2. Intensify Subheadline Shadow
**File: `src/index.css` (Lines 1754-1761)**

```css
/* Before */
.tru-hero-subheadline {
  text-shadow: 
    0 1px 3px hsl(0 0% 0% / 0.35),
    0 3px 8px hsl(0 0% 0% / 0.2);
}

/* After */
.tru-hero-subheadline {
  text-shadow: 
    0 2px 4px hsl(0 0% 0% / 0.6),
    0 4px 12px hsl(0 0% 0% / 0.4),
    0 8px 20px hsl(0 0% 0% / 0.25);
}
```

### 3. Intensify Refined Subheadline ("Moving. The Way Its Supposed To Be")
**File: `src/index.css` (Lines 26369-26382)**

```css
/* Before */
.tru-hero-subheadline-refined {
  text-shadow: 
    0 2px 4px hsl(0 0% 0% / 0.5),
    0 4px 16px hsl(0 0% 0% / 0.35),
    0 8px 24px hsl(0 0% 0% / 0.25);
}

/* After */
.tru-hero-subheadline-refined {
  text-shadow: 
    0 2px 4px hsl(0 0% 0% / 0.7),
    0 4px 16px hsl(0 0% 0% / 0.5),
    0 8px 24px hsl(0 0% 0% / 0.35);
}
```

---

## Technical Summary

| Element | Before | After |
|---------|--------|-------|
| Headline | 0.5 / 0.35 / 0.25 | 0.7 / 0.5 / 0.35 |
| Subheadline | 0.35 / 0.2 | 0.6 / 0.4 / 0.25 (3 layers) |
| Refined Subheadline | 0.5 / 0.35 / 0.25 | 0.7 / 0.5 / 0.35 |

The increased opacity values (up to 70%) will create a much more pronounced dark underglow effect while maintaining smooth layering for a natural shadow appearance.

---

### Files Modified
- `src/index.css` - Update all hero text shadow opacity values

