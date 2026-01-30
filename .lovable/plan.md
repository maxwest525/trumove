

# Move Agent Login to Far Right of Navigation Strip

## Goal

Position the Agent Login button at the absolute far right edge of the navigation header, visually separated from the other action buttons (Call and Theme Toggle).

---

## Current Structure

The `.header-actions` container currently contains:
1. Call button
2. Theme Toggle
3. `flex-1` spacer div
4. Agent Login button

The spacer approach isn't working effectively because the `.header-actions` container has a fixed gap and already uses `justify-content: flex-end`.

---

## Implementation

### Approach: Use `margin-left: auto` on Agent Login button

Remove the spacer div and apply `margin-left: auto` directly to the Agent Login button, which will push it to the far right within the flex container.

### File: `src/components/layout/Header.tsx`

#### Change: Remove spacer div (lines 330-331)

```tsx
/* Remove this */
{/* Spacer to push Agent Login to the right */}
<div className="flex-1" />
```

### File: `src/index.css`

#### Change: Add margin-left: auto to Agent Login button (lines 11392-11397)

```css
/* Before */
.header-btn-agent {
  background: transparent;
  color: hsl(var(--tm-ink));
  border: 1px solid hsl(var(--tm-ink) / 0.2);
}

/* After */
.header-btn-agent {
  background: transparent;
  color: hsl(var(--tm-ink));
  border: 1px solid hsl(var(--tm-ink) / 0.2);
  margin-left: auto;
}
```

---

## Summary of Changes

| File | Lines | Change |
|------|-------|--------|
| `src/components/layout/Header.tsx` | 330-331 | Remove the `flex-1` spacer div |
| `src/index.css` | 11392-11397 | Add `margin-left: auto` to `.header-btn-agent` |

---

## Expected Result

- The Agent Login button will be pushed to the far right edge of the header
- Clear visual separation between the Call/Theme Toggle buttons and Agent Login
- Clean, elegant positioning without extra markup

