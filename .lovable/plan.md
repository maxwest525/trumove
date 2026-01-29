
# Plan: Reinstate Grey Trust Strip Under Header + Add Black Stats Section Divider

Based on your feedback and the uploaded reference images, two different trust strips need to be properly positioned:

## Issue Summary

| Component | Status | Should Be |
|-----------|--------|-----------|
| Grey SAFER Trust Strip | Component exists but NOT imported anywhere | Locked directly under floating header on EVERY page |
| Black Stats Section Divider | Does not exist | A section divider used lower on pages |

---

## 1. Grey SAFER Trust Strip (Under Header)

This is the strip showing FMCSA credibility items:
- SAFER Web Services
- Real-Time Updates  
- CSA BASIC Scores
- Authority Verification
- Insurance Coverage
- Official FMCSA Source (with external link icon)

**Solution:** Add the `SaferTrustStrip` component to `SiteShell.tsx` so it appears directly under the header on every page.

**File:** `src/components/layout/SiteShell.tsx`

```tsx
import SaferTrustStrip from "@/components/SaferTrustStrip";

export default function SiteShell({ children, centered = false, hideTrustStrip = false }) {
  return (
    <div className="...">
      {/* Sticky Header + Trust Strip Together */}
      <div className="sticky top-0 z-[90]">
        <Header />
        {!hideTrustStrip && <SaferTrustStrip />}
      </div>
      <main>...</main>
      <Footer />
    </div>
  );
}
```

**File:** `src/index.css` - Add styling for the grey trust strip:

```css
/* Grey SAFER Trust Strip - Always under header */
.safer-trust-strip {
  background: linear-gradient(to bottom, hsl(220 10% 94%), hsl(220 10% 96%));
  border-bottom: 1px solid hsl(220 10% 88%);
  padding: 8px 24px;
}

.safer-trust-strip-inner {
  max-width: 1480px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.safer-trust-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(220 15% 35%);
}

.safer-trust-item svg {
  width: 16px;
  height: 16px;
  color: hsl(142 70% 40%);
}

/* "Official FMCSA Source" gets special emphasis */
.safer-trust-item:last-child {
  font-weight: 800;
  color: hsl(142 70% 35%);
}

.safer-trust-dot {
  color: hsl(220 10% 70%);
  margin: 0 4px;
}

/* Dark mode */
.dark .safer-trust-strip {
  background: linear-gradient(to bottom, hsl(220 15% 12%), hsl(220 15% 10%));
  border-bottom-color: hsl(0 0% 100% / 0.1);
}

.dark .safer-trust-item {
  color: hsl(0 0% 100% / 0.8);
}

.dark .safer-trust-item svg {
  color: hsl(142 70% 55%);
}
```

---

## 2. Black Stats Section Divider (Lower on Page)

Create a new component for the stats bar showing:
- SERVING 48 STATES
- 50,000+ MOVES COMPLETED
- 24/7 SUPPORT
- 4.9★ CUSTOMER RATING
- LICENSED & INSURED
- A+ BBB RATING

**File:** `src/components/StatsStrip.tsx` (NEW)

```tsx
import { MapPin, TrendingUp, Headphones, Star, Shield, Award } from "lucide-react";

const STATS = [
  { icon: MapPin, text: "SERVING 48 STATES" },
  { icon: TrendingUp, text: "50,000+ MOVES COMPLETED" },
  { icon: Headphones, text: "24/7 SUPPORT" },
  { icon: Star, text: "4.9★ CUSTOMER RATING" },
  { icon: Shield, text: "LICENSED & INSURED" },
  { icon: Award, text: "A+ BBB RATING" },
];

export default function StatsStrip() {
  return (
    <div className="stats-strip">
      <div className="stats-strip-inner">
        {STATS.map((stat, idx) => (
          <div key={stat.text} className="stats-strip-item">
            <stat.icon className="w-4 h-4" />
            <span>{stat.text}</span>
            {idx < STATS.length - 1 && (
              <span className="stats-strip-dot">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**File:** `src/index.css` - Add styling for black stats strip:

```css
/* Black Stats Section Divider */
.stats-strip {
  background: linear-gradient(to bottom, hsl(220 15% 6%), hsl(220 15% 4%));
  border-top: 1px solid hsl(0 0% 100% / 0.08);
  border-bottom: 1px solid hsl(0 0% 100% / 0.08);
  padding: 12px 24px;
}

.stats-strip-inner {
  max-width: 1480px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.stats-strip-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: hsl(0 0% 100% / 0.85);
}

.stats-strip-item svg {
  width: 14px;
  height: 14px;
  color: hsl(142 70% 50%);
}

.stats-strip-dot {
  color: hsl(0 0% 100% / 0.3);
  margin: 0 8px;
}
```

---

## 3. Add Stats Strip to Homepage

**File:** `src/pages/Index.tsx`

Import and place the StatsStrip component as a section divider between major content sections (e.g., after the hero form, before the "Why TruMove" section):

```tsx
import StatsStrip from "@/components/StatsStrip";

// In the JSX, place between sections:
<StatsStrip />
```

---

## Visual Layout After Changes

```text
┌─────────────────────────────────────────────────┐
│  FLOATING HEADER (TruMove logo, nav, etc.)      │  ← Sticky
├─────────────────────────────────────────────────┤
│  GREY SAFER TRUST STRIP                         │  ← Sticky with header
│  (SAFER Web Services • Real-Time Updates • ...) │
├─────────────────────────────────────────────────┤
│                                                 │
│               PAGE CONTENT                      │
│                                                 │
├─────────────────────────────────────────────────┤
│  BLACK STATS STRIP (Section Divider)            │  ← Static, between sections
│  (SERVING 48 STATES • 50,000+ MOVES • ...)      │
├─────────────────────────────────────────────────┤
│                                                 │
│               MORE CONTENT                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Files Changed Summary

| File | Change |
|------|--------|
| `src/components/layout/SiteShell.tsx` | Import and render SaferTrustStrip under header |
| `src/components/SaferTrustStrip.tsx` | Already exists - no changes needed |
| `src/components/StatsStrip.tsx` | NEW - Black stats section divider component |
| `src/index.css` | Add `.safer-trust-strip` and `.stats-strip` styles |
| `src/pages/Index.tsx` | Import and place StatsStrip between sections |

---

## Testing Checklist

After implementation:
1. Visit homepage - grey SAFER strip should appear directly under the floating header
2. Scroll down - both header AND grey strip should remain sticky together
3. Navigate to other pages (/online-estimate, /vetting, /track) - grey strip should appear on all
4. Check homepage - black stats strip should appear as a section divider between content areas
5. Test dark mode - both strips should have proper contrast
6. Test mobile responsiveness - strips should wrap gracefully
