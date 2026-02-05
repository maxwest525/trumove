
# Landing Page Generator Overhaul

## Overview
This plan addresses three major enhancements:

1. **Snap-to-grid resizing** - Modal snaps to common sizes (800x600, 1024x768, 1280x720, etc.) when resizing
2. **Visible resize handles** - Add persistent grip indicators with glow effects on all corners/edges
3. **ClickFunnels-quality landing pages** - Dramatically upgrade templates with extensive TruMove branding, more sections, animations, and professional funnel design patterns

---

## Part 1: DraggableModal Enhancements

### A. Snap-to-Grid Resizing

Add predefined size presets that the modal snaps to when resizing near those dimensions:

**Common sizes to snap to:**
- 640x480 (small)
- 800x600 (standard)
- 1024x768 (large)
- 1280x720 (HD)
- 1440x900 (wide)
- 1600x900 (ultrawide)

**Implementation in `DraggableModal.tsx`:**
- Add `SIZE_PRESETS` constant array
- Add `RESIZE_SNAP_THRESHOLD` (e.g., 30px)
- During resize, check if current size is within threshold of any preset
- Show visual indicator when near a snap size (dimension badge glows)
- Apply snap on mouse up

### B. Enhanced Resize Handles

Replace the minimal corner resize handle with visible grip indicators on all four corners:

**Visual design:**
- Add grip dots/lines pattern to each corner (like macOS/Windows resize handles)
- Subtle border glow on hover (purple/blue accent)
- All 4 corners get `cursor-nwse-resize`, `cursor-nesw-resize` appropriately
- Add edge handles for horizontal/vertical-only resizing

**CSS styling:**
```
.resize-handle-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-handle-corner::before {
  content: '';
  width: 8px;
  height: 8px;
  border-right: 2px solid hsl(var(--muted-foreground) / 0.4);
  border-bottom: 2px solid hsl(var(--muted-foreground) / 0.4);
}

.resize-handle-corner:hover::before {
  border-color: hsl(var(--primary));
  box-shadow: 0 0 8px hsl(var(--primary) / 0.5);
}
```

---

## Part 2: ClickFunnels-Quality Landing Pages

Transform the current basic templates into high-converting, intricate funnel pages with heavy TruMove branding.

### Key ClickFunnels Design Elements to Add:

1. **Sticky navigation bar** with TruMove logo + phone number
2. **Floating urgency bar** ("Only 3 slots left this week!")
3. **Video placeholder sections** with play button overlays
4. **Multi-step process visualization** with connecting lines/arrows
5. **Trust badges strip** (FMCSA, BBB, 5-star badges, credit card icons)
6. **Guarantee section** with shield/certificate graphics
7. **FAQ accordion** with common questions
8. **Exit-intent popup trigger zone**
9. **Floating sticky CTA button** (mobile-style fixed bottom bar)
10. **Social proof ticker** ("John from Texas just got a quote...")
11. **Countdown timer** for urgency
12. **Before/After comparison slider** concept
13. **Risk-reversal section** ("What if you're not satisfied?")

### TruMove Branding Requirements:

**Logo usage:**
- Header: Full logo with truck icon
- Footer: Logo with tagline "AI-Powered Moving Made Simple"
- Watermark/badge: "Powered by TruMove AI"

**Brand colors (from logo):**
- Primary green: `#22C55E` (TRU in logo)
- Black: `#000000` (MOVE in logo)
- White backgrounds with green accents

**Brand language:**
- "TruMove" appears 10+ times per page
- "AI-Powered" messaging throughout
- "Trudy" AI assistant mentioned
- Trust phrases: "TruMove Guarantee", "TruPrice Promise", "TruTrack Technology"

### Template Redesigns:

#### Quote Funnel Template (Complete Overhaul):

**Sections (top to bottom):**

1. **Sticky Header Bar**
   - TruMove logo (left)
   - "Call Now: 1-800-TRUMOVE" (right)
   - Green accent underline

2. **Hero Section** (dark gradient)
   - Urgency badge: "Limited Time: $200 Off Long-Distance Moves"
   - Main headline with gradient text
   - Subheadline with checkmark bullets
   - Quote form with animated border glow
   - "As seen in" logos strip

3. **Social Proof Ticker**
   - Animated scrolling: "Sarah from Austin just saved $847..."
   - Live counter: "1,247 quotes generated today"

4. **3-Step Process Section**
   - Circular numbered steps with connecting line
   - Icons: Scan, Match, Move
   - "Powered by TruMove AI" badge

5. **Video Testimonial Section**
   - 2x2 grid of video thumbnails with play buttons
   - Star ratings displayed
   - "Watch Real TruMove Stories"

6. **Comparison Table Section**
   - TruMove vs Traditional Movers vs DIY
   - Green checkmarks for TruMove column
   - "TruMove Exclusive" badges on key features

7. **Calculator Preview Section**
   - Mini cost estimator
   - "See your TruMove price instantly"
   - Animated number countup

8. **Trust & Guarantee Section**
   - Large shield icon
   - "TruMove Triple Guarantee"
   - 100% Price Lock / Full Insurance / On-Time Delivery
   - BBB, FMCSA, SSL badges

9. **FAQ Accordion**
   - 6-8 common questions
   - TruMove branding in answers

10. **Final CTA Section**
    - Full-width green background
    - "Get Your TruMove Quote Now"
    - Countdown timer
    - Quote form repeated

11. **Footer**
    - TruMove logo
    - Contact info
    - Legal links
    - Copyright with year

12. **Floating Elements**
    - Sticky bottom CTA bar (mobile)
    - "Chat with Trudy" button
    - Back-to-top button

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/ui/DraggableModal.tsx` | Add size presets, snap-to-grid logic, enhanced resize handles on all corners with hover glow effects |
| `src/components/demo/ppc/AILandingPageGenerator.tsx` | Complete overhaul of all 6 template renders with extensive TruMove branding, new sections, animations, and ClickFunnels-style elements |

---

## Technical Implementation Details

### DraggableModal Size Snap

```typescript
const SIZE_PRESETS = [
  { width: 640, height: 480, label: "Small" },
  { width: 800, height: 600, label: "Standard" },
  { width: 1024, height: 768, label: "Large" },
  { width: 1280, height: 720, label: "HD" },
  { width: 1440, height: 900, label: "Wide" },
];

const RESIZE_SNAP_THRESHOLD = 30;

// In resize handler:
const findNearestPreset = (width: number, height: number) => {
  for (const preset of SIZE_PRESETS) {
    if (
      Math.abs(width - preset.width) < RESIZE_SNAP_THRESHOLD &&
      Math.abs(height - preset.height) < RESIZE_SNAP_THRESHOLD
    ) {
      return preset;
    }
  }
  return null;
};
```

### 8-Direction Resize Handles

```typescript
type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const [resizeDirection, setResizeDirection] = useState<ResizeDirection | null>(null);

// Handle positions
const cornerHandles = [
  { dir: 'nw', className: 'top-0 left-0 cursor-nwse-resize' },
  { dir: 'ne', className: 'top-0 right-0 cursor-nesw-resize' },
  { dir: 'sw', className: 'bottom-0 left-0 cursor-nesw-resize' },
  { dir: 'se', className: 'bottom-0 right-0 cursor-nwse-resize' },
];
```

### Landing Page TruMove Branding Elements

```typescript
// Reusable branded components
const TruMoveLogo = () => (
  <img src={logoImg} alt="TruMove" className="h-10" />
);

const TruMoveGuaranteeBadge = () => (
  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
    <Shield className="w-5 h-5 text-green-500" />
    <span className="font-bold text-green-600">TruMove Guarantee</span>
  </div>
);

const SocialProofTicker = () => (
  <div className="bg-slate-900 text-white py-2 overflow-hidden">
    <div className="animate-marquee whitespace-nowrap">
      <span>Sarah from Austin saved $847</span>
      <span>Michael from Denver just got a quote</span>
      {/* ... */}
    </div>
  </div>
);

const TrustBadgeStrip = () => (
  <div className="flex justify-center gap-6 py-4 border-y">
    <Badge>FMCSA Licensed</Badge>
    <Badge>BBB A+ Rated</Badge>
    <Badge>50,000+ Moves</Badge>
    <Badge>4.9/5 Rating</Badge>
  </div>
);
```

---

## Visual Comparison

**Current templates:** ~2-3 sections, minimal branding, basic styling

**New templates:** 10-12 sections each, TruMove logo appears 8-10 times, animated elements, trust signals, urgency triggers, sticky CTAs, comprehensive footer

---

## Summary

This comprehensive update will:
- Add professional snap-to-grid resizing with common dimension presets
- Make resize handles visible with grip indicators and hover effects on all corners
- Transform landing pages from basic mockups into high-converting ClickFunnels-quality pages
- Saturate every template with TruMove branding, AI messaging, and trust signals
- Add modern funnel elements: social proof tickers, countdown timers, video sections, sticky CTAs
