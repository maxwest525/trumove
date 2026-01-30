
# Fix Header Actions Overlapping Agent Login Button

## Problem

The Call button and Theme Toggle (inside `.header-actions`) are positioned too far right, overlapping with the subtle divider and the absolutely positioned Agent Login button. This happens because:

1. `.header-actions` uses `margin-left: auto` to push to the right edge of the `header-inner` container
2. The Agent Login button is absolutely positioned at `right: 24px` from the full header
3. On certain viewport widths, these elements collide

---

## Solution

Add right padding/margin to `.header-actions` to create clearance for the Agent Login button and its divider.

---

## Implementation

### File: `src/index.css`

#### Update `.header-actions` styling (lines 11313-11319)

Add `padding-right` to create space between the header actions cluster and the Agent Login button area:

```css
.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-left: auto;
  padding-right: 140px; /* Space for Agent Login (~100px) + divider gap (~16px) + buffer */
}
```

---

## Alternative Approach (if padding causes layout issues)

Use `margin-right` instead:

```css
.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-left: auto;
  margin-right: 140px;
}
```

---

## Summary

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 11313-11319 | Add `padding-right: 140px` or `margin-right: 140px` to `.header-actions` to create clearance for Agent Login button |

---

## Expected Result

- Call button and Theme Toggle shift left, creating clear separation from the divider
- Agent Login button and divider remain at the far right edge without overlap
- Visual hierarchy is maintained: main actions cluster → divider → Agent Login
