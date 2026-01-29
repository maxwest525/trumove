
# Fix Route Summary Box Width + Match Build Your Move Header Colors

## Summary
Two targeted fixes:
1. Add missing `width: calc(100% + 56px)` to make the Origin/Mileage/Destination box span full form width
2. Ensure "Build Your Virtual Inventory" header matches "Move Summary" header colors exactly in both light and dark modes

---

## Fix 1: Route Summary Box Width

**Problem:** The route summary box has negative margins but no explicit width, so it stays at 464px instead of expanding to the full 520px form width.

**File:** `src/index.css`  
**Location:** Lines 24419-24429

| Property | Current Value | New Value |
|----------|---------------|-----------|
| `width` | Not set | `calc(100% + 56px)` |

**Change:**
```css
.tru-qb-route-summary-permanent {
  margin-top: 20px;
  margin-bottom: 12px;
  margin-left: -28px;
  margin-right: -28px;
  width: calc(100% + 56px);  /* ADD THIS LINE */
  padding: 12px 20px;
  background: hsl(var(--muted) / 0.25);
  border-radius: 14px;
  border: 1px solid hsl(var(--border) / 0.5);
  animation: route-summary-entrance 0.5s ease-out;
}
```

---

## Fix 2: Match Header Colors

**Current State:** Both headers use `.tru-summary-header-large` class and `.tru-qb-title-accent` for accent text. CSS already exists at lines 26393-26408 but may need reinforcement.

**File:** `src/index.css`  
**Location:** Lines 26393-26409

**Ensure these styles are applied with proper specificity:**

```css
/* Build Your Move header - match Move Summary styling exactly */
.tru-summary-header-large h3,
.tru-summary-header-large .text-lg {
  font-size: 18px !important;
  font-weight: 800 !important;
  color: hsl(var(--foreground)) !important;
}

/* Dark mode: White text for header */
.dark .tru-summary-header-large h3,
.dark .tru-summary-header-large .text-lg {
  color: hsl(0 0% 100%) !important;
}

/* Dark mode: Consistent dark background */
.dark .tru-summary-header-large {
  background: hsl(220 15% 10%) !important;
  border-color: hsl(0 0% 100% / 0.1) !important;
}

/* Ensure accent gradient is visible in both modes */
.tru-summary-header-large .tru-qb-title-accent {
  background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(160 80% 45%) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Add `width: calc(100% + 56px)` to `.tru-qb-route-summary-permanent` at line ~24424 |
| `src/index.css` | Add `.tru-summary-header-large .tru-qb-title-accent` rule to ensure gradient accent is consistent |

---

## Visual Comparison After Fix

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Header background | Light gray `hsl(220 15% 96%)` | Dark `hsl(220 15% 10%)` |
| Header text | Black `hsl(var(--foreground))` | White `hsl(0 0% 100%)` |
| Accent word | Green gradient | Green gradient (same) |
| Route box width | Full 520px form width | Full 520px form width |

---

## Verification Steps

1. Navigate to homepage, enter origin/destination to trigger route summary box
2. Verify box spans edge-to-edge within the form (full 520px width)
3. Navigate to `/online-estimate`
4. Toggle dark mode
5. Verify "Build Your Virtual Inventory" header matches "Move Summary" header:
   - Same font size (18px)
   - Same font weight (800/extra-bold)
   - Same text color (white in dark mode)
   - Same background color (dark in dark mode)
   - Same green gradient on accent word
