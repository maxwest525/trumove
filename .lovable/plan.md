
# Plan: Fix Truck View Road-Following and View Toggle Issues

## Problems Identified

1. **Straight line navigation**: The TruckViewPanel uses `routeCoordinates` from parent state, but this is only populated when Google2DTrackingMap calculates the route. If TruckView is selected before the route is ready, it shows a straight line between origin and destination.

2. **Truck disappears when toggling back**: When switching from TruckView to Satellite/Roadmap, the Google2DTrackingMap remounts but doesn't recreate the truck marker because the route calculation useEffect doesn't re-run (coordinates haven't changed).

---

## Solution Overview

### Fix 1: TruckViewPanel Needs Its Own Route Data
Add route fetching logic to TruckViewPanel when `routeCoordinates` is insufficient (less than 10 points indicates likely straight-line fallback):
- Call Google Directions API to get road-snapped polyline
- Store locally and use for animation
- Fall back to provided coordinates if API fails

### Fix 2: Persist Route Across View Switches
Ensure the Google2DTrackingMap properly restores the truck marker when remounting with existing route data:
- Add a useEffect that checks for existing route coordinates on mount
- If coordinates exist, recreate markers and polyline without re-calling Directions API

---

## Implementation Steps

### Step 1: Enhance TruckViewPanel Route Fetching

Modify `TruckViewPanel.tsx` to:
1. Accept the Google API key as a prop
2. Check if provided `routeCoordinates` are detailed (>10 points = road-snapped)
3. If not, fetch route from Google Directions API
4. Store the detailed route locally for animation

```text
// New state
const [detailedRoute, setDetailedRoute] = useState<[number, number][]>([]);

// useEffect to fetch route if needed
useEffect(() => {
  if (routeCoordinates.length > 10) {
    // Already have detailed route
    setDetailedRoute(routeCoordinates);
    return;
  }
  
  if (!originCoords || !destCoords) return;
  
  // Fetch from Google Directions
  fetchDirections(originCoords, destCoords).then(coords => {
    setDetailedRoute(coords);
    // Also notify parent to update routeCoordinates
  });
}, [routeCoordinates, originCoords, destCoords]);
```

### Step 2: Add Route Callback to TruckViewPanel

Add `onRouteCalculated` prop to TruckViewPanel so it can share the road-snapped route with the parent:

```text
interface TruckViewPanelProps {
  // ... existing props
  onRouteCalculated?: (route: { coordinates: [number, number][]; distance: number; duration: number }) => void;
}
```

### Step 3: Update LiveTracking to Share Route Callback

In `LiveTracking.tsx`, pass the same `handleRouteCalculated` callback to both Google2DTrackingMap and TruckViewPanel:

```text
<TruckViewPanel
  routeCoordinates={routeCoordinates}
  progress={progress}
  isTracking={isTracking}
  originCoords={originCoords}
  destCoords={destCoords}
  onRouteCalculated={handleRouteCalculated}  // Add this
/>
```

### Step 4: Fix Google2DTrackingMap Remount Issue

Add a new useEffect in `Google2DTrackingMap.tsx` that recreates the truck marker when the component mounts with existing route data:

```text
// Handle remount with existing progress (view toggle scenario)
useEffect(() => {
  if (!mapRef.current || !isScriptLoaded || !originCoords || !destCoords) return;
  
  // If we have a route but no truck marker, recreate it
  if (routePathRef.current.length > 0 && !truckMarkerRef.current) {
    const path = routePathRef.current;
    // Calculate current position from progress
    const totalPoints = path.length;
    const exactIndex = (progress / 100) * (totalPoints - 1);
    // ... create truck marker at interpolated position
  }
}, [isScriptLoaded, progress, originCoords, destCoords]);
```

### Step 5: Ensure Route Recalculation on Remount

Modify the route calculation useEffect in `Google2DTrackingMap.tsx` to track if it has run:

```text
const routeCalculatedRef = useRef(false);

// Calculate route - force recalculation on remount if markers are missing
useEffect(() => {
  if (!mapRef.current || !originCoords || !destCoords || !directionsRendererRef.current) return;
  
  // Always recalculate if truck marker is missing (remount scenario)
  if (truckMarkerRef.current && routeCalculatedRef.current) return;
  
  // ... existing route calculation logic
  routeCalculatedRef.current = true;
}, [originCoords, destCoords, onRouteCalculated, mapRef.current]);
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/tracking/TruckViewPanel.tsx` | Add Google Directions route fetching, onRouteCalculated callback, use detailed route for animation |
| `src/pages/LiveTracking.tsx` | Pass onRouteCalculated to TruckViewPanel |
| `src/components/tracking/Google2DTrackingMap.tsx` | Fix truck marker recreation on remount |

---

## Technical Details

### Route Detection Logic
- **Detailed route**: More than 10 coordinate points (Google Directions returns hundreds for any real route)
- **Straight line fallback**: Only 2-3 points (origin, maybe midpoint, destination)

### API Call in TruckViewPanel
Use the same Google Directions API pattern from Google2DTrackingMap:
- Load Google Maps script if not already loaded
- Call DirectionsService with driving mode
- Extract overview_path as coordinate array

### Marker Recreation Logic
When Google2DTrackingMap remounts:
1. Check if `routePathRef.current` has data from previous mount → use it
2. If not, recalculate route
3. Always recreate markers if they don't exist

---

## Expected Outcome

After implementation:
1. **TruckView follows roads**: Camera follows the actual road-snapped route from Google Directions, not a straight line
2. **Seamless view switching**: Truck marker and route trail persist correctly when toggling between Satellite, Roadmap, and Truck View
3. **Consistent speed**: Animation speed stays synchronized across all views since they share the same route coordinates
