
# Restyle Black Trust Strip to Match Grey SAFER Bar

## Overview
Modify the black TrustStrip component to have a similar layout and styling as the grey SaferTrustStrip, including:
- Spread items across the bar with consistent spacing
- Icons positioned to the left of each text item
- Thinner bar height (matching the grey strip's 8px padding)
- Use CSS classes for styling consistency

## Changes Required

### 1. Update TrustStrip.tsx Component
Replace inline Tailwind classes with CSS class-based styling to match the SaferTrustStrip pattern:
- Use `.trust-strip`, `.trust-strip-inner`, `.trust-strip-item`, `.trust-strip-dot` classes
- Keep icon to the left of text (already correct)
- Add dot separators between items like the SAFER strip

### 2. Add CSS Styles to index.css
Create new styles that mirror the grey SAFER strip but with the dark theme:

```css
/* BLACK TRUST STRIP - Compliance bar */
.trust-strip {
  background: linear-gradient(to bottom, hsl(220 15% 6%), hsl(220 15% 4%));
  border-bottom: 1px solid hsl(0 0% 100% / 0.1);
  padding: 6px 24px;  /* Thinner than before (was py-[4px] with larger content) */
  overflow-x: auto;
}

.trust-strip-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: nowrap;
  white-space: nowrap;
  min-width: max-content;
  margin: 0 auto;
}

.trust-strip-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(0 0% 100% / 0.85);
}

.trust-strip-item svg {
  width: 14px;
  height: 14px;
}

/* Gold accent icons */
.trust-strip-item.accent-gold svg {
  color: hsl(45 90% 55%);
}

/* Green accent icons */
.trust-strip-item.accent-green svg {
  color: hsl(142 70% 55%);
}

.trust-strip-dot {
  color: hsl(0 0% 100% / 0.3);
  margin: 0 8px;
}
```

### 3. Updated TrustStrip.tsx Structure

```tsx
export default function TrustStrip() {
  return (
    <div className="trust-strip" aria-label="Compliance and authority">
      <div className="trust-strip-inner">
        {TRUST.map((t, idx) => (
          <div key={t.text} className={`trust-strip-item accent-${t.accent}`}>
            <t.icon />
            <span>{t.text}</span>
            {idx < TRUST.length - 1 && (
              <span className="trust-strip-dot">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Technical Details

### Files to Modify
1. `src/components/layout/TrustStrip.tsx` - Update structure to use CSS classes
2. `src/index.css` - Add `.trust-strip-*` styles

### Visual Changes
| Aspect | Before | After |
|--------|--------|-------|
| Padding | py-[4px] (~8px total) | 6px top/bottom (12px total, but compact text) |
| Font size | 10px | 11px (matches grey strip proportions) |
| Icon size | 12px (w-3) | 14px |
| Item gap | gap-8/gap-16 | gap-16px with 8px margin dots |
| Structure | Inline flex spans | CSS class-driven divs |

### Result
The black trust strip will have the same horizontal spread layout as the grey SAFER strip, with icons clearly to the left of each item, thinner overall height, and consistent visual language across both trust bars.
