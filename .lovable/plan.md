
# Add Subtle Glow/Shadow to Hero Cards

## Overview
Add a subtle ambient glow or shadow to hero cards so they have visual depth even before hover interaction, making the UI feel more polished and premium.

---

## Current State

| Card | Base Shadow | Hover Shadow |
|------|-------------|--------------|
| Feature Cards (`.tru-value-card-open`) | None | Yes - glow effect |
| Form Card (`.tru-form-card`) | Subtle shadow | N/A |
| Why TruMove (`.tru-why-card-premium`) | Very subtle | Yes - glow effect |

The feature cards look "flat" until hovered because they have no base shadow.

---

## Changes Required

### File: `src/index.css`

#### 1. Add Base Shadow to Feature Cards

**Lines 1853-1864** - Add `box-shadow` to the base `.tru-value-card-open` style:

```css
/* BEFORE */
.tru-hero-value-cards-open .tru-value-card-open {
  display: flex;
  flex-direction: column;
  height: 260px;
  padding: 14px;
  padding-bottom: 14px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid hsl(var(--border));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* AFTER */
.tru-hero-value-cards-open .tru-value-card-open {
  display: flex;
  flex-direction: column;
  height: 260px;
  padding: 14px;
  padding-bottom: 14px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid hsl(var(--border));
  box-shadow: 
    0 2px 8px hsl(var(--tm-ink) / 0.06),
    0 4px 16px hsl(var(--primary) / 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### 2. Enhance Why TruMove Card Base Glow

**Line 26076** - Increase the base shadow intensity slightly:

```css
/* BEFORE */
.tru-why-card-premium {
  ...
  box-shadow: 0 8px 32px hsl(var(--tm-ink) / 0.08);
}

/* AFTER */
.tru-why-card-premium {
  ...
  box-shadow: 
    0 4px 12px hsl(var(--tm-ink) / 0.08),
    0 8px 32px hsl(var(--primary) / 0.06);
}
```

#### 3. Dark Mode Enhancement

Add dark mode specific shadows that use a subtle green glow for consistency:

```css
/* Around line 27205 - Dark Mode */
.dark .tru-hero-value-cards-open .tru-value-card-open {
  box-shadow: 
    0 2px 8px hsl(var(--tm-ink) / 0.2),
    0 4px 16px hsl(var(--primary) / 0.08),
    0 0 1px hsl(var(--primary) / 0.15);
}

.dark .tru-why-card-premium {
  box-shadow: 
    0 4px 12px hsl(var(--tm-ink) / 0.3),
    0 8px 32px hsl(var(--primary) / 0.1);
}
```

---

## Visual Result

**Before:**
```text
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   FLAT CARD     │  │   FLAT CARD     │  │   FLAT CARD     │
│   (no depth)    │  │   (no depth)    │  │   (no depth)    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**After:**
```text
╔═════════════════╗  ╔═════════════════╗  ╔═════════════════╗
║   CARD          ║  ║   CARD          ║  ║   CARD          ║
║   (subtle glow) ║  ║   (subtle glow) ║  ║   (subtle glow) ║
╚═════════════════╝  ╚═════════════════╝  ╚═════════════════╝
       ░░░                  ░░░                  ░░░
    (shadow)            (shadow)            (shadow)
```

---

## Shadow Design Approach

The shadows use a two-layer approach for depth:

1. **Ink Layer** - Neutral dark shadow for grounding
2. **Primary Layer** - Subtle brand-colored glow for warmth

This creates cards that feel "lifted" off the page with a premium, soft-lit appearance.

---

## Summary

| Change | Description |
|--------|-------------|
| Feature card base shadow | Add dual-layer shadow with ink + primary tint |
| Why TruMove card enhanced | Slightly stronger base glow |
| Dark mode variants | Green-tinted ambient glow for consistency |

### File Modified
- `src/index.css` - 4 small additions
