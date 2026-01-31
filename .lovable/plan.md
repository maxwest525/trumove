
# Plan: Fix Page Headers Being Overlaid by Navigation Bar

## Problem Analysis

The navigation bar is overlaying the page-specific headers on both the **Carrier Vetting** (`/carrier-vetting`) and **Shipment Tracking** (`/track`) pages. This happens because the sticky positioning values don't account for the full header height including margins.

### Current Header Structure
- **Global Header**: Uses floating glassmorphism design with `position: sticky`, `top: 8px`, and `height: 72px`
- **Total header offset needed**: 72px height + 8px top margin = **80px** (plus a bit of buffer)

### Current Issues

1. **CarrierVetting page** (`/carrier-vetting`):
   - Uses `SiteShell` which applies a sticky container at `top: 0` for Header + TrustStrip
   - The FMCSA header block has `sticky top-[72px]` but this doesn't account for the floating header's 8px margin
   - Needs to be changed to approximately `top-[108px]` (header 72px + margin 8px + trust strip ~28px)

2. **LiveTracking page** (`/track`):
   - Uses `Header` component directly (no `SiteShell`)
   - The `.tracking-header` is NOT sticky, so it scrolls away - this should be made sticky with proper offset
   - Should be sticky at approximately `top: 88px` (header 72px + 8px margin + small gap)

---

## Implementation Steps

### Step 1: Update CarrierVetting Sticky Header Position
**File**: `src/pages/CarrierVetting.tsx`

Change the sticky header block from:
```tsx
<div className="sticky top-[72px] z-40">
```
To:
```tsx
<div className="sticky top-[88px] z-40">
```

This accounts for:
- Header height: 72px
- Header top margin: 8px
- Small buffer: 8px

### Step 2: Make LiveTracking Header Sticky with Correct Position
**File**: `src/index.css`

Update the `.tracking-header` styles to make it sticky and position it below the global nav:

```css
.tracking-header {
  position: sticky;
  top: 88px;  /* Header 72px + margin 8px + buffer 8px */
  z-index: 40;
  /* ... existing styles ... */
}
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/pages/CarrierVetting.tsx` | Update sticky `top` value from `72px` to `88px` |
| `src/index.css` | Add sticky positioning to `.tracking-header` with `top: 88px` |

Both page-specific headers will now appear just below the main navigation bar without being overlaid.
