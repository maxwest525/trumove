

# Move Logo Up & Update Headline Text

## Overview
Move the hero logo and headline up by 50 pixels and update the headline text from "A Smarter Way To Move" to "The Smarter Way To Move".

---

## Technical Changes

### 1. File: `src/index.css` (Line 89)

**Update the `top` position from `48px` to `-2px`:**

```css
/* Before */
top: 48px;

/* After */
top: -2px;
```

This moves the entire stacked header (logo + headline) up by exactly 50 pixels.

---

### 2. File: `src/pages/Index.tsx` (Line 1050-1052)

**Update the headline text:**

```jsx
/* Before */
<h1 className="tru-hero-headline-main tru-headline-animated">
  A Smarter Way To <span className="tru-hero-headline-accent">Move</span>
</h1>

/* After */
<h1 className="tru-hero-headline-main tru-headline-animated">
  The Smarter Way To <span className="tru-hero-headline-accent">Move</span>
</h1>
```

---

## Summary

| Change | Before | After |
|--------|--------|-------|
| Header vertical position | `top: 48px` | `top: -2px` (50px higher) |
| Headline text | "A Smarter Way To Move" | "The Smarter Way To Move" |

---

## Files Modified
- `src/index.css` - Adjust top position
- `src/pages/Index.tsx` - Update headline text

