
# Fix Orbit Animation, Add 3D Terrain to Route Overview, and Intro Fly-Through

This plan addresses all your feedback: fixing the broken camera orbit, making the maps look as cool as the Mapbox documentation examples, and removing Street View from the tracking map.

## What's Wrong with the Current Orbit

The current sine wave oscillation (`Math.sin(Date.now() / 4000) * 25`) has a problem:
- `Date.now()` returns huge values (milliseconds since 1970)
- When divided by 4000, it creates very large radians for the sine function
- This causes the sine wave to appear "choppy" because it's cycling through many complete periods rapidly
- The camera appears to jump 5% then reset because you're seeing micro-slices of fast oscillation

## Implementation Plan

### 1. Fix the Orbit Animation (Index.tsx Homepage)

Replace the current choppy sine wave with a **proper elapsed-time-based oscillation**:

```text
Current (broken):
  additionalBearing = Math.sin(Date.now() / 4000) * 25
  ↳ Date.now() is huge → sine cycles too fast → appears jerky

Fixed:
  startTime = Date.now() at animation start
  elapsedSeconds = (Date.now() - startTime) / 1000
  additionalBearing = Math.sin(elapsedSeconds * 0.25) * 35
  ↳ Counts from 0 → smooth 8-second oscillation cycle
```

This creates a natural, cinematic camera sway that:
- Oscillates ±35° smoothly over ~25 seconds (full cycle)
- Never resets or jumps
- Feels like a drone camera naturally panning while following the truck

### 2. Add 3D Terrain to Route Overview Panel (Homepage)

Convert the static image Route Overview to a **live Mapbox GL JS map** with:

```text
+------------------------------------------+
|  [3D Globe view with terrain hillshade]  |
|                                          |
|      LA ●━━━━━━━━━━━━━━━━━━━● NY         |
|           Rocky Mountains visible        |
|           with elevation shading         |
|                                          |
|  [Subtle atmospheric fog at horizon]     |
+------------------------------------------+
```

Features:
- Use `mapbox://styles/mapbox/satellite-streets-v12` for hybrid terrain view
- Add DEM terrain with **2.5x exaggeration** (dramatic mountains)
- Add atmospheric fog for depth
- 30° pitch angle to show elevation
- GeoJSON route line with cyan neon glow

### 3. Add Intro Fly-Through on Tracking Page

When the user starts tracking, add a **cinematic intro animation** that zooms from overview to street level:

```text
Sequence (3 seconds total):
1. Start: Continental overview (zoom 4, pitch 0°)
2. Mid: Regional view (zoom 8, pitch 30°) 
3. End: Street level at truck (zoom 15, pitch 55°)
```

Using the existing `cinematicFlyTo()` function from `mapbox3DConfig.ts`:
- Triggered when tracking starts AND route is calculated
- Smooth cubic easing for dramatic effect
- Ends at the origin point with tilted perspective

### 4. Confirm Street View Removal

The Street View inset was already removed from `TruckTrackingMap.tsx` (line 798 shows the comment: `{/* Street View inset removed - cleaner map focus */}`). I'll verify no other Street View overlays exist within the map component.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Fix orbit animation with elapsed-time tracking; Convert RouteOverviewPanel from static image to live Mapbox GL map with 3D terrain |
| `src/components/tracking/TruckTrackingMap.tsx` | Add intro fly-through animation when tracking starts |

## Technical Details

### Fixed Orbit Animation Logic

```javascript
// In TruckViewPanel
const startTimeRef = useRef<number>(Date.now());

const animate = () => {
  // Calculate elapsed time since animation started
  const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
  
  // Smooth sine wave: completes one oscillation every ~25 seconds
  // ±35° range for natural camera sway
  const orbitOffset = Math.sin(elapsedSeconds * 0.25) * 35;
  
  // Apply to driving bearing
  map.current.setBearing(drivingBearing + orbitOffset);
};
```

### 3D Route Overview Panel Structure

```javascript
// Convert RouteOverviewPanel to live Mapbox GL
function RouteOverviewPanel() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-98, 38], // Center of US
      zoom: 3.5,
      pitch: 35,
      bearing: -15,
      interactive: false
    });
    
    map.current.on('load', () => {
      // Add dramatic terrain
      addTerrain(map.current, 2.5);
      setFogPreset(map.current, 'satellite');
      
      // Add route line with glow
      map.current.addSource('route', { ... });
      map.current.addLayer({ id: 'route-glow', ... });
      map.current.addLayer({ id: 'route-line', ... });
    });
  }, []);
  
  return <div ref={mapContainer} className="w-full h-full" />;
}
```

### Intro Fly-Through Trigger

```javascript
// In TruckTrackingMap.tsx - when route is calculated
const triggerIntroAnimation = useCallback(() => {
  if (!map.current || !originCoords || introPlayedRef.current) return;
  
  introPlayedRef.current = true;
  
  // Start zoomed out
  map.current.jumpTo({
    center: [-98, 39], // US center
    zoom: 4,
    pitch: 0,
    bearing: 0
  });
  
  // Cinematic fly to origin
  setTimeout(() => {
    cinematicFlyTo(map.current!, originCoords, {
      zoom: 15,
      pitch: 55,
      bearing: -20,
      duration: 3500,
      curve: 1.8
    });
  }, 500);
}, [originCoords]);
```

---

## Visual Impact

| Element | Before | After |
|---------|--------|-------|
| Homepage Truck View | Camera sways 5% then resets | Smooth continuous ±35° sway |
| Homepage Route Overview | Static 2D image | Live 3D terrain with visible mountains |
| Tracking Page Load | Instant view at origin | Cinematic zoom from space to street |
| Tracking Map | May have Street View inset | Clean map-only focus |

These changes will make your maps match the stunning Mapbox documentation examples - with dramatic terrain, cinematic camera moves, and smooth animations throughout.
