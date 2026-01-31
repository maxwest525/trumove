
# Add Dark Black Underglow to Hero Header and Subheadline

## Overview
Add a dark black underglow shadow effect to the hero headline and subheadline text for enhanced visual depth and readability.

---

## Current State

The headline currently uses a light background-based text shadow:
```css
.tru-hero-headline-main {
  text-shadow: 
    0 2px 8px hsl(var(--background) / 0.5),
    0 4px 16px hsl(var(--background) / 0.3);
}
```

The subheadline has no text shadow.

---

## Changes Required

### 1. Update Headline Text Shadow with Dark Underglow
**File: `src/index.css` (Lines 1443-1448)**

Replace the current text shadow with a dark black underglow:

```css
/* Before */
.tru-hero-headline-main {
  text-shadow: 
    0 2px 8px hsl(var(--background) / 0.5),
    0 4px 16px hsl(var(--background) / 0.3);
}

/* After */
.tru-hero-headline-main {
  text-shadow: 
    0 2px 4px hsl(0 0% 0% / 0.15),
    0 4px 12px hsl(0 0% 0% / 0.1),
    0 8px 24px hsl(0 0% 0% / 0.08);
}
```

### 2. Add Dark Underglow to Subheadline
**File: `src/index.css` (Lines 1753-1762)**

Add text shadow to the subheadline for matching dark underglow:

```css
/* Before */
.tru-hero-subheadline {
  font-size: 18px;
  line-height: 1.7;
  color: hsl(var(--tm-ink));
  /* ... other properties */
}

/* After */
.tru-hero-subheadline {
  font-size: 18px;
  line-height: 1.7;
  color: hsl(var(--tm-ink));
  text-shadow: 
    0 1px 3px hsl(0 0% 0% / 0.1),
    0 3px 8px hsl(0 0% 0% / 0.06);
  /* ... other properties */
}
```

---

## Technical Summary

| Element | Shadow Type | Effect |
|---------|-------------|--------|
| Headline | Multi-layer dark shadow | Strong underglow with 3 layers at 15%, 10%, 8% opacity |
| Subheadline | Subtle dark shadow | Lighter underglow with 2 layers at 10%, 6% opacity |

The dark black shadows use pure black (`hsl(0 0% 0%)`) with low opacity to create a subtle but visible underglow effect that works in both light and dark modes.

---

### Files Modified
- `src/index.css` - Update headline and subheadline text shadows
