
# Fix Video Consult Image Cropping

## Overview
Adjust the image cropping for the video consult preview image in the "Why TruMove" carousel cards so the image shows the important content (likely faces/people) rather than cropping it incorrectly.

---

## Current State

The `.tru-why-carousel-card-image img` CSS rule uses `object-fit: cover` without specifying an `object-position`, which defaults to `center center`. This may be cutting off important parts of the video consult image.

**Current CSS (lines 26246-26251):**
```css
.tru-why-carousel-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
```

For comparison, the Features carousel uses `object-position: center 30%` to show more of the top portion of images.

---

## Changes Required

### File: `src/index.css`

**Lines 26246-26251** - Add `object-position` to show the correct portion of the image:

**Before:**
```css
.tru-why-carousel-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
```

**After:**
```css
.tru-why-carousel-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.3s ease;
}
```

Using `center top` will show the top portion of the image, which typically includes faces and heads in video call previews. If needed, this can be fine-tuned to `center 20%` or `center 30%` depending on the exact image composition.

---

## Visual Result

| Before | After |
|--------|-------|
| Image cropped to center (may cut off heads) | Image shows top portion (faces visible) |

---

## Alternative Positions

If `center top` isn't quite right, here are other options:

| Position | Effect |
|----------|--------|
| `center top` | Shows topmost part of image |
| `center 20%` | Shows near-top, slight headroom |
| `center 30%` | Shows upper-third (matches Features carousel) |
| `center center` | Default - dead center |

---

## Summary

| File | Change |
|------|--------|
| `src/index.css` | Add `object-position: center top;` to `.tru-why-carousel-card-image img` (line 26249) |
