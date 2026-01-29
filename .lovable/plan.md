
# Plan: Fix Black Stats Strip Layout

## Issues Identified

Based on browser testing, the black stats strip on the homepage has these problems:

1. **Multi-line wrapping** - Stats wrap to multiple rows on narrower viewports
2. **Strip is too thick** - Padding of 12px creates unnecessary height
3. **Icon position** - Icons need to stay inline to the LEFT of text (currently working, but the wrap is causing visual confusion)

## Current CSS State

**File:** `src/index.css` (lines 27132-27169)

```css
.stats-strip {
  padding: 12px 24px;  /* Too thick */
}

.stats-strip-inner {
  flex-wrap: wrap;     /* Allows multi-line wrapping */
  gap: 8px;
}

.stats-strip-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}
```

## Solution

### File: `src/index.css`

Update the stats strip CSS to:
1. Reduce vertical padding (8px → 6px for thinner strip)
2. Prevent line wrapping with `flex-wrap: nowrap` and `overflow: hidden`
3. Add `white-space: nowrap` to each item
4. Reduce font size slightly to fit all items on one line
5. Keep icons inline with smaller gap

**Changes at lines 27132-27169:**

```css
/* ========================================
   BLACK STATS SECTION DIVIDER
   ======================================== */
.stats-strip {
  background: linear-gradient(to bottom, hsl(220 15% 6%), hsl(220 15% 4%));
  border-top: 1px solid hsl(0 0% 100% / 0.08);
  border-bottom: 1px solid hsl(0 0% 100% / 0.08);
  padding: 6px 16px;  /* Thinner padding */
  overflow: hidden;   /* Prevent overflow */
}

.stats-strip-inner {
  max-width: 1480px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;  /* PREVENT wrapping */
  gap: 4px;           /* Tighter gap */
  overflow: hidden;
}

.stats-strip-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;              /* Tighter icon-text gap */
  font-size: 10px;       /* Slightly smaller font */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: hsl(0 0% 100% / 0.85);
  white-space: nowrap;   /* Prevent text wrapping */
  flex-shrink: 0;        /* Don't shrink items */
}

.stats-strip-item svg {
  width: 12px;           /* Slightly smaller icons */
  height: 12px;
  color: hsl(142 70% 50%);
  flex-shrink: 0;        /* Icons don't shrink */
}

.stats-strip-dot {
  color: hsl(0 0% 100% / 0.3);
  margin: 0 4px;         /* Tighter dot spacing */
}
```

---

## Visual Result

**Before:**
```text
┌───────────────────────────────────────────────────────────────┐
│  📍 SERVING 48 STATES • 📈 50,000+ MOVES • 📞 24/7 SUPPORT    │
│  ⭐ 4.9★ CUSTOMER RATING • 🛡 LICENSED & INSURED • 🏆 A+...   │  <- Wrapping
└───────────────────────────────────────────────────────────────┘
```

**After:**
```text
┌───────────────────────────────────────────────────────────────┐
│ 📍 SERVING 48 STATES • 📈 50K+ MOVES • 📞 24/7 • ⭐ 4.9★ • 🛡 LICENSED • 🏆 A+ │  <- Single line, thinner
└───────────────────────────────────────────────────────────────┘
```

---

## Additional Verification Results

| Page | Grey SAFER Trust Strip | Dark Mode Contrast |
|------|------------------------|-------------------|
| `/online-estimate` | ✅ Visible | ✅ Good |
| `/vetting` | ✅ Visible | ✅ Good |
| `/track` | ✅ Visible | ✅ Good |
| Homepage | N/A (uses black strip) | ✅ Good |

---

## Files Changed

| File | Change |
|------|--------|
| `src/index.css` | Update `.stats-strip`, `.stats-strip-inner`, `.stats-strip-item` CSS rules |

---

## Testing Checklist

1. Navigate to homepage and scroll to the black stats strip
2. Verify all 6 stats appear on a single line
3. Verify the strip is thinner (reduced padding)
4. Verify icons appear to the LEFT of each stat text
5. Verify the strip works in dark mode
6. Test on narrower viewport (1366px) to ensure no wrapping
7. Navigate to /online-estimate, /vetting, /track and verify grey SAFER trust strip is visible
8. Toggle dark mode on each page to verify contrast
