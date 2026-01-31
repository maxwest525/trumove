
# Move Scanner & Detection to Left, Match Widths

## Overview
Reorganize the AI Move Estimator section to place the scanner and detection list on the left side, with both elements sharing the same 420px width.

---

## Current Layout

```text
| Steps (auto) | Scanner (420px) | Detection (350px) |
```

## Target Layout

```text
| Scanner (420px) | Detection (420px) | Steps (auto) |
```

---

## Changes Required

### 1. Update Grid Column Order
**File: `src/index.css` (Lines 2678-2687)**

Change the grid template to place scanner and detection first, steps last:

```css
/* Before */
.tru-ai-two-column {
  display: grid;
  grid-template-columns: auto 420px 350px;
  ...
}

/* After */
.tru-ai-two-column {
  display: grid;
  grid-template-columns: 420px 420px auto;
  ...
}
```

### 2. Update Detection Column Width
**File: `src/index.css` (Lines 2708-2714)**

Match the right column width to the scanner width:

```css
/* Before */
.tru-ai-right-column {
  min-width: 350px;
  ...
}

/* After */
.tru-ai-right-column {
  min-width: 420px;
  ...
}
```

### 3. Update Live Inventory Width
**File: `src/index.css`**

Ensure the inventory list fills the new 420px column:

```css
.tru-ai-live-inventory {
  width: 420px;
}
```

### 4. Reorder JSX Elements
**File: `src/pages/Index.tsx` (Lines 1567-1621)**

Move the scanner and detection columns before the steps column in the JSX:

```tsx
{/* Before order: Steps | Scanner | Detection */}
{/* After order: Scanner | Detection | Steps */}

<div className="tru-ai-two-column" ref={scanPreviewRef}>
  {/* First: Scanner preview */}
  <div className={`tru-ai-center-column ...`}>
    <ScannerPreview ... />
  </div>
  
  {/* Second: Detection list */}
  <div className={`tru-ai-right-column ...`}>
    <DetectionList ... />
  </div>
  
  {/* Third: Vertical steps */}
  <div className="tru-ai-left-column">
    ...steps...
  </div>
</div>
```

---

## Technical Summary

| Element | Before | After |
|---------|--------|-------|
| Column order | Steps → Scanner → Detection | Scanner → Detection → Steps |
| Scanner width | 420px | 420px (unchanged) |
| Detection width | 350px | 420px |
| Grid template | `auto 420px 350px` | `420px 420px auto` |

---

### Files Modified
- `src/pages/Index.tsx` - Reorder JSX columns
- `src/index.css` - Update grid template and column widths
