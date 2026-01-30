
# Fix AI Inventory Analysis Section Height to 400px

## Summary

The AI Inventory Analysis section currently uses `max-height: 400px` which only constrains the maximum height but doesn't ensure the section actually reaches 400px. The content inside is smaller than 400px, so the section collapses to fit its content (approximately 300px). We need to change the approach to ensure the section is exactly 400px tall.

---

## Current State

```text
.tru-ai-steps-section {
  max-height: 400px;  ← Only limits maximum, doesn't set minimum
  overflow: hidden;
}

Result: Section collapses to ~300px based on content height
```

---

## Implementation

### File: `src/index.css` (Lines 2252-2260)

**Change from max-height to explicit height:**

```css
/* Before */
.tru-ai-steps-section {
  padding: 16px 24px 20px;
  margin-top: 0;
  background: hsl(var(--background));
  position: relative;
  z-index: 5;
  max-height: 400px;
  overflow: hidden;
}

/* After */
.tru-ai-steps-section {
  padding: 16px 24px 20px;
  margin-top: 0;
  background: hsl(var(--background));
  position: relative;
  z-index: 5;
  height: 400px;
  overflow: hidden;
}
```

**Ensure inner container fills the height (add after line 2260):**

```css
.tru-ai-steps-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tru-ai-two-column {
  flex: 1;
  min-height: 0;
}
```

---

## Summary Table

| Property | Before | After |
|----------|--------|-------|
| Section height | `max-height: 400px` (collapses to ~300px) | `height: 400px` (fixed at 400px) |
| Inner container | No explicit height | `height: 100%` with flex layout |
| Three-column grid | Auto height | `flex: 1` to fill available space |

This ensures the section is exactly 400px tall with the content distributed appropriately within that space.
