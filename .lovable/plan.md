

# Plan: Fix Right-Side Content Panel Layout

## Problem Identified
The "blagg is gay" content is appearing **underneath** the form instead of **beside it** because:

1. **Extra grid children** - `HeroParticles`, `tru-hero-particles-overlay`, and the analyzing overlay modal are all children of the grid container without explicit `grid-column` positioning
2. **Implicit grid rows** - These extra elements are consuming grid cells, pushing the content panel to a new row

## Solution

### 1. Position Non-Layout Elements Absolutely
**File:** `src/index.css`

Add positioning rules so the particles and overlay don't participate in the grid layout:

```css
.tru-hero.tru-hero-split > .tru-hero-particles,
.tru-hero.tru-hero-split > .tru-hero-particles-overlay,
.tru-hero.tru-hero-split > .tru-analyze-fullpage-overlay {
  position: absolute;
  grid-column: unset;
  grid-row: unset;
}
```

Or alternatively, explicitly position them:

```css
.tru-hero.tru-hero-split > .tru-analyze-fullpage-overlay {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}
```

### 2. Ensure Form and Content Panel Share the Same Row
**File:** `src/index.css`

Explicitly assign both the form (`tru-hero-right-half`) and the content panel (`tru-hero-content-panel`) to row 2:

```css
.tru-hero-right-half {
  grid-row: 2;
  grid-column: 1;
  order: unset; /* Remove order, use explicit placement */
}

.tru-hero-content-panel {
  grid-row: 2;
  grid-column: 2;
  order: unset; /* Remove order, use explicit placement */
}
```

## Visual Result

```text
+--------------------------------------------------+
| Row 1: tru-hero-header-section (full width)      |
| "Trumove. A Smarter Way To Move."                |
+--------------------------------------------------+
| Row 2:                                           |
|  Column 1 (520px)  |  Column 2 (1fr)             |
|  [Quote Form]      |  "blagg is gay"             |
|   - Progress bar   |   [description text...]     |
|   - From/To inputs |   [lorem ipsum...]          |
|   - Continue btn   |                             |
+--------------------------------------------------+
```

## Files Modified
1. `src/index.css` - Add explicit grid row/column assignments to ensure side-by-side layout

## No Other Changes
- The form dimensions and spacing remain unchanged
- Only the grid placement rules are updated

