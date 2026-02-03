
# Plan: Center and Close the Gap in AI Analysis Section

## Current Layout Issue

Looking at the screenshot, the headline content on the left and the demo previews on the right are:
1. **Too far apart horizontally** - There's a large gap between "Scan Your Home" button and the scanner preview
2. **Not vertically centered** - The previews span from top to bottom of the section instead of being centered between the black boxes

## Root Cause

From the CSS analysis:
- `.tru-ai-steps-left` is positioned at `left: 0` with `width: calc(50% - 1.25rem)` (50% of container)
- `.tru-ai-header-previews` is positioned at `right: 0` with `top: 0; bottom: 0` (stretched to full height)
- This creates a large horizontal gap and misaligned vertical positioning

## Solution

### Step 1: Center Previews Vertically

Change the preview container from stretching full height to being vertically centered:

```css
.tru-ai-header-previews {
  position: absolute;
  right: 0;
  top: 50%;                    /* Changed from top: 0 */
  transform: translateY(-50%); /* Center vertically */
  /* Remove: bottom: 0 */
  display: flex;
  flex-direction: row;
  gap: var(--spacing-md);
  align-items: center;         /* Changed from stretch */
}
```

### Step 2: Reduce Horizontal Gap

Bring the headline content closer to center by narrowing its width and shifting it right:

```css
.tru-ai-steps-left {
  position: absolute;
  left: 2rem;                  /* Add small left margin */
  top: 50%;
  transform: translateY(-50%);
  width: calc(45% - 2rem);     /* Narrower to reduce gap */
  /* rest unchanged */
}
```

### Step 3: Shift Previews Slightly Left

Add a small right offset to bring previews closer to center:

```css
.tru-ai-header-previews {
  right: 1rem;  /* Small inset from edge */
  /* rest of centering changes */
}
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Update `.tru-ai-header-previews` vertical positioning, adjust `.tru-ai-steps-left` width |

## Visual Result

Before: Headline left-aligned, previews right-aligned, stretched full height
After: Both sections centered vertically between black boxes, with reduced horizontal gap between them
