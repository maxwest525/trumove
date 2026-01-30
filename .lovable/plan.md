
# Remove Hero Header Grey Box, Remove FeatureCarousel & Increase Carousel Fonts

## Overview
This plan addresses three issues:
1. **Remove the grey box/hero header** - The large headline section at the top of the hero that says "TruMove A Smarter Way To Move" 
2. **Remove the FeatureCarousel** - The full-width carousel that appears underneath the header
3. **Increase carousel card fonts** - Make the inline "Your Move. Your Terms." carousel text larger for readability

Additionally, I'll update the Trudy branding memory as requested.

---

## Changes

### 1. Remove Hero Header Section (Grey Box)
**File:** `src/pages/Index.tsx`

Delete the entire hero header section at lines 751-759:

```tsx
// DELETE THIS SECTION (lines 751-759):
            
            {/* Hero Header with Headline + Short Subheadline - Refined per plan */}
            <div className="tru-hero-header-section tru-hero-header-refined">
              <h1 className="tru-hero-headline-main">
                <img src={logoImg} alt="TruMove" className="tru-hero-headline-logo" />
                A Smarter Way To <span className="tru-hero-headline-accent">Move</span>
              </h1>
              {/* Subheadline temporarily removed - to be repositioned */}
            </div>
```

This removes the large headline that appears above the form card, which has been displaying with a grey/white box behind it.

---

### 2. Remove Full-Width Feature Carousel
**File:** `src/pages/Index.tsx`

Delete the FeatureCarousel section at lines 1367-1370:

```tsx
// DELETE THIS SECTION:
          {/* FULL-WIDTH FEATURE CAROUSEL - Directly under Why TruMove */}
          <section className="tru-feature-carousel-fullwidth tru-carousel-compact">
            <FeatureCarousel />
          </section>
```

Also remove the unused import at line 40:
```tsx
// DELETE:
import FeatureCarousel from "@/components/FeatureCarousel";
```

---

### 3. Increase Hero Carousel Card Font Sizes
**File:** `src/index.css`

Make the inline hero carousel (inside "Your Move. Your Terms." card) text larger and more legible:

| Element | Current | New |
|---------|---------|-----|
| Title | 11px | **14px** |
| Description | 9px | **12px** |
| Card text padding | 8px 8px 6px | **10px 12px 8px** |

**CSS Changes (lines 25441-25458):**

```css
/* From: */
.tru-why-carousel-card-text {
  padding: 8px 8px 6px;
}

.tru-why-carousel-card-title {
  font-size: 11px;
  ...
}

.tru-why-carousel-card-desc {
  font-size: 9px;
  ...
}

/* To: */
.tru-why-carousel-card-text {
  padding: 10px 12px 8px;
}

.tru-why-carousel-card-title {
  font-size: 14px;
  font-weight: 700;
  color: hsl(var(--foreground));
  margin: 0 0 3px 0;
}

.tru-why-carousel-card-desc {
  font-size: 12px;
  font-weight: 400;
  color: hsl(var(--muted-foreground));
  line-height: 1.4;
  margin: 0;
}
```

---

### 4. Memory Updates

**Update:** `memory/style/trudy-branding-v3`
- Primary label: "Trudy Your Move Specialist"
- Secondary label: "Here to Help"

**Update:** `memory/features/homepage/layout-structure-v83`
- Hero header section removed - form card now provides the only TruMove branding in the hero
- FeatureCarousel removed from below the header
- Layout is now: Hero Section → AI Inventory Analysis → Black Stats Strip → Route Analysis Section

---

## Summary

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Remove hero header div (lines 751-759), remove FeatureCarousel section + import |
| `src/index.css` | Increase carousel fonts: 11→14px title, 9→12px description |
| Memory | Update Trudy branding, update layout structure |

## Visual Result
- The large "TruMove A Smarter Way To Move" text above the form card will be completely removed
- The FeatureCarousel underneath the header will be removed
- The inline carousel cards in "Your Move. Your Terms." will have larger, more readable text
- The form card will remain as the primary branding element in the hero
