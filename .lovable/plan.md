
# Plan: Full-Width Hero Background with Parallax + Permanent Route Summary

## Overview
This plan addresses 5 key improvements to the homepage hero section:

1. **Full-Width Hero Background** - Move hero image to span the entire top of the hero section (behind form + content)
2. **Lighter Gradient Overlay** - Reduce overlay intensity to show more of the image
3. **Parallax Effect** - Add subtle scroll-based movement to the hero image
4. **Better Object Position** - Adjust image cropping to show more of the family
5. **Permanent Route Summary Bar** - Embed a static origin-distance-destination bar in the form with mini map preview

---

## Technical Changes

### 1. Restructure Hero Layout for Full-Width Background Image

**File: `src/pages/Index.tsx`**

Move the hero image from the right content panel to be a background layer for the entire hero section:

```text
BEFORE:
+------------------+------------------+
| [Header Headline spanning both]    |
+------------------+------------------+
| [Form Panel]     | [Image Panel]    |
+------------------+------------------+

AFTER:
+--------------------------------------+
| [HERO IMAGE - Full width background] |
|   +------------------+--------------+|
|   | [Header Headline spanning both] ||
|   +------------------+--------------+|
|   | [Form Panel]     | [Content]    ||
|   +------------------+--------------+|
+--------------------------------------+
```

Changes:
- Add a new `tru-hero-bg-image` container as the first child inside `.tru-hero.tru-hero-split`
- Position the image absolutely to fill the hero section
- Apply parallax transform via the existing `useParallax` hook
- Remove the hero image from the right content panel (but KEEP the text content)

### 2. Lighter Gradient Overlay

**File: `src/index.css`**

Update the overlay to use a softer, more directional gradient:

```css
.tru-hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    hsl(var(--background) / 0.4) 0%,
    hsl(var(--background) / 0.7) 30%,
    hsl(var(--background) / 0.92) 70%,
    hsl(var(--background)) 100%
  );
  z-index: 1;
}
```

This creates a top-to-bottom fade that:
- Shows more of the image at the top
- Provides strong contrast for text at the bottom
- Blends naturally into the page background

### 3. Parallax Effect on Background Image

**File: `src/pages/Index.tsx`**

Add a new parallax ref specifically for the background image:

```tsx
const [parallaxBgRef, bgParallax] = useParallax<HTMLDivElement>({ 
  speed: 0.15, 
  direction: "up" 
});

// Apply to the background image container:
<div 
  ref={parallaxBgRef}
  className="tru-hero-bg-image"
  style={{ transform: `translateY(${bgParallax.y}px) scale(1.05)` }}
>
  <img src={heroFamilyMove} ... />
</div>
```

The slight initial scale (1.05) prevents edges from showing during parallax movement.

### 4. Adjust Image Object Position

**File: `src/index.css`**

Update the hero image positioning to show more of the family:

```css
.tru-hero-bg-image img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%; /* Move focus upward to show faces */
}
```

### 5. Permanent Route Summary Bar in Form

**File: `src/pages/Index.tsx`**

Add a persistent route summary strip that always displays (with placeholder styling when empty):

```tsx
{/* Permanent Route Summary - Always Visible */}
<div className="tru-qb-route-bar-permanent">
  <div className="tru-qb-route-bar-inner">
    {/* Origin */}
    <div className="tru-qb-route-bar-endpoint">
      <MapPin className="w-3.5 h-3.5" />
      <div className="tru-qb-route-bar-endpoint-text">
        <span className="tru-qb-route-bar-label">Origin</span>
        <span className="tru-qb-route-bar-value">
          {fromCity || "Enter origin"}
        </span>
      </div>
    </div>
    
    {/* Mini Map / Distance */}
    <div className="tru-qb-route-bar-center">
      {distance > 0 ? (
        <>
          <div className="tru-qb-route-bar-mini-map">
            {/* Tiny Mapbox static route preview */}
            <img 
              src={`https://api.mapbox.com/styles/v1/mapbox/light-v11/static/...`}
              alt="Route preview"
            />
          </div>
          <span className="tru-qb-route-bar-distance">{distance} mi</span>
        </>
      ) : (
        <Route className="w-4 h-4 text-muted-foreground/40" />
      )}
    </div>
    
    {/* Destination */}
    <div className="tru-qb-route-bar-endpoint">
      <MapPin className="w-3.5 h-3.5" />
      <div className="tru-qb-route-bar-endpoint-text">
        <span className="tru-qb-route-bar-label">Destination</span>
        <span className="tru-qb-route-bar-value">
          {toCity || "Enter destination"}
        </span>
      </div>
    </div>
  </div>
</div>
```

**File: `src/index.css`**

Style the permanent route bar to maintain form sizing:

```css
.tru-qb-route-bar-permanent {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, hsl(var(--tm-ink) / 0.02) 0%, hsl(var(--tm-ink) / 0.05) 100%);
  border: 1px solid hsl(var(--tm-ink) / 0.06);
  border-radius: 12px;
  margin-bottom: 1rem;
}

.tru-qb-route-bar-inner {
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  align-items: center;
  gap: 0.5rem;
}

.tru-qb-route-bar-mini-map {
  width: 60px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid hsl(var(--tm-ink) / 0.1);
}

.tru-qb-route-bar-mini-map img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## Font Readability Enhancements

Add text shadows and semi-transparent backgrounds to ensure all text remains readable over the hero image:

```css
.tru-hero-header-section .tru-hero-headline-main {
  text-shadow: 0 2px 20px hsl(var(--background) / 0.8);
}

.tru-hero-header-section .tru-hero-header-subheadline {
  text-shadow: 0 1px 12px hsl(var(--background) / 0.6);
}

.tru-floating-form-card {
  background: hsl(var(--card) / 0.97);
  backdrop-filter: blur(8px);
}
```

---

## Files Modified

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Add hero background image layer with parallax, add permanent route bar component, remove image from right panel |
| `src/index.css` | Add `.tru-hero-bg-image` styles, update gradient overlay, add permanent route bar styles, add text shadow utilities |

---

## Visual Result

```text
+------------------------------------------------------------------+
|  [HERO IMAGE - Family moving - parallax scroll effect]           |
|  +------------------------------------------------------------+  |
|  | [Gradient Overlay - light top, solid bottom]               |  |
|  |  +-------------------------------------------------------+ |  |
|  |  | [Logo] A Smarter Way To Move.                         | |  |
|  |  | Designed to put you in control of your move.          | |  |
|  |  +-------------------------------------------------------+ |  |
|  |                                                            |  |
|  |  +------------------+              +---------------------+ |  |
|  |  | FORM CARD        |              | Skip the Van Line   | |  |
|  |  | +--------------+ |              | AI inventory scan   | |  |
|  |  | | ROUTE BAR    | |              | Live video consults | |  |
|  |  | | [O] 953mi [D]| |              | FMCSA vetting       | |  |
|  |  | +--------------+ |              +---------------------+ |  |
|  |  | From: ________   |                                      |  |
|  |  | To: __________   |                                      |  |
|  |  | Date: ________   |                                      |  |
|  |  | [Analyze Route]  |                                      |  |
|  |  +------------------+                                      |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

---

## Technical Notes

- The hero image uses `scale(1.05)` to prevent edge reveal during parallax
- Form card uses `backdrop-filter: blur(8px)` for a frosted glass effect
- The mini-map in the route bar uses Mapbox Static API at 60x40px
- All text has appropriate shadows/contrast for readability
- The permanent route bar replaces the conditional one but keeps the same data bindings
