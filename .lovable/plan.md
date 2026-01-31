

# Fix Headline Word Wrapping

## Overview
Prevent the headline "The Smarter Way To Move" from wrapping "Move" to a new line. The entire headline should stay on a single line.

---

## Technical Changes

### File: `src/index.css` (Lines 104-107)

**Add `white-space: nowrap` to prevent word wrapping:**

```css
/* Before */
.tru-hero-header-stacked .tru-hero-headline-main {
  display: block;
  text-align: center;
}

/* After */
.tru-hero-header-stacked .tru-hero-headline-main {
  display: block;
  text-align: center;
  white-space: nowrap;
}
```

---

## Result

| Line | Content |
|------|---------|
| 1 | TruMove logo |
| 2 | "The Smarter Way To Move" (all on one line) |

---

## Files Modified
- `src/index.css` - Add white-space: nowrap to headline

