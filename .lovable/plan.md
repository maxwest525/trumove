

# Plan: Enhance Truck View with Road-Following Camera Behavior

## Overview
Upgrade the "Truck View" mode on the shipment tracking page to mimic the immersive, road-following experience from the homepage demo. The truck camera will smoothly navigate actual roads with synchronized position and bearing updates.

---

## Current vs Target Behavior

| Aspect | Current Truck View | Target Behavior |
|--------|-------------------|-----------------|
| Camera sync | Position and heading updated separately | Position + bearing updated together in same frame |
| Camera transition | Discrete setCenter/setHeading calls | Smooth animated transition with momentum |
| Visual style | Google satellite with tilt | Dark navigation style matching homepage |
| Speed feel | Real-time (hours for cross-country) | Real-time but with demo mode option for faster preview |
| Road adherence | Uses Google Directions polyline | Same - already road-snapped from Directions API |

---

## Implementation Steps

### Step 1: Add Mapbox-Based Truck View Mode
Create a dedicated **TruckViewPanel component** specifically for the tracking page that uses Mapbox GL JS (matching the homepage implementation):

**New file: `src/components/tracking/TruckViewPanel.tsx`**
- Uses Mapbox GL JS with `navigation-night-v1` style
- Accepts `routeCoordinates` (already road-snapped from Google Directions)
- Implements synchronized `setCenter()` + `setBearing()` in same animation frame
- Centers a fixed truck marker CSS overlay (not a map marker)
- Uses `pitch: 60` and `zoom: 17` for street-level immersion
- Supports `interactive: false` for focused viewing OR `interactive: true` for user control

```
Props Interface:
- routeCoordinates: [number, number][]
- progress: number (0-100)
- isTracking: boolean
- interactive?: boolean (default false in truck view)
```

### Step 2: Update LiveTracking.tsx Layout
When "Truck View" is selected:
- **Replace** the Google2DTrackingMap with TruckViewPanel
- Pass existing `routeCoordinates` state (already populated from Google Directions)
- Pass current `progress` value for position interpolation
- Maintain sidebar dashboard unchanged

```
Layout Logic:
if (mapViewType === 'truckview') {
  render <TruckViewPanel ... />
} else {
  render <Google2DTrackingMap ... />
}
```

### Step 3: Smooth Camera Animation Logic
Port the homepage's animation approach:

```
// Position interpolation along route
const getPointAlongRoute = (progress: number): [number, number] => {
  const numSegments = routeCoordinates.length - 1;
  const segmentProgress = progress * numSegments / 100;
  const segmentIndex = Math.floor(segmentProgress);
  const t = segmentProgress - segmentIndex;
  
  const start = routeCoordinates[segmentIndex];
  const end = routeCoordinates[segmentIndex + 1];
  
  return [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t
  ];
};

// Bearing calculation from route segment
const getBearing = (progress: number): number => {
  // ... calculate from adjacent points
  return Math.atan2(dLng, dLat) * (180 / Math.PI);
};

// Synchronized update
useEffect(() => {
  if (!map || !isTracking) return;
  
  const position = getPointAlongRoute(progress);
  const bearing = getBearing(progress);
  
  map.setCenter(position);  // These happen
  map.setBearing(bearing);  // in the same frame
}, [progress, isTracking]);
```

### Step 4: Add Demo Speed Toggle (Optional Enhancement)
Add a speed multiplier for the tracking page to preview long routes quickly:

- **Real-time**: Route duration matches actual travel time (default)
- **Demo 10x**: 10x faster for quick previews
- **Demo 100x**: 100x faster for instant route visualization

Small toggle button near the Play/Pause controls.

### Step 5: Add CSS for Centered Truck Marker
Add to `src/index.css`:

```css
/* Truck View centered marker - matches homepage */
.tracking-truck-view-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
  pointer-events: none;
}

.tracking-truck-view-marker .truck-icon {
  width: 56px;
  height: 56px;
  background: #00e5a0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 229, 160, 0.5);
}

.tracking-truck-view-marker .truck-glow {
  position: absolute;
  inset: -8px;
  background: radial-gradient(circle, rgba(0,229,160,0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}
```

---

## Technical Details

### Route Data Flow
1. User enters origin/destination
2. Google Directions API returns road-snapped polyline (already happening)
3. Coordinates stored in `routeCoordinates` state
4. TruckViewPanel receives these coordinates
5. Animation interpolates position along this path
6. Camera follows with synchronized center + bearing

### Why Mapbox for Truck View?
- `navigation-night-v1` style provides superior dark road visualization
- Smoother camera transitions with native `setCenter`/`setBearing` sync
- Consistent visual language with homepage demo
- Google Maps' tilt/heading combination has known issues with smooth rotation

### Fallback Behavior
- If Mapbox fails to load, gracefully fall back to Google2DTrackingMap with existing truck view behavior
- Show loading state during Mapbox initialization

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/tracking/TruckViewPanel.tsx` | **New file** - Mapbox-based immersive truck camera view |
| `src/pages/LiveTracking.tsx` | Conditional render TruckViewPanel when `mapViewType === 'truckview'` |
| `src/index.css` | Add centered truck marker styles for tracking page |

---

## Visual Outcome
When users select "Truck View" on the shipment tracking page:
1. Map transitions to dark navigation style
2. Camera centers on truck's current position at street level
3. Camera heading aligns with road direction
4. Truck icon stays fixed in center while world moves around it
5. Smooth, cinematic experience matching the homepage demo
6. Real-time speed matches actual route duration

