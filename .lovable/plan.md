

# Position Agent Login at Absolute Far Right of Header

## Problem Analysis

The Agent Login button is currently at the far right of the **header-inner container**, but this container has:
- `max-width: 1480px` - constrains content width
- `margin: 0 auto` - centers the container

On wider screens (e.g., 1920px), this means there's ~200px of empty header space on each side. The Agent Login button sits at the right edge of the centered 1480px zone, not the actual right edge of the header bar.

---

## Current Structure

```text
.header-main.header-floating (full width with margins)
  └── .header-inner (max-width: 1480px, centered)
        ├── Logo
        ├── Navigation
        └── .header-actions
              ├── Call button
              ├── Theme Toggle
              └── Agent Login (margin-left: auto - at right of 1480px container)
```

---

## Solution

Move the Agent Login button outside of `header-inner` and position it absolutely at the far right edge of the header bar.

### New Structure

```text
.header-main.header-floating (full width with margins, position: relative)
  ├── .header-inner (max-width: 1480px, centered)
  │     ├── Logo
  │     ├── Navigation
  │     └── .header-actions
  │           ├── Call button
  │           └── Theme Toggle
  └── Agent Login (position: absolute, right: 24px)
```

---

## Technical Implementation

### File: `src/components/layout/Header.tsx`

#### Change: Move Agent Login outside header-inner (lines 320-341)

Move the Agent Login `<Link>` element to be a direct child of `<header>`, positioned after `header-inner` but before the mobile menu toggle.

### File: `src/index.css`

#### Change 1: Add position relative to header-floating (line 11168)

Add `position: relative` to `.header-main.header-floating` to create a positioning context.

#### Change 2: Update Agent Login button positioning (lines 11407-11412)

Change from `margin-left: auto` to absolute positioning:

```css
.header-btn-agent {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  /* ...existing styles... */
}
```

#### Change 3: Hide Agent Login on mobile (new rule)

Add a responsive rule to hide the absolutely positioned button on smaller screens where it might overlap with the constrained content.

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/components/layout/Header.tsx` | Move Agent Login button outside of `header-inner`, after `.header-actions` container |
| `src/index.css` | Add `position: relative` to `.header-main.header-floating` |
| `src/index.css` | Update `.header-btn-agent` with absolute positioning (`right: 24px`, `top: 50%`, `transform: translateY(-50%)`) |
| `src/index.css` | Add responsive hiding for Agent Login below certain viewport widths |

---

## Expected Result

- Agent Login button will sit at the absolute far right edge of the header bar (24px from right edge)
- Other header content (logo, nav, call button, theme toggle) remains centered within the 1480px constraint
- On narrower screens where overlap would occur, the button hides (mobile menu still shows Agent Login link)
- Clean visual separation between main navigation cluster and the Agent Login utility

