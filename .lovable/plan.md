

# Hero Carousel Enhancements: Auto-play, TruDy Modal, Smaller Cards, Trust Strip Fix

## Overview
Four enhancements to the hero "Your Move. Your Terms" carousel section:

1. **Auto-play already implemented** - The carousel already auto-cycles every 6 seconds (lines 297-310 in Index.tsx)
2. **TruDy card opens chat modal** - Change click behavior for TruDy feature card
3. **Make carousel cards 25% smaller** - Reduce padding, font sizes, and image aspect ratio
4. **Fix trust strip positioning** - Move trust badges to a better location

---

## Changes Required

### 1. TruDy Card Opens Chat Modal (src/pages/Index.tsx)

Currently, all carousel cards use `onClick={() => navigate(feature.route)}`. Need to add special handling for TruDy:

**Lines 1316-1342** - Update the carousel cards mapping to check for TruDy:

```tsx
{[
  { title: "Smart Carrier Match", desc: "Our algorithm finds the best carrier for your route.", image: previewCarrierVetting, route: "/vetting", action: "navigate" },
  { title: "TruMove Specialist", desc: "Live video consultation for personalized guidance.", image: previewVideoConsult, route: "/book", action: "navigate" },
  { title: "Inventory Builder", desc: "Build your item list room by room for accurate pricing.", image: previewAiScanner, route: "/online-estimate", action: "navigate" },
  { title: "AI Room Scanner", desc: "Point your camera and AI detects furniture instantly.", image: sampleRoomLiving, route: "/scan-room", action: "navigate" },
  { title: "Shipment Tracking", desc: "Track your shipment in real-time with live updates.", image: previewPropertyLookup, route: "/track", action: "navigate" },
  { title: "FMCSA Verified", desc: "Real-time safety data checks from official databases.", image: scanRoomPreview, route: "/vetting", action: "navigate" },
  { title: "TruDy AI Assistant", desc: "Your virtual moving assistant, available 24/7.", image: trudyAvatar, route: "", action: "openChat" },
].map((feature, index) => (
  <CarouselItem key={index} className="tru-why-carousel-item basis-1/2">
    <div 
      className="tru-why-carousel-card"
      onClick={() => feature.action === "openChat" ? setChatOpen(true) : navigate(feature.route)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && (feature.action === "openChat" ? setChatOpen(true) : navigate(feature.route))}
    >
```

---

### 2. Make Carousel Cards 25% Smaller (src/index.css)

Reduce all dimensions by ~25%:

**Line ~25442-25477** - Update card styles:

| Property | Current | New (25% smaller) |
|----------|---------|-------------------|
| `.tru-why-carousel-card-text` padding | `14px 14px 10px` | `10px 10px 8px` |
| `.tru-why-carousel-card-title` font-size | `13px` | `11px` |
| `.tru-why-carousel-card-desc` font-size | `11px` | `9px` |
| `.tru-why-carousel-card-image` aspect-ratio | `16 / 10` | `16 / 9` |

```css
.tru-why-carousel-card-text {
  padding: 10px 10px 8px;
}

.tru-why-carousel-card-title {
  font-size: 11px;
  font-weight: 700;
  color: hsl(var(--foreground));
  margin: 0 0 3px 0;
}

.tru-why-carousel-card-desc {
  font-size: 9px;
  font-weight: 400;
  color: hsl(var(--muted-foreground));
  line-height: 1.35;
  margin: 0;
}

.tru-why-carousel-card-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: hsl(var(--muted));
}
```

Also reduce carousel item padding:
```css
.tru-why-carousel-item {
  padding-left: 6px;
  padding-right: 6px;
}
```

---

### 3. Fix Trust Strip at Bottom of Hero Card (src/index.css)

The trust badges (FMCSA VERIFIED, LICENSED BROKER) are currently centered and small. Move them to the right side or make them more prominent:

**Line ~25519-25543** - Update trust badges positioning:

```css
.tru-why-trust-badges {
  display: flex;
  align-items: center;
  justify-content: flex-end;  /* Right-align instead of center */
  gap: 12px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid hsl(var(--tm-ink) / 0.06);
}

.tru-why-trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  color: hsl(var(--primary));
  letter-spacing: 0.03em;
  background: hsl(var(--primary) / 0.06);
  padding: 4px 8px;
  border-radius: 4px;
}
```

---

## Files to Modify

1. **src/pages/Index.tsx**
   - Update carousel feature array to include `action` property
   - Modify click handler to check for "openChat" action and call `setChatOpen(true)`

2. **src/index.css**
   - Reduce `.tru-why-carousel-card-text` padding by 25%
   - Reduce `.tru-why-carousel-card-title` font-size to 11px
   - Reduce `.tru-why-carousel-card-desc` font-size to 9px
   - Reduce `.tru-why-carousel-item` padding
   - Change `.tru-why-carousel-card-image` aspect-ratio to 16/9
   - Right-align `.tru-why-trust-badges` with background styling

---

## Result

| Enhancement | Outcome |
|-------------|---------|
| Auto-play | Already working at 6-second intervals |
| TruDy click | Opens AI chat modal instead of navigating |
| Card size | 25% smaller for compact appearance |
| Trust strip | Right-aligned with badge styling at card bottom |

