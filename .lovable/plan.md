

# Enlarge Scanner Preview & Detection List to Full Height

## Overview
Expand the scanner preview and live detection boxes to span the full height of the AI Move Estimator header row container, with adjusted widths for proper proportions.

---

## Current vs Target

| Property | Current | Target |
|----------|---------|--------|
| Header row min-height | 280px | 320px (increased for larger previews) |
| Scanner preview height | 260px | 100% (full height) |
| Scanner preview width | 350px | 420px |
| Detection list height | 260px | 100% (full height) |
| Detection list width | 280px | 320px |

---

## Technical Changes

### File: `src/index.css` (Lines 2269-2331)

**1. Increase header row height:**

```css
.tru-ai-header-row {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 16px;
  min-height: 320px; /* Increased from 280px */
}
```

**2. Update header center padding for new widths:**

```css
.tru-ai-header-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 250px;
  padding-right: 760px; /* Account for larger previews: 420 + 320 + 16 gap */
}
```

**3. Update previews container to stretch full height:**

```css
.tru-ai-header-previews {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  transform: none; /* Remove translateY */
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: stretch;
  opacity: 1;
  transition: all 0.4s ease;
}
```

**4. Update scanner preview size:**

```css
.tru-ai-header-previews .tru-ai-live-scanner {
  width: 420px;
  height: 100%; /* Full height of container */
}
```

**5. Update detection list size:**

```css
.tru-ai-header-previews .tru-ai-live-inventory {
  width: 320px;
  height: 100%; /* Full height of container */
}
```

---

## Summary of Changes

| Element | Before | After |
|---------|--------|-------|
| Header row height | `min-height: 280px` | `min-height: 320px` |
| Previews positioning | `top: 50%; transform: translateY(-50%)` | `top: 0; bottom: 0` |
| Scanner width | `350px` | `420px` |
| Scanner height | `260px` | `100%` |
| Detection width | `280px` | `320px` |
| Detection height | `260px` | `100%` |
| Header center padding-right | `650px` | `760px` |

---

## Files Modified
- `src/index.css` - Update `.tru-ai-header-row`, `.tru-ai-header-center`, `.tru-ai-header-previews`, `.tru-ai-live-scanner`, and `.tru-ai-live-inventory` dimensions

