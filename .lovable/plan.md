
# Fix Why TruMove Card Clipping Issue

## Problem Analysis

The Why TruMove card appears rounded on the left but squared/cut off on the right side due to container clipping and unbalanced padding.

### Root Causes Found

| Container | Issue |
|-----------|-------|
| `.tru-hero.tru-hero-split` | `overflow: hidden` (line 24575) clips child content |
| `.tru-hero.tru-hero-split` | Unbalanced padding: `48px 24px 24px 48px` (48px left, 24px right) |
| `.tru-hero-content-panel` | `padding-left: 24px` but no `padding-right` |

The card extends to the right edge of its container, and the combination of `overflow: hidden` and missing right padding causes the rounded corners to be clipped.

---

## Solution

Add right padding to the content panel and balance the hero split padding to give the card room to display its rounded corners.

---

## Implementation

### Change 1: Add padding-right to content panel

**File: `src/index.css`** (line 1559)

Add `padding-right: 24px` to `.tru-hero-content-panel`:

```css
/* Current */
.tru-hero-content-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: flex-start;
  height: auto;
  grid-row: 2;
  grid-column: 2;
  padding-left: 24px;
  padding-top: 0;
}

/* Updated */
.tru-hero-content-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: flex-start;
  height: auto;
  grid-row: 2;
  grid-column: 2;
  padding-left: 24px;
  padding-right: 24px;  /* <-- Add this */
  padding-top: 0;
}
```

### Change 2: Balance hero split padding

**File: `src/index.css`** (line 1398)

Update the hero split padding to be balanced:

```css
/* Current */
padding: 48px 24px 24px 48px;

/* Updated - balanced left/right */
padding: 48px 48px 24px 48px;
```

---

## Summary of Changes

| File | Line | Change |
|------|------|--------|
| `src/index.css` | 1398 | Change hero split padding from `48px 24px 24px 48px` to `48px 48px 24px 48px` |
| `src/index.css` | 1559-1561 | Add `padding-right: 24px` to `.tru-hero-content-panel` |

---

## Expected Result

- The Why TruMove card will have fully visible rounded corners on both left and right sides
- The card will have equal spacing from the viewport edge on both sides
- The overall hero layout will appear more balanced
