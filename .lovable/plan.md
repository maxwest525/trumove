
# Fix Hero Card Border Visibility

## Problem
The "Your Move. Your Terms" card on the right side of the hero has a visible border outline. Looking at line 25342 in `src/index.css`:

```css
border: 1px solid hsl(var(--tm-ink) / 0.1);
```

This creates a subtle but visible border around the entire card.

## Solution
Remove or hide the border by setting it to `transparent` or `none`.

## Technical Details

### File to Modify
- `src/index.css`

### Change (Line 25342)
```css
/* From: */
border: 1px solid hsl(var(--tm-ink) / 0.1);

/* To: */
border: none;
```

This single line change will remove the visible border around the premium card while keeping all other styling (backdrop blur, shadow, rounded corners) intact.

---

## Alternative Options

If you want to keep a very subtle border for definition, you could use a more transparent value:
- `border: 1px solid hsl(var(--tm-ink) / 0.03);` - Almost invisible
- `border: 1px solid transparent;` - Invisible but maintains spacing
