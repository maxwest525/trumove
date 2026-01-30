

# Fix Move Profile Modal Clipping Issue

## Problem Analysis

The "Building your personalized move profile" modal and other content is being cut off on the left and right sides of the page. This is caused by multiple containers with `overflow: hidden` that restrict content from extending beyond their boundaries.

### Containers Causing Clipping

| Container | Line | Current Value | Issue |
|-----------|------|---------------|-------|
| `.tru-hero-wrapper` | 1353 | `overflow-x: hidden` | Clips all horizontal overflow |
| `.tru-hero.tru-hero-split` | 24576 | `overflow: hidden` | Clips content in hero section |
| `.tru-move-summary-modal` | 98 | `overflow: hidden` | Clips the modal's own content |

---

## Solution

Remove `overflow: hidden` from these key layout containers to allow content (including hover effects, modals, and expanded elements) to extend beyond their boundaries.

---

## Implementation

### Change 1: Remove overflow-x from hero wrapper

**File: `src/index.css`** (line 1353)

```css
/* Before */
.tru-hero-wrapper {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  overflow-y: visible;
  min-height: 100vh;
}

/* After */
.tru-hero-wrapper {
  position: relative;
  width: 100%;
  /* overflow-x removed to allow content to extend beyond edges */
  min-height: 100vh;
}
```

### Change 2: Remove overflow from hero split section

**File: `src/index.css`** (line 24574-24577)

This was already addressed in a previous fix but needs confirmation.

```css
/* Before */
.tru-hero.tru-hero-split {
  position: relative;
  overflow: hidden;
}

/* After */
.tru-hero.tru-hero-split {
  position: relative;
  /* overflow: hidden removed */
}
```

### Change 3: Remove overflow from move summary modal

**File: `src/index.css`** (line 98)

```css
/* Before - line 98 */
overflow: hidden;

/* After */
/* Line removed - no overflow restriction on modal */
```

---

## Summary of Changes

| File | Line | Change |
|------|------|--------|
| `src/index.css` | 1353-1354 | Remove `overflow-x: hidden` and `overflow-y: visible` from `.tru-hero-wrapper` |
| `src/index.css` | 24576 | Verify `overflow: hidden` is removed from `.tru-hero.tru-hero-split` |
| `src/index.css` | 98 | Remove `overflow: hidden` from `.tru-move-summary-modal` |

---

## Expected Result

- The "Building your personalized move profile" modal will display fully without being clipped on any side
- Feature carousel hover effects will expand beyond card boundaries without clipping
- All page content will be allowed to extend naturally without artificial horizontal constraints
- The page will still maintain proper visual bounds through normal layout flow

