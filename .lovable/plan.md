
# Navigation Dropdown Polish Plan

## Overview
Refine the mega-menu hover previews with entrance animations, improved typography, and cohesive spacing to create a premium, unified look.

---

## Changes

### 1. Add Entrance Animations for Preview Images
Create smooth, staggered entrance animations when the dropdown appears:

- **Preview card**: Subtle scale-up (0.95 → 1) + fade-in with 80ms delay
- **Image**: Additional subtle zoom effect (1.08 → 1) creating depth
- **Caption**: Slide up from bottom with fade (100ms delay after image)
- **Header/CTA elements**: Fade in with 120ms delay for sequential reveal

```text
Animation Timeline:
┌─────────────────────────────────────────┐
│  0ms   │ Dropdown container fades in    │
│  50ms  │ Preview image scales up        │
│  80ms  │ Badge appears with pop         │
│ 120ms  │ Caption slides up              │
│ 160ms  │ Title + tagline fade in        │
│ 200ms  │ CTA button enters              │
└─────────────────────────────────────────┘
```

### 2. Typography & Font Cohesion
Standardize fonts across all dropdown elements:

- **Title**: 15px, font-weight 700, letter-spacing -0.01em
- **Tagline**: 13px, font-weight 500, muted foreground
- **Caption highlight**: 13px, font-weight 600, with subtle green accent
- **Badge**: 9px uppercase, tracking 0.05em
- **CTA button**: 13px, font-weight 600

### 3. Spacing & Layout Improvements
Tighten the visual rhythm:

```text
┌────────────────────────────────────┐
│  Preview Image (16:10 ratio)       │  ← 12px padding
│  ┌──────────────────────────────┐  │
│  │  Badge ──────────────────────│  │  ← 8px from top-right
│  └──────────────────────────────┘  │
├────────────────────────────────────┤
│  Caption: "Scan any room..."       │  ← 12px vertical padding
├────────────────────────────────────┤
│  🔧 AI Move Estimator              │  ← 10px gap
│  Point. Scan. Price.               │
├────────────────────────────────────┤
│  [Scan Room]  [Build Manually]     │  ← 10px gap, 8px between pills
├────────────────────────────────────┤
│  [Try It Now →]                    │  ← 12px bottom padding
└────────────────────────────────────┘

Padding: 14px (down from 16px)
Card border-radius: 14px (more refined)
Image border-radius: 10px
```

### 4. Visual Refinements
- **Softer shadow**: More subtle, layered shadow for premium feel
- **Border**: Thinner 0.5px border with lower opacity
- **Caption background**: Gradient fade from transparent to card background
- **Badge styling**: Frosted glass effect with backdrop-blur

---

## Technical Details

### Files to Modify

**`src/index.css`** (mega-menu section):
- Add new keyframes: `mega-preview-enter`, `mega-caption-enter`, `mega-content-stagger`
- Update `.mega-preview-card` with animation delay and easing
- Refine spacing values throughout dropdown components
- Improve typography with consistent font sizes and weights
- Add gradient overlays and enhanced shadows

**`src/components/layout/Header.tsx`**:
- No structural changes needed - CSS handles all animations
- Current preview components work as-is

### New CSS Keyframes
```css
@keyframes mega-preview-enter {
  from { 
    opacity: 0; 
    transform: scale(0.96); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}

@keyframes mega-caption-slide {
  from { 
    opacity: 0; 
    transform: translateY(6px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes mega-badge-pop {
  from { 
    opacity: 0; 
    transform: scale(0.8); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}
```

---

## Result
The dropdowns will feel more polished and intentional - like a premium software product rather than a generic template. The staggered animations create visual interest without feeling slow, and the consistent typography establishes brand cohesion.
