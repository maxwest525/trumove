
# Plan: Wider Chat Modal & Character Case Fix

## Overview
Two changes to improve the chat experience:
1. Make the chat modal wider than tall (landscape orientation instead of portrait)
2. Fix "TruDy" → "Trudy" character case

---

## Visual Change

```text
BEFORE (Portrait - 420px wide, full height):
+------------------+
|                  |
|                  |
|  Chat Modal      |
|  (tall)          |
|                  |
|                  |
|                  |
+------------------+

AFTER (Landscape - 560px wide, 480px max height):
+--------------------------------+
|                                |
|  Chat Modal (wider)            |
|                                |
+--------------------------------+
```

---

## Technical Changes

### File: `src/index.css` (Lines 12707-12722)

Update `.chat-modal-panel` to be wider and have a maximum height:

**Current:**
```css
.chat-modal-panel {
  position: fixed;
  top: 80px;
  right: 24px;
  bottom: 24px;
  width: 420px;
  max-width: calc(100vw - 48px);
  ...
}
```

**Updated:**
```css
.chat-modal-panel {
  position: fixed;
  top: auto;
  bottom: 120px;
  right: 24px;
  width: 560px;
  max-width: calc(100vw - 48px);
  height: 480px;
  max-height: calc(100vh - 160px);
  ...
}
```

This changes:
- Width: 420px → 560px (wider)
- Height: Full height → Fixed 480px (shorter, landscape ratio)
- Position: Anchored to bottom-right near the floating chat button

---

### File: `src/components/FloatingTruckChat.tsx` (Line 116)

Fix character case in aria-label:

**Before:** `aria-label="TruDy AI Moving Helper"`
**After:** `aria-label="Trudy AI Moving Helper"`

---

## Summary

| Change | Before | After |
|--------|--------|-------|
| Modal width | 420px | 560px |
| Modal height | Full (top:80px to bottom:24px) | 480px max |
| Modal position | Anchored top-right | Anchored bottom-right |
| Character case | "TruDy" | "Trudy" |

---

## Files Modified

- `src/index.css` - Chat modal dimensions
- `src/components/FloatingTruckChat.tsx` - Character case fix
