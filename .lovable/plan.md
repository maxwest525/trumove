
# Style Form Header to Match Reference Image

## Overview
Update the EstimateWizard form header to match the reference image style with:
- Dark uppercase text "BUILD YOUR" with green "MOVE"
- Slightly darker background
- Tiny subheader in muted uppercase

---

## Current State

| Element | Current | Target |
|---------|---------|--------|
| Title text | "Build your move" (sentence case) | "BUILD YOUR MOVE" (uppercase) |
| Title color | Dark (`hsl(var(--tm-ink))`) | Same - already dark |
| "Move" accent | Green gradient | Same - already green |
| Background | `hsl(220 15% 96%)` (light gray) | Slightly darker: `hsl(220 15% 93%)` |
| Subheader | Already exists | Already exists - may need font tweaks |
| Green accent bar | Missing | Add at top |

---

## Proposed Changes

### File: `src/components/estimate/EstimateWizard.tsx`

**Update the header content (lines 242-247):**

```tsx
// From
<span className="tru-qb-form-title tru-qb-form-title-large">Build your <span className="tru-qb-title-accent">move</span></span>

// To
<span className="tru-qb-form-title tru-qb-form-title-large">BUILD YOUR <span className="tru-qb-title-accent">MOVE</span></span>
```

---

### File: `src/index.css`

**1. Add green accent bar at top of header (after line 4318):**

Add a `::before` pseudo-element to create the green gradient stripe at the top of the header:

```css
.tru-qb-form-header.tru-qb-form-header-pill::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, hsl(142 76% 50%) 0%, hsl(160 80% 45%) 100%);
  border-radius: 16px 16px 0 0;
}
```

**2. Darken the header background (line 4315):**

```css
/* From */
background: hsl(220 15% 96%);

/* To */
background: hsl(220 15% 93%);
```

**3. Ensure title text styling (lines 4343-4348):**

Already styled correctly with `font-weight: 800` and dark color. No changes needed.

**4. Adjust subtitle styling if needed (lines 4442-4448):**

Already styled with uppercase, small font. May tweak to be smaller/more muted:

```css
/* From */
font-size: 10px;
color: hsl(var(--tm-ink) / 0.45);

/* To */
font-size: 9px;
color: hsl(var(--tm-ink) / 0.38);
```

---

## Visual Result

| Change | Before | After |
|--------|--------|-------|
| Header background | Light gray (96% lightness) | Slightly darker (93% lightness) |
| Title text | Sentence case | UPPERCASE |
| Green accent bar | None | 3px gradient bar at top |
| Subheader | 10px, 45% opacity | 9px, 38% opacity (tinier) |

The form header will now match the reference image with the dark "BUILD YOUR MOVE" text, green accent on "MOVE", darker background, and tiny subheader.

---

## Dark Mode Considerations

The existing dark mode overrides will continue to work - the header will have a dark background (`hsl(220 15% 8%)`) with white text in dark mode. The green accent bar and "MOVE" gradient will remain consistent.
