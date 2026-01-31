
# Maximize Hero Shadow Drama with 80px Blur Values

## Overview
Push the hero text shadow blur values to their maximum dramatic effect by increasing the outermost blur layers up to 80px, creating an expansive, cinematic dark underglow.

---

## Current State

| Element | Current Blur Radii |
|---------|-------------------|
| `.tru-hero-headline-main` | 8px, 24px, 48px |
| `.tru-hero-subheadline` | 8px, 20px, 40px |
| `.tru-hero-subheadline-refined` | 8px, 28px, 48px |
| `.tru-headline-animated` | 16px, 40px, 60px (green glow) |

---

## Changes Required

### 1. Maximize Headline Shadow
**File: `src/index.css` (Lines 1444-1449)**

```css
/* Before */
.tru-hero-headline-main {
  text-shadow: 
    0 3px 8px hsl(0 0% 0% / 0.7),
    0 6px 24px hsl(0 0% 0% / 0.5),
    0 12px 48px hsl(0 0% 0% / 0.35);
}

/* After */
.tru-hero-headline-main {
  text-shadow: 
    0 4px 12px hsl(0 0% 0% / 0.75),
    0 8px 32px hsl(0 0% 0% / 0.55),
    0 16px 80px hsl(0 0% 0% / 0.4);
}
```

### 2. Maximize Subheadline Shadow
**File: `src/index.css` (Lines 1754-1761)**

```css
/* Before */
.tru-hero-subheadline {
  text-shadow: 
    0 3px 8px hsl(0 0% 0% / 0.6),
    0 6px 20px hsl(0 0% 0% / 0.4),
    0 10px 40px hsl(0 0% 0% / 0.25);
}

/* After */
.tru-hero-subheadline {
  text-shadow: 
    0 4px 12px hsl(0 0% 0% / 0.65),
    0 8px 28px hsl(0 0% 0% / 0.45),
    0 14px 64px hsl(0 0% 0% / 0.3);
}
```

### 3. Maximize Refined Subheadline Shadow
**File: `src/index.css` (Lines 26370-26383)**

```css
/* Before */
.tru-hero-subheadline-refined {
  text-shadow: 
    0 3px 8px hsl(0 0% 0% / 0.7),
    0 6px 28px hsl(0 0% 0% / 0.5),
    0 12px 48px hsl(0 0% 0% / 0.35);
}

/* After */
.tru-hero-subheadline-refined {
  text-shadow: 
    0 4px 12px hsl(0 0% 0% / 0.75),
    0 8px 36px hsl(0 0% 0% / 0.55),
    0 16px 80px hsl(0 0% 0% / 0.4);
}
```

### 4. Maximize Animated Headline Shadow
**File: `src/index.css` (Lines 26386-26393)**

```css
/* Before */
.tru-headline-animated {
  text-shadow: 
    0 3px 16px hsl(0 0% 0% / 0.7),
    0 6px 40px hsl(0 0% 0% / 0.5),
    0 0 60px hsl(142 72% 50% / 0.3);
}

/* After */
.tru-headline-animated {
  text-shadow: 
    0 4px 20px hsl(0 0% 0% / 0.75),
    0 10px 56px hsl(0 0% 0% / 0.55),
    0 0 80px hsl(142 72% 50% / 0.35);
}
```

---

## Technical Summary

| Element | Before (max blur) | After (max blur) | Opacity Bump |
|---------|-------------------|------------------|--------------|
| Headline | 48px | 80px | +0.05 each layer |
| Subheadline | 40px | 64px | +0.05 each layer |
| Refined Subheadline | 48px | 80px | +0.05 each layer |
| Animated Headline | 60px | 80px | +0.05 each layer |

The 80px maximum blur creates an expansive dark "halo" beneath text that extends dramatically across the background, with slightly increased opacity values to compensate for the larger spread area.

---

### Files Modified
- `src/index.css` - Update all hero text shadow blur values to maximum drama levels
