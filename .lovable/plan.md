

## Plan: Move Route Details to Dropdown Buttons in Map Controls

### Problem
The route details section (Weather, Alternate Routes, Weigh Stations) is currently displayed as a large collapsible panel **below the map**. This takes up significant vertical space and feels cluttered.

### Solution
Remove the entire below-map panel and move those features into **dropdown menus** that appear from buttons next to the Track and Reset buttons. This keeps the interface clean while maintaining access to all the information.

---

### Visual Layout

**Current:**
```text
+---------------------------+
|          MAP              |
+---------------------------+
| [Track] [Reset]           |  <-- Controls
+---------------------------+
| Show/Hide Route Details   |  <-- Collapsible trigger
|  - Weather                |
|  - Alternate Routes       |
|  - Weigh Stations         |
+---------------------------+
```

**After:**
```text
+---------------------------+
|          MAP              |
+---------------------------+
| [Track] [Reset] | [Weather ▼] [Routes ▼] [Weigh ▼] |
+---------------------------+
```

Each dropdown opens a popover/menu showing the content (weather forecast, alternate routes list, weigh station checklist).

---

### Technical Changes

**File: `src/pages/LiveTracking.tsx`**

1. **Delete the entire "Below Map Panel" section** (lines 810-882)
   - Remove the `Collapsible` wrapper
   - Remove the `belowMapCollapsed` state if no longer used
   - Remove the `IndividualCollapsibleSection` component if unused elsewhere

2. **Delete unused state variable**
   - Remove `belowMapCollapsed` state setter

3. **Add dropdown buttons to the controls strip** (after Reset button, around line 806)
   - Add Weather dropdown using `DropdownMenu` component
   - Add Alternate Routes dropdown 
   - Add Weigh Stations dropdown
   - Each dropdown contains the same content that was in the collapsible sections

4. **Import cleanup**
   - Remove `IndividualCollapsibleSection` component definition (lines 81-120)

---

### New Control Strip Structure

```tsx
{/* Map Controls Strip - Go/Pause/Reset + Route Info Dropdowns */}
<div className="tracking-map-controls">
  <div className="tracking-map-controls-buttons">
    {/* Existing Track/Pause/Reset buttons */}
    {/* ... */}
    
    {/* Separator */}
    <div className="h-6 w-px bg-border mx-2" />
    
    {/* Weather Dropdown */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Cloud className="w-4 h-4" />
          Weather
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 p-3">
        <CompactRouteWeather ... />
      </DropdownMenuContent>
    </DropdownMenu>
    
    {/* Alternate Routes Dropdown */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Route className="w-4 h-4" />
          Routes
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 p-3">
        {/* Alternate routes list */}
      </DropdownMenuContent>
    </DropdownMenu>
    
    {/* Weigh Stations Dropdown */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Scale className="w-4 h-4" />
          Weigh
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 p-3">
        <WeighStationChecklist ... />
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</div>
```

---

### CSS Changes

**File: `src/index.css`**

- Remove or simplify the `.tracking-below-map-*` styles that are no longer needed
- Ensure dropdown content has appropriate styling

---

### Summary

| Action | What |
|--------|------|
| Delete | Lines 810-882 (entire below-map collapsible panel) |
| Delete | Lines 81-120 (`IndividualCollapsibleSection` component) |
| Delete | `belowMapCollapsed` state variable |
| Add | Weather dropdown button next to Reset |
| Add | Routes dropdown button |
| Add | Weigh Stations dropdown button |
| Update | Controls strip to use flexbox with separator |

