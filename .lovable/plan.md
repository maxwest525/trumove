

# Hero Section Premium Refactor Plan

## Overview

This plan refactors ONLY the hero section to create a premium, trust-first, technology-forward design reflecting TruMove's mission of using technology, transparency, and verified government data to give customers control, clarity, and confidence.

**Brand Style**: Black + white base with subtle neon green accents. Clean, modern, premium. Tech-forward but human and trustworthy. No cartoon styling, no heavy gradients, no gimmicks.

---

## 1. Layout Structure: Full-Width 3-Zone Design

**Goal**: Restructure the hero into a clear 3-zone layout

```text
+=====================================================================+
| A) TOP ZONE: Headline + Short Subheadline (centered, over bg image) |
+=====================================================================+
|                                                                     |
|  +-------------------------+   +----------------------------+       |
|  | B) ROUTE FORM CARD     |   | C1) WHY TRUMOVE CARD       |       |
|  |   - From input         |   |   - Label, title, paragraph |       |
|  |   - Satellite thumb    |   |   - 6 clickable features   |       |
|  |   - To input           |   +----------------------------+       |
|  |   - Satellite thumb    |                                        |
|  |   - Distance row       |   +----------------------------+       |
|  |   - Move date          |   | C2) LIVE TRACKING CARD     |       |
|  |   - CTA button         |   |   - Coming soon preview    |       |
|  +-------------------------+   +----------------------------+       |
|                                                                     |
+=====================================================================+
```

### CSS Grid Changes

**File: `src/index.css`**

Update `.tru-hero.tru-hero-split` to a 3-row grid:

```css
.tru-hero.tru-hero-split {
  display: grid;
  grid-template-columns: 520px 1fr;
  grid-template-rows: auto 1fr;
  gap: 32px 48px;
  padding: 56px 48px 48px 48px;
  max-width: 1480px;
  margin: 0 auto;
}
```

---

## 2. Zone A: Headline + Short Subheadline

**Goal**: Premium, mission-driven headline with a short subheadline (NOT the long paragraph)

### Content (Exact)

**Headline**:
```
A Smarter Way To Move.
```

**Subheadline** (short version):
```
Technology, transparency, and control — built for the most important move of your life.
```

### Styling

**File: `src/index.css`**

```css
/* Dark gradient overlay ONLY behind the text zone */
.tru-hero-header-section::before {
  content: '';
  position: absolute;
  inset: -30px -60px;
  background: linear-gradient(
    180deg,
    hsl(var(--tm-ink) / 0.03) 0%,
    hsl(var(--tm-ink) / 0.08) 100%
  );
  border-radius: 24px;
  z-index: -1;
  backdrop-filter: blur(12px);
}

/* H1 - Dominant */
.tru-hero-header-section .tru-hero-headline-main {
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: hsl(var(--tm-ink));
  text-shadow: 0 2px 16px hsl(var(--background) / 0.5);
}

/* Subheadline - 45-55% of H1 */
.tru-hero-header-section .tru-hero-subheadline-short {
  font-size: clamp(16px, 2vw, 24px); /* ~45% of H1 max */
  font-weight: 500;
  line-height: 1.5;
  color: hsl(var(--tm-ink) / 0.75);
  max-width: 700px;
  margin: 0 auto;
  text-shadow: 0 1px 8px hsl(var(--background) / 0.4);
}

/* "Move" accent - readable, not neon */
.tru-hero-headline-accent {
  color: hsl(var(--tm-ink));
  position: relative;
}

.tru-hero-headline-accent::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  height: 5px;
  background: hsl(var(--primary));
  border-radius: 3px;
  opacity: 0.9;
}
```

### JSX Update

**File: `src/pages/Index.tsx`** - Lines ~727-735

```tsx
<div className="tru-hero-header-section">
  <h1 className="tru-hero-headline-main">
    A Smarter Way To <span className="tru-hero-headline-accent">Move</span>.
  </h1>
  <p className="tru-hero-subheadline-short">
    Technology, transparency, and control — built for the most important move of your life.
  </p>
</div>
```

- Remove the inline logo from the headline (cleaner)
- Remove the backdrop blur div (use pseudo-element instead)

---

## 3. Zone B: Route Form Card (Preserve Existing)

**Goal**: Lock the form structure exactly as-is, but ensure satellite thumbnails and distance row work per spec.

### Form Order (LOCKED)

1. From input
2. From satellite preview (after validation)
3. To input
4. To satellite preview (after validation)
5. Distance row (appears after both inputs validate)
6. Move date
7. "Analyze Route" button

### Satellite Thumbnail Behavior

Current implementation already correct:
- 60px fixed height
- Mapbox Static API at zoom 13 (top-down view)
- Fade-in animation on appear

### Distance Row (HARD LOCK - No Changes)

The existing `.tru-qb-route-summary` strip is already correct:
- 3-column grid: Origin | Distance + "LONG DISTANCE" badge | Destination
- Appears between inputs and move date
- No styling changes

### Minor Animation Enhancement

Add subtle zoom animation to satellite thumbnails:

**File: `src/index.css`**

```css
@keyframes thumb-zoom-in {
  from {
    opacity: 0;
    transform: scale(1.15);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.tru-qb-satellite-thumb {
  animation: thumb-zoom-in 0.5s ease-out forwards;
}
```

---

## 4. Zone C1: "Why TruMove" Card (Complete Redesign)

**Goal**: Information-dense card with the long paragraph and 6 clickable feature rows.

### Content Structure

**Label**: `WHY TRUMOVE`

**Title**: `Skip the Van Line Middleman`

**Main Paragraph (VERBATIM)**:
```
Skip the complexity of large national van lines. We use AI inventory scanning and live video consults to understand your move, then vet carriers using verified FMCSA and DOT safety data, so we can confidently match you with carriers that best meet your needs.
```

**Feature Rows** (6 items):

| Icon | Title | Description |
|------|-------|-------------|
| Scan | AI Room Scanner | Instant inventory from photos or video |
| Video | Live Video Consults | Walk your home with a moving specialist |
| ShieldCheck | FMCSA + DOT Safety Vetting | Verified federal safety and compliance data |
| Shield | Authority Verification | Confirm licensing and operating authority |
| CreditCard | Insurance Coverage Checks | Validated cargo and liability coverage |
| Zap | Real-Time Updates | Know exactly where your move stands |

### JSX Update

**File: `src/pages/Index.tsx`**

Update the `whyTruMoveFeatures` array (lines ~293-336):

```tsx
const whyTruMoveFeatures = [
  {
    id: 'ai-scanner',
    icon: Scan,
    title: 'AI Room Scanner',
    shortDesc: 'Instant inventory from photos or video',
    longDesc: 'Upload photos of your rooms and our AI automatically identifies furniture, calculates weight and volume, and generates an accurate inventory list in seconds.'
  },
  {
    id: 'video-consults',
    icon: Video,
    title: 'Live Video Consults',
    shortDesc: 'Walk your home with a moving specialist',
    longDesc: 'Schedule a live video call where a TruMove specialist walks through your home with you, providing personalized guidance and an accurate quote.'
  },
  {
    id: 'fmcsa-vetting',
    icon: ShieldCheck,
    title: 'FMCSA + DOT Safety Vetting',
    shortDesc: 'Verified federal safety and compliance data',
    longDesc: 'We query the federal SAFER Web Services database to verify operating authority, insurance coverage, and safety ratings for every carrier we recommend.'
  },
  {
    id: 'authority-check',
    icon: Shield,
    title: 'Authority Verification',
    shortDesc: 'Confirm licensing and operating authority',
    longDesc: 'Every carrier is checked for active operating authority status. We flag any revoked, suspended, or inactive licenses before you book.'
  },
  {
    id: 'insurance-check',
    icon: CreditCard,
    title: 'Insurance Coverage Checks',
    shortDesc: 'Validated cargo and liability coverage',
    longDesc: 'We verify that carriers maintain adequate bodily injury, property damage, and cargo insurance coverage that meets or exceeds federal minimums.'
  },
  {
    id: 'transparency',
    icon: Zap,
    title: 'Real-Time Updates',
    shortDesc: 'Know exactly where your move stands',
    longDesc: 'Get real-time updates on carrier matching, booking status, and move day coordination. No black box - you see everything we see.'
  }
];
```

Update the Why TruMove card JSX (lines ~1239-1280):

```tsx
<div className="tru-hero-content-panel">
  {/* Card 1: Why TruMove */}
  <div className="tru-why-trumove-card">
    <span className="tru-why-label">WHY TRUMOVE</span>
    <h2 className="tru-why-title">Skip the Van Line Middleman</h2>
    <p className="tru-why-desc">
      Skip the complexity of large national van lines. We use AI inventory scanning and live video consults to understand your move, then vet carriers using verified FMCSA and DOT safety data, so we can confidently match you with carriers that best meet your needs.
    </p>
    
    <div className="tru-why-divider" />
    
    <div className="tru-why-features">
      {whyTruMoveFeatures.map((feature, index) => (
        <button
          key={feature.id}
          className={`tru-why-feature-row ${activeFeature === index ? 'is-active' : ''}`}
          onClick={() => setActiveFeature(activeFeature === index ? null : index)}
        >
          <div className="tru-why-feature-icon">
            <feature.icon className="w-4 h-4" />
          </div>
          <div className="tru-why-feature-text">
            <span className="tru-why-feature-title">{feature.title}</span>
            <span className="tru-why-feature-desc">{feature.shortDesc}</span>
          </div>
          <ChevronRight className="tru-why-feature-arrow" />
        </button>
      ))}
    </div>
    
    {activeFeature !== null && (
      <div className="tru-why-detail">
        <p>{whyTruMoveFeatures[activeFeature].longDesc}</p>
      </div>
    )}
  </div>
  
  {/* Card 2: Live Truck Tracking (Placeholder) */}
  <div className="tru-tracking-preview-card">
    {/* See Zone C2 below */}
  </div>
</div>
```

### Styling Updates

**File: `src/index.css`**

```css
/* Content panel - stacked cards on right side */
.tru-hero-content-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  grid-row: 2;
  grid-column: 2;
}

/* Why TruMove Card - Premium styling */
.tru-why-trumove-card {
  background: hsl(var(--background));
  border: 1px solid hsl(var(--tm-ink) / 0.1);
  border-radius: 20px;
  padding: 28px 32px;
  box-shadow: 
    0 4px 20px hsl(var(--tm-ink) / 0.06),
    0 8px 40px hsl(var(--tm-ink) / 0.04);
}

/* Label - Subtle green accent */
.tru-why-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: hsl(var(--primary));
  padding: 5px 12px;
  background: hsl(var(--primary) / 0.08);
  border: 1px solid hsl(var(--primary) / 0.15);
  border-radius: 6px;
  width: fit-content;
}

/* Title */
.tru-why-title {
  font-size: 1.625rem;
  font-weight: 800;
  color: hsl(var(--tm-ink));
  line-height: 1.2;
  margin: 16px 0 12px 0;
}

/* Main description - the long paragraph */
.tru-why-desc {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: hsl(var(--tm-ink) / 0.72);
  margin: 0;
}

/* Feature row - clickable with hover states */
.tru-why-feature-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.tru-why-feature-row:hover {
  background: hsl(var(--tm-ink) / 0.03);
  border-color: hsl(var(--tm-ink) / 0.08);
}

.tru-why-feature-row.is-active {
  background: hsl(var(--primary) / 0.06);
  border-color: hsl(var(--primary) / 0.15);
}

/* Icon - neutral background (NOT green-on-green) */
.tru-why-feature-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(var(--tm-ink) / 0.06);
  border-radius: 10px;
  flex-shrink: 0;
}

.tru-why-feature-icon svg {
  color: hsl(var(--tm-ink));
}

.tru-why-feature-row.is-active .tru-why-feature-icon {
  background: hsl(var(--primary) / 0.12);
}

.tru-why-feature-row.is-active .tru-why-feature-icon svg {
  color: hsl(var(--primary));
}

/* Arrow - appears on hover */
.tru-why-feature-arrow {
  width: 18px;
  height: 18px;
  margin-left: auto;
  color: hsl(var(--tm-ink) / 0.25);
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
}

.tru-why-feature-row:hover .tru-why-feature-arrow {
  opacity: 1;
  transform: translateX(0);
}

.tru-why-feature-row.is-active .tru-why-feature-arrow {
  opacity: 1;
  transform: rotate(90deg);
  color: hsl(var(--primary));
}
```

---

## 5. Zone C2: Live Truck Tracking Card (Placeholder)

**Goal**: Add a visually complete "Coming Soon" preview card below the Why TruMove card.

### Content

**Label**: `COMING SOON`

**Title**: `Live Truck Tracking`

**Description**:
```
Track your truck in real time from pickup to delivery. View location, status updates, and arrival windows directly in your dashboard.
```

**Visual Elements**:
- Simple route illustration (placeholder)
- Status chips: "En Route", "At Pickup", "In Transit", "Arriving"

### JSX

**File: `src/pages/Index.tsx`**

Add after the Why TruMove card (inside `.tru-hero-content-panel`):

```tsx
{/* Card 2: Live Truck Tracking (Placeholder) */}
<div className="tru-tracking-preview-card">
  <span className="tru-tracking-label">COMING SOON</span>
  <h3 className="tru-tracking-title">Live Truck Tracking</h3>
  <p className="tru-tracking-desc">
    Track your truck in real time from pickup to delivery. View location, status updates, and arrival windows directly in your dashboard.
  </p>
  
  {/* Route illustration placeholder */}
  <div className="tru-tracking-visual">
    <div className="tru-tracking-route-line">
      <div className="tru-tracking-dot tru-tracking-dot-origin" />
      <div className="tru-tracking-line-segment" />
      <Truck className="w-5 h-5 tru-tracking-truck-icon" />
      <div className="tru-tracking-line-segment tru-tracking-line-remaining" />
      <div className="tru-tracking-dot tru-tracking-dot-dest" />
    </div>
  </div>
  
  {/* Status chips */}
  <div className="tru-tracking-chips">
    <span className="tru-tracking-chip is-complete">At Pickup</span>
    <span className="tru-tracking-chip is-active">In Transit</span>
    <span className="tru-tracking-chip">En Route</span>
    <span className="tru-tracking-chip">Arriving</span>
  </div>
</div>
```

### Styling

**File: `src/index.css`**

```css
/* Live Tracking Preview Card */
.tru-tracking-preview-card {
  background: linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted) / 0.3) 100%);
  border: 1px solid hsl(var(--tm-ink) / 0.08);
  border-radius: 16px;
  padding: 20px 24px;
  opacity: 0.85;
}

.tru-tracking-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: hsl(var(--tm-ink) / 0.5);
  padding: 4px 10px;
  background: hsl(var(--tm-ink) / 0.05);
  border-radius: 4px;
}

.tru-tracking-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: hsl(var(--tm-ink));
  margin: 12px 0 8px 0;
}

.tru-tracking-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: hsl(var(--tm-ink) / 0.6);
  margin: 0 0 16px 0;
}

/* Route visualization */
.tru-tracking-visual {
  padding: 16px 0;
}

.tru-tracking-route-line {
  display: flex;
  align-items: center;
  gap: 0;
}

.tru-tracking-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tru-tracking-dot-origin {
  background: hsl(var(--primary));
  box-shadow: 0 0 0 4px hsl(var(--primary) / 0.2);
}

.tru-tracking-dot-dest {
  background: hsl(var(--tm-ink) / 0.3);
  border: 2px solid hsl(var(--tm-ink) / 0.2);
}

.tru-tracking-line-segment {
  flex: 1;
  height: 3px;
  background: hsl(var(--primary));
  border-radius: 2px;
}

.tru-tracking-line-remaining {
  background: hsl(var(--tm-ink) / 0.15);
}

.tru-tracking-truck-icon {
  color: hsl(var(--primary));
  flex-shrink: 0;
  margin: 0 -4px;
  animation: truck-bounce 2s ease-in-out infinite;
}

/* Status chips */
.tru-tracking-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tru-tracking-chip {
  font-size: 11px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 100px;
  background: hsl(var(--tm-ink) / 0.05);
  color: hsl(var(--tm-ink) / 0.5);
  border: 1px solid hsl(var(--tm-ink) / 0.08);
}

.tru-tracking-chip.is-active {
  background: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
  border-color: hsl(var(--primary) / 0.2);
}

.tru-tracking-chip.is-complete {
  background: hsl(var(--tm-ink) / 0.08);
  color: hsl(var(--tm-ink) / 0.7);
}
```

---

## 6. Responsive Adjustments

**File: `src/index.css`**

```css
@media (max-width: 1024px) {
  .tru-hero.tru-hero-split {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 24px;
  }
  
  .tru-hero-header-section {
    padding: 24px 20px;
  }
  
  .tru-hero-right-half {
    grid-column: 1;
    width: 100%;
  }
  
  .tru-hero-right-half .tru-hero-form-panel {
    min-width: auto;
    max-width: 100%;
  }
  
  .tru-hero-content-panel {
    grid-column: 1;
  }
}
```

---

## 7. Files Modified

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Update headline/subheadline text, add tracking card JSX, update feature icons/text |
| `src/index.css` | Update hero grid, headline styles, add tracking card styles, feature row refinements |

---

## 8. Quality Checklist

- [x] No giant blank white containers
- [x] No overlapping elements
- [x] No banner wrapping the entire hero
- [x] All typography readable (text shadows, backdrop blur)
- [x] Spacing intentional and balanced
- [x] Premium, trustworthy, tech-forward feel
- [x] Calm color palette (black/white + green accents only)
- [x] Distance row UNCHANGED (hard lock)
- [x] Feature rows have hover/active states with arrow indicators
- [x] Satellite thumbnails animate on load
- [x] No green-on-green icons

