
# Remove Satellite Map Thumbnails from Homepage Form

## Overview
Remove the small satellite map preview images that appear below the "From" and "To" location inputs after an address/ZIP code is entered. These thumbnails are currently rendered using Mapbox satellite imagery.

---

## Current State
**File:** `src/pages/Index.tsx`

### From Location Thumbnail (lines 824-832)
```tsx
{/* Satellite thumbnail after validation */}
{fromCoords && (
  <div className="tru-qb-satellite-thumb">
    <img 
      src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${fromCoords[0]},${fromCoords[1]},13,0/200x80@2x?access_token=...`}
      alt="Origin area"
    />
  </div>
)}
```

### To Location Thumbnail (lines 864-872)
```tsx
{/* Satellite thumbnail after validation */}
{toCoords && (
  <div className="tru-qb-satellite-thumb">
    <img 
      src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${toCoords[0]},${toCoords[1]},13,0/200x80@2x?access_token=...`}
      alt="Destination area"
    />
  </div>
)}
```

---

## Solution
Delete both satellite thumbnail blocks entirely.

---

## Changes

### 1. Remove FROM Satellite Thumbnail
**File:** `src/pages/Index.tsx` (lines 824-832)

Delete this entire block:
```tsx
{/* Satellite thumbnail after validation */}
{fromCoords && (
  <div className="tru-qb-satellite-thumb">
    <img 
      src={`https://api.mapbox.com/...`}
      alt="Origin area"
    />
  </div>
)}
```

### 2. Remove TO Satellite Thumbnail  
**File:** `src/pages/Index.tsx` (lines 864-872)

Delete this entire block:
```tsx
{/* Satellite thumbnail after validation */}
{toCoords && (
  <div className="tru-qb-satellite-thumb">
    <img 
      src={`https://api.mapbox.com/...`}
      alt="Destination area"
    />
  </div>
)}
```

---

## Summary

| Task | File | Lines | Action |
|------|------|-------|--------|
| Remove FROM satellite thumbnail | `src/pages/Index.tsx` | 824-832 | Delete block |
| Remove TO satellite thumbnail | `src/pages/Index.tsx` | 864-872 | Delete block |

## Visual Result
- The form will be cleaner and more compact
- Location inputs will only show the verified address text without satellite imagery
- The full satellite/route analysis still appears during the "Analyzing Route" modal transition
