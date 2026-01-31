

# Fix Logo Centering - Remove Conflicting CSS Overrides

## Problem Identified
Multiple CSS rules are overriding the stacked/centered logo layout:

| Conflicting Rule | Line | Problem |
|------------------|------|---------|
| `.tru-hero-header-section.tru-hero-header-refined` | 26595 | Sets `position: relative` which overrides `position: absolute` |
| Same rule | 26601-26603 | Uses `width: fit-content` + `margin: auto` (different centering method) |
| `.tru-hero-header-refined .tru-hero-headline-main` | 26630 | Sets `display: flex` overriding `display: block` |
| `.tru-hero-headline-logo` | 26609 | Has `display: inline-block` + `margin-right: 16px` for old inline layout |

---

## Solution
Update the conflicting rules to properly support the stacked layout with page-centered positioning.

---

## Technical Changes

### File: `src/index.css`

**1. Update `.tru-hero-header-section.tru-hero-header-refined` (lines 26595-26604):**

Remove `position: relative`, `width: fit-content`, and `margin-left/right: auto` to allow the absolute positioning from `.tru-hero-header-stacked` to work:

```css
.tru-hero-header-section.tru-hero-header-refined {
  padding: 16px 20px 16px;
  text-align: center;
  z-index: 10;
  margin-bottom: 12px;
}
```

**2. Update `.tru-hero-headline-logo` (lines 26609-26617):**

Remove inline layout properties since logo is now stacked above headline:

```css
.tru-hero-headline-logo {
  height: 72px;
  width: auto;
  display: block;
  margin: 0 auto;
  filter: drop-shadow(0 0 12px hsl(var(--primary) / 0.5)) drop-shadow(0 0 24px hsl(var(--primary) / 0.25));
  animation: logo-glow-pulse 3s ease-in-out infinite;
}
```

**3. Update `.tru-hero-header-refined .tru-hero-headline-main` (lines 26630-26641):**

Change from flex to block for text-only headline:

```css
.tru-hero-header-refined .tru-hero-headline-main {
  font-size: clamp(36px, 5.5vw, 64px);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0;
  display: block;
  text-align: center;
}
```

---

## Summary of Changes

| Rule | Property | Before | After |
|------|----------|--------|-------|
| `.tru-hero-header-section.tru-hero-header-refined` | position | relative | (removed - inherits absolute) |
| Same | width | fit-content | (removed) |
| Same | margin-left/right | auto | (removed) |
| `.tru-hero-headline-logo` | display | inline-block | block |
| Same | vertical-align | middle | (removed) |
| Same | margin-right | 16px | (removed) |
| Same | margin | - | 0 auto |
| `.tru-hero-header-refined .tru-hero-headline-main` | display | flex | block |
| Same | align-items | center | (removed) |
| Same | justify-content | center | (removed) |
| Same | flex-wrap | wrap | (removed) |
| Same | gap | 8px | (removed) |
| Same | text-align | - | center |

---

## Files Modified
- `src/index.css` - Remove conflicting styles that override stacked/centered layout

