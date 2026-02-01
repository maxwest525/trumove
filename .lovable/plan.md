

# Plan: Chat Box Input Expansion, Tab Renaming, and Sticky Header

## Overview
Three improvements to the chat experience:
1. Expand the text input field in the chat box (make it taller)
2. Rename "Support" and "Live Chat" to "Live Support"
3. Make the chat header sticky so Trudy's name stays visible when scrolling

---

## Visual Changes

```text
CHAT INPUT (Before → After):
+----------------------------------+
| [Input field h-44px] [Send]      |  →  Height: 44px → 52px
+----------------------------------+     Padding: 16px → 20px

TABS (Before):
[Trudy AI] [Support] [Live Chat]

TABS (After):
[Trudy AI] [Live Support]

CHAT HEADER (Sticky - doesn't scroll away):
+----------------------------------+
| [Bot] Trudy with TruMove         |  ← Always visible at top
|       ● Online                   |
+----------------------------------+
| (messages scroll below header)   |
+----------------------------------+
```

---

## Technical Changes

### File: `src/index.css`

#### 1. Expand Chat Input (Lines 10808-10829)

Update `.chat-input-area` and `.chat-input`:

```css
/* Chat Input Area */
.chat-input-area {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #ffffff;
  border-top: 1px solid hsl(var(--tm-ink) / 0.08);
}

.chat-input {
  flex: 1;
  height: 52px;
  padding: 0 20px;
  font-size: 15px;
  font-weight: 500;
  color: hsl(var(--tm-ink));
  background: hsl(var(--tm-ink) / 0.04);
  border: 1px solid transparent;
  border-radius: 26px;
  outline: none;
  transition: all 200ms ease;
}
```

Changes:
- Input height: 44px → 52px
- Padding around input area: 16px → 20px
- Font size: 14px → 15px
- Border radius: 22px → 26px (stays proportional)
- Gap between input and button: 10px → 12px

#### 2. Make Chat Header Sticky (Lines 10608-10615)

Add sticky positioning to keep header visible:

```css
/* Chat Header */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid hsl(var(--tm-ink) / 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
}
```

---

### File: `src/pages/Book.tsx`

#### 3. Merge "Support" and "Live Chat" into "Live Support" (Lines 1303-1318)

**Before (3 tabs):**
```tsx
<button 
  className={chatMode === 'support' ? 'active' : ''}
  onClick={() => setChatMode('support')}
  title="Contact Support Team"
>
  <Phone className="w-4 h-4" />
  Support
</button>
<button 
  className={chatMode === 'livechat' ? 'active' : ''}
  onClick={() => setChatMode('livechat')}
  title="Live Chat During Video Call"
>
  <MessageSquare className="w-4 h-4" />
  Live Chat
</button>
```

**After (2 tabs - consolidated):**
```tsx
<button 
  className={chatMode === 'support' ? 'active' : ''}
  onClick={() => setChatMode('support')}
  title="Live Support - Call, Chat, or Schedule"
>
  <Headphones className="w-4 h-4" />
  Live Support
</button>
```

This removes the separate "Live Chat" tab and consolidates into "Live Support" which will contain all support options (call, schedule callback, email, and live chat).

#### 4. Consolidate Support Panel Content

The "support" tab panel will be updated to include the live chat functionality alongside the existing call/schedule/email options, creating a unified "Live Support" experience with all contact methods in one place.

---

## Summary

| Change | Before | After |
|--------|--------|-------|
| Chat input height | 44px | 52px |
| Input area padding | 16px | 20px |
| Font size | 14px | 15px |
| Tabs | Trudy AI, Support, Live Chat | Trudy AI, Live Support |
| Chat header | Scrolls away | Sticky at top |

---

## Files Modified

- `src/index.css` - Chat input expansion + sticky header
- `src/pages/Book.tsx` - Tab consolidation (remove "Live Chat" tab, rename "Support" to "Live Support")

