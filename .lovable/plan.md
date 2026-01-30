
# Add Prominent Shadows and Strokes to Hero Cards

## Cards to Enhance

Based on my exploration, here are the main cards on the hero page that need enhanced shadows and strokes:

1. **Feature Cards** (`.tru-value-card-open`) - The 3 feature cards with preview images
2. **Form Card** (`.tru-form-card`) - The main quote/estimation form
3. **Why TruMove Card** (`.tru-why-card-premium`) - The feature carousel card

---

## Design Approach

### Shadow Strategy
Add a layered shadow system with:
- **Grounded ink shadow** - Deep, anchoring shadow for depth
- **Primary glow** - Subtle green tint for brand consistency
- **Outer stroke glow** - Visible border definition

### Stroke Strategy
Add visible 2px borders using either:
- Solid dark border (`--tm-ink`) for contrast
- Semi-transparent primary border for subtle definition

---

## Implementation

### File: `src/index.css`

**Change 1: Feature Cards (Lines 1851-1865)**
```css
.tru-hero-value-cards-open .tru-value-card-open {
  display: flex;
  flex-direction: column;
  height: 260px;
  padding: 14px;
  padding-bottom: 14px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid hsl(var(--tm-ink) / 0.15);
  box-shadow: 
    0 4px 12px hsl(var(--tm-ink) / 0.12),
    0 8px 32px hsl(var(--tm-ink) / 0.10),
    0 16px 48px hsl(var(--primary) / 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Change 2: Feature Cards Hover (Lines 1891-1900)**
```css
.tru-hero-value-cards-open .tru-value-card-open:hover {
  transform: translateY(-4px) scale(1.02);
  border-color: hsl(var(--primary) / 0.5);
  box-shadow: 
    0 12px 32px hsl(var(--primary) / 0.2),
    0 24px 64px hsl(var(--tm-ink) / 0.15),
    0 0 0 2px hsl(var(--primary) / 0.25);
  z-index: 10;
}
```

**Change 3: Form Card (Lines 7299-7314)**
```css
.tru-form-card {
  position: relative;
  z-index: 20;
  width: 100%;
  max-width: 600px;
  min-height: 480px;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid hsl(var(--tm-ink) / 0.12);
  box-shadow:
    0 4px 12px hsl(var(--tm-ink) / 0.08),
    0 16px 48px hsl(var(--tm-ink) / 0.16),
    0 32px 80px hsl(var(--tm-ink) / 0.12),
    0 0 0 1px hsl(var(--primary) / 0.08);
  padding: 36px 36px;
  overflow: hidden;
}
```

**Change 4: Why TruMove Card (Lines 26379-26391)**
```css
.tru-why-card-premium {
  position: relative;
  background: hsl(var(--background) / 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 2px solid hsl(var(--tm-ink) / 0.12);
  border-radius: 20px;
  overflow: visible;
  box-shadow: 
    0 4px 12px hsl(var(--tm-ink) / 0.08),
    0 12px 40px hsl(var(--tm-ink) / 0.14),
    0 24px 64px hsl(var(--primary) / 0.12);
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
```

**Change 5: Why TruMove Card Hover (Lines 26395-26401)**
```css
.tru-why-card-premium:hover {
  transform: translateY(-4px);
  border-color: hsl(var(--primary) / 0.35);
  box-shadow: 
    0 8px 24px hsl(var(--primary) / 0.18),
    0 20px 56px hsl(var(--tm-ink) / 0.18),
    0 32px 80px hsl(var(--primary) / 0.12);
}
```

---

## Technical Summary

| Card | Border Change | Shadow Enhancement |
|------|---------------|-------------------|
| Feature Cards | `1px solid hsl(--border)` → `2px solid hsl(--tm-ink / 0.15)` | Add deeper 3-layer shadow with primary glow |
| Form Card | `1px solid hsl(--tm-ink / 0.08)` → `2px solid hsl(--tm-ink / 0.12)` | Add 4-layer shadow with extra depth |
| Why TruMove | `1px solid transparent` → `2px solid hsl(--tm-ink / 0.12)` | Add 3-layer shadow with primary glow |

---

## Expected Result

- All hero cards have visible 2px borders creating clear definition
- Deep, layered shadows give cards prominent "floating" appearance
- Subtle primary (green) glow in shadows maintains brand consistency
- Hover states enhance both border and shadow intensity
- Cards feel more substantial and premium
