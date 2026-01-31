
# Make Dark Mode Nav Links Fully White

## Current State

The dark mode navigation links use 70% opacity:

```css
.dark .header-nav-link {
  color: hsl(var(--foreground) / 0.7);
}
```

## Solution

Update the opacity to 1 (100%) for full white text in dark mode.

### File: `src/index.css`

**Update `.dark .header-nav-link` (Line 11463)**

Change from:
```css
.dark .header-nav-link {
  color: hsl(var(--foreground) / 0.7);
}
```

To:
```css
.dark .header-nav-link {
  color: hsl(var(--foreground));
}
```

## Summary

| Property | Before | After |
|----------|--------|-------|
| color opacity | 70% (`/ 0.7`) | 100% (full white) |

This ensures maximum contrast and readability for navigation links in dark mode.
