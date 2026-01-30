

# Add Subtle Separator Lines Between Header Nav Items

## Goal

Add elegant, subtle vertical divider lines between navigation items in the header for visual separation without overwhelming the clean design.

---

## Approach

Use a CSS pseudo-element (`::after`) on each nav item to create a thin vertical line between items, with appropriate styling to keep it subtle and elegant.

---

## Implementation Details

```css
/* Add subtle divider lines between nav items */
.header-nav-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -2px;
  top: 50%;
  transform: translateY(-50%);
  height: 16px;
  width: 1px;
  background: hsl(var(--tm-ink) / 0.15);
  pointer-events: none;
}

.dark .header-nav-item:not(:last-child)::after {
  background: hsl(var(--foreground) / 0.15);
}
```

---

## Summary of Changes

| File | Location | Change |
|------|----------|--------|
| `src/index.css` | After `.header-nav-item` (~line 11244) | Add `::after` pseudo-element for subtle vertical divider between nav items |

---

## Design Notes

- **Subtle opacity (15%)**: Visible but not distracting
- **Short height (16px)**: Doesn't span full nav height for elegance
- **Positioned with `::after`**: No extra HTML needed
- **Excluded from last item**: No trailing divider on the right
- **Dark mode support**: Adjusts to foreground color variable

---

## Expected Result

- Thin, subtle vertical lines appear between each navigation link
- Lines are centered vertically and shorter than the nav items
- Dividers respect both light and dark mode themes
- Clean, professional visual separation without clutter

