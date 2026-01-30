

# Navigation Bar Styling Updates

## Current State

The header navigation currently has:
- Nav link text color: `hsl(var(--tm-ink) / 0.7)` (gray/muted)
- Gap between nav items: `12px`
- Call button and Theme Toggle in `.header-actions` with `margin-left: 32px` and `padding-right: 140px`
- Agent Login button absolutely positioned at `right: 24px`

## Changes to Make

### 1. Make Navigation Text Black
Change the `.header-nav-link` color from the muted gray (`hsl(var(--tm-ink) / 0.7)`) to solid black (`hsl(var(--tm-ink))`).

### 2. Increase Spacing Between Navigation Links
Increase the gap in `.header-nav` from `12px` to `20px` for better separation.

Also adjust the divider positioning to account for the wider gap.

### 3. Move Call & Theme Toggle Closer to Agent Login
Reduce the `padding-right` in `.header-actions` from `140px` to something smaller like `80px` to bring Call and Theme Toggle closer to the Agent Login button.

---

## Implementation Details

### File: `src/index.css`

**Change 1: Lines 11301-11306 - Increase nav gap**
```css
.header-nav {
  display: flex;
  align-items: center;
  gap: 20px;  /* Was 12px */
  margin-left: auto;
}
```

**Change 2: Lines 11317 - Adjust divider position**
```css
.header-nav-item:not(:last-child)::after {
  right: -10px;  /* Was -6px, adjust for wider gap */
}
```

**Change 3: Lines 11330-11342 - Make nav link text black**
```css
.header-nav-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: hsl(var(--tm-ink));  /* Was hsl(var(--tm-ink) / 0.7) */
  text-decoration: none;
  border-radius: 20px;
  transition: all 200ms ease;
}
```

**Change 4: Lines 11397-11404 - Reduce padding-right in header-actions**
```css
.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-left: 32px;
  padding-right: 80px;  /* Was 140px - closer to Agent Login */
}
```

---

## Technical Summary

| Element | Before | After |
|---------|--------|-------|
| Nav link text | `hsl(var(--tm-ink) / 0.7)` (muted) | `hsl(var(--tm-ink))` (black) |
| Nav gap | `12px` | `20px` |
| Divider position | `right: -6px` | `right: -10px` |
| Actions padding-right | `140px` | `80px` |

---

## Expected Result

- Navigation links appear in solid black text for better readability
- Navigation items have more visual breathing room (20px gaps)
- Call button and Light/Dark toggle are positioned closer to the Agent Login button on the right side
- Overall header feels more balanced and legible

