

# Make Why TruMove Card Text Black + Reduce Spacing

## Overview
Update the Why TruMove card to use solid black text throughout (instead of muted grays) and reduce the vertical spacing between the subheadline and the mission paragraph below it.

---

## Current State

Looking at the JSX in `src/pages/Index.tsx` (lines 1469-1480):
```tsx
<h3 className="tru-ai-steps-title" style={{ fontSize: '24px', marginBottom: '8px' }}>
  Why <span className="tru-ai-gradient-text">TruMove</span>?
</h3>
<div className="tru-ai-accent-line" style={{ marginBottom: '6px' }} />
<p className="tru-ai-steps-subtitle" style={{ maxWidth: 'none' }}>
  Skip the van line middleman...
</p>

{/* Mission Paragraph - Larger font */}
<p className="tru-why-mission-paragraph tru-why-mission-large">
  We built TruMove to cut through...
</p>
```

Current CSS colors:
- `.tru-ai-steps-subtitle`: `color: hsl(var(--muted-foreground))` (gray)
- `.tru-why-mission-paragraph`: `color: hsl(var(--muted-foreground))` (gray)
- `.tru-ai-gradient-text`: animated green gradient

---

## Implementation Plan

### Step 1: Make Subheadline Text Black

**File: `src/index.css`** (lines 2275-2286)

Add a scoped override for the subtitle when inside the Why TruMove card. Create new CSS rule after line 26279:

```css
/* Why TruMove card - force black text */
.tru-why-card-premium .tru-ai-steps-subtitle {
  color: hsl(var(--tm-ink));
}
```

### Step 2: Make Mission Paragraph Text Black

**File: `src/index.css`** (line 26269)

Change `.tru-why-mission-paragraph` color from:
```css
color: hsl(var(--muted-foreground));
```
To:
```css
color: hsl(var(--tm-ink));
```

### Step 3: Remove Gradient from "TruMove" Text

**File: `src/pages/Index.tsx`** (line 1470)

Change from:
```tsx
Why <span className="tru-ai-gradient-text">TruMove</span>?
```
To:
```tsx
Why TruMove?
```

Or if we want to keep the word "TruMove" as a span but just make it black:
```tsx
Why <span style={{ color: 'hsl(var(--tm-ink))' }}>TruMove</span>?
```

### Step 4: Reduce Spacing Between Subheadline and Mission Paragraph

**File: `src/pages/Index.tsx`** (line 1473)

The subheadline uses `.tru-ai-steps-subtitle` which has `margin-bottom: 32px`. Override it inline to reduce spacing:

Change from:
```tsx
<p className="tru-ai-steps-subtitle" style={{ maxWidth: 'none' }}>
```
To:
```tsx
<p className="tru-ai-steps-subtitle" style={{ maxWidth: 'none', marginBottom: '8px' }}>
```

Also reduce the mission paragraph top margin in CSS (line 26278):
```css
margin: 0 0 8px 0;  /* Was: margin: 4px 0 8px 0 */
```

---

## Summary of Changes

| File | Line(s) | Change |
|------|---------|--------|
| `src/pages/Index.tsx` | 1470 | Remove `tru-ai-gradient-text` class or add inline black color |
| `src/pages/Index.tsx` | 1473 | Add `marginBottom: '8px'` to subheadline inline style |
| `src/index.css` | 26269 | Change mission paragraph color to `hsl(var(--tm-ink))` |
| `src/index.css` | 26278 | Reduce mission paragraph top margin to `0` |
| `src/index.css` | ~26280 | Add scoped override for subtitle color inside Why TruMove card |

---

## Visual Result

- **Title "Why TruMove?"**: All black text (no green gradient animation)
- **Subheadline**: Black text instead of muted gray
- **Mission paragraph**: Black text instead of muted gray  
- **Spacing**: Tighter gap between subheadline and mission paragraph (reduced from ~36px to ~8px)

