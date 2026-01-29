

# Remaining UI Fixes - Verification & Adjustments

## Summary

After thorough testing, most fixes from the previous implementation are working correctly. However, a few issues need additional attention:

| Issue | Current State | Required Action |
|-------|---------------|-----------------|
| Dark mode logo (header) | "MOVE" invisible | Add filter to header logo |
| Video consult pill thumbnails | w-16 h-16 (64px) | Increase to w-20 h-20 (80px) or larger |
| Build Your Move form width | Standard width | Expand leftward as requested |

---

## Fix 1: Header Logo Dark Mode Visibility

**Problem:** The TruMove logo in the site header shows "TRU" in green but "MOVE" in black is invisible on dark backgrounds.

**File:** `src/index.css`  
**Action:** Add dark mode filter for the main header logo

```css
/* Header logo - invert black portions in dark mode */
.dark header .tru-logo-image,
.dark .tru-header-logo {
  filter: brightness(0) invert(1);
}
```

---

## Fix 2: Video Consult Pill Thumbnails

**Problem:** User requests larger preview thumbnails inside video consult action pills on /book page to make intent clearer.

**Current:** `w-16 h-16` (64x64px)  
**New:** `w-20 h-20` (80x80px) or `w-24 h-24` (96x96px)

**File:** `src/pages/Book.tsx`  
**Location:** Lines ~193-223 (action buttons grid)

**Changes:**
- Build Inventory thumbnail: `w-16 h-16` → `w-20 h-20`
- AI Scanner thumbnail: `w-16 h-16` → `w-20 h-20`

---

## Fix 3: Build Your Move Form Width Expansion

**Problem:** User wants the Build Your Move form (left column) to expand leftward while staying in same position.

**File:** `src/pages/OnlineEstimate.tsx`  
**Current:** `grid-cols-[480px_1fr_240px]`  
**Option 1:** Increase left column: `grid-cols-[540px_1fr_240px]`  
**Option 2:** Use percentage: `grid-cols-[35%_1fr_240px]`

This expands the form leftward into available space while keeping right sidebar fixed.

---

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Add dark mode header logo filter |
| `src/pages/Book.tsx` | Increase thumbnail sizes from w-16 h-16 to w-20 h-20 |
| `src/pages/OnlineEstimate.tsx` | Increase left column width in grid |

### CSS Additions (src/index.css)

```css
/* Header logo dark mode visibility */
.dark header img[alt="TruMove"] {
  filter: brightness(0) invert(1);
}
```

### Component Changes (src/pages/Book.tsx)

```tsx
{/* Build Inventory - INCREASE THUMBNAIL SIZE */}
<div className="w-20 h-20 rounded-xl overflow-hidden border border-border/60">
  <img src={sampleRoomLiving} ... />
</div>

{/* AI Scanner - INCREASE THUMBNAIL SIZE */}
<div className="w-20 h-20 rounded-xl overflow-hidden border border-border/60">
  <img src={previewAiScanner} ... />
</div>
```

### Layout Changes (src/pages/OnlineEstimate.tsx)

```tsx
{/* LOCKED STATE: Expand left column from 480px to 540px */}
<div className="grid grid-cols-1 lg:grid-cols-[540px_1fr_240px] gap-4 items-start">
```

---

## Verification Checklist

After implementation:

1. Navigate to homepage in dark mode - verify header logo is fully visible
2. Navigate to /book - verify thumbnail images are larger and clearer
3. Navigate to /online-estimate - verify left form column is wider
4. Toggle between light/dark mode to ensure all changes work in both themes

