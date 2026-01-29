
# Homepage Layout Changes: Feature Cards + AI Inventory Analysis Section

## Overview

The user wants to:
1. Move feature carousel cards higher up on the page
2. Move the "Start Your AI Inventory Analysis" section up (but not over feature cards)
3. Add a small preview video/image showing the walkthrough process
4. Update copy to explain video walkthrough OR photos with AI identification
5. Emphasize live agent confirmation to avoid discrepancies
6. Highlight the benefit of avoiding strangers searching your house

---

## Current Page Structure (Order)

```text
1. Hero Section (form + Why TruMove)
2. Feature Carousel
3. Black Stats Strip
4. Route Analysis Section ("Building your personalized move profile")
5. AI Inventory Analysis Section (3 steps)
6. Consult Section
7. How It Works Steps
```

## Proposed New Order

```text
1. Hero Section (form + Why TruMove)
2. Feature Carousel (moved UP by reducing top margin)
3. AI Inventory Analysis Section (moved UP before Stats Strip)
4. Black Stats Strip
5. Route Analysis Section
6. Consult Section
7. How It Works Steps
```

---

## File Changes

### 1. `src/pages/Index.tsx`

**Reorder sections** (lines 1338-1404):

Current order:
- Feature Carousel
- StatsStrip
- RouteAnalysisSection
- AI Steps Section

New order:
- Feature Carousel (tighter margins)
- AI Steps Section (moved up)
- StatsStrip
- RouteAnalysisSection

**Update AI Steps Section content** with:
- Small preview image/video placeholder using `sampleRoomLiving` or similar
- Updated copy explaining video walkthrough OR photos
- AI-powered object detection language
- Live agent confirmation messaging
- Privacy benefit (no strangers in your house)

**New section structure:**

```tsx
{/* START YOUR AI INVENTORY ANALYSIS - Enhanced with Preview */}
<section className="tru-ai-steps-section">
  <div className="tru-ai-steps-inner">
    <h2 className="tru-ai-steps-title">Start Your AI Inventory Analysis</h2>
    
    {/* NEW: Preview Video/Image Block */}
    <div className="tru-ai-preview-block">
      <div className="tru-ai-preview-video">
        <img src={sampleRoomLiving} alt="AI scanning a room" />
        <div className="tru-ai-preview-overlay">
          <Camera className="w-8 h-8" />
          <span>See how it works</span>
        </div>
      </div>
      <div className="tru-ai-preview-content">
        <p className="tru-ai-preview-tagline">
          <strong>Walk through your home with your phone camera</strong> or snap photos of each room.
          Our neural network identifies furniture, boxes, and appliances automatically—calculating 
          weight, volume, and cubic footage in seconds.
        </p>
        <p className="tru-ai-preview-trust">
          <CheckCircle className="w-4 h-4" />
          <span>Every inventory is confirmed with a live TruMove specialist before your quote is finalized—
          so there are no surprises on move day.</span>
        </p>
        <p className="tru-ai-preview-privacy">
          <ShieldCheck className="w-4 h-4" />
          <span>No strangers walking through your home. You control the camera, you control the process.</span>
        </p>
      </div>
    </div>
    
    {/* Existing 3-step grid - simplified */}
    <div className="tru-ai-steps-grid">
      <div className="tru-ai-step">
        <div className="tru-ai-step-number">1</div>
        <div className="tru-ai-step-content">
          <h3 className="tru-ai-step-title">Video or Photos</h3>
          <p className="tru-ai-step-desc">Walk through rooms with your camera or upload photos.</p>
        </div>
      </div>
      <div className="tru-ai-step">
        <div className="tru-ai-step-number">2</div>
        <div className="tru-ai-step-content">
          <h3 className="tru-ai-step-title">AI Detection</h3>
          <p className="tru-ai-step-desc">Computer vision identifies items and estimates weight/volume.</p>
        </div>
      </div>
      <div className="tru-ai-step">
        <div className="tru-ai-step-number">3</div>
        <div className="tru-ai-step-content">
          <h3 className="tru-ai-step-title">Agent Confirmation</h3>
          <p className="tru-ai-step-desc">A live specialist reviews to ensure accuracy.</p>
        </div>
      </div>
    </div>
    
    {/* Existing action buttons */}
    <div className="tru-inventory-actions">
      ...
    </div>
  </div>
</section>
```

---

### 2. `src/index.css`

**Move feature carousel higher:**

Update `.tru-feature-carousel-fullwidth` (line 15492):
```css
.tru-feature-carousel-fullwidth {
  margin: 24px auto 0;  /* Was 48px - reduced */
  padding: 16px 24px 24px;  /* Reduced top padding */
}
```

**Add new AI preview block styles:**

```css
/* AI Preview Block - Video/Image + Copy */
.tru-ai-preview-block {
  display: flex;
  gap: 32px;
  align-items: center;
  margin-bottom: 32px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 16px;
  padding: 24px;
  text-align: left;
}

.tru-ai-preview-video {
  flex-shrink: 0;
  width: 180px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background: hsl(var(--muted));
}

.tru-ai-preview-video img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tru-ai-preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: hsl(var(--tm-ink) / 0.5);
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: background 0.2s ease;
}

.tru-ai-preview-video:hover .tru-ai-preview-overlay {
  background: hsl(var(--primary) / 0.7);
}

.tru-ai-preview-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tru-ai-preview-tagline {
  font-size: 15px;
  color: hsl(var(--tm-ink) / 0.85);
  line-height: 1.6;
}

.tru-ai-preview-tagline strong {
  color: hsl(var(--tm-ink));
  font-weight: 700;
}

.tru-ai-preview-trust,
.tru-ai-preview-privacy {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: hsl(var(--tm-ink) / 0.7);
  line-height: 1.5;
}

.tru-ai-preview-trust svg {
  color: hsl(var(--primary));
  flex-shrink: 0;
  margin-top: 2px;
}

.tru-ai-preview-privacy svg {
  color: hsl(var(--primary));
  flex-shrink: 0;
  margin-top: 2px;
}

/* Responsive - stack on mobile */
@media (max-width: 768px) {
  .tru-ai-preview-block {
    flex-direction: column;
    text-align: center;
  }
  
  .tru-ai-preview-video {
    width: 100%;
    max-width: 280px;
    height: 160px;
  }
  
  .tru-ai-preview-trust,
  .tru-ai-preview-privacy {
    justify-content: center;
    text-align: left;
  }
}
```

---

## Visual Layout

**Before:**
```text
┌─────────────────────────────────────────────────────────────┐
│  HERO (Form + Why TruMove)                                  │
├─────────────────────────────────────────────────────────────┤
│  FEATURE CAROUSEL (48px top margin)                         │
├─────────────────────────────────────────────────────────────┤
│  BLACK STATS STRIP                                          │
├─────────────────────────────────────────────────────────────┤
│  Route Analysis Section                                     │
├─────────────────────────────────────────────────────────────┤
│  AI Inventory Analysis (basic 3 steps)                      │
└─────────────────────────────────────────────────────────────┘
```

**After:**
```text
┌─────────────────────────────────────────────────────────────┐
│  HERO (Form + Why TruMove)                                  │
├─────────────────────────────────────────────────────────────┤
│  FEATURE CAROUSEL (24px top margin - tighter)               │
├─────────────────────────────────────────────────────────────┤
│  AI INVENTORY ANALYSIS (moved UP)                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [Preview Image]  Walk through with camera or snap   │    │
│  │ [Play icon]      photos. AI identifies furniture... │    │
│  │                  ✓ Live agent confirmation          │    │
│  │                  ✓ No strangers in your home        │    │
│  └─────────────────────────────────────────────────────┘    │
│  [1] Video/Photos  [2] AI Detection  [3] Agent Confirm      │
├─────────────────────────────────────────────────────────────┤
│  BLACK STATS STRIP                                          │
├─────────────────────────────────────────────────────────────┤
│  Route Analysis Section                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Files Changed

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Reorder sections (AI steps before Stats Strip), add preview block with image and updated copy |
| `src/index.css` | Reduce feature carousel margins, add `.tru-ai-preview-block` styles |

---

## Updated Copy (Tech-forward language)

**Headline:** Start Your AI Inventory Analysis

**Preview Block Text:**
"Walk through your home with your phone camera or snap photos of each room. Our neural network identifies furniture, boxes, and appliances automatically—calculating weight, volume, and cubic footage in seconds."

**Trust Message:**
"Every inventory is confirmed with a live TruMove specialist before your quote is finalized—so there are no surprises on move day."

**Privacy Message:**
"No strangers walking through your home. You control the camera, you control the process."

---

## Testing Checklist

1. Verify feature carousel appears higher on page (tighter margin)
2. Verify AI Inventory Analysis section appears before the black stats strip
3. Verify preview image block renders with sample room image
4. Verify updated copy appears with tech-forward language
5. Verify live agent confirmation and privacy messaging is visible
6. Test on mobile to ensure preview block stacks properly
7. Verify action buttons (Build Inventory, Video Consult) still work
