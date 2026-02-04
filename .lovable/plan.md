

## Summary
Fix the Route Overview panel by using a properly **encoded polyline** instead of raw coordinates, and use `auto` positioning to ensure the entire continental US route is visible with both markers.

---

## The Problem

The current Mapbox Static API URL is malformed:
1. **Wrong path syntax**: Using raw coordinates (`-118.24,34.05,-114.29,34.14,...`) when Mapbox requires an **encoded polyline**
2. **URL encoding in wrong place**: `encodeURIComponent()` was applied to coordinates, but the path needs to be a pre-encoded polyline
3. **Fixed zoom might be cutting off content**: Using `-98,38,3.5` instead of `auto` which fits all overlays

---

## The Fix

### Option 1: Use GeoJSON overlay (simpler)
Instead of the path overlay, use a **GeoJSON LineString** which accepts raw coordinates. This is easier and more maintainable:

```tsx
// Create GeoJSON LineString for the route
const routeGeoJSON = {
  type: "Feature",
  properties: {
    stroke: "#4285F4",       // Blue route line
    "stroke-width": 4,
    "stroke-opacity": 0.9
  },
  geometry: {
    type: "LineString",
    coordinates: waypoints   // [[lng,lat], [lng,lat], ...]
  }
};

// URI encode the GeoJSON
const geoJsonOverlay = `geojson(${encodeURIComponent(JSON.stringify(routeGeoJSON))})`;

// Use 'auto' to fit all overlays
const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1/static/${geoJsonOverlay},${originMarker},${destMarker}/auto/420x480@2x?access_token=${MAPBOX_TOKEN}`;
```

### Option 2: Use encoded polyline (original approach, fixed)
Pre-encode the coordinates into a polyline using Google's algorithm. This is more complex but produces shorter URLs.

---

## Implementation (GeoJSON approach - recommended)

### File: `src/pages/Index.tsx`

Replace the `RouteOverviewPanel` function:

```tsx
// Route Overview Panel - Mapbox dark road style (matches Truck View aesthetic)
function RouteOverviewPanel() {
  const laCoords = [-118.24, 34.05]; // [lng, lat] for Mapbox
  const nyCoords = [-74.00, 40.71];
  
  // Realistic I-10/I-40/I-70 highway corridor waypoints [lng, lat]
  const waypoints: [number, number][] = [
    [-118.24, 34.05],   // Los Angeles
    [-114.29, 34.14],   // Needles, CA
    [-111.65, 35.19],   // Flagstaff, AZ
    [-106.65, 35.08],   // Albuquerque, NM
    [-101.83, 35.22],   // Amarillo, TX
    [-97.52, 35.47],    // Oklahoma City, OK
    [-97.34, 37.69],    // Wichita, KS
    [-94.58, 39.10],    // Kansas City, MO
    [-90.20, 38.63],    // St. Louis, MO
    [-86.16, 39.77],    // Indianapolis, IN
    [-82.98, 40.00],    // Columbus, OH
    [-79.99, 40.44],    // Pittsburgh, PA
    [-74.00, 40.71],    // New York, NY
  ];
  
  // Build GeoJSON LineString for the route with styling
  const routeGeoJSON = {
    type: "Feature",
    properties: {
      stroke: "#4285F4",
      "stroke-width": 4,
      "stroke-opacity": 0.9
    },
    geometry: {
      type: "LineString",
      coordinates: waypoints
    }
  };
  
  // URI encode the GeoJSON (replace # with %23)
  const geoJsonEncoded = encodeURIComponent(JSON.stringify(routeGeoJSON)).replace(/%23/g, '%2523');
  const geoJsonOverlay = `geojson(${geoJsonEncoded})`;
  
  // Markers
  const originMarker = `pin-s+22c55e(${laCoords[0]},${laCoords[1]})`;
  const destMarker = `pin-s+ef4444(${nyCoords[0]},${nyCoords[1]})`;
  
  // Use 'auto' to fit all overlays (route + markers) in view
  // navigation-night-v1 for dark theme matching Truck View
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1/static/${geoJsonOverlay},${originMarker},${destMarker}/auto/420x480@2x?padding=40&access_token=${MAPBOX_TOKEN}`;
  
  return (
    <div className="tru-tracker-satellite-panel tru-tracker-satellite-enlarged">
      <img src={staticMapUrl} alt="Route Overview" className="w-full h-full object-cover" />
      
      <div className="tru-tracker-satellite-label">
        <Radar className="w-3 h-3" />
        <span>Route Overview</span>
      </div>
    </div>
  );
}
```

---

## Key Changes

| Before | After |
|--------|-------|
| Raw coordinates in path overlay | GeoJSON LineString with coordinates |
| `path-4+4285F4-0.9(encoded_coords)` | `geojson({...LineString...})` |
| Fixed position `-98,38,3.5` | `auto` with padding |
| Malformed URL | Properly encoded GeoJSON |

---

## Visual Result

```text
┌────────────────────────────────┐
│     Route Overview             │
│                                │
│    🟢 Los Angeles              │
│      ╲                         │
│       ╲────────────────╮       │
│        (blue route     │       │
│         following      │       │
│         highway        │       │
│         corridor)      │       │
│                   ╭────╯       │
│                  🔴 New York   │
│                                │
│ [Radar] Route Overview         │
└────────────────────────────────┘
```

The map will now:
- Show the **entire continental US** with the full route visible
- Display both **green (LA)** and **red (NY)** markers
- Render a **blue route line** following realistic highway waypoints
- Match the **dark theme** of the Truck View panel

---

## Technical Notes

1. **GeoJSON overlay** is simpler than encoded polylines for this use case
2. **`auto` positioning** lets Mapbox fit all overlays with appropriate zoom
3. **`padding=40`** adds buffer around edges so markers aren't cut off
4. **`#` must be escaped** as `%23` in hex color codes within GeoJSON
5. URL length is still within Mapbox's 8,192 character limit

