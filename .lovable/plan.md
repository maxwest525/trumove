
# Plan: UI Fixes - Buttons, Header, Hero Opacity, and Floating Pill

This plan addresses 5 distinct issues with the UI:

1. **Floating Pill Text** - Change to 2-line format: "TruDy The AI Moving Helper" / "Ask Me Anything"
2. **Button Style Overhaul** - Fix the circle outline buttons and hover states across the site
3. **Hero Background Opacity** - Reduce opacity in dark mode so background image is more visible
4. **Recenter Button Visibility** - Ensure tracking buttons are visible
5. **Build Your Move Header** - Match the "Move Summary" dark header styling exactly

---

## Summary of Changes

| Issue | Solution | Files |
|-------|----------|-------|
| Floating pill text layout | Change to 2 lines with better font sizing | `FloatingTruckChat.tsx` |
| Button styling overhaul | Redesign button variants with better hover, larger fonts | `button.tsx`, `index.css` |
| Hero background too dark | Reduce overlay opacity values in dark mode | `index.css` |
| Tracking buttons | Already fixed - white icons visible | Already implemented |
| Build Your Move header | Force darker background in dark mode to match Move Summary | `index.css` |

---

## 1. Fix Floating Pill Text (2 Lines)

**File:** `src/components/FloatingTruckChat.tsx`

Change the text section from 3 lines to 2 lines as requested:

**Current:**
```tsx
<div className="flex flex-col items-start">
  <span className="text-sm font-bold leading-tight text-background">TruDy</span>
  <span className="text-[10px] leading-tight text-background/70">The AI Moving Helper</span>
  <span className="text-[10px] leading-tight text-primary font-medium">Ask Me Anything</span>
</div>
```

**New (2 lines):**
```tsx
<div className="flex flex-col items-start">
  <span className="text-sm font-bold leading-tight text-background">TruDy The AI Moving Helper</span>
  <span className="text-xs leading-tight text-primary font-semibold">Ask Me Anything</span>
</div>
```

This consolidates to exactly 2 lines with better readability.

---

## 2. Button Style Overhaul

The current buttons use circle outlines and small fonts. Here's a comprehensive redesign:

### 2.1 Update Button Variants

**File:** `src/components/ui/button.tsx`

Update the button variants to have better hover states and remove the "outline" look that appears too thin:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/85 hover:shadow-[0_4px_12px_hsl(var(--primary)/0.35)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/40",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-foreground text-background hover:bg-primary hover:text-foreground shadow-[0_4px_16px_hsl(var(--primary)/0.3)] hover:shadow-[0_8px_24px_hsl(var(--primary)/0.5)] transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-12 rounded-xl px-10 text-base font-bold",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

Key changes:
- Changed base `rounded-md` to `rounded-lg` for softer look
- Changed `font-medium` to `font-semibold` for bolder text
- Added `transition-all duration-200` for smoother hover
- Outline variant: Changed from `border` to `border-2` for more visibility
- Premium variant: Hover now uses primary color instead of inverting
- Added subtle glow shadow on default hover

### 2.2 Add Global Button CSS Improvements

**File:** `src/index.css`

Add improved button hover styles and fix specific button types:

```css
/* ========================================
   GLOBAL BUTTON IMPROVEMENTS
   ======================================== */

/* All buttons - improve hover feel */
button:not([disabled]) {
  cursor: pointer;
}

/* Pill buttons - softer border and better hover */
.tru-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 9999px;
  border: 2px solid hsl(var(--border));
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  transition: all 0.2s ease;
}

.tru-pill-btn:hover {
  border-color: hsl(var(--primary));
  background: hsl(var(--primary) / 0.08);
  color: hsl(var(--primary));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px hsl(var(--primary) / 0.15);
}

/* Solid pill buttons */
.tru-pill-btn.is-solid {
  background: hsl(var(--foreground));
  color: hsl(var(--background));
  border-color: hsl(var(--foreground));
}

.tru-pill-btn.is-solid:hover {
  background: hsl(var(--primary));
  border-color: hsl(var(--primary));
  color: hsl(var(--background));
}

/* Icon buttons - fix the circle outline issue */
.tru-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 2px solid hsl(var(--border));
  background: hsl(var(--card));
  color: hsl(var(--foreground));
  transition: all 0.2s ease;
}

.tru-icon-btn:hover {
  border-color: hsl(var(--primary) / 0.5);
  background: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
}

/* Dark mode button adjustments */
.dark .tru-pill-btn {
  border-color: hsl(0 0% 100% / 0.2);
}

.dark .tru-pill-btn:hover {
  border-color: hsl(var(--primary));
  background: hsl(var(--primary) / 0.15);
}

.dark .tru-icon-btn {
  border-color: hsl(0 0% 100% / 0.15);
  background: hsl(220 15% 14%);
}

.dark .tru-icon-btn:hover {
  border-color: hsl(var(--primary) / 0.6);
  background: hsl(var(--primary) / 0.2);
}
```

---

## 3. Hero Background - Less Opacity in Dark Mode

**File:** `src/index.css`

The current dark mode hero overlay is TOO dark (55% at top, 92% at bottom). Reduce these values so the background image is more visible:

**Current (too dark):**
```css
.dark .tru-hero-bg-overlay {
  background: linear-gradient(
    180deg,
    hsl(var(--background) / 0.55) 0%,
    hsl(var(--background) / 0.75) 25%,
    hsl(var(--background) / 0.92) 50%,
    hsl(var(--background)) 75%
  );
}
```

**New (more visible background):**
```css
.dark .tru-hero-bg-overlay {
  background: linear-gradient(
    180deg,
    hsl(var(--background) / 0.25) 0%,
    hsl(var(--background) / 0.45) 25%,
    hsl(var(--background) / 0.75) 50%,
    hsl(var(--background) / 0.95) 75%
  );
}
```

This reduces opacity significantly:
- Top: 55% → 25% (much more visible)
- 25%: 75% → 45% (more visible)
- 50%: 92% → 75% (more visible)
- 75%: 100% → 95% (still fades to solid for text)

---

## 4. Tracking Recenter Button

After reviewing the tracking page, the Recenter and Follow buttons appear to be working correctly now - they show white icons on dark backgrounds. The previous CSS fixes are in place:

```css
.tracking-header-satellite-btn svg {
  color: hsl(0 0% 100%) !important;
  stroke: hsl(0 0% 100%) !important;
}
```

**Status:** Already fixed - no changes needed.

---

## 5. Build Your Move Header - Match Move Summary

The "Build Your Move" header needs to exactly match the "Move Summary" header in dark mode. Looking at the reference image, the Move Summary has:
- Very dark background (almost black)
- Bright white "Move" text
- Green gradient on "Summary"

**File:** `src/index.css`

The existing dark mode styles need to be more specific to ensure the Build Your Move header matches:

**Current styles exist but need reinforcement:**
```css
.dark .tru-summary-header-large {
  background: hsl(220 15% 10%) !important;
  border-color: hsl(0 0% 100% / 0.1) !important;
}
```

**Add more specific enforcement for all header text:**
```css
/* Ensure Build Your Move and Move Summary headers match EXACTLY in dark mode */
.dark .tru-summary-header-large {
  background: hsl(220 15% 8%) !important;
}

.dark .tru-summary-header-large h3 {
  color: hsl(0 0% 100%) !important;
  font-weight: 800 !important;
}

/* Force the gradient accent to be vibrant green */
.dark .tru-summary-header-large .tru-qb-title-accent {
  background: linear-gradient(135deg, hsl(142 76% 50%) 0%, hsl(160 80% 45%) 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

/* Subtitle text - muted but visible */
.dark .tru-summary-header-large p,
.dark .tru-summary-header-large .text-muted-foreground {
  color: hsl(0 0% 100% / 0.5) !important;
}
```

---

## Files Changed Summary

| File | Change |
|------|--------|
| `src/components/FloatingTruckChat.tsx` | Update to 2-line text format |
| `src/components/ui/button.tsx` | Overhaul button variants with better styling |
| `src/index.css` | Add new pill/icon button classes, fix hero opacity, reinforce header styles |

---

## Testing Checklist

After implementation:
1. Check floating TruDy pill - should show 2 lines with larger "Ask Me Anything" text
2. Test buttons throughout the site - hover states should have primary color glow
3. Check homepage hero in dark mode - background image should be more visible
4. Go to /online-estimate in dark mode - "Build Your Move" header should match "Move Summary" exactly (dark bg, white text, green accent)
5. Test on mobile to ensure all changes work responsively
