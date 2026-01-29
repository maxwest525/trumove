

# Fix Route Summary Box Width to Span Full Form

## The Problem

The Origin/Mileage/Destination box is not expanding to full form width because:

| Element | Current CSS | Issue |
|---------|-------------|-------|
| `.tru-floating-form-content` | `padding: 32px 28px 20px` | 28px horizontal padding |
| `.tru-floating-form-content` | `display: flex; align-items: center` | Centers children, constrains widths |
| `.tru-qb-route-summary-permanent` | `margin-left: -28px; margin-right: -28px` | Negative margins alone don't expand width |

Negative margins pull the box edges outward, but without an explicit width calculation, the box remains at its default 100% width of the parent's content area.

---

## The Fix

Add explicit width calculation to counteract the centered flex alignment:

```css
.tru-qb-route-summary-permanent {
  margin-top: 20px;
  margin-bottom: 12px;
  margin-left: -28px;
  margin-right: -28px;
  width: calc(100% + 56px);  /* ADD THIS - expands beyond 100% by 2x28px */
  padding: 12px 20px;
  background: hsl(var(--muted) / 0.25);
  border-radius: 14px;
  border: 1px solid hsl(var(--border) / 0.5);
  animation: route-summary-entrance 0.5s ease-out;
}
```

---

## Technical Details

| Measurement | Value |
|-------------|-------|
| Form content horizontal padding | 28px each side |
| Route summary negative margins | -28px each side |
| Required width calculation | `calc(100% + 56px)` |

The `width: calc(100% + 56px)` tells the browser: "Take 100% of the parent content width, then add 28px + 28px = 56px to fill into the padding areas."

---

## File Changes

| File | Change |
|------|--------|
| `src/index.css` | Add `width: calc(100% + 56px)` to `.tru-qb-route-summary-permanent` |

