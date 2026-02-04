

# Shipment Tracker Section Plan

## Overview
Create a new Shipment Tracker section that mirrors the AI Analysis Estimator section's design but with a **reversed layout** (image/preview on the LEFT, text content on the RIGHT). This section will replace the current "How It Works" (StepsCompactSection).

---

## Layout Comparison

```text
AI Analysis Estimator (Current):     Shipment Tracker (New):
┌────────────────────────────────┐   ┌────────────────────────────────┐
│  [TEXT]    |    [PREVIEWS]     │   │  [PREVIEW]   |     [TEXT]     │
│  Left side | Right side        │   │  Left side   |   Right side   │
│            |                   │   │              |                │
│  - Headline│ - Scanner demo    │   │  - Map/      │  - Headline    │
│  - Steps   │ - Detection list  │   │    Tracking  │  - Steps       │
│  - CTA     │                   │   │    preview   │  - CTA         │
└────────────────────────────────┘   └────────────────────────────────┘
```

---

## Changes

### 1. New Component: `ShipmentTrackerSection`

**File: `src/pages/Index.tsx`**

Create a new section component that follows the AI Analysis pattern:

**Content Structure:**
- **Eyebrow badge**: "Real-Time Tracking"
- **Headline**: "Track. Monitor. Arrive." with green accent on "Arrive."
- **Subheadline**: "Know exactly where your belongings are. GPS tracking, live ETAs, and instant updates—from pickup to delivery."
- **Step pills**: 
  - 01 - Enter booking
  - 02 - Live GPS view
  - 03 - Arrive on time
- **CTA button**: "Track Your Shipment" → links to `/track`

**Preview Component:**
- Uses `previewPropertyLookup` image (already imported - shows a satellite/map view)
- Styled as a tracking map preview with overlay elements:
  - "LIVE GPS" badge (green dot + label)
  - Route line overlay
  - Truck icon indicator

### 2. CSS Styling: Mirrored Layout

**File: `src/index.css`**

New CSS classes for the reversed (mirrored) layout:

```text
Class Naming Convention:
- .tru-tracker-section (main container - same base as .tru-ai-steps-section)
- .tru-tracker-header-row (flex container)
- .tru-tracker-preview-left (preview on left - MIRRORED position)
- .tru-tracker-content-right (content on right - MIRRORED position)
```

**Key Differences from AI Section:**
| Property | AI Section | Tracker Section |
|----------|------------|-----------------|
| Preview position | `left: 550px; margin-left: 4rem` | `right: 550px; margin-right: 4rem` |
| Content position | `left: 550px; transform: translate(-100%, -50%)` | `right: 550px; transform: translate(100%, -50%)` |
| Content alignment | `margin-left: -4rem` | `margin-right: -4rem` |

### 3. Preview Component: `TrackingPreview`

A static preview card showing a satellite map view with tracking overlays:

```text
┌──────────────────────────────────────┐
│  ┌──────────────────────────────┐   │
│  │  [Satellite Map Image]       │   │
│  │                              │   │
│  │    ─── Route Line ───→       │   │
│  │         🚚                   │   │
│  │                              │   │
│  │  ┌─────────┐                 │   │
│  │  │ 🟢 LIVE │                 │   │
│  │  └─────────┘                 │   │
│  └──────────────────────────────┘   │
│                                      │
│  "Real-time GPS • 2.3 hrs to dest"  │
└──────────────────────────────────────┘
```

### 4. Remove `StepsCompactSection`

- Remove the `<StepsCompactSection navigate={navigate} />` component call from Index.tsx
- The new Shipment Tracker section takes its place

---

## Technical Implementation

### File: `src/pages/Index.tsx`

**Add new component** (around line 400, after DetectionList):

```tsx
// Tracking Preview Component - Left column (mirrored layout)
function TrackingPreview() {
  return (
    <div className="tru-tracker-preview">
      <img src={previewPropertyLookup} alt="Live GPS Tracking" />
      {/* Live badge */}
      <div className="tru-tracker-live-badge">
        <span className="tru-tracker-live-dot" />
        <span>LIVE GPS</span>
      </div>
      {/* Route overlay */}
      <div className="tru-tracker-route-overlay">
        <Truck className="w-5 h-5" />
      </div>
      {/* Stats bar at bottom */}
      <div className="tru-tracker-stats-bar">
        <span><MapPin className="w-3.5 h-3.5" /> Real-time GPS</span>
        <span><Clock className="w-3.5 h-3.5" /> Live ETA updates</span>
      </div>
    </div>
  );
}

// Shipment Tracker Section (mirrored layout)
function ShipmentTrackerSection({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="tru-tracker-section">
      <div className="tru-tracker-inner">
        <div className="tru-tracker-header-row">
          {/* Preview on LEFT (mirrored) */}
          <div className="tru-tracker-preview-left">
            <TrackingPreview />
          </div>
          
          {/* Content on RIGHT (mirrored) */}
          <div className="tru-tracker-content-right">
            <div className="tru-ai-headline-block">
              <h3 className="tru-ai-section-title">Real-Time Tracking</h3>
              <h2 className="tru-ai-main-headline">
                Track. Monitor.<br />
                <span className="tru-ai-headline-accent">Arrive.</span>
              </h2>
              <p className="tru-ai-subheadline">
                Know exactly where your belongings are. GPS tracking, live ETAs, and instant updates—from pickup to delivery.
              </p>
            </div>
            
            {/* Step pills */}
            <div className="tru-ai-step-pills">
              {[
                { num: "01", label: "Enter booking" },
                { num: "02", label: "Live GPS view" },
                { num: "03", label: "Arrive on time" }
              ].map((step) => (
                <div key={step.num} className="tru-ai-step-pill">
                  <span className="tru-ai-step-num">{step.num}</span>
                  <span className="tru-ai-step-label">{step.label}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <button 
              onClick={() => navigate("/track")}
              className="tru-ai-cta-btn"
            >
              <MapPin className="w-4 h-4" />
              Track Your Shipment
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Replace StepsCompactSection call** (around line 1577):

```tsx
// Before:
<StepsCompactSection navigate={navigate} />

// After:
<ShipmentTrackerSection navigate={navigate} />
```

### File: `src/index.css`

**Add new CSS section** (after the AI Steps Section styles):

```css
/* =============================================
   SHIPMENT TRACKER SECTION (Mirrored Layout)
   ============================================= */
.tru-tracker-section {
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-md) var(--spacing-md);
  margin-top: 0;
  background: hsl(var(--background));
  position: relative;
  z-index: 5;
  height: auto;
  min-height: auto;
  overflow: hidden;
}

.tru-tracker-inner {
  max-width: none;
  padding: 0 48px 0 24px;
  position: relative;
}

.tru-tracker-header-row {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: var(--spacing-sm);
  min-height: var(--ai-section-min-height);
  height: auto;
}

/* Preview container - LEFT side (mirrored from AI section) */
.tru-tracker-preview-left {
  position: absolute;
  right: 550px;
  top: 50%;
  transform: translate(0, -50%);
  margin-right: 4rem;
  z-index: 10;
}

/* Content container - RIGHT side (mirrored from AI section) */
.tru-tracker-content-right {
  position: absolute;
  right: 550px;
  top: 50%;
  transform: translate(100%, -50%);
  margin-right: -4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  width: auto;
  max-width: 26rem;
  z-index: 5;
}

/* Tracking Preview Card */
.tru-tracker-preview {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  width: 420px;
  height: clamp(24rem, 38vh, 30rem);
  min-height: 24rem;
  border: 1px solid hsl(var(--border));
  box-shadow: 0 8px 32px hsl(var(--tm-ink) / 0.1);
}

.tru-tracker-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Live GPS Badge */
.tru-tracker-live-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: hsl(var(--foreground) / 0.9);
  color: hsl(var(--background));
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px hsl(var(--tm-ink) / 0.3);
}

.tru-tracker-live-dot {
  width: 8px;
  height: 8px;
  background: hsl(var(--primary));
  border-radius: 50%;
  animation: tracker-pulse 1.5s ease-in-out infinite;
}

@keyframes tracker-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

/* Route overlay */
.tru-tracker-route-overlay {
  position: absolute;
  bottom: 60px;
  right: 40px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(var(--primary));
  color: white;
  border-radius: 50%;
  box-shadow: 0 4px 16px hsl(var(--primary) / 0.5);
  animation: tracker-truck-bob 2s ease-in-out infinite;
}

@keyframes tracker-truck-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* Stats bar at bottom */
.tru-tracker-stats-bar {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 8px 16px;
  background: hsl(var(--foreground) / 0.85);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  color: hsl(var(--background));
  font-size: 11px;
  font-weight: 600;
}

.tru-tracker-stats-bar span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Responsive: stack on smaller screens */
@media (max-width: 1100px) {
  .tru-tracker-header-row {
    flex-direction: column;
    align-items: center;
    min-height: auto;
    gap: var(--spacing-xl);
  }
  
  .tru-tracker-preview-left,
  .tru-tracker-content-right {
    position: relative;
    right: auto;
    top: auto;
    transform: none;
    margin-right: 0;
  }
  
  .tru-tracker-content-right {
    width: 100%;
    max-width: 31.25rem;
    text-align: center;
    align-items: center;
  }
  
  .tru-tracker-preview {
    width: 100%;
    max-width: 25rem;
    height: 21.875rem;
  }
}

/* Dark mode */
.dark .tru-tracker-section {
  background: hsl(220 15% 8%);
}
```

---

## Visual Result

The new Shipment Tracker section will:

1. **Mirror the AI Analysis layout** - Preview on left, content on right
2. **Use the same visual language** - Same headline styling, step pills, CTA button
3. **Feature a map/tracking preview** - Shows the satellite view image with GPS overlay elements
4. **Replace the old "How It Works" section** - More visually engaging and consistent with the AI section above it

---

## Files Modified

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Add `TrackingPreview` and `ShipmentTrackerSection` components; replace `StepsCompactSection` call |
| `src/index.css` | Add `.tru-tracker-*` CSS classes for mirrored layout |

