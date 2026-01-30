
# Add Subtle Hover Scale Effect to Navigation Links

## Goal

Add a subtle scale transform on hover to the navigation header links for a more interactive, premium feel.

---

## Current Implementation

The `.header-nav-link` hover state (lines 11248-11254) currently has:
- Color change to full opacity
- Box-shadow glow effect
- Transition of `all 200ms ease`

The base `.header-nav-link` (line 11241) already has `transition: all 200ms ease` which will handle the scale animation.

---

## Implementation

### File: `src/index.css`

#### Change: Add scale transform to hover state (lines 11248-11254)

```css
/* Before */
.header-nav-link:hover {
  color: hsl(var(--tm-ink));
  background: transparent;
  box-shadow: 
    0 0 12px hsl(var(--primary) / 0.35),
    0 0 24px hsl(var(--primary) / 0.15);
}

/* After */
.header-nav-link:hover {
  color: hsl(var(--tm-ink));
  background: transparent;
  box-shadow: 
    0 0 12px hsl(var(--primary) / 0.35),
    0 0 24px hsl(var(--primary) / 0.15);
  transform: scale(1.05);
}
```

#### Change: Add scale transform to dark mode hover state (lines 11256-11262)

```css
/* Before */
.dark .header-nav-link:hover {
  color: hsl(var(--foreground));
  background: transparent;
  box-shadow: 
    0 0 12px hsl(var(--primary) / 0.4),
    0 0 24px hsl(var(--primary) / 0.2);
}

/* After */
.dark .header-nav-link:hover {
  color: hsl(var(--foreground));
  background: transparent;
  box-shadow: 
    0 0 12px hsl(var(--primary) / 0.4),
    0 0 24px hsl(var(--primary) / 0.2);
  transform: scale(1.05);
}
```

---

## Summary of Changes

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 11248-11254 | Add `transform: scale(1.05)` to light mode hover |
| `src/index.css` | 11256-11262 | Add `transform: scale(1.05)` to dark mode hover |

---

## Expected Result

- Navigation links will subtly scale up by 5% on hover
- Combined with the existing glow effect, creates a premium, interactive feel
- The existing `transition: all 200ms ease` ensures smooth animation
- Works in both light and dark modes
