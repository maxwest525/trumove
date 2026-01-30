
# Unify Black Stats Strip to Match Grey SAFER Trust Strip

## Overview
Update the black stats strip CSS to match the grey SAFER trust strip dimensions and styling, creating visual consistency between the two horizontal trust indicators.

---

## Current vs Target Values

| Property | Current (Black Strip) | Target (Match Grey Strip) |
|----------|----------------------|---------------------------|
| Padding | `6px 16px` | `8px 24px` |
| Font Size | `10px` | `12px` |
| Font Weight | `600` | `700` |
| Icon Size | `12px` | `16px` |
| Gap (inner) | `4px` | `16px` |
| Gap (item) | `4px` | `6px` (icon-to-text) |
| Dot Margin | `0 4px` | `0 8px` |

---

## Changes Required

### File: `src/index.css`

#### 1. Update `.stats-strip` padding (line 28618)
```css
/* Before */
padding: 6px 16px;

/* After */
padding: 8px 24px;
```

#### 2. Update `.stats-strip-inner` gap (line 28629)
```css
/* Before */
gap: 4px;

/* After */
gap: 16px;
```

#### 3. Update `.stats-strip-item` styles (lines 28636-28638)
```css
/* Before */
gap: 4px;
font-size: 10px;
font-weight: 600;

/* After */
gap: 6px;
font-size: 12px;
font-weight: 700;
```

#### 4. Update `.stats-strip-item svg` size (lines 28647-28648)
```css
/* Before */
width: 12px;
height: 12px;

/* After */
width: 16px;
height: 16px;
```

#### 5. Update `.stats-strip-dot` margin (line 28655)
```css
/* Before */
margin: 0 4px;

/* After */
margin: 0 8px;
```

---

## Visual Result

**Before:**
```
[Small] SERVING 48 STATES • 50,000+ MOVES • 24/7 SUPPORT
        (compact, tight spacing)
```

**After:**
```
[Matched] SERVING 48 STATES  •  50,000+ MOVES  •  24/7 SUPPORT
          (same height/weight as grey SAFER strip)
```

---

## Summary

| Line | Property | Change |
|------|----------|--------|
| 28618 | `.stats-strip` padding | `6px 16px` → `8px 24px` |
| 28629 | `.stats-strip-inner` gap | `4px` → `16px` |
| 28636 | `.stats-strip-item` gap | `4px` → `6px` |
| 28637 | `.stats-strip-item` font-size | `10px` → `12px` |
| 28638 | `.stats-strip-item` font-weight | `600` → `700` |
| 28647-28648 | `.stats-strip-item svg` size | `12px` → `16px` |
| 28655 | `.stats-strip-dot` margin | `0 4px` → `0 8px` |

### File Modified
- `src/index.css` - 5 property updates across the stats-strip rules
