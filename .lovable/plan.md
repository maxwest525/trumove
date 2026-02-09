

# Plan: Fix TruckViewPanel to Match Homepage Architecture

## Root Cause

The tracking page's `TruckViewPanel` has a **timing and architecture problem**:

1. **Map initializes too early**: The map is created before route data exists, centering on Kansas
2. **Route never fetches**: The Mapbox Directions API call is never made (verified by empty network log for "directions")
3. **Complex effect dependencies**: Multiple `useEffect` hooks with racing conditions between reset and fetch logic

The homepage version works because:
- It has **hardcoded coordinates** that are available immediately
- The map only initializes **after** route data is ready (`if (routeCoords.length < 2) return`)
- It's completely self-contained with no external props

---

## Solution: Match Homepage Pattern Exactly

Restructure `TruckViewPanel` to mirror the proven homepage architecture:

### Key Changes

| Broken Pattern | Fixed Pattern (Matches Homepage) |
|----------------|----------------------------------|
| Map initializes before route | Map only initializes when `activeRoute.length >= 2` |
| Multiple racing useEffects | Single fetch effect, waits for route before map init |
| Complex prop dependencies | Simpler flow: fetch → set route → init map |
| `routeFetchedRef` logic can fail | Use route length as the guard |

---

## Implementation Steps

### Step 1: Delay Map Initialization Until Route Ready

Change the map initialization useEffect to wait for valid route data:

```text
// Initialize Mapbox map - ONLY when route is ready
useEffect(() => {
  if (!mapContainer.current || map.current) return;
  if (activeRoute.length < 2) return;  // ADD THIS CHECK
  
  // ... rest of map initialization
}, [interactive, activeRoute.length]);  // Add activeRoute.length to deps
```

### Step 2: Simplify Route Fetching Logic

Remove the complex `routeFetchedRef` logic and use a simpler state-based approach:

```text
// State for tracking fetch status
const [fetchStatus, setFetchStatus] = useState<'idle' | 'fetching' | 'done'>('idle');

// Fetch route when coordinates are available
useEffect(() => {
  // Already have road-snapped route from parent
  if (routeCoordinates.length > 10) {
    setDetailedRoute(routeCoordinates);
    setFetchStatus('done');
    return;
  }
  
  // Need coordinates to fetch
  if (!originCoords || !destCoords) return;
  
  // Already fetching or done
  if (fetchStatus !== 'idle') return;
  
  setFetchStatus('fetching');
  setIsLoadingRoute(true);
  
  fetchRoadSnappedRoute(originCoords, destCoords).then((result) => {
    setIsLoadingRoute(false);
    setFetchStatus('done');
    
    if (result) {
      setDetailedRoute(result.coordinates);
      onRouteCalculated?.(result);
    } else {
      // Fallback to straight line
      setDetailedRoute([originCoords, destCoords]);
    }
  });
}, [originCoords, destCoords, routeCoordinates, fetchStatus, onRouteCalculated]);
```

### Step 3: Reset State on Coordinate Change

When origin/destination changes, reset to idle state:

```text
// Reset when coordinates change
useEffect(() => {
  setFetchStatus('idle');
  setDetailedRoute([]);
  
  // Also destroy existing map so it reinitializes with new route
  if (map.current) {
    map.current.remove();
    map.current = null;
  }
  setIsReady(false);
}, [originCoords?.[0], originCoords?.[1], destCoords?.[0], destCoords?.[1]]);
```

### Step 4: Update Loading/Error States

Show appropriate UI during the fetch-then-init sequence:

```text
{/* Loading state - show while fetching route OR initializing map */}
{(!isReady || isLoadingRoute) && activeRoute.length >= 2 && (
  <div className="loading-overlay">
    <span>Loading Truck View...</span>
  </div>
)}

{/* No route - show when waiting for coordinates */}
{fetchStatus === 'idle' && !originCoords && !destCoords && (
  <div className="no-route-overlay">
    <span>Set origin and destination to enable Truck View</span>
  </div>
)}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/tracking/TruckViewPanel.tsx` | Delay map init until route ready, simplify fetch logic, fix reset behavior |

---

## Technical Details

### Why This Fixes the Problem

1. **Map waits for route**: By checking `activeRoute.length < 2` before initializing, the map is only created once we have actual road-snapped coordinates
2. **No racing conditions**: Single `fetchStatus` state machine prevents multiple fetches and makes the flow deterministic
3. **Clean reset**: Destroying the map on coordinate change ensures fresh initialization with correct center/bearing
4. **Matches homepage**: This pattern directly mirrors lines 582-584 of Index.tsx where the map init returns early if `routeCoords.length < 2`

### Expected Flow

1. Component mounts with `originCoords`/`destCoords` from parent
2. First render shows "Loading" state
3. Fetch effect triggers Mapbox Directions API call
4. Route coordinates arrive (hundreds of points)
5. `activeRoute.length >= 2` becomes true
6. Map initialization effect runs, creating map at correct center
7. Camera starts following road-snapped route with correct bearing

---

## Expected Outcome

After implementation:
1. **Truck follows roads**: Camera follows actual road-snapped route from Mapbox Directions
2. **No straight line**: Never shows straight-line path because map only init after road data
3. **Reliable switching**: Toggling views triggers clean reset and re-fetch
4. **Consistent with homepage**: Same proven pattern that works in the demo

