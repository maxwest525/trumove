

# Header Navigation Bar Updates

## Changes Requested

1. **Spread out nav bar links more** - Increase spacing between navigation items
2. **Make font black** - Ensure link text is solid black
3. **Remove dropdown arrow** - Hide the chevron icon on nav links with dropdowns

---

## Solution

### File: `src/index.css`

**1. Increase gap between nav items (Line 11422)**

Change from:
```css
.header-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
}
```

To:
```css
.header-nav {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-left: auto;
}
```

**2. Update divider position for larger gap (Line 11435)**

Change:
```css
right: -10px;
```

To:
```css
right: -16px;
```

**3. Make nav link font solid black (Line 11456)**

Change:
```css
color: hsl(var(--tm-ink));
```

To:
```css
color: hsl(0 0% 0%);
```

**4. Hide the dropdown chevron icon (Lines 11505-11512)**

Change:
```css
.header-nav-chevron {
  opacity: 0.5;
  transition: transform 200ms ease;
}

.header-nav-item:hover .header-nav-chevron {
  transform: rotate(180deg);
  opacity: 1;
}
```

To:
```css
.header-nav-chevron {
  display: none;
}

.header-nav-item:hover .header-nav-chevron {
  display: none;
}
```

---

## Summary

| Change | Before | After |
|--------|--------|-------|
| Nav gap | 20px | 32px |
| Divider position | -10px | -16px |
| Link color | `hsl(var(--tm-ink))` | `hsl(0 0% 0%)` (solid black) |
| Chevron visibility | Visible (opacity 0.5) | Hidden (display: none) |

This will create more breathing room between nav items, ensure text is solid black, and remove the dropdown arrows entirely.

