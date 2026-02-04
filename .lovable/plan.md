

## Summary
Switch the Route Overview panel from Mapbox to **Google Static Maps API** to properly display markers on Los Angeles and New York with a route line connecting them.

---

## The Problem

The current code uses **Mapbox Static API** (`api.mapbox.com`) when you wanted **Google Static Maps API** (`maps.googleapis.com`). The Mapbox URL syntax is completely different from Google's and may not be rendering correctly.

---

## The Fix

Replace the Mapbox API call with Google Static Maps API using the same format already working in `GoogleStaticRouteMap.tsx`.

**Key differences:**
| | Mapbox | Google |
|---|---|---|
| **Coord order** | `lng,lat` | `lat,lng` |
| **Marker syntax** | `pin-s+color(lng,lat)` | `markers=color:0xHEX\|label:A\|lat,lng` |
| **Path syntax** | `path-width+color-opacity(coords)` | `path=color:0xHEX\|weight:N\|lat1,lng1\|lat2,lng2` |

---

## Implementation

### File: `src/pages/Index.tsx`

**Replace the entire `RouteOverviewPanel` function (lines 438-478):**

```tsx
// Route Overview Panel - Google Static Maps API (roadmap style)
function RouteOverviewPanel() {
  // Google Maps API key
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyD8aMj_HlkLUWuYbZRU7I6oFGTavx2zKOc";
  
  // LA and NY coordinates [lat, lng] - Google uses lat,lng order
  const laLat = 34.05, laLng = -118.24;
  const nyLat = 40.71, nyLng = -74.00;
  
  // Key waypoints along the route (lat,lng pairs)
  const waypoints = [
    [34.05, -118.24],   // Los Angeles
    [35.08, -106.65],   // Albuquerque  
    [35.47, -97.52],    // Oklahoma City
    [40.71, -74.00],    // New York
  ];
  
  // Build path string for Google Static Maps
  const pathPoints = waypoints.map(([lat, lng]) => `${lat},${lng}`).join('|');
  
  // Build the Google Static Maps URL
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?` +
    `size=420x480` +
    `&scale=2` +
    `&maptype=roadmap` +
    `&markers=color:0x22c55e|size:mid|label:A|${laLat},${laLng}` +  // Green marker on LA
    `&markers=color:0xef4444|size:mid|label:B|${nyLat},${nyLng}` +  // Red marker on NY
    `&path=color:0x4285F4|weight:4|${pathPoints}` +                  // Blue route line
    `&key=${googleApiKey}`;
  
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

---

## Visual Result

```text
┌─────────────────────────────────────────────────────────────────┐
│                     SHIPMENT TRACKER SECTION                    │
├──────────────────┬────────────────────┬────────────────────────┤
│                  │                    │                        │
│   ROUTE OVERVIEW │    TRUCK VIEW      │    CONTENT             │
│   (Google Maps   │    (unchanged -    │                        │
│   roadmap with   │    Mapbox dark     │                        │
│   A/B markers    │    tilted view)    │                        │
│   + blue line)   │                    │                        │
│                  │                    │                        │
└──────────────────┴────────────────────┴────────────────────────┘
```

---

## Technical Notes

1. **Truck View Panel**: NOT modified - stays as Mapbox dark tilted view
2. Uses the existing `VITE_GOOGLE_MAPS_API_KEY` already configured in secrets
3. Green marker (A) on Los Angeles, Red marker (B) on New York
4. Blue route line (`#4285F4`) connecting them via waypoints
5. Google automatically fits the map to show all markers and path

