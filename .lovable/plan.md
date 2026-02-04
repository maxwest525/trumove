

## Summary
Fix the Route Overview panel to properly display a marker on California (Los Angeles), a marker on New York, and a route line connecting them using the correct Mapbox Static Images API syntax.

---

## The Problem

The current Mapbox Static API URL has incorrect path encoding syntax. The path overlay format `path-4+4285F4-0.9(encodedCoords)` is malformed - Mapbox expects a different format.

---

## The Fix

Use the correct Mapbox Static Images API path overlay syntax:

**Correct format:**
```
path-{strokeWidth}+{strokeColor}-{strokeOpacity}({lng},{lat},{lng},{lat}...)
```

The coordinates should NOT be URL-encoded when inside the parentheses - they're already part of the URL path.

---

## Implementation

### File: `src/pages/Index.tsx` (lines 439-470)

Replace the `RouteOverviewPanel` function with correct Mapbox syntax:

```tsx
function RouteOverviewPanel() {
  // LA and NY coordinates [lng, lat]
  const laCoords = [-118.24, 34.05];
  const nyCoords = [-74.00, 40.71];
  
  // Key waypoints along the route for a realistic path
  const waypoints = [
    [-118.24, 34.05],  // Los Angeles
    [-106.65, 35.08],  // Albuquerque
    [-97.52, 35.47],   // Oklahoma City
    [-74.00, 40.71],   // New York
  ];
  
  // Build path overlay - correct Mapbox format: path-strokeWidth+color-opacity(coords)
  // Coords format: lng,lat,lng,lat,lng,lat (no URL encoding needed)
  const pathCoords = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(',');
  const pathOverlay = `path-4+4285F4-0.8(${pathCoords})`;
  
  // Markers: pin-s = small pin, +color, (lng,lat)
  const originMarker = `pin-s+22c55e(${laCoords[0]},${laCoords[1]})`;
  const destMarker = `pin-s+ef4444(${nyCoords[0]},${nyCoords[1]})`;
  
  // Center on continental US with zoom to see full route
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${pathOverlay},${originMarker},${destMarker}/-98,38,3.5/420x480@2x?access_token=${MAPBOX_TOKEN}`;
  
  return (
    <div className="tru-tracker-satellite-panel tru-tracker-satellite-enlarged">
      <img 
        src={staticMapUrl} 
        alt="Route Overview" 
        className="w-full h-full object-cover"
      />
      
      <div className="tru-tracker-satellite-label">
        <Radar className="w-3 h-3" />
        <span>Route Overview</span>
      </div>
    </div>
  );
}
```

**Key changes:**
1. Remove `encodeURIComponent()` - coordinates shouldn't be encoded
2. Simplify waypoints to 4 key points (cleaner line)
3. Add `className` to img for proper sizing
4. Keep the green origin marker (LA) and red destination marker (NY)

---

## Visual Result

```text
┌─────────────────────────────────────────────────────────────────┐
│                     SHIPMENT TRACKER SECTION                    │
├──────────────────┬────────────────────┬────────────────────────┤
│                  │                    │                        │
│   ROUTE OVERVIEW │    TRUCK VIEW      │    CONTENT             │
│                  │    (unchanged)     │                        │
│   🟢 Los Angeles │                    │                        │
│      ↓           │                    │                        │
│   ━━━blue line━━ │                    │                        │
│      ↓           │                    │                        │
│   🔴 New York    │                    │                        │
│                  │                    │                        │
│   [roadmap       │   [tilted dark     │                        │
│    style]        │    mode + truck]   │                        │
└──────────────────┴────────────────────┴────────────────────────┘
```

---

## Technical Notes

- **Truck View Panel**: Will NOT be modified - it's working perfectly
- The path uses Google Maps blue color (`#4285F4`) for familiarity
- Green marker (`#22c55e`) on LA, red marker (`#ef4444`) on NY
- Zoom level 3.5 shows the full continental US route

