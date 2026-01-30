
# Fix Hover Enlarge Previews Being Cut Off

## Problem Analysis

The feature carousel cards have a 1.35x scale hover effect that expands beyond the card boundaries. However, the parent `.tru-why-card-premium` container has `overflow: hidden` which clips these enlarged previews.

### Current CSS Structure

```
.tru-why-card-premium (overflow: hidden) ← CLIPS CONTENT
  └── .tru-why-card-premium-content
       └── .features-carousel (overflow: visible !important)
            └── .features-carousel-container
                 └── .features-carousel-content (overflow: visible !important)
                      └── .features-carousel-card:hover (scale: 1.35) ← GETS CUT OFF
```

The carousel and its children have `overflow: visible !important` but this is negated by the parent card having `overflow: hidden`.

---

## Solution

Remove `overflow: hidden` from `.tru-why-card-premium` so the hover-enlarged carousel cards can expand beyond the card boundaries as intended.

---

## Implementation

### File: `src/index.css` (line 26216)

Remove the `overflow: hidden` property from `.tru-why-card-premium`:

**Before:**
```css
.tru-why-card-premium {
  position: relative;
  background: hsl(var(--background) / 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid transparent;
  border-radius: 20px;
  overflow: hidden;  /* <-- This clips the hover previews */
  box-shadow: ...
}
```

**After:**
```css
.tru-why-card-premium {
  position: relative;
  background: hsl(var(--background) / 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid transparent;
  border-radius: 20px;
  /* overflow: hidden removed to allow carousel hover expansion */
  box-shadow: ...
}
```

---

## Summary

| File | Line | Change |
|------|------|--------|
| `src/index.css` | 26216 | Remove `overflow: hidden` from `.tru-why-card-premium` |

---

## Expected Result

- Hover-enlarged carousel cards will now expand beyond the Why TruMove card boundaries
- The dramatic 1.35x scale effect will be fully visible
- The rounded corners of the card will still render correctly (handled by the inner content)
