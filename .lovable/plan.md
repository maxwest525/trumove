

# Fix Hero Card Background + Expand Carousel Features + Add Smooth Animations

## Problems Identified

1. **Card Background Issue**: Making `.tru-why-card-premium` fully transparent removed the visual container. The text is now floating on the hero image without any definition, making it hard to read.

2. **Missing Features**: The hero carousel only has 4 features:
   - Smart Carrier Match
   - TruMove Specialist  
   - Inventory Builder
   - AI Room Scanner

   But the full FeatureCarousel has 6 features (plus you want to add TruDy):
   - Inventory Builder
   - AI Room Scanner
   - Shipment Tracking (missing from hero)
   - Smart Carrier Match
   - TruMove Specialist
   - FMCSA Verified (missing from hero)
   - **TruDy AI Assistant** (new feature to add)

3. **No Smooth Transitions**: Carousel snaps between slides without smooth animation

## Solution

### 1. Restore Card Background with Semi-Transparent Blur
Instead of fully transparent OR fully opaque, use a **frosted glass effect** that maintains readability while letting the hero show through:

```css
.tru-why-card-premium {
  background: hsl(var(--background) / 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--tm-ink) / 0.1);
  border-radius: 20px;
  box-shadow: 0 8px 32px hsl(var(--tm-ink) / 0.08);
}
```

### 2. Add All 7 Features to Hero Carousel
Update the features array in Index.tsx to include all features:

| Feature | Description | Image | Route |
|---------|-------------|-------|-------|
| Smart Carrier Match | Algorithm finds best carrier | previewCarrierVetting | /vetting |
| TruMove Specialist | Live video consultation | previewVideoConsult | /book |
| Inventory Builder | Room by room item list | previewAiScanner | /online-estimate |
| AI Room Scanner | Camera detects furniture | sampleRoomLiving | /scan-room |
| Shipment Tracking | Real-time live updates | previewPropertyLookup | /track |
| FMCSA Verified | Safety data checks | scanRoomPreview | /vetting |
| **TruDy AI Assistant** | Virtual moving assistant | trudyAvatar | /chat |

### 3. Add Smooth Carousel Transition Animation
Configure Embla carousel with smooth CSS transitions:

```css
.tru-why-carousel-content {
  transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.tru-why-carousel-item {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
```

Also update the carousel options to use smoother scrolling behavior.

---

## Technical Details

### Files to Modify
1. `src/index.css` - Restore frosted glass background, add carousel transitions
2. `src/pages/Index.tsx` - Expand features array to 7 items, add TruDy

### CSS Changes Summary
- `.tru-why-card-premium`: Semi-transparent background (85% opacity) with backdrop blur
- `.tru-why-carousel-content`: Smooth transform transition
- `.tru-why-carousel-item`: Opacity and scale transitions for polish

### Result
- Hero card will have a subtle frosted glass effect - readable but not a solid opaque box
- Carousel will cycle through all 7 features with smooth animations
- TruDy AI Assistant will be prominently featured in the carousel

