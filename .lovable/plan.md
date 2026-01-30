

# Expand AI Inventory Analysis to 550px with Horizontal Step Layout

## Summary

Increase the AI Inventory Analysis section height from 350px to 550px and rearrange the 3 step items to display horizontally (side-by-side) instead of vertically, so all content is visible without being cut off.

---

## Current State

- Section has `max-height: 350px` with `overflow: hidden`
- Steps are in a vertical column layout (`.tru-ai-steps-vertical` with `flex-direction: column`)
- Two-column grid: left column has vertical steps, right column has scanner preview

---

## Implementation

### File: `src/index.css`

**1. Increase section height (Line 2274)**

```css
/* Before */
max-height: 350px;

/* After */
max-height: 550px;
```

**2. Change two-column layout to single column (Lines 2577-2584)**

Convert the grid to a stacked layout so steps can span the full width horizontally:

```css
.tru-ai-two-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: stretch;
  margin-bottom: 0;
  text-align: left;
}
```

**3. Convert vertical steps to horizontal row (Lines 2661-2665)**

```css
.tru-ai-steps-vertical {
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: center;
}
```

**4. Make each step card flex evenly (Lines 2638-2642)**

```css
.tru-ai-step-with-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  text-align: center;
}
```

**5. Increase thumbnail sizes for horizontal layout (Lines 2644-2652)**

```css
.tru-ai-step-preview {
  width: 120px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid hsl(var(--tm-ink) / 0.12);
  background: hsl(var(--muted) / 0.3);
}
```

**6. Increase scanner preview height (Line 2605)**

```css
.tru-ai-preview-vertical .tru-ai-live-scanner {
  height: 280px;
}
```

**7. Increase inventory list height (Lines 2608-2611)**

```css
.tru-ai-preview-vertical .tru-ai-live-inventory {
  min-height: 0;
  max-height: 150px;
}
```

---

## Visual Layout Change

```text
┌─────────────────────────────────────────────────────────────┐
│                   AI Inventory Analysis                      │
│              Subtitle text centered here                     │
│              [Start Demo AI Analysis]                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐     ┌─────────┐     ┌─────────┐                │
│  │  Img 1  │     │  Img 2  │     │  Img 3  │   ← Steps now  │
│  └─────────┘     └─────────┘     └─────────┘     horizontal │
│   Step 1          Step 2          Step 3                     │
│   Desc            Desc            Desc                       │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Live Scanner Preview (280px)               │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Inventory List (150px max)                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary Table

| Element | Before | After |
|---------|--------|-------|
| Section max-height | 350px | 550px |
| Steps layout | Vertical column | Horizontal row |
| Step thumbnails | 80x60px | 120x90px |
| Scanner height | 180px | 280px |
| Inventory max-height | 100px | 150px |
| Two-column grid | 0.6fr / 1.4fr | Single column stacked |

