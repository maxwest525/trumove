

# Convert Route Analysis to Hero-Side "Move Summary" Modal

## Overview
Transform the "Building your personalized move profile" section into a sleek popup modal that appears on the right side of the hero when location data is entered. This will rename it to "Move Summary", feature larger satellite maps, and style the mileage badge with green-on-black treatment for visual impact.

---

## Current State
- **RouteAnalysisSection** is a full-width section that appears below the hero/StatsStrip
- It displays origin/destination with small 44x44px satellite thumbnails
- The distance badge uses primary green on light background
- Title says "Building your personalized move profile"

## Target State
- The component becomes a floating modal/card on the right side of the hero (beside the Why TruMove card)
- It appears when `fromCoords` OR `toCoords` are set
- Larger maps (100x100px or larger)
- Green mileage text on a dark/black background badge
- Title changed to "Move Summary"

---

## Changes

### 1. Create New MoveSummaryModal Component
**File:** `src/pages/Index.tsx`

Create an inline component that displays the move summary as a floating card:

```tsx
function MoveSummaryModal({ 
  fromCity, toCity, distance, fromCoords, toCoords, moveDate, estimatedDuration 
}: MoveSummaryModalProps) {
  const hasData = fromCity || toCity;
  if (!hasData) return null;
  
  return (
    <div className="tru-move-summary-modal">
      <div className="tru-move-summary-header">
        <CheckCircle className="w-5 h-5" />
        <h3>Move Summary</h3>
      </div>
      
      <div className="tru-move-summary-grid">
        {/* Origin Card with larger map */}
        <div className="tru-move-summary-location">
          <div className="tru-move-summary-map">
            {fromCoords ? (
              <img src={`mapbox satellite URL with larger size`} />
            ) : (
              <MapPin placeholder />
            )}
          </div>
          <div className="tru-move-summary-location-info">
            <span className="label">Origin</span>
            <span className="value">{fromCity || "Enter origin..."}</span>
          </div>
        </div>
        
        {/* Distance Badge - Green on Black */}
        <div className="tru-move-summary-distance">
          <Route className="w-4 h-4" />
          <span className="tru-move-summary-mileage">{distance} mi</span>
        </div>
        
        {/* Destination Card with larger map */}
        <div className="tru-move-summary-location">
          {/* Similar structure */}
        </div>
      </div>
    </div>
  );
}
```

### 2. Position Modal in Hero Right Panel
**File:** `src/pages/Index.tsx` (lines ~1294)

Add the MoveSummaryModal alongside the "Why TruMove" card in the right hero panel:

```tsx
{/* RIGHT SIDE: Why TruMove Card + Move Summary Modal */}
<div className="tru-hero-content-panel tru-hero-stacked-cards">
  
  {/* NEW: Move Summary Modal - shows when location data exists */}
  <MoveSummaryModal 
    fromCity={fromCity}
    toCity={toCity}
    distance={distance}
    fromCoords={fromCoords}
    toCoords={toCoords}
    moveDate={moveDate}
    estimatedDuration={estimatedDuration}
  />
  
  {/* CARD 1: Why TruMove - Premium Card */}
  <div className="tru-why-card-premium" ... >
```

### 3. Remove Old RouteAnalysisSection from Page
**File:** `src/pages/Index.tsx` (lines ~1424-1432)

Delete the full-width RouteAnalysisSection since it's now integrated into the hero:

```tsx
// DELETE THIS BLOCK:
{/* ROUTE ANALYSIS SECTION - Always visible */}
<RouteAnalysisSection 
  fromCity={fromCity}
  ...
/>
```

### 4. Add CSS for Move Summary Modal
**File:** `src/index.css`

```css
/* Move Summary Modal - Hero Right Side */
.tru-move-summary-modal {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--primary) / 0.2);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px hsl(var(--tm-ink) / 0.08);
  animation: slideInRight 0.4s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tru-move-summary-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.tru-move-summary-header svg {
  color: hsl(var(--primary));
}

.tru-move-summary-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: hsl(var(--foreground));
  margin: 0;
}

.tru-move-summary-grid {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

/* Larger Map Thumbnails */
.tru-move-summary-map {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid hsl(var(--border));
}

.tru-move-summary-map img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Distance Badge - Green on Black */
.tru-move-summary-distance {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background: hsl(220 15% 8%); /* Near-black */
  border-radius: 12px;
  min-width: 80px;
}

.tru-move-summary-distance svg {
  color: hsl(var(--primary)); /* Green */
}

.tru-move-summary-mileage {
  font-size: 16px;
  font-weight: 800;
  color: hsl(var(--primary)); /* Green on black */
}

.tru-move-summary-location {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.tru-move-summary-location-info {
  display: flex;
  flex-direction: column;
}

.tru-move-summary-location-info .label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(var(--muted-foreground));
}

.tru-move-summary-location-info .value {
  font-size: 13px;
  font-weight: 600;
  color: hsl(var(--foreground));
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Dark mode adjustments */
.dark .tru-move-summary-modal {
  background: hsl(220 15% 10%);
  border-color: hsl(0 0% 100% / 0.1);
}

.dark .tru-move-summary-distance {
  background: hsl(0 0% 0%);
  border: 1px solid hsl(var(--primary) / 0.3);
}
```

---

## Summary

| Change | File | Description |
|--------|------|-------------|
| Create MoveSummaryModal component | `src/pages/Index.tsx` | Inline component with larger maps and green-on-black mileage |
| Position in hero right panel | `src/pages/Index.tsx` | Add above/alongside Why TruMove card |
| Remove old RouteAnalysisSection | `src/pages/Index.tsx` | Delete full-width section call |
| Add modal CSS styles | `src/index.css` | Floating card styling, 80px maps, black distance badge |

## Visual Result
- When user enters origin or destination, a sleek "Move Summary" card slides in on the right side of the hero
- Satellite maps are larger (80x80px vs 44x44px)
- Mileage badge has a striking green-on-black appearance
- Consistent naming ("Move Summary") matches other data cards in the flow
- The card animates in with a subtle slide-from-right effect

