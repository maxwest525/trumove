

## Plan: Default to 2D Mode with Satellite View & Replace Mapbox with Google Maps

This plan addresses three key improvements:

1. **Default to 2D mode** (not 3D) with follow mode enabled
2. **Use satellite/hybrid view** as the default map style
3. **Replace Mapbox with Google Maps** for the main 2D tracking map
4. **Ensure real-time playback speed** is maintained

---

## Why Replace Mapbox with Google Maps

| Feature | Mapbox | Google Maps |
|---------|--------|-------------|
| Traffic Layer | Manual congestion styling | Native `TrafficLayer` overlay |
| Satellite View | Separate style URL | `mapTypeId: 'satellite'` or `'hybrid'` |
| Route Rendering | Manual polyline | Native `DirectionsRenderer` |
| API Key | Separate token needed | Same key as 3D/StreetView |
| Integration | Disconnected from Google data | Seamless with Routes API |

**Recommendation:** Replace `TruckTrackingMap.tsx` (Mapbox) with a new `Google2DTrackingMap.tsx` component.

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/components/tracking/Google2DTrackingMap.tsx` | **Create** | New Google Maps 2D component with satellite/hybrid view |
| `src/pages/LiveTracking.tsx` | **Modify** | Default to 2D mode, follow mode, use Google2DTrackingMap |
| `src/components/tracking/TruckTrackingMap.tsx` | **Keep** | Fallback if Google Maps fails |

---

## New Component: Google2DTrackingMap.tsx

### Features
- **mapTypeId: 'hybrid'** - Satellite imagery with road labels (default)
- **TrafficLayer** - Native Google traffic visualization
- **DirectionsRenderer** - Render route with traffic-aware styling
- **Follow mode** - Camera follows truck with smooth panning
- **Truck marker** - Animated truck icon that rotates with bearing

### Key Implementation

```typescript
interface Google2DTrackingMapProps {
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
  progress: number;
  isTracking: boolean;
  onRouteCalculated?: (route: RouteData) => void;
  followMode?: boolean;
  onFollowModeChange?: (enabled: boolean) => void;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  googleApiKey: string;
}

// Map initialization
const map = new google.maps.Map(container, {
  center: originCoords,
  zoom: 12,
  mapTypeId: 'hybrid',  // Satellite + labels
  mapTypeControl: true,
  mapTypeControlOptions: {
    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
    mapTypeIds: ['roadmap', 'satellite', 'hybrid']
  },
  tilt: 0  // 2D view
});

// Add traffic layer
const trafficLayer = new google.maps.TrafficLayer();
trafficLayer.setMap(map);

// Directions service for routing
const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer({
  map,
  suppressMarkers: true,  // Custom markers
  polylineOptions: {
    strokeColor: '#22c55e',
    strokeWeight: 5
  }
});
```

### Follow Mode Implementation

```typescript
// When followMode is true, camera follows truck
if (followMode && truckPosition) {
  map.panTo(truckPosition);
  map.setZoom(15);  // Closer zoom for following
}
```

---

## LiveTracking.tsx Modifications

### 1. Default View Mode Changes

```typescript
// OLD: Default to 3D when WebGL is supported
setShow3DView(true);

// NEW: Default to 2D with satellite view
setShow3DView(false);
setFollowMode(true);  // Enable follow mode by default
```

### 2. Demo Booking Logic Update

```typescript
// When demo #12345 or #00000 is loaded:
if (value === '12345' || value === '00000') {
  // ... load booking
  setShow3DView(false);     // Default to 2D
  setFollowMode(true);       // Enable follow mode
  // 3D is still available via button toggle
}
```

### 3. Map Component Hierarchy

Priority order (top to bottom):
1. **GoogleStaticRouteMap** - If WebGL unavailable (fallback)
2. **Google3DTrackingView** - If user explicitly toggles 3D
3. **Google2DTrackingMap** - Default view (NEW)
4. **TruckTrackingMap (Mapbox)** - Ultimate fallback if Google fails

```typescript
{useStaticMap ? (
  <GoogleStaticRouteMap ... />
) : show3DView ? (
  <Google3DTrackingView ... />
) : (
  <Google2DTrackingMap
    originCoords={originCoords}
    destCoords={destCoords}
    progress={progress}
    isTracking={isTracking}
    onRouteCalculated={handleRouteCalculated}
    followMode={followMode}
    onFollowModeChange={setFollowMode}
    mapType="hybrid"
    googleApiKey={GOOGLE_MAPS_API_KEY}
  />
)}
```

### 4. Real-Time Speed (Already Implemented)

The `animationSpeed` is already set to 60 seconds and the speed slider has been removed. No changes needed.

---

## View Hierarchy Logic

```text
User loads /track
    │
    ├─► WebGL Check
    │       │
    │       ├─► Not Supported → Static Map (GoogleStaticRouteMap)
    │       │
    │       └─► Supported
    │               │
    │               ├─► Default: 2D Satellite + Follow Mode (Google2DTrackingMap)
    │               │
    │               └─► User clicks "3D View" → Google3DTrackingView
    │
    └─► If Google Maps fails → Fallback to Mapbox (TruckTrackingMap)
```

---

## UI Button Updates

### 3D/2D Toggle Button

```typescript
<Button onClick={() => setShow3DView(!show3DView)}>
  <Box className="w-4 h-4" />
  <span>{show3DView ? "2D Map" : "3D View"}</span>
</Button>
```

### Follow Mode Toggle (Already Exists)

The map component already handles follow mode internally with a toggle button.

---

## Visual Comparison

### Before (Mapbox Dark)
```text
┌────────────────────────────────────┐
│         Dark road map              │
│         (mapbox/dark-v11)          │
│         No satellite imagery       │
│         Manual traffic colors      │
└────────────────────────────────────┘
```

### After (Google Hybrid + Traffic)
```text
┌────────────────────────────────────┐
│         Satellite imagery          │
│         + Road labels              │
│         + Traffic layer (live)     │
│         + Following truck          │
└────────────────────────────────────┘
```

---

## Implementation Order

1. **Create `Google2DTrackingMap.tsx`** - New Google Maps 2D component
2. **Update `LiveTracking.tsx`** - Change defaults and integrate new component
3. **Test fallback chain** - Ensure Mapbox still works if Google fails

---

## Technical Details

### Google Maps Script Loading

Reuse the script loading logic from `Google3DTrackingView`:

```typescript
// Check if Google Maps is already loaded (from 3D view)
if (window.google?.maps) {
  initMap();
  return;
}

// Load script with required libraries
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places,geometry`;
```

### Truck Marker Animation

```typescript
// Create custom truck marker
const truckIcon = {
  url: 'data:image/svg+xml,...',  // SVG truck icon
  scaledSize: new google.maps.Size(40, 40),
  anchor: new google.maps.Point(20, 20),
  rotation: bearing  // Rotate based on direction
};

const truckMarker = new google.maps.Marker({
  position: currentPosition,
  map,
  icon: truckIcon,
  zIndex: 100
});
```

### Route Coordinates Extraction

```typescript
// Extract coordinates from DirectionsResult for progress tracking
const route = result.routes[0];
const path = route.overview_path;  // Array of LatLng objects
const coordinates = path.map(p => [p.lng(), p.lat()] as [number, number]);
```

