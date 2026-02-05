
# Plan: Add Truck View Panel to Shipment Tracking Page

## Overview
Add a second map view ("Truck View") to the shipment tracking page that displays a street-level, truck-centric perspective alongside the existing route overview map. Both panels will share identical sizing and proportions, creating a split-view experience similar to the homepage demo.

## Current Layout Analysis
- **Map area**: 850px wide, 550px tall
- **Dashboard**: 380px wide, 612px tall (contains stats + street view card)
- Total width used: ~1246px

## Proposed Layout

```text
+-------------------+-------------------+----------------+
|   Route Overview  |    Truck View     |   Dashboard    |
|   (current map)   |   (new panel)     |   (stats +     |
|    ~425x550       |    ~425x550       |  street view)  |
+-------------------+-------------------+----------------+
```

Each map panel will be exactly half the current map width (425px) to maintain total layout width.

---

## Implementation Steps

### Step 1: Create TruckViewMap Component
Create a new component `src/components/tracking/TruckViewMap.tsx` that:
- Accepts the route coordinates and current progress
- Uses Mapbox GL JS with `navigation-night-v1` style (matching homepage)
- Centers on the truck's current position along the route
- Applies tilted perspective (pitch: 60°, bearing follows road direction)
- Displays the green circular truck marker (matching existing style)
- Animates camera to follow truck movement

### Step 2: Update CSS Layout
Modify tracking layout CSS in `src/index.css`:
- Change `.tracking-map-area` to use flex layout with two equal panels
- Create `.tracking-map-split` class for the dual-panel container
- Each panel: 425px × 550px (exactly half current width)
- Maintain control strip spanning full width below both panels

```text
.tracking-map-split {
  display: flex;
  gap: 0;
  width: 850px;
}

.tracking-map-panel {
  width: 425px;
  height: 550px;
  flex-shrink: 0;
}
```

### Step 3: Update LiveTracking.tsx
Modify the map area section:
- Wrap the existing `Google2DTrackingMap` in a left panel
- Add the new `TruckViewMap` as the right panel
- Pass shared state (routeCoordinates, progress, isTracking) to both
- Add subtle labels ("Route Overview" / "Truck View") to each panel

### Step 4: Style Polish
- Left panel (Route Overview): rounded corners top-left only
- Right panel (Truck View): rounded corners top-right only
- Thin vertical separator between panels (1px border)
- Panel labels as small overlays in top corners

---

## Technical Details

### TruckViewMap Component Props
```typescript
interface TruckViewMapProps {
  routeCoordinates: [number, number][];
  progress: number;
  isTracking: boolean;
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
}
```

### Camera Behavior
- Calculates current position by interpolating along route based on progress
- Calculates bearing from current segment direction
- Uses `map.flyTo()` for smooth transitions as truck moves
- Default zoom: 17 (street level)
- Pitch: 60° for 3D-like tilted view

### Responsive Considerations
- On screens < 1400px: Stack panels vertically (each full width at 425px)
- On screens < 900px: Hide Truck View, show only Route Overview (current mobile behavior)

---

## Visual Outcome
Users will see:
1. **Left panel**: Bird's-eye route overview (satellite/roadmap) with full route visible
2. **Right panel**: Street-level truck view following the truck in real-time
3. **Dashboard**: Unchanged stats and street view card on the far right

This provides both strategic context (where the truck is on the route) and immersive detail (what the truck's perspective looks like).

---

## Files to Modify
| File | Changes |
|------|---------|
| `src/components/tracking/TruckViewMap.tsx` | **New file** - Street-level animated map component |
| `src/pages/LiveTracking.tsx` | Add TruckViewMap alongside existing map |
| `src/index.css` | Add split-panel CSS for dual map layout |
