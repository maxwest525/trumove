
# Remove Green Accent from "Building your personalized move profile" Section

## Summary

The "Building your personalized move profile" section (RouteAnalysisSection) currently has a subtle green-tinted border around it. To remove this green accent, we need to change the border color from the primary (green) color to a neutral border color.

---

## Current State

The section is styled by `.tru-route-analysis-permanent` class with:
```css
border: 1px solid hsl(var(--primary) / 0.15);
```

This creates a subtle green border around the entire card.

---

## Implementation

### File: `src/index.css` (Line 2007)

**Change the border color from green-tinted to neutral:**

```css
/* Before */
.tru-route-analysis-permanent {
  border: 1px solid hsl(var(--primary) / 0.15);
  ...
}

/* After */
.tru-route-analysis-permanent {
  border: 1px solid hsl(var(--border));
  ...
}
```

---

## Technical Details

| Property | Before | After |
|----------|--------|-------|
| Border color | `hsl(var(--primary) / 0.15)` (green tint) | `hsl(var(--border))` (neutral) |

The change replaces the green-tinted border with the standard neutral border color, removing the green accent from the top (and all sides) of the section card.
