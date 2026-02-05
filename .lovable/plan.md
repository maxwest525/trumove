
# Match AI Analysis Section Layout to Shipment Tracker Section

## Summary
The user wants the AI Analysis section (description + 2 images) to have pixel-perfect matching with the Shipment Tracker section (2 images + description). Both sections use a 3-column centered layout at 770px, but their element dimensions differ.

## Current State Analysis

### Shipment Tracker Section (Reference)
| Element | Width | Height |
|---------|-------|--------|
| Route Overview (left) | 420px | clamp(24rem, 38vh, 30rem) |
| Truck View (center) | 420px | clamp(24rem, 38vh, 30rem) |
| Description (right) | max-width: 22rem | auto |
| Gap from center | 210px + 32px = 242px | - |

### AI Analysis Section (Current - MISMATCHED)
| Element | Width | Height | Issue |
|---------|-------|--------|-------|
| Description (left) | max-width: 22rem | auto | OK |
| Room Scanner (center) | 420px | **340px** | Height mismatch |
| Detection List (right) | **350px** | **340px** | Both mismatch |

## Changes Required

### File: `src/index.css`

**1. Fix `.tru-ai-live-scanner` (center element)**
```css
/* Current */
.tru-ai-live-scanner {
  height: 340px;
  width: 420px;
}

/* Updated - Match tracker road map */
.tru-ai-live-scanner {
  width: 420px;
  height: clamp(24rem, 38vh, 30rem);
  min-height: 24rem;
}
```

**2. Fix `.tru-ai-live-inventory` (right element)**
```css
/* Current */
.tru-ai-live-inventory {
  width: 350px;
  height: 340px;
}

/* Updated - Match tracker satellite panel */
.tru-ai-live-inventory {
  width: 420px;
  height: clamp(24rem, 38vh, 30rem);
  min-height: 24rem;
}
```

**3. Apply matching box-shadow and border styling**
Both elements should use the same `tru-map-window-frame` shadow/border pattern as the tracker panels:
- 2px solid black border
- Deep multi-layer shadow for depth

### Summary of Pixel Values to Match

| Property | Tracker Value | AI Analysis Value (Updated) |
|----------|---------------|------------------------------|
| Panel width | 420px | 420px |
| Panel height | clamp(24rem, 38vh, 30rem) | clamp(24rem, 38vh, 30rem) |
| Panel min-height | 24rem | 24rem |
| Border | 2px solid hsl(0 0% 0%) | 2px solid hsl(0 0% 0%) |
| Border radius | 12px | 8px (consider updating to 12px) |
| Gap offset | 210px + 32px | 210px + 32px (already matches) |
| Center anchor | 770px | 770px (already matches) |

## Verification Checklist
- Both sections have identical 420px wide panels
- Both sections have matching responsive height (clamp)
- Gap between center element and side elements is identical (242px)
- Shadow/border styling is consistent
- Responsive breakpoints remain functional
