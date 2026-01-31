
# Plan: Add Video Consult Command Center Header

## Overview

Add a sticky "command center" style header to the Book Video Consult page (`/book`), similar to the Shipment Tracking page's "Shipment Command Center" strip. This will give the page a professional, tool-like appearance that matches the tracking dashboard aesthetic.

## Current State

- **Shipment Tracking** (`/track`): Has a dark sticky header with logo, "Shipment Command Center" label, search input, and control buttons
- **Book Video Consult** (`/book`): Uses a simple centered page layout with no command center header

## Design

The new header will include:
- TruMove logo (inverted for dark background)
- "Video Consult Center" title badge
- Session input field (for booking codes)
- Quick action buttons (Join, Demo mode)
- Sticky positioning below global navigation

### Visual Layout

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [Logo] VIDEO CONSULT CENTER    │ [Enter Code...]  [Join] [Demo] │ [Call] │
└──────────────────────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Update Book.tsx Page Structure

**File**: `src/pages/Book.tsx`

- Change from using `SiteShell` to using `Header` + `Footer` directly (like LiveTracking does)
- Add a new command center header component at the top
- Integrate the booking code input into the header
- Keep the video window and action buttons below

### Step 2: Add CSS Styles

**File**: `src/index.css`

Add new styles for the video consult header that match the tracking header aesthetic:

```css
.video-consult-header {
  position: sticky;
  top: 103px;  /* Same as tracking header - below global nav */
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: linear-gradient(135deg, hsl(222 47% 10%) 0%, hsl(222 50% 8%) 100%);
  border-bottom: 1px solid hsl(0 0% 100% / 0.08);
}
```

Similar sub-classes:
- `.video-consult-header-controls` - centered search/input area
- `.video-consult-header-input` - dark themed input
- `.video-consult-header-btn` - action buttons

### Step 3: Component Changes

The header section will be extracted from the current page and restructured:

| Element | Before | After |
|---------|--------|-------|
| Booking code input | Inside video placeholder | In sticky header |
| "Join Room" button | Inside video placeholder | In header controls |
| "Demo Mode" button | Text link below input | Header quick-action button |
| Phone call button | In action grid at bottom | Also in header for quick access |

### Step 4: Theme Support

Add `.dark` variants to ensure proper appearance in both themes, matching the pattern established for the Carrier Vetting page.

---

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Book.tsx` | Restructure layout, add command center header, move inputs to header |
| `src/index.css` | Add `.video-consult-header` and related styles (~80 lines) |

### New CSS Classes

- `.video-consult-header` - Main sticky container
- `.video-consult-header-controls` - Centered control group
- `.video-consult-header-input` - Dark themed booking input
- `.video-consult-header-btn` - Standard button styling
- `.video-consult-header-demo-btn` - Subtle demo mode button

### Import Changes

In `Book.tsx`, replace `SiteShell` usage with:
```tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import logoImg from "@/assets/logo.png";
```

---

## Visual Result

| State | Appearance |
|-------|------------|
| Not connected | Dark header with "VIDEO CONSULT CENTER" badge, booking input, Join/Demo buttons |
| In demo/call | Header remains visible, provides quick access to call controls |

The page will have a consistent "command center" feel matching the Shipment Tracking page, with professional dark styling that works in both light and dark themes.
