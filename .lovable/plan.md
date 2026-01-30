
# Fix: Remove Opaque/Semi-Transparent Box Around Hero "Your Move. Your Terms." Card

## Problem Root Cause Identified

After extensive investigation and taking a browser screenshot, I found the **actual** source of the transparent box:

The `.tru-why-card-premium` class has a gradient background that transitions between `--background` and `--muted`:

```css
background: linear-gradient(135deg, 
  hsl(var(--background)) 0%, 
  hsl(var(--muted)) 50%,
  hsl(var(--background)) 100%
);
```

In light mode:
- `--background` = white
- `--muted` = 210 40% 96.1% (very light grey)

This creates a **visible white/grey gradient box** with `border-radius: 20px` that stands out against the hero background image, creating the "transparent box" artifact you're seeing.

## Solution

Replace the gradient background with a **fully transparent background** and rely on just a subtle border to define the card boundaries. The card content is already readable on its own.

### CSS Changes (src/index.css)

**Line ~25337-25352** - Change `.tru-why-card-premium`:

```css
.tru-why-card-premium {
  position: relative;
  background: transparent;  /* REMOVE gradient, make fully transparent */
  border: 1px solid hsl(var(--tm-ink) / 0.15);  /* Subtle border for definition */
  border-radius: 20px;
  overflow: hidden;
  box-shadow: none;  /* REMOVE shadows that create the box effect */
}
```

Also remove the glow element that adds extra visual weight:

**Line ~25354-25362** - Change `.tru-why-card-premium-glow`:

```css
.tru-why-card-premium-glow {
  display: none;  /* Hide the glow overlay */
}
```

**Dark mode override (~line 26447-26458)** - Ensure dark mode also uses transparent:

```css
.dark .tru-why-card-premium {
  background: transparent;
  border-color: hsl(0 0% 100% / 0.1);
  box-shadow: none;
}
```

---

## Technical Details

### Files to Modify
- `src/index.css` (3 locations)

### Implementation Steps
1. Remove gradient background from `.tru-why-card-premium`, replace with `transparent`
2. Remove box-shadow and inset-shadow that contribute to the box effect  
3. Hide the `.tru-why-card-premium-glow` radial gradient overlay
4. Update dark mode override to also use transparent background
5. Keep a subtle border for visual definition if needed

### Visual Result
The "Your Move. Your Terms." content will appear to float directly over the hero background image, without any visible white/grey box container around it. The text and feature carousel cards inside will still be clearly visible due to their own backgrounds.

### Alternative Approach (if content becomes hard to read)
If removing the background makes text hard to read, we can add a very subtle backdrop blur with minimal opacity:
```css
background: hsl(var(--background) / 0.3);
backdrop-filter: blur(8px);
```
But this was previously causing the artifact, so transparent is safer.
