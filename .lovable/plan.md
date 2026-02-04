

# Hero Section Enhancement Plan

## Overview
Enhance the homepage hero section's left column with larger sizing for the logo, headline, and subheadline, plus add subtle entrance animations for a polished, premium feel.

---

## Changes

### 1. Logo Sizing (Larger on Wide Screens)

**Current**: Fixed 72px height  
**Updated**: Responsive sizing with larger desktop breakpoint

```text
Mobile:      64px height
Tablet:      72px height  
Desktop:     96px height
Wide (1400px+): 110px height
```

### 2. Headline Sizing (More Impact on Wide Screens)

**Current**: `clamp(36px, 5vw, 58px)`  
**Updated**: `clamp(40px, 6vw, 72px)` with tighter letter-spacing

```text
┌─────────────────────────────────────────────────────────────┐
│  Property         │  Current    │  Updated                  │
├───────────────────┼─────────────┼───────────────────────────┤
│  font-size        │  max 58px   │  max 72px                 │
│  font-weight      │  800        │  900                      │
│  letter-spacing   │  -0.03em    │  -0.035em                 │
│  line-height      │  1.05       │  1.02                     │
│  margin-bottom    │  12px       │  16px                     │
└─────────────────────────────────────────────────────────────┘
```

### 3. Feature Line (Subheadline) Sizing

**Current**: 12px fixed  
**Updated**: Responsive with more presence

```text
┌─────────────────────────────────────────────────────────────┐
│  Property         │  Current    │  Updated                  │
├───────────────────┼─────────────┼───────────────────────────┤
│  font-size        │  12px       │  clamp(12px, 1.1vw, 15px) │
│  letter-spacing   │  0.02em     │  0.03em                   │
│  opacity          │  0.65       │  0.75                     │
└─────────────────────────────────────────────────────────────┘
```

### 4. Entrance Animations

Add staggered fade-up animations with smooth timing:

```text
Animation Timeline:
┌─────────────────────────────────────────────────────────────┐
│  Element          │  Delay    │  Duration   │  Effect      │
├───────────────────┼───────────┼─────────────┼──────────────┤
│  Logo             │  0ms      │  600ms      │  fade + rise │
│  Headline         │  100ms    │  700ms      │  fade + rise │
│  Feature line     │  250ms    │  600ms      │  fade + rise │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### File: `src/index.css`

**Updates to `.tru-hero-logo`:**
- Increase base height to 80px
- Add responsive breakpoints for 96px (1200px+) and 110px (1440px+)
- Add entrance animation

**Updates to `.tru-hero-headline`:**
- Increase font-size clamp to `clamp(40px, 6vw, 72px)`
- Bump font-weight to 900
- Tighten letter-spacing to -0.035em
- Reduce line-height to 1.02
- Increase bottom margin to 16px
- Add entrance animation with 100ms delay

**Updates to `.tru-hero-accent`:**
- Enhance green glow with additional drop-shadow layer

**Updates to `.tru-hero-feature-line`:**
- Make font-size responsive: `clamp(12px, 1.1vw, 15px)`
- Increase letter-spacing to 0.03em
- Brighten opacity to 0.75
- Add entrance animation with 250ms delay

**New keyframes to add:**
```css
@keyframes hero-element-enter {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Animation utility classes:**
```css
.tru-hero-logo {
  animation: hero-element-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

.tru-hero-headline {
  animation: hero-element-enter 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
  opacity: 0;
}

.tru-hero-feature-line {
  animation: hero-element-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards;
  opacity: 0;
}
```

### File: `src/pages/Index.tsx`

No changes required - the CSS handles all animation and sizing updates.

---

## Visual Result

The hero left column will have significantly more visual presence on wide screens:
- **Logo**: 50% larger on desktop (110px vs 72px)
- **Headline**: 24% larger max size (72px vs 58px) with bolder weight
- **Feature line**: 25% larger max size (15px vs 12px) with better contrast

The staggered entrance animations create a polished, sequential reveal that draws the eye from the logo down to the headline and feature line.

