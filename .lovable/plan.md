

# Rename Section & Reposition Scanner with Matching Detection

## Overview
This plan renames "AI Inventory Analysis" to "AI Move Estimator" and repositions the scanner preview to sit on the right side of the layout, with the Live Detection panel matching the scanner dimensions exactly.

---

## Changes Required

### 1. Rename Section Title
**File: `src/pages/Index.tsx` (Line 1533)**

Change:
```jsx
<span className="tru-ai-gradient-text">AI</span> Inventory Analysis
```

To:
```jsx
<span className="tru-ai-gradient-text">AI</span> Move Estimator
```

---

### 2. Reorder Grid Columns - Steps | Detection | Scanner
**File: `src/pages/Index.tsx` (Lines 1541-1595)**

Swap the center and right columns so the scanner sits on the far right:

| Current Order | New Order |
|---------------|-----------|
| Steps (left) | Steps (left) |
| Scanner (center) | Detection (center) |
| Detection (right) | Scanner (right) |

---

### 3. Update Grid Layout for Right-Aligned Scanner
**File: `src/index.css` (Line 2583)**

Change grid template to place scanner on right with fixed width:

```css
/* Before */
grid-template-columns: auto 1fr auto;

/* After */
grid-template-columns: auto 1fr 350px;
```

This ensures the scanner column is exactly 350px wide on the right.

---

### 4. Match Live Detection Dimensions to Scanner
**File: `src/index.css`**

Update `.tru-ai-live-inventory` to match scanner dimensions (350x275):

| Property | Before | After |
|----------|--------|-------|
| width | (flexible) | 350px |
| height | 200px | 275px |

---

## Technical Summary

```text
┌─────────────────────────────────────────────────────────┐
│                    AI Move Estimator                     │
├──────────────┬────────────────────┬─────────────────────┤
│   Steps      │   Live Detection   │   Scanner Preview   │
│   (auto)     │      (1fr)         │      (350px)        │
│              │   350 x 275px      │    350 x 275px      │
└──────────────┴────────────────────┴─────────────────────┘
```

### Files Modified
- `src/pages/Index.tsx` - Rename title, reorder columns
- `src/index.css` - Update grid template, match detection dimensions

