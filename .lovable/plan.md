
# Make Scanner Preview Taller and Wider

## Overview
Increase the dimensions of the AI Scanner Preview component to make it more prominent and visually impactful in the AI Move Estimator section.

---

## Current State

| Property | Current Value |
|----------|---------------|
| Scanner width | 350px |
| Scanner height | 275px |
| Grid column width | 350px |

---

## Changes Required

### 1. Increase Scanner Container Dimensions
**File: `src/index.css` (Lines 2391-2398)**

Increase both width and height for a larger scanner preview:

```css
/* Before */
.tru-ai-live-scanner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 275px;
  width: 350px;
  border: 1px solid hsl(var(--border));
}

/* After */
.tru-ai-live-scanner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 340px;
  width: 420px;
  border: 1px solid hsl(var(--border));
}
```

### 2. Update Grid Column Width for Center Column
**File: `src/index.css` (Lines 2586-2596)**

Adjust the grid template to accommodate the wider scanner:

```css
/* Before */
.tru-ai-two-column {
  display: grid;
  grid-template-columns: auto 350px 350px;
  gap: 16px;
  /* ... */
}

/* After */
.tru-ai-two-column {
  display: grid;
  grid-template-columns: auto 420px 350px;
  gap: 16px;
  /* ... */
}
```

### 3. Update Center Column Min-Width
**File: `src/index.css` (Lines 2607-2614)**

Match the center column minimum width to the new scanner width:

```css
/* Before */
.tru-ai-center-column {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
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
}
```

### 4. Update Vertical Layout Scanner Height Override
**File: `src/index.css` (Lines 2644-2647)**

Update the height override in the vertical layout context:

```css
/* Before */
.tru-ai-preview-vertical .tru-ai-live-scanner {
  height: 275px;
  flex: none;
}

/* After */
.tru-ai-preview-vertical .tru-ai-live-scanner {
  height: 340px;
  flex: none;
}
```

---

## Technical Summary

| Property | Before | After | Change |
|----------|--------|-------|--------|
| Scanner width | 350px | 420px | +70px (+20%) |
| Scanner height | 275px | 340px | +65px (+24%) |
| Center column grid | 350px | 420px | +70px |
| Center column min-width | 350px | 420px | +70px |

The new dimensions (420x340px) provide a more prominent scanner preview while maintaining proper proportions and alignment with the detection list on the right.

---

### Files Modified
- `src/index.css` - Update scanner dimensions and grid layout
