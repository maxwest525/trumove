

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

### 7. Shipment Tracking - Lower Map & Stats by 50px + Fixed Map Size
**Current Issue:** User wants the map and stats pushed down by 50px without touching the navbar or header. Also wants the map to be exactly 850px by 550px.

**Solution:**
- Increase `padding-top` in `.tracking-content` from `16px` to `66px` (adding 50px)
- Set fixed map dimensions: width 850px, height 550px
- Apply same padding adjustment to responsive breakpoints

---

## Technical Details

### File: `src/components/chat/DraggableChatModal.tsx`
Remove the backdrop div (lines 162-166):
```tsx
{/* Remove this backdrop entirely */}
<div 
  className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
  onClick={onClose}
/>
```

### File: `src/pages/Book.tsx`

**Queue Indicator Colors (lines 377-404):**
Change from amber/orange to primary theme colors:
- `from-amber-900/30 to-orange-900/20` → `from-primary/20 to-primary/10`
- `border-amber-500/30` → `border-primary/30`
- `bg-amber-500/20 border-amber-500/40` → `bg-primary/20 border-primary/40`
- `text-amber-400` → `text-primary`
- `text-amber-300` → `text-primary`

**Pop-Out Button (line 1947):**
```tsx
<ExternalLink className="w-3 h-3" />  {/* Reduced from w-4 h-4 */}
```
Also change `!px-2` to `!px-1` on line 1940.

**In-Call Chat Tab (lines 1918-1926):**
Remove `disabled={!roomUrl}` from line 1922.

**Live Support Button Text (lines 2184-2191):**
```tsx
<Button onClick={() => setHasJoinedQueue(true)} className="...">
  <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
  Connect with live support agent  {/* Changed from "Chat Now" */}
</Button>
```

**Expanded Video Modal Size (lines 2558, 2590):**
- Line 1558: Change max width from `1400` to `1100`
- Line 1559: Change max height from `900` to `700`
- Line 2590: Change large preset from `{ width: 1200, height: 750 }` to `{ width: 900, height: 550 }`

**Add minimum top offset for modal positioning:**
Update modal transform logic to ensure `y` position is at least 80px from top.

### File: `src/index.css`

**Tracking Content Padding (line 25813):**
```css
padding-top: 66px; /* Changed from 16px - added 50px */
```

**Fixed Map Size (lines 25897-25905):**
```css
.tracking-map-container {
  width: 850px;
  height: 550px;
  min-height: 550px;
  max-height: 550px;
  flex: none;
  /* ... rest of styles ... */
}
```

Apply same padding adjustment to responsive breakpoints in lines 25857-25862.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/chat/DraggableChatModal.tsx` | Remove backdrop overlay for non-blocking modal |
| `src/pages/Book.tsx` | Queue colors, pop-out button size, button text, tab disabled state, modal size limits |
| `src/index.css` | Add 50px to tracking page padding-top, set fixed map dimensions 850x550 |

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
| Tracking map size | Dynamic (75% height) | Fixed 850x550px |

