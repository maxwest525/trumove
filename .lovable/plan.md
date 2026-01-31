

# Set Scanner Preview to Fixed 350px Width

## Current State

The scanner preview currently has:
- Fixed height: 275px ✓
- Width: `1fr` (fills available space in the middle column)

The grid layout uses `grid-template-columns: auto 1fr auto` where the center column (scanner) expands to fill remaining space.

---

## Solution

Set the scanner to a fixed 350px width and ensure the image fits within those dimensions.

### File: `src/index.css`

**1. Update the base `.tru-ai-live-scanner` rule (Lines 2386-2392)**

Add fixed width:
```css
.tru-ai-live-scanner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 275px;
  width: 350px;
  border: 1px solid hsl(var(--border));
}
```

**2. Update the center column to not force expansion (Lines 2600-2606)**

Change from `flex: 1` to allow natural sizing:
```css
.tru-ai-center-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 100%;
}
```

**3. The image already has proper fit (Lines 2394-2398)**

The existing CSS already handles the image:
```css
.tru-ai-live-scanner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

This will scale and crop the image to fit within the 350×275px container.

---

## Summary

| Property | Before | After |
|----------|--------|-------|
| Width | Dynamic (1fr) | Fixed: 350px |
| Height | 275px | 275px (unchanged) |
| Image fit | object-fit: cover | object-fit: cover (unchanged) |

The scanner demo will now be exactly 350×275px with the image properly cropped to fit these dimensions.

