

# Replace Icon Components with Actual Page Preview Images

## Problem

The "Smart Carrier Match" and "FMCSA Verified" feature cards currently display custom icon components instead of actual preview images from the pages they link to. The user wants these to show real page previews for visual consistency with the other feature cards.

## Solution

Replace the `customIcon` properties with actual image previews:
- **Smart Carrier Match** → Use `previewCarrierVetting` (shows carrier vetting dashboard)
- **FMCSA Verified** → Use `previewCarrierVetting` (both link to `/vetting` page)

Keep the **Trudy AI Assistant** using the custom `TruckChatIcon` since it opens a chat modal, not a page.

---

## Implementation

### File: `src/components/FeatureCarousel.tsx`

**Step 1: Remove unused icon imports**

Remove `GitCompare`, `Star`, `ShieldCheck`, `BadgeCheck` from imports since the custom icon components will be removed.

**Step 2: Remove unused icon components**

Delete the `SmartMatchIcon` and `FMCSAVerifiedIcon` component definitions.

**Step 3: Update features array**

Replace `customIcon` with `image` for both Smart Carrier Match and FMCSA Verified:

| Feature | Current | Updated |
|---------|---------|---------|
| Smart Carrier Match | `customIcon: <SmartMatchIcon />` | `image: previewCarrierVetting` |
| FMCSA Verified | `customIcon: <FMCSAVerifiedIcon />` | `image: previewCarrierVetting` |
| Trudy AI Assistant | `customIcon: <TruckChatIcon />` | Keep as-is (opens chat, not a page) |

---

## Summary of Changes

| Line Range | Change |
|------------|--------|
| Line 5 | Remove `GitCompare`, `Star`, `ShieldCheck`, `BadgeCheck` from imports |
| Lines 38-57 | Delete `SmartMatchIcon` and `FMCSAVerifiedIcon` components |
| Lines 79-83 | Change Smart Carrier Match from `customIcon` to `image: previewCarrierVetting` |
| Lines 91-94 | Change FMCSA Verified from `customIcon` to `image: previewCarrierVetting` |

---

## Result

- All feature cards that link to pages will display actual page preview images
- Only Trudy AI Assistant retains a custom icon (appropriate since it opens chat, not a page)
- Visual consistency across the feature carousel

