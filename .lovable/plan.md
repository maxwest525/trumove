
# Remove Unused `.tru-move-summary-accent` CSS Class

## Summary

Clean up the unused `.tru-move-summary-accent` CSS class that was left behind after removing the green accent bar element from the preview card summary modal.

---

## Implementation

### File: `src/index.css` (Lines 110-124)

**Delete the unused CSS class and its comment:**

```css
/* Delete these lines */

/* Top Accent Stripe */
.tru-move-summary-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    hsl(var(--primary)), 
    hsl(var(--primary) / 0.6), 
    hsl(var(--primary))
  );
  border-radius: 16px 16px 0 0;
}
```

---

## Summary

| Action | File | Lines |
|--------|------|-------|
| Delete unused CSS | `src/index.css` | 110-124 |

This removes 15 lines of dead code, keeping the stylesheet clean.
