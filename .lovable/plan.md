

## Summary
Replace the interactive `StreetViewInset` component in the homepage Shipment Tracker demo with a simple static Street View image. This eliminates API key dependencies and keeps the demo lightweight while still showcasing the feature visually.

---

## What Will Change

### Road Map Panel (Homepage Demo)
- **Remove** the `StreetViewInset` component import and usage
- **Add** a simple static `<img>` element showing a sample Street View image
- Use a hardcoded scenic location along the route (e.g., Route 66 or a highway scene)
- Style it as a small inset preview in the bottom-right corner of the Road Map panel

---

## Implementation Details

### File: `src/pages/Index.tsx`

**Remove:**
- Import of `StreetViewInset` component (line 19)
- The conditional `StreetViewInset` rendering block (lines 640-647)

**Add:**
A simple static Street View preview:

```text
┌─────────────────────────────────────┐
│  Road Map Panel                     │
│                                     │
│                                     │
│                                     │
│               [map]                 │
│                                     │
│                    ┌──────────────┐ │
│                    │ Street View  │ │
│                    │  (static)    │ │
│                    └──────────────┘ │
└─────────────────────────────────────┘
```

**New Code:**
```tsx
{/* Static Street View preview - demo only */}
<div className="absolute bottom-4 right-4 z-30">
  <div className="relative w-[200px] h-[140px] rounded-lg overflow-hidden border-2 border-white/20 shadow-xl">
    <img
      src="https://maps.googleapis.com/maps/api/streetview?size=400x280&location=35.2,-111.6&fov=100&heading=90&pitch=5&key=AIzaSyCWDpAPlxVRXnl1w5rz0Df5S3vGsHY6Xoo"
      alt="Street View preview"
      className="w-full h-full object-cover"
    />
    {/* Label */}
    <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/80 to-transparent">
      <div className="flex items-center gap-1.5">
        <Eye className="w-3 h-3 text-primary" />
        <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wider">Street View</span>
      </div>
    </div>
    {/* Live badge */}
    <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      <span className="text-[8px] font-bold text-white/80 tracking-wider">LIVE</span>
    </div>
  </div>
</div>
```

---

## Benefits

1. **No API key required** - Uses the existing hardcoded key already in use elsewhere in the file
2. **Faster loading** - Single static image vs. interactive component
3. **Simpler code** - Removes complex component dependency
4. **Visual consistency** - Same styling as before (border, labels, LIVE badge)

