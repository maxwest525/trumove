

## Plan: Redesigned Live Truck View with Expandable Street View

This plan consolidates the "Live Truck View" sidebar card and the "Check My Truck" modal into a single, streamlined experience with expandable Street View functionality.

---

## Summary of Changes

| Change | Description |
|--------|-------------|
| **1. TruckAerialView Simplification** | Remove view mode cycling (aerial/satellite/3d/hybrid), show only Street View |
| **2. Add Expand Button** | Add "View Live Remote View" button to TruckAerialView header |
| **3. Expandable Panel** | Clicking button expands to full-screen interactive Google Street View |
| **4. Remove Booking Input** | No search field needed - uses current route data |
| **5. Origin Default** | Show origin Street View before tracking starts |
| **6. Live Position** | When tracking, show truck's current position Street View |
| **7. Update Header Button** | Rename header button or remove it (functionality moved to sidebar) |

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/components/tracking/TruckAerialView.tsx` | **Major Rewrite** | Convert to Street View only with expand functionality |
| `src/pages/LiveTracking.tsx` | Modify | Remove or update header "Pause to View Live Truck" button |
| `src/components/tracking/CheckMyTruckModal.tsx` | Modify | Simplify to Street View only OR replace with inline expanded view |

---

## 1. TruckAerialView Redesign

### Current Structure
```
┌─────────────────────────────────────┐
│ 📍 Live Truck View         [Aerial▼]│  ← View mode toggle
├─────────────────────────────────────┤
│                                     │
│      [Static satellite image]       │
│      [Truck marker in center]       │
│                                     │
├─────────────────────────────────────┤
│ Near: Melbourne, FL                 │
└─────────────────────────────────────┘
```

### New Structure
```
┌─────────────────────────────────────┐
│ 📍 Live Truck View   [Remote View ▶]│  ← Expand button
├─────────────────────────────────────┤
│                                     │
│      [Street View image]            │
│      (origin before tracking,       │
│       truck position when live)     │
│                                     │
├─────────────────────────────────────┤
│ Near: Melbourne, FL                 │
└─────────────────────────────────────┘
```

### Code Changes

**Remove view mode state and cycling:**
```typescript
// REMOVE these
const [viewMode, setViewMode] = useState<ViewMode>("aerial");
const cycleViewMode = () => { ... }

// REPLACE with single Street View URL
const streetViewUrl = googleApiKey
  ? `https://maps.googleapis.com/maps/api/streetview?size=800x500&location=${lat},${lng}&fov=100&heading=0&pitch=5&key=${googleApiKey}`
  : null;
```

**Add expand state and button:**
```typescript
// New props
interface TruckAerialViewProps {
  // ... existing props
  onExpandStreetView?: () => void;  // Callback to open expanded view
}

// In header
<button
  onClick={onExpandStreetView}
  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-[10px] text-primary font-semibold"
>
  <Eye className="w-3 h-3" />
  <span>Remote View</span>
</button>
```

---

## 2. Expanded Street View Component

Create a new inline expanded panel (or modify CheckMyTruckModal):

### Option A: Inline Expandable (Preferred)
When user clicks "Remote View", the sidebar card expands to show a larger interactive Street View:

```
COLLAPSED (default):
┌─────────────────────────────────────┐
│ 📍 Live Truck View   [Remote View ▶]│
├─────────────────────────────────────┤
│  [Street View thumbnail 180px]      │
└─────────────────────────────────────┘

EXPANDED (after clicking):
┌─────────────────────────────────────────────────────┐
│ 📍 Live Truck View                      [Collapse ×]│
├─────────────────────────────────────────────────────┤
│                                                     │
│         [Interactive Street View 400px]             │
│         (drag to look around)                       │
│                                                     │
├─────────────────────────────────────────────────────┤
│ 📍 Near: Melbourne, FL                              │
│ Progress: 52% • Jacksonville → Miami                │
└─────────────────────────────────────────────────────┘
```

### Option B: Full-Screen Overlay
Clicking "Remote View" opens a full-screen overlay with interactive Street View:

```
┌──────────────────────────────────────────────────────────────────┐
│ Live Remote View                                        [Close ×]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│              [Full-screen Interactive Street View]               │
│              (Google Maps Embed with Street View)                │
│                                                                  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ 📍 Near Melbourne, FL • 52% Complete • ETA 4:30 PM               │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Interactive Street View Implementation

### Static Image (Current)
```html
<img src="https://maps.googleapis.com/maps/api/streetview?..." />
```

### Interactive Embed (New)
Use Google Maps Embed API or Street View JavaScript API:

```html
<!-- Embed API (simplest) -->
<iframe
  src="https://www.google.com/maps/embed/v1/streetview?key=API_KEY&location=28.0601,-80.6081&heading=90&pitch=0&fov=100"
  width="100%"
  height="400"
  style="border:0"
  allowfullscreen
  loading="lazy"
/>
```

Or for full interactivity (drag to look around):
```html
<iframe
  src="https://www.google.com/maps?layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&output=svembed"
  width="100%"
  height="400"
  style="border:0"
  allowfullscreen
/>
```

---

## 4. LiveTracking.tsx Updates

### Update Header Button
Either:
- **Remove** the "Pause to View Live Truck" button (functionality is now in sidebar)
- **Or rename** to something else if keeping it

```typescript
// REMOVE or modify this section (lines 677-686)
<Button
  variant="ghost"
  onClick={() => setShowCheckMyTruck(true)}
  className="tracking-header-satellite-btn"
>
  <Eye className="w-4 h-4" />
  <span className="hidden sm:inline">Pause to View Live Truck</span>
</Button>
```

### Add Expand Handler
```typescript
const [streetViewExpanded, setStreetViewExpanded] = useState(false);

// Pass to TruckAerialView
<TruckAerialView
  routeCoordinates={routeCoordinates}
  progress={progress}
  isTracking={isTracking}
  originCoords={originCoords}
  googleApiKey={GOOGLE_MAPS_API_KEY}
  expanded={streetViewExpanded}
  onToggleExpand={() => setStreetViewExpanded(!streetViewExpanded)}
/>
```

---

## 5. Remove from CheckMyTruckModal

Either:
- **Delete the modal entirely** (if no longer needed)
- **Or simplify it** to just show Street View without search

If keeping modal for "search by booking number" feature:
- Remove hybrid toggle
- Remove view mode cycling
- Only show Street View

---

## Visual Flow

```
BEFORE TRACKING:
┌─────────────────────────────┐
│ 📍 Origin Location          │
│   [Remote View ▶]           │
├─────────────────────────────┤
│ [Street View of ORIGIN]     │
│ (Jacksonville, FL)          │
└─────────────────────────────┘

DURING TRACKING:
┌─────────────────────────────┐
│ 🚚 Live Truck View  🔴 LIVE │
│   [Remote View ▶]           │
├─────────────────────────────┤
│ [Street View of TRUCK POS]  │
│ (Near Melbourne, FL)        │
│ 52% Complete                │
└─────────────────────────────┘

EXPANDED (after clicking Remote View):
┌──────────────────────────────────────────────────────────────────┐
│ 🚚 Live Remote View                                     [Close ×]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│         [Interactive Street View - 400px height]                 │
│         Drag to look around                                      │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ 📍 Near Melbourne, FL • Jacksonville → Miami • 52%              │
└──────────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Google Street View Embed
```typescript
const getInteractiveStreetViewUrl = (lat: number, lng: number) => {
  // Google Maps Embed with Street View layer
  return `https://www.google.com/maps/embed/v1/streetview?key=${googleApiKey}&location=${lat},${lng}&heading=0&pitch=0&fov=90`;
};
```

### Responsive Height
- Collapsed: 180px (thumbnail)
- Expanded in sidebar: 350px  
- Full-screen overlay: 70vh

---

## Files Modified

1. **`src/components/tracking/TruckAerialView.tsx`**
   - Remove view mode cycling (aerial/satellite/3d/hybrid/video)
   - Add `expanded` prop and `onToggleExpand` callback
   - Show only Street View image
   - Add expand button in header
   - When expanded, show interactive Street View iframe

2. **`src/pages/LiveTracking.tsx`**
   - Add `streetViewExpanded` state
   - Pass expand props to TruckAerialView
   - Remove or update "Pause to View Live Truck" header button
   - Remove CheckMyTruckModal if no longer needed

3. **`src/components/tracking/CheckMyTruckModal.tsx`**
   - Either delete, or simplify to Street View only (no hybrid, no booking search)

