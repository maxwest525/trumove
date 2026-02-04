

## Summary
The homepage Shipment Tracker is now a **static demo preview** that doesn't animate or loop. The Route Overview uses Google Maps Static API with a plain roadmap style, and the Truck View shows a static tilted dark mode map with the truck logo centered.

---

## What Was Changed

### 1. Route Overview (Left Panel)
**Replaced Mapbox satellite map with Google Maps Static API** showing:
- Plain roadmap style (not satellite)
- Green marker (A) on Los Angeles
- Red marker (B) on New York  
- Blue route polyline between them
- Clean, standard Google Maps look

### 2. Truck View (Right Panel) 
**Made completely static** - no animation:
- Removed the `useTruckAnimation` hook usage
- Fixed coordinates at Oklahoma City (mid-route)
- Fixed 45° bearing (northeast heading)
- Tilted dark mode view with truck icon
- Removed Chase/North toggle
- Kept "LIVE GPS" badge for visual effect

### 3. Removed Animation Logic
- `useTruckAnimation` hook commented out (preserved for other pages)
- No `requestAnimationFrame` loop
- No throttling logic
- Removed `Compass` import (only used for toggle)

---

## Visual Result

```text
┌─────────────────────────────────────────────────────────────────┐
│                     SHIPMENT TRACKER SECTION                    │
├──────────────────┬────────────────────┬────────────────────────┤
│                  │                    │                        │
│   ROUTE OVERVIEW │    TRUCK VIEW      │    CONTENT             │
│   (Google Maps   │    (Static tilted  │    - Title             │
│   plain roadmap  │    dark mode map   │    - Description       │
│   with markers   │    with truck      │    - Step pills        │
│   A → B)         │    logo centered)  │    - CTA button        │
│                  │                    │                        │
│   [border]       │   [border]         │                        │
│                  │   LIVE GPS badge   │                        │
│   Route Overview │                    │                        │
│   label          │                    │                        │
└──────────────────┴────────────────────┴────────────────────────┘
```

---

## Technical Notes

1. **Google Static Maps API** shows clean roadmap style with green/red markers
2. **Mapbox navigation-night-v1** provides tilted dark mode view for truck panel
3. **No animation loop** = no CPU usage for homepage demo
4. Both panels remain as simple `<img>` tags with static URLs
5. The `useTruckAnimation` hook is preserved in comments for other pages
