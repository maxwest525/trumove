
# Remove Green Accent Bar from Preview Card Summaries

## Summary

The preview card summaries use a green accent bar (`.tru-move-summary-accent`) at the top. This bar will be removed to give the cards a cleaner look.

---

## Current State

The green accent bar is:
1. Defined in `src/index.css` (lines 111-124) as `.tru-move-summary-accent`
2. Used in `src/pages/Index.tsx` line 182 within the `MoveSummaryModal` component

---

## Implementation

### File: `src/pages/Index.tsx` (Line 181-182)

**Remove the accent stripe element:**

```tsx
{/* Before */}
<div className="tru-move-summary-modal" ref={ref}>
  {/* Top Accent Stripe */}
  <div className="tru-move-summary-accent" />
  
{/* After */}
<div className="tru-move-summary-modal" ref={ref}>
```

Simply delete the comment and the `<div className="tru-move-summary-accent" />` element.

---

## Optional Cleanup

### File: `src/index.css` (Lines 111-124)

The CSS class `.tru-move-summary-accent` can also be removed if it's no longer needed elsewhere, but this is optional since unused CSS doesn't affect functionality.

---

## Summary

| Change | File | Action |
|--------|------|--------|
| Remove accent div | `src/pages/Index.tsx` | Delete lines 181-182 |
| Remove accent CSS (optional) | `src/index.css` | Delete lines 111-124 |

The "Building your personalized move profile" modal will no longer have a green bar at the top.
