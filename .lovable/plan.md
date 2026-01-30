

# Update Navigation Bar Hover and Active States

## Goal

Change the navigation bar link effects to match the reference button styles:
- **Hover**: Subtle green glow (soft green shadow) without changing background color
- **Active/Selected**: Dark/black background with a slight green glow around the pill

---

## Implementation

### File: `src/index.css`

#### Change 1: Update hover state (lines 11248-11256)

Replace the current hover styling with a subtle green glow effect:

**Current:**
```css
.header-nav-link:hover {
  color: hsl(var(--tm-ink));
  background: hsl(var(--primary) / 0.3);
}

.dark .header-nav-link:hover {
  color: hsl(var(--foreground));
  background: hsl(var(--primary) / 0.3);
}
```

**New:**
```css
.header-nav-link:hover {
  color: hsl(var(--tm-ink));
  background: transparent;
  box-shadow: 
    0 0 12px hsl(var(--primary) / 0.35),
    0 0 24px hsl(var(--primary) / 0.15);
}

.dark .header-nav-link:hover {
  color: hsl(var(--foreground));
  background: transparent;
  box-shadow: 
    0 0 12px hsl(var(--primary) / 0.4),
    0 0 24px hsl(var(--primary) / 0.2);
}
```

#### Change 2: Update active state (lines 11259-11272)

Replace the current active styling with dark background + green glow:

**Current:**
```css
.header-nav-link.is-active {
  color: hsl(var(--tm-ink));
  background: hsl(var(--primary) / 0.08);
  border: 2px solid hsl(var(--tm-ink) / 0.7);
  font-weight: 700;
  box-shadow: 0 1px 4px hsl(var(--tm-ink) / 0.08);
  padding: 6px 12px;
}

.dark .header-nav-link.is-active {
  color: hsl(var(--foreground));
  background: hsl(var(--primary) / 0.1);
  border: 2px solid hsl(var(--foreground) / 0.7);
}
```

**New:**
```css
.header-nav-link.is-active {
  color: hsl(0 0% 100%);
  background: hsl(220 15% 10%);
  border: none;
  font-weight: 700;
  box-shadow: 
    0 0 10px hsl(var(--primary) / 0.3),
    0 0 20px hsl(var(--primary) / 0.15);
  padding: 10px 16px;
}

.dark .header-nav-link.is-active {
  color: hsl(0 0% 100%);
  background: hsl(220 15% 8%);
  border: none;
  box-shadow: 
    0 0 12px hsl(var(--primary) / 0.35),
    0 0 24px hsl(var(--primary) / 0.2);
}
```

---

## Summary of Changes

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 11248-11256 | Update hover to use subtle green glow (box-shadow) instead of background fill |
| `src/index.css` | 11259-11272 | Update active state to dark background with green glow, white text |

---

## Expected Result

- **Hover**: Links get a soft green glow around them (no background change), matching the first reference image
- **Selected/Active**: Links have a dark/black pill background with white text and a subtle green glow around the edges, matching the second reference image
- Both light and dark modes will have consistent styling with the active state using a dark background

