

# Plan: Add Trust Strip Under Video Consult Center Header

## Overview

Add a trust strip directly beneath the Video Consult Center header on the `/book` page, providing quick visual credibility indicators that match the style used elsewhere in the app.

## Design

The trust strip will appear immediately below the sticky Video Consult Center header, using relevant trust badges for a video consultation context:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [Logo] VIDEO CONSULT CENTER    │ [Enter Code...]  [Join] [Demo] │ [Call] │
├──────────────────────────────────────────────────────────────────────────┤
│ 🔒 Secure Video  •  ✓ Licensed Broker  •  🎥 Screen Sharing  •  📋 Free │
└──────────────────────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Create VideoConsultTrustStrip Component

**New File**: `src/components/video-consult/VideoConsultTrustStrip.tsx`

Create a trust strip with video-consult-specific items:

```tsx
import { Shield, Video, Monitor, FileText, BadgeCheck, Clock } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Shield, text: "Secure Video" },
  { icon: BadgeCheck, text: "Licensed Broker" },
  { icon: Monitor, text: "Screen Sharing" },
  { icon: FileText, text: "Quote Review" },
  { icon: Clock, text: "No Obligation" },
];

export default function VideoConsultTrustStrip() {
  return (
    <div className="video-consult-trust-strip">
      <div className="video-consult-trust-strip-inner">
        {TRUST_ITEMS.map((item, idx) => (
          <div key={item.text} className="video-consult-trust-item">
            <item.icon className="w-4 h-4" />
            <span>{item.text}</span>
            {idx < TRUST_ITEMS.length - 1 && (
              <span className="video-consult-trust-dot">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 2: Add CSS Styles

**File**: `src/index.css`

Add styles matching the existing trust strip aesthetic (black gradient, white text, green icons):

```css
/* VIDEO CONSULT TRUST STRIP */
.video-consult-trust-strip {
  background: linear-gradient(to bottom, hsl(220 15% 6%), hsl(220 15% 4%));
  border-bottom: 1px solid hsl(0 0% 100% / 0.08);
  padding: 8px 24px;
}

.video-consult-trust-strip-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  max-width: 1480px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.video-consult-trust-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: hsl(0 0% 100% / 0.85);
  white-space: nowrap;
}

.video-consult-trust-item svg {
  width: 16px;
  height: 16px;
  color: hsl(142 70% 55%);  /* Green icons */
}

.video-consult-trust-dot {
  color: hsl(0 0% 100% / 0.35);
  margin-left: 16px;
}
```

### Step 3: Update Book.tsx

**File**: `src/pages/Book.tsx`

Import and add the trust strip directly after the header:

```tsx
// Add import at top
import VideoConsultTrustStrip from "@/components/video-consult/VideoConsultTrustStrip";

// In the JSX, after the header closing tag
</header>

{/* Trust Strip */}
<VideoConsultTrustStrip />

{/* Main Content */}
<div className="min-h-[80vh] ...
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/video-consult/VideoConsultTrustStrip.tsx` | Create new component |
| `src/pages/Book.tsx` | Import and add trust strip after header |
| `src/index.css` | Add trust strip styles (~30 lines) |

## Visual Result

The Video Consult page will have a dark trust strip immediately below the sticky header, showing relevant trust indicators with green icons and white text, maintaining visual consistency with the Carrier Vetting and Tracking pages.

