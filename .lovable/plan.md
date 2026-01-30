

# Add Gradient Accent and Decorative Elements to AI Inventory Analysis Header

## Overview
Enhance the "AI Inventory Analysis" header with a gradient text effect, decorative accent line, and subtle animated sparkle to create more visual impact.

---

## Current State
- Plain white/foreground text header
- No decorative elements
- Simple centered text styling

## Target State
- Gradient text effect on "AI" portion of the header
- Decorative accent line below header
- Subtle animated sparkle/glow effect
- Small icon badge above the header

---

## Changes

### 1. Update JSX to Add Decorative Elements
**File:** `src/pages/Index.tsx` (line 1534)

Wrap the header with decorative elements:

```tsx
{/* Header Badge */}
<div className="tru-ai-header-badge">
  <Sparkles className="w-4 h-4" />
  <span>Powered by AI</span>
</div>

{/* Gradient Header */}
<h2 className="tru-ai-steps-title">
  <span className="tru-ai-gradient-text">AI</span> Inventory Analysis
</h2>

{/* Accent Line */}
<div className="tru-ai-accent-line" />

<p className="tru-ai-steps-subtitle">...</p>
```

### 2. Add CSS for Header Badge
**File:** `src/index.css`

```css
/* AI Header Badge */
.tru-ai-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: hsl(var(--primary) / 0.1);
  border: 1px solid hsl(var(--primary) / 0.2);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: hsl(var(--primary));
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.tru-ai-header-badge svg {
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.15); }
}
```

### 3. Add CSS for Gradient Text
**File:** `src/index.css`

```css
/* AI Gradient Text */
.tru-ai-gradient-text {
  background: linear-gradient(
    135deg,
    hsl(var(--primary)) 0%,
    hsl(145 80% 42%) 50%,
    hsl(var(--primary)) 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### 4. Add CSS for Accent Line
**File:** `src/index.css`

```css
/* AI Accent Line */
.tru-ai-accent-line {
  width: 80px;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent,
    hsl(var(--primary)),
    transparent
  );
  border-radius: 2px;
  margin: 0 auto 20px;
}
```

### 5. Update Dark Mode Styles
**File:** `src/index.css`

```css
.dark .tru-ai-header-badge {
  background: hsl(var(--primary) / 0.15);
  border-color: hsl(var(--primary) / 0.3);
}

.dark .tru-ai-gradient-text {
  background: linear-gradient(
    135deg,
    hsl(142 70% 55%) 0%,
    hsl(160 75% 50%) 50%,
    hsl(142 70% 55%) 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Visual Layout After Change

```
┌──────────────────────────────────────────────┐
│                                              │
│           ✨ POWERED BY AI                   │  ← Badge with sparkle
│                                              │
│          AI Inventory Analysis               │  ← "AI" has gradient
│           ───────────────                    │  ← Accent line
│                                              │
│  Take a video or pictures of your room...   │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Summary

| Element | Description |
|---------|-------------|
| Header Badge | "Powered by AI" pill with sparkle icon animation |
| Gradient Text | Animated gradient on "AI" word that shifts colors |
| Accent Line | Horizontal gradient line below header |
| Dark Mode | Adjusted gradient colors for visibility |

## Visual Result
- "Powered by AI" badge draws attention with subtle sparkle animation
- "AI" word stands out with animated green gradient
- Decorative accent line provides visual separation
- Professional, polished look that emphasizes AI capabilities

