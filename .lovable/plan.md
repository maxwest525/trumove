

# Plan: Close the Horizontal Gap in AI Analysis Section

## Current Issue

At both 80% and 100% zoom levels, there's a noticeable horizontal gap between the headline content (left side) and the demo preview panels (right side). The gap appears larger at lower zoom levels due to how the percentage-based widths scale.

## Root Cause

The current layout uses edge-based positioning:
- **Left content**: `left: 2rem` with `width: calc(42% - 2rem)` - starts 2rem from left edge
- **Right previews**: `right: 1rem` - starts 1rem from right edge

This leaves a variable-width gap in the center that grows as the viewport widens.

## Solution: Center-Relative Positioning

Instead of positioning from edges, position both elements relative to the center of the container. This keeps them close together regardless of viewport width.

### Changes to `.tru-ai-steps-left`

```css
.tru-ai-steps-left {
  position: absolute;
  /* Position relative to center, offset left */
  left: 50%;
  transform: translate(-100%, -50%); /* Move fully left of center point, and center vertically */
  margin-left: -2rem; /* Small gap from center */
  width: auto;
  max-width: 26rem; /* ~416px - enough for content */
  /* ... rest unchanged */
}
```

### Changes to `.tru-ai-header-previews`

```css
.tru-ai-header-previews {
  position: absolute;
  /* Position relative to center, offset right */
  left: 50%;
  transform: translate(0, -50%); /* Start at center, centered vertically */
  margin-left: 2rem; /* Small gap from center */
  right: auto; /* Remove right positioning */
  /* ... rest unchanged */
}
```

## Visual Result

| Viewport | Before | After |
|----------|--------|-------|
| Wide (80% zoom) | Large gap ~200px+ | Consistent ~64px gap |
| Normal (100% zoom) | Medium gap ~100px | Consistent ~64px gap |
| Narrow (1400px) | Smaller gap | Same ~64px gap |

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Update positioning for `.tru-ai-steps-left` and `.tru-ai-header-previews` to use center-relative layout |

## Technical Details

### Updated `.tru-ai-steps-left` (Lines 2473-2485)

```css
.tru-ai-steps-left {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-100%, -50%);
  margin-left: -2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  width: auto;
  max-width: 26rem;
  z-index: 5;
}
```

### Updated `.tru-ai-header-previews` (Lines 2744-2755)

```css
.tru-ai-header-previews {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(0, -50%);
  margin-left: 2rem;
  right: auto;
  display: flex;
  flex-direction: row;
  gap: var(--spacing-md);
  align-items: center;
  opacity: 1;
  transition: all 0.4s ease;
}
```

### Update Responsive Breakpoint (1400px)

Remove the fixed width override since we're now using `max-width`:

```css
@media (max-width: 1400px) {
  .tru-ai-steps-left {
    max-width: 22rem; /* Slightly smaller on medium screens */
  }
  /* ... preview adjustments remain */
}
```

