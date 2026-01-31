

# Fix: Scanner and Detection Card Sizing Within 450px Section

## Problem

The scanner and detection card are not properly sizing within the 450px section height because:

1. **Duplicate `.tru-ai-two-column` rules** - Lines 2263-2267 have an incomplete definition that lacks `display: grid`, causing layout issues
2. **Height override** - Line 2737-2740 sets `.tru-ai-right-column .tru-ai-live-inventory` to `height: auto` which breaks the `height: 100%` rule
3. **Missing flex constraints** - The grid needs `flex: 1` and `min-height: 0` to properly fill the available space within the fixed 450px container

---

## Solution

### File: `src/index.css`

**1. Remove the incomplete duplicate `.tru-ai-two-column` (Lines 2263-2267)**

Delete this incomplete block:
```css
.tru-ai-two-column {
  flex: 1;
  min-height: 0;
  align-items: stretch;
}
```

**2. Add flex properties to the complete `.tru-ai-two-column` definition (Lines 2584-2591)**

Update to include flex properties for proper height distribution:
```css
.tru-ai-two-column {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 24px;
  align-items: stretch;
  margin-bottom: 0;
  text-align: left;
  flex: 1;
  min-height: 0;
}
```

**3. Fix the inventory height override (Lines 2737-2740)**

Change:
```css
.tru-ai-right-column .tru-ai-live-inventory {
  height: auto;
  min-height: 200px;
}
```
To:
```css
.tru-ai-right-column .tru-ai-live-inventory {
  height: 100%;
  flex: 1;
  min-height: 0;
}
```

**4. Ensure scanner fills its container (Lines 2638-2641)**

Update to properly fill height:
```css
.tru-ai-preview-vertical .tru-ai-live-scanner {
  height: 100%;
  flex: 1;
  min-height: 0;
}
```

---

## Summary Table

| Issue | Location | Fix |
|-------|----------|-----|
| Duplicate incomplete CSS rule | Lines 2263-2267 | Delete entire block |
| Missing flex properties on grid | Lines 2584-2591 | Add `flex: 1` and `min-height: 0` |
| Inventory height override | Lines 2737-2740 | Change `height: auto` to `height: 100%` |
| Scanner height constraint | Lines 2638-2641 | Add `min-height: 0` |

This ensures both the scanner and detection card properly fill the available space within the 450px section, with proper flex behavior for vertical sizing.

