
# Remove Green Accent from "Building your personalized move profile" Section

## Summary

The "Building your personalized move profile" section header displays a green CheckCircle icon next to the title. This green accent will be removed by changing the icon color to a neutral color.

---

## Current State

The CheckCircle icon in the header is styled green via:
- CSS rule at line 2035-2037: `.tru-route-analysis-header svg { color: hsl(var(--primary)); }`
- Component has conditional class but CSS overrides it

---

## Implementation

### File: `src/index.css` (Lines 2035-2037)

**Change the header icon from green to neutral:**

```css
/* Before */
.tru-route-analysis-header svg {
  color: hsl(var(--primary));
}

/* After */
.tru-route-analysis-header svg {
  color: hsl(var(--tm-ink) / 0.7);
}
```

---

## Summary

| Element | Before | After |
|---------|--------|-------|
| Header icon color | Green (`--primary`) | Neutral gray (`--tm-ink / 0.7`) |

The section title will no longer have a green icon accent beside it.
