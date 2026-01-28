

## Plan: Full Google Maps Integration with 3D/Follow Mode & Live Truck View Fix

This is a comprehensive overhaul to replace Mapbox with Google Maps APIs where superior, add a "Follow Truck" mode with smooth camera transitions, and fix the Live Truck View to work correctly during animation.

---

## Part 1: Follow Truck Mode with Smooth Camera Transitions

### Problem
Currently, the map stays static during truck animation. Users want to follow the truck with smooth camera movement.

### Solution
Add a toggleable "Follow Truck" mode that:
- Keeps the camera centered on the truck
- Uses smooth easing for camera transitions
- Shows truck heading direction
- Auto-disables when user manually pans

### Changes to `src/components/tracking/TruckTrackingMap.tsx`

| Change | Description |
|--------|-------------|
| Add `followMode` state | Boolean to track if camera follows truck |
| Add `flyTo` camera animation | Smooth camera transition to truck position on each progress update |
| Add follow mode toggle UI | Button in top-right to enable/disable follow mode |
| Add user interaction detection | Disable follow mode when user manually pans/zooms |
| Smooth bearing updates | Animate camera heading to match truck direction |

```typescript
// New state
const [followMode, setFollowMode] = useState(false);

// In progress useEffect, add camera follow:
if (followMode && map.current) {
  map.current.easeTo({
    center: currentPos,
    bearing: bearing,
    zoom: 14,
    pitch: 45, // Tilted view for 3D feel
    duration: 500,
    easing: (t) => t * (2 - t) // Ease out quad
  });
}
```

---

## Part 2: Fix Live Truck View Sidebar Component

### Current Issues
1. Progress bucket logic doesn't reset between tracking sessions
2. Coordinate key comparison too aggressive, blocking fetches
3. View updates not smooth during animation

### Solution
Update `src/components/tracking/TruckAerialView.tsx`:

| Change | Description |
|--------|-------------|
| Reset progress bucket on tracking start | Clear `lastProgressBucket` when `isTracking` changes |
| Improve coordinate key precision | Round to 3 decimal places (~100m) for better cache hits |
| Add transition animation | Smooth crossfade between images |
| Always fetch on first render | Initial fetch even if origin, not just on progress change |

```typescript
// Reset bucket when tracking state changes
useEffect(() => {
  lastProgressBucket.current = -1;
  lastFetchedCoords.current = null;
}, [isTracking]);

// Fetch immediately when coordinates first become available
useEffect(() => {
  if (currentPosition && !lastFetchedCoords.current) {
    // Initial fetch
    fetchAerialView(...)
  }
}, [currentPosition]);
```

---

## Part 3: Google Maps API Migration Strategy

### Currently Using Mapbox For:
- Route calculation (Directions API)
- Map rendering (GL JS)
- Satellite/aerial imagery (Static API)
- Traffic layer (driving-traffic style)

### Google APIs to Leverage:

| API | Purpose | Status | Action |
|-----|---------|--------|--------|
| **Routes API** | Traffic-aware routing, ETAs, tolls | ✅ Already integrated | Keep using |
| **Aerial View API** | Cinematic 3D video flyovers | ✅ Already integrated | Keep using |
| **Street View Static API** | Location previews | ✅ Already integrated | Keep using |
| **Places Autocomplete** | Address suggestions | ✅ Already integrated | Keep using |
| **Address Validation** | USPS-verified addresses | ✅ Already integrated | Keep using |
| **Map Tiles API** | 2D/3D map rendering | ❌ Not used | **Add for 3D globe** |
| **3D Maps (maps3d)** | Photorealistic 3D buildings | ❌ Not used | **Add for immersive view** |

---

## Part 4: Add Google 3D Photorealistic Map

### New Feature: 3D Globe View Toggle
Create an optional 3D view using Google's photorealistic 3D maps for immersive tracking.

### New Component: `Google3DTrackingView.tsx`

```typescript
// Uses Google Maps JavaScript API with maps3d library
const { Map3DElement } = await google.maps.importLibrary('maps3d');

// Create 3D map with photorealistic tiles
const map3D = new Map3DElement({
  center: { lat, lng, altitude: 500 },
  range: 1000,
  tilt: 65,
  heading: bearing,
  mode: 'HYBRID' // Photorealistic + labels
});

// Animate camera along route
map3D.flyCameraTo({
  endCamera: { center: truckPosition, range: 800, tilt: 60, heading: bearing },
  durationMillis: 1000
});
```

### UI Integration
Add a "3D View" toggle button on the map that:
- Switches between Mapbox 2D and Google 3D modes
- Preserves truck position and route display
- Uses `flyCameraTo` for smooth transitions

---

## Part 5: Enhanced View Modes

### Current View Modes (in TruckAerialView):
- Video (Aerial View API flyover)
- Aerial (Mapbox satellite high-zoom)
- Satellite (Mapbox satellite-streets)
- Street (Google Street View)

### New View Modes to Add:
- **3D Immersive** - Google photorealistic 3D buildings
- **Helicopter** - Animated orbit around truck position

### View Mode Enhancement Table

| Mode | Source | Description |
|------|--------|-------------|
| Flyover | Google Aerial View API | Cinematic video of location |
| Street | Google Street View API | Ground-level imagery |
| Satellite | ~~Mapbox~~ → Google | High-zoom overhead |
| 3D | Google Maps 3D tiles | Photorealistic buildings |
| Orbit | Google Maps 3D + animation | Rotating camera around point |

---

## Part 6: Replace Mapbox Satellite with Google

### Changes to `src/components/tracking/TruckAerialView.tsx`

Replace Mapbox satellite URLs with Google Static Maps API:

```typescript
// Before (Mapbox)
const satelliteUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lng},${lat},18/400x250@2x?access_token=${mapboxToken}`;

// After (Google)
const satelliteUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=800x500&maptype=satellite&key=${googleApiKey}`;
```

### Changes to `src/components/tracking/StreetViewPreview.tsx`

Same replacement for satellite imagery.

---

## Summary of Files to Modify

| File | Changes |
|------|---------|
| `src/components/tracking/TruckTrackingMap.tsx` | Add follow mode, smooth camera transitions, 3D toggle |
| `src/components/tracking/TruckAerialView.tsx` | Fix progress tracking, add 3D/orbit modes, replace Mapbox with Google |
| `src/components/tracking/StreetViewPreview.tsx` | Replace Mapbox satellite with Google Static Maps |
| `src/components/tracking/Google3DTrackingView.tsx` | **NEW** - Google Maps 3D photorealistic component |
| `src/pages/LiveTracking.tsx` | Add 3D view toggle, pass Google API key |
| `src/index.css` | Add 3D view toggle button styles |
| `index.html` | Add Google Maps JavaScript API script with maps3d library |

---

## New Files to Create

### `src/components/tracking/Google3DTrackingView.tsx`
A new React component that renders Google's photorealistic 3D map using the `Map3DElement`. Features:
- Smooth camera following with `flyCameraTo`
- Truck marker as 3D model or icon
- Route polyline rendered in 3D space
- Orbit animation option

---

## Implementation Order

1. **Fix Live Truck View** - Reset state, improve fetching logic
2. **Add Follow Mode** - Smooth camera on Mapbox map
3. **Replace Mapbox satellite** - Use Google Static Maps
4. **Create Google 3D component** - Photorealistic view
5. **Add view mode toggles** - 2D/3D switch in UI
6. **Polish and test** - Smooth transitions, fallbacks

---

## Technical Considerations

### Google Maps JavaScript API Setup
Add to `index.html`:
```html
<script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&v=alpha&loading=async&libraries=maps3d"></script>
```

### Rate Limits
- Aerial View API: 180 requests/min (already cached)
- Static Maps: 25,000/day (no concerns)
- Maps JavaScript API: 28,500 loads/month (free tier)

### Fallback Strategy
If Google 3D unavailable (older browsers, API limits), fall back to:
1. Mapbox 2D with tilt/pitch (pseudo-3D)
2. Google Static satellite
3. Mapbox satellite

---

## Visual Preview

```text
┌─────────────────────────────────────────────────────────────────┐
│  [🚚 LIVE]  [IN TRANSIT]  [ON SCHEDULE]     [2D] [3D] [Follow] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    ┌─────────────────┐                          │
│                    │  🚚 ← Truck     │                          │
│          ╔════════╗│                 │                          │
│    Origin║  JAX   ║│  Route Line →   │─────────→ Destination   │
│          ╚════════╝│                 │           ╔═════════╗   │
│                    │                 │           ║  MIAMI  ║   │
│                    └─────────────────┘           ╚═════════╝   │
│                                                                 │
│  ┌──────────┐  Camera smoothly follows truck in 3D mode        │
│  │ 42% Done │                                                   │
└──┴──────────┴───────────────────────────────────────────────────┘
```

