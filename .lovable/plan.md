

# Move AI Inventory Analysis Steps 1-2-3 to the Left

## Summary

Adjust the left column containing the steps (1, 2, 3) to align flush left within the section, removing any centering or extra spacing that pushes it toward the center.

---

## Current State

The three-column grid uses `auto 1fr auto` which sizes the left column based on its content width. The section has horizontal padding and the inner container has `margin: 0 auto` which can create visual centering.

---

## Implementation

### File: `src/index.css`

**1. Ensure left column aligns to the start (Line 2595-2599)**

Add `justify-self: start` to the left column to ensure it hugs the left edge:

```css
/* Before */
.tru-ai-left-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* After */
.tru-ai-left-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-self: start;
  align-self: start;
  padding-left: 0;
}
```

**2. Reduce left padding on inner container (Lines 2570-2574)**

Remove or reduce left padding to move content closer to the edge:

```css
/* Before */
.tru-ai-steps-inner {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

/* After */
.tru-ai-steps-inner {
  max-width: none;
  padding: 0 48px 0 24px;
  text-align: center;
}
```

This uses asymmetric padding: 24px on the left (closer to edge) and 48px on the right.

**3. Update section padding for left alignment (Lines 2252-2260)**

Adjust section padding to reduce left spacing:

```css
/* Before */
.tru-ai-steps-section {
  padding: 16px 24px 20px;
  ...
}

/* After */
.tru-ai-steps-section {
  padding: 16px 24px 20px 16px;
  ...
}
```

---

## Summary Table

| Element | Before | After |
|---------|--------|-------|
| Left column alignment | Default (auto) | `justify-self: start` |
| Inner container left padding | 48px (or margin centered) | 24px |
| Section left padding | 24px | 16px |

This shifts the entire steps column toward the left edge of the section while maintaining the center and right columns' positions.

