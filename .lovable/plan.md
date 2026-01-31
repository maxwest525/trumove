

# Widen Scanner & Detection Boxes

## Overview
Increase both the scanner preview and live detection boxes from 400px to 420px width while keeping them equal in size.

---

## Technical Changes

### File: `src/index.css`

**Update both preview boxes to 420px width:**

```css
.tru-ai-header-previews .tru-ai-live-scanner {
  width: 420px;
  height: 100% !important;
  min-height: 100% !important;
}

.tru-ai-header-previews .tru-ai-live-inventory {
  width: 420px;
  height: 100% !important;
  min-height: 100% !important;
}
```

**Update header center padding to account for wider boxes:**

```css
.tru-ai-header-center {
  padding-right: 860px; /* 420 + 420 + 16 gap + buffer */
}
```

---

## Summary of Changes

| Element | Before | After |
|---------|--------|-------|
| Scanner width | 400px | 420px |
| Detection width | 400px | 420px |
| Header center padding-right | 820px | 860px |

---

## Files Modified
- `src/index.css` - Update widths for both preview boxes and adjust header center padding

