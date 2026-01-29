

# Plan: TruDy Avatar, Dark Mode Fixes, and UI Improvements

This plan addresses 5 issues:
1. Replace TruDy avatar with green truck icon (remove the girl)
2. Fix recenter button visibility (white on white)
3. Update floating pill text to "TruDy The AI Moving Helper" / "Ask Me Anything"
4. Fix chat white-on-white text in dark mode
5. Lower hero background opacity in dark mode

---

## Summary of Changes

| Issue | Solution | Files |
|-------|----------|-------|
| TruDy avatar is a girl | Generate new avatar with green truck from logo | `src/assets/trudy-avatar.png` |
| Recenter button invisible | Fix button styling to have contrast | `src/index.css` |
| Floating pill text | Update to "TruDy The AI Moving Helper" / "Ask Me Anything" | `src/components/FloatingTruckChat.tsx` |
| Chat text invisible in dark mode | Add dark mode overrides for chat container | `src/index.css` |
| Hero background too bright in dark mode | Increase overlay opacity in dark mode | `src/index.css` |

---

## 1. Generate New TruDy Avatar (Green Truck)

Replace the current girl avatar with a stylized green truck icon that matches the TruMove brand.

**Requirements:**
- Green truck matching the logo color (bright lime green: hsl(120 80% 50%))
- Simple, clean iconographic style
- Works on light and dark backgrounds
- 128x128 PNG with transparency

The new avatar will be a stylized green moving truck icon, similar to the one in the TruMove logo.

---

## 2. Fix Recenter Button Visibility

**File:** `src/index.css`

The `.tracking-header-satellite-btn` uses `color: white` but the background is also relatively light in some contexts. Add explicit text color override:

```css
/* Add to tracking-header-satellite-btn */
.tracking-header-satellite-btn {
  /* existing styles... */
  color: hsl(0 0% 100%) !important;  /* Force white text */
}

/* Add icon color fix */
.tracking-header-satellite-btn svg {
  color: hsl(0 0% 100%) !important;
}
```

---

## 3. Update Floating Pill Text

**File:** `src/components/FloatingTruckChat.tsx`

Change the text labels:
- Line 91: "TruDy" → **"TruDy"** (keep as is)
- Line 92: "Your AI Moving Helper" → **"The AI Moving Helper"**

Or update to a different layout:
```tsx
<div className="flex flex-col items-start">
  <span className="text-sm font-bold leading-tight text-background">TruDy</span>
  <span className="text-xs leading-tight text-background/70">The AI Moving Helper</span>
</div>
```

And below the pill, or as a subtitle:
- Add "Ask Me Anything" as secondary text

Updated structure:
```tsx
{/* Text Label */}
<div className="flex flex-col items-start">
  <span className="text-sm font-bold leading-tight text-background">TruDy</span>
  <span className="text-[10px] leading-tight text-background/70">The AI Moving Helper</span>
  <span className="text-[10px] leading-tight text-primary font-medium">Ask Me Anything</span>
</div>
```

---

## 4. Fix Chat Dark Mode (White on White Text)

**File:** `src/index.css`

The chat uses hardcoded `#ffffff` backgrounds and `hsl(var(--tm-ink))` text. In dark mode, these don't adapt. Add dark mode overrides:

```css
/* Dark mode chat fixes */
.dark .chat-container {
  background: linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%);
  border-color: hsl(var(--border));
}

.dark .chat-header {
  background: hsl(var(--card));
  border-color: hsl(var(--border));
}

.dark .chat-header-name {
  color: hsl(var(--foreground));
}

.dark .chat-header-status {
  color: hsl(var(--muted-foreground));
}

.dark .chat-message.is-bot .chat-bubble {
  background: hsl(var(--muted));
}

.dark .chat-message.is-bot .chat-bubble-text {
  color: hsl(var(--foreground));
}

.dark .chat-message.is-user .chat-bubble-text {
  color: hsl(var(--foreground));
}

.dark .chat-input-area {
  background: hsl(var(--card));
  border-color: hsl(var(--border));
}

.dark .chat-input {
  background: hsl(var(--muted));
  color: hsl(var(--foreground));
}

.dark .chat-input::placeholder {
  color: hsl(var(--muted-foreground));
}

.dark .chat-send-btn {
  background: hsl(var(--muted));
}

.dark .chat-send-icon {
  color: hsl(var(--muted-foreground));
}

.dark .chat-footer {
  background: hsl(var(--muted) / 0.5);
  border-color: hsl(var(--border));
  color: hsl(var(--muted-foreground));
}

.dark .chat-quick-btn {
  background: hsl(var(--muted));
  color: hsl(var(--foreground));
  border-color: hsl(var(--border));
}

.dark .chat-typing-dot {
  background: hsl(var(--muted-foreground));
}
```

---

## 5. Lower Hero Background Opacity in Dark Mode

**File:** `src/index.css`

The hero background overlay needs to be darker in dark mode for better readability:

```css
/* Dark mode hero background - increase overlay darkness */
.dark .tru-hero-bg-overlay {
  background: linear-gradient(
    180deg,
    hsl(var(--background) / 0.55) 0%,
    hsl(var(--background) / 0.75) 25%,
    hsl(var(--background) / 0.92) 50%,
    hsl(var(--background)) 75%
  );
}
```

This increases the overlay opacity from 35%→55% at top and 60%→75% at 25% to darken the image more in dark mode.

---

## Files Changed Summary

| File | Change |
|------|--------|
| `src/assets/trudy-avatar.png` | New green truck avatar (AI generated) |
| `src/components/FloatingTruckChat.tsx` | Update text to "The AI Moving Helper" and "Ask Me Anything" |
| `src/index.css` | Fix recenter button visibility |
| `src/index.css` | Add comprehensive dark mode chat styling |
| `src/index.css` | Increase hero overlay opacity in dark mode |

---

## Testing Checklist

After implementation:
1. Check TruDy avatar in chat - should show green truck, not girl
2. Go to /track in dark mode - verify Recenter button icon is visible
3. Check floating pill - verify text says "TruDy", "The AI Moving Helper", "Ask Me Anything"
4. Switch to dark mode on homepage - open TruDy chat, verify all text is readable
5. Check chat messages in dark mode - bot and user bubbles should have readable text
6. Check homepage hero in dark mode - background should be darker/more muted
7. Test on mobile to ensure all changes work responsively

