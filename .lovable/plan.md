
# Fix Carousel Cards Expanding Beyond Container at All Times

## Problem

After removing `overflow: hidden` from parent containers, the feature carousel cards are now visible beyond the "Why TruMove" card boundaries at all times — not just on hover. The screenshot shows cards extending past the card edges in their default state.

## Root Cause

The carousel content uses `padding: 48px 8px` with negative margins to create space for the 1.35x hover expansion. With `overflow: visible` on all parent containers, this padding area is always visible.

## Solution

Re-add `overflow: hidden` to the `.tru-why-card-premium` container BUT use **clip-path: inset(0)** instead — this allows content to be clipped in normal state while hovered items can break out using `position: fixed` or by temporarily removing the clip on the parent during hover.

**Better approach:** Keep `overflow: hidden` on the parent card but restructure the hover effect to use a **portal/overlay pattern** or use **clip-path with hover state toggling**.

**Simplest fix:** Re-add `overflow: hidden` to `.tru-why-card-premium` and adjust the carousel to render hovered cards in a way that escapes the clipping context.

---

## Implementation

### File: `src/index.css`

#### Change 1: Add `overflow: hidden` back to Why TruMove card (line ~26206-26218)

```css
.tru-why-card-premium {
  position: relative;
  background: hsl(var(--background) / 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid transparent;
  border-radius: 20px;
  overflow: hidden;  /* Restore to clip content in normal state */
  ...
}
```

#### Change 2: Remove the extra padding from carousel content (line ~16606-16612)

The padding was added to accommodate hover overflow, but we'll handle this differently:

```css
.features-carousel-content {
  display: flex;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 8px;  /* Minimal padding, no extra space for overflow */
}
```

#### Change 3: Toggle overflow on parent when card is hovered (line ~26206)

Add a `:has()` selector to remove overflow when a card is hovered:

```css
.tru-why-card-premium:has(.features-carousel-card:hover) {
  overflow: visible;
}
```

This CSS-only solution:
- Keeps overflow hidden by default (cards stay within boundaries)
- Removes overflow restriction only when a card is being hovered
- The hovered card's 1.35x scale will then expand beyond the container

#### Change 4: Add same approach to hero wrapper (line ~1349)

```css
.tru-hero-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;  /* Prevent horizontal scroll */
}

.tru-hero-wrapper:has(.features-carousel-card:hover) {
  overflow-x: visible;
}
```

---

## Summary of Changes

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | ~26206-26218 | Add `overflow: hidden` back to `.tru-why-card-premium` |
| `src/index.css` | After 26218 | Add `.tru-why-card-premium:has(.features-carousel-card:hover) { overflow: visible; }` |
| `src/index.css` | ~16606-16612 | Remove excessive padding from `.features-carousel-content` (change to `padding: 8px`) |
| `src/index.css` | ~1349-1353 | Add `overflow-x: hidden` back to `.tru-hero-wrapper` |
| `src/index.css` | After 1353 | Add `.tru-hero-wrapper:has(.features-carousel-card:hover) { overflow-x: visible; }` |

---

## Expected Result

- Cards stay within container boundaries in their default state
- On hover, the parent container's overflow becomes visible
- The hovered card expands with the 1.35x scale effect beyond the container
- No content is clipped at all times — only during normal state
