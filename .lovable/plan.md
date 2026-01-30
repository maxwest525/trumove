

# Spread Out Trust Strip Items

## Goal

Increase the spacing between items on the trust strip for a more open, breathable layout.

---

## Implementation

### File: `src/index.css`

#### Change: Increase gap between items (line 28657)

```css
/* Before */
gap: 16px;

/* After */
gap: 32px;
```

---

## Summary of Changes

| File | Line | Change |
|------|------|--------|
| `src/index.css` | 28657 | Increase gap from `16px` to `32px` |

---

## Expected Result

- Trust strip items will have double the spacing between them (32px instead of 16px)
- The strip will feel more open and less crowded
- Items will remain centered and horizontally scrollable on smaller screens

