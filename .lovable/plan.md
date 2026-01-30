

# Increase Shadow Intensity & Border Thickness on Hero Cards

## Current State

The cards currently have subtle shadows and borders that feel too light:

| Card | Current Border | Current Shadow Opacity |
|------|----------------|----------------------|
| Feature Cards | `2px solid hsl(--tm-ink / 0.15)` | 0.12, 0.10, 0.08 |
| Form Card | `2px solid hsl(--tm-ink / 0.12)` | 0.08, 0.16, 0.12 |
| Why TruMove | `2px solid hsl(--tm-ink / 0.12)` | 0.08, 0.14, 0.12 |

---

## Changes to Make

### 1. Increase Border Thickness & Opacity
Change borders from `2px` to `3px` and increase opacity for more definition:
- Feature Cards: `3px solid hsl(var(--tm-ink) / 0.25)`
- Form Card: `3px solid hsl(var(--tm-ink) / 0.20)`
- Why TruMove: `3px solid hsl(var(--tm-ink) / 0.20)`

### 2. Boost Shadow Intensity
Increase shadow opacity values by roughly 50-80% for more dramatic depth:
- Bump base shadows from 0.08-0.12 → 0.15-0.20
- Boost mid-layer shadows from 0.10-0.16 → 0.20-0.28
- Increase deep layer and glow from 0.08-0.12 → 0.15-0.20

---

## Implementation Details

### File: `src/index.css`

**Change 1: Feature Cards (Lines 1860-1864)**
```css
/* Before */
border: 2px solid hsl(var(--tm-ink) / 0.15);
box-shadow: 
  0 4px 12px hsl(var(--tm-ink) / 0.12),
  0 8px 32px hsl(var(--tm-ink) / 0.10),
  0 16px 48px hsl(var(--primary) / 0.08);

/* After */
border: 3px solid hsl(var(--tm-ink) / 0.25);
box-shadow: 
  0 4px 12px hsl(var(--tm-ink) / 0.20),
  0 8px 32px hsl(var(--tm-ink) / 0.18),
  0 16px 48px hsl(var(--primary) / 0.15);
```

**Change 2: Feature Cards Hover (Lines 1895-1899)**
```css
/* Before */
border-color: hsl(var(--primary) / 0.5);
box-shadow: 
  0 12px 32px hsl(var(--primary) / 0.2),
  0 24px 64px hsl(var(--tm-ink) / 0.15),
  0 0 0 2px hsl(var(--primary) / 0.25);

/* After */
border-color: hsl(var(--primary) / 0.6);
box-shadow: 
  0 12px 32px hsl(var(--primary) / 0.35),
  0 24px 64px hsl(var(--tm-ink) / 0.25),
  0 0 0 3px hsl(var(--primary) / 0.35);
```

**Change 3: Form Card (Lines 7308-7313)**
```css
/* Before */
border: 2px solid hsl(var(--tm-ink) / 0.12);
box-shadow:
  0 4px 12px hsl(var(--tm-ink) / 0.08),
  0 16px 48px hsl(var(--tm-ink) / 0.16),
  0 32px 80px hsl(var(--tm-ink) / 0.12),
  0 0 0 1px hsl(var(--primary) / 0.08);

/* After */
border: 3px solid hsl(var(--tm-ink) / 0.20);
box-shadow:
  0 4px 12px hsl(var(--tm-ink) / 0.15),
  0 16px 48px hsl(var(--tm-ink) / 0.28),
  0 32px 80px hsl(var(--tm-ink) / 0.20),
  0 0 0 2px hsl(var(--primary) / 0.12);
```

**Change 4: Why TruMove Card (Lines 26386-26392)**
```css
/* Before */
border: 2px solid hsl(var(--tm-ink) / 0.12);
box-shadow: 
  0 4px 12px hsl(var(--tm-ink) / 0.08),
  0 12px 40px hsl(var(--tm-ink) / 0.14),
  0 24px 64px hsl(var(--primary) / 0.12);

/* After */
border: 3px solid hsl(var(--tm-ink) / 0.20);
box-shadow: 
  0 4px 12px hsl(var(--tm-ink) / 0.15),
  0 12px 40px hsl(var(--tm-ink) / 0.25),
  0 24px 64px hsl(var(--primary) / 0.20);
```

**Change 5: Why TruMove Card Hover (Lines 26400-26404)**
```css
/* Before */
border-color: hsl(var(--primary) / 0.35);
box-shadow: 
  0 8px 24px hsl(var(--primary) / 0.18),
  0 20px 56px hsl(var(--tm-ink) / 0.18),
  0 32px 80px hsl(var(--primary) / 0.12);

/* After */
border-color: hsl(var(--primary) / 0.50);
box-shadow: 
  0 8px 24px hsl(var(--primary) / 0.30),
  0 20px 56px hsl(var(--tm-ink) / 0.28),
  0 32px 80px hsl(var(--primary) / 0.20);
```

---

## Technical Summary

| Card | Border Change | Shadow Opacity Change |
|------|---------------|----------------------|
| Feature Cards | `2px / 0.15` → `3px / 0.25` | +60-80% more intense |
| Feature Hover | Outer ring `2px` → `3px` | +50-75% more intense |
| Form Card | `2px / 0.12` → `3px / 0.20` | +75-90% more intense |
| Why TruMove | `2px / 0.12` → `3px / 0.20` | +60-80% more intense |
| Why TruMove Hover | Border `0.35` → `0.50` | +55-65% more intense |

---

## Expected Result

- Cards have thick, clearly visible 3px borders
- Shadows are noticeably deeper and more pronounced
- Cards feel more substantial and "grounded" on the page
- Hover states show even more dramatic lift and glow effects
- Overall hero section has a premium, high-contrast aesthetic

