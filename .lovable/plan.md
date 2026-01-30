
# Make Hero Carousel Cards More Compact

## Overview
Further reduce the size of the carousel cards in the "Your Move. Your Terms" section by making images smaller and tightening all spacing.

---

## Changes Required (src/index.css)

### 1. Reduce Card Text Padding (Line 25443)
```css
/* From: */
padding: 10px 10px 8px;

/* To: */
padding: 8px 8px 6px;
```

### 2. Reduce Title Font Size (Line 25447)
```css
/* From: */
font-size: 11px;

/* To: */
font-size: 10px;
```

### 3. Reduce Description Font Size (Line 25454)
```css
/* From: */
font-size: 9px;

/* To: */
font-size: 8px;
```

### 4. Make Image Smaller with Tighter Aspect Ratio (Line 25463)
```css
/* From: */
aspect-ratio: 16 / 9;

/* To: */
aspect-ratio: 2 / 1;
```

### 5. Reduce Card Border Radius (Line 25429)
```css
/* From: */
border-radius: 12px;

/* To: */
border-radius: 8px;
```

### 6. Reduce Item Padding (Lines 25415-25416)
```css
/* From: */
padding-left: 6px;
padding-right: 6px;

/* To: */
padding-left: 4px;
padding-right: 4px;
```

---

## Summary of Reductions

| Element | Before | After | Reduction |
|---------|--------|-------|-----------|
| Text padding | 10px 10px 8px | 8px 8px 6px | ~20% |
| Title font | 11px | 10px | ~9% |
| Description font | 9px | 8px | ~11% |
| Image aspect | 16/9 (1.78) | 2/1 (2.0) | ~12% shorter |
| Border radius | 12px | 8px | 33% |
| Item gap | 6px | 4px | 33% |

---

## File to Modify
- `src/index.css`

This creates noticeably more compact cards while maintaining readability and visual hierarchy.
