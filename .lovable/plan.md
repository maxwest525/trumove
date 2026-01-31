
# Plan: Match Video Consult Trust Strip to Homepage Stats Strip Style

## Current Differences

| Property | Homepage StatsStrip | Video Consult Trust Strip |
|----------|---------------------|---------------------------|
| Text case | ALL CAPS in data | Title Case in data |
| font-weight | 700 (bold) | 500 (medium) |
| text-transform | uppercase | none |
| letter-spacing | 0.06em | none |

## Changes

### 1. Update Trust Strip Text to ALL CAPS

**File: `src/components/video-consult/VideoConsultTrustStrip.tsx`**

Update the TRUST_ITEMS array to use all caps text:

```tsx
const TRUST_ITEMS = [
  { icon: Shield, text: "SECURE VIDEO" },
  { icon: BadgeCheck, text: "LICENSED BROKER" },
  { icon: Monitor, text: "SCREEN SHARING" },
  { icon: FileText, text: "QUOTE REVIEW" },
  { icon: Clock, text: "NO OBLIGATION" },
];
```

### 2. Update CSS to Match Homepage Stats Strip Typography

**File: `src/index.css`**

Update `.video-consult-trust-item` to match `.stats-strip-item`:

| Property | Current | New |
|----------|---------|-----|
| font-weight | 500 | 700 |
| text-transform | (none) | uppercase |
| letter-spacing | (none) | 0.06em |

```css
.video-consult-trust-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;           /* Changed from 500 */
  text-transform: uppercase;   /* Added */
  letter-spacing: 0.06em;      /* Added */
  color: hsl(0 0% 100% / 0.85);
  white-space: nowrap;
}
```

## Result

The Video Consult Trust Strip will have the same bold, all-caps, spaced typography as the homepage Stats Strip, creating visual consistency across the site.
