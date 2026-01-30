

# Align Black Trust Strip Styling with Grey SAFER Trust Strip

## Overview
Update the black trust strip (TrustStrip component) to match the exact styling of the grey SAFER trust strip - same icon sizes, font sizes, padding, and layout - just with different colors and content.

---

## Current Differences

| Property | Grey Strip | Black Strip |
|----------|------------|-------------|
| Font size | 12px | 11px |
| Icon size | 16px | 14px |
| Padding | 8px 24px | 6px 24px |

---

## Changes Required

### File: `src/index.css` (lines 28540-28587)

Update the black trust strip CSS to match the grey strip sizing:

```css
/* BEFORE */
.trust-strip {
  padding: 6px 24px;
}

.trust-strip-item {
  font-size: 11px;
}

.trust-strip-item svg {
  width: 14px;
  height: 14px;
}

/* AFTER */
.trust-strip {
  padding: 8px 24px;  /* Match grey strip */
}

.trust-strip-item {
  font-size: 12px;    /* Match grey strip */
}

.trust-strip-item svg {
  width: 16px;        /* Match grey strip */
  height: 16px;
}
```

---

## Summary

| Change | Effect |
|--------|--------|
| Increase padding from 6px to 8px | Matches grey strip vertical spacing |
| Increase font size from 11px to 12px | Matches grey strip text legibility |
| Increase icon size from 14px to 16px | Matches grey strip icon prominence |

The black strip will retain its dark background, light text, and gold/green accent colors - only the sizing will be unified with the grey strip.

