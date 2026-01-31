

# Plan: Video Consult Header Alignment & Booking Controls Update

## Overview
This plan addresses the following changes:
1. Delete the unused `VideoConsultTrustStrip` component file
2. Add Shipment ID display to the header (matching tracking page style)
3. Match the header dimensions/fonts to the tracking page header
4. Brighten the booking controls strip below the video
5. Remove the booking code input from inside the video window

## Changes

### 1. Delete Unused Trust Strip Component

**File: `src/components/video-consult/VideoConsultTrustStrip.tsx`**

This file is no longer imported anywhere and can be deleted.

---

### 2. Update Header to Match Tracking Page Dimensions

**File: `src/index.css`**

The tracking header uses:
- `padding: 12px 24px` ✓ (already matching)
- `background: hsl(var(--foreground) / 0.95)` (tracking uses this, video consult uses different gradient)

Update `.video-consult-header` to match `.tracking-header`:

| Property | Current (Video Consult) | Target (Tracking) |
|----------|------------------------|-------------------|
| background | `linear-gradient(to bottom, hsl(220 15% 6%), hsl(220 15% 4%))` | `hsl(var(--foreground) / 0.95)` |
| padding | 12px 24px | 12px 24px ✓ |

---

### 3. Add Shipment ID Display to Header (Right Side)

**File: `src/pages/Book.tsx`**

Add a Shipment ID display on the right side of the header, matching the tracking page pattern exactly:

```tsx
{/* Right - Shipment ID (matching tracking page) */}
<div className="flex items-center gap-4">
  <div className="text-right">
    <div className="text-[11px] text-white/80 uppercase tracking-wider">Shipment ID</div>
    <div className="text-sm font-mono text-white">TM-2026-{String(Date.now()).slice(-8)}</div>
  </div>
</div>
```

This replaces the empty spacer `<div className="w-[120px]" />`.

---

### 4. Brighten Booking Controls Below Video

**File: `src/index.css`**

Update `.video-consult-booking-controls` with brighter colors:

| Property | Current | New |
|----------|---------|-----|
| background | `hsl(220 15% 8%)` to `hsl(220 15% 6%)` | `hsl(220 15% 14%)` to `hsl(220 15% 12%)` |
| border | `hsl(0 0% 100% / 0.08)` | `hsl(0 0% 100% / 0.15)` |

Update `.video-consult-booking-input`:

| Property | Current | New |
|----------|---------|-----|
| background | `hsl(220 15% 12%)` | `hsl(220 15% 18%)` |
| border | `hsl(0 0% 100% / 0.15)` | `hsl(0 0% 100% / 0.25)` |

Update helper text:

| Property | Current | New |
|----------|---------|-----|
| color | `text-white/50` | `text-white/70` |

---

### 5. Remove Booking Code Input from Video Window

**File: `src/pages/Book.tsx`**

In the "Ready to Connect" placeholder state (lines 765-814), remove:
- The "Enter your booking code below..." paragraph text
- The entire Join Form div containing the Input and Join Room button
- Keep only the demo button/link and screen sharing info

The booking controls are already duplicated in the section below the video, so removing from inside the video window streamlines the UI.

---

## Summary of Changes

| Item | Action |
|------|--------|
| `VideoConsultTrustStrip.tsx` | Delete file |
| Header background | Match tracking header style |
| Header right side | Add Shipment ID display |
| Booking controls | Brighten colors (more contrast) |
| Video window interior | Remove duplicate booking form |

## Files to Modify
- `src/components/video-consult/VideoConsultTrustStrip.tsx` - DELETE
- `src/pages/Book.tsx` - Header Shipment ID + remove video interior form
- `src/index.css` - Booking controls brightened colors

