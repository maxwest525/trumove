

# Lower the "Building your personalized move profile" Section

## Overview
Slightly lower the "Building your personalized move profile" section (the Move Summary Modal) on the homepage by adjusting its top positioning.

---

## Current State
- The `.tru-move-summary-modal` has `top: 0` positioning
- This places it at the very top of its container (the hero right panel)

## Target State
- Add a small top margin/offset to push the modal down slightly
- Creates better visual spacing from the top of the hero section

---

## Change Required

**File:** `src/index.css` (line 85)

Update the `top` value from `0` to `24px` (or similar small offset):

```css
/* Before */
.tru-move-summary-modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  /* ... */
}

/* After */
.tru-move-summary-modal {
  position: absolute;
  top: 24px;  /* Lowered from 0 */
  left: 0;
  right: 0;
  /* ... */
}
```

---

## Summary

| Change | Description |
|--------|-------------|
| CSS adjustment | Change `top: 0` to `top: 24px` for `.tru-move-summary-modal` |
| Visual effect | Moves the "Building your personalized move profile" card down by 24 pixels |

