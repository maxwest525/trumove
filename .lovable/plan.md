

## Summary
Enhance the Route Overview panel with:
1. **More realistic waypoints** following actual I-10/I-40/I-70 highway corridors
2. **Discreet map style toggle** to switch between dark mode and standard roadmap view

---

## Implementation

### File: `src/pages/Index.tsx`

#### 1. Add Comprehensive Highway Waypoints

Replace the current 4 waypoints with ~12 realistic highway corridor points:

```tsx
// Realistic I-10/I-40/I-70 highway corridor waypoints (lat,lng)
const waypoints = [
  [34.05, -118.24],   // Los Angeles, CA
  [34.14, -114.29],   // Needles, CA (I-40)
  [35.19, -111.65],   // Flagstaff, AZ
  [35.08, -106.65],   // Albuquerque, NM
  [35.22, -101.83],   // Amarillo, TX
  [35.47, -97.52],    // Oklahoma City, OK
  [37.69, -97.34],    // Wichita, KS
  [39.10, -94.58],    // Kansas City, MO
  [38.63, -90.20],    // St. Louis, MO
  [39.77, -86.16],    // Indianapolis, IN
  [40.00, -82.98],    // Columbus, OH
  [40.44, -79.99],    // Pittsburgh, PA
  [40.71, -74.00],    // New York, NY
];
```

#### 2. Add State for Map Style Toggle

```tsx
const [isDarkStyle, setIsDarkStyle] = useState(false);
```

#### 3. Create Style Variants

**Dark Style** (using Google Maps styled map or dark map type):
```tsx
// Google Maps supports styled maps via style parameter
// For dark mode, we can use a custom style or just invert colors
const darkStyleParam = '&style=feature:all|element:geometry|color:0x242f3e' +
  '&style=feature:all|element:labels.text.stroke|color:0x242f3e' +
  '&style=feature:all|element:labels.text.fill|color:0x746855' +
  '&style=feature:road|element:geometry|color:0x38414e' +
  '&style=feature:water|element:geometry|color:0x17263c';
```

**Standard Roadmap Style**: No additional style parameters needed.

#### 4. Build Dynamic URL

```tsx
const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?` +
  `size=420x480` +
  `&scale=2` +
  `&maptype=roadmap` +
  `&markers=color:0x22c55e|size:mid|label:A|${laLat},${laLng}` +
  `&markers=color:0xef4444|size:mid|label:B|${nyLat},${nyLng}` +
  `&path=color:0x4285F4|weight:4|${pathPoints}` +
  `${isDarkStyle ? darkStyleParam : ''}` +
  `&key=${googleApiKey}`;
```

#### 5. Add Discreet Toggle Button

Small toggle in the corner of the panel:

```tsx
{/* Discreet map style toggle */}
<button 
  onClick={() => setIsDarkStyle(!isDarkStyle)}
  className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm 
             border border-white/20 flex items-center justify-center 
             hover:bg-black/60 transition-all group"
  aria-label={isDarkStyle ? 'Switch to light map' : 'Switch to dark map'}
>
  {isDarkStyle ? (
    <Sun className="w-3 h-3 text-white/80 group-hover:text-white" />
  ) : (
    <Moon className="w-3 h-3 text-white/80 group-hover:text-white" />
  )}
</button>
```

---

## Complete Updated Component

```tsx
function RouteOverviewPanel() {
  const [isDarkStyle, setIsDarkStyle] = useState(false);
  
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyD8aMj_HlkLUWuYbZRU7I6oFGTavx2zKOc";
  
  const laLat = 34.05, laLng = -118.24;
  const nyLat = 40.71, nyLng = -74.00;
  
  // Realistic I-10/I-40/I-70 highway corridor
  const waypoints = [
    [34.05, -118.24],   // Los Angeles
    [34.14, -114.29],   // Needles
    [35.19, -111.65],   // Flagstaff
    [35.08, -106.65],   // Albuquerque
    [35.22, -101.83],   // Amarillo
    [35.47, -97.52],    // Oklahoma City
    [37.69, -97.34],    // Wichita
    [39.10, -94.58],    // Kansas City
    [38.63, -90.20],    // St. Louis
    [39.77, -86.16],    // Indianapolis
    [40.00, -82.98],    // Columbus
    [40.44, -79.99],    // Pittsburgh
    [40.71, -74.00],    // New York
  ];
  
  const pathPoints = waypoints.map(([lat, lng]) => `${lat},${lng}`).join('|');
  
  // Dark mode styling for Google Static Maps
  const darkStyleParam = '&style=feature:all|element:geometry|color:0x242f3e' +
    '&style=feature:all|element:labels.text.stroke|color:0x242f3e' +
    '&style=feature:all|element:labels.text.fill|color:0x746855' +
    '&style=feature:road|element:geometry|color:0x38414e' +
    '&style=feature:water|element:geometry|color:0x17263c';
  
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?` +
    `size=420x480&scale=2&maptype=roadmap` +
    `&markers=color:0x22c55e|size:mid|label:A|${laLat},${laLng}` +
    `&markers=color:0xef4444|size:mid|label:B|${nyLat},${nyLng}` +
    `&path=color:0x4285F4|weight:4|${pathPoints}` +
    `${isDarkStyle ? darkStyleParam : ''}` +
    `&key=${googleApiKey}`;
  
  return (
    <div className="tru-tracker-satellite-panel tru-tracker-satellite-enlarged">
      <img src={staticMapUrl} alt="Route Overview" className="w-full h-full object-cover" />
      
      {/* Discreet style toggle */}
      <button 
        onClick={() => setIsDarkStyle(!isDarkStyle)}
        className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm 
                   border border-white/20 flex items-center justify-center hover:bg-black/60 transition-all"
        aria-label={isDarkStyle ? 'Switch to light map' : 'Switch to dark map'}
      >
        {isDarkStyle ? <Sun className="w-3 h-3 text-white/80" /> : <Moon className="w-3 h-3 text-white/80" />}
      </button>
      
      <div className="tru-tracker-satellite-label">
        <Radar className="w-3 h-3" />
        <span>Route Overview</span>
      </div>
    </div>
  );
}
```

---

## Visual Result

```text
┌────────────────────────────────┐
│ Route Overview Panel           │
│                          [🌙]  │  ← Tiny toggle (top-right)
│                                │
│    🟢 Los Angeles              │
│      ╲                         │
│       ╲ (follows I-40)         │
│        ╲                       │
│         → → → →                │
│                 ╲              │
│                  🔴 New York   │
│                                │
│ [Radar] Route Overview         │
└────────────────────────────────┘
```

**Toggle behavior:**
- 🌙 Moon = Click to switch to dark mode
- ☀️ Sun = Click to switch to light/standard mode

---

## Technical Notes

1. **Truck View**: NOT modified - stays exactly as is
2. **Google Maps Styling**: Uses `&style=` parameters for dark mode (same technique as Google Maps JS API)
3. **13 waypoints** create a realistic curved route following major interstate highways
4. **Toggle size**: 24x24px (w-6 h-6) - very discreet, won't distract from the map
5. **Import needed**: Add `Moon, Sun` from lucide-react if not already imported

