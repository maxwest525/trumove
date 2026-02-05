
# Fix Section Height Mismatch - Comprehensive Approach

## Root Cause Analysis

The CSS changes are being correctly applied to the outer section containers:
```css
.tru-ai-steps-section,
.tru-tracker-section {
  height: var(--demo-section-height); /* 425px */
  min-height: var(--demo-section-height);
}
```

However, **the visual height difference persists** because:

1. **Inner rows have independent min-height**: Both `.tru-ai-header-row` and `.tru-tracker-header-row` use `min-height: clamp(26rem, 40vh, 32rem)` which is viewport-dependent
2. **Content differences**: The panels within each section may be rendering at slightly different heights
3. **Padding arithmetic**: Section padding + inner row margin + content creates unpredictable total heights
4. **The height: 425px on the outer section is being applied**, but inner content overflows or underflows it

## Solution

Apply the fixed height directly to the **inner header rows** (where the content lives) instead of just the outer sections. This ensures the content containers themselves match.

## Changes Required

### File: `src/index.css`

**1. Update the shared height variable comment for clarity**
```css
:root {
  /* Unified height for demo panel content rows (not outer sections) */
  --demo-section-height: 425px;
}
```

**2. Apply fixed height to inner header rows**
```css
/* Before */
.tru-ai-header-row {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: var(--spacing-sm);
  min-height: var(--ai-section-min-height);
  height: auto;
}

.tru-tracker-header-row {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: var(--spacing-sm);
  min-height: var(--ai-section-min-height);
  height: auto;
}

/* After - Apply fixed height to inner rows */
.tru-ai-header-row,
.tru-tracker-header-row {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: var(--spacing-sm);
  height: var(--demo-section-height);
  min-height: var(--demo-section-height);
  max-height: var(--demo-section-height);
}
```

**3. Keep outer sections with auto height to contain fixed inner rows**
```css
.tru-ai-steps-section,
.tru-tracker-section {
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-md) var(--spacing-md);
  margin-top: 0;
  background: hsl(var(--background));
  position: relative;
  z-index: 5;
  height: auto;       /* Let outer wrap the fixed inner */
  min-height: auto;
  overflow: hidden;
}
```

## Summary

| Layer | Before | After |
|-------|--------|-------|
| Outer section height | 425px (fixed) | auto (wraps inner) |
| Inner header-row height | clamp(26rem, 40vh, 32rem) min | 425px fixed |
| Content clipping | On outer section | On outer section |

This approach locks the **content container** to 425px rather than the wrapper, ensuring both sections render identically regardless of their internal content differences.

## Technical Details

The inner rows (`.tru-ai-header-row` and `.tru-tracker-header-row`) contain absolutely positioned elements that reference them as positioning context. By fixing these to exactly 425px with `height`, `min-height`, and `max-height`, both sections will have identical content area heights.

The outer sections will then naturally size to contain the fixed inner rows plus their padding, resulting in identical total heights.
