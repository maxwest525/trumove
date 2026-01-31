
# Reorganize AI Move Estimator Section Layout

## Overview
Restructure the AI Move Estimator section to place the steps on the left side as horizontal cards, and move the scanner preview with live detection to the right side.

---

## Current Layout Structure

```text
┌─────────────────────────────────────────────────────────────────┐
│                     AI Move Estimator                           │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Scanner (col1) │  Detection (col2)│  Steps 1,2,3 vertical (col3)│
│    420px        │     420px        │       auto                  │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

---

## Target Layout

```text
┌─────────────────────────────────────────────────────────────────┐
│                     AI Move Estimator                           │
├─────────────────────────────────┬───────────────────────────────┤
│   Steps as 3 horizontal cards   │   Scanner + Detection stacked │
│   (left side, full width row)   │   (right side, vertical)      │
│                                 │                               │
│   ┌─────┐ ┌─────┐ ┌─────┐      │   ┌─────────────────────────┐ │
│   │  1  │ │  2  │ │  3  │      │   │   Scanner Preview       │ │
│   └─────┘ └─────┘ └─────┘      │   ├─────────────────────────┤ │
│                                 │   │   Live Detection List   │ │
│                                 │   └─────────────────────────┘ │
└─────────────────────────────────┴───────────────────────────────┘
```

---

## Changes Required

### 1. Update JSX Layout (`src/pages/Index.tsx`)

**Reorder columns:**
- Move steps column to be FIRST (left side)
- Change steps from vertical stack to horizontal row
- Remove preview thumbnail images from steps
- Keep scanner + detection stacked together on the RIGHT

### 2. Update CSS Grid (`src/index.css`)

**Grid changes:**
- Change from `grid-template-columns: 420px 420px auto` 
- To `grid-template-columns: 1fr 420px` (steps take flexible space, scanner fixed)

**Steps layout:**
- Change `.tru-ai-steps-vertical` from `flex-direction: column` to `flex-direction: row`
- Make steps wider cards with equal flex distribution
- Remove preview thumbnail styling dependency

---

## Technical Implementation

### File: `src/pages/Index.tsx` (Lines 1567-1622)

Restructure the grid layout:

```jsx
{/* Two-column layout: Steps | Scanner+Detection */}
<div className="tru-ai-two-column" ref={scanPreviewRef}>
  {/* LEFT: Steps as horizontal cards */}
  <div className="tru-ai-left-column">
    <div className="tru-ai-steps-horizontal">
      <div className="tru-ai-step-card">
        <div className="tru-ai-step-number">1</div>
        <div className="tru-ai-step-content">
          <h3 className="tru-ai-step-title">Video or Photos</h3>
          <p className="tru-ai-step-desc">Walk through rooms with your camera or upload photos.</p>
        </div>
      </div>
      <div className="tru-ai-step-card">
        <div className="tru-ai-step-number">2</div>
        <div className="tru-ai-step-content">
          <h3 className="tru-ai-step-title">AI Detection</h3>
          <p className="tru-ai-step-desc">Computer vision identifies items and estimates weight/volume.</p>
        </div>
      </div>
      <div className="tru-ai-step-card">
        <div className="tru-ai-step-number">3</div>
        <div className="tru-ai-step-content">
          <h3 className="tru-ai-step-title">Agent Confirmation</h3>
          <p className="tru-ai-step-desc">A live specialist reviews to ensure accuracy.</p>
        </div>
      </div>
    </div>
  </div>
  
  {/* RIGHT: Scanner + Detection stacked */}
  <div className={`tru-ai-right-column tru-ai-preview-vertical ${scanDemoRunning ? 'is-running' : ''}`}>
    <ScannerPreview ... />
    <DetectionList ... />
  </div>
</div>
```

### File: `src/index.css`

**Update grid layout:**

```css
.tru-ai-two-column {
  display: grid;
  grid-template-columns: 1fr 420px;  /* Steps flexible, scanner fixed */
  gap: 32px;
  align-items: stretch;
}
```

**Add horizontal steps layout:**

```css
.tru-ai-steps-horizontal {
  display: flex;
  flex-direction: row;
  gap: 16px;
  height: 100%;
}

.tru-ai-step-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 16px;
  background: hsl(var(--muted) / 0.3);
  border-radius: 12px;
  border: 1px solid hsl(var(--border) / 0.5);
  transition: all 0.2s ease;
}

.tru-ai-step-card:hover {
  background: hsl(var(--muted) / 0.5);
  border-color: hsl(var(--primary) / 0.3);
}

.tru-ai-step-card .tru-ai-step-number {
  margin-bottom: 12px;
}

.tru-ai-step-card .tru-ai-step-content {
  text-align: center;
}
```

---

## Summary of Changes

| Element | Before | After |
|---------|--------|-------|
| Grid columns | `420px 420px auto` | `1fr 420px` |
| Steps position | Right side (3rd column) | Left side (1st column) |
| Steps direction | Vertical stack | Horizontal row |
| Preview thumbnails | Present in each step | Removed |
| Scanner/Detection | Two separate columns | Stacked in single right column |
| Step card width | Auto (compressed) | Equal flex (1/3 each) |

---

## Files Modified

- `src/pages/Index.tsx` - Restructure column order and remove thumbnail images
- `src/index.css` - Update grid template and add horizontal step card styling
