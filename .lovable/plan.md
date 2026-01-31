

# Plan: Video Consult UI Improvements

## Overview
Make several UI adjustments to the Video Consult page (/book) to improve visual consistency and readability:
1. Match video window and chat panel heights
2. Fix button visibility in chat panel
3. Update chat tab header styling
4. Add "Virtual Video Controls" header to booking controls
5. Improve font readability in booking controls
6. Update trust strip font styling to match `.safer-trust-item`

---

## Changes

### 1. Match Video Window Height to Chat Panel

**Problem**: The video window uses `aspect-video` which creates a 16:9 ratio, while the chat panel has a complex calculated height that doesn't always match.

**Solution**: Remove the aspect ratio constraint from the video window and give it a fixed height that matches the chat panel height (using the same values: min-height: 400px, max-height: 560px).

**File: `src/pages/Book.tsx`** (line 1070)
```tsx
// BEFORE:
<div className="relative aspect-video min-h-[400px] bg-gradient-to-br...">

// AFTER:
<div className="relative min-h-[400px] h-[560px] bg-gradient-to-br...">
```

**File: `src/index.css`** - Update chat panel to use same fixed height:
```css
.video-consult-chat-panel {
  height: 560px;
  min-height: 400px;
  max-height: 560px;
}
```

---

### 2. Fix Button Visibility in Chat Panel

**Problem**: The "Call Now" and "Schedule Callback" buttons in the specialist panel may have visibility issues.

**File: `src/pages/Book.tsx`** (lines 1161-1176) - Improve button contrast:
```tsx
// BEFORE:
<Button 
  variant="outline" 
  className="w-full border-primary/50 text-primary hover:bg-primary/10"
  ...
>

// AFTER:
<Button 
  variant="outline" 
  className="w-full border-primary text-primary hover:bg-primary hover:text-background font-bold"
  ...
>

// And for Schedule Callback:
<Button 
  variant="outline" 
  className="w-full border-white/50 text-white hover:bg-white/20 font-bold"
  ...
>
```

---

### 3. Update Chat Tab Header Styling

**Problem**: The "Talk to Trudy" and "Connect to Specialist" tabs need a more prominent header style.

**File: `src/index.css`** - Update `.video-consult-chat-tabs button` styling:
```css
.video-consult-chat-tabs button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 16px;
  font-size: 13px;           /* was 12px */
  font-weight: 700;          /* was 600 */
  text-transform: uppercase;
  letter-spacing: 0.06em;    /* was 0.05em */
  color: hsl(0 0% 100% / 0.6);  /* slightly brighter */
  background: hsl(220 15% 12%);  /* subtle background */
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.video-consult-chat-tabs button.active {
  color: hsl(var(--primary));
  background: hsl(var(--primary) / 0.15);
  border-bottom: 3px solid hsl(var(--primary));  /* was 2px */
}
```

---

### 4. Add "Virtual Video Controls" Header to Booking Controls

**File: `src/pages/Book.tsx`** (lines 1184-1186) - Add header title:
```tsx
// BEFORE:
<div className="video-consult-booking-controls">
  <div className="video-consult-booking-inner">

// AFTER:
<div className="video-consult-booking-controls">
  <h3 className="video-consult-booking-header">Virtual Video Controls</h3>
  <div className="video-consult-booking-inner">
```

**File: `src/index.css`** - Add header styling:
```css
.video-consult-booking-header {
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: hsl(0 0% 100%);
  margin-bottom: 8px;
}
```

---

### 5. Improve Font Readability in Booking Controls

**File: `src/index.css`** - Update input and button font sizes:
```css
.video-consult-booking-input {
  font-size: 15px;    /* was 14px */
  font-weight: 500;   /* add font weight */
}

.video-consult-booking-input::placeholder {
  color: hsl(0 0% 100% / 0.7) !important;  /* was 0.65 */
  font-weight: 500;
}

/* Increase button font size */
.video-consult-booking-join-btn,
.video-consult-booking-share-btn,
.video-consult-booking-demo-btn {
  font-size: 14px;
}

/* Hint text below controls */
/* Update line 1238 in Book.tsx */
<p className="text-sm text-white mt-3">  /* was text-xs text-white/85 */
```

---

### 6. Update Trust Strip Font to Match `.safer-trust-item`

**Problem**: The video consult header trust items have `11px` font size while `.safer-trust-item` uses `12px`.

**File: `src/index.css`** (lines 29892-29902) - Update to match:
```css
.video-consult-header-trust-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;             /* was 8px */
  font-size: 12px;      /* was 11px - matching .safer-trust-item */
  font-weight: 700;     /* keep at 700 */
  text-transform: uppercase;
  letter-spacing: 0.05em;  /* was 0.06em - matching .safer-trust-item */
  color: hsl(0 0% 100% / 0.85);
  white-space: nowrap;
}
```

---

## Summary of Changes

| Component | Change |
|-----------|--------|
| Video window | Remove `aspect-video`, use fixed `h-[560px]` to match chat panel |
| Chat panel | Set fixed height `560px` for consistency |
| Chat tabs | Increase font to `13px`, weight to `700`, add background |
| Specialist buttons | Improve border contrast, add `font-bold`, better hover states |
| Booking controls | Add "Virtual Video Controls" header |
| Booking input/buttons | Increase font to `15px` input, `14px` buttons |
| Trust strip | Update to `12px`, `700` weight, `0.05em` spacing |

---

## Files to Modify

- `src/pages/Book.tsx` - Video height, button styling, header title, font size
- `src/index.css` - Chat panel, tabs, booking controls, trust strip styling

