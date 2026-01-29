
# Plan: Fix EstimateWizard "Build Your Move" Header Dark Mode

## Issue Identified

Looking at your screenshots, the "Build Your Move" header in the EstimateWizard (left form panel on /online-estimate) is NOT getting the dark background in dark mode, while "Move Summary" (right panel) IS working correctly.

| Component | CSS Class | Dark Mode |
|-----------|-----------|-----------|
| EstimateWizard header | `.tru-qb-form-header.tru-qb-form-header-pill` | Missing dark mode rule |
| Move Summary header | `.tru-summary-header-large` | Has dark mode: `hsl(220 15% 8%)` |

The `.tru-qb-form-header.tru-qb-form-header-pill` class has this base styling:
```css
background: hsl(220 15% 96%);  /* Light gray */
```

But there's NO corresponding dark mode rule to change it to the dark near-black background.

---

## Solution

Add dark mode styling for the EstimateWizard form header to match the Move Summary styling exactly.

**File:** `src/index.css`

Add after line 3624 (after the base `.tru-qb-form-header.tru-qb-form-header-pill` rule):

```css
/* Dark mode - match Move Summary header styling */
.dark .tru-qb-form-header.tru-qb-form-header-pill {
  background: hsl(220 15% 8%) !important;
  border-bottom-color: hsl(0 0% 100% / 0.1) !important;
}

.dark .tru-qb-form-header-pill .tru-qb-form-title,
.dark .tru-qb-form-header-pill .tru-qb-form-title.tru-qb-form-title-large {
  color: hsl(0 0% 100%) !important;
}

.dark .tru-qb-form-header-pill .tru-qb-form-subtitle-compact {
  color: hsl(0 0% 100% / 0.5) !important;
}
```

This ensures:
1. Dark near-black background (`hsl(220 15% 8%)`) matching Move Summary
2. White title text
3. Muted white subtitle text
4. Subtle border for separation

---

## Visual Result After Fix

| Header | Background in Dark Mode |
|--------|------------------------|
| "Build Your Move" (wizard) | `hsl(220 15% 8%)` - dark near-black |
| "Move Summary" | `hsl(220 15% 8%)` - dark near-black |

Both will now have identical dark mode styling.

---

## Files Changed

| File | Change |
|------|--------|
| `src/index.css` | Add dark mode rule for `.tru-qb-form-header.tru-qb-form-header-pill` |

---

## Testing Checklist

After implementation:
1. Navigate to /online-estimate in dark mode
2. Verify "Build Your Move" header (left panel) has dark near-black background matching "Move Summary" (right panel)
3. Verify green gradient accent on "move" text is visible
4. Verify subtitle "Carriers vetted against FMCSA safety records" is visible (muted white)
5. Test light mode to ensure light gray background still works
