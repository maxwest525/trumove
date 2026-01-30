
# Add Visual Separator Between Action Buttons and Agent Login

## Goal

Add a subtle vertical divider between the main header actions (Call, Theme Toggle) and the Agent Login button to create visual separation between the utility actions and the login CTA.

---

## Approach

Since the Agent Login button is absolutely positioned outside the header-inner container, I'll add a `::before` pseudo-element to the `.header-btn-agent` that creates a subtle vertical line to its left. This approach:

- Keeps the separator tied to the Agent Login button
- Automatically hides when the button hides on mobile
- Maintains proper positioning without extra DOM elements

---

## Implementation

### File: `src/index.css`

#### Add pseudo-element divider to Agent Login button (after line 11417)

```css
/* Subtle divider before Agent Login */
.header-btn-agent::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 24px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    hsl(var(--tm-ink) / 0.15) 20%,
    hsl(var(--tm-ink) / 0.15) 80%,
    transparent 100%
  );
}

.dark .header-btn-agent::before {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    hsl(0 0% 100% / 0.12) 20%,
    hsl(0 0% 100% / 0.12) 80%,
    transparent 100%
  );
}
```

---

## Design Details

| Property | Value | Rationale |
|----------|-------|-----------|
| Width | 1px | Subtle, non-intrusive line |
| Height | 24px | Roughly matches button height without spanning full header |
| Position | 16px left of button | Creates breathing room between divider and button |
| Gradient fade | 20%-80% opacity | Soft edges that blend into the header, no harsh endpoints |
| Light mode opacity | 15% | Visible but subtle |
| Dark mode opacity | 12% | Slightly softer for dark backgrounds |

---

## Summary of Changes

| File | Lines | Change |
|------|-------|--------|
| `src/index.css` | After 11417 | Add `::before` pseudo-element with vertical gradient line |
| `src/index.css` | After dark mode rule | Add dark mode variant for divider color |

---

## Expected Result

- A subtle vertical line appears between the main action cluster and Agent Login
- The line has soft faded edges (gradient) that blend into the header
- Automatically hidden on mobile when Agent Login button is hidden
- Consistent appearance in both light and dark modes
