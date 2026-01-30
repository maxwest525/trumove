
# Match "Move" Text Color to Logo Green

## Overview
Change the word "Move" in the hero headline to use the exact bright green from the TruMove logo (`--tm-green: 120 100% 54%`) instead of the current gradient greens.

---

## Current State
The logo uses a vibrant bright green: `hsl(120 100% 54%)` 

The "Move" text currently uses different, more muted greens:
- Line 1452: `hsl(145 70% 45%)` - teal-ish green
- Line 1764: `hsl(var(--primary))` to `hsl(160 80% 40%)` - gradient

---

## Changes Required

### File: `src/index.css`

**1. Update first `.tru-hero-headline-accent` (line 1451-1459):**

Replace the gradient with solid bright green matching the logo:

```css
.tru-hero-headline-accent {
  color: hsl(var(--tm-green));
  -webkit-text-fill-color: hsl(var(--tm-green));
  position: relative;
  display: inline-block;
  filter: drop-shadow(0 2px 8px hsl(var(--tm-green) / 0.4));
}
```

**2. Update second `.tru-hero-headline-accent` (line 1763-1769):**

Same solid bright green:

```css
.tru-hero-headline-accent {
  color: hsl(var(--tm-green));
  -webkit-text-fill-color: hsl(var(--tm-green));
  font-weight: 900;
  filter: drop-shadow(0 2px 8px hsl(var(--tm-green) / 0.4));
}
```

---

## Result

| Element | Before | After |
|---------|--------|-------|
| "Move" text | Gradient teal-green `hsl(145 70% 45%)` | Solid bright green `hsl(120 100% 54%)` |
| Drop shadow | Muted | Bright green glow to match |

The word "Move" will now match the exact bright green from the TruMove logo, creating visual consistency in the hero headline.
