
# Stack Step Cards Vertically on Left Side

## Overview
Change the step cards from horizontal row layout to vertical stack layout, while keeping the scanner demo and live inventory on the right side.

---

## Current Layout

```text
┌─────────────────────────────────────────────────────────────────┐
│   Steps as 3 HORIZONTAL cards   │   Scanner + Detection stacked │
│   ┌─────┐ ┌─────┐ ┌─────┐      │                               │
│   │  1  │ │  2  │ │  3  │      │                               │
│   └─────┘ └─────┘ └─────┘      │                               │
└─────────────────────────────────┴───────────────────────────────┘
```

---

## Target Layout

```text
┌─────────────────────────────────────────────────────────────────┐
│   Steps VERTICAL   │   Scanner + Detection stacked              │
│   ┌─────────────┐  │   ┌─────────────────────────────────────┐  │
│   │      1      │  │   │         Scanner Preview             │  │
│   └─────────────┘  │   ├─────────────────────────────────────┤  │
│   ┌─────────────┐  │   │         Live Detection List         │  │
│   │      2      │  │   └─────────────────────────────────────┘  │
│   └─────────────┘  │                                            │
│   ┌─────────────┐  │                                            │
│   │      3      │  │                                            │
│   └─────────────┘  │                                            │
└─────────────────────┴───────────────────────────────────────────┘
```

---

## Technical Changes

### File: `src/pages/Index.tsx`

Rename the class from `tru-ai-steps-horizontal` to `tru-ai-steps-vertical`:

```jsx
<div className="tru-ai-steps-vertical">
```

### File: `src/index.css`

Update the steps container to use vertical layout:

**Before:**
```css
.tru-ai-steps-horizontal {
  display: flex;
  flex-direction: row;
  gap: 16px;
  height: 100%;
}
```

**After:**
```css
.tru-ai-steps-vertical {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}
```

Update the step card styling for vertical layout:

**Before:**
```css
.tru-ai-step-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 16px;
  ...
}
```

**After:**
```css
.tru-ai-step-card {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  padding: 20px 24px;
  gap: 16px;
  ...
}

.tru-ai-step-card .tru-ai-step-number {
  margin-bottom: 0;
  flex-shrink: 0;
}

.tru-ai-step-card .tru-ai-step-content {
  text-align: left;
}
```

---

## Summary

| Element | Before | After |
|---------|--------|-------|
| Steps container | `flex-direction: row` | `flex-direction: column` |
| Step card layout | Vertical (number on top) | Horizontal (number on left) |
| Step card text | Centered | Left-aligned |
| Step card padding | `24px 16px` | `20px 24px` |

---

## Files Modified
- `src/pages/Index.tsx` - Change class name to `tru-ai-steps-vertical`
- `src/index.css` - Update flex direction and step card layout for vertical stacking
