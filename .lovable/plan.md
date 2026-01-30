
# Fix: Remove Transparent Box on Homepage Hero Right Side

## Problem Identified
A semi-transparent white/grey box is appearing around the "Your Move. Your Terms." card on the right side of the homepage hero section. After thorough investigation of the CSS, the issue is caused by the combination of:

1. **backdrop-filter: blur(12px)** on `.tru-why-card-premium` (line 25351)
2. **Semi-transparent gradient background** on the same element (lines 25339-25343)
3. Browser rendering behavior that creates a visible stacking context box around elements with backdrop-filter

The backdrop-filter effect, when combined with a partially transparent background gradient, causes the browser to render a visible bounding area around the card.

## Solution

### CSS Changes (src/index.css)

1. **Remove backdrop-filter from `.tru-why-card-premium`** - The frosted glass effect is creating the visible box. Replace with an opaque background.

2. **Make the background gradient fully opaque** - Remove transparency from the gradient background to eliminate the visual artifact.

3. **Add explicit background overrides** for the wrapper containers (already added but may need reinforcement).

Specific changes:

```css
/* Remove backdrop-filter and make background opaque */
.tru-why-card-premium {
  position: relative;
  background: linear-gradient(135deg, 
    hsl(var(--background)) 0%, 
    hsl(var(--muted)) 50%,   /* Remove the /0.8 transparency */
    hsl(var(--background)) 100%
  );
  border: 1px solid hsl(var(--tm-ink) / 0.1);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 4px 24px hsl(var(--tm-ink) / 0.08),
    0 1px 3px hsl(var(--tm-ink) / 0.04),
    inset 0 1px 0 hsl(0 0% 100% / 0.8);
  /* REMOVE: backdrop-filter: blur(12px); */
  /* REMOVE: -webkit-backdrop-filter: blur(12px); */
}
```

Also reinforce the container transparency:
```css
/* Ensure no stacking context issues on parent containers */
.tru-hero-content-panel,
.tru-hero-stacked-cards {
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
```

---

## Technical Details

### File to Modify
- `src/index.css`

### Implementation Steps
1. Locate `.tru-why-card-premium` styling (around line 25337)
2. Remove `backdrop-filter: blur(12px)` and `-webkit-backdrop-filter: blur(12px)` properties
3. Change the gradient background from `hsl(var(--muted) / 0.8)` to `hsl(var(--muted))` (remove transparency)
4. Add explicit `backdrop-filter: none` to wrapper containers to prevent inheritance issues
5. Verify the fix works in both light and dark modes

### Why This Works
The `backdrop-filter` CSS property creates a new stacking context and requires the browser to composite the element separately. When combined with any transparency in the background, the browser renders a visible "box" representing the area affected by the blur. By:
- Removing the backdrop-filter effect
- Making the background fully opaque

We eliminate the visual artifact while maintaining the card's polished appearance.

### Verification
- Navigate to the homepage
- Confirm the transparent box is no longer visible on the right side
- Ensure the "Your Move. Your Terms." card renders with proper styling
- Test in both light and dark modes
- Verify the form card on the left still looks correct
