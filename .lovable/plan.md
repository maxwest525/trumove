

# Hero Layout Adjustments

## Summary of Changes

The user wants two layout modifications to the hero section:
1. **Move the family image higher up** - Adjust the `object-position` so more of the family is visible (less cropped from top)
2. **Move the black StatsStrip and everything below it up by 175px** - Add negative margin to pull content upward, overlapping into the hero area

---

## Current Layout

```text
┌──────────────────────────────────────────────────────────────────┐
│  HERO WRAPPER (min-height: 100vh)                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Background Image (.tru-hero-bg-image)                     │  │
│  │  object-position: center 25%  ← Crops family from top      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Hero Content (form, headline, feature cards)              │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  BLACK STATS STRIP                                               │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  AI INVENTORY ANALYSIS SECTION                                   │
└──────────────────────────────────────────────────────────────────┘
```

## New Layout

```text
┌──────────────────────────────────────────────────────────────────┐
│  HERO WRAPPER (min-height: 100vh)                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Background Image (.tru-hero-bg-image)                     │  │
│  │  object-position: center 15%  ← Shows more of family       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Hero Content (form, headline, feature cards)              │  │
│  └────────────────────────────────────────────────────────────┤  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  BLACK STATS STRIP  ← Moved up 175px (overlaps hero)       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  AI INVENTORY ANALYSIS  ← Also moves up with strip         │  │
└──┴────────────────────────────────────────────────────────────┴──┘
```

---

## Implementation Details

### File: `src/index.css`

**Change 1: Move Family Higher (Line 1369)**

Adjust the background image position from `center 25%` to `center 15%` to show more of the family (less top cropping):

```css
/* Before */
.tru-hero-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
}

/* After */
.tru-hero-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 15%;  /* Show more family, less sky */
}
```

**Change 2: Pull StatsStrip Up 175px (Lines 28944-28952)**

Add a negative top margin to the `.stats-strip` to pull it up into the hero area:

```css
/* Before */
.stats-strip {
  background: linear-gradient(to bottom, hsl(220 15% 6%), hsl(220 15% 4%));
  border-top: 1px solid hsl(0 0% 100% / 0.08);
  border-bottom: 1px solid hsl(0 0% 100% / 0.08);
  padding: 8px 24px;
  overflow: hidden;
  position: relative;
  z-index: 10;
}

/* After */
.stats-strip {
  background: linear-gradient(to bottom, hsl(220 15% 6%), hsl(220 15% 4%));
  border-top: 1px solid hsl(0 0% 100% / 0.08);
  border-bottom: 1px solid hsl(0 0% 100% / 0.08);
  padding: 8px 24px;
  overflow: hidden;
  position: relative;
  z-index: 10;
  margin-top: -175px;  /* Pull up into hero area */
}
```

---

## Technical Summary

| Element | Property | Before | After |
|---------|----------|--------|-------|
| `.tru-hero-bg-image` | `object-position` | `center 25%` | `center 15%` |
| `.stats-strip` | `margin-top` | (none) | `-175px` |

---

## Expected Result

- The family in the hero background image is positioned higher (more visible, less cropped from top)
- The black StatsStrip overlaps the hero by 175px, making the page more compact
- All content below the StatsStrip (AI Inventory Analysis, etc.) also shifts up accordingly
- Creates a tighter, more cohesive hero-to-content transition

