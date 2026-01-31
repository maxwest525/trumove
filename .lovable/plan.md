
# Add Black Stroke on Hover to Why TruMove Card and Hero Quote Wizard

## Overview
Add a consistent black stroke border effect on hover to both the "Why TruMove" card and the hero quote wizard form card for a cohesive interactive design.

---

## Changes Required

### 1. Add Hover Stroke to Why TruMove Card
**File: `src/index.css` (After line 5420)**

Add hover state after the existing `.tru-why-trumove-card` styles:

```css
.tru-why-trumove-card:hover {
  border-color: hsl(var(--tm-ink));
}
```

Also update the base border to be visible for smooth transition:

| Property | Before | After |
|----------|--------|-------|
| border | `1px solid hsl(var(--tm-ink) / 0.1)` | `1px solid hsl(var(--tm-ink) / 0.15)` |
| transition | (none) | `border-color 0.2s ease` |

---

### 2. Add Matching Stroke to Hero Quote Wizard
**File: `src/index.css` (Update `.tru-floating-form-card` around line 4300)**

Update base styles and add hover state:

| Property | Before | After |
|----------|--------|-------|
| border | `1px solid hsl(var(--tm-ink) / 0.08)` | `1px solid hsl(var(--tm-ink) / 0.15)` |
| transition | `height 0.3s ease` | `height 0.3s ease, border-color 0.2s ease` |

Add hover state:
```css
.tru-floating-form-card:hover {
  border-color: hsl(var(--tm-ink));
}
```

---

## Technical Summary

```text
┌─────────────────────────────────────────────────────────┐
│  Card State        │  Border Color                      │
├────────────────────┼────────────────────────────────────┤
│  Default           │  hsl(var(--tm-ink) / 0.15)         │
│  Hover             │  hsl(var(--tm-ink)) (solid black)  │
└─────────────────────────────────────────────────────────┘
```

### Files Modified
- `src/index.css` - Update both card classes with matching border and hover styles
