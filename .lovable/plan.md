

# Match Left Sidebar Width to Right Sidebar

## Current State

The `.tracking-content` grid has **asymmetrical** sidebar widths:

| Breakpoint | Left Sidebar | Map | Right Sidebar |
|------------|--------------|-----|---------------|
| Default (>1600px) | 320px | flex | **480px** |
| ≤1600px | 300px | flex | **440px** |
| ≤1400px | 280px | flex | **400px** |
| ≤1280px | 260px | flex | **360px** |

## Solution

Update the left sidebar to match the right sidebar at every breakpoint:

| Breakpoint | Left Sidebar | Map | Right Sidebar |
|------------|--------------|-----|---------------|
| Default (>1600px) | **480px** | flex | **480px** |
| ≤1600px | **440px** | flex | **440px** |
| ≤1400px | **400px** | flex | **400px** |
| ≤1280px | **360px** | flex | **360px** |

---

## Technical Changes

### File: `src/index.css` (lines 23404-23433)

Update `grid-template-columns` at each breakpoint:

```css
/* Base - symmetrical 480px sidebars */
.tracking-content {
  grid-template-columns: 480px minmax(180px, 1fr) 480px;
}

@media (max-width: 1600px) {
  .tracking-content {
    grid-template-columns: 440px minmax(160px, 1fr) 440px;
  }
}

@media (max-width: 1400px) {
  .tracking-content {
    grid-template-columns: 400px minmax(140px, 1fr) 400px;
  }
}

@media (max-width: 1280px) {
  .tracking-content {
    grid-template-columns: 360px 1fr 360px;
  }
}
```

---

## Summary

| File | Change |
|------|--------|
| `src/index.css` | Update left column widths to match right (480px/440px/400px/360px) |

## Expected Outcome

Both sidebars will have **identical widths**, creating a perfectly symmetrical dashboard with the map centered between them.

