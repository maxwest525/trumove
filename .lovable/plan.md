# Hero Section Refactor - Completed

## Summary

Refactored the homepage hero section with the following changes:

### 1. Full-Width Hero Background
- Hero image now spans full viewport width behind both form and content panels
- Light-to-dark gradient overlay (35% → 100%) preserves image visibility at top
- Background contained in `.tru-hero-wrapper` with min-height: 100vh

### 2. Headline + Subheadline
- Added backdrop blur zone (`.tru-hero-headline-backdrop`) for readability over image
- H1 sizing: clamp(36px, 5.5vw, 64px) with text-shadow
- Subheadline: clamp(14px, 1.8vw, 18px) at ~50% H1 size
- "Move" word uses green underline accent (not gradient text)
- Restored exact verbatim subheadline text as requested

### 3. Satellite Thumbnails
- 60px fixed height thumbnails appear beneath From/To inputs after validation
- Uses Mapbox Static API at zoom level 13
- Fade-in animation on appear

### 4. Why TruMove Card (Right Panel)
- Replaced hero image with information-dense card
- Contains: WHY TRUMOVE label, title, description, divider
- 6 clickable feature rows with hover/active states
- Expandable detail area on click
- Features: AI Scanner, Video Consults, FMCSA Vetting, Authority, Insurance, Transparency

### 5. Visual Style
- No green-on-green icons (neutral icon backgrounds)
- TruMove green as accent only
- High contrast text throughout
- Distance bar unchanged (HARD LOCK)

### Files Modified
- `src/pages/Index.tsx` - Hero wrapper, subheadline, satellite thumbs, Why TruMove card
- `src/index.css` - Background styles, backdrop blur, card styles, responsive rules
