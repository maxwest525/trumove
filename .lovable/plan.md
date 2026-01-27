

# Multi-Stop & Route Preview Enhancement Plan

## Overview
This plan implements three interconnected features:
1. A compact multi-stop summary card for the tracking dashboard showing all stops with ETA for each
2. A visual route preview map for the multi-stop wizard showing all locations with connecting lines
3. Testing/verification of the multi-stop booking flow

The goal is to ensure users can see their entire tracking dashboard at a glance while providing rich visual feedback during multi-stop move planning.

---

## Part 1: Compact Multi-Stop Summary Card for Tracking Dashboard

### Description
A new dashboard card that displays all stops in a multi-stop move with individual ETAs, status indicators, and a compact timeline view. This replaces or supplements the current origin/destination view when a multi-stop booking is loaded.

### New Component: `src/components/tracking/MultiStopSummaryCard.tsx`

```text
┌─────────────────────────────────────────────────────────────┐
│  MULTI-STOP ROUTE                                    3 stops│
├─────────────────────────────────────────────────────────────┤
│  ⬤──────○──────○                                           │
│                                                             │
│  1. ✓ 4520 Atlantic Blvd, Jacksonville    Completed 9:15 AM │
│  2. → 1200 Ocean Dr, Jacksonville Beach   ETA 10:30 AM      │
│  3.   100 Biscayne Blvd, Miami            ETA 4:45 PM       │
├─────────────────────────────────────────────────────────────┤
│  Total: 352 mi • 5h 45m remaining                           │
└─────────────────────────────────────────────────────────────┘
```

### Features
- Compact vertical list of all stops (pickups first, then drop-offs)
- Status indicators: Completed (checkmark), In Progress (arrow), Upcoming (circle)
- Individual ETA for each stop calculated from current progress
- Progress dots showing which leg is active
- Collapsible to show just the current + next stop
- Dark theme matching tracking dashboard

### Integration
- Add to `src/pages/LiveTracking.tsx` in the right dashboard column
- Display when multi-stop booking is detected (from CheckMyTruck modal or demo data)
- Extend the demo booking data to include multi-stop examples

---

## Part 2: Visual Route Preview Map for Multi-Stop Wizard

### Description
An interactive Mapbox map embedded in the MultiStopWizard that shows all pickup and drop-off locations with color-coded markers and connecting route lines.

### New Component: `src/components/estimate/MultiStopRoutePreview.tsx`

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│           [Mapbox Map with Route Visualization]             │
│                                                             │
│     🟢 1 ─────────────── 🟢 2                               │
│                 \                                           │
│                  \                                          │
│                   \─────── 🔴 3 ─────── 🔴 4                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
 Legend: 🟢 Pickup  🔴 Drop-off  ─── Route
```

### Features
- Auto-fit bounds to show all waypoints
- Color-coded markers:
  - Green markers for pickup locations
  - Red markers for drop-off locations
  - Numbered labels (1, 2, 3...)
- Dashed connecting lines between sequential stops
- Solid route lines when optimization is complete (showing actual road path)
- Updates dynamically as locations are added/removed
- Compact height (200-250px) to fit within wizard without scrolling

### Integration
- Insert between the location lists and the Route Optimization section in `MultiStopWizard.tsx`
- Only render when at least 2 validated locations exist
- Use Mapbox Directions API to fetch actual road geometry when optimized

---

## Part 3: Multi-Stop Demo Data & Flow Testing

### Extend Demo Bookings
Modify `src/components/tracking/CheckMyTruckModal.tsx` to include a multi-stop demo:

| Booking # | Route Type | Description |
|-----------|------------|-------------|
| 12345 | Single | Jacksonville → Miami (existing) |
| 00000 | Multi-stop | 3 pickups (JAX area) → 2 drop-offs (Miami) |

### Multi-Stop Demo Data Structure
```typescript
{
  bookingId: "00000",
  isMultiStop: true,
  stops: [
    { type: 'pickup', address: "4520 Atlantic Blvd, Jacksonville, FL", coords: [-81.65, 30.32], status: 'completed' },
    { type: 'pickup', address: "1200 Ocean Dr, Jacksonville Beach, FL", coords: [-81.39, 30.29], status: 'current' },
    { type: 'dropoff', address: "100 Biscayne Blvd, Miami, FL", coords: [-80.19, 25.77], status: 'upcoming' },
    { type: 'dropoff', address: "500 Collins Ave, Miami Beach, FL", coords: [-80.13, 25.78], status: 'upcoming' },
  ],
  totalDistance: 352,
  estimatedDuration: 20700, // seconds
}
```

---

## Part 4: Dashboard Compaction Improvements

### CSS Updates to `src/index.css`
Further optimize the tracking dashboard grid to ensure everything is visible:

- Reduce card padding from 10px to 8px
- Tighten vertical gap between cards from 10px to 6px
- Make section headers more compact (smaller font, less margin)
- Ensure multi-stop card uses efficient vertical space

### LiveTracking.tsx Reorganization
When multi-stop is active:
1. Replace separate Origin/Destination StreetViewPreviews with compact inline indicators
2. Show MultiStopSummaryCard as the primary route view
3. Collapse less critical sections (Route Insights, Weigh Stations) by default

---

## Technical Implementation Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/tracking/MultiStopSummaryCard.tsx` | Compact multi-stop timeline for tracking dashboard |
| `src/components/estimate/MultiStopRoutePreview.tsx` | Mapbox route visualization for wizard |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/estimate/MultiStopWizard.tsx` | Add route preview map component |
| `src/components/tracking/CheckMyTruckModal.tsx` | Add multi-stop demo booking (00000) |
| `src/pages/LiveTracking.tsx` | Integrate MultiStopSummaryCard, handle multi-stop state |
| `src/index.css` | Further compact tracking dashboard styles |

### New State for LiveTracking

```typescript
// Multi-stop tracking state
const [isMultiStopMove, setIsMultiStopMove] = useState(false);
const [multiStopData, setMultiStopData] = useState<{
  stops: Array<{
    type: 'pickup' | 'dropoff';
    address: string;
    coords: [number, number];
    status: 'completed' | 'current' | 'upcoming';
    eta?: Date;
  }>;
  currentStopIndex: number;
  totalDistance: number;
  totalDuration: number;
} | null>(null);
```

### ETA Calculation Logic

For each stop, calculate ETA based on:
1. Current truck position (from progress %)
2. Leg-by-leg distances from route optimization
3. Apply traffic adjustments from Google Routes data

```typescript
function calculateStopETAs(stops, currentProgress, routeLegs, trafficFactor) {
  let cumulativeTime = 0;
  const now = new Date();
  
  return stops.map((stop, index) => {
    if (index < currentStopIndex) {
      return { ...stop, status: 'completed', eta: null };
    }
    
    const legDuration = routeLegs[index]?.duration || 0;
    cumulativeTime += legDuration * trafficFactor;
    
    return {
      ...stop,
      status: index === currentStopIndex ? 'current' : 'upcoming',
      eta: new Date(now.getTime() + cumulativeTime * 1000),
    };
  });
}
```

---

## Implementation Order

### Phase 1: Route Preview Map (Wizard Enhancement)
1. Create `MultiStopRoutePreview.tsx` component
2. Integrate into `MultiStopWizard.tsx`
3. Test with manual address entry

### Phase 2: Multi-Stop Summary Card (Dashboard)
1. Create `MultiStopSummaryCard.tsx` component
2. Add multi-stop demo data to `CheckMyTruckModal.tsx`
3. Integrate into `LiveTracking.tsx`

### Phase 3: Dashboard Compaction
1. Update CSS for tighter spacing
2. Add conditional rendering for multi-stop vs single-stop views
3. Test full dashboard visibility without scrolling

### Phase 4: Testing & Polish
1. Test booking #00000 for multi-stop demo
2. Verify ETA calculations update with progress
3. Ensure route lines update when optimization runs

---

## Expected Outcomes

1. **Multi-Stop Visibility** - Users see all stops at a glance with individual ETAs
2. **Visual Route Planning** - Interactive map shows route during booking
3. **Compact Dashboard** - All tracking info visible without scrolling on desktop
4. **Seamless Demo Flow** - Both single (12345) and multi-stop (00000) demos work

