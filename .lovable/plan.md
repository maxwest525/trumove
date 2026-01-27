

# Tracking Dashboard Layout Redesign

## Overview

This redesign focuses on:
1. Maximizing the map's vertical presence
2. Making Street View previews larger and more prominent
3. Moving key stats (ETA, distance, time) into a horizontal bar above/below the map
4. Applying white logo styling to the tracking header (like in your screenshot)
5. Removing the "Did You Know" (RouteInsights) component

---

## Layout Changes

### New Structure

```text
┌─────────────────────────────────────────────────────────────┐
│  Site Header                                                 │
├─────────────────────────────────────────────────────────────┤
│  [TRUCK ICON] Shipment Command Center     [Logo - WHITE]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌───────────────────┐  ┌──────────────┐ │
│  │              │  │                   │  │              │ │
│  │   ORIGIN     │  │                   │  │ DESTINATION  │ │
│  │  STREET VIEW │  │                   │  │  STREET VIEW │ │
│  │   (Large)    │  │                   │  │   (Large)    │ │
│  │   ~200px     │  │       MAP         │  │   ~200px     │ │
│  │              │  │    (Taller)       │  │              │ │
│  ├──────────────┤  │                   │  ├──────────────┤ │
│  │  Route Setup │  │                   │  │ Live Stats   │ │
│  │   Form       │  │                   │  │ (Compact)    │ │
│  └──────────────┘  └───────────────────┘  └──────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ETA: 4:30 PM  │  Time: 2h 15m  │  Distance: 125 mi  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Weather Strip                                              │
├─────────────────────────────────────────────────────────────┤
│  Footer                                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Part 1: White Logo in Tracking Header

**File: `src/pages/LiveTracking.tsx`**

Add the logo image import (already imported) and display it with white styling in the tracking header:

```tsx
{/* Dashboard Header */}
<header className="tracking-header">
  <div className="flex items-center gap-3">
    <img 
      src={logoImg} 
      alt="TruMove" 
      className="h-6 brightness-0 invert"  // White logo filter
    />
    <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground/80">
      Shipment Command Center
    </span>
  </div>
  ...
</header>
```

---

### Part 2: Enlarged Street View Previews

**File: `src/components/tracking/StreetViewPreview.tsx`**

Update the compact variant to have a larger height (from 100px to 180-200px):

```tsx
// Line 151 - Change compact container height
<div className="relative w-full h-[180px] rounded-lg overflow-hidden ...">
```

---

### Part 3: Map Fills More Vertical Space

**File: `src/index.css`**

Update `.tracking-map-container` to remove the restrictive max-height and use flex-grow:

```css
.tracking-map-container {
  min-height: 300px;
  flex: 1;  /* Grows to fill available space */
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid hsl(var(--border));
}
```

Also update `.tracking-content` to use `height: calc(100vh - header - footer)` approach for proper vertical fill.

---

### Part 4: Horizontal Stats Bar Below Map

**File: `src/pages/LiveTracking.tsx`**

Create a new horizontal stats strip that sits below the 3-column grid:

```tsx
{/* Quick Stats Strip - Below Map */}
{routeData && (
  <div className="tracking-stats-strip">
    <div className="stats-strip-item">
      <span className="stats-strip-label">ETA</span>
      <span className="stats-strip-value">{adjustedETA || '--:--'}</span>
    </div>
    <div className="stats-strip-divider" />
    <div className="stats-strip-item">
      <span className="stats-strip-label">Time Left</span>
      <span className="stats-strip-value">{adjustedDuration || formatDuration(remainingDuration)}</span>
    </div>
    <div className="stats-strip-divider" />
    <div className="stats-strip-item">
      <span className="stats-strip-label">Distance</span>
      <span className="stats-strip-value">{Math.round(totalDistance - distanceTraveled)} mi</span>
    </div>
    <div className="stats-strip-divider" />
    <div className="stats-strip-item">
      <span className="stats-strip-label">Progress</span>
      <span className="stats-strip-value">{Math.round(progress)}%</span>
    </div>
  </div>
)}
```

**File: `src/index.css`**

Add new styles for the horizontal stats strip:

```css
.tracking-stats-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 12px 24px;
  background: hsl(var(--muted) / 0.5);
  border-top: 1px solid hsl(var(--border));
  border-bottom: 1px solid hsl(var(--border));
}

.stats-strip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stats-strip-label {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: hsl(var(--muted-foreground));
}

.stats-strip-value {
  font-size: 18px;
  font-weight: 700;
  color: hsl(var(--foreground));
}

.stats-strip-divider {
  width: 1px;
  height: 32px;
  background: hsl(var(--border));
}
```

---

### Part 5: Remove "Did You Know" Component

**File: `src/pages/LiveTracking.tsx`**

Remove the RouteInsights import and usage:

```tsx
// Remove this import:
// import { RouteInsights } from "@/components/tracking/RouteInsights";

// Remove this JSX (around line 600-606):
// <RouteInsights
//   originCoords={originCoords}
//   destCoords={destCoords}
//   originName={originName}
//   destName={destName}
// />
```

---

### Part 6: Streamline Right Sidebar (Live Stats)

With the primary stats moved to the horizontal bar, the `UnifiedStatsCard` can be simplified or kept for detailed info. The right column can focus on:
- Traffic status & toll info
- Alternate routes
- Weigh stations
- Truck aerial view

---

## Summary of Files to Modify

| File | Changes |
|------|---------|
| `src/pages/LiveTracking.tsx` | Add white logo to header, add stats strip, remove RouteInsights |
| `src/components/tracking/StreetViewPreview.tsx` | Increase compact variant height to 180px |
| `src/index.css` | Update map container to grow vertically, add stats strip styles |

---

## Expected Results

1. **White logo** in the Shipment Command Center header matching your screenshot
2. **Larger Street View previews** (~180px) for both origin and destination making them much more visible
3. **Taller map** that fills available vertical space instead of being capped at 260px
4. **Clean horizontal stats bar** showing ETA, time, distance, progress at a glance
5. **Removed "Did You Know"** section for cleaner interface

