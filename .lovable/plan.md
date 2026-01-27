

# Hero Section Refactor Plan

## Current Issues Identified

Based on my analysis of `src/pages/Index.tsx` and `src/index.css`:

1. **Hero Width**: The hero section uses `max-width: 1480px` with centered margins, but the background image is constrained to this container instead of spanning full viewport width
2. **Route Bar Overlap**: The permanent route summary bar (`.tru-qb-route-bar-permanent`) is positioned within the form flow but may overlap inputs on certain screen sizes
3. **Typography Issues**: 
   - H1 and subheadline have similar visual weights
   - Text shadows exist but gradient overlay may be too subtle in bright areas
4. **Right Feature Card**: 
   - Uses green-on-green icons (`.tru-hero-feature-icon` with `hsl(var(--tm-leaf) / 0.1)` background)
   - Basic card styling that could be improved
   - Needs better alignment with form
5. **Large Map Element**: The form includes a large Mapbox static preview in the route bar center
6. **Responsive Issues**: Mobile stacking needs verification

---

## Technical Changes

### File 1: `src/pages/Index.tsx`

**Change 1: Restructure Hero to Full-Width Container**

Wrap the hero section in a new full-width container that allows the background to span edge-to-edge while keeping content within the max-width constraint.

```tsx
// Current structure:
<section className="tru-hero tru-hero-split">
  <div className="tru-hero-bg-image">...</div>
  {/* content */}
</section>

// New structure:
<section className="tru-hero-wrapper">
  <div className="tru-hero-bg-image">...</div>
  <div className="tru-hero tru-hero-split">
    {/* content without background */}
  </div>
</section>
```

**Change 2: Remove Route Bar from Form, Add Mini Satellite Previews**

Replace the current permanent route bar with inline mini satellite thumbnails beneath each From/To input:

```tsx
// FROM input section with mini preview
<div className="tru-qb-location-col">
  <p className="tru-qb-section-label"><MapPin className="w-3 h-3" /> From</p>
  <div className="tru-qb-input-wrap">
    <LocationAutocomplete ... />
  </div>
  {/* NEW: Mini satellite preview */}
  {fromCoords && (
    <div className="tru-qb-mini-satellite">
      <img 
        src={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${fromCoords[0]},${fromCoords[1]},14,0/100x60@2x?access_token=...`}
        alt="Origin preview"
      />
    </div>
  )}
</div>

// Same pattern for TO input

// Distance displayed as simple text between the inputs
<div className="tru-qb-route-connector">
  {distance > 0 ? (
    <span className="tru-qb-route-distance-text">{distance.toLocaleString()} mi</span>
  ) : (
    <ArrowRight className="w-4 h-4" />
  )}
</div>
```

**Change 3: Rebuild Right Feature Card**

Replace the current feature card with a properly structured value proposition panel:

```tsx
<div className="tru-hero-content-panel">
  <div className="tru-hero-feature-card">
    <div className="tru-feature-card-header">
      <span className="tru-feature-badge">Why TruMove</span>
      <h2 className="tru-feature-card-title">Skip the Van Line</h2>
      <p className="tru-feature-card-subtitle">
        We use AI and verified data to find you the right mover.
      </p>
    </div>
    
    <div className="tru-feature-list">
      <div className="tru-feature-row">
        <div className="tru-feature-row-icon">
          <Camera className="w-5 h-5" />
        </div>
        <div className="tru-feature-row-text">
          <span className="tru-feature-row-title">AI Room Scanner</span>
          <span className="tru-feature-row-desc">Snap photos, get instant inventory estimates</span>
        </div>
      </div>
      <div className="tru-feature-row">
        <div className="tru-feature-row-icon">
          <Video className="w-5 h-5" />
        </div>
        <div className="tru-feature-row-text">
          <span className="tru-feature-row-title">Live Video Consults</span>
          <span className="tru-feature-row-desc">Walkthrough your home with a move specialist</span>
        </div>
      </div>
      <div className="tru-feature-row">
        <div className="tru-feature-row-icon">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="tru-feature-row-text">
          <span className="tru-feature-row-title">FMCSA Carrier Vetting</span>
          <span className="tru-feature-row-desc">Real safety data, not just reviews</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

### File 2: `src/index.css`

**Change 1: Full-Width Hero Wrapper**

Add new wrapper styles to enable edge-to-edge background:

```css
/* Hero wrapper spans full viewport width */
.tru-hero-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

/* Background image now inside wrapper, spans full width */
.tru-hero-wrapper .tru-hero-bg-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.tru-hero-wrapper .tru-hero-bg-image img {
  width: 100%;
  height: 120%;
  object-fit: cover;
  object-position: center 30%;
}

/* Improved gradient overlay - lighter at top */
.tru-hero-wrapper .tru-hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    hsl(var(--background) / 0.25) 0%,
    hsl(var(--background) / 0.5) 20%,
    hsl(var(--background) / 0.75) 45%,
    hsl(var(--background) / 0.92) 70%,
    hsl(var(--background)) 100%
  );
  z-index: 1;
}

/* Hero content container - centered, with padding */
.tru-hero-wrapper .tru-hero.tru-hero-split {
  position: relative;
  z-index: 2;
  max-width: 1480px;
  margin: 0 auto;
  padding-top: 48px; /* Generous top spacing under navbar */
}
```

**Change 2: Typography Hierarchy Fix**

Update headline/subheadline sizing for clear visual hierarchy:

```css
/* H1 - Large and dominant */
.tru-hero-header-section .tru-hero-headline-main {
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 800;
  line-height: 1.1;
  color: hsl(var(--tm-ink));
  letter-spacing: -0.025em;
  text-shadow: 
    0 2px 8px hsl(var(--background) / 0.9),
    0 4px 24px hsl(var(--background) / 0.6);
}

/* Subheadline - 40-55% of H1 size */
.tru-hero-header-section .tru-hero-header-subheadline {
  font-size: clamp(14px, 2vw, 18px); /* Much smaller than H1 */
  font-weight: 500;
  color: hsl(var(--tm-ink) / 0.7);
  text-shadow: 0 1px 8px hsl(var(--background) / 0.8);
  max-width: 600px;
}
```

**Change 3: Mini Satellite Preview Styles**

Add compact satellite preview thumbnails for From/To inputs:

```css
/* Mini satellite preview beneath inputs */
.tru-qb-mini-satellite {
  width: 100%;
  height: 48px;
  margin-top: 8px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid hsl(var(--tm-ink) / 0.1);
  background: hsl(var(--muted) / 0.5);
}

.tru-qb-mini-satellite img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Route distance text only */
.tru-qb-route-distance-text {
  font-size: 13px;
  font-weight: 700;
  color: hsl(var(--tm-ink));
  background: hsl(var(--primary) / 0.1);
  padding: 4px 12px;
  border-radius: 100px;
  border: 1px solid hsl(var(--primary) / 0.2);
}
```

**Change 4: Rebuilt Feature Card (No Green-on-Green)**

Replace current feature card with properly aligned, high-contrast design:

```css
/* Feature card container - aligned with form */
.tru-hero-feature-card {
  background: hsl(var(--card) / 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--tm-ink) / 0.1);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 
    0 4px 12px hsl(var(--tm-ink) / 0.06),
    0 12px 32px hsl(var(--tm-ink) / 0.08);
}

.tru-feature-card-header {
  margin-bottom: 24px;
}

.tru-feature-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: hsl(var(--tm-ink) / 0.5);
  background: hsl(var(--tm-ink) / 0.06);
  padding: 4px 10px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.tru-feature-card-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: hsl(var(--tm-ink));
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.tru-feature-card-subtitle {
  font-size: 0.9rem;
  color: hsl(var(--tm-ink) / 0.65);
  line-height: 1.5;
  margin: 0;
}

/* Feature rows - consistent alignment */
.tru-feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tru-feature-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px;
  border-radius: 12px;
  background: hsl(var(--tm-ink) / 0.02);
  border: 1px solid hsl(var(--tm-ink) / 0.04);
  transition: all 0.2s ease;
}

.tru-feature-row:hover {
  background: hsl(var(--tm-ink) / 0.04);
  border-color: hsl(var(--tm-ink) / 0.08);
}

/* Icons - NEUTRAL background, NOT green-on-green */
.tru-feature-row-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: hsl(var(--tm-ink) / 0.08);
  border-radius: 10px;
  color: hsl(var(--tm-ink));
  flex-shrink: 0;
}

.tru-feature-row-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tru-feature-row-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: hsl(var(--tm-ink));
}

.tru-feature-row-desc {
  font-size: 0.8rem;
  color: hsl(var(--tm-ink) / 0.6);
  line-height: 1.4;
}
```

**Change 5: Form Card Frosted Glass + Remove Route Bar**

Update form card for better contrast and remove the overlapping route bar:

```css
/* Form card with stronger frosted glass effect */
.tru-floating-form-card {
  background: hsl(var(--card) / 0.97);
  backdrop-filter: blur(16px);
  border: 1px solid hsl(var(--tm-ink) / 0.1);
  border-radius: 24px;
  box-shadow: 
    0 4px 16px hsl(var(--tm-ink) / 0.08),
    0 12px 40px hsl(var(--tm-ink) / 0.1);
}

/* Remove permanent route bar styles - replaced with mini previews */
.tru-qb-route-bar-permanent {
  display: none; /* Removed entirely */
}
```

**Change 6: Responsive Breakpoints**

Ensure proper stacking on mobile:

```css
@media (max-width: 1024px) {
  .tru-hero-wrapper .tru-hero.tru-hero-split {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 32px 20px 48px;
  }
  
  .tru-hero-right-half {
    grid-column: 1;
    grid-row: 2;
    width: 100%;
  }
  
  .tru-hero-content-panel {
    grid-column: 1;
    grid-row: 3;
    padding-left: 0;
  }
  
  .tru-hero-right-half .tru-hero-form-panel {
    min-width: 0;
    max-width: 100%;
  }
  
  .tru-hero-feature-card {
    margin-top: 16px;
  }
}

@media (max-width: 640px) {
  .tru-hero-header-section .tru-hero-headline-main {
    font-size: 28px;
  }
  
  .tru-qb-location-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .tru-qb-route-connector {
    transform: rotate(90deg);
    margin: 8px 0;
  }
}
```

---

## Visual Result

```text
+------------------------------------------------------------------+
|  [HERO IMAGE - Full viewport width background with parallax]     |
|  +------------------------------------------------------------+  |
|  | [Gradient Overlay - very light at top, solid at bottom]   |  |
|  |                                                            |  |
|  |      [Logo] A Smarter Way To Move.  <-- Large H1           |  |
|  |      Designed to put you in control.  <-- Small subheadline|  |
|  |                                                            |  |
|  |  +-------------------+    +---------------------------+    |  |
|  |  | FORM CARD         |    | FEATURE CARD             |    |  |
|  |  | [Header: Let      |    | [Why TruMove badge]      |    |  |
|  |  |  TruMove find...] |    | Skip the Van Line        |    |  |
|  |  |                   |    | We use AI and verified   |    |  |
|  |  | From: ________    |    | data to find you the     |    |  |
|  |  | [mini sat. img]   |    | right mover.             |    |  |
|  |  |                   |    |                          |    |  |
|  |  |   <-- 953 mi -->  |    | [Icon] AI Room Scanner   |    |  |
|  |  |                   |    |   Snap photos, get...    |    |  |
|  |  | To: __________    |    |                          |    |  |
|  |  | [mini sat. img]   |    | [Icon] Video Consults    |    |  |
|  |  |                   |    |   Walkthrough your...    |    |  |
|  |  | Date: ________    |    |                          |    |  |
|  |  | [Analyze Route]   |    | [Icon] FMCSA Vetting     |    |  |
|  |  +-------------------+    |   Real safety data...    |    |  |
|  |                           +---------------------------+    |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

---

## Summary of Changes

| Area | Before | After |
|------|--------|-------|
| Hero Background | Constrained to 1480px container | Full viewport width wrapper |
| Typography | H1/subhead similar size | H1 dominant (64px), subhead small (18px) |
| Overlay | 35-95% gradient | 25-100% lighter gradient |
| Route Bar | Overlapping permanent bar with mini-map | Removed, replaced with inline satellite previews |
| Distance | In route bar with map | Simple text badge between inputs |
| Feature Card | Green-on-green icons, flat styling | Neutral icons, shadowed card with rows |
| Mobile | May have overlap issues | Clean vertical stacking |

---

## Files to Modify

1. **`src/pages/Index.tsx`**
   - Wrap hero in new `.tru-hero-wrapper`
   - Remove `.tru-qb-route-bar-permanent` component
   - Add mini satellite previews beneath From/To inputs
   - Show distance as text in route connector
   - Rebuild feature card with new structure

2. **`src/index.css`**
   - Add `.tru-hero-wrapper` full-width styles
   - Update gradient overlay to be lighter
   - Fix typography hierarchy (H1 >> subheadline)
   - Add `.tru-qb-mini-satellite` styles
   - Add `.tru-qb-route-distance-text` styles
   - Add new `.tru-hero-feature-card` and `.tru-feature-row` styles
   - Remove/hide `.tru-qb-route-bar-permanent` styles
   - Update responsive breakpoints

