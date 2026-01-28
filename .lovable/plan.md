

## Plan: WebGL Diagnostics, Static Map Fallback, Route Comparison & Google-First Strategy

This plan addresses multiple improvements to create a more robust tracking experience with Google APIs prioritized:

1. **Fix WebGL issue caused by previous changes** - Simplify initialization, remove problematic settings
2. **Add WebGL diagnostics with early warning** - Detect graphics issues before hitting errors
3. **Static map fallback using Google Static Maps** - Show route when WebGL fails
4. **Route comparison view** - Side-by-side alternate routes with traffic/tolls/ETA
5. **Auto-switch to 3D view when available** - Prefer Google 3D when WebGL works
6. **Google APIs prioritized** - Use Google for all map-related features when available

---

## Issue 1: Fix WebGL Initialization (Root Cause)

### Problem
The previous WebGL "fix" added settings that may have destabilized the Mapbox initialization. The error occurs at line 157 of TruckTrackingMap.tsx.

### Solution
1. **Remove `preserveDrawingBuffer: true`** - This can cause performance issues and memory leaks
2. **Move WebGL check outside useEffect** - Create a reusable utility
3. **Add proper cleanup** to prevent duplicate map instances
4. **Simplify initialization** - Remove experimental flags

### Changes to `src/components/tracking/TruckTrackingMap.tsx`

```typescript
// Create a separate utility for WebGL detection (new file)
// In map init, simplify to:
map.current = new mapboxgl.Map({
  container: mapContainer.current,
  style: "mapbox://styles/mapbox/dark-v11",
  center: [-98.5, 39.8],
  zoom: 4,
  pitch: 0,
  interactive: true,
  // Remove: failIfMajorPerformanceCaveat, preserveDrawingBuffer, antialias
});
```

---

## Issue 2: WebGL Diagnostics Utility

### Solution
Create a new utility `src/lib/webglDiagnostics.ts` that:
- Checks WebGL support
- Detects GPU capabilities
- Returns diagnostic info for debugging
- Provides user-friendly warning messages

### New File: `src/lib/webglDiagnostics.ts`

```typescript
export interface WebGLDiagnostics {
  supported: boolean;
  version: 'webgl' | 'webgl2' | null;
  renderer: string | null;
  vendor: string | null;
  maxTextureSize: number | null;
  unmaskedRenderer: string | null;
  unmaskedVendor: string | null;
  warnings: string[];
  recommendation: 'full' | 'static' | 'none';
}

export function getWebGLDiagnostics(): WebGLDiagnostics {
  const canvas = document.createElement('canvas');
  const warnings: string[] = [];
  
  // Try WebGL2 first, then WebGL1
  let gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
  let version: 'webgl' | 'webgl2' | null = gl ? 'webgl2' : null;
  
  if (!gl) {
    gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
    version = gl ? 'webgl' : null;
  }
  
  if (!gl) {
    return {
      supported: false,
      version: null,
      renderer: null,
      vendor: null,
      maxTextureSize: null,
      unmaskedRenderer: null,
      unmaskedVendor: null,
      warnings: ['WebGL is not available in your browser'],
      recommendation: 'static'
    };
  }
  
  // Get debug info
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const unmaskedRenderer = debugInfo 
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) 
    : null;
  const unmaskedVendor = debugInfo 
    ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) 
    : null;
  
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  
  // Check for software rendering
  if (unmaskedRenderer?.toLowerCase().includes('swiftshader') || 
      unmaskedRenderer?.toLowerCase().includes('llvmpipe')) {
    warnings.push('Software rendering detected - maps may be slow');
  }
  
  // Check for low texture size (underpowered GPU)
  if (maxTextureSize && maxTextureSize < 4096) {
    warnings.push('Limited GPU capabilities detected');
  }
  
  return {
    supported: true,
    version,
    renderer: gl.getParameter(gl.RENDERER),
    vendor: gl.getParameter(gl.VENDOR),
    maxTextureSize,
    unmaskedRenderer,
    unmaskedVendor,
    warnings,
    recommendation: warnings.length > 0 ? 'static' : 'full'
  };
}

export function shouldUseStaticMap(): boolean {
  const diagnostics = getWebGLDiagnostics();
  return !diagnostics.supported || diagnostics.recommendation === 'static';
}
```

---

## Issue 3: Static Map Fallback Component

### Solution
Create a new `GoogleStaticRouteMap` component that displays the route using Google Static Maps API when WebGL fails.

### New File: `src/components/tracking/GoogleStaticRouteMap.tsx`

```typescript
import { useState, useEffect } from "react";
import { Loader2, MapPin, AlertTriangle, Navigation, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWebGLDiagnostics } from "@/lib/webglDiagnostics";

interface GoogleStaticRouteMapProps {
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
  progress?: number;
  isTracking?: boolean;
  googleApiKey: string;
  routePolyline?: string; // Encoded polyline from Google Routes API
  truckPosition?: [number, number] | null;
}

export function GoogleStaticRouteMap({
  originCoords,
  destCoords,
  progress = 0,
  isTracking = false,
  googleApiKey,
  routePolyline,
  truckPosition
}: GoogleStaticRouteMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [diagnostics, setDiagnostics] = useState<ReturnType<typeof getWebGLDiagnostics> | null>(null);
  
  useEffect(() => {
    setDiagnostics(getWebGLDiagnostics());
  }, []);
  
  if (!originCoords || !destCoords) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl">
        <div className="text-center">
          <MapPin className="w-10 h-10 text-primary/30 mx-auto mb-3" />
          <p className="text-sm text-white/50">Enter locations to see route</p>
        </div>
      </div>
    );
  }
  
  // Build Google Static Maps URL with route
  const buildMapUrl = () => {
    const params = new URLSearchParams({
      size: '800x600',
      maptype: 'roadmap',
      key: googleApiKey,
    });
    
    // Add markers
    const markers = [
      `color:green|label:A|${originCoords[1]},${originCoords[0]}`,
      `color:red|label:B|${destCoords[1]},${destCoords[0]}`
    ];
    
    // Add truck marker if tracking
    if (truckPosition) {
      markers.push(`icon:https://maps.google.com/mapfiles/kml/shapes/truck.png|${truckPosition[1]},${truckPosition[0]}`);
    }
    
    // Add route polyline if available
    let url = `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
    
    markers.forEach(m => {
      url += `&markers=${encodeURIComponent(m)}`;
    });
    
    if (routePolyline) {
      url += `&path=enc:${encodeURIComponent(routePolyline)}`;
    } else {
      // Fallback: straight line path
      url += `&path=color:0x22c55eff|weight:4|${originCoords[1]},${originCoords[0]}|${destCoords[1]},${destCoords[0]}`;
    }
    
    return url;
  };
  
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 z-10">
          <div className="text-center p-4">
            <AlertTriangle className="w-10 h-10 text-amber-500/50 mx-auto mb-3" />
            <p className="text-sm text-white/70 mb-2">Unable to load map</p>
            <button 
              onClick={() => { setImageError(false); setIsLoading(true); }}
              className="text-xs text-primary hover:underline flex items-center gap-1 mx-auto"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        </div>
      )}
      
      {/* WebGL Warning Banner */}
      {diagnostics && diagnostics.warnings.length > 0 && (
        <div className="absolute top-3 left-3 right-3 z-20 bg-amber-500/90 text-amber-950 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Static map mode - {diagnostics.warnings[0]}</span>
        </div>
      )}
      
      {/* Status chips */}
      {isTracking && (
        <div className="absolute top-14 left-3 z-20 flex gap-2">
          <span className="px-2 py-1 rounded-full bg-red-500/80 text-white text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </span>
          <span className="px-2 py-1 rounded-full bg-black/60 text-white/80 text-[10px] font-bold">
            STATIC MODE
          </span>
        </div>
      )}
      
      {/* Progress indicator */}
      {isTracking && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full">
            <span className="text-sm font-semibold text-white">{Math.round(progress)}% Complete</span>
          </div>
        </div>
      )}
      
      {/* Static map image */}
      <img
        src={buildMapUrl()}
        alt="Route map"
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => { setIsLoading(false); setImageError(true); }}
      />
    </div>
  );
}
```

---

## Issue 4: Route Comparison View

### Solution
Create a `RouteComparisonPanel` component that shows 2-3 alternate routes side-by-side with:
- Traffic delay comparison
- Toll costs
- ETA differences
- Visual indicators for "fastest", "cheapest", "shortest"

### New File: `src/components/tracking/RouteComparisonPanel.tsx`

```typescript
import { useState } from "react";
import { Clock, DollarSign, Fuel, Route, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteOption {
  index: number;
  description: string;
  distanceMiles: number;
  durationMinutes: number;
  durationFormatted: string;
  etaFormatted: string;
  trafficDelayMinutes: number;
  trafficSeverity: 'low' | 'medium' | 'high';
  hasTolls: boolean;
  tollCost: string | null;
  isFuelEfficient: boolean;
  labels: string[]; // 'fastest', 'cheapest', 'shortest'
}

interface RouteComparisonPanelProps {
  routes: RouteOption[];
  selectedIndex: number;
  onSelectRoute: (index: number) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function RouteComparisonPanel({
  routes,
  selectedIndex,
  onSelectRoute,
  isExpanded = true,
  onToggleExpand
}: RouteComparisonPanelProps) {
  if (routes.length <= 1) return null;
  
  // Determine which route is best in each category
  const fastestIndex = routes.reduce((min, r, i) => 
    r.durationMinutes < routes[min].durationMinutes ? i : min, 0);
  const shortestIndex = routes.reduce((min, r, i) => 
    r.distanceMiles < routes[min].distanceMiles ? i : min, 0);
  const cheapestIndex = routes.reduce((min, r, i) => 
    !r.hasTolls ? i : min, 0);
  
  return (
    <div className="tracking-info-card">
      {/* Header with toggle */}
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-primary/20 text-primary">
            <Route className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
            Route Options ({routes.length})
          </span>
        </div>
        {onToggleExpand && (
          isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />
        )}
      </button>
      
      {isExpanded && (
        <div className="space-y-3">
          {routes.map((route, i) => {
            const isFastest = i === fastestIndex;
            const isShortest = i === shortestIndex;
            const isCheapest = i === cheapestIndex && !route.hasTolls;
            const isSelected = i === selectedIndex;
            
            return (
              <button
                key={route.index}
                onClick={() => onSelectRoute(route.index)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  isSelected
                    ? "bg-primary/20 border-primary"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                )}
              >
                {/* Route header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">
                        {route.description || `Route ${i + 1}`}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {isFastest && (
                        <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded uppercase">
                          Fastest
                        </span>
                      )}
                      {isShortest && (
                        <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[9px] font-bold rounded uppercase">
                          Shortest
                        </span>
                      )}
                      {isCheapest && (
                        <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[9px] font-bold rounded uppercase">
                          No Tolls
                        </span>
                      )}
                      {route.isFuelEfficient && (
                        <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[9px] font-bold rounded uppercase">
                          Eco
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* ETA */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{route.etaFormatted}</div>
                    <div className="text-[10px] text-white/40">ETA</div>
                  </div>
                </div>
                
                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-xs font-semibold text-white">{route.distanceMiles} mi</div>
                    <div className="text-[9px] text-white/40">Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-white">{route.durationFormatted}</div>
                    <div className="text-[9px] text-white/40">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className={cn(
                      "text-xs font-semibold",
                      route.trafficDelayMinutes > 15 ? "text-red-400" 
                        : route.trafficDelayMinutes > 5 ? "text-amber-400" 
                        : "text-emerald-400"
                    )}>
                      {route.trafficDelayMinutes > 0 ? `+${route.trafficDelayMinutes}m` : 'Clear'}
                    </div>
                    <div className="text-[9px] text-white/40">Traffic</div>
                  </div>
                  <div className="text-center">
                    <div className={cn(
                      "text-xs font-semibold",
                      route.hasTolls ? "text-white" : "text-emerald-400"
                    )}>
                      {route.hasTolls ? (route.tollCost || '$5-15') : 'Free'}
                    </div>
                    <div className="text-[9px] text-white/40">Tolls</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

---

## Issue 5: Auto-Switch to 3D View When Available

### Solution
Modify `LiveTracking.tsx` to:
1. Check WebGL capabilities on mount
2. Auto-enable 3D view if WebGL is fully supported
3. Fall back to static map if WebGL fails
4. Show a toggle button that reflects current capabilities

### Changes to `src/pages/LiveTracking.tsx`

```typescript
// Add import
import { getWebGLDiagnostics, shouldUseStaticMap } from "@/lib/webglDiagnostics";
import { GoogleStaticRouteMap } from "@/components/tracking/GoogleStaticRouteMap";
import { RouteComparisonPanel } from "@/components/tracking/RouteComparisonPanel";

// Add state for WebGL diagnostics
const [webglDiagnostics, setWebglDiagnostics] = useState<ReturnType<typeof getWebGLDiagnostics> | null>(null);
const [useStaticMap, setUseStaticMap] = useState(false);

// Check WebGL on mount and auto-enable 3D if available
useEffect(() => {
  const diagnostics = getWebGLDiagnostics();
  setWebglDiagnostics(diagnostics);
  
  if (!diagnostics.supported || diagnostics.recommendation === 'static') {
    setUseStaticMap(true);
    setShow3DView(false);
  } else if (diagnostics.supported && diagnostics.warnings.length === 0) {
    // WebGL is fully supported - enable 3D view by default
    setShow3DView(true);
  }
}, []);

// Update map container logic
{/* Center: Map - Auto-select based on WebGL capabilities */}
<div className="tracking-map-container">
  {useStaticMap ? (
    <GoogleStaticRouteMap
      originCoords={originCoords}
      destCoords={destCoords}
      progress={progress}
      isTracking={isTracking}
      googleApiKey={GOOGLE_MAPS_API_KEY}
      routePolyline={googleRouteData.polyline}
      truckPosition={currentTruckPosition}
    />
  ) : show3DView ? (
    <Google3DTrackingView
      coordinates={currentTruckPosition}
      bearing={truckBearing}
      isTracking={isTracking}
      followMode={followMode}
      googleApiKey={GOOGLE_MAPS_API_KEY}
      trafficSeverity={...}
      trafficDelayMinutes={...}
    />
  ) : (
    <TruckTrackingMap ... />
  )}
</div>
```

---

## Issue 6: Store Route Polyline from Google Routes API

### Changes to `supabase/functions/google-routes/index.ts`

Already returns `polyline.encodedPolyline` - just need to ensure it's stored in state.

### Changes to `src/pages/LiveTracking.tsx`

```typescript
// Update googleRouteData state to include polyline
const [googleRouteData, setGoogleRouteData] = useState<{
  trafficInfo: { ... } | null;
  tollInfo: { ... } | null;
  etaFormatted: string | null;
  alternateRoutes?: any[];
  isFuelEfficient?: boolean;
  polyline?: string; // Add this
}>({ ... });
```

---

## Summary of Files to Create

| File | Purpose |
|------|---------|
| `src/lib/webglDiagnostics.ts` | WebGL detection and capability checking |
| `src/components/tracking/GoogleStaticRouteMap.tsx` | Static map fallback when WebGL fails |
| `src/components/tracking/RouteComparisonPanel.tsx` | Side-by-side route comparison |

## Summary of Files to Modify

| File | Changes |
|------|---------|
| `src/components/tracking/TruckTrackingMap.tsx` | Simplify WebGL init, remove problematic flags |
| `src/pages/LiveTracking.tsx` | Add WebGL diagnostics, auto-3D, static fallback, route comparison |
| `src/components/tracking/Google3DTrackingView.tsx` | Add error recovery, better fallback handling |

---

## Implementation Order

1. **Create `webglDiagnostics.ts`** - Foundation for all other changes
2. **Fix `TruckTrackingMap.tsx`** - Remove problematic WebGL settings
3. **Create `GoogleStaticRouteMap.tsx`** - Fallback when WebGL fails
4. **Update `LiveTracking.tsx`** - Add diagnostics, auto-3D, static fallback
5. **Create `RouteComparisonPanel.tsx`** - Route comparison component
6. **Update `Google3DTrackingView.tsx`** - Better error handling

---

## Visual Preview: Route Comparison Panel

```text
┌─────────────────────────────────────────────────────────────┐
│ 🛣️ ROUTE OPTIONS (3)                              ▼ Expand │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Via I-95 South                          ✓    ETA: 3:45p │ │
│ │ [Fastest] [Eco]                                         │ │
│ │ ──────────────────────────────────────────────────────  │ │
│ │ 287 mi    │  4h 32m  │  +12m   │  $8.50                 │ │
│ │ Distance  │ Duration │ Traffic │  Tolls                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Via US-1 Coastal                             ETA: 4:15p │ │
│ │ [Shortest] [No Tolls]                                   │ │
│ │ ──────────────────────────────────────────────────────  │ │
│ │ 274 mi    │  5h 08m  │  +5m    │  Free                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Via Florida Turnpike                         ETA: 3:52p │ │
│ │                                                          │ │
│ │ ──────────────────────────────────────────────────────  │ │
│ │ 291 mi    │  4h 45m  │  Clear  │  $14.25                │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Visual Preview: Static Map Fallback

```text
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ Static map mode - Software rendering detected            │
├─────────────────────────────────────────────────────────────┤
│  [LIVE] [STATIC MODE]                                       │
│                                                             │
│         ┌──────────────────────────────┐                    │
│         │                              │                    │
│         │   A ●────────────────● B     │                    │
│         │    Jacksonville    Miami     │                    │
│         │          🚚                  │                    │
│         │                              │                    │
│         └──────────────────────────────┘                    │
│                                                             │
│                  ┌──────────────────┐                       │
│                  │ 67% Complete     │                       │
│                  └──────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

