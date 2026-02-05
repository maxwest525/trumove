

# Fix Panel Sizing for Consistent Heights at All Zoom Levels

## Problem Analysis

The demo section panels (AI Scanner, Live Inventory, Route Overview, and Road Map) currently use **viewport-relative heights**:

```css
height: clamp(24rem, 38vh, 30rem)
```

The `38vh` component varies with:
1. **Browser zoom level** - zooming in/out changes the effective viewport height
2. **Window resize** - different browser window sizes
3. **Screen resolution** - varies between devices

This causes mismatched heights between panels when users adjust their browser zoom.

## Solution

Replace the viewport-relative `clamp()` heights with a **fixed rem-based height** using a shared CSS variable. Since `rem` units scale with the root font size (which is also affected by zoom), all panels will maintain equal heights regardless of zoom level.

## Changes Required

### File: `src/index.css`

**1. Add a new CSS variable for panel height**

In the `:root` section (around line 35), add a dedicated panel height variable:

```css
:root {
  /* ... existing variables ... */
  
  /* Fixed panel height for demo sections - rem-based for zoom consistency */
  --demo-panel-height: 26.5rem; /* ~424px at default 16px root */
}
```

**2. Update AI Scanner panel height**

Around line 3111-3123, change:
```css
.tru-ai-live-scanner {
  /* Change FROM: */
  height: clamp(24rem, 38vh, 30rem);
  min-height: 24rem;
  
  /* Change TO: */
  height: var(--demo-panel-height);
  min-height: var(--demo-panel-height);
  max-height: var(--demo-panel-height);
}
```

**3. Update AI Live Inventory panel height**

Around line 3274-3288, change:
```css
.tru-ai-live-inventory {
  /* Change FROM: */
  height: clamp(24rem, 38vh, 30rem);
  min-height: 24rem;
  
  /* Change TO: */
  height: var(--demo-panel-height);
  min-height: var(--demo-panel-height);
  max-height: var(--demo-panel-height);
}
```

**4. Update Tracker Satellite panel height**

Around line 4013-4019, change:
```css
.tru-tracker-satellite-enlarged {
  /* Change FROM: */
  height: clamp(24rem, 38vh, 30rem);
  min-height: 24rem;
  
  /* Change TO: */
  height: var(--demo-panel-height);
  min-height: var(--demo-panel-height);
  max-height: var(--demo-panel-height);
}
```

**5. Update Road Map panel height**

Around line 3595-3600, change:
```css
.tru-tracker-road-map {
  /* Change FROM: */
  height: clamp(24rem, 38vh, 30rem);
  
  /* Change TO: */
  height: var(--demo-panel-height);
  min-height: var(--demo-panel-height);
  max-height: var(--demo-panel-height);
}
```

**6. Update legacy tracker preview (if present)**

Around line 4073-4082, update `.tru-tracker-preview` similarly.

**7. Update the header preview containers**

Around line 2968-2973:
```css
.tru-ai-header-previews .tru-ai-live-scanner,
.tru-ai-header-previews .tru-ai-live-inventory {
  width: var(--ai-preview-width);
  height: var(--demo-panel-height);
  min-height: var(--demo-panel-height);
  max-height: var(--demo-panel-height);
}
```

## Summary

| Component | Before | After |
|-----------|--------|-------|
| AI Scanner | `clamp(24rem, 38vh, 30rem)` | `var(--demo-panel-height)` (26.5rem) |
| Live Inventory | `clamp(24rem, 38vh, 30rem)` | `var(--demo-panel-height)` (26.5rem) |
| Route Overview | `clamp(24rem, 38vh, 30rem)` | `var(--demo-panel-height)` (26.5rem) |
| Road Map | `clamp(24rem, 38vh, 30rem)` | `var(--demo-panel-height)` (26.5rem) |

## Why This Works

1. **rem units** are relative to the root font size, which scales proportionally with browser zoom
2. All panels reference the **same CSS variable**, ensuring they stay perfectly synchronized
3. The fixed value (26.5rem ≈ 424px) matches the existing `--demo-section-height` variable
4. Using `min-height` + `max-height` in addition to `height` prevents any content-based expansion

## Testing Checklist

After implementation, verify:
- ✓ AI Scanner and Live Inventory have matching heights
- ✓ Route Overview and Road Map have matching heights  
- ✓ All four panels match each other across sections
- ✓ Heights remain consistent at 90%, 100%, and 110% browser zoom
- ✓ No content clipping or overflow issues

