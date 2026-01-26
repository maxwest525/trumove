
# Feature Carousel Redesign Plan

## Overview
Redesign the feature carousel to be more text-focused and readable, and constrain it to align with the main form container rather than spanning edge-to-edge.

## Current Issues
1. **Images are too dominant** - The large preview images (180px+ height) overpower the text content
2. **Full-bleed layout** - The carousel spans 100vw which doesn't align with the form box above it
3. **Readability** - Text is secondary to the large image previews

## Proposed Changes

### 1. Container Alignment
Constrain the carousel to match the content width of the page (max-width: 1480px with padding) instead of full viewport width. This will make the left edge of the carousel align with the left edge of the form.

```text
Current Layout:
|<------ 100vw full viewport ------>|
|[Card 1][Card 2][Card 3]           |

Proposed Layout:
     |<---- 1480px max-width ---->|
     |[Card 1][Card 2][Card 3]    |
     ^
     Aligns with form left edge
```

### 2. Card Redesign - Text-First Layout
- **Reduce image size**: Shrink preview images from ~180px to ~80px (thumbnail size)
- **Move image to inline position**: Place the image thumbnail next to the icon/text instead of below
- **Increase text prominence**: Larger title (1.125rem), more visible description
- **Keep vertical separators**: Maintain the edge-to-edge look within the constrained container

### 3. Visual Structure
```text
┌─────────────────────┬─────────────────────┬─────────────────────┐
│ [Icon] Title        │ [Icon] Title        │ [Icon] Title        │
│        Description  │        Description  │        Description  │
│                     │                     │                     │
│        [Thumbnail]  │        [Thumbnail]  │        [Thumbnail]  │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

---

## Technical Implementation

### File Changes

#### 1. `src/index.css` - Carousel Container
- Remove full-viewport breakout (remove `left: 50%`, `margin-left: -50vw`)
- Set `max-width: 1480px` and `margin: 0 auto` with horizontal padding
- Keep borders and background styling

#### 2. `src/index.css` - Card Layout
- Reduce `.tru-preview-always-visible` min-height from 180px to 80px
- Add `max-height: 100px` to preview images
- Adjust card padding and spacing for better text hierarchy
- Increase title font size to 1.125rem
- Add more prominent description styling

#### 3. `src/index.css` - Responsive Adjustments
- Ensure the 3-column layout still works within the constrained width
- Adjust mobile breakpoints as needed

### Summary of CSS Changes
1. `.tru-feature-carousel-fullwidth`: Remove viewport-width tricks, add max-width + padding
2. `.tru-preview-always-visible`: Reduce min-height to 80px
3. `.tru-value-card-carousel-preview img`: Add max-height constraint
4. `.tru-value-card-title`: Increase font size
5. `.tru-value-card-desc`: Improve line-height and visibility
