
# Plan: Zoom-Resilient Layout System for TruMove Homepage

## Problem Analysis

When viewing the homepage at different browser zoom levels (67%, 80%, 100%, etc.), the layout appears inconsistent because many CSS values use fixed pixel measurements that don't scale proportionally with zoom. This creates gaps and misaligned elements at non-100% zoom levels.

### Current State
The codebase uses a mix of:
- **Responsive**: `clamp()` for font sizes, viewport units (`vw`, `vh`) for some dimensions
- **Fixed pixels**: `min-height: 380px`, `padding-right: 860px`, `width: 340px`, `top: 102px` for layout spacing

Fixed pixel values behave differently at various zoom levels because browser zoom affects `px` units but not the relationship between elements.

---

## Proposed Solution

Implement a **relative unit system** that gracefully adapts to different zoom levels by:

1. **Converting key layout spacings to `rem` units** - `rem` scales with the root font-size and behaves more predictably across zoom levels
2. **Using CSS custom properties for consistent spacing** - Define a spacing scale that can be adjusted centrally
3. **Applying `clamp()` to layout dimensions** - Not just fonts, but also gaps, paddings, and min-heights
4. **Replacing absolute positioning with flexible layouts** - Where possible, use flexbox/grid gap instead of fixed pixel offsets

---

## Implementation Steps

### Step 1: Create a Spacing Scale with CSS Custom Properties
Add root-level CSS variables for consistent, scalable spacing:

```css
:root {
  --spacing-xs: 0.5rem;   /* 8px at default */
  --spacing-sm: 0.75rem;  /* 12px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
  --spacing-2xl: 3rem;    /* 48px */
  --spacing-3xl: 4rem;    /* 64px */
  
  /* Layout-specific */
  --header-height: 3.875rem;  /* 62px */
  --header-offset: 6.375rem;  /* 102px (nav + gap) */
}
```

### Step 2: Update AI Analysis Section Spacing
Convert fixed pixel values to relative/clamped units:

**Current:**
```css
.tru-ai-header-row {
  min-height: 380px;
}

.tru-ai-steps-left {
  width: calc(50% - 20px);
}
```

**Updated:**
```css
.tru-ai-header-row {
  min-height: clamp(20rem, 35vh, 24rem);  /* Scales with viewport */
}

.tru-ai-steps-left {
  width: calc(50% - 1.25rem);
}
```

### Step 3: Convert Header Offset to rem
Update sticky header positioning:

**Current:**
```css
.sticky.top-[102px]
```

**Updated:**
```css
/* Using CSS variable or Tailwind arbitrary value */
.sticky.top-[6.375rem]
```

### Step 4: Update Padding and Gaps
Convert fixed pixel paddings to rem throughout key sections:

| Current | Updated |
|---------|---------|
| `padding: 12px 24px 16px 16px` | `padding: 0.75rem 1.5rem 1rem 1rem` |
| `gap: 32px 48px` | `gap: 2rem 3rem` |
| `margin-bottom: 35px` | `margin-bottom: 2.1875rem` |

### Step 5: Apply Viewport-Clamped Dimensions
For elements that need size constraints:

```css
.tru-ai-header-previews .tru-ai-live-scanner {
  width: clamp(280px, 25vw, 400px);
  height: clamp(300px, 30vh, 440px);
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Add CSS custom properties, convert px values to rem/clamp in key sections |
| `src/pages/Index.tsx` | Update inline Tailwind classes with rem-based values |

---

## Technical Considerations

### Why this approach works
1. **`rem` units** are relative to root font-size, which browsers adjust during zoom, creating more consistent proportions
2. **`clamp()`** allows setting min/max bounds while the middle value scales with viewport
3. **CSS custom properties** enable centralized control and easy adjustment
4. **Viewport units** (`vh`, `vw`) scale directly with browser dimensions

### What won't change
- The design will still have fixed breakpoints for responsive layouts
- Some elements (borders, icons) work fine with fixed pixels
- The overall visual design remains the same

### Potential trade-offs
- Slightly more complex CSS with calculations
- Some minor visual differences at extreme zoom levels (very zoomed in/out)
- Testing needed at 67%, 80%, 100%, 125%, 150% zoom levels

---

## Testing Plan
After implementation, verify at these zoom levels:
- 67% (zoomed out)
- 80% (slightly zoomed out)
- 100% (default)
- 125% (slightly zoomed in)
- 150% (zoomed in)

Check that:
- AI Analysis Estimator headline and demo cards maintain consistent spacing
- Command Center header stays properly positioned
- No horizontal overflow or element collision
- Text remains readable at all zoom levels
