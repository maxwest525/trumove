

# Fix Feature Carousel Image Mappings

## Current Issues

The feature-to-image mappings are misaligned:

| Feature | Current Image | Issue |
|---------|---------------|-------|
| Inventory Builder | `preview-ai-scanner.jpg` | Shows AI scanner, not inventory building |
| AI Room Scanner | `sample-room-living.jpg` | Shows static room, not scanner interface |
| Shipment Tracking | `preview-property-lookup.jpg` | Shows property lookup, not shipment tracking |
| Smart Carrier Match | `preview-carrier-vetting.jpg` | ✓ Correct |
| TruMove Specialist | `trudy-video-call.jpg` | ✓ Correct |
| FMCSA Verified | `scan-room-preview.jpg` | Shows room scan, irrelevant to FMCSA |
| Trudy AI Assistant | TruckChatIcon | ✓ Correct |

---

## Recommended Image Remapping

Based on available assets in `src/assets/`:

| Feature | Recommended Image | Reasoning |
|---------|-------------------|-----------|
| **Inventory Builder** | `sample-room-living.jpg` | Shows furniture items to inventory |
| **AI Room Scanner** | `scan-room-preview.jpg` | Shows scanner interface preview |
| **Shipment Tracking** | `preview-property-lookup.jpg` | Shows map/location (closest to tracking) |
| **Smart Carrier Match** | `preview-carrier-vetting.jpg` | ✓ Keep - shows carrier search |
| **TruMove Specialist** | `trudy-video-call.jpg` | ✓ Keep - shows video consult |
| **FMCSA Verified** | `preview-carrier-vetting.jpg` | Shows carrier verification (FMCSA related) |
| **Trudy AI Assistant** | TruckChatIcon | ✓ Keep - custom truck icon |

**Note**: Some images will be shared (e.g., carrier vetting for both Smart Carrier Match and FMCSA Verified) since they're conceptually related. Alternatively, we could use the `preview-video-consult.jpg` for TruMove Specialist and `trudy-video-call.jpg` elsewhere.

---

## Implementation

**File: `src/components/FeatureCarousel.tsx`**

Update the features array (lines 38-81):

```tsx
const features: Feature[] = [
  {
    title: "Inventory Builder",
    desc: "Build your item list room by room for accurate pricing estimates.",
    image: sampleRoomLiving,  // Shows furniture to catalog
    route: "/online-estimate",
  },
  {
    title: "AI Room Scanner",
    desc: "Point your camera and AI detects furniture instantly.",
    image: scanRoomPreview,  // Shows scanner interface
    route: "/scan-room",
  },
  {
    title: "Shipment Tracking",
    desc: "Track your shipment in real-time with live updates and notifications.",
    image: previewPropertyLookup,  // Shows map/location view
    route: "/track",
  },
  {
    title: "Smart Carrier Match",
    desc: "Our algorithm finds the best carrier for your route.",
    image: previewCarrierVetting,  // Keep - carrier search UI
    route: "/vetting",
  },
  {
    title: "TruMove Specialist",
    desc: "Live video consultation for personalized guidance.",
    image: trudyVideoCall,  // Keep - video call preview
    route: "/book",
  },
  {
    title: "FMCSA Verified",
    desc: "Real-time safety data checks from official databases.",
    image: previewCarrierVetting,  // Carrier verification (FMCSA data)
    route: "/vetting",
  },
  {
    title: "Trudy AI Assistant",
    desc: "Chat with our AI to get instant answers about your move.",
    customIcon: <TruckChatIcon />,  // Keep - custom icon
    action: "openChat",
  },
];
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/components/FeatureCarousel.tsx` | Swap image references for Inventory Builder, AI Room Scanner, and FMCSA Verified |

This ensures each feature card displays a relevant preview image that matches its functionality.

