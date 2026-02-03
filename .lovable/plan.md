

# Plan: Fix AI Analysis Section - Content Cutoff Issue

## Problem Analysis

After reducing the section height for closer headline/demo proximity, text and content are now getting cut off. The issue stems from:

1. **`--ai-section-min-height: clamp(16rem, 28vh, 20rem)`** - This was reduced too aggressively. At small zoom levels (67%), `28vh` can become as low as 16rem (~256px), which is insufficient for the content.

2. **Preview containers rely on parent height** - The scanner and inventory panels use `height: 100%`, inheriting from the section's min-height. When this shrinks, content inside overflows or clips.

3. **Left headline block needs breathing room** - The headline, subheadline, step pills, and CTA button require a minimum vertical space that the clamp isn't guaranteeing.

---

## Proposed Solution

Adjust the clamp values to provide adequate minimum heights while still keeping the section compact. Use `min-content` and `auto` where appropriate so the layout naturally expands to fit content.

---

## Implementation Steps

### Step 1: Increase Minimum Height in Clamp

Update `--ai-section-min-height` to ensure content never clips:

```css
/* Current - too aggressive */
--ai-section-min-height: clamp(16rem, 28vh, 20rem);

/* Fixed - better minimum */
--ai-section-min-height: clamp(22rem, 32vh, 26rem);
```

This provides:
- **Minimum**: 22rem (352px) - sufficient for headline + sub + pills + CTA
- **Preferred**: 32vh - scales nicely with viewport height
- **Maximum**: 26rem (416px) - prevents excessive stretching

### Step 2: Allow Content to Expand Beyond Min-Height

Ensure the section doesn't clip content if it exceeds the min-height:

```css
.tru-ai-header-row {
  min-height: var(--ai-section-min-height);
  height: auto; /* Allow natural expansion */
}
```

### Step 3: Set Explicit Heights for Preview Containers

Instead of relying on `100%` of parent, give the scanner and inventory their own clamp-based heights:

```css
.tru-ai-header-previews .tru-ai-live-scanner,
.tru-ai-header-previews .tru-ai-live-inventory {
  width: var(--ai-preview-width);
  height: clamp(20rem, 30vh, 26rem); /* Own height, not 100% */
  min-height: 20rem;
}
```

### Step 4: Add Overflow Handling

Ensure the inventory list can scroll if items exceed available space:

```css
.tru-ai-live-items {
  overflow-y: auto;
  max-height: 12rem; /* ~192px - allows scrolling if needed */
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Update `--ai-section-min-height`, adjust `.tru-ai-header-row` and preview container heights, add overflow handling |

---

## Technical Details

### Updated CSS Variable
```css
:root {
  /* AI Section - balanced for content visibility and compactness */
  --ai-section-min-height: clamp(22rem, 32vh, 26rem);
}
```

### Updated Header Row
```css
.tru-ai-header-row {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: var(--spacing-sm);
  min-height: var(--ai-section-min-height);
  height: auto; /* Allow expansion */
}
```

### Updated Preview Containers
```css
.tru-ai-header-previews .tru-ai-live-scanner,
.tru-ai-header-previews .tru-ai-live-inventory {
  width: var(--ai-preview-width);
  height: clamp(20rem, 30vh, 26rem);
  min-height: 20rem;
}
```

---

## Testing Plan

After implementation, verify:
- At 67% zoom: Headlines fully visible, no text clipping
- At 80% zoom: Scanner and inventory panels show all content
- At 100% zoom: Layout appears balanced and compact
- At 125% zoom: Content doesn't overflow or break
- Scroll the inventory list if more than 5 items to confirm scrolling works

