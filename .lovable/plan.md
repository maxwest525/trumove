

# Chat Modal & Tracking Page UI Improvements

## Summary
This plan addresses multiple UI/UX improvements across the `/book` video consult page and the `/track` shipment tracking page, focusing on modal accessibility, styling consistency, and layout adjustments.

---

## Changes Overview

### 1. Non-Blocking Chat Modal (Travels Across Pages)
**Current Issue:** The `DraggableChatModal` has a backdrop overlay (`bg-black/30 backdrop-blur-sm`) that greys out the page and blocks interaction. Also, the modal is local to `/book` page.

**Solution:**
- Remove the backdrop overlay entirely so users can still interact with the website
- Move the `DraggableChatModal` state management to `App.tsx` so it persists across page navigation
- Use React Router's location to maintain modal visibility during navigation

### 2. Queue Position Colors to Match Company Theme
**Current Issue:** The `AgentQueueIndicator` uses amber/orange colors (`bg-amber-900/30`, `border-amber-500/30`, `text-amber-400`) which doesn't match the company's primary green theme.

**Solution:**
- Update queue indicator to use primary theme colors (green-based instead of amber)
- Change from amber to primary/muted color scheme for consistency

### 3. Smaller Pop-Out Button
**Current Issue:** The pop-out button in the chat tabs uses `<ExternalLink className="w-4 h-4" />` which is the same size as other tab icons.

**Solution:**
- Reduce the icon size to `w-3 h-3`
- Add `!px-1` class for tighter horizontal padding

### 4. "Connect with live support agent" Button Text
**Current Issue:** Button says "Chat Now" with an icon prefix.

**Solution:**
- Change button text to "Connect with live support agent"
- Keep the button functional and styled the same

### 5. In-Call Chat Always Accessible
**Current Issue:** The In-Call Chat tab is disabled when not on a call (`disabled={!roomUrl}`).

**Solution:**
- Remove the `disabled` attribute from the tab
- Keep the subtle "Not on video call" banner inside the content
- Tab is always clickable

### 6. Expanded Video Modal Size Limits
**Current Issue:** When maximized via the green macOS button, the modal expands to `1200x750` which can cover header controls. The max resize limit is `1400x900`.

**Solution:**
- Reduce the "large" preset from `1200x750` to `900x550`
- Reduce maximum resize dimensions from `1400x900` to `1100x700`
- Add `top: 80px` offset so the modal can't overlap the header

### 7. Shipment Tracking - Lower Map & Stats by 50px
**Current Issue:** User wants the map and stats pushed down by 50px without touching the navbar or header.

**Solution:**
- Increase `padding-top` in `.tracking-content` from `16px` to `66px` (adding 50px)
- Apply same adjustment to responsive breakpoints

---

## Technical Details

### File: `src/components/chat/DraggableChatModal.tsx`
- Remove the backdrop div (lines 163-168):
  ```tsx
  {/* Remove this backdrop */}
  <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" onClick={onClose} />
  ```
- Keep the modal itself, positioned with `fixed z-[70]`

### File: `src/pages/Book.tsx`

**Queue Indicator Colors (lines 377-404):**
```tsx
// Change from amber to primary theme
<div className={cn(
  "bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg px-3 py-2 mb-3 transition-all duration-300",
  isHighlighted && "ring-1 ring-primary"
)}>
  <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
    <Users className="w-3 h-3 text-primary" />
  </div>
  <span className="text-primary font-mono text-sm font-medium">~{formatTime(waitSeconds)}</span>
</div>
```

**Pop-Out Button (lines 1937-1949):**
```tsx
<button 
  className="ml-auto !px-1"
  onClick={() => {
    setPopoutChatMode(chatMode);
    setShowPopoutChat(true);
  }}
>
  <ExternalLink className="w-3 h-3" />  {/* Reduced from w-4 h-4 */}
</button>
```

**In-Call Chat Tab (lines 1919-1926):**
```tsx
<button 
  className={chatMode === 'liveagent' ? 'active' : ''}
  onClick={() => setChatMode('liveagent')}
  // Remove: disabled={!roomUrl}
>
```

**Live Support Button Text (lines 2184-2191):**
```tsx
<Button onClick={() => setHasJoinedQueue(true)} className="...">
  <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
  Connect with live support agent  {/* Changed from "Chat Now" */}
</Button>
```

**Expanded Video Modal Size (lines 2567-2656):**
- Change line 2590 from `{ width: 1200, height: 750 }` to `{ width: 900, height: 550 }`
- Change max resize constraints (lines 1558-1559) from `1400/900` to `1100/700`
- Add `top: 80px` minimum offset in positioning logic

### File: `src/index.css`

**Tracking Content Padding (lines 25807-25817):**
```css
.tracking-content {
  /* ... existing styles ... */
  padding-top: 66px; /* Changed from 16px - added 50px */
}
```

**Apply to all responsive breakpoints** in the same section.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/chat/DraggableChatModal.tsx` | Remove backdrop overlay for non-blocking modal |
| `src/pages/Book.tsx` | Queue colors, pop-out button size, button text, tab disabled state, modal size limits |
| `src/index.css` | Add 50px to tracking page padding-top |

---

## Visual Changes Summary

| Element | Before | After |
|---------|--------|-------|
| Modal backdrop | Greys out page | No backdrop - page fully interactive |
| Queue indicator | Amber/orange theme | Primary green theme |
| Pop-out icon | 16x16px | 12x12px |
| Chat Now button | "Chat Now" | "Connect with live support agent" |
| In-Call tab | Disabled when no call | Always enabled |
| Expanded video max | 1200x750 / 1400x900 | 900x550 / 1100x700 |
| Tracking content top | 16px padding | 66px padding (+50px) |

