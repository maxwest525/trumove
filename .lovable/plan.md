
# Fix: Remove Transparent Box on Homepage

## Issue Identified
A semi-transparent white box is appearing on the right side of the homepage hero section. Based on investigation, this appears to be caused by one of the following CSS styling issues in the hero grid layout:

1. The `.tru-hero-right-half` wrapper
2. The `.tru-hero-content-panel.tru-hero-stacked-cards` container  
3. A pseudo-element (`::before` or `::after`) on one of the hero containers

## Solution

Add explicit styling overrides to ensure these containers have fully transparent backgrounds and no unintended visual elements:

### CSS Changes (`src/index.css`)

Add/update the following rules to ensure the hero right-side containers are completely transparent:

```css
/* Hero right half - ensure no background */
.tru-hero-right-half,
.tru-hero-right-stacked {
  background: transparent !important;
}

/* Stacked cards container - ensure no background */
.tru-hero-stacked-cards {
  background: transparent !important;
}

/* Content panel - ensure no background unless it's the premium card */
.tru-hero-content-panel {
  background: transparent !important;
}
```

Also check and remove any `::before` or `::after` pseudo-elements on `.tru-hero-content-panel` that might be creating this visual artifact.

---

## Technical Details

### Files to Modify
- `src/index.css`

### Implementation Steps
1. Search for any background styling on `.tru-hero-right-half`, `.tru-hero-right-stacked`, `.tru-hero-content-panel`, and `.tru-hero-stacked-cards`
2. Add `background: transparent` rules to override any inherited or unintended backgrounds
3. Check for any pseudo-elements that may be rendering a box and remove or hide them
4. Test in both light and dark mode to confirm the transparent box is gone

### Verification
- Navigate to the homepage
- Confirm the transparent box is no longer visible on the right side
- Ensure the quote form and "Your Move. Your Terms" card still render correctly
- Test in both light and dark modes
