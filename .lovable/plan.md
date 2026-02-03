

## Plan: Tracking Page UI Improvements

### Overview
This plan addresses 5 key issues on the Shipment Command Center (/track) page:

1. Add badges/icons to dropdown buttons showing data availability
2. Fix unreadable text and styling in dropdown content
3. Change Track button to match the "Analyze Route" screenshot (dark background with green accents)
4. Match the modal's "View Route" button to same style
5. Remove the booking/shipment number box with "Go" button from the top of the map

---

### Changes Summary

| Task | File(s) |
|------|---------|
| Remove booking overlay from map | `src/pages/LiveTracking.tsx` |
| Restyle Track button to dark/premium | `src/pages/LiveTracking.tsx`, `src/index.css` |
| Add data indicators to dropdown buttons | `src/pages/LiveTracking.tsx` |
| Fix dropdown content readability | `src/index.css` |
| Restyle View Route button in modal | `src/components/tracking/RouteSetupModal.tsx` |

---

### Detailed Changes

#### 1. Remove Booking Search Overlay (Lines 641-693 in LiveTracking.tsx)

Delete the entire booking search input section that sits at the top of the map container. Users can use the modal or Demo button instead.

**Delete this section:**
```tsx
{/* Booking Search Overlay - Top of Map */}
<div className="absolute top-3 left-3 right-3 z-20 flex items-center gap-2">
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg ...">
    <input type="text" placeholder="Booking ID or Shipment #" ... />
    <Popover>...</Popover>
    <Button onClick={handleBookingSearch}>Go</Button>
  </div>
  <Button onClick={handleDemoClick}>Demo</Button>
</div>
```

Keep the Demo button separately positioned elsewhere (or as part of the controls strip).

---

#### 2. Restyle Track Button to Match Screenshot

The screenshot shows a dark button with:
- Near-black background (`hsl(220 15% 8%)`)
- White text for "Analyze Route"
- Green icon with spinner animation
- Rounded corners
- Arrow icon on right

**Update CSS (`.tracking-map-go-btn`):**
```css
.tracking-map-go-btn {
  background: hsl(220 15% 8%) !important;
  color: white !important;
  font-weight: 700 !important;
  padding: 10px 24px !important;
  height: 42px !important;
  gap: 8px !important;
  border-radius: 10px !important;
  border: 2px solid hsl(var(--border) / 0.3) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease;
}

.tracking-map-go-btn .lucide {
  color: hsl(var(--primary)) !important;
}

.tracking-map-go-btn:hover:not(:disabled) {
  background: hsl(220 15% 12%) !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  transform: translateY(-1px);
}
```

**Update JSX to include arrow:**
```tsx
<Button onClick={startTracking} disabled={!canTrack} className="tracking-map-go-btn">
  <Play className="w-4 h-4" />
  Analyze Route
  <ArrowRight className="w-4 h-4" />
</Button>
```

---

#### 3. Add Data Availability Indicators to Dropdown Buttons

Add small badges/dots that show when data is loaded for each dropdown:

**Weather Dropdown:**
```tsx
<Button variant="ghost" size="sm" className="gap-1.5 relative">
  <Cloud className="w-4 h-4" />
  Weather
  {originCoords && destCoords && (
    <span className="w-2 h-2 rounded-full bg-primary absolute -top-0.5 -right-0.5" />
  )}
  <ChevronDown className="w-3 h-3" />
</Button>
```

**Routes Dropdown (already conditional):**
- Add a count badge showing number of alternate routes found
```tsx
<Button variant="ghost" size="sm" className="gap-1.5">
  <Route className="w-4 h-4" />
  Routes
  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
    {googleRouteData.alternateRoutes?.length || 0}
  </span>
  <ChevronDown className="w-3 h-3" />
</Button>
```

**Weigh Stations Dropdown:**
```tsx
<Button variant="ghost" size="sm" className="gap-1.5">
  <Scale className="w-4 h-4" />
  Weigh
  {routeCoordinates.length > 0 && (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
      {stationsCount}
    </span>
  )}
  <ChevronDown className="w-3 h-3" />
</Button>
```

---

#### 4. Fix Dropdown Content Readability

The issue is that styles use hardcoded `white` and dark-mode-only colors which break in light mode.

**Fix alternate routes styling (index.css):**
```css
/* BEFORE - hardcoded white */
.tracking-alt-route-name {
  font-size: 13px;
  font-weight: 600;
  color: white;
}

/* AFTER - using CSS variables */
.tracking-alt-route-name {
  font-size: 13px;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.tracking-alt-route-meta {
  font-size: 11px;
  color: hsl(var(--muted-foreground));
  display: flex;
  align-items: center;
  gap: 6px;
}

.tracking-alternate-route-item {
  background: hsl(var(--muted) / 0.5);
  border: 1px solid hsl(var(--border));
  /* Remove hardcoded rgba(255,255,255) values */
}
```

**Fix weigh station styling:**
```css
/* Update hardcoded slate colors to design tokens */
.weigh-station-checklist .text-slate-400 {
  color: hsl(var(--muted-foreground)) !important;
}

.weigh-station-checklist .text-slate-500 {
  color: hsl(var(--muted-foreground) / 0.8) !important;
}

/* Or update the WeighStationChecklist.tsx to use Tailwind classes that respect theme */
```

**Alternative approach for WeighStationChecklist.tsx:**
Replace hardcoded `text-slate-*` classes with theme-aware classes:
- `text-slate-400` → `text-muted-foreground`
- `text-slate-500` → `text-muted-foreground/80`
- `text-slate-300` → `text-foreground/90`

---

#### 5. Restyle "View Route" Button in Modal

Match the same dark premium style as the Track button.

**Update RouteSetupModal.tsx (line 378-386):**
```tsx
<Button 
  onClick={handleSubmit} 
  disabled={!canSubmit}
  size="sm"
  className="h-10 px-6 gap-2 bg-[hsl(220,15%,8%)] text-white hover:bg-[hsl(220,15%,12%)] border-2 border-border/30 rounded-lg font-bold shadow-lg"
>
  <Play className="w-4 h-4 text-primary" />
  View Route
  <ArrowRight className="w-4 h-4" />
</Button>
```

Or create a shared CSS class `.premium-dark-btn` that both buttons can use.

---

### File Changes Summary

**`src/pages/LiveTracking.tsx`:**
- Remove lines 641-693 (booking search overlay)
- Update Track button text to "Analyze Route" with ArrowRight icon
- Add data indicator badges to Weather, Routes, Weigh dropdown triggers
- Move Demo button to controls strip or keep it simpler

**`src/index.css`:**
- Update `.tracking-map-go-btn` to dark premium style
- Fix `.tracking-alternate-route-item`, `.tracking-alt-route-name`, `.tracking-alt-route-meta` to use CSS variables
- Add theme-aware overrides for weigh station colors

**`src/components/tracking/RouteSetupModal.tsx`:**
- Update View Route button with premium dark styling

**`src/components/tracking/WeighStationChecklist.tsx`:**
- Replace hardcoded `text-slate-*` classes with theme-aware alternatives

---

### Visual Result

**Track Button:**
Dark near-black button with "Analyze Route" text, green Play icon, white arrow

**Dropdown Buttons:**
- Weather: Small green dot when coordinates loaded
- Routes: Count badge showing "2" or "3" alternate routes
- Weigh: Orange count badge showing station count

**Modal Button:**
Same dark premium style with green icon accent

**Map Area:**
Clean map without the overlapping booking search bar - users interact via the modal or Demo button

