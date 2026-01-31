

# Plan: Video Consult Page Layout Overhaul

## Overview
This plan restructures the Video Consult (/book) page with the following changes:
1. Brighten booking controls (even lighter background, more visible borders/text)
2. Add chat panel to the right of the video window with Trudy AI + Specialist options
3. Change Join button to "Join Room" with updated non-green style
4. Add Screen Share button to booking controls
5. Use a better image/video for the demo placeholder

---

## Changes

### 1. Brighten Booking Controls Even More

**File: `src/index.css`**

Update the booking controls with significantly brighter colors:

| Property | Current | New (Brighter) |
|----------|---------|----------------|
| `.video-consult-booking-controls` background | `hsl(220 15% 14%)` to `hsl(220 15% 12%)` | `hsl(220 15% 22%)` to `hsl(220 15% 20%)` |
| `.video-consult-booking-controls` border | `hsl(0 0% 100% / 0.15)` | `hsl(0 0% 100% / 0.25)` |
| `.video-consult-booking-input` background | `hsl(220 15% 18%)` | `hsl(220 15% 28%)` |
| `.video-consult-booking-input` border | `hsl(0 0% 100% / 0.25)` | `hsl(0 0% 100% / 0.35)` |
| Placeholder text | `hsl(0 0% 100% / 0.5)` | `hsl(0 0% 100% / 0.65)` |
| Helper text | `text-white/70` | `text-white/85` |

---

### 2. Add Chat Panel to the Right of Video

**File: `src/pages/Book.tsx`**

Restructure the layout from single video column to a two-column grid:

```
BEFORE:
┌─────────────────────────────────┐
│          Video Window           │
└─────────────────────────────────┘
      [Booking Controls]

AFTER:
┌─────────────────────────┬───────────────┐
│     Video Window        │  Chat Panel   │
│       (larger)          │ (Trudy/Agent) │
└─────────────────────────┴───────────────┘
         [Booking Controls]
```

New layout structure:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6">
  {/* Video Window */}
  <Card className="...">
    {/* existing video content */}
  </Card>
  
  {/* Chat Panel */}
  <Card className="video-consult-chat-panel">
    {/* Tab selector: Talk to Trudy | Connect to Specialist */}
    <div className="video-consult-chat-tabs">
      <button className={activeTab === 'trudy' && 'active'}>
        <Bot /> Talk to Trudy
      </button>
      <button className={activeTab === 'specialist' && 'active'}>
        <Headphones /> Connect to Specialist
      </button>
    </div>
    
    {/* Chat content based on tab */}
    {activeTab === 'trudy' ? (
      <AIChatContainer pageContext={pageContext} />
    ) : (
      <SpecialistPanel /> // Quick call or schedule options
    )}
  </Card>
</div>
```

New state:
```tsx
const [chatMode, setChatMode] = useState<'trudy' | 'specialist'>('trudy');
```

New imports:
```tsx
import AIChatContainer from "@/components/chat/AIChatContainer";
import { getPageContext } from "@/components/chat/pageContextConfig";
import { Bot, Headphones } from "lucide-react";
```

---

### 3. Update Join Button Style

**File: `src/pages/Book.tsx`**

Change from:
```tsx
<Button 
  onClick={handleJoinRoom} 
  disabled={!bookingCode.trim()}
  className="video-consult-booking-btn"
>
  Join
</Button>
```

To:
```tsx
<Button 
  onClick={handleJoinRoom} 
  disabled={!bookingCode.trim()}
  variant="outline"
  className="video-consult-booking-join-btn"
>
  <Video className="w-4 h-4 mr-2" />
  Join Room
</Button>
```

**File: `src/index.css`**

Add new outline-style join button (not all-green):
```css
.video-consult-booking-join-btn {
  height: 44px;
  padding: 0 24px;
  font-weight: 700;
  background: transparent !important;
  border: 2px solid hsl(var(--primary)) !important;
  color: hsl(var(--primary)) !important;
}

.video-consult-booking-join-btn:hover {
  background: hsl(var(--primary) / 0.15) !important;
}

.video-consult-booking-join-btn:disabled {
  border-color: hsl(0 0% 100% / 0.2) !important;
  color: hsl(0 0% 100% / 0.4) !important;
}
```

---

### 4. Add Screen Share Button to Booking Controls

**File: `src/pages/Book.tsx`**

Update the booking controls inner div to include a screen share button:

```tsx
<div className="video-consult-booking-inner">
  <Input ... />
  
  <Button variant="outline" className="video-consult-booking-join-btn" ...>
    <Video className="w-4 h-4 mr-2" />
    Join Room
  </Button>
  
  <Button variant="outline" className="video-consult-booking-share-btn">
    <Monitor className="w-4 h-4 mr-2" />
    Screen Share
  </Button>
  
  <Button variant="outline" className="video-consult-booking-demo-btn" ...>
    <Sparkles className="w-4 h-4 mr-2" />
    Demo
  </Button>
</div>
```

**File: `src/index.css`**

```css
.video-consult-booking-share-btn {
  height: 44px;
  padding: 0 20px;
  background: transparent !important;
  border: 1px solid hsl(0 0% 100% / 0.3) !important;
  color: hsl(0 0% 100% / 0.85) !important;
}

.video-consult-booking-share-btn:hover {
  background: hsl(var(--primary) / 0.15) !important;
  border-color: hsl(var(--primary) / 0.5) !important;
  color: hsl(var(--primary)) !important;
}
```

---

### 5. Use Better Demo Placeholder Image/Video

**File: `src/pages/Book.tsx`**

Update `FakeAgentView` to use a more polished look. The existing `trudy-video-call.jpg` can be enhanced with:

Option A - Add subtle animation to make it feel more like a live video:
```tsx
function FakeAgentView() {
  return (
    <div className="absolute inset-0">
      <img 
        src={trudyVideoCall}
        alt="Trudy Martinez" 
        className="w-full h-full object-cover animate-subtle-zoom"
      />
      {/* Add subtle breathing/zoom animation */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/30" />
      
      {/* Add "LIVE" indicator */}
      <div className="absolute top-4 left-4 px-2 py-1 rounded bg-red-600 text-white text-xs font-bold flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        LIVE
      </div>
    </div>
  );
}
```

**File: `src/index.css`**

```css
@keyframes subtle-zoom {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.animate-subtle-zoom {
  animation: subtle-zoom 8s ease-in-out infinite;
}
```

---

### 6. Add CSS for Chat Panel

**File: `src/index.css`**

```css
/* Video Consult Chat Panel */
.video-consult-chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  background: linear-gradient(to bottom, hsl(220 15% 10%), hsl(220 15% 8%));
  border: 1px solid hsl(0 0% 100% / 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.video-consult-chat-tabs {
  display: flex;
  border-bottom: 1px solid hsl(0 0% 100% / 0.1);
}

.video-consult-chat-tabs button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(0 0% 100% / 0.5);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.video-consult-chat-tabs button:hover {
  color: hsl(0 0% 100% / 0.7);
  background: hsl(0 0% 100% / 0.05);
}

.video-consult-chat-tabs button.active {
  color: hsl(var(--primary));
  background: hsl(var(--primary) / 0.1);
  border-bottom: 2px solid hsl(var(--primary));
}

.video-consult-chat-content {
  flex: 1;
  overflow: hidden;
}

/* Specialist connect panel */
.video-consult-specialist-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
  height: 100%;
}
```

---

## Summary of Changes

| Element | Before | After |
|---------|--------|-------|
| Booking controls | Dark (14%-12% lightness) | Brighter (22%-20% lightness) |
| Layout | Single video column | Video + Chat side-by-side |
| Chat panel | None | Tabbed (Trudy AI / Specialist) |
| Join button | Green filled, "Join" | Outline primary, "Join Room" |
| Screen Share | Not in controls | Added to booking controls |
| Demo placeholder | Static image | Subtle zoom animation + LIVE badge |

---

## Files to Modify

- `src/pages/Book.tsx` - Layout restructure, chat panel integration, button updates
- `src/index.css` - Brightened controls, chat panel styles, animation

