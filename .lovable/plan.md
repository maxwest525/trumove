
# Increase Carousel Hover Scale

## Change

Increase the carousel card hover scale from `1.15x` to `1.22x` for a more noticeable pop-out effect while remaining within container boundaries.

---

## Implementation

### File: `src/index.css`

**Line 16677**: Update hover transform scale
```css
/* Before */
transform: scale(1.15) translateZ(0);

/* After */
transform: scale(1.22) translateZ(0);
```

**Line 16692**: Update active state transform to match
```css
/* Before */
transform: scale(1.15) translateZ(0);

/* After */
transform: scale(1.22) translateZ(0);
```

---

## Summary

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 16677 | Change hover scale from `1.15` to `1.22` |
| `src/index.css` | 16692 | Change active scale from `1.15` to `1.22` |

---

## Expected Result

- Hovered cards will have a more pronounced enlargement effect (22% larger)
- Cards remain contained within the carousel boundaries
- Active/pressed state matches the hover scale for consistency
