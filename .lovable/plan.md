

## Plan: Fix Button Styling, Add Weather to Sidebar, and Fix Truck Positioning

This plan addresses three issues on the Shipment Command Center tracking page:

---

### 1. Remove All-Green Buttons - Apply High-Contrast Styling

**Problem:** The "Go" button in the header is fully green, which conflicts with the brand guidelines of using green only as subtle accents.

**Solution:** Update button styling to use high-contrast dark backgrounds with white text instead of green fills.

**Changes:**
- Modify `.tracking-header-go-btn` in `src/index.css`:
  - Change from green background to dark/tm-ink background
  - Use white text
  - Keep green only as hover glow accent
- Ensure the satellite button maintains its current glass-morphism style (already correct)

**Before:**
```css
.tracking-header-go-btn {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
```

**After:**
```css
.tracking-header-go-btn {
  background: hsl(var(--tm-ink));
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

### 2. Move Weather Component to Right Sidebar (Under Weigh Stations)

**Problem:** The weather strip is currently at the bottom of the main grid layout. User wants it in the right sidebar under the weigh stations checklist.

**Solution:** Move the `<RouteWeather>` component from the bottom of `tracking-content` into the `tracking-dashboard` (right sidebar), placed after `<WeighStationChecklist>`.

**Changes in `src/pages/LiveTracking.tsx`:**
- Remove `<RouteWeather>` from its current position (after `tracking-content` grid)
- Add it inside `tracking-dashboard` div after the `WeighStationChecklist` component
- Create a card wrapper to match sidebar styling

**New sidebar structure:**
```text
Right Sidebar (tracking-dashboard):
├── Multi-Stop Summary Card (conditional)
├── UnifiedStatsCard
├── TruckAerialView (when tracking)
├── WeighStationChecklist
└── RouteWeather (NEW POSITION - card format)
```

**CSS Updates:**
- Create new `.tracking-weather-card-sidebar` class for vertical card layout
- Style weather cards to stack vertically and match sidebar card aesthetics
- Ensure proper contrast with white text on dark cards

---

### 3. Fix Truck Animation Alignment with Route Line

**Problem:** The truck marker appears offset from the route line during animation. This is caused by the marker's anchor point not being centered properly.

**Solution:** Add explicit anchor configuration to the Mapbox marker so it centers on the route coordinates.

**Changes in `src/components/tracking/TruckTrackingMap.tsx`:**
- When creating the truck marker, specify `anchor: 'center'` in the marker options
- This ensures the truck icon's center point aligns exactly with the route coordinates

**Code change:**
```typescript
// Before
truckMarker.current = new mapboxgl.Marker({ 
  element: truckEl, 
  rotationAlignment: "map" 
})

// After
truckMarker.current = new mapboxgl.Marker({ 
  element: truckEl, 
  rotationAlignment: "map",
  anchor: 'center'
})
```

---

### Summary of Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Update `.tracking-header-go-btn` to dark background, add sidebar weather styles |
| `src/pages/LiveTracking.tsx` | Move `<RouteWeather>` into right sidebar after weigh stations |
| `src/components/tracking/TruckTrackingMap.tsx` | Add `anchor: 'center'` to truck marker configuration |

---

### Visual Result

After implementation:
- **Header buttons**: Dark "Go" button with white text (green glow on hover only)
- **Right sidebar**: Weather cards appear below weigh station checklist in a vertical format
- **Map animation**: Truck icon travels exactly along the route line without offset

