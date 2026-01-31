
# Plan: Fix Video Consult Trust Strip Positioning

## Problem

The `VideoConsultTrustStrip` on the `/book` page is being hidden behind the sticky `video-consult-header` because:
1. The header uses `position: sticky` with `top: 103px`
2. The trust strip uses `position: relative` - so it scrolls with the page and slides underneath the sticky header

## Solution

Make the trust strip sticky as well, positioned directly below the video-consult-header, so both stay locked together when scrolling.

## Implementation

### File: `src/index.css`

**Update the `.video-consult-trust-strip` styles (lines 29885-29891):**

| Property | Current | New |
|----------|---------|-----|
| `position` | `relative` | `sticky` |
| `top` | *(none)* | `151px` (header top 103px + header height ~48px) |
| `z-index` | `35` | `39` (below header z-40, but still above content) |

**Update the `.video-consult-trust-strip-inner` styles (lines 29893-29900):**

| Property | Current | New |
|----------|---------|-----|
| `gap` | `48px` | `28px` (to match SaferTrustStrip spacing) |

### CSS Changes

```css
/* FROM */
.video-consult-trust-strip {
  position: relative;
  z-index: 35;
  background: linear-gradient(to bottom, hsl(220 15% 6%), hsl(220 15% 4%));
  border-bottom: 1px solid hsl(0 0% 100% / 0.08);
  padding: 8px 24px;
}

.video-consult-trust-strip-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  max-width: 1480px;
  margin: 0 auto;
  flex-wrap: wrap;
}

/* TO */
.video-consult-trust-strip {
  position: sticky;
  top: 151px; /* Header (103px) + video-consult-header height (~48px) */
  z-index: 39;
  background: linear-gradient(to bottom, hsl(220 15% 6%), hsl(220 15% 4%));
  border-bottom: 1px solid hsl(0 0% 100% / 0.08);
  padding: 8px 24px;
}

.video-consult-trust-strip-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px; /* Match SaferTrustStrip spacing */
  max-width: 1480px;
  margin: 0 auto;
  flex-wrap: nowrap;
  white-space: nowrap;
  min-width: max-content;
}
```

## Result

- The Video Consult Trust Strip will now be sticky and locked directly below the Video Consult Center header
- Both headers will scroll together as a unified sticky block
- The trust item spacing (28px gap) will match the SaferTrustStrip used on other pages
- The trust items (Secure Video, Licensed Broker, Screen Sharing, Quote Review, No Obligation) remain unchanged as they are already video-consult-specific
