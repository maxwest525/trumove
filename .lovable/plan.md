
# Plan: Make Carrier Vetting Page Theme-Aware (Light/Dark Mode Support)

## Problem

The Carrier Vetting page (`/carrier-vetting`) is currently hardcoded to always display in dark mode, regardless of the user's theme preference. This is inconsistent with other pages like Live Tracking which properly respect the light/dark theme toggle.

The root cause:
1. The page container has `bg-slate-950 carrier-vetting-dark` hardcoded in `CarrierVetting.tsx`
2. The CSS has a `.carrier-vetting-dark` class that forces dark colors via `!important` overrides
3. The FMCSA terminal and header components use hardcoded dark HSL values

---

## Solution Overview

Transform the Carrier Vetting page to be theme-aware by:
1. Replacing the forced dark container with a themed container class
2. Converting hardcoded dark colors to CSS variable-based theming
3. Adding `.dark` prefixed rules for dark mode-specific overrides
4. Keeping the "government terminal" aesthetic in both modes

---

## Implementation Steps

### Step 1: Update CarrierVetting.tsx Container

**File**: `src/pages/CarrierVetting.tsx`

Replace the hardcoded dark background:
```tsx
// Before
<div className="min-h-screen bg-slate-950 carrier-vetting-dark">

// After  
<div className="min-h-screen carrier-vetting-page">
```

This removes the forced `bg-slate-950` and `carrier-vetting-dark` class.

---

### Step 2: Create Theme-Aware CSS Classes

**File**: `src/index.css`

Replace the forced dark theme CSS with theme-aware styles:

**Light Mode Base Styles:**
```css
.carrier-vetting-page {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
}

.fmcsa-header {
  /* Light: Professional grey gradient */
  background: linear-gradient(135deg, hsl(220 15% 95%) 0%, hsl(220 15% 90%) 100%);
  border-bottom: 1px solid hsl(var(--border));
}

.fmcsa-terminal {
  /* Light: Clean white with subtle border */
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
}
```

**Dark Mode Overrides:**
```css
.dark .carrier-vetting-page {
  background: linear-gradient(180deg, hsl(222 47% 5%) 0%, hsl(222 47% 8%) 100%);
}

.dark .fmcsa-header {
  background: linear-gradient(135deg, hsl(222 47% 8%) 0%, hsl(222 50% 12%) 100%);
  border-bottom: 1px solid hsl(var(--primary) / 0.2);
}

.dark .fmcsa-terminal {
  background: hsl(222 47% 8%);
  border: 1px solid hsl(220 20% 20%);
}
```

---

### Step 3: Update Component Colors

Convert these components to be theme-aware:

| Component | Light Mode | Dark Mode |
|-----------|------------|-----------|
| `.fmcsa-header` | Grey gradient | Dark blue gradient |
| `.fmcsa-shield` | Green on light bg | Green on dark bg |
| `.fmcsa-badge` | Muted grey | Dark slate |
| `.fmcsa-terminal` | White card | Dark terminal |
| `.fmcsa-terminal input` | Standard input | High-contrast dark input |
| `.carrier-snapshot-card` | Card colors | Dark gradient |

---

### Step 4: Remove Forced Dark Overrides

Remove or convert the `.carrier-vetting-dark` class rules that use `!important` to force dark colors:

```css
/* Remove these forced overrides */
.carrier-vetting-dark .text-foreground { color: var(--cv-text) !important; }
.carrier-vetting-dark .text-muted-foreground { color: var(--cv-muted) !important; }
/* ... etc */

/* Replace with proper .dark prefix rules */
.dark .carrier-vetting-page .text-foreground { ... }
```

---

## Visual Result

| Mode | Appearance |
|------|------------|
| **Light** | Clean professional look with white/grey backgrounds, dark text, green accents |
| **Dark** | Government terminal aesthetic with dark backgrounds, light text, green accents |

Both modes maintain the "official FMCSA data tool" feel while respecting user preference.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/CarrierVetting.tsx` | Replace container class |
| `src/index.css` | Convert ~150 lines of forced dark CSS to theme-aware CSS with `.dark` prefixes |

---

## Technical Notes

- The terminal dots (red/yellow/green) remain the same in both modes for visual interest
- The FMCSA logo in the terminal header will need `brightness(0)` in light mode and `brightness(0) invert(1)` in dark mode
- All `!important` overrides from `.carrier-vetting-dark` will be removed in favor of proper cascade with `.dark` prefix
