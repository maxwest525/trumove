
# Multi-Stop Booking Flow & Google APIs Enhancement Plan

## Overview
This plan implements a multi-stop booking capability using Google Route Optimization, verifies Google Places autocomplete is working correctly, and prepares the infrastructure for route optimization. The key finding is that **Google Directions API needs to be enabled** in Google Cloud Console for route optimization to work.

---

## Current State Analysis

### Google Places Autocomplete - Working
- Edge function `google-places-autocomplete` returns proper suggestions
- Successfully returns structured data with city, state, street address
- Already integrated into `LocationAutocomplete.tsx` as primary source with Mapbox fallback

### Route Optimization - Needs API Enablement
- Edge function `google-route-optimization` exists and is deployed
- Currently returns `REQUEST_DENIED` error
- This indicates the **Directions API is not enabled** in Google Cloud Console
- Once enabled, will support up to 10 waypoints with optimization

---

## Part 1: Enable Google Directions API

### User Action Required
The user needs to enable the Directions API in their Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select the project associated with `GOOGLE_MAPS_API_KEY`
3. Navigate to **APIs & Services** > **Library**
4. Search for **"Directions API"**
5. Click **Enable**

The same API key (`GOOGLE_MAPS_API_KEY`) is already configured in the project secrets, so no new secrets are needed.

---

## Part 2: Multi-Stop Booking Flow

### 2.1 Create Multi-Stop Estimate Wizard Component

**New File:** `src/components/estimate/MultiStopWizard.tsx`

A new wizard flow that allows customers to:
- Add multiple pickup locations (up to 10 stops)
- Add multiple drop-off locations
- Reorder stops via drag-and-drop
- See optimized route preview
- View distance/time savings from optimization

```text
┌─────────────────────────────────────────────────────────────┐
│  Multi-Stop Move Planner                                    │
├─────────────────────────────────────────────────────────────┤
│  PICKUP LOCATIONS                                [+ Add]    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 1. 123 Main St, Jacksonville, FL              [✓] [×]  │ │
│  │ 2. 456 Oak Ave, Jacksonville, FL              [✓] [×]  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  DROP-OFF LOCATIONS                              [+ Add]    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 1. 789 Beach Blvd, Miami, FL                  [✓] [×]  │ │
│  │ 2. 101 Palm Dr, Miami, FL                     [✓] [×]  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ROUTE OPTIMIZATION                                     │ │
│  │ Original: 485 mi, 7h 20m                               │ │
│  │ Optimized: 412 mi, 6h 15m                              │ │
│  │ Savings: 15% distance, 14% time saved                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  [Optimize Route]              [Continue to Inventory →]    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Create Multi-Stop Location List Component

**New File:** `src/components/estimate/MultiStopLocationList.tsx`

Features:
- Dynamic list of addresses with add/remove
- Drag-and-drop reordering using existing `@dnd-kit` library
- Validation status indicators per address
- Geocoding on selection to get coordinates

### 2.3 Create Route Optimization Results Component

**New File:** `src/components/estimate/RouteOptimizationCard.tsx`

Displays:
- Original vs optimized route comparison
- Visual savings indicators (distance %, time %)
- Leg-by-leg breakdown showing order of stops
- Interactive map preview of optimized route

### 2.4 Create Multi-Stop Route Hook

**New File:** `src/hooks/useRouteOptimization.ts`

```typescript
interface UseRouteOptimizationResult {
  optimize: (waypoints: Waypoint[]) => Promise<void>;
  isOptimizing: boolean;
  result: OptimizationResult | null;
  error: string | null;
}
```

Handles:
- Calling `google-route-optimization` edge function
- Caching results to avoid repeated API calls
- Error handling with user-friendly messages
- Fallback behavior when API unavailable

### 2.5 Integrate Into Existing Estimate Flow

**Modify:** `src/components/estimate/EstimateWizard.tsx`

Add a toggle or option in Step 1 to switch between:
- **Single Move** (current flow) - one origin, one destination
- **Multi-Stop Move** (new flow) - multiple pickups/drop-offs

### 2.6 Update Extended Move Details Type

**Modify:** Type in `src/components/estimate/EstimateWizard.tsx`

```typescript
export interface ExtendedMoveDetails {
  // ... existing fields
  
  // Multi-stop support
  isMultiStop: boolean;
  pickupLocations: Array<{
    address: string;
    coords: [number, number] | null;
    order: number;
  }>;
  dropoffLocations: Array<{
    address: string;
    coords: [number, number] | null;
    order: number;
  }>;
  optimizedRoute?: {
    totalDistance: number;
    totalDuration: number;
    savings: { distancePercent: number; durationPercent: number };
    legOrder: number[];
  };
}
```

---

## Part 3: Verify Google Places Autocomplete

### Current Status - Working
The edge function test shows Google Places is returning proper results:
- Returns 5 suggestions per query
- Includes structured data (city, state, street address, place ID)
- Session token support for billing optimization

### Visual Testing Verification
To test in the UI:
1. Navigate to `/estimate` (Online Estimate page)
2. Type an address in the "From" field
3. Verify dropdown shows Google-sourced suggestions
4. Select an address and verify it validates

### Fallback Behavior
If Google Places fails, the system falls back to Mapbox:
- `LocationAutocomplete.tsx` lines 490-510 handle this
- Mapbox suggestions are used as backup
- User experience remains seamless

---

## Part 4: Compact Dashboard Integration

### Update Estimate Page for Multi-Stop Summary

**Modify:** `src/pages/OnlineEstimate.tsx`

When multi-stop is enabled:
- Show compact list of all pickup/dropoff locations
- Display route optimization savings
- Show optimized route preview map

### Update Quote Summary for Multi-Stop

**Modify:** `src/components/estimate/QuoteSnapshotVertical.tsx`

Add section for:
- Multiple origin/destination display
- Total optimized distance
- Savings badge

---

## Part 5: Files to Create

| File | Purpose |
|------|---------|
| `src/components/estimate/MultiStopWizard.tsx` | Main multi-stop booking wizard |
| `src/components/estimate/MultiStopLocationList.tsx` | Drag-and-drop location list |
| `src/components/estimate/RouteOptimizationCard.tsx` | Optimization results display |
| `src/hooks/useRouteOptimization.ts` | Route optimization API hook |

## Part 6: Files to Modify

| File | Changes |
|------|---------|
| `src/components/estimate/EstimateWizard.tsx` | Add multi-stop toggle option |
| `src/pages/OnlineEstimate.tsx` | Integrate multi-stop flow |
| `src/components/estimate/QuoteSnapshotVertical.tsx` | Multi-stop summary section |
| `supabase/functions/google-route-optimization/index.ts` | Add better error messages for REQUEST_DENIED |

---

## Part 7: Technical Details

### Route Optimization API Request Format
```typescript
{
  waypoints: [
    { lat: 30.326472, lng: -81.65535, label: "Jacksonville Pickup 1" },
    { lat: 30.329012, lng: -81.66234, label: "Jacksonville Pickup 2" },
    { lat: 25.773357, lng: -80.1919, label: "Miami Dropoff 1" },
    { lat: 25.761681, lng: -80.191788, label: "Miami Dropoff 2" }
  ]
}
```

### Route Optimization API Response Format
```typescript
{
  optimizedOrder: [0, 1, 3, 2],  // Reordered indices
  totalDistance: 352000,         // meters
  totalDuration: 22500,          // seconds
  savings: {
    distancePercent: 15.2,
    durationPercent: 14.8
  },
  legs: [
    { from: 0, to: 1, distance: 2400, duration: 180 },
    { from: 1, to: 3, distance: 348000, duration: 22000 },
    { from: 3, to: 2, distance: 1600, duration: 320 }
  ]
}
```

### Drag and Drop Integration
Using existing `@dnd-kit` packages:
- `@dnd-kit/core` - DnD context and sensors
- `@dnd-kit/sortable` - Sortable list functionality
- `@dnd-kit/utilities` - CSS transform utilities

---

## Part 8: Implementation Order

1. **User Action**: Enable Google Directions API in Cloud Console

2. **Phase 1**: Create core components
   - `MultiStopLocationList.tsx` - reusable location list
   - `useRouteOptimization.ts` - API hook
   - `RouteOptimizationCard.tsx` - results display

3. **Phase 2**: Create multi-stop wizard
   - `MultiStopWizard.tsx` - full booking flow
   - Integrate with existing estimate wizard

4. **Phase 3**: Update estimate page
   - Add multi-stop option
   - Integrate route preview
   - Update quote summary

5. **Phase 4**: Polish and testing
   - Error handling for API unavailable
   - Mobile responsiveness
   - Loading states and animations

---

## Expected Outcomes

1. **Route Optimization Ready** - Once Directions API is enabled, multi-stop optimization works
2. **Google Places Verified** - Autocomplete working with proper fallback
3. **Multi-Stop Booking** - Customers can plan complex moves with multiple stops
4. **Cost Savings Visibility** - Users see how route optimization saves time and distance
5. **Seamless UX** - Multi-stop integrates naturally into existing estimate flow

---

## Prerequisites Checklist

- [ ] **Enable Google Directions API** in Google Cloud Console (user action required)
- [x] Google Places API working
- [x] `@dnd-kit` libraries installed
- [x] `GOOGLE_MAPS_API_KEY` secret configured
- [x] Edge function deployed and accessible
