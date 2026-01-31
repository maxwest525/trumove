

# Plan: Video Consult Page UI Enhancements

## Overview
Implement multiple UI improvements to the Video Consult page (/book):
1. Add fullscreen/enlarge button for video, chat, and controls
2. Move the "YOU" self-view box closer to bottom-right corner
3. Make chat tab headers more professional
4. Add entrance animation to booking controls card
5. Improve booking input field visibility
6. Make "Virtual Video Controls" header more pronounced
7. Fix Call Now and Schedule Callback buttons
8. Improve color readability in virtual video controls
9. Tighten backdrop around video controls (reduce blank space)

---

## Changes

### 1. Add Fullscreen/Enlarge Button

Add an expand button to the video window that toggles fullscreen mode for an immersive experience.

**File: `src/pages/Book.tsx`**

Add state and handler:
```tsx
const [isFullscreen, setIsFullscreen] = useState(false);

const toggleFullscreen = () => {
  const container = document.getElementById('video-consult-container');
  if (!isFullscreen && container) {
    container.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
  setIsFullscreen(!isFullscreen);
};

// Listen for fullscreen changes
useEffect(() => {
  const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
  document.addEventListener('fullscreenchange', handleChange);
  return () => document.removeEventListener('fullscreenchange', handleChange);
}, []);
```

Add button to video card (top-right corner):
```tsx
<Card id="video-consult-container" className="overflow-hidden...">
  <CardContent className="p-0">
    <div className="relative...">
      {/* Fullscreen toggle button - top right */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors border border-white/20"
        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
      </button>
```

Add `Maximize2, Minimize2` to lucide-react imports.

---

### 2. Move "YOU" Self-View Box Closer to Bottom-Right

**File: `src/pages/Book.tsx`** (line 809)

```tsx
// BEFORE:
<div className="absolute bottom-20 right-4 w-36 h-28 rounded-xl...">

// AFTER:
<div className="absolute bottom-4 right-4 w-36 h-28 rounded-xl...">
```

This moves the box from `bottom-20` (80px) to `bottom-4` (16px), placing it much closer to the corner. The control bar is 64px (`h-16`), so `bottom-4` will position it just above the controls.

---

### 3. Professional Chat Tab Headers

Update the tab labels to be more concise and professional.

**File: `src/pages/Book.tsx`** (lines 1151-1164)

```tsx
// BEFORE:
<button ...>
  <Bot className="w-4 h-4" />
  Talk to Trudy
</button>
<button ...>
  <Headphones className="w-4 h-4" />
  Connect to Specialist
</button>

// AFTER:
<button ...>
  <Bot className="w-4 h-4" />
  AI Assistant
</button>
<button ...>
  <Headphones className="w-4 h-4" />
  Live Support
</button>
```

**File: `src/index.css`** - Update tab styling for more professional look:

```css
.video-consult-chat-tabs button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: hsl(0 0% 100% / 0.55);
  background: hsl(220 15% 10%);
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.video-consult-chat-tabs button.active {
  color: hsl(0 0% 100%);
  background: hsl(220 15% 14%);
  border-bottom: 2px solid hsl(var(--primary));
}
```

---

### 4. Add Entrance Animation to Booking Controls

**File: `src/pages/Book.tsx`** (line 1205)

```tsx
// BEFORE:
<div className="video-consult-booking-controls">

// AFTER:
<div className="video-consult-booking-controls animate-fade-in">
```

---

### 5. Make Booking Input Field Easier to See

**File: `src/index.css`** - Enhanced input styling:

```css
.video-consult-booking-input {
  flex: 1;
  height: 48px;
  background: hsl(220 15% 18%) !important;
  border: 2px solid hsl(0 0% 100% / 0.4) !important;
  border-radius: 10px !important;
  color: white !important;
  font-size: 16px;
  font-weight: 600;
  padding-left: 16px !important;
}

.video-consult-booking-input::placeholder {
  color: hsl(0 0% 100% / 0.5) !important;
  font-weight: 500;
}

.video-consult-booking-input:focus {
  border-color: hsl(var(--primary)) !important;
  box-shadow: 0 0 0 3px hsl(var(--primary) / 0.25) !important;
  background: hsl(220 15% 14%) !important;
}
```

---

### 6. Make Virtual Video Controls Header More Pronounced

**File: `src/index.css`** (line 30011):

```css
/* BEFORE: */
.video-consult-booking-header {
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: hsl(0 0% 100%);
  margin-bottom: 8px;
}

/* AFTER: */
.video-consult-booking-header {
  font-size: 16px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: hsl(0 0% 100%);
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid hsl(0 0% 100% / 0.15);
  width: 100%;
  text-align: center;
}
```

---

### 7. Fix Call Now and Schedule Callback Buttons

**File: `src/pages/Book.tsx`** (lines 1181-1196):

```tsx
// BEFORE:
<Button 
  variant="outline" 
  className="w-full border-primary text-primary hover:bg-primary hover:text-background font-bold"
  onClick={() => window.location.href = "tel:+18001234567"}
>
  <Phone className="w-4 h-4 mr-2" />
  Call Now
</Button>
<Button 
  variant="outline" 
  className="w-full border-white/50 text-white hover:bg-white/20 font-bold"
  onClick={() => navigate('/book')}
>
  <Calendar className="w-4 h-4 mr-2" />
  Schedule Callback
</Button>

// AFTER:
<Button 
  className="w-full bg-primary hover:bg-primary/90 text-background font-bold h-12 text-base"
  onClick={() => window.location.href = "tel:+18001234567"}
>
  <Phone className="w-5 h-5 mr-2" />
  Call Now
</Button>
<Button 
  variant="outline" 
  className="w-full border-2 border-white/60 text-white hover:bg-white/15 hover:border-white font-bold h-12 text-base"
  onClick={() => navigate('/book')}
>
  <Calendar className="w-5 h-5 mr-2" />
  Schedule Callback
</Button>
```

---

### 8. Improve Color Readability in Virtual Video Controls

**File: `src/index.css`** - Update button colors:

```css
/* Join Room Button - Solid primary for visibility */
.video-consult-booking-join-btn {
  height: 48px;
  padding: 0 28px;
  font-weight: 700;
  font-size: 15px;
  background: hsl(var(--primary)) !important;
  border: 2px solid hsl(var(--primary)) !important;
  color: hsl(0 0% 0%) !important;
  border-radius: 10px !important;
}

.video-consult-booking-join-btn:hover {
  background: hsl(var(--primary) / 0.85) !important;
  transform: translateY(-1px);
}

.video-consult-booking-join-btn:disabled {
  background: hsl(0 0% 100% / 0.1) !important;
  border-color: hsl(0 0% 100% / 0.2) !important;
  color: hsl(0 0% 100% / 0.4) !important;
}

/* Screen Share Button - Higher contrast */
.video-consult-booking-share-btn {
  height: 48px;
  padding: 0 22px;
  font-size: 14px;
  font-weight: 600;
  background: hsl(220 15% 18%) !important;
  border: 2px solid hsl(0 0% 100% / 0.35) !important;
  color: hsl(0 0% 100%) !important;
  border-radius: 10px 0 0 10px !important;
}

.video-consult-booking-share-btn:hover {
  background: hsl(var(--primary) / 0.2) !important;
  border-color: hsl(var(--primary)) !important;
  color: hsl(var(--primary)) !important;
}

/* Demo Button - Higher contrast */
.video-consult-booking-demo-btn {
  height: 48px;
  padding: 0 22px;
  font-size: 14px;
  font-weight: 600;
  background: hsl(220 15% 18%) !important;
  border: 2px solid hsl(0 0% 100% / 0.35) !important;
  color: hsl(0 0% 100%) !important;
  border-radius: 10px !important;
}

.video-consult-booking-demo-btn:hover {
  background: hsl(0 0% 100% / 0.15) !important;
  border-color: hsl(0 0% 100% / 0.5) !important;
}

/* Audio toggle button */
.video-consult-booking-audio-btn {
  height: 48px !important;
  width: 48px !important;
  background: hsl(220 15% 18%) !important;
  border: 2px solid hsl(0 0% 100% / 0.35) !important;
  border-left: none !important;
  border-radius: 0 10px 10px 0 !important;
  color: hsl(0 0% 100%) !important;
}
```

---

### 9. Tighten Backdrop Around Video Controls

**File: `src/index.css`** - Reduce padding:

```css
/* BEFORE: */
.video-consult-booking-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
  background: linear-gradient(to bottom, hsl(220 15% 22%), hsl(220 15% 20%));
  border-radius: 12px;
  border: 1px solid hsl(0 0% 100% / 0.25);
}

/* AFTER: */
.video-consult-booking-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 24px 18px;
  background: linear-gradient(to bottom, hsl(220 15% 18%), hsl(220 15% 15%));
  border-radius: 12px;
  border: 1px solid hsl(0 0% 100% / 0.2);
  max-width: 680px;
  margin: 0 auto;
}

.video-consult-booking-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
```

Also update the hint text styling:
```tsx
// BEFORE (line 1259):
<p className="text-sm text-white mt-3">

// AFTER:
<p className="text-xs text-white/70 mt-2">
```

---

## Summary of Changes

| Component | Change |
|-----------|--------|
| Fullscreen button | Add expand/collapse button to video window top-right |
| Self-view "YOU" box | Move from `bottom-20` to `bottom-4` |
| Chat tabs | Change to "AI Assistant" / "Live Support", refine styling |
| Booking controls | Add `animate-fade-in` entrance |
| Input field | Increase height to 48px, thicker border, larger font |
| Header | Increase to 16px/900 weight, add border-bottom |
| Call/Schedule buttons | Make Call Now solid primary, Schedule with thicker border |
| Button colors | Higher contrast with solid backgrounds and 2px borders |
| Controls backdrop | Reduce padding, tighten max-width to 680px |

---

## Files to Modify

- `src/pages/Book.tsx` - Add fullscreen state/handler, move self-view, update tabs, buttons, add animation class
- `src/index.css` - Update all booking control styles, chat tab styles

