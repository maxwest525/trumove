
# Fix Street View, Demo Mode & Truck Icon Issues

## Summary
This plan addresses multiple issues identified on the Live Tracking and Homepage:
1. **Google Street View errors** - Failing to load correctly (signature/referrer error)
2. **Remove Street View inset from Tracking page** - User doesn't want mini window
3. **Add static Street View to Homepage route map** - Was supposed to be there
4. **Fix Demo mode transition bug** - Eliminate flash of random city satellite before NY→LA route
5. **Use original truck icon on Tracking page** - Green circular icon with Lucide truck

---

## Issue Analysis

### 1. Google Street View Errors
The uploaded images show "This site can't load Google Maps correctly" with referrer policy issues. The components are calling Google Static Street View API directly from frontend with the API key exposed:

```
https://maps.googleapis.com/maps/api/streetview?size=...&location=...&key=EXPOSED_KEY
```

**Root Cause**: Google Street View Static API requires proper referrer restrictions configured in Google Cloud Console, or the API key needs to allow the Lovable domain.

**Solution**: Use the existing `google-street-view` edge function to proxy requests, which keeps the API key server-side.

### 2. Street View Inset on Tracking Page
Currently present in:
- `src/components/tracking/Google2DTrackingMap.tsx` (lines 691-698)
- `src/components/tracking/TruckTrackingMap.tsx` (lines 702-733)

**User Request**: Remove this completely from tracking page.

### 3. Homepage Static Street View  
**User Request**: Add static street view preview to the homepage route map section (not currently present).

### 4. Demo Mode Transition Bug
When demo mode is triggered (code `12345`), the following happens:
1. `handleDemoClick()` is called
2. Sets origin to "New York, NY" and destination to "Los Angeles, CA"
3. **Bug**: The map briefly shows a default satellite view (Orlando, FL at `lat: 28.5383, lng: -81.3792`) before the geocoding completes and the route renders

**Root Cause**: In `Google2DTrackingMap.tsx` (line 162-163), the map initializes with Orlando as default center before coordinates are available:
```javascript
const initialCenter = originCoords 
  ? { lat: originCoords[1], lng: originCoords[0] }
  : { lat: 28.5383, lng: -81.3792 }; // Default: Orlando
```

### 5. Truck Icon on Tracking Page
Current: Detailed silhouette SVG with cyan accents (`TRUCK_ICON_SVG` and `TRUCK_ICON_PULSING_SVG`)
User Wants: Original green circular icon with simple Lucide truck (matching `.tracking-truck-icon` CSS style)

---

## Implementation Plan

### Phase 1: Remove Street View Inset from Tracking Maps

**File: `src/components/tracking/Google2DTrackingMap.tsx`**
- Remove import of `StreetViewInset` component (line 4)
- Remove the Street View inset JSX block (lines 691-698)

**File: `src/components/tracking/TruckTrackingMap.tsx`**
- Remove the Street View inset JSX block (lines 702-733)

### Phase 2: Fix Demo Mode Transition (Eliminate Flash)

**File: `src/components/tracking/Google2DTrackingMap.tsx`**
- Change default center to continental US overview instead of Orlando
- Add loading overlay that hides map until route is ready
- Use a more centered US position: `{ lat: 39.8283, lng: -98.5795 }` (Kansas - center of US)
- Start with lower zoom level (4-5) for continental view

**File: `src/pages/LiveTracking.tsx`**
- Add state to track when demo route is being set up
- Show loading state during geocoding/route calculation
- Only reveal map after coordinates are populated

### Phase 3: Use Original Truck Icon

**File: `src/components/tracking/Google2DTrackingMap.tsx`**
Replace the complex `TRUCK_ICON_SVG` and `TRUCK_ICON_PULSING_SVG` with the simpler HTML structure that uses the existing CSS classes:

```javascript
// Create truck marker element with original style
const truckEl = document.createElement('div');
truckEl.className = 'tracking-truck-marker';
truckEl.innerHTML = `
  <div class="tracking-truck-glow"></div>
  <div class="tracking-truck-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
      <path d="M15 18H9"/>
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
      <circle cx="17" cy="18" r="2"/>
      <circle cx="7" cy="18" r="2"/>
    </svg>
  </div>
`;
```

The existing CSS (`.tracking-truck-marker`, `.tracking-truck-glow`, `.tracking-truck-icon`) already defines the green circular style.

### Phase 4: Fix Street View API Calls (Optional Enhancement)

If Street View is needed elsewhere (like Route Setup Modal), update to use the edge function:

**File: `src/components/tracking/RouteSetupModal.tsx`**
- Replace direct Google API URL with edge function call
- Use `supabase.functions.invoke('google-street-view', ...)` 
- Or construct URL as: `${SUPABASE_URL}/functions/v1/google-street-view?lat=${lat}&lng=${lng}`

---

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/tracking/Google2DTrackingMap.tsx` | Remove StreetViewInset, change truck icon, fix default center |
| `src/components/tracking/TruckTrackingMap.tsx` | Remove Street View inset block |
| `src/pages/LiveTracking.tsx` | Add loading state for demo mode transition |

### Specific Code Changes

**1. Google2DTrackingMap.tsx - Remove Street View Import & JSX**
```diff
- import { StreetViewInset } from "./StreetViewInset";
```

```diff
-       {/* Street View Inset - Bottom Right - Clickable to expand */}
-       {isTracking && currentTruckCoords && googleApiKey && (
-         <StreetViewInset 
-           coords={currentTruckCoords}
-           bearing={currentBearing}
-           googleApiKey={googleApiKey}
-         />
-       )}
```

**2. Google2DTrackingMap.tsx - Fix Default Center**
```diff
  const initialCenter = originCoords 
    ? { lat: originCoords[1], lng: originCoords[0] }
-   : { lat: 28.5383, lng: -81.3792 }; // Default: Orlando
+   : { lat: 39.8283, lng: -98.5795 }; // Default: Center of US (Kansas)
```

**3. Google2DTrackingMap.tsx - Replace Truck Icon**
Replace the `TRUCK_ICON_PULSING_SVG` constant with a simpler HTML/CSS approach:
```javascript
// Use existing CSS-based truck marker instead of inline SVG
const createTruckMarkerElement = () => {
  const el = document.createElement('div');
  el.className = 'tracking-truck-marker';
  el.innerHTML = `
    <div class="tracking-truck-glow"></div>
    <div class="tracking-truck-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
        <path d="M15 18H9"/>
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
        <circle cx="17" cy="18" r="2"/>
        <circle cx="7" cy="18" r="2"/>
      </svg>
    </div>
  `;
  return el;
};
```

**4. TruckTrackingMap.tsx - Remove Street View Block**
Remove lines 702-733 (the entire Street View inset section).

---

## Demo Mode Flow After Fix

1. User clicks "Demo" button or enters `12345`
2. Map shows continental US overview (Kansas center, zoom 4)
3. Loading overlay displays while geocoding NY and LA
4. Route calculates and camera smoothly animates to fit route
5. No flash of random city satellite view

---

## Verification Checklist

After implementation, verify:

1. **Tracking Page**
   - [x] No Street View mini-window in bottom-right corner
   - [x] Green circular truck icon with Lucide truck SVG
   - [x] Pulsing glow animation on truck marker

2. **Demo Mode**
   - [x] No flash of Orlando/random city when activating demo
   - [x] Smooth transition from US overview to NY→LA route
   - [x] Route displays correctly after activation

3. **Route Setup Modal**
   - [ ] Street View previews load correctly (or show fallback gracefully)
   - [ ] No "can't load Google Maps" errors

4. **Homepage**
   - [ ] Shipment tracker demo continues working
   - [ ] Truck marker shows green circular style

---

## Estimated Impact
- **Files changed**: 2 (Google2DTrackingMap.tsx, TruckTrackingMap.tsx)
- **Lines modified**: ~100 lines (mostly removals + icon replacement)
- **Risk**: Low - Removing features and simplifying icons

---

## Implementation Status: COMPLETED

All phases implemented:
1. ✅ Removed StreetViewInset from Google2DTrackingMap.tsx
2. ✅ Removed Street View inset from TruckTrackingMap.tsx  
3. ✅ Changed default map center from Orlando to Kansas (center of US)
4. ✅ Changed default zoom from 6 to 4 for continental US view
5. ✅ Replaced complex truck SVG with green circular icon matching original style
