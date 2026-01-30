

# Move Header and Subheader Closer Together

## Overview
Reduce the vertical gap between the headline and subtitle while keeping the backdrop the same size by adjusting margins and compensating with padding.

---

## Current State

| Property | Current Value |
|----------|--------------|
| Backdrop padding | `12px 20px 12px` (top/horizontal/bottom) |
| Headline margin-bottom | `6px` |
| Subtitle margin-top | `4px` |
| **Total gap** | **10px** |

---

## Proposed Changes

### File: `src/index.css`

**1. Remove headline bottom margin (line 25959):**

```css
/* From */
margin-bottom: 6px;

/* To */
margin-bottom: 0;
```

**2. Remove subtitle top margin (line 25972):**

```css
/* From */
margin: 4px auto 0;

/* To */
margin: 0 auto 0;
```

**3. Increase backdrop padding to maintain same overall size (line 25907):**

```css
/* From */
padding: 12px 20px 12px;

/* To */
padding: 16px 20px 16px;
```

---

## Visual Result

| Change | Before | After |
|--------|--------|-------|
| Gap between headline & subtitle | 10px | 0px |
| Backdrop padding (top/bottom) | 12px | 16px |
| **Total backdrop size** | Same | Same |

The headline and subtitle will be flush against each other (or nearly touching), while the extra padding on the backdrop compensates to maintain its current visual size.

