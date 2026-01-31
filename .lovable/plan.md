

# Move Scanner Preview & Detection to Right of Centered Header

## Overview
Reposition the scanner preview and live detection boxes to the right side of the AI Move Estimator section header, while keeping the title centered. The previews will sit in the same row as the header, aligned vertically.

---

## Target Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                                         │                                   │
│       AI Move Estimator                 │  Scanner   │  Live Detection     │
│       ────────────                      │  Preview   │       List          │
│        (centered)                       │            │                     │
│                                         │            │                     │
├─────────────────────────────────────────┴────────────┴─────────────────────┤
│              Steps 1, 2, 3 (unchanged - kept in current position)          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Changes

### File: `src/pages/Index.tsx` (Lines 1555-1611)

Restructure the section to create a header row:

**Current Structure:**
```jsx
<section className="tru-ai-steps-section">
  <div className="tru-ai-steps-inner">
    <h2 className="tru-ai-steps-title">AI Move Estimator</h2>
    <div className="tru-ai-accent-line" />
    <div className="tru-ai-two-column">
      {/* LEFT: Steps */}
      {/* RIGHT: Scanner + Detection */}
    </div>
  </div>
</section>
```

**New Structure:**
```jsx
<section className="tru-ai-steps-section">
  <div className="tru-ai-steps-inner">
    {/* Header row: centered title with previews on right */}
    <div className="tru-ai-header-row" ref={scanPreviewRef}>
      <div className="tru-ai-header-center">
        <h2 className="tru-ai-steps-title">
          <span className="tru-ai-gradient-text">AI</span> Move Estimator
        </h2>
        <div className="tru-ai-accent-line" />
      </div>
      <div className={`tru-ai-header-previews ${scanDemoRunning ? 'is-running' : ''}`}>
        <ScannerPreview ... />
        <DetectionList ... />
      </div>
    </div>
    {/* Steps below - unchanged */}
    <div className="tru-ai-steps-content">
      <div className="tru-ai-steps-vertical">
        {/* Step 1, 2, 3 cards - unchanged */}
      </div>
    </div>
  </div>
</section>
```

### File: `src/index.css`

**Add new header row styling:**

```css
/* Header row: centered title with previews on right */
.tru-ai-header-row {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 16px;
  min-height: 280px;
}

/* Centered title container - takes full width, text centered */
.tru-ai-header-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 700px; /* Offset for previews on right */
}

.tru-ai-header-center .tru-ai-steps-title {
  text-align: center;
  margin-bottom: 8px;
}

.tru-ai-header-center .tru-ai-accent-line {
  margin: 0 auto;
}

/* Previews container - absolute right */
.tru-ai-header-previews {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.tru-ai-header-previews .tru-ai-live-scanner {
  width: 350px;
  height: 260px;
}

.tru-ai-header-previews .tru-ai-live-inventory {
  width: 280px;
  height: 260px;
}
```

**Update section height and adjust steps container:**

```css
.tru-ai-steps-section {
  height: auto;
  min-height: 500px;
}

.tru-ai-steps-content {
  width: 100%;
}
```

---

## Summary of Changes

| Element | Before | After |
|---------|--------|-------|
| Title position | Centered above grid | Centered in header row |
| Accent line | Below centered title | Below centered title (unchanged) |
| Scanner/Detection | Below title in grid right column | Absolute right side of header row |
| Preview alignment | Stacked/horizontal in grid | Side-by-side, vertically centered with header |
| Preview sizes | 340px height | 260px height (to fit header row) |
| Steps | In left column of grid | Full-width container below header |

---

## Files Modified
- `src/pages/Index.tsx` - Restructure JSX to create header row with centered title and right-aligned previews
- `src/index.css` - Add `.tru-ai-header-row`, `.tru-ai-header-center`, and `.tru-ai-header-previews` styling

