

## Plan: Tracking Dashboard UI & Functionality Improvements

This plan addresses multiple user requests to refine the tracking dashboard's UI, button styling, playback speed, and feature behaviors.

---

## Summary of Changes

| Change | Description |
|--------|-------------|
| **1. Move Alternate Routes & Weigh Stations** | Move these collapsible sections to the very bottom of the right sidebar |
| **2. Verify Satellite Auto-Population** | Confirm booking number pre-fills in "Locate via Satellite" modal |
| **3. Locate via Satellite Modal Changes** | Default to Street View, add Hybrid switch, change button text |
| **4. Add Route Animation to Satellite View** | Show truck moving in the satellite/street view modal |
| **5. Real-Time Truck Speed** | Non-demo mode must move at realistic real-time speed based on ETA |
| **6. Demo Button Styling** | Make smaller, remove green color, match other buttons |
| **7. Main Map Default to Hybrid View** | Change default mapViewType to 'hybrid' |

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/LiveTracking.tsx` | Modify | Reorder sidebar, fix animation speed, smaller demo button |
| `src/components/tracking/CheckMyTruckModal.tsx` | Modify | Add Street View default, view toggle, route animation |
| `src/index.css` | Modify | Update demo button styling to be smaller and non-green |

---

## 1. Move Alternate Routes & Weigh Stations to Bottom

### Current Order in Right Sidebar:
```text
1. Multi-Stop Summary (conditional)
2. Unified Stats Card
3. Route Info Card (Alternate Routes + Weigh Stations)
4. Live Truck Aerial View
5. Route Weather
```

### New Order:
```text
1. Multi-Stop Summary (conditional)
2. Unified Stats Card
3. Live Truck Aerial View
4. Route Weather
5. Route Info Card (Alternate Routes + Weigh Stations) ← Moved to bottom
```

### Changes in LiveTracking.tsx (lines 851-930):
Move the Route Info card block (lines 852-911) to after the RouteWeather component.

---

## 2. Verify Satellite Auto-Population

The code already passes `defaultBookingNumber={currentBookingNumber}` to the modal, and the modal has logic to pre-fill:

```typescript
// CheckMyTruckModal.tsx line 196-198
} else if (defaultBookingNumber && !bookingNumber) {
  setBookingNumber(defaultBookingNumber);
}
```

**Status**: Already implemented. Testing will confirm functionality.

---

## 3. Locate via Satellite Modal Changes

### Current Behavior:
- Shows satellite/aerial view by default
- No view toggle options
- Button says "Locate via Satellite"

### New Behavior:
- Default to Street View
- Add toggle to switch between Street View and Hybrid
- Button text changes to "Pause to View Live Truck"

### Changes in CheckMyTruckModal.tsx:

Add a view mode state and Street View component:

```typescript
const [viewMode, setViewMode] = useState<'street' | 'hybrid'>('street');
```

Replace the aerial/satellite view section with:
- Street View (default) using Google Street View Static API
- Hybrid satellite map (toggle option)
- View toggle buttons in the header

Update button text:
```typescript
<span className="hidden sm:inline">Pause to View Live Truck</span>
```

---

## 4. Add Route Animation to Satellite Modal

### Current Behavior:
- Shows static truck position based on demo data

### New Behavior:
- When tracking is active, update truck position in the modal
- Pass `progress` and `routeCoordinates` from parent to modal
- Animate truck marker position based on progress

### Changes:
Add props to CheckMyTruckModal:
```typescript
interface CheckMyTruckModalProps {
  // ... existing props
  liveProgress?: number;
  liveRouteCoordinates?: [number, number][];
}
```

Calculate interpolated position in modal:
```typescript
const livePosition = useMemo(() => {
  if (!liveRouteCoordinates?.length || liveProgress === undefined) return null;
  // Interpolate position based on progress
  const exactIndex = (liveProgress / 100) * (liveRouteCoordinates.length - 1);
  // ... interpolation logic
}, [liveProgress, liveRouteCoordinates]);
```

---

## 5. Real-Time Truck Speed (Non-Demo Mode)

### Current Issue:
Animation speed is fixed at 60 seconds regardless of actual route duration.

### Solution:
For non-demo bookings, calculate animation speed based on actual ETA:
- If route duration is 6 hours (21600 seconds), animation should take 6 hours
- Demo mode keeps the fast 60-second playback

### Changes in LiveTracking.tsx:

```typescript
// State to track if current tracking is demo mode
const [isDemoMode, setIsDemoMode] = useState(false);

// Demo button sets isDemoMode = true
onClick={async () => {
  // ... existing demo setup
  setIsDemoMode(true);
}}

// Calculate animation speed based on mode
useEffect(() => {
  if (routeData) {
    if (isDemoMode) {
      setAnimationSpeed(60); // Fast for demo
    } else {
      // Real-time: animation matches actual route duration
      setAnimationSpeed(routeData.duration); // Duration in seconds
    }
  }
}, [routeData, isDemoMode]);
```

---

## 6. Demo Button Styling

### Current:
- Full green gradient background
- Same size as other buttons
- Prominent styling

### New:
- Smaller size (32px height vs 40px)
- Ghost/outline style (not green fill)
- Subtle border accent

### CSS Changes in index.css:

```css
.tracking-header-demo-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;              /* Smaller */
  padding: 0 10px;           /* Reduced padding */
  background: transparent !important;
  backdrop-filter: blur(12px);
  color: hsl(var(--primary)) !important;  /* Text color, not fill */
  font-weight: 600;
  font-size: 11px;           /* Smaller text */
  border-radius: 8px;
  border: 1px solid hsl(var(--primary) / 0.4) !important;
  transition: all 0.2s;
}

.tracking-header-demo-btn:hover {
  background: hsl(var(--primary) / 0.1) !important;
  border-color: hsl(var(--primary) / 0.6) !important;
}
```

Also add smaller sizing for map/satellite toggle:

```css
.tracking-header-satellite-btn {
  height: 34px;
  padding: 0 10px;
  font-size: 11px;
}
```

---

## 7. Main Map Default to Hybrid View

### Current:
`mapViewType` already defaults to `'hybrid'` (line 143).

**Status**: Already implemented. No changes needed.

---

## Implementation Summary

### LiveTracking.tsx Changes:
1. Add `isDemoMode` state
2. Set `isDemoMode = true` in demo button handler
3. Calculate `animationSpeed` based on `isDemoMode` and `routeData.duration`
4. Reorder sidebar components (move Route Info card to bottom)
5. Update button text for satellite modal
6. Pass progress/coordinates to CheckMyTruckModal

### CheckMyTruckModal.tsx Changes:
1. Add `viewMode` state ('street' | 'hybrid')
2. Add Street View component as default
3. Add view toggle buttons
4. Accept `liveProgress` and `liveRouteCoordinates` props
5. Animate truck position based on live data

### index.css Changes:
1. Reduce demo button size and remove green fill
2. Reduce map toggle button size

---

## Visual Before/After

### Demo Button:
```text
BEFORE: [✨ Demo] (40px, green gradient fill, prominent)
AFTER:  [✨ Demo] (32px, outline only, subtle)
```

### Header Button Sizing:
```text
BEFORE: All buttons same size (40px)
AFTER:  Demo (32px), View toggle (34px), Follow (34px), Satellite (40px)
```

### Right Sidebar Order:
```text
BEFORE:                    AFTER:
┌─────────────────┐       ┌─────────────────┐
│ Stats Card      │       │ Stats Card      │
├─────────────────┤       ├─────────────────┤
│ Alternate Routes│       │ Aerial View     │
│ Weigh Stations  │       ├─────────────────┤
├─────────────────┤       │ Weather         │
│ Aerial View     │       ├─────────────────┤
├─────────────────┤       │ Alternate Routes│ ← Moved
│ Weather         │       │ Weigh Stations  │
└─────────────────┘       └─────────────────┘
```

### Satellite Modal:
```text
BEFORE: Satellite/Aerial view only
AFTER:  Street View (default) with Hybrid toggle
        + Live truck animation when tracking active
```

---

## Technical Details

### Real-Time Speed Calculation:
```typescript
// If route is 350 miles at 60mph average = ~5.8 hours = 21000 seconds
// Animation will take 21000 seconds (5.8 hours) to complete
// Progress updates every frame for smooth movement

// Demo mode override:
// Animation takes 60 seconds regardless of route distance
```

### Street View Integration:
```typescript
// Google Street View Static API URL
const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=400x250&location=${lat},${lng}&key=${googleApiKey}&fov=90&heading=90`;
```

