

## Summary
Replace the Route Overview panel with a **dark road-style Mapbox static map** (matching the Truck View aesthetic) that shows the full LA-to-NY route. Remove the toggle button.

---

## The Approach

Use Mapbox Static API with `navigation-night-v1` style (same as Truck View) to render a fixed overhead view of the entire route. This gives a consistent dark theme across both panels while the Route Overview shows the full cross-country path.

**Key difference from Truck View:**
- Route Overview: Overhead view, zoomed out to show full route (zoom ~3.5)
- Truck View: Tilted 3D view, zoomed in to street level (zoom 15)

---

## Implementation

### File: `src/pages/Index.tsx`

Replace the `RouteOverviewPanel` function:

```tsx
// Route Overview Panel - Mapbox dark road style (matches Truck View aesthetic)
function RouteOverviewPanel() {
  const laCoords = [-118.24, 34.05]; // [lng, lat] for Mapbox
  const nyCoords = [-74.00, 40.71];
  
  // Realistic I-10/I-40/I-70 highway corridor waypoints [lng, lat]
  const waypoints = [
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
  
  // Build path overlay for Mapbox: path-strokeWidth+color(coords)
  const pathCoords = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(',');
  const pathOverlay = `path-4+4285F4-0.9(${pathCoords})`;
  
  // Markers
  const originMarker = `pin-s+22c55e(${laCoords[0]},${laCoords[1]})`;
  const destMarker = `pin-s+ef4444(${nyCoords[0]},${nyCoords[1]})`;
  
  // Use navigation-night-v1 for dark theme (same as Truck View)
  // Center on continental US, zoom 3.5 to see full route
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1/static/${pathOverlay},${originMarker},${destMarker}/-98,38,3.5/420x480@2x?access_token=${MAPBOX_TOKEN}`;
  
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

**Changes:**
1. Remove `useState` for toggle (no longer needed)
2. Switch from Google Static Maps to Mapbox Static API
3. Use `navigation-night-v1` style (same dark theme as Truck View)
4. Coordinates in `[lng, lat]` order (Mapbox format)
5. Remove toggle button entirely

---

## Visual Result

```text
┌────────────────────────────────────────────────────────────────────┐
│                       SHIPMENT TRACKER                             │
├─────────────────────┬─────────────────────┬───────────────────────┤
│                     │                     │                       │
│   ROUTE OVERVIEW    │     TRUCK VIEW      │      CONTENT          │
│   (dark road style) │   (dark road style) │                       │
│                     │                     │                       │
│   🟢 LA             │    [tilted 3D       │   Real-Time Tracking  │
│     ╲               │     street view     │   Know where your     │
│      ╲ blue line    │     with truck]     │   belongings are...   │
│       ╲             │                     │                       │
│        🔴 NY        │                     │                       │
│                     │                     │                       │
│   [overhead view]   │   [zoomed in,       │                       │
│   [zoom 3.5]        │    tilted]          │                       │
└─────────────────────┴─────────────────────┴───────────────────────┘
```

Both panels now share the **same dark navy aesthetic** from `navigation-night-v1`.

---

## Technical Notes

- **No toggle** - single consistent dark style
- Uses same Mapbox `navigation-night-v1` as Truck View for visual consistency
- Blue route line (`#4285F4`) with 90% opacity
- Green marker on LA, red marker on NY
- Import `Sun`, `Moon` can be removed from lucide-react if not used elsewhere

