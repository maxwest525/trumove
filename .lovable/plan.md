
# Vertical Center + Shadow Fix for AI Analysis Section

## Problem Summary

1. **AI Analysis panels are not vertically centered** - The grid row needs `align-items: center` applied consistently
2. **Shadow glow is being cut off** - Both section containers (`.tru-ai-steps-section` and `.tru-tracker-section`) have `overflow: hidden` which clips the panel shadows

## Current Values

| Property | Current Value |
|----------|---------------|
| `--demo-section-height` | 425px |
| `--demo-panel-height` | 424px |
| Panel height | 424px |
| Total section row height | 425px |

## Technical Changes

### File: `src/index.css`

#### 1. Remove `overflow: hidden` to stop shadow clipping

**Line ~2603** - `.tru-ai-steps-section`:
```css
/* BEFORE */
overflow: hidden;

/* AFTER */
overflow: visible;
```

**Line ~3442** - `.tru-tracker-section`:
```css
/* BEFORE */
overflow: hidden;

/* AFTER */
overflow: visible;
```

#### 2. Add vertical padding to section rows for shadow breathing room

The shadows extend ~32px from the panels. Adding padding to the row containers will give them space to render:

**Line ~2607-2620** - `.tru-ai-header-row`:
```css
.tru-ai-header-row {
  /* existing styles... */
  padding: 32px 48px;  /* Add vertical padding for shadow room */
}
```

**Line ~3452-3465** - `.tru-tracker-header-row`:
```css
.tru-tracker-header-row {
  /* existing styles... */
  padding: 32px 48px;  /* Add vertical padding for shadow room */
}
```

#### 3. Update section height variable to account for shadow padding

To keep total visual height consistent while adding shadow room:

**Line ~35** - Update CSS variable:
```css
/* Current: 425px for content only */
/* New: Content + shadow padding (32px top + 32px bottom) = 489px total */
--demo-section-height: 425px;  /* Keep inner height same */
```

The sections will naturally expand with the added padding.

## Height Summary

| Element | Height |
|---------|--------|
| Panel content height | 424px |
| Shadow extension | ~32px per side |
| Row padding | 32px top + 32px bottom |
| **Total row height** | **489px** (~490px) |

The total visual height of each demo section row becomes approximately **490px** including shadow breathing room.
