

# Full-Height Scanner & Detection Boxes (Same Size)

## Overview
Make both the scanner preview and live detection boxes span the full height of the AI Move Estimator section, with both boxes the same width for visual balance.

---

## Current Issues

1. **Conflicting CSS definitions**: Base `.tru-ai-live-scanner` has `height: 340px` which overrides the `100%` in header previews
2. **Conflicting CSS definitions**: Base `.tru-ai-live-inventory` has `height: 340px` and `width: 350px` which override header previews
3. **Different widths**: Scanner is 420px, Detection is 320px - should be equal
4. **Header row height**: Currently 320px min-height, but section is 500px min-height

---

## Technical Changes

### File: `src/index.css`

**1. Increase header row to match section height:**

Update `.tru-ai-header-row` (line 2269):
```css
.tru-ai-header-row {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 16px;
  min-height: 450px; /* Match section height minus padding */
}
```

**2. Make both preview boxes same width (400px each):**

Update lines 2324-2332:
```css
.tru-ai-header-previews .tru-ai-live-scanner {
  width: 400px;
  height: 100%;
  min-height: 100%; /* Override base definition */
}

.tru-ai-header-previews .tru-ai-live-inventory {
  width: 400px;
  height: 100%;
  min-height: 100%; /* Override base definition */
}
```

**3. Override base definitions with !important for header context:**

Add specificity to override base `.tru-ai-live-scanner` (line 2464-2471) and `.tru-ai-live-inventory` (line 2611-2620):

```css
/* Override base dimensions when in header previews context */
.tru-ai-header-previews .tru-ai-live-scanner,
.tru-ai-header-previews .tru-ai-live-inventory {
  height: 100% !important;
  min-height: 100% !important;
}
```

**4. Adjust header center padding for new widths:**

Update `.tru-ai-header-center` (line 2291-2299):
```css
.tru-ai-header-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 250px;
  padding-right: 820px; /* 400 + 400 + 16 gap + buffer */
}
```

---

## Summary of Changes

| Element | Before | After |
|---------|--------|-------|
| Header row min-height | 320px | 450px |
| Scanner width | 420px | 400px |
| Scanner height | 340px / 100% | 100% (full height) |
| Detection width | 320px | 400px (same as scanner) |
| Detection height | 340px | 100% (full height) |
| Header center padding-right | 760px | 820px |

---

## Files Modified
- `src/index.css` - Update `.tru-ai-header-row`, `.tru-ai-header-previews` children, `.tru-ai-header-center` dimensions, and add override rules

