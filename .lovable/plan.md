

# Hero Section Redesign: Two-Column Layout

## Overview

Restructure the homepage hero into a clean two-column layout with text content on the left and the existing form on the right. This is a focused, minimal change that only affects the hero section.

---

## Current Structure

The hero currently uses a centered layout with:
- Logo + headline stacked at top (spans full width)
- Form card below (right-aligned)  
- Company info + feature carousel cards (stacked below form)

---

## New Layout

### Desktop (Two Columns)
```text
+------------------------------------------+
|  LEFT COLUMN          |  RIGHT COLUMN    |
|  (Text Content)       |  (Form)          |
|                       |                  |
|  "The Smarter Way     |  [Existing Form] |
|   To Move"            |                  |
|                       |  Micro-copy:     |
|  Feature line         |  "A moving       |
|  (single line, muted) |  specialist will |
|                       |  call you        |
|                       |  shortly."       |
|                       |                  |
|                       |  [Call Button]   |
+------------------------------------------+
```

### Mobile (Stacked)
```text
+----------------------+
|  Text Content        |
|  (Headline + Line)   |
+----------------------+
|  Form                |
|  + Micro-copy        |
|  + Call Button       |
+----------------------+
```

---

## Content Specifications

### LEFT COLUMN
| Element | Content |
|---------|---------|
| Logo | TruMove logo (existing) |
| Headline | "The Smarter Way To Move" (existing, with green accent on "Move") |
| Feature Line | "AI-powered estimates · FMCSA-vetted carriers · No van line middlemen · Live video consults · Real-time tracking" |

**Feature line styling:**
- Single line, small text (~13px)
- Muted color (60-70% opacity)
- No icons, just text with bullet separators

### RIGHT COLUMN
| Element | Content |
|---------|---------|
| Form | Existing multi-step form (unchanged) |
| Micro-copy | "A moving specialist will call you shortly." |
| Call Button | "Call a moving specialist" with phone icon |

---

## Technical Implementation

### File: `src/pages/Index.tsx`

**Changes to hero section (lines ~1105-1625):**

1. **Remove** the centered `.tru-hero-header-section` that spans full width
2. **Create** new left column structure with:
   - Logo
   - Headline with accent
   - Feature line (new element)
3. **Move** form to right column (keeping existing logic)
4. **Add** micro-copy below form footer
5. **Add** secondary call button below micro-copy
6. **Remove** the "Why TruMove" company card and Feature Carousel from hero (per constraints - no feature cards in hero)

**Simplified JSX structure:**
```jsx
<section className="tru-hero tru-hero-split">
  {/* Particles and overlays unchanged */}
  
  {/* LEFT COLUMN: Text Content */}
  <div className="tru-hero-left-column">
    <img src={logoImg} className="tru-hero-logo" />
    <h1 className="tru-hero-headline">
      The Smarter Way To <span className="tru-hero-accent">Move</span>
    </h1>
    <p className="tru-hero-feature-line">
      AI-powered estimates · FMCSA-vetted carriers · No van line middlemen · Live video consults · Real-time tracking
    </p>
  </div>
  
  {/* RIGHT COLUMN: Form + CTA */}
  <div className="tru-hero-right-column">
    {/* Existing form card - unchanged internally */}
    <div className="tru-floating-form-card">
      {/* ... existing form steps ... */}
    </div>
    
    {/* New: Micro-copy */}
    <p className="tru-hero-form-microcopy">
      A moving specialist will call you shortly.
    </p>
    
    {/* New: Call button */}
    <a href="tel:+16097277647" className="tru-hero-call-btn">
      <Phone className="w-4 h-4" />
      Call a moving specialist
    </a>
  </div>
</section>
```

### File: `src/index.css`

**New/Modified CSS classes:**

```css
/* Two-column hero grid */
.tru-hero.tru-hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  /* ... existing padding/max-width */
}

/* Left column - text content */
.tru-hero-left-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

/* Feature line - single line, muted */
.tru-hero-feature-line {
  font-size: 13px;
  color: hsl(0 0% 100% / 0.7);
  letter-spacing: 0.01em;
  white-space: nowrap;
  text-shadow: /* existing shadow for legibility */;
}

/* Right column - form + CTAs */
.tru-hero-right-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Micro-copy below form */
.tru-hero-form-microcopy {
  text-align: center;
  font-size: 13px;
  color: hsl(var(--muted-foreground));
}

/* Secondary call button */
.tru-hero-call-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: 2px solid hsl(var(--border));
  border-radius: 12px;
  font-weight: 600;
  color: hsl(var(--foreground));
  background: hsl(var(--background));
  transition: all 0.2s;
}

.tru-hero-call-btn:hover {
  border-color: hsl(var(--primary));
  color: hsl(var(--primary));
}

/* Mobile: stack columns */
@media (max-width: 1024px) {
  .tru-hero.tru-hero-split {
    grid-template-columns: 1fr;
  }
  
  .tru-hero-left-column {
    align-items: center;
    text-align: center;
  }
  
  .tru-hero-feature-line {
    white-space: normal;
    text-align: center;
  }
}
```

---

## Elements Removed from Hero

Per the constraints, these elements are removed from the hero section:
- Company Info card ("Why TruMove?")
- Feature Carousel card
- Move Summary Modal (appears on location entry)

These sections remain elsewhere on the page (StatsStrip, AI Analysis, etc.) - only the hero is affected.

---

## Files Modified

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Restructure hero JSX: left column (text), right column (form + CTAs) |
| `src/index.css` | Add/update hero column styles, feature line, micro-copy, call button |

---

## What Stays Unchanged

- Navbar
- Brand colors
- Light/dark mode
- Form fields and submission logic
- Global CSS and shared components
- All other pages
- Content below the hero (StatsStrip, AI Analysis, Consult, etc.)

