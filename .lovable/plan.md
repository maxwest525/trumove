

# Remove Green Accent Bar from Quote Form Header

## Overview
Remove the 3px green gradient accent bar from the homepage quote form header in both light and dark modes, as the progress bar provides sufficient visual hierarchy.

---

## Change

### File: `src/index.css`

**Lines 4320-4329 - Remove the `::before` pseudo-element:**

```css
/* REMOVE this entire block */
.tru-qb-form-header.tru-qb-form-header-pill::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, hsl(142 76% 50%) 0%, hsl(160 80% 45%) 100%);
  border-radius: 16px 16px 0 0;
}
```

---

## Visual Result

| Mode | Before | After |
|------|--------|-------|
| Light | Gray pill + green bar at top | Gray pill only |
| Dark | Dark pill + green bar at top | Dark pill only |

The header will retain:
- Gray pill background (light mode) / dark background (dark mode)
- Black text "A SMARTER WAY TO" with green "MOVE"
- Subheader "Carriers vetted against FMCSA safety records"
- Just no green accent bar at the top

