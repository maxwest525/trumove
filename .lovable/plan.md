

# Vertically Center TruMove Logo with Headline Text

## Overview
Adjust the TruMove logo positioning so it's vertically centered specifically with the words "A Smarter Way To Move", not just the container.

---

## Current State

The headline structure is:
```tsx
<h1 className="tru-hero-headline-main tru-headline-animated">
  <img src={logoImg} alt="TruMove" className="tru-hero-headline-logo" />
  A Smarter Way To <span className="tru-hero-headline-accent">Move</span>
</h1>
```

Current logo CSS (line 25933-25942):
```css
.tru-hero-headline-logo {
  height: 72px;
  margin-right: 16px;
  margin-bottom: 8px;  /* This pushes the logo UP relative to text */
  vertical-align: middle;
}
```

The `margin-bottom: 8px` is causing the logo to sit higher than the text baseline.

---

## Proposed Change

### File: `src/index.css`

Remove the `margin-bottom` from the logo so it aligns properly with the text via flexbox:

```css
/* From */
.tru-hero-headline-logo {
  height: 72px;
  width: auto;
  display: inline-block;
  vertical-align: middle;
  margin-right: 16px;
  margin-bottom: 8px;  /* Remove this */
  ...
}

/* To */
.tru-hero-headline-logo {
  height: 72px;
  width: auto;
  display: inline-block;
  vertical-align: middle;
  margin-right: 16px;
  margin-bottom: 0;    /* Changed to 0 */
  ...
}
```

---

## Visual Result

| Change | Before | After |
|--------|--------|-------|
| Logo vertical position | 8px higher than text center | Centered with text |

The logo will now sit at the same vertical center as the words "A Smarter Way To Move".

