
# Enhance Analyzing Route Modal - Prominent Style & Bigger Maps

## Changes Overview

### 1. Remove Green Accent from Header
The pulsing Radar icon uses green color. We'll change it to a neutral dark color (--tm-ink) so it blends with the header text instead of standing out as a green accent.

### 2. Add Prominent Black Border
Replace the subtle 1px border with a bold 3px black stroke to make the modal pop:

```css
.tru-analyze-popup-modal {
  border: 3px solid hsl(var(--tm-ink));
}
```

### 3. Make Maps Bigger
Increase the map panel sizes significantly:
- Origin/Destination frames: 280x160px → 360x220px
- Route (center) frame: 360x160px → 440x220px

### 4. Use Street View for Origin & Destination
Switch from satellite imagery (zoom 14) to Google Street View Static API for a closer, more personal perspective of the addresses. Fall back to satellite if Street View is unavailable.

Street View URL format:
```
https://maps.googleapis.com/maps/api/streetview?size=720x440&location={lat},{lng}&key={API_KEY}
```

---

## Implementation Details

### File: `src/index.css`

**Lines 13892-13894: Change icon color from green to neutral**
```css
/* Before */
.tru-analyzing-icon {
  color: hsl(var(--primary));
  animation: pulse 1.5s ease-in-out infinite;
}

/* After */
.tru-analyzing-icon {
  color: hsl(var(--tm-ink));
  animation: pulse 1.5s ease-in-out infinite;
}
```

**Lines 14033-14047: Add prominent black border to modal**
```css
.tru-analyze-popup-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 36px 32px;
  max-width: 1200px; /* Wider to fit larger maps */
  width: 96%;
  background: hsl(var(--background));
  border-radius: 24px;
  border: 3px solid hsl(var(--tm-ink)); /* Bold black border */
  box-shadow: 
    0 30px 60px -15px hsl(var(--tm-ink) / 0.4),
    0 15px 30px -10px hsl(var(--tm-ink) / 0.25);
  animation: popupEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Lines 14111-14130: Increase map frame sizes**
```css
.tru-analyze-strip-frame {
  position: relative;
  width: 360px;  /* Was 280px */
  height: 220px; /* Was 160px */
  /* ... rest unchanged */
}

.tru-analyze-strip-route .tru-analyze-strip-frame {
  width: 440px; /* Was 360px */
}

.tru-analyze-strip-route-frame {
  width: 440px !important; /* Was 360px */
}
```

---

### File: `src/pages/Index.tsx`

**Lines 949-959 and 986-996: Use Street View for Origin & Destination**

Replace the Mapbox satellite static images with Google Street View for a closer view:

```tsx
{/* Origin - Street View */}
<img 
  src={fromCoords ? `https://maps.googleapis.com/maps/api/streetview?size=720x440&location=${fromCoords[1]},${fromCoords[0]}&key=AIzaSyCWDpAPlxVRXnl1w5rz0Df5S3vGsHY6Xoo` : ''}
  alt="Origin location"
  className="tru-analyze-strip-img"
  onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
  onError={(e) => {
    // Fallback to satellite if Street View unavailable
    e.currentTarget.src = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${fromCoords?.[0]},${fromCoords?.[1]},16,0/720x440@2x?access_token=pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g`;
  }}
/>

{/* Destination - Street View */}
<img 
  src={toCoords ? `https://maps.googleapis.com/maps/api/streetview?size=720x440&location=${toCoords[1]},${toCoords[0]}&key=AIzaSyCWDpAPlxVRXnl1w5rz0Df5S3vGsHY6Xoo` : ''}
  alt="Destination location"
  className="tru-analyze-strip-img"
  onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
  onError={(e) => {
    // Fallback to satellite if Street View unavailable
    e.currentTarget.src = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${toCoords?.[0]},${toCoords?.[1]},16,0/720x440@2x?access_token=pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g`;
  }}
/>
```

---

## Technical Summary

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 13892-13894 | Change `.tru-analyzing-icon` color from `--primary` (green) to `--tm-ink` (black) |
| `src/index.css` | 14043 | Change border from `1px solid hsl(var(--border))` to `3px solid hsl(var(--tm-ink))` |
| `src/index.css` | 14039 | Increase max-width from `1100px` to `1200px` |
| `src/index.css` | 14113-14114 | Increase origin/dest frame size to 360x220px |
| `src/index.css` | 14125-14130 | Increase route frame size to 440x220px |
| `src/pages/Index.tsx` | 951-956 | Switch Origin image to Google Street View with satellite fallback |
| `src/pages/Index.tsx` | 988-993 | Switch Destination image to Google Street View with satellite fallback |

---

## Expected Result

- No green strip/accent at top - icon blends with header text
- Bold 3px black border makes the modal very prominent
- Maps are 30-40% larger for better visibility
- Street View shows a more personal, street-level perspective of origin/destination
- Satellite fallback ensures imagery is always shown even if Street View unavailable
