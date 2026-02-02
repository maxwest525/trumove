
# UI Improvements: Shipment Tracking, Chat Modal, and Readability Fixes

## Summary
This plan addresses 8 key UI/UX improvements:
1. Center the map on shipment tracking with stats to the right
2. Remove modal expansion capability when popped out
3. Remove duplicate "Connect with a live support agent" text
4. Fix unreadable neon green text colors
5. Reduce pop-out button size and give chat tabs more room
6. Fix queue box colors (still unreadable)
7. Make fullscreen popout 25% smaller on shipment tracking
8. Apply fixes consistently across light and dark modes

---

## Changes Overview

### 1. Center Map with Stats to the Right (Shipment Tracking)
**Current Issue:** The 2-column grid layout (`minmax(300px, 1fr) 280px`) positions the map on the left and stats on the right, but the map isn't centered on the page.

**Solution:**
- Change the `.tracking-content-2col` grid to use `auto` columns with `justify-content: center`
- Use the fixed 850px map width and let the dashboard sit to its right
- Wrap map and dashboard in a centered flex container

### 2. Disable Modal Expansion When Popped Out
**Current Issue:** The `DraggableChatModal` allows maximize/resize even when already in popout mode, which can be confusing.

**Solution:**
- Add a prop `isPopout={true}` to `DraggableChatModal`
- When `isPopout` is true, hide the maximize button and disable resizing
- Keep only the close button visible

### 3. Remove Duplicate "Connect with live support agent" Text
**Current Issue:** Lines 2180-2181 show "Connect with a live support agent" as a paragraph, then the button below also says the same thing.

**Solution:**
- Remove the `<p>` tag on line 2181 that duplicates the button text
- Keep only the button with the text

### 4. Fix Unreadable Neon Green Text
**Current Issue:** The primary color (`hsl(120 100% 54%)`) is extremely bright neon green and unreadable when used as text, especially on light backgrounds or with light-tinted backgrounds.

**Solution:**
- Create a new CSS variable `--primary-text` with a darker, more readable green
- Light mode: `--primary-text: 142 76% 36%` (forest green, readable)
- Dark mode: `--primary-text: 142 76% 55%` (slightly brighter for dark backgrounds)
- Add a utility class `.text-primary-readable` that uses `--primary-text`
- Update specific problematic areas to use `text-foreground` or the new readable green

### 5. Reduce Pop-Out Button Size & Give Tabs More Room
**Current Issue:** The pop-out button in the video consult chat header is the same size as other icons, making the tab area cramped.

**Solution:**
- Reduce the ExternalLink icon to `w-2.5 h-2.5`
- Reduce the button padding to `!p-0.5`
- Add a small margin between the tabs and the pop-out button

### 6. Fix Queue Box Colors (Still Unreadable)
**Current Issue:** Even after the previous fix, the queue indicator uses `text-primary` which is the bright neon green that's unreadable.

**Solution:**
- Change queue position number from `text-primary` to `text-foreground`
- Change wait time from `text-primary` to `text-emerald-600 dark:text-emerald-400` (readable emerald)
- Change Clock icon from `text-primary` to `text-emerald-600 dark:text-emerald-400`
- Keep the background and border using primary color (subtle backgrounds are fine)

### 7. Make Fullscreen Popout 25% Smaller on Tracking
**Current Issue:** When maximized, the popout takes `window.innerWidth - 40` and `window.innerHeight - 40` which is too large.

**Solution:**
- Calculate 75% of available space instead of near-full screen
- Change from `width: window.innerWidth - 40` to `width: (window.innerWidth - 40) * 0.75`
- Change from `height: window.innerHeight - 40` to `height: (window.innerHeight - 40) * 0.75`
- Center the maximized modal on screen

### 8. Apply Consistent Dark Mode Fixes
**Current Issue:** Some green text is even harder to read in dark mode.

**Solution:**
- Ensure the `--primary-text` variable has appropriate values for both light and dark modes
- Apply `text-emerald-600 dark:text-emerald-400` pattern consistently for status indicators

---

## Technical Details

### File: `src/index.css`

**Add Readable Primary Text Variable (after line 1228):**
```css
/* Light mode */
--primary: 120 100% 54%;
--primary-text: 142 76% 36%; /* Readable forest green for text */
--primary-foreground: 222 47% 11%;

/* Dark mode (after line 1274) */
--primary: 120 100% 54%;
--primary-text: 142 76% 55%; /* Slightly brighter for dark backgrounds */
--primary-foreground: 222 47% 11%;
```

**Center Map Layout - Update `.tracking-content-2col` (lines 25819-25822):**
```css
.tracking-content.tracking-content-2col {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
}
```

### File: `src/components/chat/DraggableChatModal.tsx`

**Add isPopout prop and conditional UI:**
- Add `isPopout?: boolean` prop (default false)
- When `isPopout` is true:
  - Hide the maximize button (lines 193-203)
  - Hide the resize handle (lines 219-234)
  - Set a max size constraint

**Reduce maximized size by 25% (lines 154-156):**
```tsx
const maxWidth = (window.innerWidth - 40) * 0.75;
const maxHeight = (window.innerHeight - 40) * 0.75;
setPosition({ 
  x: (window.innerWidth - maxWidth) / 2, 
  y: (window.innerHeight - maxHeight) / 2 
});
setSize({ width: maxWidth, height: maxHeight });
```

### File: `src/pages/Book.tsx`

**Remove duplicate text (line 2180-2181):**
Remove:
```tsx
<p className="text-muted-foreground text-xs mb-3">
  Connect with a live support agent
</p>
```

**Fix Queue Indicator Colors (lines 377-404):**
Change:
- Line 388-391: `text-primary` → `text-foreground`
- Line 397: `text-primary` → `text-emerald-600 dark:text-emerald-400`
- Line 398: `text-primary` → `text-emerald-600 dark:text-emerald-400`

**Reduce Pop-Out Button (lines 1936-1952):**
```tsx
<button 
  className="ml-auto !p-0.5"
  onClick={() => {
    setPopoutChatMode(chatMode);
    setShowPopoutChat(true);
  }}
  title="Open in movable window"
>
  <ExternalLink className="w-2.5 h-2.5" />
</button>
```

**Add isPopout prop when rendering DraggableChatModal:**
```tsx
<DraggableChatModal
  isOpen={showPopoutChat}
  onClose={() => setShowPopoutChat(false)}
  title="Chat"
  isPopout={true}  // Add this prop
>
```

### File: `src/pages/LiveTracking.tsx`

**Update layout structure for centered map (around lines 673-720):**
The current grid-based layout will be updated to use flexbox for centering while maintaining the fixed map size and sidebar.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Add `--primary-text` variable, update `.tracking-content-2col` for centered layout |
| `src/components/chat/DraggableChatModal.tsx` | Add `isPopout` prop, reduce maximize size by 25%, conditional maximize/resize UI |
| `src/pages/Book.tsx` | Remove duplicate text, fix queue colors, reduce pop-out button, pass `isPopout` prop |
| `src/pages/LiveTracking.tsx` | Update layout structure for centered map with stats on right |

---

## Visual Changes Summary

| Element | Before | After |
|---------|--------|-------|
| Map position | Left-aligned in grid | Centered with stats on right |
| Popout maximize | Full screen minus 40px | 75% of available space |
| Popout when expanded | Can maximize/resize | Maximize/resize disabled |
| Duplicate text | Shows twice | Shows only in button |
| Queue position number | Bright neon green | Regular foreground color |
| Queue wait time | Bright neon green | Readable emerald green |
| Pop-out button | 12x12px (w-3 h-3) | 10x10px (w-2.5 h-2.5) |
| Chat tabs | Cramped | More breathing room |
