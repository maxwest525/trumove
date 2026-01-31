
# Plan: Fix Video Consult Trust Strip - Lock Below Header

## Root Cause Analysis

The trust strip is hidden behind the video-consult-header because:

1. **Both elements are independently sticky** - They each have their own `position: sticky`
2. **The trust strip has a lower z-index** - Header is `z-index: 40`, trust strip is `z-index: 39`
3. **Sticky elements compete** - When scrolling, the header "wins" and covers the trust strip

Looking at how the main site handles this in `SiteShell.tsx`:
```tsx
<div className="sticky top-0 z-[90]">
  <Header />
  {!hideTrustStrip && <SaferTrustStrip />}
</div>
```

The Header and SaferTrustStrip are wrapped in a **single sticky container**, so they move together as one unit.

## Solution

Apply the same pattern to the Book page: wrap the video-consult-header and VideoConsultTrustStrip in a single sticky container.

## Implementation

### File: `src/pages/Book.tsx`

**Wrap header and trust strip in a sticky container (around lines 696-757):**

```tsx
// FROM:
{/* Video Consult Command Center Header */}
<header className="video-consult-header">
  ...
</header>

{/* Trust Strip */}
<VideoConsultTrustStrip />

// TO:
{/* Sticky Header Block - Both elements lock together */}
<div className="sticky top-[72px] z-40">
  {/* Video Consult Command Center Header */}
  <header className="video-consult-header-inner">
    ...
  </header>

  {/* Trust Strip */}
  <VideoConsultTrustStrip />
</div>
```

### File: `src/index.css`

**Update `.video-consult-header` to remove sticky positioning (it's now handled by the wrapper):**

| Property | Current | New |
|----------|---------|-----|
| `position` | `sticky` | `relative` |
| `top` | `103px` | *(remove)* |
| `z-index` | `40` | *(remove)* |

**Update `.video-consult-trust-strip` to remove sticky positioning:**

| Property | Current | New |
|----------|---------|-----|
| `position` | `sticky` | `relative` |
| `top` | `151px` | *(remove)* |
| `z-index` | `39` | *(remove)* |

### CSS Changes

```css
/* Video Consult Command Center Header */
.video-consult-header {
  position: relative; /* Changed from sticky */
  /* top: 103px; - REMOVED */
  /* z-index: 40; - REMOVED */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: hsl(var(--foreground) / 0.95);
  border-bottom: 1px solid hsl(var(--border) / 0.3);
  backdrop-filter: blur(12px);
}

/* Video Consult Trust Strip */
.video-consult-trust-strip {
  position: relative; /* Changed from sticky */
  /* top: 151px; - REMOVED */
  /* z-index: 39; - REMOVED */
  background: linear-gradient(to bottom, hsl(220 15% 6%), hsl(220 15% 4%));
  border-bottom: 1px solid hsl(0 0% 100% / 0.08);
  padding: 8px 24px;
}
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Book.tsx` | Wrap header + trust strip in single sticky container |
| `src/index.css` | Remove individual sticky positioning from both elements |

## Result

- The Video Consult Header and Trust Strip will be wrapped in a single sticky container
- Both elements will scroll together as one unified block
- The trust strip will always be visible directly below the header
- This matches the pattern used in `SiteShell.tsx` for the main site header
