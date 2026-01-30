

# Add Empty State to InventoryShareModal Search

## Overview
Add a friendly empty state message when searching for items in the InventoryShareModal returns no results. This provides clear feedback to users instead of showing a blank grid.

---

## Current State

The search filters items but shows nothing when no matches are found:

```tsx
// Lines 183-188
const filteredItems = searchQuery.trim() 
  ? roomItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : roomItems;
```

The grid/list views (lines 304-383) directly map over `filteredItems` without checking if the array is empty.

---

## Changes Required

### File: `src/pages/Book.tsx`

**Lines 302-384** - Wrap the grid/list views with an empty state check:

```tsx
{/* Item Grid */}
<div className="flex-1 p-3 overflow-y-auto">
  {filteredItems.length === 0 ? (
    // Empty State
    <div className="flex flex-col items-center justify-center h-full text-center py-8">
      <Search className="w-8 h-8 text-slate-300 dark:text-slate-500 mb-3" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        No items found
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        Try a different search term
      </p>
    </div>
  ) : viewMode === 'grid' ? (
    <div className="grid grid-cols-4 gap-2">
      {/* ... existing grid items ... */}
    </div>
  ) : (
    <div className="space-y-2">
      {/* ... existing list items ... */}
    </div>
  )}
</div>
```

---

## Visual Result

**Before (empty search):**
```
┌─────────────────────────────┐
│ 🔍 Search: "piano"          │
├─────────────────────────────┤
│                             │
│         (blank)             │
│                             │
└─────────────────────────────┘
```

**After (empty search):**
```
┌─────────────────────────────┐
│ 🔍 Search: "piano"          │
├─────────────────────────────┤
│                             │
│           🔍                │
│     No items found          │
│  Try a different search     │
│                             │
└─────────────────────────────┘
```

---

## Summary

| File | Change |
|------|--------|
| `src/pages/Book.tsx` | Add empty state conditional before grid/list views (around line 303) |

The empty state uses existing icons (`Search` from lucide-react) and matches the modal's styling conventions with appropriate dark mode support.

