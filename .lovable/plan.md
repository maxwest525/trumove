
# Center Header and Position Steps on Left

## Overview
Center the "AI Move Estimator" header in the section and position the steps 1, 2, 3 on the left side with fixed dimensions of 250px width and 60px height.

---

## Target Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─────┐       AI Move Estimator         ┌──────────┐ ┌──────────────┐      │
│  │  1  │       ────────────              │ Scanner  │ │    Live      │      │
│  └─────┘        (centered)               │ Preview  │ │  Detection   │      │
│  ┌─────┐                                 │          │ │              │      │
│  │  2  │                                 │          │ │              │      │
│  └─────┘                                 └──────────┘ └──────────────┘      │
│  ┌─────┐                                                                    │
│  │  3  │                                                                    │
│  └─────┘                                                                    │
│  250px                                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Changes

### File: `src/pages/Index.tsx` (Lines 1555-1605)

Restructure the section to place steps on the left side of the header row:

**Current Structure:**
```jsx
<div className="tru-ai-header-row">
  <div className="tru-ai-header-center">...</div>
  <div className="tru-ai-header-previews">...</div>
</div>
<div className="tru-ai-steps-content">
  <div className="tru-ai-steps-vertical">...</div>
</div>
```

**New Structure:**
```jsx
<div className="tru-ai-header-row">
  {/* Steps on left */}
  <div className="tru-ai-steps-left">
    <div className="tru-ai-step-card">...</div>
    <div className="tru-ai-step-card">...</div>
    <div className="tru-ai-step-card">...</div>
  </div>
  {/* Centered title */}
  <div className="tru-ai-header-center">
    <h2>AI Move Estimator</h2>
    <div className="tru-ai-accent-line" />
  </div>
  {/* Previews on right */}
  <div className="tru-ai-header-previews">...</div>
</div>
```

### File: `src/index.css`

**Update header center to remove padding offset:**

```css
.tru-ai-header-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* Remove padding-right offset */
}
```

**Add steps left container:**

```css
.tru-ai-steps-left {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 250px;
}
```

**Update step card dimensions:**

```css
.tru-ai-step-card {
  width: 250px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 16px;
  gap: 12px;
  background: hsl(var(--muted) / 0.3);
  border-radius: 10px;
  border: 1px solid hsl(var(--border) / 0.5);
}

.tru-ai-step-card .tru-ai-step-content {
  display: block; /* Show content */
}
```

---

## Summary of Changes

| Element | Before | After |
|---------|--------|-------|
| Header center | `padding-right: 700px` | No padding, truly centered |
| Steps position | Below header row | Absolute left of header row |
| Step card width | `flex: 1` | `250px` fixed |
| Step card height | Variable | `60px` fixed |
| Step content | Hidden | Visible |

---

## Files Modified
- `src/pages/Index.tsx` - Move steps into header row, position on left
- `src/index.css` - Add `.tru-ai-steps-left`, update `.tru-ai-header-center`, update `.tru-ai-step-card` dimensions
