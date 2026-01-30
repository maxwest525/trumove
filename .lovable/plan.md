

# Reduce Navigation Link Padding

## Goal

Tighten the padding around navigation link text for a more compact, refined appearance.

---

## Implementation

### File: `src/index.css`

#### Change 1: Reduce base nav link padding (line 11234)

```css
/* Before */
padding: 10px 16px;

/* After */
padding: 6px 12px;
```

#### Change 2: Reduce active state padding (line 11273)

```css
/* Before */
padding: 10px 16px;

/* After */
padding: 6px 12px;
```

---

## Summary of Changes

| File | Line | Change |
|------|------|--------|
| `src/index.css` | 11234 | Reduce base padding from `10px 16px` to `6px 12px` |
| `src/index.css` | 11273 | Reduce active padding from `10px 16px` to `6px 12px` |

---

## Expected Result

- Navigation links will have tighter padding around the text (6px vertical, 12px horizontal)
- The green glow effect and dark active state will remain unchanged
- Links will appear more compact while maintaining the pill shape

