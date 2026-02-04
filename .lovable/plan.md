

## Summary
Clean up the homepage Shipment Tracker demo by removing unnecessary UI elements and fixing the visual consistency to match the shipment tracking page. The satellite Route Overview map will zoom in to show actual roads/highways, and both maps will get proper borders.

---

## What Will Change

### 1. Remove Street View Preview (Lines 640-661)
Delete the static Street View inset completely - it doesn't belong on the homepage demo.

### 2. Remove Unnecessary Overlays from Road Map Panel
Remove these elements that clutter the demo:
- **Progress badge** ("X% Complete") - lines 603-605
- **Stats overlay** (ETA, Traffic, Weather) - lines 607-623
- **Route bar** (origin → destination + distance) - lines 625-638

### 3. Update Truck Marker Styling
Replace the current basic green circle truck overlay with the same cyan-accented style used on the shipment tracking page. The tracking page uses:
- Green background with glow effect
- Black truck icon color
- Pulsing radial gradient animation

### 4. Fix Satellite Route Overview Zoom
Currently uses `auto` fit which shows all of North/South America. Change to a fixed zoom level (around 4-5) to show the continental US with visible highways while still displaying the full route.

### 5. Add Borders to Both Maps
Add visible borders to both the Satellite and Road Map panels matching the existing styling pattern.

---

## Implementation Details

### File: `src/pages/Index.tsx`

**A) Remove unused `Eye` import (line 53):**
```tsx
// Before:
Play, Pause, MapPinned, Calendar, Compass, Eye

// After:
Play, Pause, MapPinned, Calendar, Compass
```

**B) Update SatelliteMapPanel (around lines 488-527):**
Change the Mapbox Static API URL to use a fixed zoom level instead of `auto`:
```tsx
// Before:
const satelliteMapUrl = `.../${pathOverlay},${originMarker},${destMarker}/auto/420x480@2x?...`;

// After (zoom 4, centered on continental US):
const centerLng = -98;  // Center of continental US
const centerLat = 38;
const zoom = 4;
const satelliteMapUrl = `.../${pathOverlay},${originMarker},${destMarker}/${centerLng},${centerLat},${zoom}/420x480@2x?...`;
```

**C) Update RoadMapPanel truck overlay (around lines 567-573):**
Replace basic truck overlay with tracking page style:
```tsx
// Before:
<div className="tru-tracker-truck-overlay" style={{...}}>
  <div className="tru-tracker-truck-pulse" />
  <Truck className="w-5 h-5 text-white" />
</div>

// After (matching tracking page):
<div className="tru-homepage-truck-marker">
  <div className="tru-homepage-truck-glow" />
  <div className="tru-homepage-truck-glow tru-homepage-truck-glow-2" />
  <div className="tru-homepage-truck-icon">
    <Truck className="w-6 h-6" />
  </div>
</div>
```

**D) Remove Progress Badge (lines 603-605):**
Delete entire block.

**E) Remove Stats Overlay (lines 607-623):**
Delete entire block (ETA, Traffic, Weather items).

**F) Remove Route Bar (lines 625-638):**
Delete entire block (origin/destination endpoints + distance).

**G) Delete Street View Preview (lines 640-661):**
Delete entire block.

---

### File: `src/index.css`

**Add prominent borders to both map panels:**
```css
.tru-tracker-satellite-enlarged,
.tru-tracker-road-map {
  border: 2px solid hsl(0 0% 100% / 0.15);
}

.dark .tru-tracker-satellite-enlarged,
.dark .tru-tracker-road-map {
  border: 2px solid hsl(0 0% 100% / 0.2);
}
```

---

## Visual Result

```text
┌─────────────────────────────────────────────────────────────────┐
│                     SHIPMENT TRACKER SECTION                    │
├──────────────────┬────────────────────┬────────────────────────┤
│                  │                    │                        │
│   SATELLITE      │    ROAD MAP        │    CONTENT             │
│   (zoomed to     │    (3D tilt,       │    - Title             │
│   show US +      │    dark mode,      │    - Description       │
│   highways)      │    truck marker)   │    - Step pills        │
│                  │                    │    - CTA button        │
│   [border]       │   [border]         │                        │
│                  │                    │                        │
│   Route Overview │   LIVE GPS badge   │                        │
│   label          │   + Chase toggle   │                        │
│                  │   (no stats/bar)   │                        │
└──────────────────┴────────────────────┴────────────────────────┘
```

---

## Technical Notes

- The `useTruckAnimation` hook continues to work as-is, animating the map center and bearing in real-time
- The Road Map will still use the Mapbox Static API with `navigation-night-v1` style and 60° tilt
- The truck marker will use the existing `.tru-homepage-truck-marker` CSS classes already defined in index.css (lines 3594-3647)
- No changes needed to the animation loop logic

