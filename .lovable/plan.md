

# Plan: Match "Move" Green to Logo & Update Subtitle

## Summary
This plan addresses two changes:
1. **Align the "Move" accent color** in the hero headline with the TruMove logo green
2. **Update the subtitle text** from "Carriers vetted against FMCSA safety records" to "AI-powered moving made simple"

---

## Technical Details

### 1. Color Correction for "Move" Accent

**Current Color Issue:**
The word "Move" in the headline currently uses a hardcoded value that doesn't match the logo:

| Element | Current Value | TruMove Logo Green |
|---------|--------------|-------------------|
| "Move" text | `hsl(142 72% 50%)` | `hsl(120 100% 54%)` |
| Hue | 142 (teal-green) | 120 (pure green) |
| Saturation | 72% | 100% |
| Lightness | 50% | 54% |

**Solution:**
Update `.tru-hero-headline-accent` in `src/index.css` (around line 1792-1796) to use the logo's green color stored in the CSS variable `--tm-green` or `--primary`:

```css
/* From: */
.tru-hero-headline-accent {
  color: hsl(142 72% 50%) !important;
  -webkit-text-fill-color: hsl(142 72% 50%) !important;
  font-weight: 900;
}

/* To: */
.tru-hero-headline-accent {
  color: hsl(var(--primary)) !important;
  -webkit-text-fill-color: hsl(var(--primary)) !important;
  font-weight: 900;
}
```

This change ensures the "Move" text uses the same green (`120 100% 54%`) as the TruMove logo.

---

### 2. Subtitle Text Update

**Locations to update:**
- `src/pages/Index.tsx` (line ~1074)

**Change:**
```text
From: "Carriers vetted against FMCSA safety records"
To:   "AI-powered moving made simple"
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/index.css` | Update `.tru-hero-headline-accent` color from `hsl(142 72% 50%)` to `hsl(var(--primary))` |
| `src/pages/Index.tsx` | Change subtitle text to "AI-powered moving made simple" |

---

## Visual Result

After these changes:
- The word "Move" will match the exact bright pure green of the TruMove logo
- The subtitle will read "AI-powered moving made simple"
- Both light and dark mode will work correctly since `--primary` is defined for both modes

