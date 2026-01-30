
# Fix "Why TruMove" Card Clipping on Right Edge

## Problem Analysis

The "Why TruMove" card's feature carousel is being clipped on the right side. After investigating the CSS hierarchy, I found the root causes:

### Clipping Chain

1. **`.tru-hero-wrapper`** (line 1353)
   - Has `overflow-x: hidden` to prevent horizontal scrolling
   - This is the outermost container causing clipping

2. **`.tru-why-card-premium`** (line 26238)
   - Has `overflow: hidden` to contain content
   - This clips the carousel cards when they scale on hover

3. **`.features-carousel-card:hover`** (line 16691)
   - Uses `transform: scale(1.22)` - a 22% scale increase
   - When the rightmost card scales, it extends beyond the container bounds

4. **`.tru-hero-content-panel`** (lines 1559-1560)
   - Has `padding-left: 24px; padding-right: 24px`
   - Right edge cards have less room to expand into

---

## Solution

The fix requires allowing the carousel content to overflow visible while still containing it within proper bounds. We need to:

1. **Change `.tru-why-card-premium` overflow** from `hidden` to `visible` to allow hover expansion
2. **Add right-side margin/padding** to the carousel to create breathing room for scaled cards
3. **Ensure parent containers don't clip** the visible overflow

---

## Implementation

### File: `src/index.css`

#### Change 1: Allow visible overflow on Why TruMove card (line 26238)

Change `overflow: hidden` to `overflow: visible` on `.tru-why-card-premium`:

```css
/* Before */
.tru-why-card-premium {
  /* ... */
  overflow: hidden;  /* Clip content in normal state */
  /* ... */
}

/* After */
.tru-why-card-premium {
  /* ... */
  overflow: visible;  /* Allow carousel cards to expand on hover */
  /* ... */
}
```

#### Change 2: Add right padding to carousel container for scaled cards (lines 16627-16628)

Add right padding to `.features-carousel-content` to give the rightmost card room to scale:

```css
/* Before */
.features-carousel-content {
  display: flex;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 8px;  /* Minimal padding */
}

/* After */
.features-carousel-content {
  display: flex;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 8px 24px 8px 8px;  /* Extra right padding for scaled cards */
}
```

#### Change 3: Clip overflow on card content wrapper instead (line 26259)

Move overflow clipping to the inner content wrapper to prevent background bleed while allowing card expansion:

```css
/* After (new rule) */
.tru-why-card-premium-content {
  /* ... existing styles ... */
  overflow: hidden;
  border-radius: 16px;  /* Match parent for clean clipping */
}
```

---

## Summary of Changes

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 26238 | Change `overflow: hidden` to `overflow: visible` on `.tru-why-card-premium` |
| `src/index.css` | 16627-16628 | Add extra right padding to `.features-carousel-content` |
| `src/index.css` | 26259-26266 | Add overflow clipping to `.tru-why-card-premium-content` for clean containment |

---

## Expected Result

- Carousel cards will no longer be clipped on the right side when hovering
- The 1.22x scale hover effect will work fully on all cards including rightmost
- Card content remains properly contained within rounded borders
- No horizontal scrollbar introduced
