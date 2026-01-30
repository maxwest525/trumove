
# Update Homepage Hero Quote Wizard Header

## Overview
Update the hero quote form header to have:
1. Gray pill background (`hsl(220 15% 93%)`) with green accent bar
2. Black text for "A SMARTER WAY TO"
3. Green gradient on "MOVE"
4. Subheader: "Carriers vetted against FMCSA safety records"

---

## Technical Details

### File: `src/pages/Index.tsx`

**Lines 1026-1031 - Replace the current header structure:**

```tsx
// From
<div className="tru-qb-form-header tru-qb-form-header-clean">
  <div className="tru-qb-form-header-brand">
    <img src={logoImg} alt="TruMove" className="tru-qb-header-logo-clean" />
    <span className="tru-qb-header-tagline">A SMARTER WAY TO MOVE</span>
  </div>
</div>

// To
<div className="tru-qb-form-header tru-qb-form-header-pill">
  <div className="tru-qb-form-title-group">
    <span className="tru-qb-form-title tru-qb-form-title-large">
      A SMARTER WAY TO <span className="tru-qb-title-accent">MOVE</span>
    </span>
    <span className="tru-qb-form-subtitle-compact">
      Carriers vetted against FMCSA safety records
    </span>
  </div>
</div>
```

---

## What This Uses

The existing CSS classes already provide:

| Class | Effect |
|-------|--------|
| `.tru-qb-form-header-pill` | Gray background `hsl(220 15% 93%)` + 3px green gradient accent bar at top |
| `.tru-qb-form-title-large` | 24px, font-weight 800, dark text |
| `.tru-qb-title-accent` | Green gradient text (for "MOVE") |
| `.tru-qb-form-subtitle-compact` | 9px muted subheader text |

---

## Visual Result

| Element | Before | After |
|---------|--------|-------|
| Background | Transparent | Gray pill with green top bar |
| Main text | Logo + tagline | "A SMARTER WAY TO MOVE" (black) |
| "MOVE" | Plain text | Green gradient accent |
| Subheader | None | "Carriers vetted against FMCSA safety records" |
| Logo | Visible | Removed (text-only header) |
