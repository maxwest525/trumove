

# Make Navigation Bar Text Smaller and Less Bold

## Goal

Reduce the visual weight of navigation links for a more refined, elegant header.

---

## Current Values

```css
.header-nav-link {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.header-nav-link.is-active {
  font-weight: 700;
}
```

---

## New Values

```css
.header-nav-link {
  font-size: 14px;        /* Reduced from 16px */
  font-weight: 500;       /* Reduced from 600 */
  letter-spacing: 0.02em;
}

.header-nav-link.is-active {
  font-weight: 600;       /* Reduced from 700 */
}
```

---

## Summary of Changes

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 11251-11252 | Change `font-size: 16px` → `14px` and `font-weight: 600` → `500` |
| `src/index.css` | 11287 | Change active state `font-weight: 700` → `600` |

---

## Expected Result

- Navigation text is smaller (14px vs 16px)
- Text appears lighter/less bold (500 vs 600)
- Active state remains slightly bolder than inactive (600 vs 500)
- Overall header feels more refined and less heavy

