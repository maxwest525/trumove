

# Live Truck Tracking Page - Full Feature Implementation

## Overview

Transform the existing Property Lookup page (`/property-lookup`) into a premium **Live Truck Tracking** experience with:

- **Real road-path visualization** using Mapbox Directions API
- **Animated truck following actual highways**
- **Realistic ETA calculations** synced to simulated real-time progress
- **Satellite/Street view thumbnails** of origin and destination
- **Premium black + neon green TruMove styling**
- **"Command Center" aesthetic** with real-time status updates

---

## Page Route

**Current**: `/property-lookup` -> PropertyLookup.tsx  
**Proposed**: `/track` or `/live-tracking` -> LiveTracking.tsx (new page)

We can either:
1. **Repurpose** PropertyLookup.tsx entirely (rename/redirect)
2. **Create new** LiveTracking.tsx and keep PropertyLookup for its original purpose

Recommendation: Create **new dedicated page** at `/track` to preserve route visualization as a standalone feature.

---

## 1. Core Features

### A) Real Driving Route (Not Arc Lines)

Replace the current arc-based route visualization with actual road paths:

```text
Current:  Origin ----arc---- Destination (visual only)
Proposed: Origin ════highway══════ Destination (real roads)
```

**Implementation**: Use the existing `fetchDrivingRoute()` function from `MapboxMoveMap.tsx` which calls the Mapbox Directions API and returns actual road geometry.

### B) Animated Truck Along Real Roads

The truck marker will:
- Follow the actual highway path (not a straight line)
- Rotate to match road direction (bearing calculation)
- Move at a speed proportional to the simulated ETA
- Pulse/glow effect while in transit

### C) Realistic ETA Simulation

Since we can't legally track real trucks, we simulate a realistic journey:

```text
User enters:
- Origin address
- Destination address
- (Optional) "Pickup time" to simulate when truck departed

System calculates:
- Mapbox Directions API returns duration in seconds
- We use this to animate the truck over a configurable timeframe
- ETA countdown updates in real-time
```

**Speed Modes**:
- **Demo mode**: 30-60 second animation for full journey
- **Realistic mode**: Scaled to match 8-hour workday (speed multiplier)

---

## 2. Visual Layout - "Command Center" Design

### A) Header Zone (Dark Glass)

```text
+------------------------------------------------------------------+
| [TruMove Logo]                          LIVE TRACKING            |
| ──────────────────────────────────────────────────────────────── |
| Shipment ID: TM-2026-0127-4829     Status: IN TRANSIT            |
+------------------------------------------------------------------+
```

### B) Main Map Zone (Full Width, Dark Style)

```text
+------------------------------------------------------------------+
|                                                                  |
|  [DARK MAPBOX MAP - FULL WIDTH]                                  |
|                                                                  |
|    ● Origin                                                      |
|      ║                                                           |
|      ║══════════════════════════════════════════════╗            |
|                                                     ║            |
|                        🚚 (animated truck)          ║            |
|                                                     ║            |
|                                                     ● Dest       |
|                                                                  |
+------------------------------------------------------------------+
```

**Custom Dark Map Style**:
- Base: Pure black (`#0a0a0a`)
- Roads: Subtle gray with green highways
- Route line: Neon green glow (`#22c55e`)
- Labels: White/light gray

### C) Bottom Dashboard Zone

```text
+------------------------------------------------------------------+
|                                                                  |
|  +---------------+  +-------------------+  +------------------+  |
|  | ORIGIN        |  | PROGRESS          |  | DESTINATION      |  |
|  | [Satellite]   |  |                   |  | [Satellite]      |  |
|  | Denver, CO    |  | ████████░░░░ 67%  |  | Austin, TX       |  |
|  | Departed 9:32a|  | 612 of 953 mi     |  | ETA: 6:45 PM     |  |
|  +---------------+  +-------------------+  +------------------+  |
|                                                                  |
|  +--------------------------------------------------------------+|
|  | TIMELINE                                                     ||
|  | ● Pickup (9:32 AM) ═══ 🚚 Current ═══○ Delivery (6:45 PM)   ||
|  +--------------------------------------------------------------+|
|                                                                  |
+------------------------------------------------------------------+
```

### D) Status Chips (Floating on Map)

```text
[● LIVE]  [IN TRANSIT]  [ON SCHEDULE]
```

---

## 3. Technical Implementation

### A) New Page: `src/pages/LiveTracking.tsx`

```tsx
// Key state
const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
const [routeData, setRouteData] = useState<RouteData | null>(null);
const [progress, setProgress] = useState(0); // 0-100
const [isTracking, setIsTracking] = useState(false);
const [departureTime, setDepartureTime] = useState<Date | null>(null);

// RouteData from Mapbox Directions API
interface RouteData {
  coordinates: [number, number][];
  distance: number; // meters
  duration: number; // seconds
  steps: RouteStep[];
}
```

### B) Dark Map Component: `TruckTrackingMap.tsx`

```tsx
// Custom dark style using Mapbox Studio or inline style modifications
const DARK_MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';

// Or create custom style programmatically:
map.current.setStyle({
  version: 8,
  sources: { ... },
  layers: [
    // Dark base layer
    { id: 'background', type: 'background', paint: { 'background-color': '#0a0a0a' } },
    // Roads with green accent
    { id: 'roads', paint: { 'line-color': '#1a1a1a', ... } },
    // Highlight route in neon green
    { id: 'route', paint: { 'line-color': '#22c55e', 'line-width': 5 } }
  ]
});

// Animated truck with glow
const truckEl = document.createElement('div');
truckEl.className = 'tracking-truck-marker';
truckEl.innerHTML = `
  <div class="truck-glow"></div>
  <div class="truck-icon">🚚</div>
`;
```

### C) Animation Engine

```tsx
// Animate truck along route based on elapsed time
useEffect(() => {
  if (!isTracking || !routeData) return;
  
  const animationSpeed = 60; // seconds for full demo
  const totalDuration = animationSpeed * 1000;
  const startTime = Date.now();
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
    setProgress(newProgress);
    
    if (newProgress < 100) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
}, [isTracking, routeData]);
```

### D) Satellite Thumbnails

Reuse existing satellite view from PropertyLookup:

```tsx
// Origin satellite preview
<img 
  src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${originCoords[0]},${originCoords[1]},16,0/300x200@2x?access_token=${MAPBOX_TOKEN}`}
  alt="Origin location"
  className="rounded-xl"
/>
```

---

## 4. CSS Styling - Premium Dark Theme

### A) Page Container

```css
.live-tracking-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #0d1117 100%);
  color: #ffffff;
}
```

### B) Neon Green Accents

```css
.tracking-accent {
  color: hsl(145, 63%, 42%); /* TruMove green */
  text-shadow: 0 0 20px hsl(145, 63%, 42% / 0.5);
}

.tracking-route-line {
  stroke: hsl(145, 63%, 42%);
  filter: drop-shadow(0 0 8px hsl(145, 63%, 42% / 0.6));
}
```

### C) Glass Cards

```css
.tracking-info-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(12px);
}
```

### D) Animated Truck Marker

```css
.tracking-truck-marker {
  position: relative;
  width: 40px;
  height: 40px;
}

.tracking-truck-glow {
  position: absolute;
  inset: -8px;
  background: radial-gradient(circle, hsl(145, 63%, 42% / 0.4) 0%, transparent 70%);
  animation: pulse 2s ease-in-out infinite;
  border-radius: 50%;
}

.tracking-truck-icon {
  width: 40px;
  height: 40px;
  background: hsl(145, 63%, 42%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 0 20px hsl(145, 63%, 42% / 0.5),
    0 0 40px hsl(145, 63%, 42% / 0.3);
}

@keyframes truck-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.6; }
}
```

### E) Progress Bar

```css
.tracking-progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.tracking-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, hsl(145, 63%, 42%), hsl(145, 80%, 50%));
  box-shadow: 0 0 12px hsl(145, 63%, 42% / 0.6);
  transition: width 0.3s ease-out;
}
```

---

## 5. Additional API Integrations

### A) Google Street View Static API (Optional Enhancement)

For ground-level imagery at origin/destination:

```tsx
// Street View thumbnail (requires Google API key)
const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=400x300&location=${lat},${lng}&heading=151.78&pitch=-0.76&key=${GOOGLE_API_KEY}`;
```

This would require adding a Google Maps API key secret.

### B) Weather Along Route (Optional)

Add weather conditions for realism:

```tsx
// Display weather at current truck position
const weather = await fetchWeather(currentTruckPosition);
// Show: "Clear skies, 72°F at current location"
```

---

## 6. Status Timeline Component

```text
● Pickup Complete ────────────── 🚚 In Transit ─────────────○ Delivery

  9:32 AM                         Now (2:15 PM)              ETA 6:45 PM
  Denver, CO                      Kansas City, MO            Austin, TX
```

```tsx
<div className="tracking-timeline">
  <div className="timeline-node complete">
    <div className="node-dot" />
    <span className="node-label">Pickup</span>
    <span className="node-time">9:32 AM</span>
  </div>
  
  <div className="timeline-line">
    <div className="timeline-progress" style={{ width: `${progress}%` }} />
  </div>
  
  <div className="timeline-truck" style={{ left: `${progress}%` }}>
    <Truck className="w-5 h-5" />
  </div>
  
  <div className="timeline-node pending">
    <div className="node-dot" />
    <span className="node-label">Delivery</span>
    <span className="node-time">ETA 6:45 PM</span>
  </div>
</div>
```

---

## 7. Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/LiveTracking.tsx` | Create | Main tracking page |
| `src/components/tracking/TruckTrackingMap.tsx` | Create | Dark-themed animated map |
| `src/components/tracking/TrackingDashboard.tsx` | Create | Bottom info panel |
| `src/components/tracking/TrackingTimeline.tsx` | Create | Status timeline |
| `src/components/tracking/SatellitePreview.tsx` | Create | Origin/destination thumbnails |
| `src/index.css` | Modify | Add tracking page styles |
| `src/App.tsx` | Modify | Add `/track` route |

---

## 8. User Flow

1. **User enters origin address** → Satellite thumbnail appears, map zooms to origin
2. **User enters destination address** → Route is calculated via Mapbox Directions API
3. **User clicks "Start Tracking"** → Animation begins, truck follows real roads
4. **Progress updates in real-time** → ETA countdown, distance remaining, status chips update
5. **Truck arrives at destination** → Celebration animation, "Delivered" status

---

## 9. Demo Mode vs. Realistic Mode

### Demo Mode (Default)
- Full journey animation: 45-60 seconds
- Perfect for showcasing the feature
- Speed slider to control animation pace

### Realistic Mode (Optional)
- User enters "pickup time" (e.g., 9:00 AM today)
- System calculates where truck "should be" based on elapsed time
- Updates every few seconds to show "real-time" position
- Uses actual Mapbox duration estimate for pacing

---

## Visual Preview

```text
┌──────────────────────────────────────────────────────────────────┐
│ ⬛ TruMove Live Tracking                        [● LIVE] [DEMO] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │            ██████  D A R K   M A P  ██████                │  │
│  │                                                            │  │
│  │     ◉ Denver ════════════════════════════════ 🚚           │  │
│  │         ║                                      ║           │  │
│  │         ╚══════════════════════════════════════╝  Austin   │  │
│  │                                                            │  │
│  │                   [IN TRANSIT - 67%]                       │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────┐  ┌──────────────────┐  ┌─────────────────────┐  │
│  │ 📍 ORIGIN   │  │ 📊 PROGRESS      │  │ 🎯 DESTINATION      │  │
│  │ [Satellite] │  │ ████████░░ 67%   │  │ [Satellite]         │  │
│  │ Denver, CO  │  │ 612 / 953 mi     │  │ Austin, TX          │  │
│  │ Departed 9a │  │ ~4 hrs remaining │  │ ETA: 6:45 PM        │  │
│  └─────────────┘  └──────────────────┘  └─────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ● Pickup ═══════════════ 🚚 ═══════════════○ Delivery      │  │
│  │   9:32 AM        Kansas City (now)           ETA 6:45 PM   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Technical Requirements

- **Mapbox Directions API**: Already available (MAPBOX_TOKEN configured)
- **Mapbox Static Images API**: Already used for satellite thumbnails
- **No additional API keys required** for core functionality
- **Optional**: Google Street View API for ground-level imagery (would need key)

