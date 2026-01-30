

# Remove Live Session Pill from Video Consult

## Overview
Remove the "Connected" status pill from the top-left corner of the TruMove video consult demo interface.

---

## Current State
In `src/pages/Book.tsx` (lines 324-333), there are two pills displayed in the top-left corner of the demo video view:

```tsx
{/* Connection status */}
<div className="absolute top-4 left-4 flex items-center gap-2">
  <div className="px-3 py-1.5 rounded-full bg-amber-500/90 text-white text-xs font-bold flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
    DEMO MODE
  </div>
  <div className="px-3 py-1.5 rounded-full bg-green-500/90 text-white text-xs font-bold flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-white" />
    Connected
  </div>
</div>
```

---

## Change
**File:** `src/pages/Book.tsx` (lines 328-332)

Remove the green "Connected" pill, keeping only the "DEMO MODE" indicator:

```tsx
{/* Connection status */}
<div className="absolute top-4 left-4 flex items-center gap-2">
  <div className="px-3 py-1.5 rounded-full bg-amber-500/90 text-white text-xs font-bold flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
    DEMO MODE
  </div>
</div>
```

---

## Summary

| Task | File | Change |
|------|------|--------|
| Remove "Connected" pill | `src/pages/Book.tsx` | Delete lines 328-332 (the green pill div) |

## Visual Result
- The video consult demo will only show the "DEMO MODE" amber pill in the top-left
- The green "Connected" live session indicator will be removed
- Cleaner, less cluttered interface

