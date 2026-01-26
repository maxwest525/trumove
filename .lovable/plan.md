

# Fix Carousel: Spacing, Clipping, and Blur - Final Solution

## The Real Problem

You're absolutely right - the cards need to be **slightly smaller** to leave room for spacing. Here's why:

**Embla Carousel ignores CSS `gap`** because it positions slides using JavaScript `translate3d()` transforms, not native flexbox layout. The current CSS says:
- Cards are `calc((100% - 48px) / 4)` wide
- Gap of `16px` between them

But Embla doesn't see the `gap` - it just places cards side by side based on their width, causing them to touch.

## The Simple Fix

Instead of complex calculations, use **padding inside each item** to create visual spacing:

| Current (Broken) | Fixed |
|------------------|-------|
| `flex: 0 0 calc((100% - 48px) / 4)` + `gap: 16px` | `flex: 0 0 25%` + `padding: 0 8px` |
| Embla ignores gap, cards touch | Padding creates 16px visual gaps |

---

## Changes to `src/index.css`

### Lines 14733-14751 - Content and Item Styles

**Before:**
```css
.features-carousel-content {
  display: flex;
  gap: 16px;  /* Embla ignores this! */
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 8px 0;
}

.features-carousel-item {
  flex: 0 0 calc((100% - 48px) / 4) !important;
  min-width: 0;
  padding: 0 !important;
  margin: 0 !important;
  ...
}
```

**After:**
```css
.features-carousel-content {
  display: flex;
  /* REMOVED gap - Embla ignores it */
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 8px 8px;  /* Add horizontal padding to prevent edge clipping */
}

.features-carousel-item {
  flex: 0 0 25% !important;  /* Simple: 4 cards = 25% each */
  min-width: 0;
  padding: 0 8px !important;  /* 8px each side = 16px gap between cards */
  margin: 0 !important;
  position: relative;
  overflow: visible !important;
  box-sizing: border-box;  /* Critical: include padding in width */
}
```

### Lines 14754-14775 - Card Styles (Fix Blur)

Add `transform: translateZ(0)` to force GPU rendering and prevent subpixel blur:

```css
.features-carousel-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  height: 280px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px hsl(var(--tm-ink) / 0.04);
  position: relative;
  overflow: hidden;  /* Changed from visible to hidden */
  transition: border-color 250ms ease, box-shadow 300ms ease;
  box-sizing: border-box;
  /* Anti-blur fixes */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  transform: translateZ(0);  /* Force GPU layer - fixes blur */
  backface-visibility: hidden;
}
```

### Lines 14927-14960 - Responsive Breakpoints

Update to use simple percentages with padding:

```css
/* 3 cards on large tablet */
@media (max-width: 1279px) {
  .features-carousel-item {
    flex: 0 0 33.333% !important;
  }
}

/* 2 cards on tablet */
@media (max-width: 1024px) {
  .features-carousel-item {
    flex: 0 0 50% !important;
  }
}

/* 1 card on mobile */
@media (max-width: 640px) {
  .features-carousel-item {
    flex: 0 0 100% !important;
    padding: 0 4px !important;
  }
}
```

---

## Visual Explanation

```text
CURRENT (Broken - gap ignored by Embla):
┌──────────────────────────────────────────────────────┐
│[CARD][CARD][CARD][CARD]                              │
│  ↑ No gaps, cards touching                           │
└──────────────────────────────────────────────────────┘

FIXED (padding creates visual gaps):
┌──────────────────────────────────────────────────────┐
│ [  CARD  ] [  CARD  ] [  CARD  ] [  CARD  ]          │
│   ↑8px↑     ↑8px↑     ↑8px↑     ↑8px↑                │
│   └─ 16px gap between cards ─┘                       │
└──────────────────────────────────────────────────────┘
```

---

## Summary of All Fixes

| Issue | Root Cause | Fix |
|-------|------------|-----|
| Cards touching | Embla ignores CSS `gap` | Use `padding: 0 8px` on items |
| Edge clipping | No container padding | Add `padding: 8px 8px` to content |
| Blurry text | Subpixel rendering | Add `transform: translateZ(0)` |
| Complex math | Unnecessary calculations | Simple `25%` / `33.333%` / `50%` |

---

## Technical Details

### Why Padding Works

Each carousel item is `25%` wide with `8px` padding on each side. The card inside fills the remaining space. Between any two cards:
- Left card's right padding: 8px
- Right card's left padding: 8px  
- Total visual gap: 16px

### Why `box-sizing: border-box` is Critical

Without it, the `25%` width + `16px` padding would make items `25% + 16px` wide, breaking the layout. With `border-box`, padding is included in the `25%`.

