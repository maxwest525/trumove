

# Make Video Consult Look Like Trudy Actually Answered the Call

## Overview
Transform the demo video consult to look like a real, active video call where Trudy Martinez has answered and is on screen - not just a centered avatar with a "Speaking" indicator.

---

## Current State
- Trudy appears as a centered circular avatar (128px)
- "Speaking..." indicator below her name
- "DEMO MODE" badge prominently displayed (breaks immersion)
- Small self-view placeholder in corner
- Feels like a waiting room, not an active call

## Target State
- Trudy appears as a full-bleed video feed (like a real video call)
- Professional backdrop with realistic video call aesthetic
- "Connected" status badge instead of "DEMO MODE"
- Call duration timer for realism
- Enhanced self-view that looks like actual webcam feed
- Overall feel: you're IN an active video call with a real person

---

## Changes

### 1. Redesign FakeAgentView for Full Video Feed
**File:** `src/pages/Book.tsx`

Transform from centered avatar to full-screen video call layout:

```tsx
function FakeAgentView() {
  return (
    <div className="absolute inset-0">
      {/* Full-bleed agent "video" with professional background */}
      <div className="absolute inset-0">
        {/* Professional office/call background with Trudy's image filling the space */}
        <img 
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=800&fit=crop" 
          alt="Trudy Martinez" 
          className="w-full h-full object-cover"
        />
        {/* Subtle gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/30" />
      </div>
      
      {/* Name badge overlay - bottom left like real video calls */}
      <div className="absolute bottom-20 left-4 flex items-center gap-3 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm">
        <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
        <div>
          <p className="text-white font-bold text-sm">Trudy Martinez</p>
          <p className="text-white/60 text-xs">Senior Moving Specialist</p>
        </div>
      </div>
    </div>
  );
}
```

### 2. Replace "DEMO MODE" with "Connected" Status + Timer
**File:** `src/pages/Book.tsx`

Add a call timer state and change the status badge:

```tsx
// In DemoVideoPlaceholder component
const [callDuration, setCallDuration] = useState(0);

// Timer effect
useEffect(() => {
  const timer = setInterval(() => {
    setCallDuration(prev => prev + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);

// Format duration as M:SS
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Replace the connection status badge:
<div className="absolute top-4 left-4 flex items-center gap-2">
  <div className="px-3 py-1.5 rounded-full bg-green-500/90 text-white text-xs font-bold flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
    Connected • {formatDuration(callDuration)}
  </div>
</div>
```

### 3. Enhance Self-View PIP for Realism
**File:** `src/pages/Book.tsx`

Make the self-view larger and more realistic:

```tsx
{/* Self view (picture-in-picture) - Larger and more realistic */}
<div className="absolute bottom-20 right-4 w-36 h-28 rounded-xl overflow-hidden border-2 border-white/30 bg-slate-800 shadow-xl">
  {isVideoOff ? (
    <div className="w-full h-full flex items-center justify-center bg-slate-800">
      <VideoOff className="w-6 h-6 text-white/40" />
    </div>
  ) : (
    <div className="w-full h-full relative">
      {/* Simulated webcam with gradient - looks like real video feed */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-600" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-white/30 flex items-center justify-center">
          <span className="text-white font-bold text-lg">You</span>
        </div>
      </div>
      {/* Muted indicator */}
      {isMuted && (
        <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-red-500">
          <MicOff className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  )}
  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium">
    You
  </div>
</div>
```

### 4. Update Initial Chat Messages for Answered Call Feel
**File:** `src/pages/Book.tsx`

Adjust the timeline to feel like she just answered:

```tsx
const timeline: { delay: number; text?: string; typing?: boolean }[] = [
  { delay: 300, text: "Hi there! Thanks for calling TruMove! 👋" },
  { delay: 3500, typing: true },
  { delay: 5500, text: "I'm Trudy, your dedicated moving specialist. How can I help you today?" },
  { delay: 10000, typing: true },
  { delay: 12000, text: "Feel free to share your screen if you'd like me to review your inventory!" },
];
```

### 5. Add Recording/Quality Indicators (Optional Polish)
**File:** `src/pages/Book.tsx`

Add subtle call quality indicators like real video apps:

```tsx
{/* Call quality indicator - top right, next to chat */}
<div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
  <div className="flex gap-0.5">
    <div className="w-1 h-3 rounded-sm bg-green-400" />
    <div className="w-1 h-3 rounded-sm bg-green-400" />
    <div className="w-1 h-3 rounded-sm bg-green-400" />
    <div className="w-1 h-2 rounded-sm bg-green-400/50" />
  </div>
  <span className="text-[10px] text-white/70 font-medium">HD</span>
</div>
```

---

## Visual Comparison

### Before (Current)
```
┌──────────────────────────────────────────┐
│ 🟠 DEMO MODE                   Chat ──┐ │
│                                │      │ │
│           ┌─────────┐          │      │ │
│           │  ┌───┐  │          │      │ │
│           │  │ 📷 │  │          │      │ │
│           │  └───┘  │          └──────┘ │
│           │  Trudy  │                   │
│           │Speaking.│           ┌─────┐ │
│           └─────────┘           │ You │ │
│              Avatar             └─────┘ │
├──────────────────────────────────────────┤
│  🎤   📹   [Share Screen]   📞          │
└──────────────────────────────────────────┘
```

### After (Proposed)
```
┌──────────────────────────────────────────┐
│ 🟢 Connected • 1:24    ▐▐▐▌ HD  Chat ──┐│
│                                │ Hi! 👋│ │
│  ╔══════════════════════════╗  │ I'm  │ │
│  ║                          ║  │Trudy │ │
│  ║   [TRUDY FULL VIDEO]     ║  │ ...  │ │
│  ║   Professional woman     ║  └──────┘ │
│  ║   on video call          ║           │
│  ║                          ║  ┌──────┐ │
│  ╟──────────────────────────╢  │      │ │
│  ║ 🟢 Trudy Martinez        ║  │ You  │ │
│  ║   Senior Moving Spec.    ║  └──────┘ │
│  ╚══════════════════════════╝           │
├──────────────────────────────────────────┤
│  🎤   📹   [Share Screen]   📞          │
└──────────────────────────────────────────┘
```

---

## Summary

| Change | Description |
|--------|-------------|
| Full-bleed video | Trudy's image fills the video area like a real call |
| Connected badge | Green "Connected • 1:24" with live timer |
| Name overlay | Bottom-left badge like Zoom/Teams calls |
| Enhanced self-view | Larger, more realistic PIP with mute indicator |
| Updated messages | Chat feels like she just answered the call |
| Quality indicator | Subtle HD/signal bars for polish |

## Files Modified
- `src/pages/Book.tsx` - All changes in this single file

