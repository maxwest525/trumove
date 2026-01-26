
# Plan: Adjust Right-Side Content Panel Typography & Spacing

## Overview
Refine the typography sizing, line height, and spacing of the right-side value proposition panel to better balance with the form card on the left, using the screenshot format as a baseline reference.

## Changes

### 1. Update Content Panel Typography
**File:** `src/index.css`

Add specific styling for the content panel elements:

```css
/* Right panel specific headline sizing - more compact */
.tru-hero-content-panel .tru-hero-headline-main {
  font-size: 2rem;         /* Smaller than the main hero headline */
  line-height: 1.2;
  text-align: left;
  justify-content: flex-start;
  margin-bottom: 0;
}

/* Right panel subheadline - tighter, balanced text */
.tru-hero-content-panel .tru-hero-subheadline {
  font-size: 0.95rem;
  line-height: 1.6;
  text-align: left;
  margin-left: 0;
  margin-right: 0;
  max-width: 480px;        /* Constrain width for readability */
  color: hsl(var(--tm-ink) / 0.75);
}

/* Reduce gap between elements in content panel */
.tru-hero-content-panel .tru-hero-content-inner {
  gap: 16px;               /* Tighter spacing (from 24px) */
  padding-top: 8px;        /* Slight offset to align with form */
}
```

### 2. Adjust Strong Tag Styling in Description
**File:** `src/index.css`

Ensure the bolded keywords stand out properly:

```css
.tru-hero-content-panel .tru-hero-subheadline strong {
  color: hsl(var(--tm-ink));
  font-weight: 600;
}
```

## Visual Result

```text
+--------------------------------------------------+
| Row 1: "Trumove. A Smarter Way To Move."         |
+--------------------------------------------------+
| [Form Card 520px]     |  blagg is gay            |
|  - Progress bar       |  (2rem, tight line-height)|
|  - FROM/TO inputs     |                          |
|  - Continue btn       |  Skip the complexity...  |
|                       |  (0.95rem, 1.6 lh)       |
|                       |                          |
|                       |  Lorem ipsum...          |
|                       |  (same, 60% opacity)     |
+--------------------------------------------------+
```

## Files Modified
1. `src/index.css` - Update typography and spacing rules for `.tru-hero-content-panel`

## No Other Changes
- JSX structure remains the same
- Form dimensions and layout unchanged
- Only typography/spacing refinements applied
