
# Plan: Fix SAFER Database Search Button Visibility in Light Mode

## Problem Identified

The `CarrierSearch` component has buttons and input elements with hardcoded white text colors that become invisible in light mode:

1. **Search Type Toggle Buttons (Name, DOT, MC)** - Lines 151-153, 171-173, 191-193
   - Active state: `text-white border-2 border-green-500`
   - Inactive state: `text-white/60 hover:text-white hover:bg-white/10 border border-white/20`

2. **Search Input** - Lines 227, 240
   - Icon: `text-white/50`
   - Input: `text-white placeholder:text-white/40`

## Solution

Update the terminal-context styling to use theme-aware classes that work in both light and dark modes.

## Implementation

**File**: `src/components/vetting/CarrierSearch.tsx`

### Change 1: Name Button (Lines 151-153)
```tsx
// FROM:
: (searchType === 'name' 
    ? 'text-white border-2 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' 
    : 'text-white/60 hover:text-white hover:bg-white/10 border border-white/20 active:bg-white/20')

// TO:
: (searchType === 'name' 
    ? 'text-slate-900 dark:text-white border-2 border-green-500 bg-green-500/10 dark:bg-transparent shadow-[0_0_8px_rgba(34,197,94,0.3)]' 
    : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-300 dark:border-white/20')
```

### Change 2: DOT Button (Lines 171-173)
Same pattern as above.

### Change 3: MC Button (Lines 191-193)
Same pattern as above.

### Change 4: Search Icon (Line 227)
```tsx
// FROM:
<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />

// TO:
<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-white/50" />
```

### Change 5: Search Input (Line 240)
```tsx
// FROM:
className="pl-12 pr-12 h-12 text-base bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/20"

// TO:
className="pl-12 pr-12 h-12 text-base bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/20"
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/vetting/CarrierSearch.tsx` | Update button and input styling for theme-awareness |

## Result

The SAFER database search buttons (Name, DOT, MC) and the search input will be fully visible in both light and dark modes, with appropriate contrast in each theme.
