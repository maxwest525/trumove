
# Move Call Button and Dark Toggle Closer to Agent Login

## Current State

The header actions container (Call button + Dark toggle) has the following spacing:

```css
.header-actions {
  margin-left: 32px;
  padding-right: 80px;  /* Creates 80px gap from Agent Login */
}
```

The Agent Login button is absolutely positioned at `right: 24px`.

---

## Solution

Reduce the `padding-right` on `.header-actions` to move the buttons closer to Agent Login.

### File: `src/index.css`

**Update `.header-actions` (Lines 11513-11520)**

Change from:
```css
.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-left: 32px;
  padding-right: 80px;
}
```

To:
```css
.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-left: 32px;
  padding-right: 24px;
}
```

---

## Summary

| Property | Before | After |
|----------|--------|-------|
| padding-right | 80px | 24px |

This reduces the gap between the Call/Theme buttons and the Agent Login button by 56px, positioning them much closer together on the right side of the header.
