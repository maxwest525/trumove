

# Remove Grey Overlay from Scanner Preview

## Overview
Remove the inactive/dimmed state styling that applies a grey overlay effect to the scanner preview and detection columns when the demo isn't running.

---

## Root Cause

The grey overlay effect is caused by the "inactive state" CSS rule at **lines 2716-2722** in `src/index.css`:

```css
/* Inactive state for scanner and detection columns */
.tru-ai-center-column,
.tru-ai-right-column {
  opacity: 0.6;          /* ← Creates the grey/washed out look */
  transform: scale(0.98);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Solution

Remove the opacity and scale reduction so the preview always appears at full clarity:

**File: `src/index.css` (Lines 2716-2722)**

```css
/* Before */
.tru-ai-center-column,
.tru-ai-right-column {
  opacity: 0.6;
  transform: scale(0.98);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* After */
.tru-ai-center-column,
.tru-ai-right-column {
  opacity: 1;
  transform: scale(1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Technical Summary

| Property | Before | After |
|----------|--------|-------|
| opacity | 0.6 | 1 |
| transform scale | 0.98 | 1 |

This keeps the transition for smooth animation when the demo starts, but the preview will always appear fully visible.

---

### Files Modified
- `src/index.css` - Update inactive state to full opacity

