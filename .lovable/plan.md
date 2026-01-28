

## Plan: Add Visual Follow Mode Indicator & Verification

This plan adds a more prominent visual indicator showing when the truck is being followed vs when the user has panned away.

---

## Summary of Changes

| Change | Description |
|--------|-------------|
| **1. Enhanced Follow Button Indicator** | Add distinct styling when following vs not following |
| **2. On-Map Status Badge** | Add a floating badge on the map showing current follow status |
| **3. Update plan.md** | Mark completed items and add any remaining fixes |

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/LiveTracking.tsx` | Modify | Add on-map follow status badge, improve Follow button visual states |
| `src/index.css` | Modify | Add CSS for follow mode indicator states and on-map badge |
| `.lovable/plan.md` | Modify | Update completion status |

---

## 1. Enhanced Follow Button Styling

### Current Implementation
```typescript
<Button
  className={cn(
    "tracking-header-satellite-btn",
    followMode && "bg-white/20"  // Subtle highlight when active
  )}
>
  <Navigation2 className={cn("w-4 h-4", followMode && "animate-pulse")} />
  <span>{followMode ? "Following" : "Follow"}</span>
</Button>
```

### Enhanced Implementation
Add distinct CSS classes for active/inactive states:

```typescript
<Button
  className={cn(
    "tracking-header-satellite-btn",
    followMode ? "tracking-follow-active" : "tracking-follow-inactive"
  )}
>
  <Navigation2 className={cn(
    "w-4 h-4 transition-all",
    followMode && "text-primary animate-pulse"
  )} />
  <span>{followMode ? "Following" : "Follow"}</span>
</Button>
```

### CSS for Active/Inactive States:
```css
/* Following active - primary color accent */
.tracking-follow-active {
  background: linear-gradient(135deg, hsl(var(--primary) / 0.25), hsl(var(--primary) / 0.15)) !important;
  border-color: hsl(var(--primary) / 0.6) !important;
  box-shadow: 0 0 12px hsl(var(--primary) / 0.3), inset 0 0 8px hsl(var(--primary) / 0.1);
}

/* Following inactive - warning/muted state */
.tracking-follow-inactive {
  background: hsl(var(--tm-ink)) !important;
  border-color: hsl(var(--foreground) / 0.15) !important;
  color: hsl(var(--foreground) / 0.6) !important;
}

.tracking-follow-inactive:hover {
  border-color: hsl(var(--primary) / 0.4) !important;
}
```

---

## 2. On-Map Follow Status Badge

Add a floating badge on the map that shows the current follow status:

### Location
Bottom-left corner of the map, near the Google attribution

### Implementation
```typescript
{/* Follow Mode Status Badge on Map */}
<div className={cn(
  "absolute bottom-16 left-3 z-20 px-3 py-1.5 rounded-lg backdrop-blur-sm border transition-all duration-300",
  followMode 
    ? "bg-primary/20 border-primary/40 text-primary" 
    : "bg-amber-500/15 border-amber-500/30 text-amber-400"
)}>
  <div className="flex items-center gap-2">
    {followMode ? (
      <>
        <Navigation2 className="w-3.5 h-3.5 animate-pulse" />
        <span className="text-[10px] font-bold tracking-wider uppercase">Following Truck</span>
      </>
    ) : (
      <>
        <Crosshair className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold tracking-wider uppercase">Manual View</span>
      </>
    )}
  </div>
</div>
```

### Visual States
```text
FOLLOWING:
┌─────────────────────────┐
│ 🧭 FOLLOWING TRUCK      │ ← Green/primary color, pulsing icon
└─────────────────────────┘

MANUAL VIEW:
┌─────────────────────────┐
│ ⊕ MANUAL VIEW           │ ← Amber/warning color, static icon
└─────────────────────────┘
```

---

## 3. Update plan.md

Mark completed items from the previous plan:

### Completed Items (mark with ✅):
- Main map dropdown cleanup (Hybrid/Roadmap/3D only)
- Remove native map type controls
- Add Recenter button
- Demo mode speed distinction
- Booking number pre-fill verification

### Add New Items:
- Visual follow mode indicator (header button + on-map badge)

---

## Visual Summary

### Header Button States
```text
FOLLOWING:                      NOT FOLLOWING:
┌──────────────────┐            ┌──────────────────┐
│ 🧭 Following     │            │ 🧭 Follow        │
│ (green glow)     │            │ (muted/dim)      │
└──────────────────┘            └──────────────────┘
```

### On-Map Badge (bottom-left of map)
```text
┌───────────────────────────────────────────────────────────────────┐
│                          MAP AREA                                 │
│                                                                   │
│                                                                   │
│                                                                   │
│                                                                   │
│  ┌─────────────────────┐                                          │
│  │ 🧭 FOLLOWING TRUCK  │ ← Status badge                           │
│  └─────────────────────┘                                          │
│  ┌─────────────────────┐                                          │
│  │    Google Maps      │ ← Attribution                            │
│  └─────────────────────┘                                          │
└───────────────────────────────────────────────────────────────────┘
```

---

## Technical Details

### Badge Placement
The badge will be positioned `absolute bottom-16 left-3` to sit above the Google attribution (which is at `bottom-3 left-3`).

### Animation
- Following mode: Navigation2 icon has `animate-pulse` for attention
- Manual mode: Static Crosshair icon indicates user-controlled view

### Transition
Both states use `transition-all duration-300` for smooth state changes when:
1. User clicks Follow/Following button
2. User pans/drags the map (auto-disables follow mode)

