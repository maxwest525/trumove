
# AI Inventory Analysis - Three-Column Layout at 400px Height

## Summary

Restructure the AI Inventory Analysis section into a three-column layout matching the provided reference image, with a total section height of 400px:

- **Left column**: Vertical steps with thumbnails on the left side of each step, numbered badges, and descriptions
- **Middle column**: Room scanner preview with "Demo" pill badge
- **Right column**: "LIVE DETECTION" card with detected items list and totals

---

## Current vs Target Layout

```text
CURRENT (Stacked):
┌─────────────────────────────────────────────────────────────┐
│              AI Inventory Analysis                          │
│              [Start Demo AI Analysis]                       │
├─────────────────────────────────────────────────────────────┤
│  Step 1     Step 2     Step 3   ← Horizontal row            │
├─────────────────────────────────────────────────────────────┤
│           Scanner + Detection stacked                       │
└─────────────────────────────────────────────────────────────┘

TARGET (Three-Column):
┌─────────────────────────────────────────────────────────────┐
│              AI Inventory Analysis                          │
│              [Start Demo AI Analysis]                       │
├───────────────┬────────────────────────┬────────────────────┤
│  [img] 1 Step │                        │   LIVE DETECTION   │
│  [img] 2 Step │   Room Scanner with    │   - Item 1         │
│  [img] 3 Step │   "Demo" pill          │   - Item 2         │
│      ↓        │                        │   Items/Wt/Vol     │
│   Vertical    │       (Center)         │     (Right)        │
└───────────────┴────────────────────────┴────────────────────┘
```

---

## Implementation

### File: `src/index.css`

**1. Reduce section height to 400px (Line 2274)**

```css
/* Before */
max-height: 550px;

/* After */
max-height: 400px;
```

**2. Change two-column layout to three-column grid (Lines 2577-2584)**

```css
.tru-ai-two-column {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 24px;
  align-items: stretch;
  margin-bottom: 0;
  text-align: left;
}
```

**3. Revert steps to vertical column layout (Lines 2664-2668)**

```css
.tru-ai-steps-vertical {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
```

**4. Update step layout to row format with thumbnail on left (Lines 2638-2645)**

Each step becomes a horizontal row: thumbnail | number | text

```css
.tru-ai-step-with-preview {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
}
```

**5. Reduce thumbnail size for vertical steps (Lines 2647-2655)**

```css
.tru-ai-step-preview {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid hsl(var(--tm-ink) / 0.12);
  background: hsl(var(--muted) / 0.3);
}
```

**6. Adjust scanner size for center column (Line 2605)**

```css
.tru-ai-preview-vertical .tru-ai-live-scanner {
  height: 220px;
}
```

**7. Adjust inventory list for right column (Lines 2608-2611)**

```css
.tru-ai-preview-vertical .tru-ai-live-inventory {
  min-height: 0;
  max-height: 220px;
}
```

---

### File: `src/pages/Index.tsx`

**8. Restructure HTML to split scanner and detection into separate columns (Lines 1556-1607)**

Change the component structure from:
- Two columns: Steps | (Scanner + Detection stacked)

To:
- Three columns: Steps | Scanner | Detection

The `LiveScanPreview` component currently renders both scanner and detection together. We need to modify the layout so:
- Left column: Steps (vertical)
- Middle column: Scanner only
- Right column: Detection card only

This requires either:
- Option A: Split `LiveScanPreview` into two separate components
- Option B: Render scanner and detection as separate JSX blocks inline

For simplicity, we'll extract the scanner and detection as inline JSX in Index.tsx.

---

## Summary Table

| Element | Before | After |
|---------|--------|-------|
| Section height | 550px | 400px |
| Layout | Stacked (column) | Three-column grid |
| Steps direction | Horizontal row | Vertical column |
| Step layout | Column (img on top) | Row (img on left) |
| Thumbnail size | 120x90px | 80x60px |
| Scanner height | 280px | 220px |
| Detection column | Stacked with scanner | Separate right column |
