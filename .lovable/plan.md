
# Google-First Address & Multi-Feature Enhancement Plan

## Overview
This plan prioritizes replacing Mapbox-based address autocomplete with Google Places Autocomplete for superior suggestion quality, implements route weather forecasting on the estimate page, adds route optimization capabilities for multi-stop moves, and further refines the tracking dashboard for a compact, all-in-one view.

---

## Priority 1: Google Places Autocomplete (Replace Current Address System)

### Problem Statement
The current `LocationAutocomplete` component uses Mapbox Search Box API for suggestions with Google Address Validation as a secondary verification step. Users report the current system is "terrible" - suggestions are often incomplete, slow, or miss obvious addresses.

### Solution: Google Places Autocomplete API Integration

**Create new edge function:** `supabase/functions/google-places-autocomplete/index.ts`

This edge function will:
- Accept a query string and return address suggestions from Google Places Autocomplete (New)
- Return structured data including place_id, formatted_address, and address components
- Support session tokens for billing optimization
- Restrict to US addresses

```text
┌─────────────────────┐       ┌────────────────────────────────┐
│  LocationAutocomplete│ ────> │ google-places-autocomplete     │
│  (React Component)   │       │ (Edge Function)                │
└─────────────────────┘       └────────────────────────────────┘
         │                              │
         │ onSelect                     │ Google Places API
         ▼                              ▼
┌─────────────────────┐       ┌────────────────────────────────┐
│ google-address-     │       │ Returns suggestions with       │
│ validation          │       │ place_id, description,         │
│ (Final Verification)│       │ structured_formatting          │
└─────────────────────┘       └────────────────────────────────┘
```

**Update `src/components/LocationAutocomplete.tsx`:**
- Replace `searchMapboxAddresses()` with new `searchGooglePlaces()` function
- Call the new edge function for live suggestions
- On selection, use existing `google-address-validation` for final verification
- Keep Mapbox as fallback if Google API fails
- Maintain current UX patterns (Enter/Tab/Blur to confirm)

### Files to Create/Modify
| File | Action |
|------|--------|
| `supabase/functions/google-places-autocomplete/index.ts` | Create |
| `supabase/config.toml` | Add new function config |
| `src/components/LocationAutocomplete.tsx` | Refactor to use Google as primary |

---

## Priority 2: Weather Forecasts on Online Estimate Page

### Implementation
Add a weather forecast section to the estimate page that shows conditions along the route for the move date.

**Create component:** `src/components/estimate/MoveWeatherForecast.tsx`
- Uses existing `weather-route` edge function
- Shows weather for origin, midpoint, and destination
- Displays temperature, conditions, and weather icons
- Only shows after wizard is complete and locations are set

**Integrate into `src/pages/OnlineEstimate.tsx`:**
- Add `MoveWeatherForecast` component in the right sidebar (QuoteSnapshotVertical area)
- Pass origin/destination coordinates and move date

### Files to Create/Modify
| File | Action |
|------|--------|
| `src/components/estimate/MoveWeatherForecast.tsx` | Create |
| `src/pages/OnlineEstimate.tsx` | Add weather section |

---

## Priority 3: Route Optimization API for Multi-Stop Moves

### Implementation
Create edge function to optimize routes when customers have multiple pickup/drop-off points.

**Create edge function:** `supabase/functions/google-route-optimization/index.ts`
- Accepts array of waypoints
- Returns optimized order of stops
- Includes distance/duration savings
- Future use: booking flow for multi-stop moves

This is foundational infrastructure that will be used when the multi-stop booking feature is built.

### Files to Create/Modify
| File | Action |
|------|--------|
| `supabase/functions/google-route-optimization/index.ts` | Create |
| `supabase/config.toml` | Add function config |

---

## Priority 4: Clickable Truck Marker with Aerial View (Already Implemented - Verify/Enhance)

### Current State
The `TruckTrackingMap` already has clickable truck functionality with `TruckLocationPopup`. Need to verify it's working and enhance if needed.

**Verification points:**
- Click handler on truck marker element ✓
- `TruckLocationPopup` component with aerial video ✓
- Fullscreen toggle ✓

**Enhancement:**
- Ensure the popup uses the aerial view caching system for performance
- Add smoother animations

### Files to Modify
| File | Action |
|------|--------|
| `src/components/tracking/TruckLocationPopup.tsx` | Verify caching integration |

---

## Priority 5: Compact Tracking Dashboard Layout

### Goal
Users should see their entire dashboard without scrolling. The map can be smaller to give more room to stats/cards.

**CSS Updates in `src/index.css`:**
- Adjust grid: `300px minmax(400px, 1fr) 380px` → `280px minmax(350px, 1fr) 400px`
- Reduce map min-height from 400px to 350px
- Make dashboard cards more compact with tighter padding
- Use CSS grid for dashboard stats to display 2-up

**Dashboard Organization in `src/pages/LiveTracking.tsx`:**
- Group related cards into compact sections
- Reduce vertical spacing between cards
- Combine smaller stat cards into unified views

### Files to Modify
| File | Action |
|------|--------|
| `src/index.css` | Adjust tracking grid layout |
| `src/pages/LiveTracking.tsx` | Reorganize dashboard components |

---

## Technical Implementation Details

### New Edge Function: google-places-autocomplete

```typescript
// Request
{
  query: string;      // User's input
  sessionToken: string; // For billing grouping
  types?: string[];   // address, establishment, etc.
}

// Response
{
  suggestions: Array<{
    placeId: string;
    description: string;
    mainText: string;
    secondaryText: string;
    types: string[];
  }>;
}
```

### New Edge Function: google-route-optimization

```typescript
// Request
{
  waypoints: Array<{
    lat: number;
    lng: number;
    label?: string;
  }>;
}

// Response
{
  optimizedOrder: number[];  // Indices in optimal order
  totalDistance: number;     // meters
  totalDuration: number;     // seconds
  savings: {
    distancePercent: number;
    durationPercent: number;
  };
}
```

### MoveWeatherForecast Component

```typescript
interface Props {
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
  moveDate: Date | null;
  originName: string;
  destName: string;
}
```

---

## Secrets Required
All required Google APIs are already configured:
- `GOOGLE_MAPS_API_KEY` ✓ (for Places, Distance Matrix, etc.)
- `GOOGLE_ROUTES_API_KEY` ✓ (for Routes API)
- `OPENWEATHER_API_KEY` ✓ (for weather - note: logs show 401 errors, may need verification)

**APIs to enable in Google Cloud Console (if not already):**
- Places API (New) - for autocomplete
- Route Optimization API - for multi-stop optimization

---

## Implementation Order

### Phase 1: Google Places Autocomplete (Highest Priority)
1. Create `google-places-autocomplete` edge function
2. Refactor `LocationAutocomplete.tsx` to use Google as primary
3. Test across all address inputs site-wide

### Phase 2: Weather on Estimate Page
1. Create `MoveWeatherForecast` component
2. Integrate into `OnlineEstimate.tsx`
3. Fix potential OPENWEATHER_API_KEY issue (401 errors in logs)

### Phase 3: Route Optimization Edge Function
1. Create `google-route-optimization` edge function
2. Add to config.toml
3. Create basic test endpoint

### Phase 4: Dashboard Compacting
1. Update tracking CSS grid for tighter layout
2. Reorganize dashboard cards
3. Ensure aerial popup works smoothly

---

## Expected Outcomes

1. **Superior Address Input** - Google Places provides faster, more accurate suggestions
2. **Weather Intelligence** - Users see forecasted conditions for their move date
3. **Multi-Stop Ready** - Infrastructure for future multi-pickup/drop-off moves
4. **Compact Dashboard** - See all tracking info at a glance without scrolling
5. **Consistent Aerial Views** - Cached and performant aerial video popups
