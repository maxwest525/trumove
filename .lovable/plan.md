

# Soften Header Backdrop Edge Fade

## Goal

Make the floating header's edges fade seamlessly into the background without any noticeable lines or hard edges.

---

## Current Implementation

The `.header-main.header-floating` class (lines 11168-11180) currently has:
- `border: 1px solid hsl(var(--tm-ink) / 0.06)` - creates a subtle but visible line
- `box-shadow: 0 4px 24px hsl(var(--tm-ink) / 0.08)` - fairly soft but still defined

The dark mode variant (lines 11188-11193) has:
- `border-color: hsl(0 0% 100% / 0.08)` - also creates visible lines

---

## Solution

1. **Remove the solid border** - Replace with `border: none` or `border-color: transparent`
2. **Use a softer, more diffused box-shadow** - Create multiple layered shadows that gradually fade out
3. **Add a subtle radial gradient pseudo-element** - Create an edge fade mask effect

---

## Implementation

### File: `src/index.css`

#### Change 1: Soften light mode floating header edges (lines 11168-11180)

```css
/* Before */
.header-main.header-floating {
  position: sticky;
  top: 8px;
  margin: 8px 24px 0;
  border-radius: 16px;
  background: linear-gradient(135deg, 
    hsl(0 0% 100% / 0.92), 
    hsl(var(--primary) / 0.02));
  backdrop-filter: blur(16px);
  border: 1px solid hsl(var(--tm-ink) / 0.06);
  box-shadow: 0 4px 24px hsl(var(--tm-ink) / 0.08);
  transition: all 300ms ease;
}

/* After */
.header-main.header-floating {
  position: sticky;
  top: 8px;
  margin: 8px 24px 0;
  border-radius: 16px;
  background: linear-gradient(135deg, 
    hsl(0 0% 100% / 0.88), 
    hsl(var(--primary) / 0.01));
  backdrop-filter: blur(16px);
  border: none;
  box-shadow: 
    0 2px 8px hsl(var(--tm-ink) / 0.03),
    0 8px 24px hsl(var(--tm-ink) / 0.04),
    0 16px 48px hsl(var(--tm-ink) / 0.02);
  transition: all 300ms ease;
}
```

#### Change 2: Soften scrolled state (lines 11182-11185)

```css
/* Before */
.header-main.header-floating.is-scrolled {
  box-shadow: 0 8px 32px hsl(var(--tm-ink) / 0.12);
  background: hsl(0 0% 100% / 0.98);
}

/* After */
.header-main.header-floating.is-scrolled {
  box-shadow: 
    0 4px 12px hsl(var(--tm-ink) / 0.04),
    0 12px 32px hsl(var(--tm-ink) / 0.06),
    0 24px 64px hsl(var(--tm-ink) / 0.03);
  background: hsl(0 0% 100% / 0.95);
}
```

#### Change 3: Soften dark mode floating header edges (lines 11188-11193)

```css
/* Before */
.dark .header-main.header-floating {
  background: linear-gradient(135deg, 
    hsl(var(--background) / 0.92), 
    hsl(var(--primary) / 0.05));
  border-color: hsl(0 0% 100% / 0.08);
}

/* After */
.dark .header-main.header-floating {
  background: linear-gradient(135deg, 
    hsl(var(--background) / 0.85), 
    hsl(var(--primary) / 0.03));
  border: none;
  box-shadow: 
    0 2px 8px hsl(0 0% 0% / 0.1),
    0 8px 24px hsl(0 0% 0% / 0.15),
    0 16px 48px hsl(0 0% 0% / 0.08);
}
```

#### Change 4: Soften dark mode scrolled state (lines 11195-11197)

```css
/* Before */
.dark .header-main.header-floating.is-scrolled {
  background: hsl(var(--background) / 0.98);
}

/* After */
.dark .header-main.header-floating.is-scrolled {
  background: hsl(var(--background) / 0.92);
  box-shadow: 
    0 4px 12px hsl(0 0% 0% / 0.12),
    0 12px 32px hsl(0 0% 0% / 0.18),
    0 24px 64px hsl(0 0% 0% / 0.1);
}
```

---

## Summary of Changes

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | 11168-11180 | Remove border, add multi-layered soft shadows, reduce background opacity |
| `src/index.css` | 11182-11185 | Update scrolled state with softer layered shadows |
| `src/index.css` | 11188-11193 | Remove dark mode border, add soft dark shadows |
| `src/index.css` | 11195-11197 | Add dark mode scrolled state shadows |

---

## Expected Result

- Header edges will fade seamlessly into the background with no visible lines
- Multi-layered shadows create a natural, gradient-like fade effect
- Slightly reduced background opacity enhances the glassmorphism blend
- Both light and dark modes will have smooth, edge-free transitions

