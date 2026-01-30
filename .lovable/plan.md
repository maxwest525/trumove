
# Enhance Move Summary Modal with Full Profile Info

## Overview
Update the Move Summary modal to match the reference design with better header text, subtitle, status indicators, move date/ETA, and larger satellite images without increasing the overall card size.

---

## Current State
- Header says "Move Summary"
- No subtitle text
- Shows origin/distance/destination
- No status indicators at bottom
- Satellite maps are 80x80px
- No move date or ETA displayed

## Target State (based on reference image)
- Header: "Building your personalized move profile" with green checkmark
- Subtitle explaining the validation process
- Origin/Distance/Destination layout preserved but with larger satellite images
- Status indicators row: "Cities validated", "Distance calculated", "Carrier matching ready"
- Move date and ETA added to the display
- Larger satellite thumbnails (100x100px) within same overall card footprint

---

## Changes

### 1. Update MoveSummaryModal Component
**File:** `src/pages/Index.tsx` (lines 148-225)

Update the interface to accept move date and ETA props:

```tsx
interface MoveSummaryModalProps {
  fromCity: string;
  toCity: string;
  distance: number;
  fromCoords: [number, number] | null;
  toCoords: [number, number] | null;
  moveDate?: Date | null;
  estimatedDuration?: string;
}
```

Update the component to include:
- New header text: "Building your personalized move profile"
- Subtitle paragraph
- Status indicators row at bottom
- Move date and ETA display

```tsx
function MoveSummaryModal({ 
  fromCity, toCity, distance, fromCoords, toCoords, moveDate, estimatedDuration 
}: MoveSummaryModalProps) {
  const hasData = fromCity || toCity;
  if (!hasData) return null;

  return (
    <div className="tru-move-summary-modal">
      {/* Header */}
      <div className="tru-move-summary-header">
        <CheckCircle className="w-5 h-5" />
        <h3>Building your personalized move profile</h3>
      </div>
      
      {/* Subtitle */}
      <p className="tru-move-summary-subtitle">
        We validate cities, analyze distance and access, prepare carrier matching, and estimate weight and volume.
      </p>
      
      {/* Location Grid */}
      <div className="tru-move-summary-grid">
        {/* Origin with larger map */}
        <div className="tru-move-summary-location">
          <div className="tru-move-summary-map tru-move-summary-map-lg">
            {fromCoords ? <img ... /> : <placeholder />}
          </div>
          <div className="tru-move-summary-location-info">
            <span className="label">Origin</span>
            <span className="value">{fromCity || "Enter origin..."}</span>
          </div>
        </div>
        
        {/* Distance Badge */}
        <div className="tru-move-summary-distance">
          <Route />
          <span>{distance} mi</span>
        </div>
        
        {/* Destination with larger map */}
        <div className="tru-move-summary-location">
          ...
        </div>
      </div>
      
      {/* Move Date & ETA Row */}
      {(moveDate || estimatedDuration) && (
        <div className="tru-move-summary-details">
          {moveDate && (
            <div className="tru-move-summary-detail">
              <Calendar className="w-4 h-4" />
              <span>{format(moveDate, "MMM d, yyyy")}</span>
            </div>
          )}
          {estimatedDuration && (
            <div className="tru-move-summary-detail">
              <Clock className="w-4 h-4" />
              <span>ETA: {estimatedDuration}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Status Indicators */}
      <div className="tru-move-summary-status">
        <div className={`tru-move-summary-status-item ${fromCity && toCity ? 'is-complete' : ''}`}>
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Cities validated</span>
        </div>
        <div className={`tru-move-summary-status-item ${distance > 0 ? 'is-complete' : ''}`}>
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Distance calculated</span>
        </div>
        <div className={`tru-move-summary-status-item ${fromCity && toCity ? 'is-complete' : ''}`}>
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Carrier matching ready</span>
        </div>
      </div>
    </div>
  );
}
```

### 2. Update MoveSummaryModal Usage to Pass New Props
**File:** `src/pages/Index.tsx` (lines 1377-1383)

```tsx
<MoveSummaryModal 
  fromCity={fromCity}
  toCity={toCity}
  distance={distance}
  fromCoords={fromCoords}
  toCoords={toCoords}
  moveDate={moveDate}
  estimatedDuration={estimatedDuration}
/>
```

### 3. Add New CSS Styles
**File:** `src/index.css` (after line 120)

```css
/* Subtitle */
.tru-move-summary-subtitle {
  font-size: 13px;
  color: hsl(var(--muted-foreground));
  text-align: center;
  margin-bottom: 16px;
  line-height: 1.5;
}

/* Larger Map Size (100x100) */
.tru-move-summary-map-lg {
  width: 100px;
  height: 100px;
}

/* Move Details Row (Date + ETA) */
.tru-move-summary-details {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid hsl(var(--border) / 0.5);
}

.tru-move-summary-detail {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: hsl(var(--foreground));
}

.tru-move-summary-detail svg {
  color: hsl(var(--primary));
}

/* Status Indicators Row */
.tru-move-summary-status {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 16px;
  padding-top: 12px;
}

.tru-move-summary-status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: hsl(var(--muted-foreground));
}

.tru-move-summary-status-item svg {
  color: hsl(var(--muted-foreground) / 0.5);
}

.tru-move-summary-status-item.is-complete {
  color: hsl(var(--foreground));
}

.tru-move-summary-status-item.is-complete svg {
  color: hsl(var(--primary));
}
```

---

## Summary

| Change | File | Description |
|--------|------|-------------|
| Update header text | `src/pages/Index.tsx` | "Building your personalized move profile" |
| Add subtitle | `src/pages/Index.tsx` | Descriptive text about validation |
| Add status indicators | `src/pages/Index.tsx` | Cities validated, Distance calculated, Carrier matching ready |
| Pass moveDate & ETA props | `src/pages/Index.tsx` | Add to component usage |
| Show date/ETA row | `src/pages/Index.tsx` | Display move date and estimated duration |
| Larger satellite maps | `src/index.css` | 100x100px with tru-move-summary-map-lg class |
| Style subtitle | `src/index.css` | Centered muted text |
| Style status items | `src/index.css` | Green checkmarks when complete |

## Visual Result
- Card header now says "Building your personalized move profile" with green checkmark
- Subtitle explains the validation/analysis process
- Satellite maps are larger (100x100px) for better visibility
- Move date and ETA displayed when available
- Bottom status row shows green checkmarks for completed steps
- Overall card size stays compact by using efficient spacing
