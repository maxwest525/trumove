
# Plan: Fix Screen Share Preview Modal Layout & Close Button

## Overview
Two changes needed to the `ScreenSharePreviewModal` component in `src/pages/Book.tsx`:
1. Prevent the inventory tracker from being cut off by the video window bounds
2. Add a prominent X close button (in addition to the macOS-style red dot)

---

## Changes

### 1. Prevent Modal from Being Cut Off

**Problem**: The modal uses `max-w-2xl` (672px) and a fixed `h-[360px]` content area. When placed inside the video window (560px height), the total modal height (with header and footer) can exceed the container bounds.

**Solution**: 
- Reduce the content area height from `h-[360px]` to `h-[280px]`
- Add `overflow-hidden` to the outer container
- Use smaller max-width for the modal

**File: `src/pages/Book.tsx`** (line 473)
```tsx
// BEFORE:
<div className="w-full max-w-2xl mx-4">
  <div className="bg-white dark:bg-slate-800 rounded-xl...">
    ...
    <div className="flex h-[360px]">

// AFTER:
<div className="w-full max-w-xl mx-4 max-h-[calc(100%-32px)]">
  <div className="bg-white dark:bg-slate-800 rounded-xl... overflow-hidden">
    ...
    <div className="flex h-[280px]">
```

---

### 2. Add Prominent X Close Button

**Problem**: The only close option is the tiny macOS-style red dot, which is not intuitive for all users.

**Solution**: Add a visible X button in the top-right corner of the window chrome.

**File: `src/pages/Book.tsx`** (lines 476-491 - Window Chrome section)
```tsx
// BEFORE:
<div className="px-4 py-3 bg-slate-100 dark:bg-slate-700 flex items-center gap-2 border-b">
  <div className="flex gap-1.5">
    <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500..." />
    <div className="w-3 h-3 rounded-full bg-yellow-500" />
    <div className="w-3 h-3 rounded-full bg-green-500" />
  </div>
  <div className="flex-1 text-center">
    <span className="text-sm font-medium...">Agent's View - Your Inventory</span>
  </div>
  <span className="text-[10px] font-bold uppercase...">
    <Monitor className="w-3 h-3" />
    Sharing
  </span>
</div>

// AFTER:
<div className="px-4 py-3 bg-slate-100 dark:bg-slate-700 flex items-center gap-2 border-b">
  <div className="flex gap-1.5">
    <div className="w-3 h-3 rounded-full bg-red-500" />
    <div className="w-3 h-3 rounded-full bg-yellow-500" />
    <div className="w-3 h-3 rounded-full bg-green-500" />
  </div>
  <div className="flex-1 text-center">
    <span className="text-sm font-medium...">Agent's View - Your Inventory</span>
  </div>
  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 flex items-center gap-1 mr-2">
    <Monitor className="w-3 h-3" />
    Sharing
  </span>
  {/* Prominent X close button */}
  <button 
    onClick={onClose}
    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
    title="Close preview"
  >
    <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
  </button>
</div>
```

---

## Summary of Changes

| Location | Change |
|----------|--------|
| Line 473 | Change `max-w-2xl` to `max-w-xl`, add `max-h-[calc(100%-32px)]` |
| Line 474 | Add `overflow-hidden` to inner container |
| Line 494 | Reduce content height from `h-[360px]` to `h-[280px]` |
| Lines 476-491 | Remove onClick from red dot, add explicit X button after "Sharing" badge |

---

## Files to Modify

- `src/pages/Book.tsx` - ScreenSharePreviewModal component only
