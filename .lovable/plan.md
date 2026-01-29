

# Plan: Fix Floating Pill Text and Build Your Move Header

This plan addresses the remaining UI issues discovered during testing:

1. **Floating Pill Text** - Change to "Trudy Move Helper" / "AI Chat Assitance" (user's spelling)
2. **Build Your Move Header** - Consolidate CSS rules to ensure dark background applies correctly

---

## Summary of Changes

| Issue | Solution | Files |
|-------|----------|-------|
| Floating pill text | Update to user's exact wording | `FloatingTruckChat.tsx` |
| Build Your Move header not dark | Remove duplicate CSS rule and consolidate | `index.css` |

---

## 1. Update Floating Pill Text

**File:** `src/components/FloatingTruckChat.tsx`

Change the text from current:
```tsx
<span className="text-sm font-bold leading-tight text-background">TruDy The AI Moving Helper</span>
<span className="text-xs leading-tight text-primary font-semibold">Ask Me Anything</span>
```

To user's exact requested text:
```tsx
<span className="text-sm font-bold leading-tight text-background">Trudy Move Helper</span>
<span className="text-xs leading-tight text-primary font-semibold">AI Chat Assitance</span>
```

---

## 2. Fix Build Your Move Header CSS

**File:** `src/index.css`

The issue is that there are two `.dark .tru-summary-header-large` rules in the CSS:

**Line 17595-17597 (earlier in file):**
```css
.dark .tru-summary-header-large {
  background: hsl(220 20% 14%);  /* Lighter gray */
}
```

**Line 26425-26428 (later in file):**
```css
.dark .tru-summary-header-large {
  background: hsl(220 15% 8%) !important;  /* Darker, almost black */
  border-color: hsl(0 0% 100% / 0.1) !important;
}
```

**Solution:** Remove the earlier rule (lines 17595-17597) to prevent any potential conflict, and ensure the dark `hsl(220 15% 8%)` rule is the only one. Also add higher specificity selectors to guarantee the dark background applies.

**Updated CSS (replace line 17595-17597):**
```css
/* Removed - consolidated below */
```

**Enhanced rule at line 26425:**
```css
/* Build Your Move header - match Move Summary styling EXACTLY in dark mode */
.dark .tru-summary-header-large,
.dark .rounded-2xl .tru-summary-header-large,
.dark .bg-card .tru-summary-header-large,
.dark section .tru-summary-header-large {
  background: hsl(220 15% 8%) !important;
  border-color: hsl(0 0% 100% / 0.1) !important;
}
```

This adds higher specificity selectors to ensure the dark background applies regardless of the parent context.

---

## Testing Results from Browser

**Verified working:**
- ✅ Recenter button on /track - white icon visible
- ✅ TruDy chat text readable in dark mode
- ✅ Hero background visibility improved in dark mode

**Needs fixing:**
- ❌ Floating pill text - needs update to "Trudy Move Helper" / "AI Chat Assitance"
- ❌ Build Your Move header - not getting dark background (CSS conflict)

---

## Files Changed Summary

| File | Change |
|------|--------|
| `src/components/FloatingTruckChat.tsx` | Update pill text to "Trudy Move Helper" / "AI Chat Assitance" |
| `src/index.css` | Remove duplicate dark rule, add higher specificity selectors |

---

## Visual Changes

### Floating Pill
| Before | After |
|--------|-------|
| "TruDy The AI Moving Helper" | "Trudy Move Helper" |
| "Ask Me Anything" | "AI Chat Assitance" |

### Build Your Move Header (Dark Mode)
| Before | After |
|--------|-------|
| Light gray background | Very dark (almost black) background |
| Green accent barely visible | Vibrant green gradient on "Move" |

