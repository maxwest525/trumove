

## Plan: Tracking Dashboard UI Improvements

This plan addresses six key improvements to the shipment tracking dashboard:

---

## Summary of Changes

| Change | Description |
|--------|-------------|
| **1. Move Alternate Routes** | Move from UnifiedStatsCard to be next to WeighStations, both collapsible |
| **2. Real-Time Distance/Time** | Show remaining distance and time based on live ETA calculations |
| **3. Collapse Right Sidebar** | Hide dashboard cards until a route is entered/started |
| **4. Move Follow Button** | Relocate from map to header next to "Locate via Satellite" |
| **5. Add Demo Button** | Visible button that loads a demo with all features active |
| **6. Verify Satellite Auto-Population** | Ensure booking number pre-fills in satellite modal |

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/LiveTracking.tsx` | Modify | Add demo button, move follow button to header, collapse right sidebar |
| `src/components/tracking/UnifiedStatsCard.tsx` | Modify | Remove Alternate Routes section (moved elsewhere) |
| `src/components/tracking/RouteComparisonPanel.tsx` | Modify | Make collapsible by default |
| `src/components/tracking/WeighStationChecklist.tsx` | Modify | Add collapsible behavior |
| `src/components/tracking/Google2DTrackingMap.tsx` | Modify | Remove follow button from map |

---

## 1. Move Alternate Routes Near Weigh Stations

### Current State
- Alternate Routes is inside `UnifiedStatsCard.tsx` as a collapsible section at the bottom
- It's separated from route-related cards like Weigh Stations

### Changes
- Remove the Alternate Routes `Collapsible` from `UnifiedStatsCard.tsx`
- Create a new `RouteInfoSection` in `LiveTracking.tsx` that groups:
  - `RouteComparisonPanel` (alternate routes) - collapsed by default
  - `WeighStationChecklist` - collapsed by default
- Both sections will have a consistent collapsible header with chevron arrows

```typescript
// New grouped section in right sidebar
<div className="tracking-info-card">
  <Collapsible>
    <CollapsibleTrigger>Alternate Routes ({alternateRoutes.length})</CollapsibleTrigger>
    <CollapsibleContent>
      {/* Route options */}
    </CollapsibleContent>
  </Collapsible>
</div>

<div className="tracking-info-card">
  <Collapsible>
    <CollapsibleTrigger>Weigh Stations ({count})</CollapsibleTrigger>
    <CollapsibleContent>
      {/* Station list */}
    </CollapsibleContent>
  </Collapsible>
</div>
```

---

## 2. Real-Time Distance & Time Remaining

### Current Implementation
- Already using `useRealtimeETA` hook which provides:
  - `adjustedETA` - live ETA based on traffic
  - `adjustedDuration` - remaining time
  - `remainingDistance` - distance left

### Verification
The `UnifiedStatsCard` already displays these values from the real-time hook:
```typescript
adjustedETA={routeData ? adjustedETA : null}
adjustedDuration={routeData ? adjustedDuration : null}
remainingDistance={routeData ? remainingDistance : 0}
```

**No changes needed** - the real-time data is already being passed and displayed correctly.

---

## 3. Collapse Right Sidebar Until Route Entered

### Current State
- Right sidebar (`tracking-dashboard`) is always visible
- Shows empty state message when no route

### Changes
Add a collapsed state that hides all cards until a booking/route is loaded:

```typescript
// In LiveTracking.tsx
const hasActiveRoute = !!(originCoords && destCoords);

// Conditionally render sidebar or collapsed state
<div className={cn(
  "tracking-dashboard transition-all duration-300",
  !hasActiveRoute && "tracking-dashboard-collapsed"
)}>
  {hasActiveRoute ? (
    // Render all dashboard cards
  ) : (
    // Collapsed mini-state with "Enter route to view stats" message
    <div className="tracking-sidebar-collapsed">
      <ChevronLeft className="w-5 h-5" />
      <span>Stats</span>
    </div>
  )}
</div>
```

Add CSS for collapsed state:
```css
.tracking-dashboard-collapsed {
  width: 48px;
  padding: 0;
  overflow: hidden;
}
```

---

## 4. Move Follow Button to Header

### Current Location
- Bottom-left corner of `Google2DTrackingMap.tsx`

### New Location
- In header next to "Locate via Satellite" button

### Changes

**Google2DTrackingMap.tsx:**
- Remove the follow mode toggle button (lines 368-382)

**LiveTracking.tsx:**
- Add follow toggle button in header after "Locate via Satellite":

```typescript
<div className="tracking-header-controls">
  {/* ... existing controls ... */}
  
  <Button
    variant="ghost"
    onClick={() => setFollowMode(!followMode)}
    className="tracking-header-satellite-btn"
  >
    <Navigation2 className="w-4 h-4" />
    <span className="hidden sm:inline">
      {followMode ? "Following" : "Follow"}
    </span>
  </Button>
  
  <Button onClick={() => setShowCheckMyTruck(true)}>
    <Eye className="w-4 h-4" />
    <span>Locate via Satellite</span>
  </Button>
</div>
```

---

## 5. Add Demo Button

### Location
- Visible in header, styled distinctly from other buttons

### Implementation

```typescript
// In header controls section
<Button
  variant="outline"
  onClick={async () => {
    // Load demo booking #12345
    await handleOriginSelect('Jacksonville', '32207', '4520 Atlantic Blvd, Jacksonville, FL 32207');
    await handleDestSelect('Miami Beach', '33139', '1000 Ocean Dr, Miami Beach, FL 33139');
    setMoveDate(new Date());
    setShow3DView(false);
    setFollowMode(true);
    setCurrentBookingNumber('12345');
    // Auto-start tracking after short delay for route calculation
    setTimeout(() => {
      if (routeData) startTracking();
    }, 1500);
    toast.success('🚚 Demo mode started!', {
      description: 'Jacksonville → Miami • Full feature demo'
    });
  }}
  className="border-primary/50 text-primary hover:bg-primary/10"
>
  <Play className="w-4 h-4 mr-1" />
  <span>Demo</span>
</Button>
```

### Features Activated in Demo
- Route from Jacksonville to Miami Beach
- Real-time ETA with traffic
- Weigh station checklist
- Weather conditions
- Street View previews
- Aerial view
- Fuel cost estimate
- All stats visible

---

## 6. Satellite Modal Auto-Population (Verification)

### Current Implementation
The `CheckMyTruckModal` already receives `defaultBookingNumber` prop:

```typescript
<CheckMyTruckModal
  open={showCheckMyTruck}
  onOpenChange={setShowCheckMyTruck}
  defaultBookingNumber={currentBookingNumber}  // ← Already passed
  ...
/>
```

And `currentBookingNumber` is set when a demo booking loads:
```typescript
setCurrentBookingNumber('12345');
```

**No changes needed** - this should already work. Testing will verify.

---

## Updated Right Sidebar Layout

```text
┌─────────────────────────────────────┐
│ Live Stats Card                     │
│ (ETA, Time Left, Distance, Traffic, │
│  Tolls, Fuel)                       │
├─────────────────────────────────────┤
│ ► Alternate Routes (2) ▼            │  ← Collapsed by default
├─────────────────────────────────────┤
│ ► Weigh Stations (4) ▼              │  ← Collapsed by default
├─────────────────────────────────────┤
│ Live Aerial View                    │
├─────────────────────────────────────┤
│ Weather Conditions                  │
└─────────────────────────────────────┘
```

---

## Updated Header Layout

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Logo] Shipment Command Center                                               │
│                                                                              │
│ [Search: Enter Booking #] [Go]  [Demo]  [View ▼]  [Follow]  [Satellite]     │
│                                                                              │
│                                                      Shipment ID: TM-2026-XX│
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Details

### Follow Button Styling (In Header)
- Use same styling as other header buttons (`tracking-header-satellite-btn`)
- Toggle state with visual indicator (icon animation when active)
- No longer needs dark high-contrast style since it's in dark header

### Demo Button Styling
- Outlined style with primary accent
- Play icon to indicate action
- Positioned visibly before view controls

### Collapsible Components
- Use existing `Collapsible` from Radix UI
- Consistent chevron behavior: `▶` collapsed, `▼` expanded
- Smooth animation via CollapsibleContent

### Sidebar Collapse Animation
- CSS transition for width change
- Cards slide out horizontally
- Collapsed state shows minimal icon strip

