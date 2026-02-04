

## Summary
Enhance the homepage Shipment Tracker section with:
1. **Animated truck movement** in the Road View panel (close-up) - truck drives around streets at real-time speed
2. **Remove label pills** from both map panels (LIVE GPS badge and Route Overview label)
3. **Window-frame borders** on both panels for a more realistic/professional look

---

## Implementation

### 1. Animated Truck Movement (TruckViewPanel)

Replace the static Mapbox image with a **live Mapbox GL JS map** that animates the camera along a street-level route:

```tsx
function TruckViewPanel() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const animationRef = useRef<number>();
  
  // Create a small looping street route (city block circuit)
  const streetRoute: [number, number][] = [
    [-97.520, 35.470],   // Start
    [-97.518, 35.472],   // Turn 1
    [-97.515, 35.471],   // Turn 2
    [-97.517, 35.468],   // Turn 3
    [-97.520, 35.470],   // Back to start (loop)
  ];
  
  useEffect(() => {
    // Initialize interactive Mapbox GL map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: streetRoute[0],
      zoom: 17,
      pitch: 60,
      bearing: 45,
      interactive: false,
    });
    
    // Animate camera along route in real-time
    let progress = 0;
    const animate = () => {
      progress += 0.0001; // Very slow for "real-time" feel
      if (progress > 1) progress = 0;
      
      // Interpolate position along route
      const position = getPointAlongRoute(streetRoute, progress);
      const bearing = getBearing(progress);
      
      map.current.setCenter(position);
      map.current.setBearing(bearing);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    map.current.on('load', animate);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      map.current?.remove();
    };
  }, []);
  
  return (
    <div className="tru-tracker-road-map tru-map-window-frame">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Truck marker - centered, fixed position */}
      <div className="tru-homepage-truck-marker">
        <div className="tru-homepage-truck-glow" />
        <div className="tru-homepage-truck-glow tru-homepage-truck-glow-2" />
        <div className="tru-homepage-truck-icon">
          <Truck className="w-6 h-6" />
        </div>
      </div>
      
      {/* REMOVED: LIVE GPS badge */}
    </div>
  );
}
```

**Key points:**
- Uses Mapbox GL JS (already installed) for smooth animation
- Camera follows a looping street-level route at "real-time" speed
- Truck icon stays centered; the map moves under it
- Heading/bearing updates to match direction of travel

---

### 2. Remove Label Pills

**TruckViewPanel:**
```tsx
// REMOVE this block entirely:
<div className="tru-tracker-live-badge">
  <span className="tru-tracker-live-dot" />
  <span>LIVE GPS</span>
</div>
```

**RouteOverviewPanel:**
```tsx
// REMOVE this block entirely:
<div className="tru-tracker-satellite-label">
  <Radar className="w-3 h-3" />
  <span>Route Overview</span>
</div>
```

---

### 3. Window Frame Border Styling

Add CSS for a realistic window/display frame effect:

```css
/* Window frame effect for map panels */
.tru-map-window-frame {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    /* Inner shadow for depth */
    inset 0 2px 4px hsl(0 0% 0% / 0.3),
    inset 0 -1px 2px hsl(0 0% 100% / 0.1),
    /* Outer glow */
    0 0 0 1px hsl(0 0% 100% / 0.1),
    0 4px 24px hsl(0 0% 0% / 0.4);
  border: 3px solid hsl(220 10% 20%);
}

.tru-map-window-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 5px;
  border: 1px solid hsl(0 0% 100% / 0.15);
  pointer-events: none;
  z-index: 20;
}

/* Subtle bezel effect */
.tru-map-window-frame::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 11px;
  background: linear-gradient(
    145deg,
    hsl(220 10% 25%) 0%,
    hsl(220 10% 15%) 50%,
    hsl(220 10% 12%) 100%
  );
  z-index: -1;
}
```

This creates:
- Subtle inner shadow for depth
- Thin highlight border for glass effect
- Dark metallic bezel border
- Slight gradient on outer frame

---

## Visual Result

```text
┌──────────────────────────────────────────────────────────────────┐
│                      SHIPMENT TRACKER                            │
├────────────────────┬────────────────────┬───────────────────────┤
│ ╔════════════════╗ │ ╔════════════════╗ │                       │
│ ║                ║ │ ║                ║ │   Real-Time Tracking  │
│ ║  Route Map     ║ │ ║  Street View   ║ │                       │
│ ║  (LA → NY)     ║ │ ║  (animated     ║ │   Track. Monitor.     │
│ ║                ║ │ ║   driving)     ║ │   Arrive.             │
│ ║   🟢━━━━━🔴    ║ │ ║      🚛        ║ │                       │
│ ║                ║ │ ║   [streets     ║ │   GPS tracking, live  │
│ ║                ║ │ ║    scroll by]  ║ │   ETAs, and instant   │
│ ╠════════════════╣ │ ╠════════════════╣ │   updates...          │
│ ╚════════════════╝ │ ╚════════════════╝ │                       │
│   (no label)       │   (no label)       │                       │
└────────────────────┴────────────────────┴───────────────────────┘
         ↑                    ↑
    Window frame         Window frame
    border effect        border effect
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Replace static TruckViewPanel with animated Mapbox GL map, remove badge/label elements |
| `src/index.css` | Add `.tru-map-window-frame` class with bezel/frame styling |

---

## Technical Notes

1. **Animation speed**: `0.0001` progress per frame = ~15 seconds per loop at 60fps, simulating realistic driving pace
2. **Route**: Small city block loop in Oklahoma City area (same location as current static view)
3. **Mapbox GL JS**: Already installed (`mapbox-gl` package) and imported in project
4. **No external API calls**: Uses local animation loop, no rate limiting concerns
5. **Performance**: Single `requestAnimationFrame` loop, efficient GPU rendering via WebGL

