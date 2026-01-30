

# Move Stats Strip and Adjust Spacing

## Overview
Move the black stats strip from its current position (after AI Inventory Analysis) to between the hero and the AI Inventory Analysis section, and adjust the spacing between items for better visual balance.

---

## Current Layout Order

1. Hero Section (ends at line 1541)
2. AI Inventory Analysis Section (lines 1544-1623)
3. **StatsStrip** (currently here - lines 1625-1626)
4. Consult Section

## New Layout Order

1. Hero Section
2. **StatsStrip** (moving here)
3. AI Inventory Analysis Section
4. Consult Section

---

## Changes Required

### File: `src/pages/Index.tsx`

**1. Remove StatsStrip from current position (lines 1625-1626):**

Delete these lines:
```tsx
{/* BLACK STATS STRIP - Section Divider */}
<StatsStrip />
```

**2. Add StatsStrip between hero and AI section (after line 1541):**

Insert after the hero wrapper closing tag:
```tsx
      </div> {/* End tru-hero-wrapper */}

      {/* BLACK STATS STRIP - Section Divider */}
      <StatsStrip />

      {/* START YOUR AI INVENTORY ANALYSIS - Enhanced with Preview */}
```

---

### File: `src/index.css`

**Adjust spacing between stats strip items (line 28621):**

Change gap from 16px to 28px for better visual separation:

Current:
```css
.stats-strip-inner {
  gap: 16px;
}
```

Updated:
```css
.stats-strip-inner {
  gap: 28px;
}
```

---

## Summary

| File | Line(s) | Change |
|------|---------|--------|
| `src/pages/Index.tsx` | 1541 | Add `<StatsStrip />` after hero wrapper closing div |
| `src/pages/Index.tsx` | 1625-1626 | Remove `<StatsStrip />` from after AI section |
| `src/index.css` | 28621 | Change gap from `16px` to `28px` |

The stats strip will now appear as a visual divider between the hero and the AI Inventory Analysis section, with wider spacing between items for improved readability.

