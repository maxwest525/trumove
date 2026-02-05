
# Match AI Analysis Section Height to Shipment Tracker Section

## Problem
You measured:
- **Shipment Tracker section**: 423px height
- **AI Analysis section**: 398px height
- **Difference**: 25px

Despite identical CSS variables for padding and min-height, the sections render at different heights due to content differences.

## Solution
Add an explicit **fixed height** to both sections to ensure pixel-perfect matching. I'll set both to **423px** (the larger value, from the Tracker section).

## Changes Required

### File: `src/index.css`

**1. Add explicit height to AI Analysis section**
```css
/* Current */
.tru-ai-steps-section {
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-md) var(--spacing-md);
  margin-top: 0;
  background: hsl(var(--background));
  position: relative;
  z-index: 5;
  height: auto;
  min-height: auto;
  overflow: hidden;
}

/* Updated */
.tru-ai-steps-section {
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-md) var(--spacing-md);
  margin-top: 0;
  background: hsl(var(--background));
  position: relative;
  z-index: 5;
  height: 423px;           /* Match tracker section exactly */
  min-height: 423px;
  overflow: hidden;
}
```

**2. Add explicit height to Tracker section** (for consistency)
```css
/* Current */
.tru-tracker-section {
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-md) var(--spacing-md);
  margin-top: 0;
  background: hsl(var(--background));
  position: relative;
  z-index: 5;
  height: auto;
  min-height: auto;
  overflow: hidden;
}

/* Updated */
.tru-tracker-section {
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-md) var(--spacing-md);
  margin-top: 0;
  background: hsl(var(--background));
  position: relative;
  z-index: 5;
  height: 423px;           /* Explicit height for consistency */
  min-height: 423px;
  overflow: hidden;
}
```

**3. Create shared CSS custom property** (cleaner approach)
```css
:root {
  /* Existing variables... */
  
  /* Unified section height for demo panels */
  --demo-section-height: 423px;
}

.tru-ai-steps-section,
.tru-tracker-section {
  height: var(--demo-section-height);
  min-height: var(--demo-section-height);
}
```

## Technical Notes
| Property | Before | After |
|----------|--------|-------|
| AI Analysis height | auto → 398px | 423px |
| Tracker height | auto → 423px | 423px |
| CSS approach | Independent auto heights | Shared CSS variable |

## Verification
- Both sections will now render at exactly 423px
- The `overflow: hidden` ensures any content that exceeds this height is clipped cleanly
- Using a shared CSS variable ensures they always match if adjusted later
