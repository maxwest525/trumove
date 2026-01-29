
# Plan: TruDy Avatar, Homepage Cleanup, and Header Styling

This plan addresses four requests:
1. Create a TruDy avatar image to replace the star icon in chat bubbles
2. Remove the "Real-Time Shipment Tracking" preview card from the homepage
3. Change the "Build Your **Virtual Inventory**" header to "Build Your **Move**" and ensure it matches the "Move **Summary**" header exactly

---

## Summary of Changes

| Change | Files Affected |
|--------|----------------|
| TruDy avatar for chat bubbles | New image + `AIChatContainer.tsx` + `ChatMessage.tsx` |
| Remove Tracking Preview from homepage | `Index.tsx` |
| Update Build Your Move header | `OnlineEstimate.tsx` |

---

## 1. Create TruDy Avatar Image

Generate an AI avatar image for TruDy - a friendly, professional-looking female AI assistant avatar that fits the TruMove brand colors (green primary, dark backgrounds).

**Image Requirements:**
- Size: 64x64 or 128x128 pixels (for retina displays)
- Style: Modern, friendly, minimalist avatar
- Colors: Should work well on both light and dark backgrounds
- Format: PNG with transparency

**Files to update:**

**`src/components/chat/AIChatContainer.tsx`**
- Import the TruDy avatar image
- Replace SVG star icon in header avatar with the TruDy image
- Replace SVG star icon in message bubbles with the TruDy image

```tsx
// Import at top
import trudyAvatar from "@/assets/trudy-avatar.png";

// In header:
<div className="chat-avatar-small bg-primary/10">
  <img src={trudyAvatar} alt="TruDy" className="w-6 h-6 rounded-full object-cover" />
</div>

// In message bubbles:
{msg.role === "assistant" && (
  <div className="chat-avatar">
    <img src={trudyAvatar} alt="TruDy" className="w-8 h-8 rounded-full object-cover" />
  </div>
)}
```

---

## 2. Remove Tracking Preview Card from Homepage

**File:** `src/pages/Index.tsx`

Remove the `<TrackingPreviewCard />` component from the "Why TruMove" section (line 1363).

The section structure will become:
```tsx
{/* CARD 1: Why TruMove Feature Grid */}
<div className="tru-why-card ...">
  {/* ... existing content ... */}
</div>

{/* TrackingPreviewCard REMOVED */}
```

Also delete the `TrackingPreviewCard` function component definition (lines 51-78) since it's no longer used.

---

## 3. Update "Build Your Move" Headers

**File:** `src/pages/OnlineEstimate.tsx`

Change all instances of "Build Your **Virtual Inventory**" to "Build Your **Move**" to match the "Move **Summary**" header styling.

**Lines to update:**

1. **Page Hero (line 306-307):**
```tsx
<h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">
  Build Your <span className="tru-qb-title-accent">Move</span>
</h1>
```

2. **Locked State Muted Header (lines 343-344):**
```tsx
<h3 className="text-lg font-black text-foreground">
  Build Your <span className="tru-qb-title-accent">Move</span>
</h3>
```

3. **Unlocked State Header (lines 383-384):**
```tsx
<h3 className="text-lg font-black text-foreground">
  Build Your <span className="tru-qb-title-accent">Move</span>
</h3>
```

The subtitles can remain as "Add items or scan your rooms" to provide context.

---

## Visual Comparison

### Before:
- Chat bubbles: Star icon SVG
- Homepage: Shows "Real-Time Shipment Tracking" preview card
- Estimate page: "Build Your **Virtual Inventory**"

### After:
- Chat bubbles: TruDy avatar image (friendly, branded)
- Homepage: Tracking preview card removed
- Estimate page: "Build Your **Move**" (matches "Move **Summary**" exactly)

---

## Files Changed Summary

| File | Change |
|------|--------|
| `src/assets/trudy-avatar.png` | New avatar image (AI generated) |
| `src/components/chat/AIChatContainer.tsx` | Replace star SVG with TruDy avatar |
| `src/pages/Index.tsx` | Remove TrackingPreviewCard component and usage |
| `src/pages/OnlineEstimate.tsx` | Update header text from "Virtual Inventory" to "Move" |

---

## Testing Checklist

After implementation:
1. Open the floating TruDy chat button - verify TruDy avatar appears in header
2. Send a message and verify TruDy avatar appears next to AI responses (not star icon)
3. Check homepage - verify "Real-Time Shipment Tracking" card is gone
4. Navigate to /online-estimate - verify headers say "Build Your **Move**"
5. Compare "Build Your Move" header styling to "Move Summary" - should be identical
6. Test in dark mode to ensure avatar and headers display correctly
