
# Plan: Implement Route Optimization Using Mapbox Directions API

## Context
The Mapbox Optimization API (`optimized-trips`) requires premium account scopes that aren't available with a standard token. However, the **Mapbox Directions API** (which works with your public token) supports up to 25 waypoints with traffic-aware routing.

## Solution
Create a new edge function that implements multi-stop route optimization using the Mapbox Directions API with a permutation-based algorithm to find the optimal stop order.

---

## Implementation Steps

### 1. Create New Edge Function: `mapbox-directions-optimize`
Replace the current `mapbox-optimization` function with a new implementation that:
- Uses the Directions API (`/directions/v5/mapbox/driving-traffic/`)
- Tests multiple route permutations to find the optimal order
- Preserves first pickup and last drop-off as fixed endpoints
- Returns optimized order, distance, duration, savings, and route geometry

**Algorithm approach:**
- For small sets (2-6 intermediate stops): Test all permutations to find shortest route
- For larger sets (7+ stops): Use nearest-neighbor heuristic for efficiency
- Compare optimized route against original order to calculate savings

### 2. Update Mapbox Token Usage
- Use your existing public token (`MAPBOX_ACCESS_TOKEN`) - no secret token needed
- The Directions API is included in standard token scopes

### 3. Update `useRouteOptimization` Hook
- Point to the new `mapbox-directions-optimize` function
- Keep Google fallback as backup

---

## Technical Details

### Edge Function Structure
```text
supabase/functions/mapbox-directions-optimize/index.ts
├── Permutation generator for small waypoint sets
├── Nearest-neighbor heuristic for larger sets
├── Mapbox Directions API calls with driving-traffic profile
├── Route comparison logic for savings calculation
└── Response with optimized order, geometry, and metrics
```

### API Endpoint Used
```
GET https://api.mapbox.com/directions/v5/mapbox/driving-traffic/{coordinates}
  ?access_token={public_token}
  &geometries=polyline6
  &overview=full
  &annotations=distance,duration,congestion
```

### Key Benefits
- Works with your existing public Mapbox token
- Traffic-aware routing with real-time congestion data
- Supports up to 25 waypoints (vs 12 for Optimization API)
- No premium API access required

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `supabase/functions/mapbox-directions-optimize/index.ts` | Create new optimization function |
| `supabase/config.toml` | Add function configuration |
| `src/hooks/useRouteOptimization.ts` | Update to use new function |

---

## Expected Results
- Multi-stop route optimization working with your public Mapbox token
- Real traffic conditions considered in route calculations
- Accurate ETA predictions for moving truck arrivals
- Visual display of optimized route on map
