

# Tighten Hero Header Spacing and Backdrop Width

## Overview
Make the headline and subtitle closer together, and reduce the backdrop width to fit closer to the text.

---

## Current State

| Property | Current Value | Location |
|----------|--------------|----------|
| Headline margin-bottom | `16px` | Line 25956 |
| Subtitle margin-top | `12px` | Line 25969 |
| Backdrop padding | `12px 28px 14px` | Line 25907 |
| Backdrop width | Full width (no max-width set) | - |

---

## Proposed Changes

### File: `src/index.css`

**1. Reduce headline-to-subtitle gap (line 25956):**

```css
/* From */
margin-bottom: 16px;

/* To */
margin-bottom: 6px;
```

**2. Reduce subtitle top margin (line 25969):**

```css
/* From */
margin: 12px auto 0;

/* To */
margin: 4px auto 0;
```

**3. Reduce horizontal padding and add width constraint (line 25905-25911):**

```css
.tru-hero-header-section.tru-hero-header-refined {
  position: relative;
  padding: 12px 20px 12px;  /* Reduced horizontal padding */
  text-align: center;
  z-index: 10;
  margin-bottom: 12px;
  width: fit-content;       /* Shrink to content width */
  margin-left: auto;        /* Center horizontally */
  margin-right: auto;       /* Center horizontally */
}
```

---

## Visual Result

| Change | Before | After |
|--------|--------|-------|
| Gap between headline & subtitle | ~28px total | ~10px total |
| Backdrop horizontal padding | 28px each side | 20px each side |
| Backdrop width | Full container width | Fits content width |

The backdrop will now hug the text more closely, and the headline and subtitle will be visually tighter together.

