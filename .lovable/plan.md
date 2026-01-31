
# Redesign Hero Header Logo & Tagline

## Overview
Restructure the hero header to display the TruMove logo stacked on top with "A Smarter Way to Move" centered directly underneath, removing the secondary tagline entirely.

---

## Current Structure

```text
┌─────────────────────────────────────────────────────────┐
│  [LOGO] A Smarter Way To Move  (inline on one line)     │
│     Moving. The Way Its Supposed To Be                  │
└─────────────────────────────────────────────────────────┘
```

## Target Structure

```text
┌─────────────────────────────────────────────────────────┐
│               [LOGO - TruMove]                          │
│         A Smarter Way To Move                           │
└─────────────────────────────────────────────────────────┘
```

---

## Technical Changes

### File: `src/pages/Index.tsx` (Lines 1047-1056)

**Current:**
```jsx
<div className="tru-hero-header-section tru-hero-header-refined">
  <h1 className="tru-hero-headline-main tru-headline-animated">
    <img src={logoImg} alt="TruMove" className="tru-hero-headline-logo" />
    A Smarter Way To <span className="tru-hero-headline-accent">Move</span>
  </h1>
  <p className="tru-hero-subheadline-refined tru-subheadline-animated">
    Moving. The Way Its Supposed To Be
  </p>
</div>
```

**Updated:**
```jsx
<div className="tru-hero-header-section tru-hero-header-refined tru-hero-header-stacked">
  <img src={logoImg} alt="TruMove" className="tru-hero-headline-logo tru-hero-logo-stacked" />
  <h1 className="tru-hero-headline-main tru-headline-animated">
    A Smarter Way To <span className="tru-hero-headline-accent">Move</span>
  </h1>
</div>
```

---

### File: `src/index.css`

**Add new stacked layout styles:**

```css
/* Stacked hero header layout - logo on top */
.tru-hero-header-stacked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* Logo when stacked - centered above headline */
.tru-hero-logo-stacked {
  display: block;
  height: 96px;
  width: auto;
  margin: 0 auto;
}

/* Override headline to remove inline flex behavior */
.tru-hero-header-stacked .tru-hero-headline-main {
  display: block;
  text-align: center;
}
```

---

## Summary of Changes

| Element | Before | After |
|---------|--------|-------|
| Logo position | Inline with headline text | Stacked above headline |
| Logo size | 72px height | 96px height (more prominent) |
| Headline | Contains logo inline | Text only, centered below logo |
| "Moving the way it's supposed to be" | Displayed as subheadline | **Removed** |
| Layout | Inline flex | Vertical flex column |

---

## Files Modified
- `src/pages/Index.tsx` - Restructure hero header JSX
- `src/index.css` - Add stacked layout CSS classes
