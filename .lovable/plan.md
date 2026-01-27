
# Hero Section Refactoring Plan

## Overview

This plan refactors ONLY the hero section of the homepage to create a premium, trust-first, technology-forward experience. The scope is limited to:
- The headline area (top zone)
- The left route form card
- The right information cards ("Why TruMove" + "Live Truck Tracking" placeholder)

No modifications will be made to global navigation, the SAFER trust strip, or any sections below the hero.

---

## Architecture

### Current Structure
```text
+--------------------------------------------------+
|  Hero Header (Full Width)                        |
|  [H1 + Subheadline]                             |
+------------------------+-------------------------+
|  LEFT: Form Card       |  RIGHT: Why TruMove     |
|  (520px fixed width)   |  Card Only              |
+------------------------+-------------------------+
```

### Target Structure
```text
+--------------------------------------------------+
|  HEADLINE ZONE (Full Width, Centered)            |
|  H1: "A Smarter Way To Move."                   |
|  Sub: "Technology, transparency, and control..." |
|  [Subtle dark gradient overlay behind text only] |
+------------------------+-------------------------+
|  LEFT: Route Form      |  RIGHT: Stacked Cards   |
|  - From input          |  CARD 1: Why TruMove    |
|  - Satellite preview   |  - Badge + Title        |
|  - To input            |  - Main paragraph       |
|  - Satellite preview   |  - 6 Feature rows       |
|  - Distance row (LOCK) |  - Trust indicators     |
|  - Move date picker    |  +-----------------------+
|  - Analyze button      |  CARD 2: Live Tracking  |
+------------------------+  - Coming Soon badge    |
                         |  - Placeholder content  |
                         +-------------------------+
```

---

## Detailed Implementation

### 1. Headline Zone Refactoring

**File: `src/pages/Index.tsx` (lines ~727-734)**

Changes:
- Update the H1 text to: "A Smarter Way To Move."
- Update subheadline to: "Technology, transparency, and control - built for the most important move of your life."
- Remove em-dashes and simplify typography
- Add subtle dark gradient overlay class behind text zone only

```tsx
{/* Hero Header with Headline + Short Subheadline */}
<div className="tru-hero-header-section tru-hero-header-refined">
  <h1 className="tru-hero-headline-main">
    A Smarter Way To <span className="tru-hero-headline-accent">Move</span>.
  </h1>
  <p className="tru-hero-subheadline-refined">
    Technology, transparency, and control - built for the most important move of your life.
  </p>
</div>
```

**File: `src/index.css`**

New/updated CSS:
- `.tru-hero-header-refined`: Add subtle dark gradient overlay behind text only (not full hero)
- Reduce H1 size from `clamp(40px, 6vw, 72px)` to `clamp(32px, 5vw, 56px)`
- Reduce subheadline size to 45-55% of headline
- Ensure high contrast over background

---

### 2. Left Form Card - Lock Existing Structure

**File: `src/pages/Index.tsx` (lines ~769-900)**

The form structure remains largely the same. Key confirmations:
- Keep From/To location inputs with satellite thumbnails appearing below each after validation
- Lock the permanent distance row exactly as specified
- Keep move date picker and Analyze Route button
- Form order: From -> From satellite -> To -> To satellite -> Distance row -> Move date -> Analyze button

**Satellite Thumbnail Behavior:**
- When user enters valid city/ZIP in From: Show satellite thumbnail directly under From input
- Same for To field
- Satellite view: Top-down, zoom level 13 (already implemented correctly)
- Add subtle fade + zoom-in animation on load

**File: `src/index.css`**

Add animation for satellite thumbnails:
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
  animation: thumb-zoom-in 0.4s ease-out;
}
```

---

### 3. Right Panel - Card 1: "Why TruMove" (Complete Redesign)

**File: `src/pages/Index.tsx` (lines ~1259-1308)**

Replace current 4-feature grid with full 6-feature clickable rows design:

```tsx
{/* RIGHT SIDE: Why TruMove Card - Premium Polished */}
<div className="tru-hero-content-panel">
  <div className="tru-why-card-premium">
    <div className="tru-why-card-inner">
      {/* Header */}
      <div className="tru-why-header">
        <span className="tru-why-badge">Why TruMove</span>
      </div>
      
      {/* Title */}
      <h3 className="tru-why-title">Skip the Van Line Middleman</h3>
      
      {/* Main Paragraph - VERBATIM from spec */}
      <p className="tru-why-paragraph">
        Skip the complexity of large national van lines. We use AI inventory 
        scanning and live video consults to understand your move, then vet 
        carriers using verified FMCSA and DOT safety data, so we can 
        confidently match you with carriers that best meet your needs.
      </p>
      
      {/* Feature Rows - All 6 features as clickable rows */}
      <div className="tru-why-feature-list">
        {whyTruMoveFeatures.map((feature, index) => (
          <button
            key={feature.id}
            className={`tru-why-feature-row ${activeFeature === index ? 'is-active' : ''}`}
            onClick={() => setActiveFeature(activeFeature === index ? null : index)}
          >
            <div className="tru-why-feature-row-icon">
              <feature.icon className="w-4 h-4" />
            </div>
            <div className="tru-why-feature-row-content">
              <span className="tru-why-feature-row-title">{feature.title}</span>
              <span className="tru-why-feature-row-desc">{feature.shortDesc}</span>
            </div>
            <ChevronRight className="w-4 h-4 tru-why-feature-arrow" />
          </button>
        ))}
      </div>
      
      {/* Expanded Detail (if any feature selected) */}
      {activeFeature !== null && (
        <div className="tru-why-detail-box">
          <p>{whyTruMoveFeatures[activeFeature].longDesc}</p>
        </div>
      )}
      
      {/* Bottom Trust Indicators */}
      <div className="tru-why-trust-row">
        <div className="tru-why-trust-item">
          <Shield className="w-3.5 h-3.5" />
          <span>FMCSA Verified</span>
        </div>
        <div className="tru-why-trust-item">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Licensed Broker</span>
        </div>
      </div>
    </div>
  </div>

  {/* CARD 2: Live Truck Tracking Placeholder */}
  <div className="tru-tracking-placeholder-card">
    <div className="tru-tracking-placeholder-inner">
      <span className="tru-tracking-coming-badge">Coming Soon</span>
      <h3 className="tru-tracking-placeholder-title">Live Truck Tracking</h3>
      <p className="tru-tracking-placeholder-desc">
        Track your truck in real time from pickup to delivery. View location, 
        status updates, and arrival windows directly in your dashboard.
      </p>
      {/* Status Chips */}
      <div className="tru-tracking-status-chips">
        <span className="tru-tracking-chip">En Route</span>
        <span className="tru-tracking-chip">At Pickup</span>
        <span className="tru-tracking-chip">In Transit</span>
        <span className="tru-tracking-chip">Arriving</span>
      </div>
      {/* Simple Route Illustration */}
      <div className="tru-tracking-route-illustration">
        <div className="tru-tracking-route-line" />
        <Truck className="w-5 h-5 tru-tracking-truck-icon" />
      </div>
    </div>
  </div>
</div>
```

**File: `src/index.css`**

Add new CSS for Why TruMove card redesign:

```css
/* WHY TRUMOVE - Feature Rows Design */
.tru-why-title {
  font-size: 20px;
  font-weight: 800;
  color: hsl(var(--tm-ink));
  margin: 0;
}

.tru-why-paragraph {
  font-size: 14px;
  line-height: 1.7;
  color: hsl(var(--tm-ink) / 0.7);
  margin: 0;
}

.tru-why-feature-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tru-why-feature-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: hsl(var(--background));
  border: 1px solid hsl(var(--tm-ink) / 0.08);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.tru-why-feature-row:hover {
  border-color: hsl(var(--primary) / 0.3);
  background: hsl(var(--primary) / 0.02);
  transform: translateX(4px);
}

.tru-why-feature-row.is-active {
  border-color: hsl(var(--primary) / 0.4);
  background: hsl(var(--primary) / 0.05);
}

.tru-why-feature-row-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(var(--muted));
  border: 1px solid hsl(var(--tm-ink) / 0.08);
  border-radius: 10px;
  color: hsl(var(--tm-ink));
  flex-shrink: 0;
}

.tru-why-feature-row:hover .tru-why-feature-row-icon,
.tru-why-feature-row.is-active .tru-why-feature-row-icon {
  background: hsl(var(--primary) / 0.1);
  border-color: hsl(var(--primary) / 0.2);
  color: hsl(var(--tm-ink));
  box-shadow: 0 0 8px hsl(var(--primary) / 0.15);
}

.tru-why-feature-row-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tru-why-feature-row-title {
  font-size: 13px;
  font-weight: 600;
  color: hsl(var(--tm-ink));
}

.tru-why-feature-row-desc {
  font-size: 11px;
  color: hsl(var(--tm-ink) / 0.55);
}

.tru-why-feature-arrow {
  color: hsl(var(--tm-ink) / 0.3);
  transition: all 0.2s ease;
}

.tru-why-feature-row:hover .tru-why-feature-arrow {
  color: hsl(var(--primary));
  transform: translateX(2px);
}
```

---

### 4. Right Panel - Card 2: "Live Truck Tracking" Placeholder

**File: `src/index.css`**

Add new CSS for tracking placeholder card:

```css
/* LIVE TRUCK TRACKING PLACEHOLDER */
.tru-tracking-placeholder-card {
  position: relative;
  background: linear-gradient(135deg, 
    hsl(var(--background)) 0%, 
    hsl(var(--muted) / 0.6) 100%
  );
  border: 1px solid hsl(var(--tm-ink) / 0.08);
  border-radius: 20px;
  overflow: hidden;
}

.tru-tracking-placeholder-inner {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tru-tracking-coming-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 4px 10px;
  background: hsl(var(--tm-ink) / 0.06);
  border: 1px solid hsl(var(--tm-ink) / 0.1);
  border-radius: 100px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: hsl(var(--tm-ink) / 0.5);
}

.tru-tracking-placeholder-title {
  font-size: 18px;
  font-weight: 700;
  color: hsl(var(--tm-ink));
  margin: 0;
}

.tru-tracking-placeholder-desc {
  font-size: 13px;
  line-height: 1.6;
  color: hsl(var(--tm-ink) / 0.6);
  margin: 0;
}

.tru-tracking-status-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.tru-tracking-chip {
  padding: 4px 10px;
  background: hsl(var(--muted));
  border: 1px solid hsl(var(--tm-ink) / 0.06);
  border-radius: 100px;
  font-size: 10px;
  font-weight: 600;
  color: hsl(var(--tm-ink) / 0.6);
}

.tru-tracking-route-illustration {
  position: relative;
  height: 40px;
  margin-top: 8px;
  display: flex;
  align-items: center;
}

.tru-tracking-route-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    hsl(var(--muted)) 0%, 
    hsl(var(--primary) / 0.3) 50%,
    hsl(var(--muted)) 100%
  );
  border-radius: 2px;
}

.tru-tracking-truck-icon {
  position: absolute;
  left: 45%;
  color: hsl(var(--tm-ink) / 0.4);
  animation: truck-drift 3s ease-in-out infinite;
}

@keyframes truck-drift {
  0%, 100% { left: 40%; }
  50% { left: 55%; }
}
```

---

### 5. Hero Header Background Fix

**File: `src/index.css`**

Update the hero header section to have a subtle dark gradient overlay ONLY behind the text zone:

```css
.tru-hero-header-section.tru-hero-header-refined {
  position: relative;
  padding: 32px 48px;
}

.tru-hero-header-section.tru-hero-header-refined::before {
  content: '';
  position: absolute;
  inset: -20px -40px;
  background: linear-gradient(
    180deg,
    hsl(var(--tm-ink) / 0.02) 0%,
    hsl(var(--tm-ink) / 0.06) 50%,
    hsl(var(--tm-ink) / 0.02) 100%
  );
  border-radius: 24px;
  z-index: -1;
  backdrop-filter: blur(8px);
}

/* Refined headline - smaller, cleaner */
.tru-hero-header-refined .tru-hero-headline-main {
  font-size: clamp(32px, 5vw, 56px);
  margin-bottom: 12px;
}

.tru-hero-subheadline-refined {
  font-size: clamp(14px, 1.8vw, 20px);
  line-height: 1.5;
  color: hsl(var(--tm-ink) / 0.7);
  max-width: 600px;
  margin: 0 auto;
  font-weight: 500;
}
```

---

### 6. Form Card Background Polish

**File: `src/index.css`**

Ensure form card and content panel cards have proper backdrop-blur and no visible edge cutoff:

```css
/* Already exists at line 24115-24121, verify and enhance */
.tru-floating-form-card {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: hsl(var(--background) / 0.98);
  overflow: hidden;
  border-radius: 24px;
  box-shadow: 
    0 4px 20px hsl(var(--tm-ink) / 0.06),
    0 1px 3px hsl(var(--tm-ink) / 0.04);
}

.tru-why-card-premium {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

---

## Technical Summary

### Files Modified
1. **`src/pages/Index.tsx`** - Hero section JSX restructuring
2. **`src/index.css`** - CSS for all new card designs and refinements

### Key Changes
| Component | Change |
|-----------|--------|
| H1 Headline | Reduced size, text remains "A Smarter Way To Move." |
| Subheadline | Simplified: "Technology, transparency, and control - built for the most important move of your life." |
| Header backdrop | Subtle dark gradient overlay ONLY behind text zone |
| Form Card | Lock existing structure, add satellite thumbnail animation |
| Why TruMove | Complete redesign: Title + paragraph + 6 clickable feature rows + trust badges |
| Live Tracking | New placeholder card with Coming Soon badge, description, status chips, route illustration |

### Design Principles Applied
- **Brand colors**: Black + white base with subtle neon green accents only
- **Clean, modern, premium**: No cartoon styling, no heavy gradients
- **Tech-forward but trustworthy**: Feature rows with hover states, subtle animations
- **No gimmicks**: All elements serve a purpose

### Interaction Details
- Feature rows: Hover highlight + right arrow + pointer cursor
- Satellite thumbnails: Fade + zoom-in animation on load (0.4s ease-out)
- Distance row: Appears only after both inputs are valid (keep existing behavior)
- Tracking card: Non-interactive placeholder with subtle truck animation
