

# Make Hero Backdrop Lighter & Tighter

## Overview
Further reduce the backdrop opacity to 35%/20% and decrease padding to make the box fit more snugly around the headline text.

---

## Current State

| Property | Current Value |
|----------|---------------|
| Background opacity | `45%` → `30%` (top to bottom gradient) |
| Padding | `32px 56px 40px` (top, horizontal, bottom) |

---

## Proposed Changes

### File: `src/index.css`

**1. Make backdrop lighter (lines 25917-25921):**

Reduce opacity from 45%/30% to 35%/20%:

```css
background: linear-gradient(
  180deg,
  hsl(0 0% 0% / 0.35) 0%,
  hsl(0 0% 0% / 0.20) 100%
);
```

**2. Tighten padding around text (line 25907):**

Reduce padding to bring the box edges closer to the words:

```css
/* From */
padding: 32px 56px 40px;

/* To */
padding: 20px 36px 24px;
```

---

## Result

| Property | Before | After |
|----------|--------|-------|
| Top opacity | 45% | 35% |
| Bottom opacity | 30% | 20% |
| Top padding | 32px | 20px |
| Horizontal padding | 56px | 36px |
| Bottom padding | 40px | 24px |

The backdrop will be more transparent, allowing more of the hero image to show through, and the box will wrap more tightly around the headline text, reducing approximately 40px of total dead space.

