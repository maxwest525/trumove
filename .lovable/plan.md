

# Responsive Live Stats + Layout Improvements Plan

## Overview
This plan implements four improvements:
1. Make the Live Stats box responsive (base 480px, scales down on smaller screens)
2. Remove dark/light mode toggle completely (no dark mode)
3. Change demo destination address from "100 Biscayne Blvd, Miami, FL 33131" to a more Street View-friendly address
4. Slight map width reduction to allow more room for sidebars

---

## Part 1: Responsive Live Stats Box (480px Base)

### Current State
The right dashboard column is fixed at 420px in the base `.tracking-content` grid:
```css
grid-template-columns: 320px minmax(200px, 1fr) 420px;
```

### Solution
Change to a responsive approach using `minmax()` with 480px base that shrinks at breakpoints:

**Modify:** `src/index.css`

| Breakpoint | Left Sidebar | Map | Right Dashboard |
|------------|--------------|-----|-----------------|
| Default (>1600px) | 320px | flex | 480px (was 420px) |
| ≤1600px | 300px | flex | 440px |
| ≤1400px | 280px | flex | 400px |
| ≤1280px | 260px | flex | 360px |
| ≤1024px | stacked | stacked | full-width |

This gives the Live Stats box more room at larger screens while maintaining responsiveness.

---

## Part 2: Remove Dark Mode Toggle

### Files to Modify

**`src/pages/LiveTracking.tsx`**
- Remove the `useTheme` import and usage
- Remove the theme toggle Button (lines 328-341)
- Remove `Sun, Moon` icon imports

**`src/index.css`**
- Remove `.tracking-theme-toggle` styles
- Remove any `.dark .tracking-*` overrides that are no longer needed

The site will default to light mode only on the tracking page.

---

## Part 3: Change Demo Destination Address

The current demo uses "100 Biscayne Blvd, Miami, FL 33131" which produces awkward Street View imagery.

### Better Miami Addresses for Street View
Options with good Street View coverage:
- **"1111 Lincoln Rd, Miami Beach, FL 33139"** - Lincoln Road Mall, clear pedestrian area
- **"1200 Collins Ave, Miami Beach, FL 33139"** - Art Deco building with clear street view
- **"1000 Ocean Dr, Miami Beach, FL 33139"** - Ocean Drive with palm trees, iconic Miami look

**Recommended:** `"1000 Ocean Dr, Miami Beach, FL 33139"` - Iconic Miami Beach streetscape

### Files to Update

**`src/pages/LiveTracking.tsx`**
- Line 373: Change demo booking destination
- Line 392: Change quick-fill destination

**`src/components/tracking/CheckMyTruckModal.tsx`**
- Line 86: Update the multi-stop demo drop-off address

---

## Part 4: Reduce Map Width for Larger Sidebars

To achieve better symmetry with wider sidebar panels, reduce the minimum map width:

**Current:** `minmax(200px, 1fr)`
**New:** `minmax(180px, 1fr)` (slightly narrower minimum)

This allows the sidebars to claim more space, making the overall layout feel more balanced.

---

## Technical Implementation

### File: `src/index.css`

**Changes to `.tracking-content` grid:**
```css
/* Base - 480px right column */
.tracking-content {
  grid-template-columns: 320px minmax(180px, 1fr) 480px;
}

/* 1600px */
@media (max-width: 1600px) {
  .tracking-content {
    grid-template-columns: 300px minmax(160px, 1fr) 440px;
  }
}

/* 1400px */
@media (max-width: 1400px) {
  .tracking-content {
    grid-template-columns: 280px minmax(140px, 1fr) 400px;
  }
}

/* 1280px */
@media (max-width: 1280px) {
  .tracking-content {
    grid-template-columns: 260px 1fr 360px;
  }
}
```

**Remove dark mode CSS:**
- Delete `.dark .tracking-theme-toggle:hover` rule
- Review and remove any other `.dark .tracking-*` rules

### File: `src/pages/LiveTracking.tsx`

**Remove theme toggle:**
```typescript
// Remove these imports:
// import { useTheme } from "next-themes";
// Sun, Moon from lucide-react

// Remove this line from component:
// const { theme, setTheme } = useTheme();

// Remove the toggle button JSX (lines 328-341)
```

**Update demo addresses:**
```typescript
// Line 373 & 392 - Change destination to:
'1000 Ocean Dr, Miami Beach, FL 33139'
```

### File: `src/components/tracking/CheckMyTruckModal.tsx`

**Update multi-stop demo (line 86):**
```typescript
{ type: 'dropoff', address: "1000 Ocean Dr, Miami Beach, FL 33139", coords: [-80.13, 25.78], status: 'upcoming', eta: "4:45 PM" },
```

---

## Summary of Changes

| File | Changes |
|------|---------|
| `src/index.css` | Widen right column to 480px, make responsive, remove dark mode CSS |
| `src/pages/LiveTracking.tsx` | Remove theme toggle, update demo destination address |
| `src/components/tracking/CheckMyTruckModal.tsx` | Update multi-stop demo address |

---

## Expected Outcomes

1. **Wider Live Stats** - 480px base width gives more room for data display
2. **Responsive scaling** - Dashboard shrinks gracefully at smaller breakpoints
3. **No dark mode** - Removed toggle, light mode only
4. **Better Street View** - Ocean Drive address shows iconic Miami Beach imagery
5. **Better symmetry** - Reduced map minimum allows sidebars to breathe

