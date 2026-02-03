
# Plan: Center AI Analysis Section at Fixed 750px Midpoint

## Current Issue

The AI Analysis section uses `left: 50%` for center-relative positioning, which works well for percentage-based layouts but doesn't account for situations where the user wants a fixed horizontal center point. The user wants the entire content group (headline + both demo previews) centered with the midpoint at exactly **750px** from the left edge of the 1500px section.

## Solution

Change the positioning from percentage-based (`left: 50%`) to a fixed pixel value (`left: 750px`) for both the headline and the preview containers. This ensures the center point remains at 750px regardless of viewport or zoom changes.

---

## Technical Implementation

### File: `src/index.css`

#### 1. Update `.tru-ai-steps-left` (Headline Container)

**Current (Lines 2473-2487):**
```css
.tru-ai-steps-left {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-100%, -50%);
  margin-left: -4rem;
  ...
}
```

**Updated:**
```css
.tru-ai-steps-left {
  position: absolute;
  left: 750px;
  top: 50%;
  transform: translate(-100%, -50%);
  margin-left: -4rem;
  ...
}
```

#### 2. Update `.tru-ai-header-previews` (Demo Previews Container)

**Current (Lines 2746-2759):**
```css
.tru-ai-header-previews {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(0, -50%);
  margin-left: 4rem;
  ...
}
```

**Updated:**
```css
.tru-ai-header-previews {
  position: absolute;
  left: 750px;
  top: 50%;
  transform: translate(0, -50%);
  margin-left: 4rem;
  ...
}
```

---

## Visual Result

| Element | Anchor Point | Offset |
|---------|--------------|--------|
| Headline | 750px (right edge at center) | -4rem left |
| Demo Previews | 750px (left edge at center) | +4rem right |

**Total gap between headline and previews:** 8rem (~128px)

The content will be perfectly centered at the 750px mark of the section, with equal spacing on both sides regardless of browser zoom level.

---

## Files to Modify

| File | Lines | Changes |
|------|-------|---------|
| `src/index.css` | 2475 | Change `left: 50%` to `left: 750px` |
| `src/index.css` | 2748 | Change `left: 50%` to `left: 750px` |
