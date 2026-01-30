
# Fix Floating Header Nav Bar Styling and Hover Effects

## Overview
Enhance the floating header navigation bar (`.tru-static-nav-menu`) to have more polished styling and improved hover interactions following the button design overhaul standards.

---

## Current Issues

| Issue | Description |
|-------|-------------|
| No scale on hover | Items don't scale up on hover |
| No glow on hover | Only active items have box-shadow, not hovered ones |
| Weak borders | Icons-only mode has transparent borders |
| Subtle hover background | Background tint is barely noticeable |
| Agent login border conflict | The `border-top` separator conflicts with hover border styling |
| Icons transition missing | SVG icons don't have transform transition |

---

## Changes Required

### File: `src/index.css`

#### 1. Enhance Icons-Only Item Styling (lines ~3522-3529)
Add visible borders and better base styling:

```css
.tru-static-nav-menu.icons-only .tru-static-nav-item {
  width: 36px;
  height: 36px;
  padding: 0;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid hsl(var(--border) / 0.5);
  background: hsl(var(--background) / 0.5);
}
```

#### 2. Improve Base Item Styling (lines ~3531-3546)
Update the base nav item with better border visibility:

```css
.tru-static-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: hsl(var(--tm-ink) / 0.7);
  text-decoration: none;
  border: 1.5px solid hsl(var(--border) / 0.4);
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}
```

#### 3. Enhance Hover State (lines ~3548-3556)
Add scale transform and glow effect on hover:

```css
.tru-static-nav-item:hover {
  background: hsl(var(--primary) / 0.12);
  border-color: hsl(var(--primary) / 0.4);
  color: hsl(var(--tm-ink));
  transform: scale(1.03);
  box-shadow: 0 0 12px hsl(var(--primary) / 0.2);
}

.tru-static-nav-item:hover svg {
  color: hsl(var(--primary));
  transform: scale(1.1);
}
```

#### 4. Update SVG Icon Base Styling (lines ~3569-3575)
Add transform transition:

```css
.tru-static-nav-item svg {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: hsl(var(--tm-ink) / 0.55);
  transition: color 0.2s ease, transform 0.2s ease;
}
```

#### 5. Improve Dark Mode Hover (lines ~3586-3594)
Enhance dark mode hover with stronger effects:

```css
.dark .tru-static-nav-item:hover {
  background: hsl(var(--primary) / 0.18);
  border-color: hsl(var(--primary) / 0.45);
  color: hsl(0 0% 100%);
  transform: scale(1.03);
  box-shadow: 0 0 14px hsl(var(--primary) / 0.25);
}

.dark .tru-static-nav-item:hover svg {
  color: hsl(var(--primary));
  transform: scale(1.1);
}
```

#### 6. Fix Agent Login Border Conflict (lines ~3608-3617)
Use pseudo-element for separator to avoid border conflicts:

```css
.tru-static-nav-item.is-agent-login {
  margin-top: 8px;
  padding-top: 12px;
  position: relative;
}

.tru-static-nav-item.is-agent-login::before {
  content: '';
  position: absolute;
  top: 0;
  left: 4px;
  right: 4px;
  height: 1px;
  background: hsl(var(--border) / 0.4);
}

.dark .tru-static-nav-item.is-agent-login::before {
  background: hsl(0 0% 100% / 0.1);
}
```

---

## Visual Before/After

```
BEFORE                          AFTER
┌────────┐                      ┌────────┐
│   ✨   │ ← Flat, no border    │  [✨]  │ ← Subtle border
│   🛡️   │ ← No hover scale     │  [🛡️]  │ ← Scales on hover
│   💬   │ ← No glow effect     │  [💬]  │ ← Glow + scale
└────────┘                      └────────┘
```

---

## Summary

| Change | Effect |
|--------|--------|
| Visible base borders | Items look more defined and clickable |
| Scale transform on hover | Subtle 1.03x scale adds interactivity |
| Box-shadow glow on hover | Primary color glow follows button design standards |
| Icon scale on hover | Icons grow slightly (1.1x) for emphasis |
| SVG transform transition | Smooth icon scaling animation |
| Agent login separator fix | Pseudo-element prevents border conflicts |
| Stronger dark mode effects | Better visibility in dark theme |

---

## Technical Details

### Files Modified
| File | Lines Changed |
|------|---------------|
| `src/index.css` | ~3522-3620 (floating nav styles section) |

### CSS Properties Added
- `transform: scale(1.03)` on hover for items
- `transform: scale(1.1)` on hover for icons
- `box-shadow: 0 0 12px hsl(var(--primary) / 0.2)` for hover glow
- `border: 1.5px solid hsl(var(--border) / 0.4)` for visible borders
- Pseudo-element `::before` for agent login separator
