

# Constrain AI Inventory Analysis Section to 350px

## Overview

The AI Inventory Analysis section currently has no fixed height and expands based on content. To fit within 350px, we need to:

1. Set a fixed maximum height of 350px on the section
2. Significantly reduce element sizes (title, thumbnails, spacing)
3. Make the content more compact while preserving readability

---

## Current Layout Analysis

The section currently contains:
- Title ("AI Inventory Analysis") - 36px font
- Accent line
- Subtitle - 18px font with 32px margin-bottom
- "Start Demo AI Analysis" button with 32px margin-bottom
- Two-column grid with 32px bottom margin:
  - Left: 3 step cards (each with 150x112px thumbnails)
  - Right: Live scanner preview (~280px height + inventory list)

**Estimated current height:** 600-700px+

---

## Implementation Plan

### File: `src/index.css`

**1. Add fixed height constraint to section container (Line 2268-2274)**

```css
.tru-ai-steps-section {
  padding: 16px 24px 20px;  /* Reduced from 20px 24px 32px */
  margin-top: 0;
  background: hsl(var(--background));
  position: relative;
  z-index: 5;
  max-height: 350px;
  overflow: hidden;
}
```

**2. Reduce title size (Line 2565-2572)**

```css
.tru-ai-steps-title {
  font-size: 24px;  /* Reduced from 36px */
  font-weight: 800;
  color: hsl(var(--foreground));
  margin-bottom: 6px;  /* Reduced from 12px */
  letter-spacing: -0.02em;
  text-align: center;
}
```

**3. Make subtitle more compact (Line 2277-2288)**

```css
.tru-ai-steps-subtitle {
  font-size: 14px;  /* Reduced from 18px */
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  text-align: center;
  margin-bottom: 12px;  /* Reduced from 32px */
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.4;
  letter-spacing: -0.01em;
}
```

**4. Compact the demo button (Line 2611-2626)**

```css
.tru-ai-demo-button-centered {
  /* ... existing styles ... */
  padding: 10px 20px;  /* Reduced from 14px 28px */
  font-size: 13px;  /* Reduced from 14px */
  margin: 10px auto 16px;  /* Reduced from 20px auto 32px */
}
```

**5. Shrink step preview thumbnails (Line 2641-2649)**

```css
.tru-ai-step-preview {
  width: 80px;   /* Reduced from 150px */
  height: 60px;  /* Reduced from 112px */
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid hsl(var(--tm-ink) / 0.12);
  background: hsl(var(--muted) / 0.3);
}
```

**6. Reduce two-column layout spacing (Line 2574-2582)**

```css
.tru-ai-two-column {
  display: grid;
  grid-template-columns: 0.6fr 1.4fr;
  gap: 20px;  /* Reduced from 40px */
  align-items: start;
  margin-bottom: 0;  /* Reduced from 32px */
  text-align: left;
}
```

**7. Reduce vertical step gaps (Line 2657-2662)**

```css
.tru-ai-steps-vertical {
  display: flex;
  flex-direction: column;
  gap: 8px;  /* Reduced from 16px */
}
```

**8. Reduce step content text sizes (search for .tru-ai-step-title and .tru-ai-step-desc)**

```css
.tru-ai-step-title {
  font-size: 13px;  /* Smaller */
}

.tru-ai-step-desc {
  font-size: 11px;  /* Smaller */
  line-height: 1.3;
}
```

**9. Reduce scanner preview height (Line 2602-2608)**

```css
.tru-ai-preview-vertical .tru-ai-live-scanner {
  height: 180px;  /* Reduced from 280px */
}

.tru-ai-preview-vertical .tru-ai-live-inventory {
  min-height: 0;  /* Remove min-height constraint */
  max-height: 100px;  /* Constrain inventory list */
}
```

---

## Summary Table

| Element | Before | After |
|---------|--------|-------|
| Section padding | 20px 24px 32px | 16px 24px 20px |
| Section max-height | none | 350px |
| Title font | 36px | 24px |
| Subtitle font | 18px | 14px |
| Button padding | 14px 28px | 10px 20px |
| Thumbnail size | 150x112px | 80x60px |
| Column gap | 40px | 20px |
| Step gap | 16px | 8px |
| Scanner height | 280px | 180px |

---

## Expected Result

The entire AI Inventory Analysis section will fit within a 350px height constraint while maintaining all functionality and readability. Content will be more compact but still visually balanced.

