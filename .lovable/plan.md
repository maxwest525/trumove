
# Comprehensive Update Plan

This plan addresses multiple pages and features across the project: Live Tracking fixes, Book Video Consult redesign, Homepage layout updates, and dark mode audits.

---

## Part 1: Shipment Tracking Page Fixes

### 1.1 Remove Map View Toggle Dropdown
- Delete the `DropdownMenu` component (lines 580-632 in LiveTracking.tsx) that shows Hybrid/Roadmap/3D options
- The map will default to the current hybrid satellite view without user toggle

### 1.2 Fix Remote View Button Contrast
**Current Issue:** The "Remote View" button in `TruckAerialView.tsx` uses `bg-primary/10` with `text-primary` (green on green)
**Fix:** Change to a neutral outline style:
```tsx
// From:
"bg-primary/10 hover:bg-primary/20 text-primary"
// To:
"bg-background/80 hover:bg-muted border border-border text-foreground"
```

### 1.3 Add Close Button for Expanded Street View
**Current Issue:** When Street View expands, there's no visible way to exit
**Fix:** The close button exists but is styled too subtly. Will add:
- A clear X button in the top-right corner
- An "Exit Full View" label
- Darker, more visible styling when expanded

### 1.4 Fix Duplicate Footer on LiveTracking
**Current Issue:** `LiveTracking.tsx` manually imports and renders `<Footer />` on line 992, even though it should use `SiteShell` or handle the footer consistently
**Fix:** Since this page uses a custom layout (not SiteShell), the Footer import is intentional. No duplicate issue here - the page correctly shows one footer.

---

## Part 2: Book Video Consult Page Redesign

### 2.1 New High-Tech Layout
- Remove sidebar FAQ content (WhatHappensCard, TrustBadges, MiniFAQ, mover credibility sections)
- Create a centered, minimal design with video window always visible
- Add demo mode with a placeholder video frame

### 2.2 Video Window Always Present
```
+------------------------------------------+
|        Book a TruMove Session            |
+------------------------------------------+
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |     [VIDEO WINDOW - ALWAYS ON]     |  |
|  |                                    |  |
|  |   "Enter booking # to join"        |  |
|  |   [_____] [Join Room]              |  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
|  +---------------+  +----------------+   |
|  | Phone Call    |  | Build Manual   |   |
|  | 609-727-7647  |  | Inventory      |   |
|  +---------------+  +----------------+   |
|                                          |
|  +---------------+  +----------------+   |
|  | AI Inventory  |  | Schedule New   |   |
|  | Scanner       |  | Consult        |   |
|  +---------------+  +----------------+   |
+------------------------------------------+
```

### 2.3 Action Buttons with Previews
- Quick Call button (like current QuickCallCard but as button)
- Build Inventory Manually button with small preview image
- AI Inventory Builder button with small preview image
- Schedule New Consult button

### 2.4 Demo Mode
- Add a "Demo" button that loads a sample video room
- Shows placeholder video content when no booking number entered

---

## Part 3: Homepage Layout Updates

### 3.1 Compact "Your Move Your Terms" Card
**Current:** Large card with 6 feature boxes in a 2x3 grid
**New:** Make the card and feature boxes smaller, arrange all in a single row:
```
[Card Title + 6 mini feature icons in a row]
```

### 3.2 Feature Carousel Changes
**Current:** Shows 4 cards at a time
**New Changes:**
- Display only 2 cards at a time
- Position directly under the "Your Move Your Terms" row
- Auto-spin continues (already implemented)

### 3.3 Implementation Details
- Modify `tru-why-card-premium` to be more compact
- Change feature grid from 2x3 to 1x6 horizontal layout
- Update FeatureCarousel to show 2 slides instead of 4
- Reduce carousel item width to show 2 cards

---

## Part 4: Dark Mode Audit and Fixes

### 4.1 Pages to Audit
Based on my analysis:
- **Homepage (Index.tsx):** Uses semantic tokens, should work
- **OnlineEstimate.tsx:** Uses semantic tokens, should work
- **Book.tsx:** Uses semantic tokens, should work
- **LiveTracking.tsx:** Intentionally dark theme (command center)
- **CarrierVetting.tsx:** Intentionally dark theme

### 4.2 Potential Issues to Fix
- Form inputs on estimate page: Verify `bg-background` and `text-foreground` tokens
- Card backgrounds: Ensure `bg-card` inverts properly
- Border colors: Check `border-border` visibility

### 4.3 CSS Variable Verification
Verify in `index.css` that `.dark` class properly inverts:
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--input`, `--muted`, `--muted-foreground`
- `--border`

---

## Technical Implementation Details

### Files to Modify

**1. src/pages/LiveTracking.tsx**
- Remove DropdownMenu for map view toggle (lines 579-632)
- Keep Recenter and Follow buttons

**2. src/components/tracking/TruckAerialView.tsx**
- Fix Remote View button styling (line 157-177)
- Enhance close button visibility when expanded

**3. src/pages/Book.tsx**
- Complete redesign:
  - Remove sidebar content imports
  - Add persistent video window with booking input
  - Add 4 action buttons with previews
  - Add demo functionality

**4. src/components/video-consult/ConsultInfoCards.tsx**
- Keep QuickCallCard for reuse as button style
- Remove or mark other cards as unused

**5. src/pages/Index.tsx**
- Modify "Why TruMove" card to compact horizontal layout
- Update positioning relative to carousel

**6. src/components/FeatureCarousel.tsx**
- Change Embla settings to show 2 cards instead of 4
- Update responsive basis from 25% to 50%

**7. src/index.css**
- Audit and fix any dark mode visibility issues
- Ensure form inputs have proper contrast

---

## Summary of Changes

| Area | Change |
|------|--------|
| Tracking - Map Toggle | Remove dropdown, keep default hybrid view |
| Tracking - Remote View Button | Change from green-on-green to neutral styling |
| Tracking - Expanded View | Add clear exit/close button |
| Book Page | Full redesign - video always visible, minimal layout |
| Book Page | Remove FAQ/credibility content |
| Book Page | Add 4 action buttons with previews |
| Homepage | Compact Why TruMove card into horizontal row |
| Homepage | Carousel shows 2 cards instead of 4 |
| Dark Mode | Audit and fix visibility issues across pages |

---

## Implementation Priority
1. Tracking page fixes (quick wins)
2. Dark mode audit and fixes
3. Book page redesign
4. Homepage layout updates
