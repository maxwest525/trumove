
# Plan: Fix Build Your Move Header Dark Mode Background

## Issue Identified

The "Build Your Move" header uses the `tru-summary-header-large` class, but its dark background isn't applying because:

1. The header is inside a parent container with `bg-card` class (line 379 of OnlineEstimate.tsx)
2. The `.bg-card` utility class from Tailwind applies `background: hsl(var(--card))` 
3. In dark mode, `--card` is a lighter gray color that's being applied to the container
4. While `!important` is used on `.dark .tru-summary-header-large`, the specificity selector chain may not be sufficient

**Current structure:**
```html
<div class="rounded-2xl bg-card ...">  <!-- Parent with bg-card -->
  <div class="tru-summary-header-large">  <!-- Header -->
    Build Your Move
  </div>
</div>
```

**Move Summary structure** (which works correctly):
```html
<div class="tru-move-summary-card is-expanded">  <!-- Parent with specific card class -->
  <div class="tru-summary-header-large">  <!-- Header -->
    Move Summary
  </div>
</div>
```

## Solution

Add additional specificity selectors to the dark mode CSS rule that target the specific parent structure used in OnlineEstimate.tsx, and also add a direct override for elements inside `.bg-card`:

**File:** `src/index.css`

Update the dark mode rule at line 26422-26430:

```css
/* Build Your Move header - match Move Summary styling EXACTLY in dark mode */
.dark .tru-summary-header-large,
.dark .rounded-2xl .tru-summary-header-large,
.dark .bg-card .tru-summary-header-large,
.dark .tru-move-summary-card .tru-summary-header-large,
.dark section .tru-summary-header-large,
html.dark .tru-summary-header-large,
.dark .overflow-hidden > .tru-summary-header-large {
  background: hsl(220 15% 8%) !important;
  border-color: hsl(0 0% 100% / 0.1) !important;
}
```

Additionally, the `bg-card` Tailwind utility might be causing issues by using inline styles or higher specificity. A safer approach is to add a specific class to the header that has ultimate specificity:

**Alternative/Additional approach** - add inline style override to the component:

**File:** `src/pages/OnlineEstimate.tsx`

At lines 341 and 381, update the header divs to include a custom style that forces the dark background:

```tsx
// Line 341 (locked state)
<div className="tru-summary-header-large border-b border-border/40 opacity-50 dark:!bg-[hsl(220,15%,8%)]">

// Line 381 (unlocked state) 
<div className="tru-summary-header-large border-b border-border/40 dark:!bg-[hsl(220,15%,8%)]">
```

The `dark:!bg-[hsl(220,15%,8%)]` Tailwind class will forcefully apply the dark background color when in dark mode, using Tailwind's arbitrary value syntax with `!important`.

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/index.css` | Add more parent selector combinations to dark mode rule |
| `src/pages/OnlineEstimate.tsx` | Add `dark:!bg-[hsl(220,15%,8%)]` to header divs at lines 341 and 381 |

---

## Testing Checklist

After implementation:
1. Navigate to /online-estimate in dark mode
2. Verify "Build Your Move" header has the dark (near-black) background matching "Move Summary"
3. Check both locked and unlocked states of the inventory builder
4. Confirm the green gradient accent on "Move" text is visible
5. Test light mode to ensure the light gray background still works
