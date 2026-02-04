
# Dynamic Bearing for Road Map

## Overview
Update the Road Map panel so the camera bearing automatically follows the truck's heading direction as it travels the route, creating a more immersive "chase camera" effect.

## Current State
- The `useTruckAnimation` hook already calculates `currentBearing` based on the direction between route waypoints
- However, `RoadMapPanel` ignores this value and uses a hardcoded `bearing = 0` (north-facing)

## Implementation

### File: `src/pages/Index.tsx`

**Change 1: Use dynamic bearing from animation hook**

Replace the static bearing with the `currentBearing` from the animation:

```tsx
// Before (line 537-538):
// 0° bearing for north-facing view - clean vertical street perspective
const bearing = 0; // North-facing - vertical streets layout  

// After:
// Dynamic bearing - camera follows truck's direction of travel
const bearing = currentBearing; // Follows truck heading for chase-cam effect
```

**Change 2: Throttle bearing updates to prevent jitter**

Add bearing to the throttled state to ensure smooth camera rotation:

```tsx
// Before (line 526-527):
const [throttledCenter, setThrottledCenter] = useState(mapCenter);

// After:
const [throttledCenter, setThrottledCenter] = useState(mapCenter);
const [throttledBearing, setThrottledBearing] = useState(currentBearing);

// Update bearing in the throttle effect
useEffect(() => {
  const now = Date.now();
  if (now - lastUpdateRef.current > 500) {
    setThrottledCenter(mapCenter);
    setThrottledBearing(currentBearing);
    lastUpdateRef.current = now;
  }
}, [mapCenter, currentBearing]);
```

## Result
- Camera will rotate to face the direction the truck is traveling
- Heading east through Arizona → camera faces east (~90°)
- Turning northeast toward Nashville → camera rotates northeast (~45°)
- Creates a cinematic "follow the truck" perspective while maintaining the 60° 3D tilt
