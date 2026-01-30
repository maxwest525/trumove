

# Fix Stats Strip Layout

## Overview
Update the black stats strip to remove the dot separators between items and ensure icons appear to the left of their corresponding text (not above).

---

## Current Issue
Looking at the screenshot, the icons appear stacked above the text, and there are dot separators between items. The user wants:
1. Remove the dots (`•`) between items
2. Icons positioned to the left of the text in a horizontal layout

---

## Changes Required

### File: `src/components/StatsStrip.tsx`

Remove the dot separator spans from the component:

**Before (lines 16-23):**
```tsx
{STATS.map((stat, idx) => (
  <div key={stat.text} className="stats-strip-item">
    <stat.icon className="w-4 h-4" />
    <span>{stat.text}</span>
    {idx < STATS.length - 1 && (
      <span className="stats-strip-dot">•</span>
    )}
  </div>
))}
```

**After:**
```tsx
{STATS.map((stat) => (
  <div key={stat.text} className="stats-strip-item">
    <stat.icon className="w-4 h-4" />
    <span>{stat.text}</span>
  </div>
))}
```

---

### File: `src/index.css`

Ensure the `.stats-strip-item` uses horizontal flex layout (icons left of text):

**Lines 28633-28644 - Confirm/update flex direction:**
```css
.stats-strip-item {
  display: inline-flex;
  flex-direction: row;  /* Explicit row direction */
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: hsl(0 0% 100% / 0.85);
  white-space: nowrap;
  flex-shrink: 0;
}
```

Optionally remove the `.stats-strip-dot` class (lines 28653-28656) since it will no longer be used.

---

## Visual Result

**Before:**
```
   📍            📈            🎧
SERVING    50,000+ MOVES  •  24/7 SUPPORT  •  ...
48 STATES     COMPLETED
```

**After:**
```
📍 SERVING 48 STATES   📈 50,000+ MOVES COMPLETED   🎧 24/7 SUPPORT   ...
```

---

## Summary

| File | Change |
|------|--------|
| `src/components/StatsStrip.tsx` | Remove dot separator spans (`{idx < STATS.length - 1 && ...}`) |
| `src/index.css` | Add explicit `flex-direction: row` to `.stats-strip-item` |
| `src/index.css` | Optionally remove unused `.stats-strip-dot` styles |

