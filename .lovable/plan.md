

## Plan: Tracking Dashboard Fixes & Improvements

This plan addresses multiple issues identified during testing of the tracking dashboard.

---

## Summary of Issues & Fixes

| Issue | Current State | Fix |
|-------|---------------|-----|
| **1. Live Truck View - Remove 3D/Aerial** | Modal has Street/Hybrid toggle only | Already correct - no changes needed |
| **2. Demo mode real-time ETA** | Uses fast 60-second playback | Keep demo fast, but clarify distinction |
| **3. Main map dropdown cleanup** | Has Satellite, Street, 3D options | Remove broken Satellite; Street doesn't work; Add recenter button |
| **4. Remove satellite button on map** | Google Maps has mapTypeControl | Disable native map type controls |
| **5. Street View not working on main map** | Shows roadmap, not Street View | "Street" in dropdown = roadmap (this is correct naming for maps) |
| **6. 3D view looks same as 2D** | Uses maps3d library | 3D requires WebGL + specific area coverage |
| **7. Add recenter/locate truck button** | Missing | Add "Recenter" button to bring view back to truck |
| **8. Booking number pre-fill verification** | Already passes `defaultBookingNumber` | Verify working |

---

## Detailed Changes

### 1. Main Map Dropdown Cleanup (LiveTracking.tsx)

**Current dropdown options:**
- Hybrid (works)
- Satellite (broken/redundant)
- Street (shows roadmap with dark theme)
- 3D Flyover (limited availability)

**New dropdown options:**
```text
┌─────────────────────┐
│ 2D Views            │
├─────────────────────┤
│ ✓ Hybrid            │ ← Satellite + labels (default)
│   Roadmap           │ ← Renamed from "Street" 
├─────────────────────┤
│ 3D View             │
├─────────────────────┤
│   3D Flyover        │ ← Keep but with availability warning
└─────────────────────┘
```

**Changes:**
- Remove "Satellite" option (redundant with Hybrid)
- Rename "Street" to "Roadmap" for clarity
- Keep 3D Flyover as optional

### 2. Remove Native Map Type Controls (Google2DTrackingMap.tsx)

The Google Maps component has built-in satellite/map toggle buttons. Remove them to avoid redundancy:

```typescript
const map = new window.google.maps.Map(containerRef.current, {
  // ... existing options
  mapTypeControl: false,  // ← Disable built-in controls
});
```

### 3. Add Recenter Button (LiveTracking.tsx)

Add a "Recenter" button in the header that pans the map back to the truck's current position:

```typescript
{/* Recenter Button - Shows when route exists and user has panned away */}
{routeData && (
  <Button
    variant="ghost"
    onClick={() => {
      setFollowMode(true);
      // The follow mode change will trigger the map to pan back to truck
    }}
    className="tracking-header-satellite-btn"
    title="Center map on truck"
  >
    <Crosshair className="w-4 h-4" />
    <span className="hidden sm:inline">Recenter</span>
  </Button>
)}
```

### 4. Fix Demo Mode Speed Clarification

The demo mode already uses fast 60-second playback per the code:

```typescript
if (isDemoMode) {
  setAnimationSpeed(60); // Fast for demo
} else {
  setAnimationSpeed(routeData.duration); // Real-time
}
```

**No code changes needed** - this is already correct. The Demo button sets `isDemoMode = true`.

### 5. Verify Booking Number Pre-fill (CheckMyTruckModal.tsx)

The modal already has logic to pre-fill:
```typescript
} else if (defaultBookingNumber && !bookingNumber) {
  setBookingNumber(defaultBookingNumber);
}
```

And `LiveTracking.tsx` passes:
```typescript
defaultBookingNumber={currentBookingNumber}
```

**Testing needed to confirm** - code looks correct but may have timing issue. The `useEffect` dependency array should also include `bookingNumber` change detection.

---

## File Changes Summary

| File | Action | Changes |
|------|--------|---------|
| `src/pages/LiveTracking.tsx` | Modify | Simplify dropdown (remove Satellite, rename Street to Roadmap), add Recenter button, add Crosshair import |
| `src/components/tracking/Google2DTrackingMap.tsx` | Modify | Disable `mapTypeControl` to remove redundant buttons |

---

## Updated Header Control Layout

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [Search] [Go] [Demo] │ [View ▼] │ [Recenter] [Follow] │ [Pause to View Live Truck]│
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Button order (left to right):**
1. Search input + Go button
2. Demo button (small, outline style)
3. View dropdown (Hybrid, Roadmap, 3D)
4. Recenter button (new)
5. Follow button
6. Pause to View Live Truck button

---

## Technical Details

### Why 3D View Looks Same as 2D
Google's 3D Photorealistic Tiles (maps3d library) requires:
- WebGL 2.0 support
- Specific geographic coverage (major cities/landmarks)
- Sometimes slow to render high-detail 3D

If the location doesn't have 3D building data, it falls back to a flat satellite view. This is expected behavior.

### Why "Street" Shows Roadmap
The dropdown option "Street" sets `mapViewType: 'roadmap'` which is Google Maps' 2D roadmap view (roads, labels, points of interest). This is correct - "Street View" is a different Google product (360° photography).

The satellite modal's "Street View" correctly uses Google Street View Static API for 360° imagery.

---

## Verification Steps After Implementation

1. Navigate to /track
2. Enter booking #12345
3. Verify map shows in Hybrid view by default
4. Open View dropdown - should show: Hybrid, Roadmap, 3D Flyover (no Satellite)
5. Verify no satellite/map buttons on map itself
6. Pan map away from truck, click Recenter - should pan back
7. Click "Pause to View Live Truck" - should show Street View with booking # pre-filled

