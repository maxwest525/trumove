
# Plan: Move Form Left & Add Subheadline

## Overview
Two changes:
1. Move the form significantly more to the left by adjusting grid and padding
2. Add a subheadline "Designed to put you in control of your move." under the main headline

## Changes

### 1. Shift Form More to the Left
**File:** `src/index.css`

Adjust the grid layout and padding to push the form leftward without affecting the right content panel:

```css
/* Update around line 1041-1049 */
.tru-hero.tru-hero-split {
  display: grid;
  grid-template-columns: 520px 1fr;
  grid-template-rows: auto 1fr;
  gap: 32px 64px;                    /* Increased column gap from 48px to 64px */
  align-items: start;
  padding: 4px 24px 16px 48px;       /* Increased left padding from 24px to 48px */
  max-width: 1480px;
  margin: 0 auto;
}
```

This shifts the entire grid (including form) leftward while giving more breathing room between the form and right panel.

### 2. Add Subheadline Under Main Headline
**File:** `src/pages/Index.tsx`

Add a new paragraph right after the h1 headline inside `.tru-hero-header-section`:

```tsx
{/* Around lines 666-670 */}
<div className="tru-hero-header-section">
  <h1 className="tru-hero-headline-main">
    <img src={logoImg} alt="TruMove" className="tru-hero-inline-logo" /> A Smarter Way To <span className="tru-hero-headline-accent">Move</span>.
  </h1>
  {/* NEW: Subheadline */}
  <p className="tru-hero-header-subheadline">
    Designed to put you in control of your move.
  </p>
</div>
```

### 3. Style the New Subheadline
**File:** `src/index.css`

Add styling for the new subheadline element (after the headline styles around line 1070):

```css
.tru-hero-header-section .tru-hero-header-subheadline {
  font-size: 1.125rem;
  font-weight: 500;
  color: hsl(var(--tm-ink) / 0.7);
  margin: 8px 0 0 0;
  letter-spacing: 0.01em;
  opacity: 0;
  animation: hero-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.25s forwards;
}
```

## Visual Result

```text
+------------------------------------------------------------------+
| [Logo] A Smarter Way To Move.                                    |
| Designed to put you in control of your move.  ← NEW SUBHEADLINE  |
+------------------------------------------------------------------+
| ← 48px padding                                                   |
|                                                                  |
| [Form Card 520px]          ← 64px gap →   "blagg is gay"         |
|  - Progress bar                           Skip the complexity... |
|  - From/To inputs                         Feature icons...       |
|  - Continue btn                                                  |
|                                                                  |
+------------------------------------------------------------------+
```

## Files Modified
1. `src/index.css` - Adjust grid padding/gap and add subheadline styling
2. `src/pages/Index.tsx` - Add subheadline paragraph element

## Technical Notes
- The form stays at 520px width (unchanged)
- Only positioning adjustments via padding and gap
- Animation timing on subheadline is staggered to flow after the headline
