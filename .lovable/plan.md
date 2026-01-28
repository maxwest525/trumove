
## Plan: Fix Tracking Page Layout Issues

### Problem Identified

Based on your screenshot, the tracking page is displaying incorrectly:
1. **Left sidebar missing** - The "Route Setup" form with Origin/Destination inputs is not visible
2. **Map height reduced** - The map appears squished/shorter than expected
3. The booking input field IS visible (in the Command Center header), so that's working

### Root Cause Analysis

After investigating the code, I found the issue is related to the **responsive CSS breakpoint**:

```css
@media (max-width: 1024px) {
  .tracking-content {
    grid-template-columns: 1fr;  /* Collapses to single column */
  }
}
```

When your browser viewport is narrower than 1024px, the three-column layout collapses to a single column. In this mode:
- The left sidebar gets `order: 1`
- The map gets `order: 2` 
- The right dashboard gets `order: 3`

So everything stacks vertically, requiring you to scroll down to see the left sidebar content.

### Solution

I recommend two fixes:

---

#### Fix 1: Adjust Mobile Breakpoint for Better Small-Screen Experience

Lower the single-column breakpoint from 1024px to 900px or 860px, so the three-column layout persists on more screen sizes:

**File: `src/index.css` (line ~23533)**

| Before | After |
|--------|-------|
| `@media (max-width: 1024px)` | `@media (max-width: 900px)` |

This allows screens between 900-1024px to keep the full three-column layout.

---

#### Fix 2: Ensure Map Container Uses Full Available Height

Add explicit height constraints to ensure the map fills the available vertical space:

**File: `src/index.css` (around tracking-content and tracking-map-container)**

```css
.tracking-content {
  flex: 1;
  display: grid;
  grid-template-columns: 480px minmax(180px, 1fr) 480px;
  gap: 12px;
  padding: 12px;
  overflow: auto;
  min-height: 0;
  height: 100%;  /* ADD THIS */
}

.tracking-map-container {
  min-height: 400px;  /* Increase from 300px */
  height: 100%;       /* ADD THIS */
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid hsl(var(--border));
}
```

---

#### Fix 3: Add Sidebar Width Constraints for Edge Cases

Ensure sidebars don't get squeezed out on edge-case viewport widths:

**File: `src/index.css`**

```css
.tracking-sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  min-width: 280px;  /* ADD - prevents sidebar from collapsing */
}

.tracking-dashboard {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  min-width: 280px;  /* ADD - prevents dashboard from collapsing */
}
```

---

### Summary of Changes

| File | Line(s) | Change |
|------|---------|--------|
| `src/index.css` | ~23533 | Change breakpoint from `1024px` to `900px` |
| `src/index.css` | ~23502-23510 | Add `height: 100%` to `.tracking-content` |
| `src/index.css` | ~23571-23577 | Increase `min-height` to `400px` and add `height: 100%` to `.tracking-map-container` |
| `src/index.css` | ~23563-23568 | Add `min-width: 280px` to `.tracking-sidebar` |
| `src/index.css` | ~23642-23647 | Add `min-width: 280px` to `.tracking-dashboard` |

---

### Expected Result

After these changes:
- **Wider viewport support**: Three-column layout will persist until screens are narrower than 900px
- **Consistent map height**: Map will properly fill available vertical space
- **Sidebar protection**: Left and right sidebars won't get squeezed out unexpectedly

---

### Quick Workaround (If You Want to Test Now)

If you'd like to immediately test if this is the issue:
1. Widen your browser window to be at least 1024px wide
2. The three-column layout should appear with the left sidebar visible
