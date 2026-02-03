

## Plan: Add Trust Indicators & Switch to Pure Satellite View

### Overview
Two changes to enhance the tracking page:
1. Add more trust indicators to the header strip (like 24/7 Support, Insured Cargo)
2. Switch the map from hybrid mode (with highway labels) to pure satellite view for a cleaner look

---

### Changes

**File: `src/pages/LiveTracking.tsx`**

1. **Add new icons** to the imports (line 2)
   - Add `Headphones` (for 24/7 Support) and `Shield` (for Insured Cargo)

2. **Change map default from hybrid to satellite** (line 147)
   ```tsx
   // Before
   const [mapViewType, setMapViewType] = useState<'satellite' | 'hybrid' | 'roadmap'>('hybrid');
   
   // After
   const [mapViewType, setMapViewType] = useState<'satellite' | 'hybrid' | 'roadmap'>('satellite');
   ```

3. **Add more trust indicators to the header** (lines 601-616)
   - Add "24/7 SUPPORT" with Headphones icon
   - Add "INSURED CARGO" with Shield icon
   - Keep all existing indicators (FMCSA VERIFIED, LIVE GPS, REAL-TIME ETA)

---

### Result

**Trust Strip** will show 5 items:
- FMCSA VERIFIED ✓
- LIVE GPS ✓  
- REAL-TIME ETA ✓
- 24/7 SUPPORT (new)
- INSURED CARGO (new)

**Map** will display pure satellite imagery without distracting highway labels and road name overlays.

