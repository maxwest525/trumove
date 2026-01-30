

# Strengthen Hero Card Shadows for Visual Impact

## Overview
Increase the shadow intensity across all hero cards (form card, feature cards, Why TruMove premium card, and Why TruMove compact card) to create more visual depth and pop.

---

## Current Shadow Values

| Card | Current Shadow |
|------|----------------|
| `.tru-form-card` | `0 1px 3px ink/0.04, 0 16px 48px ink/0.1` |
| `.tru-hero-feature-card` (hover) | `0 12px 32px primary/0.18` |
| `.tru-why-card-premium` | `0 4px 12px ink/0.08, 0 8px 32px primary/0.06` |
| `.tru-why-card-compact` | `0 2px 12px ink/0.06` |

---

## Proposed Stronger Shadows

| Card | New Shadow |
|------|------------|
| `.tru-form-card` | `0 2px 6px ink/0.06, 0 20px 56px ink/0.14` |
| `.tru-hero-feature-card` (hover) | `0 16px 40px primary/0.24` |
| `.tru-why-card-premium` | `0 6px 16px ink/0.12, 0 12px 40px primary/0.10` |
| `.tru-why-card-premium:hover` | `0 16px 48px primary/0.22, 0 6px 20px ink/0.14` |
| `.tru-why-card-compact` | `0 4px 16px ink/0.10` |

---

## Changes Required

### File: `src/index.css`

#### 1. `.tru-form-card` (line 7245-7248)
**Before:**
```css
box-shadow:
  0 1px 3px hsl(var(--tm-ink) / 0.04),
  0 16px 48px hsl(var(--tm-ink) / 0.1),
  0 0 0 1px hsl(var(--tm-ink) / 0.02);
```

**After:**
```css
box-shadow:
  0 2px 6px hsl(var(--tm-ink) / 0.06),
  0 20px 56px hsl(var(--tm-ink) / 0.14),
  0 0 0 1px hsl(var(--tm-ink) / 0.03);
```

#### 2. `.tru-hero-feature-card:hover` (line 6277)
**Before:**
```css
box-shadow: 0 12px 32px hsl(var(--primary) / 0.18);
```

**After:**
```css
box-shadow: 0 16px 40px hsl(var(--primary) / 0.24);
```

#### 3. `.tru-why-card-premium` (lines 26087-26089)
**Before:**
```css
box-shadow: 
  0 4px 12px hsl(var(--tm-ink) / 0.08),
  0 8px 32px hsl(var(--primary) / 0.06);
```

**After:**
```css
box-shadow: 
  0 6px 16px hsl(var(--tm-ink) / 0.12),
  0 12px 40px hsl(var(--primary) / 0.10);
```

#### 4. `.tru-why-card-premium:hover` (lines 26095-26097)
**Before:**
```css
box-shadow: 
  0 12px 40px hsl(var(--primary) / 0.15),
  0 4px 16px hsl(var(--tm-ink) / 0.1);
```

**After:**
```css
box-shadow: 
  0 16px 48px hsl(var(--primary) / 0.22),
  0 6px 20px hsl(var(--tm-ink) / 0.14);
```

#### 5. `.tru-why-card-compact` (lines 27446-27448)
**Before:**
```css
box-shadow: 
  0 2px 12px hsl(var(--tm-ink) / 0.06),
  inset 0 1px 0 hsl(0 0% 100% / 0.6);
```

**After:**
```css
box-shadow: 
  0 4px 16px hsl(var(--tm-ink) / 0.10),
  inset 0 1px 0 hsl(0 0% 100% / 0.6);
```

---

## Visual Result

The cards will have deeper, more pronounced shadows that:
- Create more visual separation from the background
- Increase the "floating" effect for a modern, elevated look
- Enhance hover interactions with stronger lift shadows

---

## Summary

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 7245-7248 | Stronger form card shadow |
| `src/index.css` | 6277 | Stronger feature card hover shadow |
| `src/index.css` | 26087-26089 | Stronger Why TruMove premium card shadow |
| `src/index.css` | 26095-26097 | Stronger Why TruMove premium hover shadow |
| `src/index.css` | 27446-27448 | Stronger Why TruMove compact card shadow |

