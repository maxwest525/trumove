
# Fix Carousel Cards Overflowing Screen

## Problem
The previous fix set `overflow: visible !important` on the Embla carousel wrapper, which broke the horizontal containment. Cards are now extending off the right side of the screen.

## Root Cause Analysis
- Embla carousel uses `overflow: hidden` on its wrapper (line 139 in carousel.tsx)
- We need horizontal clipping to contain the scrollable cards
- We only need vertical overflow for the hover scale effect (top/bottom borders)
- The CSS `overflow: visible !important` was too aggressive

## Solution
Use `clip-path` combined with `overflow-y: visible` to:
1. Keep horizontal containment (cards don't extend off screen)
2. Allow vertical overflow for hover scale effects

Alternatively, use `overflow: clip` with `overflow-clip-margin` or apply padding inside the wrapper.

The cleanest approach is:
1. **Remove** the `overflow: visible !important` on the Embla wrapper
2. **Add padding** inside the `.features-carousel-content` wrapper to give room for scaled cards
3. Use `overflow-x: hidden; overflow-y: visible` on the container

---

## Files to Modify

### `src/index.css` (around lines 14703-14731)

**Changes:**

1. **Remove** the problematic override on line 14712-14714:
```css
/* DELETE THIS RULE */
.features-carousel-container > div:first-child {
  overflow: visible !important;
}
```

2. **Update** `.features-carousel-container` to use split overflow:
```css
.features-carousel-container {
  width: 100%;
  max-width: 100%;
  padding: 0;
  position: relative;
  overflow-x: clip;  /* Contain horizontally */
  overflow-y: visible;  /* Allow vertical for hover */
}
```

3. **Update** `.features-carousel-content` padding:
```css
.features-carousel-content {
  display: flex;
  gap: 24px;
  margin-left: 0 !important;
  padding: 16px 0;  /* Increased vertical padding for scale room */
}
```

4. **Keep** `.features-carousel-item` with `overflow: visible`:
```css
.features-carousel-item {
  /* ... existing ... */
  overflow: visible !important;
}
```

5. **Reduce scale** from 1.04 to 1.02 to minimize overflow issues:
```css
.features-carousel-card.is-enlarged {
  transform: scale(1.02);  /* Even more subtle */
}
```

---

## Alternative Approach (if overflow-x:clip doesn't work)

If split overflow doesn't solve it, we can:
1. Keep `overflow: hidden` on the Embla wrapper (default)
2. Add extra padding to `.features-carousel-content` (e.g., `padding: 20px 0`)
3. Reduce scale effect further or remove it entirely
4. Use `box-shadow` for emphasis instead of `transform: scale`

This approach works within Embla's constraints rather than fighting them.

---

## Summary of Changes

| Line Range | Current | New |
|------------|---------|-----|
| 14703-14709 | `overflow: visible` | `overflow-x: clip; overflow-y: visible` |
| 14711-14714 | Override rule | **DELETE** this rule |
| 14720 | `padding: 12px 0` | `padding: 16px 0` |
| is-enlarged | `scale(1.04)` | `scale(1.02)` or remove |

---

## Expected Result
- Cards stay contained within the viewport horizontally
- Navigation arrows and carousel scrolling work correctly
- Hover scale effect shows full borders (top and bottom)
- Consistent gaps between cards maintained
