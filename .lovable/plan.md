

# Compact & Unified Tracking Dashboard Plan

## Problem Analysis

The current tracking dashboard has **significant redundancy** and excessive vertical sprawl:

### Duplicate Data Fields Identified

| Data Point | Current Locations | Duplicates |
|------------|-------------------|------------|
| **Traffic delay** | TrackingDashboard (+37m), TrafficInsights (Heavy Traffic badge), RealtimeETACard (+Xm delay badge) | 3x |
| **Traffic conditions** | TrackingDashboard, TrafficInsights, RealtimeETACard | 3x |
| **Tolls** | TrackingDashboard, TrafficInsights | 2x |
| **Distance remaining** | TrackingDashboard, RealtimeETACard | 2x |
| **Time remaining** | TrackingDashboard, RealtimeETACard | 2x |
| **Live ETA** | TrackingDashboard (etaFormatted), TrafficInsights (etaFormatted), RealtimeETACard (adjustedETA) | 3x |
| **Fuel efficiency** | TrafficInsights only | 1x |
| **Progress %** | TrackingDashboard, TrackingTimeline (bottom bar) | 2x |

### Current Component Stack (Right Dashboard)
1. MultiStopSummaryCard OR StreetViewPreview (Origin)
2. TrackingDashboard (progress, distance, time, traffic, tolls, speed, ETA)
3. RealtimeETACard (ETA, distance, traffic, trend, history)
4. TrafficInsights (traffic, tolls, fuel, ETA, alternate routes)
5. TruckAerialView
6. WeighStationChecklist
7. StreetViewPreview (Destination)
8. RouteInsights

### Bottom Fixed Bar
- TrackingTimeline (large progress bar with truck icon)

---

## Solution: Unified Compact Dashboard

### Core Principles
1. **Single source of truth** for each data point
2. **Shrink map** to ~280px height (users can zoom/Check My Truck for detail)
3. **Move street views under inputs** in the left sidebar
4. **Remove bottom timeline bar** (redundant - progress shown elsewhere)
5. **Create unified stats card** combining all unique metrics

---

## Part 1: Restructure Layout - Street Views in Sidebar

### Move Origin/Destination Previews Under Input Fields

**Modify:** `src/pages/LiveTracking.tsx`

Currently the sidebar has:
- Booking Lookup
- Route Setup card (origin input, destination input, date, controls)
- Route Info card

**New sidebar structure:**
- Booking Lookup
- Route Setup card
  - Origin input
  - **Origin StreetView (compact 100px height)**
  - Destination input
  - **Destination StreetView (compact 100px height)**
  - Date picker
  - Control buttons
- Route Info card (condensed)

This **removes 2 cards from the right dashboard**.

### Create Compact Street View Variant

**Modify:** `src/components/tracking/StreetViewPreview.tsx`

Add a `compact` prop that renders:
- 100px height image
- Minimal chrome (just the view toggle button)
- No time/timeLabel display
- Location name below image

---

## Part 2: Create Unified Stats Card

### Replace 3 Cards with 1 Consolidated View

**Create:** `src/components/tracking/UnifiedStatsCard.tsx`

This single card replaces:
- TrackingDashboard
- RealtimeETACard
- TrafficInsights

**Layout:**
```text
┌─────────────────────────────────────────────────────────────┐
│  LIVE STATS                                    [↻ Refresh]  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 4:32 PM     │  │ 2h 15m      │  │ 127 mi      │         │
│  │ ETA         │  │ remaining   │  │ remaining   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░ 67% • 352/525 mi            │
├─────────────────────────────────────────────────────────────┤
│  🚦 Moderate Traffic     💲 $8-12 Tolls    ⛽ Optimal       │
│     +12m delay                             fuel-efficient   │
├─────────────────────────────────────────────────────────────┤
│  Traffic Trend: ↘ Improving • Last updated 2m ago         │
├─────────────────────────────────────────────────────────────┤
│  Alternate Routes (tap to switch)                          │
│  ┌──────────────────────────────────────────────┐          │
│  │ Via I-95 • 315 mi • 4h 50m • No tolls       │          │
│  └──────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

**Key Consolidations:**
- Single ETA display (the real-time adjusted one)
- Single traffic status with delay
- Single tolls display
- Single distance/time remaining
- Progress bar inline (not separate card)
- Alternate routes collapsible

---

## Part 3: Shrink Map Size

### CSS Updates

**Modify:** `src/index.css`

```css
/* Map Container - Compact height */
.tracking-map-container {
  min-height: 240px;    /* Was 340px */
  max-height: 280px;    /* Add max */
  border-radius: 12px;
  overflow: hidden;
}

/* Adjust grid for more dashboard space */
.tracking-content {
  grid-template-columns: 280px minmax(240px, 1fr) 380px;
  /* Was: 260px minmax(320px, 1fr) 400px */
}
```

---

## Part 4: Remove Bottom Timeline

### Why Remove
- The TrackingTimeline is a large horizontal bar showing progress
- Progress is already shown in the new UnifiedStatsCard
- Takes up valuable vertical space
- Users don't need a second progress visualization

**Modify:** `src/pages/LiveTracking.tsx`
- Remove the `tracking-timeline-container` div
- Remove `TrackingTimeline` component render

---

## Part 5: Right Dashboard Final Structure

### New Component Order (Single-Stop)
1. **UnifiedStatsCard** (replaces 3 cards)
2. **TruckAerialView** (when tracking active)
3. **WeighStationChecklist** (collapsible)
4. **RouteInsights** (collapsible)

### Multi-Stop Order
1. **MultiStopSummaryCard**
2. **UnifiedStatsCard**
3. **TruckAerialView**
4. **WeighStationChecklist**
5. **RouteInsights**

---

## Part 6: Make Cards Collapsible

### Add Collapsible Wrapper

**Create:** `src/components/tracking/CollapsibleDashboardCard.tsx`

Wraps cards with:
- Clickable header to expand/collapse
- Remembered state in localStorage
- Smooth animation

Apply to:
- WeighStationChecklist
- RouteInsights
- Alternate Routes section

---

## Technical Implementation

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/tracking/UnifiedStatsCard.tsx` | Combined stats display |
| `src/components/tracking/CollapsibleDashboardCard.tsx` | Collapsible wrapper |

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/LiveTracking.tsx` | New layout structure, remove timeline, reorganize |
| `src/components/tracking/StreetViewPreview.tsx` | Add compact variant |
| `src/index.css` | Shrink map, adjust grid, tighter spacing |

### Files to Potentially Remove

| File | Status |
|------|--------|
| `src/components/tracking/TrackingDashboard.tsx` | Replaced by UnifiedStatsCard |
| `src/components/tracking/RealtimeETACard.tsx` | Merged into UnifiedStatsCard |
| `src/components/tracking/TrafficInsights.tsx` | Merged into UnifiedStatsCard |
| `src/components/tracking/TrackingTimeline.tsx` | Removed entirely |

---

## Visual Comparison

### Before (Current Layout)
```text
┌──────────────────────────────────────────────────────────────────┐
│ HEADER                                                           │
├──────────┬──────────────────────────────┬────────────────────────┤
│ SIDEBAR  │                              │ StreetView Origin      │
│ (inputs) │                              ├────────────────────────┤
│          │          MAP                 │ TrackingDashboard      │
│          │       (340px)                ├────────────────────────┤
│          │                              │ RealtimeETACard        │
│          │                              ├────────────────────────┤
│          │                              │ TrafficInsights        │
│          │                              ├────────────────────────┤
│          │                              │ TruckAerialView        │
│          │                              ├────────────────────────┤
│          │                              │ WeighStations          │
│          │                              ├────────────────────────┤
│          │                              │ StreetView Dest        │
│          │                              ├────────────────────────┤
│          │                              │ RouteInsights          │
├──────────┴──────────────────────────────┴────────────────────────┤
│                    TIMELINE BAR (bottom)                         │
└──────────────────────────────────────────────────────────────────┘
```

### After (Proposed Layout)
```text
┌──────────────────────────────────────────────────────────────────┐
│ HEADER                                                           │
├──────────────────┬─────────────────────────┬─────────────────────┤
│ SIDEBAR          │                         │ UnifiedStatsCard    │
│ ┌──────────────┐ │                         │ (ETA, time, dist,   │
│ │ Origin Input │ │        MAP              │  progress, traffic, │
│ ├──────────────┤ │      (240px)            │  tolls, fuel, alt)  │
│ │ OriginPreview│ │                         ├─────────────────────┤
│ │    (100px)   │ │                         │ TruckAerialView     │
│ ├──────────────┤ │                         ├─────────────────────┤
│ │ Dest Input   │ │                         │ ▸ Weigh Stations    │
│ ├──────────────┤ │                         ├─────────────────────┤
│ │ DestPreview  │ │                         │ ▸ Route Insights    │
│ │    (100px)   │ │                         │                     │
│ ├──────────────┤ │                         │                     │
│ │ Date/Controls│ │                         │                     │
│ └──────────────┘ │                         │                     │
└──────────────────┴─────────────────────────┴─────────────────────┘
```

---

## Expected Outcomes

1. **No duplication** - Single source for each metric
2. **Compact view** - Everything visible without scrolling on 1080p
3. **Smaller map** - 240px height, users can expand via Check My Truck
4. **Street views contextual** - Under their respective input fields
5. **No bottom bar** - Timeline removed, progress shown inline
6. **Collapsible secondary info** - Weigh stations & insights can be hidden
7. **Cleaner visual hierarchy** - Primary stats prominent, secondary collapsible

