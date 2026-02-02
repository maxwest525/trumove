
## Add "Go" Button and Weather Widget Under the Map on Command Center

### Overview
Add a "Go" button underneath the map on the Shipment Command Center (/track) page along with a compact weather widget. This creates a more intuitive control layout with essential route information displayed below the map visualization.

### Current Layout
The tracking page has a 2-column layout:
- **Left column**: Map container (850x550px fixed size)
- **Right column**: Dashboard sidebar with stats, street view, weather, and route info

Currently, tracking controls are scattered in the header area. The weather widget (`RouteWeather`) is only in the sidebar.

### Implementation

#### 1. Create New Map Controls Section
Add a new control strip below the map that includes:
- **Go/Start button**: Primary action to start tracking
- **Pause/Resume button**: Toggle during active tracking
- **Reset button**: Clear progress and reset
- **Compact Weather Widget**: Show weather for origin, route midpoint, and destination

#### 2. File Changes

**File: `src/pages/LiveTracking.tsx`**
- Add a new controls section immediately after the map container (inside `tracking-map-container` wrapper or as a sibling)
- Include:
  - "Go" button that triggers `startTracking()` when route is ready
  - Pause/Resume button that toggles `pauseTracking()` / `resumeTracking()`
  - Reset button calling `resetTracking()`
  - Compact inline weather display using existing weather data from `RouteWeather` or a new lightweight variant

**File: `src/index.css`**
- Add new CSS classes for the under-map controls strip:
  - `.tracking-map-controls`: Flexbox row container matching map width (850px)
  - `.tracking-map-control-btn`: Styled button for Go/Pause/Reset
  - `.tracking-map-weather-inline`: Compact horizontal weather display

#### 3. Visual Design

```text
+------------------------------------------+
|                                          |
|               MAP (850x550)              |
|                                          |
+------------------------------------------+
|  [▶ GO]  [⏸ PAUSE]  [↺ RESET]  |  🌤 72°F → 🌧 65°F → ☀️ 78°F  |
+------------------------------------------+
```

- **Control buttons**: Left-aligned, primary-styled "Go" button, ghost-styled others
- **Weather**: Right-aligned compact strip with temperature for origin → midpoint → destination
- **Responsive**: Stack vertically on mobile

#### 4. Weather Widget Design
The compact weather strip will show:
- Origin weather icon + temperature
- Arrow connector
- En-route weather icon + temperature  
- Arrow connector
- Destination weather icon + temperature

This reuses data from the existing `weather-route` edge function.

### Technical Details

| Component | Purpose |
|-----------|---------|
| `startTracking()` | Begin animation playback |
| `pauseTracking()` | Pause at current progress |
| `resumeTracking()` | Continue from paused state |
| `resetTracking()` | Reset progress to 0% |
| `RouteWeather` data | Reuse for compact inline display |

### CSS Classes to Add
- `.tracking-map-wrapper`: Wrapper for map + controls
- `.tracking-map-controls`: Controls strip container
- `.tracking-map-go-btn`: Primary "Go" button styling
- `.tracking-map-weather-compact`: Inline weather display

### Files to Modify
1. `src/pages/LiveTracking.tsx` - Add controls section with buttons and inline weather
2. `src/index.css` - Add styling for the new control strip

### Button States
- **Go button**: Enabled when `canTrack` is true, disabled otherwise
- Shows "Go" when not tracking, changes to "Pause" when tracking is active
- Green primary styling for Go, amber for Pause, ghost for Reset
