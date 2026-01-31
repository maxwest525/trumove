
# Reposition AI Scanner and Detection List Layout

## Overview
Reorganize the AI Inventory Analysis section to place the scanner preview directly below the "AI Move Estimator" title, with the Live Detection box positioned to the right of the scanner.

---

## Current Layout

```text
+----------------------------------------------------------+
|              AI Move Estimator (Title)                   |
|                  ─────────────── (accent line)           |
+----------------------------------------------------------+
| Steps Column   |   Detection List   |   Scanner Preview  |
| (Left)         |   (Center)         |   (Right)          |
+----------------------------------------------------------+
```

---

## Target Layout

```text
+----------------------------------------------------------+
|       AI Move Estimator    |                             |
|           ───────          |                             |
+----------------------------------------------------------+
| Steps Column   |   Scanner Preview  |   Detection List   |
| (Left)         |   (Center)         |   (Right)          |
+----------------------------------------------------------+
```

The scanner will be positioned right after the title/accent line, with the detection list immediately to its right.

---

## Changes Required

### 1. Update Three-Column Grid Order in Index.tsx
**File: `src/pages/Index.tsx` (Lines 1540-1595)**

Swap the order of the center and right columns so:
- Left column: Steps (unchanged)
- Center column: Scanner Preview (was right)
- Right column: Detection List (was center)

```tsx
{/* Three-column layout: Steps | Scanner | Detection */}
<div className="tru-ai-two-column" ref={scanPreviewRef}>
  {/* Left column: Vertical steps with preview thumbnails */}
  <div className="tru-ai-left-column">
    {/* ...existing steps content... */}
  </div>
  
  {/* Center column: Scanner preview (moved from right) */}
  <div className={`tru-ai-center-column tru-ai-preview-vertical ${scanDemoRunning ? 'is-running' : ''}`}>
    <ScannerPreview 
      isRunning={scanDemoRunning} 
      onStartDemo={() => {
        setScanDemoRunning(true);
        setTimeout(() => {
          scanPreviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }} 
    />
  </div>
  
  {/* Right column: Detection list (moved from center) */}
  <div className={`tru-ai-right-column tru-ai-preview-vertical ${scanDemoRunning ? 'is-running' : ''}`}>
    <DetectionList isRunning={scanDemoRunning} />
  </div>
</div>
```

### 2. Update CSS Grid Column Widths
**File: `src/index.css` (Lines 2586-2596)**

Adjust the grid template to give appropriate widths for the scanner and detection list:

```css
/* Before */
.tru-ai-two-column {
  display: grid;
  grid-template-columns: auto 1fr 350px;
  /* ... */
}

/* After */
.tru-ai-two-column {
  display: grid;
  grid-template-columns: auto 350px 350px;
  gap: 16px;
  /* ... */
}
```

### 3. Update Center Column Styles
**File: `src/index.css` (Lines 2607-2614)**

Adjust center column to properly contain the scanner:

```css
.tru-ai-center-column {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  min-width: 350px;
  height: 100%;
}
```

### 4. Update Right Column Styles
**File: `src/index.css` (Lines 2616-2621)**

Ensure right column properly contains the detection list:

```css
.tru-ai-right-column {
  display: flex;
  flex-direction: column;
  min-width: 350px;
  height: 100%;
}
```

---

## Technical Summary

| Change | Before | After |
|--------|--------|-------|
| Center column content | Detection List | Scanner Preview |
| Right column content | Scanner Preview | Detection List |
| Grid template | `auto 1fr 350px` | `auto 350px 350px` |

---

## Files Modified
- `src/pages/Index.tsx` - Swap component order in grid columns
- `src/index.css` - Update grid template columns and column widths
