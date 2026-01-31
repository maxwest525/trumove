

# Raise Scanner and Detection Boxes Up 10 Pixels

## Overview
Shift both the scanner preview and live detection box upward by 10 pixels without changing their dimensions, creating a slightly tighter alignment with the section title.

---

## Current State

| Element | Current Positioning |
|---------|-------------------|
| Center column (Scanner) | No vertical offset |
| Right column (Detection) | No vertical offset |

---

## Changes Required

### 1. Add Negative Margin to Both Columns
**File: `src/index.css` (Lines 2607-2621)**

Add `margin-top: -10px` to both the center and right columns to shift them upward:

```css
/* Before */
.tru-ai-center-column {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  min-width: 420px;
  height: 100%;
}

.tru-ai-right-column {
  display: flex;
  flex-direction: column;
  min-width: 350px;
  height: 100%;
}

/* After */
.tru-ai-center-column {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  min-width: 420px;
  height: 100%;
  margin-top: -10px;
}

.tru-ai-right-column {
  display: flex;
  flex-direction: column;
  min-width: 350px;
  height: 100%;
  margin-top: -10px;
}
```

---

## Technical Summary

| Property | Before | After |
|----------|--------|-------|
| Center column margin-top | 0 | -10px |
| Right column margin-top | 0 | -10px |
| Box dimensions | Unchanged | Unchanged |

Both boxes will shift up equally by 10 pixels while maintaining their 420x340px (scanner) and 350px width (detection) dimensions.

---

### Files Modified
- `src/index.css` - Add negative top margin to center and right columns

