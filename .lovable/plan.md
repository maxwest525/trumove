

## Plan: Fix Satellite Popup, Follow Button Styling, Image Fallbacks & Auto-Populate Booking

This plan addresses four issues identified from user feedback:

1. **Satellite popup flashing issue** - The popup flashes/flickers when opening "Locate via Satellite"
2. **Following button shouldn't be solid green** - Change to outlined/ghost style when active
3. **Image fallback system** - If an image isn't available, show an alternative instead of an error
4. **Auto-populate booking info** - When a tracked booking is active, save and auto-populate the info with user consent

---

## Issue 1: Fix Satellite Popup Flashing

### Root Cause
The `TruckLocationPopup.tsx` component causes visual flashing because:
1. It renders immediately on `isOpen` before image is loaded
2. Loading state and image swap cause multiple re-renders
3. No stable initialization state

### Solution
Add an `isInitializing` state that keeps the popup hidden until the first image loads, plus CSS visibility transitions for smooth appearance.

### Changes to `src/components/tracking/TruckLocationPopup.tsx`

| Line(s) | Change |
|---------|--------|
| ~24 | Add `isInitializing` and `previousImageUrl` state |
| ~72 | Don't render popup content until initialized |
| ~147-152 | Add `onLoad` handler to clear initializing state |
| ~74-76 | Switch from Mapbox to Google Static Maps for consistency |

```typescript
// Add new state
const [isInitializing, setIsInitializing] = useState(true);
const [imageReady, setImageReady] = useState(false);

// Reset on open
useEffect(() => {
  if (isOpen) {
    setIsInitializing(true);
    setImageReady(false);
  }
}, [isOpen]);

// Update Google satellite URL (replacing Mapbox)
const getSatelliteUrl = () => {
  const googleApiKey = "AIzaSyD8aMj_HlkLUWuYbZRU7I6oFGTavx2zKOc";
  return `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates[1]},${coordinates[0]}&zoom=15&size=${isFullscreen ? '800x500' : '640x400'}&maptype=satellite&key=${googleApiKey}`;
};

// Wrap content in visibility container
<div className={cn(
  "transition-opacity duration-300",
  isInitializing ? "opacity-0" : "opacity-100"
)}>
  {/* Content */}
</div>

// Image load handler
<img
  onLoad={() => {
    setIsLoading(false);
    setIsInitializing(false);
    setImageReady(true);
  }}
  onError={() => {
    // Fallback to a working image type
    setIsLoading(false);
    setIsInitializing(false);
  }}
/>
```

---

## Issue 2: Change "Following" Button from Solid Green to Outlined

### Current Problem
When `followMode` is active, the button uses `bg-primary/90` which makes it a solid green fill - too heavy visually.

### Solution
Change to an outlined style with a subtle green border and icon glow instead of solid fill.

### Changes to `src/components/tracking/TruckTrackingMap.tsx`

| Line | Current | New |
|------|---------|-----|
| 529 | `bg-primary/90 border-primary text-primary-foreground shadow-lg shadow-primary/30` | `bg-black/60 border-primary text-primary shadow-lg shadow-primary/30` |

```typescript
// Updated styling - outlined instead of filled
<button
  onClick={toggleFollowMode}
  className={cn(
    "absolute top-4 right-16 z-20 flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-md border transition-all duration-300",
    internalFollowMode
      ? "bg-black/60 border-primary text-primary shadow-lg shadow-primary/30" // Outlined with green border
      : "bg-black/60 border-white/20 text-white/80 hover:bg-black/80"
  )}
>
```

---

## Issue 3: Image Fallback System (No Error States)

### Problem
When an image fails to load (Street View unavailable, API error, etc.), users see broken states or error messages.

### Solution
Implement a cascading fallback system across all image components:

**Fallback Chain:**
1. **Primary**: Requested image type (Street View, Aerial Video, etc.)
2. **Secondary**: Google Satellite static image
3. **Tertiary**: Gradient placeholder with location icon

### Components to Update

#### `src/components/tracking/StreetViewPreview.tsx`
- Already has `handleStreetViewError` that falls back to satellite - keep this
- Add final fallback to gradient placeholder if satellite also fails

```typescript
// Add tertiary fallback state
const [allImagesFailed, setAllImagesFailed] = useState(false);

// Update error handler
onError={() => {
  if (viewMode === "street") {
    setHasError(true);
    setViewMode("satellite"); // Try satellite
  } else {
    // Satellite also failed - show placeholder
    setAllImagesFailed(true);
    setIsLoading(false);
  }
}}

// Render fallback placeholder
{allImagesFailed && (
  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
    <div className="text-center">
      <Globe className="w-8 h-8 text-primary/40 mx-auto mb-2" />
      <span className="text-[10px] text-white/50">Imagery unavailable</span>
    </div>
  </div>
)}
```

#### `src/components/tracking/TruckAerialView.tsx`
- Add fallback when `imageUrl` is null or fails
- Show gradient placeholder with location coordinates

```typescript
// Add fallback state
const [imageFailed, setImageFailed] = useState(false);

// Handle image error
onError={() => {
  setIsLoading(false);
  setImageFailed(true);
}}

// Render fallback when no image available
{(!imageUrl || imageFailed) && !isLoading && (
  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
    <div className="text-center">
      <MapPin className="w-8 h-8 text-primary/40 mx-auto mb-2" />
      <span className="text-xs text-white/60">{locationName || 'Location preview'}</span>
      <span className="block text-[9px] text-white/40 mt-1 font-mono">
        {currentPosition ? `${currentPosition[1].toFixed(3)}°, ${currentPosition[0].toFixed(3)}°` : ''}
      </span>
    </div>
  </div>
)}
```

#### `src/components/tracking/TruckLocationPopup.tsx`
- If both video and satellite fail, show a styled placeholder instead of broken image

```typescript
// Add failure tracking
const [imageFailed, setImageFailed] = useState(false);

// In image render
{imageFailed ? (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
    <div className="text-center">
      <Globe className="w-10 h-10 text-primary/30 mx-auto mb-2" />
      <span className="text-xs text-white/50">Satellite imagery unavailable</span>
      <span className="block text-[9px] text-white/30 mt-1">Location: {locationName}</span>
    </div>
  </div>
) : (
  <img ... onError={() => setImageFailed(true)} />
)}
```

---

## Issue 4: Auto-Populate Booking Info with Consent

### Problem
When a user has an active booking/tracking session, they shouldn't need to re-enter the same info. But we need consent before auto-populating.

### Solution
1. Store last tracked booking info in localStorage
2. On page load, check if there's a saved booking
3. Show a consent banner asking if they want to continue tracking
4. If approved, auto-populate the route

### Changes to `src/pages/LiveTracking.tsx`

#### Add localStorage persistence

```typescript
// New state for saved booking
const [savedBooking, setSavedBooking] = useState<{
  originAddress: string;
  destAddress: string;
  originCoords: [number, number];
  destCoords: [number, number];
  originName: string;
  destName: string;
  bookingId?: string;
} | null>(null);
const [showResumePrompt, setShowResumePrompt] = useState(false);

// Check for saved booking on mount
useEffect(() => {
  const saved = localStorage.getItem('trumove_last_tracking');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      setSavedBooking(parsed);
      setShowResumePrompt(true);
    } catch (e) {
      localStorage.removeItem('trumove_last_tracking');
    }
  }
}, []);

// Save booking when tracking starts
useEffect(() => {
  if (isTracking && originCoords && destCoords) {
    const bookingData = {
      originAddress,
      destAddress,
      originCoords,
      destCoords,
      originName,
      destName,
      timestamp: Date.now(),
    };
    localStorage.setItem('trumove_last_tracking', JSON.stringify(bookingData));
  }
}, [isTracking, originCoords, destCoords, originAddress, destAddress, originName, destName]);

// Handle resume
const handleResumeBooking = () => {
  if (savedBooking) {
    setOriginAddress(savedBooking.originAddress);
    setDestAddress(savedBooking.destAddress);
    setOriginCoords(savedBooking.originCoords);
    setDestCoords(savedBooking.destCoords);
    setOriginName(savedBooking.originName);
    setDestName(savedBooking.destName);
    setShowResumePrompt(false);
    toast.success('📍 Previous route restored!');
  }
};

const handleDismissResume = () => {
  setShowResumePrompt(false);
  localStorage.removeItem('trumove_last_tracking');
};
```

#### Add consent banner UI

```typescript
// Add below the header, above tracking-content
{showResumePrompt && savedBooking && (
  <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-4 py-3">
    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Truck className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Continue tracking your shipment?
          </p>
          <p className="text-xs text-muted-foreground">
            {savedBooking.originName} → {savedBooking.destName}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismissResume}
          className="text-muted-foreground"
        >
          No thanks
        </Button>
        <Button
          size="sm"
          onClick={handleResumeBooking}
          className="bg-foreground text-background hover:bg-foreground/90"
        >
          Yes, continue
        </Button>
      </div>
    </div>
  </div>
)}
```

---

## Summary of Files to Modify

| File | Changes |
|------|---------|
| `src/components/tracking/TruckLocationPopup.tsx` | Fix flashing with initialization state, Google API, fallback placeholder |
| `src/components/tracking/TruckTrackingMap.tsx` | Change Follow button from solid to outlined style |
| `src/components/tracking/StreetViewPreview.tsx` | Add tertiary fallback for all image failures |
| `src/components/tracking/TruckAerialView.tsx` | Add image failure fallback placeholder |
| `src/pages/LiveTracking.tsx` | Add localStorage persistence and resume consent banner |

---

## Implementation Order

1. **Fix Follow button styling** - Quick visual fix
2. **Add image fallback placeholders** - Prevent broken image states
3. **Fix satellite popup flashing** - Smooth initialization
4. **Add booking persistence with consent** - Auto-resume feature

---

## Visual Preview: Resume Banner

```text
┌────────────────────────────────────────────────────────────────────┐
│ 🚚  Continue tracking your shipment?                               │
│     Jacksonville, FL → Miami, FL            [No thanks] [Continue] │
└────────────────────────────────────────────────────────────────────┘
```

## Visual Preview: Fallback Placeholder

```text
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                     🌐                                     │
│              Satellite imagery unavailable                 │
│              Location: Near Melbourne, FL                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

