

# Make Hero Header Backdrop Lighter

## Overview
Reduce the opacity of the dark backdrop box behind the hero headline "A Smarter Way To Move" to make it less prominent while still maintaining text readability.

---

## Current State

The hero header backdrop (lines 25913-25925) uses:

```css
background: linear-gradient(
  180deg,
  hsl(0 0% 0% / 0.75) 0%,   /* 75% black at top */
  hsl(0 0% 0% / 0.55) 100%  /* 55% black at bottom */
);
```

This creates a fairly dark semi-transparent box behind the headline.

---

## Proposed Changes

### File: `src/index.css`

**Update the backdrop opacity (lines 25917-25921):**

Reduce opacity to make the box lighter/more transparent:

```css
background: linear-gradient(
  180deg,
  hsl(0 0% 0% / 0.45) 0%,   /* 45% black (was 75%) */
  hsl(0 0% 0% / 0.30) 100%  /* 30% black (was 55%) */
);
```

---

## Result

| Element | Before | After |
|---------|--------|-------|
| Top of backdrop | 75% opacity | 45% opacity |
| Bottom of backdrop | 55% opacity | 30% opacity |

The hero background image will be more visible through the backdrop while still providing enough contrast for the white headline text to remain readable.

---

## Alternative Options

If the proposed values feel too light or too dark, we can adjust:

- **Lighter**: 35%/20% for a very subtle overlay
- **Moderate**: 55%/40% for a middle ground
- **Current**: 75%/55% (existing)

