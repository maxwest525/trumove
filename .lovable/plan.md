

# Reduce Trust Strip Text Size

## Goal

Make the trust strip text slightly smaller for a more refined, subtle appearance that doesn't compete with the main navigation.

---

## Implementation

### File: `src/index.css`

#### Change 1: Reduce font size (line 28668)

```css
/* Before */
font-size: 12px;

/* After */
font-size: 10px;
```

#### Change 2: Reduce icon size to match (lines 28676-28677)

```css
/* Before */
width: 16px;
height: 16px;

/* After */
width: 12px;
height: 12px;
```

---

## Summary of Changes

| File | Line(s) | Change |
|------|---------|--------|
| `src/index.css` | 28668 | Reduce font size from `12px` to `10px` |
| `src/index.css` | 28676-28677 | Reduce icon size from `16px` to `12px` to match |

---

## Expected Result

- Trust strip text will be 2px smaller (10px) for a more refined look
- Icons will scale proportionally to 12px to maintain visual balance
- The strip will feel more subtle and supportive rather than competing with the navigation

