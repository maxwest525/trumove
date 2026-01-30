

# Plan: Fix Chat Modal Dark Mode Styling and "TruDy" Capitalization

## Overview

The user identified issues with the chat modal in dark mode:
1. "TruDy" should be "Trudy" (consistent capitalization)
2. Header and footer are white in dark mode instead of dark
3. Colors aren't aligned with dark mode theming

## Root Cause Analysis

### Issue 1: "TruDy" Capitalization
Multiple files use "TruDy" instead of "Trudy":
- `ChatModal.tsx` line 59: "Ask TruDy" button
- `AIChatContainer.tsx` line 228: "TruDy with TruMove" header
- `AIChatContainer.tsx` lines 225, 270: alt text "TruDy"
- `ChatMessage.tsx` line 15: alt text "TruDy"
- `TypingIndicator.tsx` line 7: alt text "TruDy"
- `pageContextConfig.ts`: Multiple "TruDy" in welcome messages

### Issue 2: Dark Mode Styling Missing
The CSS has hardcoded `#ffffff` backgrounds without dark mode overrides:

**Light mode (current):**
```css
.chat-modal-panel { background: #ffffff; }
.chat-modal-header { background: linear-gradient(180deg, #ffffff, hsl(var(--primary) / 0.03)); }
.chat-modal-footer { /* no explicit background, inherits white */ }
```

**Missing dark mode overrides** - there are no `.dark .chat-modal-*` rules in the CSS.

### Bonus Fix
Found typo in `FloatingTruckChat.tsx` line 92: "AI Chat Assitance" should be "AI Chat Assistance"

---

## File Changes

### 1. `src/components/chat/ChatModal.tsx`
**Line 59:** Change "Ask TruDy" to "Ask Trudy"

### 2. `src/components/chat/AIChatContainer.tsx`
**Line 225:** Change alt="TruDy" to alt="Trudy"
**Line 228:** Change "TruDy with TruMove" to "Trudy with TruMove"
**Line 270:** Change alt="TruDy" to alt="Trudy"

### 3. `src/components/chat/ChatMessage.tsx`
**Line 15:** Change alt="TruDy" to alt="Trudy"

### 4. `src/components/chat/TypingIndicator.tsx`
**Line 7:** Change alt="TruDy" to alt="Trudy"

### 5. `src/components/chat/pageContextConfig.ts`
Update all "TruDy" occurrences to "Trudy" in welcome messages:
- Line 22: "Hi! I'm Trudy, your TruMove moving assistant..."
- Line 82: "...I'm Trudy, here to help!..."
- Line 92: "Hi! I'm Trudy, your TruMove moving assistant..."

### 6. `src/components/FloatingTruckChat.tsx`
**Line 92:** Fix typo "AI Chat Assitance" to "AI Chat Assistance"

### 7. `src/index.css`
Add dark mode overrides for chat modal (after line ~11309):

```css
/* Chat Modal Dark Mode */
.dark .chat-modal-panel {
  background: hsl(var(--card));
}

.dark .chat-modal-header {
  background: linear-gradient(180deg, hsl(var(--card)), hsl(var(--muted) / 0.5));
  border-color: hsl(var(--border));
}

.dark .chat-modal-close {
  color: hsl(var(--muted-foreground));
}

.dark .chat-modal-close:hover {
  background: hsl(var(--foreground) / 0.1);
  color: hsl(var(--foreground));
}

.dark .chat-modal-footer {
  background: hsl(var(--card));
  border-color: hsl(var(--border));
  color: hsl(var(--muted-foreground));
}

.dark .chat-modal-link {
  color: hsl(var(--primary));
}
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `ChatModal.tsx` | "TruDy" → "Trudy" (1 occurrence) |
| `AIChatContainer.tsx` | "TruDy" → "Trudy" (3 occurrences) |
| `ChatMessage.tsx` | "TruDy" → "Trudy" (1 occurrence) |
| `TypingIndicator.tsx` | "TruDy" → "Trudy" (1 occurrence) |
| `pageContextConfig.ts` | "TruDy" → "Trudy" (3 occurrences) |
| `FloatingTruckChat.tsx` | Fix "Assitance" → "Assistance" |
| `index.css` | Add dark mode styles for `.chat-modal-*` components |

---

## Testing Checklist

1. Toggle to dark mode and open the chat modal
2. Verify header has dark background (not white)
3. Verify footer has dark background (not white)
4. Verify all text shows "Trudy" (not "TruDy")
5. Verify floating button shows "AI Chat Assistance" (spelling fixed)
6. Test in both light and dark modes for consistent appearance

