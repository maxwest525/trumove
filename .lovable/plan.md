

## Summary
Simplify the homepage Shipment Tracker to be a **static demo preview** that doesn't animate or loop. The Route Overview will use a Google Maps-style plain road map with city markers (like your reference screenshot), and the Truck View will be a static tilted dark mode map with the truck logo in the center.

---

## What Will Change

### 1. Route Overview (Left Panel)
**Replace satellite map with Google Maps Static API** showing:
- Plain road map style (not satellite)
- Markers on Los Angeles and New York
- Simple route polyline between them
- Like your reference screenshot - clean, standard Google Maps look

### 2. Truck View (Right Panel) 
**Make completely static** - no animation:
- Remove the `useTruckAnimation` hook usage
- Use fixed coordinates (somewhere mid-route, like Oklahoma City)
- Fixed bearing (e.g., 45° northeast heading)
- Keep the tilted dark mode view with truck icon
- Remove the Chase/North toggle (not needed for static demo)
- Keep "LIVE GPS" badge for visual effect

### 3. Remove Animation Logic
- The `useTruckAnimation` hook can remain in code but won't be used
- No more `requestAnimationFrame` loop for the homepage demo
- No throttling logic needed

---

## Implementation Details

### File: `src/pages/Index.tsx`

**A) Update SatelliteMapPanel → RouteOverviewPanel**

Replace the Mapbox satellite map with Google Static Maps API:

```tsx
function RouteOverviewPanel() {
  // LA and NY coordinates for markers
  const laLat = 34.05, laLng = -118.24;
  const nyLat = 40.71, nyLng = -74.00;
  
  // Google Static Maps API with roadmap style
  // Using the same key already used elsewhere in the project
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  // Simple route with markers - roadmap style like reference screenshot
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?` +
    `size=420x480` +
    `&scale=2` +
    `&maptype=roadmap` +
    `&markers=color:green%7Clabel:A%7C${laLat},${laLng}` +
    `&markers=color:red%7Clabel:B%7C${nyLat},${nyLng}` +
    `&path=color:0x4285F4%7Cweight:4%7C${laLat},${laLng}%7C35.08,-106.65%7C35.47,-97.52%7C${nyLat},${nyLng}` +
    `&key=${googleApiKey}`;
  
  return (
    <div className="tru-tracker-satellite-panel tru-tracker-satellite-enlarged">
      <img src={staticMapUrl} alt="Route Overview" />
      <div className="tru-tracker-satellite-label">
        <Radar className="w-3 h-3" />
        <span>Route Overview</span>
      </div>
    </div>
  );
}
```

**B) Simplify RoadMapPanel to be static**

Remove animation, use fixed position mid-route:

```tsx
function RoadMapPanel() {
  // Static position - Oklahoma City area (mid-route) with northeast heading
  const fixedCenter = { lat: 35.47, lng: -97.52 };
  const fixedBearing = 45;  // Northeast heading
  const pitch = 60;
  const zoom = 15;
  
  const roadMapUrl = `https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1/static/` +
    `pin-s+22c55e(${fixedCenter.lng},${fixedCenter.lat})/` +
    `${fixedCenter.lng},${fixedCenter.lat},${zoom},${fixedBearing},${pitch}/420x480@2x` +
    `?access_token=${MAPBOX_TOKEN}`;
  
  return (
    <div className="tru-tracker-road-map">
      <img 
        src={roadMapUrl} 
        alt="Live GPS View" 
        className="tru-tracker-road-map-img"
      />
      
      {/* Truck marker - centered, static */}
      <div className="tru-homepage-truck-marker">
        <div className="tru-homepage-truck-glow" />
        <div className="tru-homepage-truck-glow tru-homepage-truck-glow-2" />
        <div className="tru-homepage-truck-icon">
          <Truck className="w-6 h-6" />
        </div>
      </div>
      
      {/* LIVE GPS badge for visual effect */}
      <div className="tru-tracker-live-badge">
        <span className="tru-tracker-live-dot" />
        <span>LIVE GPS</span>
      </div>
    </div>
  );
}
```

**C) Remove from RoadMapPanel:**
- All animation hook usage (`useTruckAnimation`)
- Throttling logic (`lastUpdateRef`, `throttledCenter`, etc.)
- Camera mode toggle (Chase/North button + Tooltip)
- `isChaseMode` state

**D) Remove unused imports:**
- `Compass` (only used for toggle)
- Any animation-related refs that are no longer needed

---

## Visual Result

```text
┌─────────────────────────────────────────────────────────────────┐
│                     SHIPMENT TRACKER SECTION                    │
├──────────────────┬────────────────────┬────────────────────────┤
│                  │                    │                        │
│   ROUTE OVERVIEW │    TRUCK VIEW      │    CONTENT             │
│   (Google Maps   │    (Static tilted  │    - Title             │
│   plain roadmap  │    dark mode map   │    - Description       │
│   with markers   │    with truck      │    - Step pills        │
│   A → B)         │    logo centered)  │    - CTA button        │
│                  │                    │                        │
│   [border]       │   [border]         │                        │
│                  │   LIVE GPS badge   │                        │
│   Route Overview │                    │                        │
│   label          │                    │                        │
└──────────────────┴────────────────────┴────────────────────────┘
```

---

## Technical Notes

1. **Google Static Maps API** will show the clean roadmap style with green/red markers like your reference screenshot
2. **Mapbox navigation-night-v1** will provide the tilted dark mode view for the truck panel
3. **No animation loop** means no CPU usage for homepage demo
4. Both panels remain as simple `<img>` tags with static URLs
5. The `useTruckAnimation` hook can be kept in the file for potential future use on other pages

