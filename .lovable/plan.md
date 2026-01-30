

# Reduce Dead Space in Why TruMove Card

## Overview
Tighten the vertical spacing in the "Why TruMove" card by reducing gaps, margins, and padding to create a more compact layout.

---

## Current State

The card has generous spacing throughout:

| Element | Current Value |
|---------|---------------|
| Content container gap | `16px` |
| Mission paragraph margin | `margin: 8px 0 16px 0` |
| Inline carousel margin | `margin: 12px 0 8px 0` |
| Subtitle margin-bottom (inline) | `12px` |

---

## Proposed Changes

### File: `src/index.css`

**1. Reduce content container gap (line 26100):**
```css
/* From */
gap: 16px;

/* To */
gap: 10px;
```

**2. Reduce mission paragraph margin (line 26138):**
```css
/* From */
margin: 8px 0 16px 0;

/* To */
margin: 4px 0 8px 0;
```

**3. Reduce inline carousel top margin (line 26143):**
```css
/* From */
margin: 12px 0 8px 0;

/* To */
margin: 4px 0 8px 0;
```

### File: `src/pages/Index.tsx`

**4. Reduce accent line bottom margin (line 1481):**
```tsx
/* From */
style={{ marginBottom: '12px' }}

/* To */
style={{ marginBottom: '6px' }}
```

---

## Result

| Element | Before | After |
|---------|--------|-------|
| Content gap | 16px | 10px |
| Mission paragraph margin | 8px 0 16px 0 | 4px 0 8px 0 |
| Carousel top margin | 12px | 4px |
| Accent line bottom margin | 12px | 6px |

This will move the divider, subheader, and carousel closer together, reducing approximately 20-24px of vertical dead space in the card.

