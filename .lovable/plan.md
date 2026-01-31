
# Change Live Detection Scrollbar from Green to Black

## Overview
Update the scrollbar styling in the Live Detection list to use black instead of the primary green color.

---

## Change Required

**File: `src/index.css` (Lines 2587-2593)**

Update the scrollbar thumb colors from green (`--primary`) to black (`--foreground`):

```css
/* Before */
.tru-ai-live-items::-webkit-scrollbar-thumb {
  background: hsl(var(--primary) / 0.5);
  border-radius: 4px;
}

.tru-ai-live-items::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary) / 0.7);
}

/* After */
.tru-ai-live-items::-webkit-scrollbar-thumb {
  background: hsl(var(--foreground) / 0.4);
  border-radius: 4px;
}

.tru-ai-live-items::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--foreground) / 0.6);
}
```

---

## Technical Summary

| Element | Before | After |
|---------|--------|-------|
| Scrollbar thumb | Green (50% opacity) | Black (40% opacity) |
| Scrollbar thumb hover | Green (70% opacity) | Black (60% opacity) |

---

### Files Modified
- `src/index.css` - Update scrollbar thumb colors
