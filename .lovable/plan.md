
# Improve Steps Section Readability and Layout

## Overview
Redesign the vertical steps in the AI Move Estimator section to be more visually appealing and easier to read. The current design has small text, cramped spacing, and thin styling that makes it hard to scan quickly.

---

## Current Issues

| Problem | Current State |
|---------|--------------|
| Small text | Title 13px, description 11px |
| Cramped layout | 12px gap between steps |
| Thin step numbers | 32px circles with light borders |
| Low contrast descriptions | 60% opacity text |
| Preview thumbnails too small | 80x60px images |

---

## Proposed Changes

### 1. Card-Based Step Design
Transform each step into a distinct card with subtle background and hover state:

```css
.tru-ai-step-with-preview {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: hsl(var(--muted) / 0.3);
  border-radius: 12px;
  border: 1px solid hsl(var(--border) / 0.5);
  transition: all 0.2s ease;
}

.tru-ai-step-with-preview:hover {
  background: hsl(var(--muted) / 0.5);
  border-color: hsl(var(--primary) / 0.3);
}
```

### 2. Larger, Bolder Step Numbers
Make step numbers more prominent with primary color accent:

```css
.tru-ai-step-number {
  width: 36px;
  height: 36px;
  background: hsl(var(--foreground));
  color: hsl(var(--background));
  font-size: 16px;
  font-weight: 800;
  border: none;
}
```

### 3. Improved Typography
Increase text sizes and improve contrast:

```css
.tru-ai-step-title {
  font-size: 15px;
  font-weight: 700;
}

.tru-ai-step-desc {
  font-size: 13px;
  color: hsl(var(--tm-ink) / 0.75);
  line-height: 1.4;
}
```

### 4. Larger Preview Thumbnails
Increase thumbnail size for better visibility:

```css
.tru-ai-step-preview {
  width: 72px;
  height: 54px;
  border-radius: 8px;
  border: 2px solid hsl(var(--border));
}
```

### 5. Better Spacing
Increase gap between steps for breathing room:

```css
.tru-ai-steps-vertical {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

### 6. Remove Preview Thumbnails (Optional Simplification)
Given the steps are now on the right side with limited space, consider removing the preview thumbnails to simplify the layout and make it cleaner. This would require a JSX change as well.

---

## Visual Comparison

| Element | Before | After |
|---------|--------|-------|
| Step background | None | Subtle muted card |
| Step number size | 32px | 36px |
| Step number style | Light border, transparent | Solid black fill |
| Title font size | 13px | 15px |
| Description size | 11px | 13px |
| Description opacity | 60% | 75% |
| Gap between steps | 12px | 16px |
| Step padding | None | 16px |

---

## Technical Summary

### Files Modified
- `src/index.css` - Update step styling (card backgrounds, larger typography, better spacing)
- `src/pages/Index.tsx` - Optionally simplify by removing preview thumbnails

### Key CSS Changes
1. Add card background and border to `.tru-ai-step-with-preview`
2. Enlarge and style `.tru-ai-step-number` with solid fill
3. Increase font sizes in `.tru-ai-step-title` and `.tru-ai-step-desc`
4. Improve contrast on description text
5. Increase vertical gap in `.tru-ai-steps-vertical`
