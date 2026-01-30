

# Make Navigation Bar Taller and Add Space Before Trust Strip

## Goal

1. Increase the navigation bar height for a more spacious feel
2. Add vertical separation between the header and the trust strip so they don't touch

---

## Implementation

### File: `src/index.css`

#### Change 1: Increase header height (line 11203)

```css
/* Before */
height: 56px;

/* After */
height: 64px;
```

#### Change 2: Add margin-top to trust strip (line 28645-28650)

```css
/* Before */
.safer-trust-strip {
  background: linear-gradient(to bottom, hsl(220 10% 94%), hsl(220 10% 96%));
  border-bottom: 1px solid hsl(220 10% 88%);
  padding: 8px 24px;
  overflow-x: auto;
}

/* After */
.safer-trust-strip {
  background: linear-gradient(to bottom, hsl(220 10% 94%), hsl(220 10% 96%));
  border-bottom: 1px solid hsl(220 10% 88%);
  padding: 8px 24px;
  overflow-x: auto;
  margin-top: 12px;
}
```

---

## Summary of Changes

| File | Line(s) | Change |
|------|---------|--------|
| `src/index.css` | 11203 | Increase header height from `56px` to `64px` |
| `src/index.css` | 28645-28650 | Add `margin-top: 12px` to trust strip for visual separation |

---

## Expected Result

- Navigation bar will be 8px taller (64px total) for a more spacious appearance
- Trust strip will have 12px of space below the header, creating clear visual separation
- Both elements remain sticky together when scrolling

