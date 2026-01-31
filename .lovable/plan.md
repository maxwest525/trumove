
# Plan: Fix Light Mode Visibility in SAFER DATABASE QUERY Terminal

## Problem

In light mode, the "SAFER DATABASE QUERY" terminal has visibility issues:
1. **Terminal title** (`SAFER DATABASE QUERY`) uses `hsl(var(--muted-foreground))` which is a mid-gray on a light gray background - low contrast
2. **Toggle buttons** (Name, DOT, MC) use `text-slate-600` for inactive state which also has insufficient contrast
3. **Active buttons** have a subtle green border that's harder to distinguish in light mode

## Root Cause

The CSS values are optimized for dark mode aesthetics but the light mode fallbacks don't provide enough contrast:
- Terminal header background: `hsl(210 40% 96.1%)` (very light gray)
- Terminal title: `hsl(215.4 16.3% 46.9%)` (mid gray - low contrast)
- Button text: `slate-600` (mid gray)

## Solution

Increase contrast for all text and interactive elements in light mode within the FMCSA terminal.

## Implementation

### File: `src/index.css`

**1. Update `.fmcsa-terminal-title` (line 24726-24737):**

Change light mode color from `hsl(var(--muted-foreground))` to a darker, high-contrast color.

```css
/* FROM */
.fmcsa-terminal-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: hsl(var(--muted-foreground));
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
}

/* TO */
.fmcsa-terminal-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: hsl(220 15% 30%); /* Darker gray for light mode - high contrast */
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
}
```

### File: `src/components/vetting/CarrierSearch.tsx`

**2. Update toggle button styling (lines 140-199):**

Increase contrast for inactive buttons in light mode by using `text-slate-700` instead of `text-slate-600` and `border-slate-400` instead of `border-slate-300`.

| Current | New |
|---------|-----|
| `text-slate-600` (inactive) | `text-slate-700` |
| `border-slate-300` (inactive) | `border-slate-400` |
| `hover:text-slate-900` | Keep as-is |
| `text-slate-900` (active) | Keep as-is |

The specific changes for each button's inactive state:

```tsx
// FROM (for all three buttons)
: 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-300 dark:border-white/20'

// TO
: 'text-slate-700 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-400 dark:border-white/20'
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Update `.fmcsa-terminal-title` light mode color to `hsl(220 15% 30%)` |
| `src/components/vetting/CarrierSearch.tsx` | Change inactive button `text-slate-600` → `text-slate-700` and `border-slate-300` → `border-slate-400` (3 buttons) |

## Result

- The "SAFER DATABASE QUERY" title will be clearly visible with high contrast in light mode
- The Name, DOT, and MC toggle buttons will have darker text and borders for better visibility
- Dark mode remains unchanged
- Active button state (green border + glow) remains the same
