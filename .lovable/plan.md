

# Fix: Restore Scanner Size After Left Alignment Change

## Problem

The CSS file has **two separate `.tru-ai-steps-inner` definitions** that are conflicting:
- Lines 2262-2266: Sets `height: 100%` and flex properties
- Lines 2570-2574: Sets `max-width: none` and padding (added in last change)

These duplicate rules are causing unexpected layout behavior. Additionally, the `align-self: start` added to `.tru-ai-left-column` may have disrupted the grid's vertical distribution.

---

## Solution

Consolidate the `.tru-ai-steps-inner` rules into one definition and ensure the left column alignment doesn't affect the scanner sizing.

### File: `src/index.css`

**1. Remove duplicate `.tru-ai-steps-inner` (Lines 2262-2266)**

Delete:
```css
.tru-ai-steps-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
}
```

**2. Update the remaining `.tru-ai-steps-inner` (Lines 2570-2574)**

Combine both definitions into one:
```css
.tru-ai-steps-inner {
  max-width: none;
  padding: 0 48px 0 24px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
}
```

**3. Fix left column alignment without affecting height (Lines 2595-2602)**

Change `align-self: start` to `align-self: stretch` so it doesn't collapse vertically:
```css
.tru-ai-left-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-self: start;
  align-self: stretch;  /* Changed from 'start' to maintain height */
  padding-left: 0;
}
```

This keeps the steps aligned to the left horizontally while allowing the scanner and detection columns to maintain their full height.

---

## Summary

| Issue | Cause | Fix |
|-------|-------|-----|
| Scanner shrunk | Duplicate CSS rules for `.tru-ai-steps-inner` | Consolidate into single definition |
| Grid height affected | `align-self: start` on left column | Change to `align-self: stretch` |

