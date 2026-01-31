

# Match Header Trust Strip to Stats Strip Style

## Overview
Update the SaferTrustStrip (header) to match the styling of the StatsStrip (bottom of page) - black background, larger sizing, white text, and green icons.

---

## Current vs Target

| Property | SaferTrustStrip (Current) | StatsStrip (Target) |
|----------|---------------------------|---------------------|
| Background | Grey gradient | Black gradient |
| Font size | 10px | 12px |
| Icon size | 12px (w-3.5) | 16px (w-4) |
| Text color | Grey | White (0.85 opacity) |
| Icon color | Green | Green (brighter) |
| Padding | 8px 24px | 8px 24px |
| Gap | 48px | 28px |

---

## Technical Changes

### File: `src/components/SaferTrustStrip.tsx`

Update icon size from `w-3.5 h-3.5` to `w-4 h-4` to match StatsStrip:

```tsx
<item.icon className="w-4 h-4" />  // Was w-3.5 h-3.5
```

### File: `src/index.css` (Lines 29108-29168)

**Update `.safer-trust-strip` background to black:**

```css
.safer-trust-strip {
  background: linear-gradient(to bottom, hsl(220 15% 6%), hsl(220 15% 4%));
  border-bottom: 1px solid hsl(0 0% 100% / 0.08);
  padding: 8px 24px;
  overflow-x: auto;
  margin-top: 0; /* Remove gap from header */
}
```

**Update `.safer-trust-strip-inner` gap:**

```css
.safer-trust-strip-inner {
  gap: 28px; /* Match StatsStrip */
}
```

**Update `.safer-trust-item` to white text and larger font:**

```css
.safer-trust-item {
  font-size: 12px;
  color: hsl(0 0% 100% / 0.85);
}
```

**Update `.safer-trust-item svg` to larger icons:**

```css
.safer-trust-item svg {
  width: 16px;
  height: 16px;
  color: hsl(142 70% 50%);
}
```

**Update special emphasis for last item:**

```css
.safer-trust-item:last-child {
  font-weight: 800;
  color: hsl(142 70% 55%);
}
```

**Update dot separator color:**

```css
.safer-trust-dot {
  color: hsl(0 0% 100% / 0.4);
}
```

**Remove dark mode overrides** (no longer needed since base styling is already dark):

Remove or simplify the `.dark .safer-trust-strip` rules since the strip will now always be dark.

---

## Summary

| Element | Before | After |
|---------|--------|-------|
| Background | Grey gradient | Black gradient |
| Text color | Grey (#35) | White (85% opacity) |
| Font size | 10px | 12px |
| Icon size | 12px | 16px |
| Icon color | Green 40% | Green 50% (brighter) |
| Gap | 48px | 28px |

---

## Files Modified
- `src/components/SaferTrustStrip.tsx` - Update icon size class
- `src/index.css` - Update SaferTrustStrip styling to match StatsStrip

