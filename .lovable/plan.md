
# Increase AI Step Preview Images to 150x112px

## Change Required

Update the `.tru-ai-step-preview` class in `src/index.css` to use larger dimensions.

---

## File: `src/index.css` (Lines 2641-2649)

**Before:**
```css
.tru-ai-step-preview {
  width: 120px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid hsl(var(--tm-ink) / 0.12);
  background: hsl(var(--muted) / 0.3);
}
```

**After:**
```css
.tru-ai-step-preview {
  width: 150px;
  height: 112px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid hsl(var(--tm-ink) / 0.12);
  background: hsl(var(--muted) / 0.3);
}
```

---

## Summary

| Property | Before | After |
|----------|--------|-------|
| Width | 120px | 150px |
| Height | 90px | 112px |

This makes the step preview thumbnails 25% larger for improved visibility of the room scanning, AI detection, and agent confirmation preview images.
