
# Make "A Smarter Way to Move" Tagline Larger

## Overview
The tagline "A Smarter Way to Move" in the homepage main form is currently set to 14px font size. We'll increase it to be more prominent and eye-catching.

---

## Current State
**File:** `src/index.css` (lines 25367-25372)

```css
.tru-qb-header-tagline {
  font-size: 14px;
  font-weight: 600;
  color: hsl(var(--muted-foreground));
  letter-spacing: 0.01em;
}
```

---

## Change
Increase the font size from 14px to 20px and boost the font weight for better visual impact:

```css
.tru-qb-header-tagline {
  font-size: 20px;
  font-weight: 700;
  color: hsl(var(--muted-foreground));
  letter-spacing: 0.02em;
}
```

---

## Summary

| Task | File | Change |
|------|------|--------|
| Increase tagline size | `src/index.css` | Font size 14px → 20px, weight 600 → 700 |

## Visual Result
- "A Smarter Way to Move" will be noticeably larger and more prominent in the form header
- The increased weight and letter-spacing will improve readability
