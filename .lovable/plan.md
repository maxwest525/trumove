

# Plan: Fix Truck View Road-Following Using Mapbox Directions API

## Root Cause Analysis

The tracking page's `TruckViewPanel` fails because:

1. **Google Script Loading Race Condition**: It tries to use Google Directions API, but the script may not be loaded when TruckViewPanel mounts (Google2DTrackingMap was unmounted)
2. **Parent Data Timing**: It relies on `routeCoordinates` from parent state, which is only populated when Google2DTrackingMap calculates the route
3. **Reference Lock**: The `routeFetchedRef` prevents re-fetching when switching back and forth between views

**The homepage works** because it uses **Mapbox Directions API** which is simpler (just a fetch call - no script loading required) and fetches its own route data independently.

---

## Solution: Port Homepage Pattern

Replace Google Directions API with Mapbox Directions API in `TruckViewPanel.tsx`, matching the proven homepage implementation:

| Current (Broken) | Fix (Matches Homepage) |
|------------------|------------------------|
| Google Directions API (needs script) | Mapbox Directions API (simple fetch) |
| Depends on parent `routeCoordinates` | Self-contained route fetching |
| Uses `loadGoogleMapsScript()` promise | Direct HTTP fetch call |

---

## Implementation Steps

### Step 1: Replace Route Fetching Logic

Remove Google-based `fetchRoadSnappedRoute` function and replace with Mapbox-based fetch (matching homepage lines 509-541):

```text
// Fetch road-snapped route from Mapbox Directions API
async function fetchRoadSnappedRoute(
  origin: [number, number],
  dest: [number, number]
): Promise<{ coordinates: [number, number][]; distance: number; duration: number } | null> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${dest[0]},${dest[1]}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`
    );
    const data = await response.json();
    
    if (data.routes && data.routes[0]) {
      const route = data.routes[0];
      return {
        coordinates: route.geometry.coordinates as [number, number][],
        distance: route.distance / 1609.34, // meters to miles
        duration: route.duration, // seconds
      };
    }
    return null;
  } catch (error) {
    console.error('Mapbox Directions failed:', error);
    return null;
  }
}
```

### Step 2: Fix Route Fetching Trigger

Reset `routeFetchedRef` when origin/destination changes so route is re-fetched when switching views:

```text
// Reset fetch flag when coordinates change
useEffect(() => {
  routeFetchedRef.current = false;
  setDetailedRoute([]);
}, [originCoords, destCoords]);
```

### Step 3: Improve Loading State

Add better UX during route calculation:
- Show "Calculating route..." while fetching
- Clear loading when route is ready

### Step 4: Clean Up Unused Code

Remove:
- `loadGoogleMapsScript()` function
- `GOOGLE_MAPS_API_KEY` constant
- Google-specific error handling

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/tracking/TruckViewPanel.tsx` | Replace Google Directions with Mapbox Directions API, fix route fetching trigger |

---

## Technical Benefits

1. **Simpler**: No script loading, just fetch call
2. **Faster**: Mapbox request starts immediately on mount
3. **Consistent**: Uses same API as homepage demo
4. **Reliable**: No race conditions with script loading

---

## Expected Outcome

After this fix:
1. **TruckView follows roads**: Camera follows actual road-snapped route from Mapbox Directions
2. **Works on first load**: No dependency on Google2DTrackingMap being mounted first
3. **Reliable view switching**: Route is fetched fresh when needed, persists across view toggles

