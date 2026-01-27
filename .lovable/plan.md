
# Plan: Hero Section Refactor

## Overview

This plan refactors ONLY the hero section (headline, subheadline, left route form, right feature/value area) while preserving the global navigation, page sections below the hero, and site-wide styles.

---

## 0. HARD LOCK: Distance Bar (Match Screenshot)

**Status**: Keep EXACTLY as-is per the current implementation

The current distance bar in `src/pages/Index.tsx` (lines 776-800) and `src/index.css` (lines 4095-4212) already matches the screenshot requirements:
- 3-column grid: Origin (left), Distance + "LONG DISTANCE" pill (center), Destination (right)
- Appears between From/To inputs and Move Date field
- Will remain conditional (shows when either input validates)

**No changes needed** - the existing implementation is correct.

---

## 1. Route Inputs + Satellite Thumbnails Behavior

**File: `src/pages/Index.tsx`**

Add satellite thumbnail images beneath From/To inputs that appear after validation:

```tsx
{/* FROM input */}
<div className="tru-qb-location-col">
  <p className="tru-qb-section-label"><MapPin /> From</p>
  <div className="tru-qb-input-wrap">
    <LocationAutocomplete ... />
  </div>
  {/* NEW: Satellite thumbnail after validation */}
  {fromCoords && (
    <div className="tru-qb-satellite-thumb">
      <img 
        src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${fromCoords[0]},${fromCoords[1]},13,0/200x80@2x?access_token=...`}
        alt="Origin area"
      />
    </div>
  )}
</div>

{/* TO input - same pattern */}
```

**File: `src/index.css`**

Add satellite thumbnail styles:

```css
.tru-qb-satellite-thumb {
  margin-top: 8px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid hsl(var(--tm-ink) / 0.1);
  opacity: 0;
  animation: thumb-fade-in 0.4s ease-out forwards;
}

.tru-qb-satellite-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

**NO large route map** - only these small local area previews.

---

## 2. Hero Must Be Full-Width + Clean

**File: `src/index.css`**

Update `.tru-hero.tru-hero-split` to be full-width with proper padding:

```css
/* Hero wrapper for full-width background */
.tru-hero-wrapper {
  width: 100%;
  position: relative;
  overflow: hidden;
}

/* Full-width hero background image */
.tru-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.tru-hero-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
}

/* Gradient overlay - lighter at top, solid at bottom */
.tru-hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    hsl(var(--background) / 0.35) 0%,
    hsl(var(--background) / 0.6) 25%,
    hsl(var(--background) / 0.85) 50%,
    hsl(var(--background)) 75%
  );
}

/* Content grid sits above background */
.tru-hero.tru-hero-split {
  position: relative;
  z-index: 1;
  padding: 48px 24px 24px 48px; /* Increased top padding */
  /* ...existing grid styles */
}
```

**File: `src/pages/Index.tsx`**

Wrap the hero section in a new container structure:

```tsx
{/* Hero Section */}
<div className="tru-hero-wrapper">
  {/* Full-width background image */}
  <div className="tru-hero-bg">
    <img src={heroFamilyMove} className="tru-hero-bg-image" />
    <div className="tru-hero-bg-overlay" />
  </div>
  
  {/* Hero content grid */}
  <section className="tru-hero tru-hero-split">
    {/* ...existing hero content... */}
  </section>
</div>
```

---

## 3. Headline + Subheadline (Readable + Proper Hierarchy)

**File: `src/index.css`**

Add backdrop blur zone behind headline for readability:

```css
.tru-hero-header-section {
  /* Add subtle backdrop for readability over image */
  position: relative;
}

.tru-hero-headline-backdrop {
  position: absolute;
  inset: -20px -40px;
  background: hsl(var(--background) / 0.7);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  z-index: -1;
}

/* H1 dominant sizing */
.tru-hero-header-section .tru-hero-headline-main {
  font-size: clamp(36px, 5.5vw, 64px);
  font-weight: 800;
  line-height: 1.1;
  color: hsl(var(--tm-ink));
  text-shadow: 0 2px 12px hsl(var(--background) / 0.6);
}

/* Subheadline 45-55% of H1 size */
.tru-hero-header-section .tru-hero-subheadline-long {
  font-size: clamp(14px, 1.8vw, 18px); /* ~50% of H1 */
  line-height: 1.65;
  max-width: 900px;
  font-weight: 500;
  color: hsl(var(--tm-ink) / 0.75);
  margin: 16px auto 0;
  text-shadow: 0 1px 8px hsl(var(--background) / 0.5);
}

/* "Move" word - high contrast with green underline accent */
.tru-hero-headline-accent {
  color: hsl(var(--tm-ink));
  position: relative;
}

.tru-hero-headline-accent::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  right: 0;
  height: 4px;
  background: hsl(var(--primary));
  border-radius: 2px;
}
```

---

## 4. Restore Exact Subheadline Text

**File: `src/pages/Index.tsx`**

Replace the current short subheadline with the exact verbatim text:

```tsx
<div className="tru-hero-header-section">
  <div className="tru-hero-headline-backdrop" />
  <h1 className="tru-hero-headline-main">
    <img src={logoImg} alt="TruMove" className="tru-hero-inline-logo" /> 
    A Smarter Way To <span className="tru-hero-headline-accent">Move</span>.
  </h1>
  <p className="tru-hero-subheadline-long">
    Skip the complexity of large national van lines. We use AI inventory scanning and live video consults to understand your move, then vet carriers using verified FMCSA and DOT safety data, so we can confidently match you with carriers that best meet your needs.
  </p>
</div>
```

---

## 5. Right Side "Why TruMove" Module (Complete Redesign)

**File: `src/pages/Index.tsx`**

Replace the current right-side image panel with a compact, information-dense card:

```tsx
{/* RIGHT SIDE: Why TruMove Card */}
<div className="tru-hero-content-panel">
  <div className="tru-why-trumove-card">
    {/* Header */}
    <span className="tru-why-label">WHY TRUMOVE</span>
    <h2 className="tru-why-title">Skip the Van Line Middleman</h2>
    <p className="tru-why-desc">
      We analyze FMCSA and USDOT safety records to compare carriers, 
      then match you with movers that meet your specific needs. 
      Full transparency, no hidden fees.
    </p>
    
    {/* Divider */}
    <div className="tru-why-divider" />
    
    {/* Clickable Feature Highlights */}
    <div className="tru-why-features">
      {features.map((feature, index) => (
        <button
          key={feature.id}
          className={`tru-why-feature-row ${activeFeature === index ? 'is-active' : ''}`}
          onClick={() => setActiveFeature(index)}
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
    
    {/* Expandable Detail Area */}
    {activeFeature !== null && (
      <div className="tru-why-detail">
        <p>{features[activeFeature].longDesc}</p>
      </div>
    )}
  </div>
</div>
```

**Features Data Array:**

```tsx
const whyTruMoveFeatures = [
  {
    id: 'ai-scanner',
    icon: Camera,
    title: 'AI Inventory Scanner',
    shortDesc: 'Photograph rooms for instant estimates',
    longDesc: 'Upload photos of your rooms and our AI automatically identifies furniture, calculates weight and volume, and generates an accurate inventory list in seconds.'
  },
  {
    id: 'video-consults',
    icon: Video,
    title: 'Live Video Consults',
    shortDesc: 'Virtual walkthrough with a specialist',
    longDesc: 'Schedule a live video call where a TruMove specialist walks through your home with you, providing personalized guidance and an accurate quote.'
  },
  {
    id: 'fmcsa-vetting',
    icon: ShieldCheck,
    title: 'FMCSA + DOT Safety Vetting',
    shortDesc: 'SAFER database verification',
    longDesc: 'We query the federal SAFER Web Services database to verify operating authority, insurance coverage, and safety ratings for every carrier we recommend.'
  },
  {
    id: 'authority-check',
    icon: Shield,
    title: 'Authority Verification',
    shortDesc: 'Active license confirmation',
    longDesc: 'Every carrier is checked for active operating authority status. We flag any revoked, suspended, or inactive licenses before you book.'
  },
  {
    id: 'insurance-check',
    icon: CreditCard,
    title: 'Insurance Coverage Checks',
    shortDesc: 'BIPD and cargo coverage verified',
    longDesc: 'We verify that carriers maintain adequate bodily injury, property damage, and cargo insurance coverage that meets or exceeds federal minimums.'
  },
  {
    id: 'transparency',
    icon: BarChart3,
    title: 'Real-Time Transparency',
    shortDesc: 'Track your move every step',
    longDesc: 'Get real-time updates on carrier matching, booking status, and move day coordination. No black box - you see everything we see.'
  }
];
```

---

## 6. Feature Highlights Must Be Clickable

**File: `src/index.css`**

Style the clickable feature rows with proper hover/active states:

```css
.tru-why-feature-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.tru-why-feature-row:hover {
  background: hsl(var(--tm-ink) / 0.04);
  border-color: hsl(var(--tm-ink) / 0.1);
}

.tru-why-feature-row.is-active {
  background: hsl(var(--primary) / 0.08);
  border-color: hsl(var(--primary) / 0.2);
}

.tru-why-feature-row:hover .tru-why-feature-arrow,
.tru-why-feature-row.is-active .tru-why-feature-arrow {
  transform: translateX(4px);
  opacity: 1;
}

.tru-why-feature-arrow {
  margin-left: auto;
  color: hsl(var(--tm-ink) / 0.3);
  opacity: 0;
  transition: all 0.2s ease;
}
```

---

## 7. Required Feature List

The following 6 features are included in the `whyTruMoveFeatures` array defined above:

| Feature | Icon | Description |
|---------|------|-------------|
| AI Inventory Scanner | Camera | Photo-based room detection |
| Live Video Consults | Video | Virtual walkthrough with specialist |
| FMCSA + DOT Safety Vetting | ShieldCheck | SAFER database verification |
| Authority Verification | Shield | Active license confirmation |
| Insurance Coverage Checks | CreditCard | BIPD and cargo coverage |
| Real-Time Transparency | BarChart3 | Track your move every step |

---

## 8. Visual Style Constraints

**Enforced Throughout:**

- **No green-on-green icons**: Icon backgrounds use `hsl(var(--tm-ink) / 0.08)` (neutral), icons themselves are dark
- **TruMove green as accent only**: Used for active states, underlines, badges - never as fills
- **Packed layout**: The Why TruMove card has no empty space - all 6 features visible at once
- **High contrast text**: All text uses `hsl(var(--tm-ink))` for maximum readability

```css
.tru-why-feature-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(var(--tm-ink) / 0.08); /* Neutral, NOT green */
  border-radius: 8px;
  flex-shrink: 0;
}

.tru-why-feature-icon svg {
  color: hsl(var(--tm-ink)); /* Dark, NOT green */
}
```

---

## Files Modified

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Restructure hero with full-width background wrapper, replace right panel with Why TruMove card, add satellite thumbnails, restore exact subheadline text |
| `src/index.css` | Add hero wrapper/background styles, headline backdrop blur, subheadline sizing, Why TruMove card styles, satellite thumbnail styles, clickable feature row styles |

---

## Visual Result

```text
+======================================================================+
| [FULL-WIDTH HERO IMAGE - Family moving - parallax effect]           |
| [Gradient overlay: light top -> solid bottom]                        |
+======================================================================+
|                                                                      |
|  +----------------------------------------------------------------+  |
|  | [Backdrop blur zone]                                           |  |
|  | [Logo] A Smarter Way To Move.                                  |  |
|  | Skip the complexity of large national van lines. We use AI     |  |
|  | inventory scanning and live video consults to understand your  |  |
|  | move, then vet carriers using verified FMCSA and DOT safety    |  |
|  | data, so we can confidently match you with carriers that best  |  |
|  | meet your needs.                                               |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|  +---------------------+               +-------------------------+   |
|  | FORM CARD           |               | WHY TRUMOVE             |   |
|  |                     |               |                         |   |
|  | From: [input____]   |               | Skip the Van Line       |   |
|  | [satellite thumb]   |               | Middleman               |   |
|  |         ->          |               |                         |   |
|  | To: [input______]   |               | We analyze FMCSA...     |   |
|  | [satellite thumb]   |               |                         |   |
|  |                     |               | ----------------------- |   |
|  | +-----------------+ |               | [>] AI Inventory Scan   |   |
|  | | O | 953mi | D   | |               | [>] Live Video Consults |   |
|  | | LONG DISTANCE   | |               | [>] FMCSA+DOT Vetting   |   |
|  | +-----------------+ |               | [>] Authority Verify    |   |
|  |                     |               | [>] Insurance Checks    |   |
|  | Move Date: [___]    |               | [>] Real-Time Updates   |   |
|  |                     |               |                         |   |
|  | [Analyze Route]     |               | [Expanded detail text]  |   |
|  +---------------------+               +-------------------------+   |
|                                                                      |
+======================================================================+
```

---

## Technical Notes

1. **Parallax**: The hero background image will use the existing `useParallax` hook with `speed: 0.15` for subtle depth
2. **Form card backdrop**: Uses `backdrop-filter: blur(8px)` with slightly transparent background
3. **Distance bar unchanged**: The existing conditional route summary strip remains exactly as implemented
4. **Satellite thumbnails**: 60px fixed height, Mapbox Static API at zoom level 13
5. **Why TruMove state**: Uses `useState` to track which feature row is active/expanded
6. **Height alignment**: The Why TruMove card uses CSS to align closely with the form card height (flexbox with `align-items: stretch`)
