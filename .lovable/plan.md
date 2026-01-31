

# Set Scanner Preview to Fixed 275px Height

## Current State

The scanner preview image in the AI Inventory Analysis section uses:
- `aspect-ratio: 16/10` - which dynamically calculates height based on width
- `height: 100%` with `flex: 1` in a parent override - which fills available container space

The current rendered height is approximately 250-260px based on the 450px section height minus padding and other elements.

---

## Solution

Set the scanner to a fixed 275px height by updating the CSS.

### File: `src/index.css`

**1. Update the base `.tru-ai-live-scanner` rule (Lines 2386-2392)**

Change from:
```css
.tru-ai-live-scanner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/10;
  border: 1px solid hsl(var(--border));
}
```

To:
```css
.tru-ai-live-scanner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 275px;
  border: 1px solid hsl(var(--border));
}
```

**2. Update the `.tru-ai-preview-vertical .tru-ai-live-scanner` override (Lines 2636-2640)**

Change from:
```css
.tru-ai-preview-vertical .tru-ai-live-scanner {
  height: 100%;
  flex: 1;
  min-height: 0;
}
```

To:
```css
.tru-ai-preview-vertical .tru-ai-live-scanner {
  height: 275px;
  flex: none;
}
```

---

## Summary

| Property | Before | After |
|----------|--------|-------|
| Height | Dynamic (aspect-ratio: 16/10) | Fixed: 275px |
| Flex | `flex: 1` | `flex: none` |
| Aspect ratio | 16/10 | Removed |

This ensures the scanner preview is exactly 275px tall regardless of its container width or the available vertical space.

