
## Plan: Enlarge Text on Feature Carousel Cards & Debug Route Details

Based on my analysis, almost all requested features are already implemented. The remaining work is:

### 1. Enlarge Feature Carousel Card Text

**Current State:**
- Card title: `1rem` (16px) - line 17853
- Card description: `0.875rem` (14px) - line 17865

**Changes to `src/index.css`:**

Increase the typography sizes for better readability:
- `.features-carousel-card-title`: Change from `1rem` to `1.125rem` (18px)
- `.features-carousel-card-desc`: Change from `0.875rem` to `0.938rem` (15px)
- Consider adding slightly more padding and increasing card height from `240px` to `260px` to accommodate larger text

### 2. Investigate Route Details Panel Issue

The route details section in LiveTracking.tsx (lines 810-882) exists with:
- Weather section
- Alternate Routes section  
- Weigh Stations section

The structure looks correct. Potential issues to investigate:
- CSS display/visibility properties
- Collapsible state management
- Data not being passed correctly to child components

**Debugging steps:**
1. Check if `originCoords` and `destCoords` are populated
2. Verify `googleRouteData.alternateRoutes` is being fetched
3. Test collapsible open/close functionality

---

### Technical Implementation

**File: `src/index.css`**

Update carousel card typography (around lines 17852-17872):

```css
/* BEFORE */
.features-carousel-card-title {
  font-size: 1rem;
  font-weight: 700;
  ...
}

.features-carousel-card-desc {
  font-size: 0.875rem;
  ...
}

/* AFTER */
.features-carousel-card-title {
  font-size: 1.125rem;  /* Increased from 1rem */
  font-weight: 700;
  ...
}

.features-carousel-card-desc {
  font-size: 0.938rem;  /* Increased from 0.875rem */
  ...
}

/* Also increase card height to fit larger text */
.features-carousel-card {
  height: 260px;  /* Increased from 240px */
  ...
}
```

---

### Route Details - What to Check

To debug the route details issue, I would need to:
1. Open the browser and test the collapsible panel
2. Check console logs for any errors
3. Verify data flow from Google Routes API

If you can describe what specifically is "not functioning properly" (e.g., doesn't open, shows empty, data missing), I can target the fix more precisely.

---

### Summary

| Change | File |
|--------|------|
| Enlarge card title to 18px | `src/index.css` |
| Enlarge card description to 15px | `src/index.css` |
| Increase card height to 260px | `src/index.css` |
| Debug route details (pending info) | `src/pages/LiveTracking.tsx` |
