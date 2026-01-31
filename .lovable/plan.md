

# Maximize Scanner & Detection Within 450px Section

## Summary

The scanner and detection previews need to fill the available vertical space within the 450px section. Currently they're constrained by:
1. Fixed `aspect-ratio: 16/10` on the scanner
2. Fixed `height: 200px` on the detection list
3. Content not filling the flex container properly

We'll remove these constraints and ensure both columns stretch to fill the available height after the title.

---

## Layout Breakdown

```text
450px total section height
├── 16px top padding
├── ~40px title + accent line
├── ~360px available for three-column grid ← MAXIMIZE THIS
└── 20px bottom padding
```

---

## Implementation

### File: `src/index.css`

**1. Remove aspect-ratio constraint from scanner (Line 2399)**

Change:
```css
.tru-ai-live-scanner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/10;
  border: 1px solid hsl(var(--border));
}
```
To:
```css
.tru-ai-live-scanner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  border: 1px solid hsl(var(--border));
}
```

**2. Remove fixed height from detection list (Line 2458)**

Change:
```css
.tru-ai-live-inventory {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  height: 200px;
}
```
To:
```css
.tru-ai-live-inventory {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
```

**3. Update inner container to fill and flex properly (Lines 2262-2266)**

Change:
```css
.tru-ai-steps-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
}
```
To:
```css
.tru-ai-steps-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: none;
  padding: 0 48px;
}
```

**4. Ensure the center and right columns fill height (Lines 2637-2646)**

Update:
```css
.tru-ai-preview-vertical .tru-ai-live-scanner {
  height: 100%;
  flex: 1;
  min-height: 0;
}

.tru-ai-preview-vertical .tru-ai-live-inventory {
  height: 100%;
  flex: 1;
  min-height: 0;
  max-height: none;
}
```

**5. Add explicit height calculation to the three-column grid (Lines 2268-2272)**

Change:
```css
.tru-ai-two-column {
  flex: 1;
  min-height: 0;
  align-items: stretch;
}
```
To:
```css
.tru-ai-two-column {
  flex: 1;
  min-height: 0;
  align-items: stretch;
  display: grid;
  grid-template-columns: 180px 1fr 300px;
  gap: 32px;
}
```

**6. Make left column vertically centered (Lines 2595-2599)**

Update:
```css
.tru-ai-left-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}
```

**7. Reduce title margin to maximize content space (Line 2580)**

Change:
```css
.tru-ai-steps-title {
  font-size: 24px;
  font-weight: 800;
  color: hsl(var(--foreground));
  margin-bottom: 6px;
  ...
}
```
To:
```css
.tru-ai-steps-title {
  font-size: 22px;
  font-weight: 800;
  color: hsl(var(--foreground));
  margin-bottom: 4px;
  ...
}
```

**8. Reduce accent line margins**

Update accent line to have minimal bottom margin (approximately 8px instead of larger).

---

## Summary Table

| Element | Before | After |
|---------|--------|-------|
| Scanner aspect-ratio | `16/10` (constrained) | Removed (fills height) |
| Detection list height | `200px` fixed | `100%` (fills column) |
| Title font size | 24px | 22px |
| Title margin-bottom | 6px | 4px |
| Left column | Top-aligned | Vertically centered |
| Grid | Flex with auto height | Explicit flex: 1 |

This maximizes the scanner and detection previews to fill all available vertical space within the 450px section.

