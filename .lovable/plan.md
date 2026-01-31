

# Plan: Enhanced Screen Share with Inventory Preview & Audio Controls

## Overview
This plan implements three key changes to the Video Consult page:
1. Add a screen share preview modal that displays the InventoryBuilder/InventoryShareModal when sharing is active (simulating what the agent sees)
2. Add audio toggle controls for screen share
3. Remove the chat box from within the video window (DemoVideoPlaceholder)

---

## Changes

### 1. Remove Chat Box from Video Window

**File: `src/pages/Book.tsx`**

Remove the entire chat panel section from `DemoVideoPlaceholder` (lines 567-590):

```
BEFORE (inside DemoVideoPlaceholder):
┌─────────────────────────────────┐
│  Agent Video                    │
│              ┌────────────────┐ │
│              │ Chat with Trudy│ │
│              │ ...messages... │ │
│              └────────────────┘ │
│ ┌───────┐                       │
│ │ Self  │                       │
│ └───────┘     [Controls]        │
└─────────────────────────────────┘

AFTER:
┌─────────────────────────────────┐
│  Agent Video                    │
│                                 │
│                                 │
│ ┌───────┐                       │
│ │ Self  │                       │
│ └───────┘     [Controls]        │
└─────────────────────────────────┘
```

The chat functionality is already available in the right-side chat panel with Trudy AI / Specialist tabs.

---

### 2. Add Screen Share Preview Modal over Video Window

**File: `src/pages/Book.tsx`**

When the user clicks "Screen Share" in the booking controls (not in demo mode), show a preview overlay on the main video window displaying what the agent sees - the actual `InventoryShareModal` component.

New state:
```tsx
const [showScreenSharePreview, setShowScreenSharePreview] = useState(false);
```

Update `handleScreenShare` to also toggle the preview:
```tsx
const handleScreenShare = async () => {
  if (!roomUrl) {
    toast.info("Join a session first to share your screen");
    return;
  }

  if (isScreenSharing && screenStream) {
    // Stop screen sharing
    screenStream.getTracks().forEach(track => track.stop());
    setScreenStream(null);
    setIsScreenSharing(false);
    setShowScreenSharePreview(false);  // Hide preview
    toast.success("Screen sharing stopped");
  } else {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({...});
      setScreenStream(stream);
      setIsScreenSharing(true);
      setShowScreenSharePreview(true);  // Show preview modal
      toast.success("Screen sharing started!");
      
      stream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
        setIsScreenSharing(false);
        setShowScreenSharePreview(false);  // Hide on browser stop
        toast.info("Screen sharing ended");
      };
    } catch (error) {...}
  }
};
```

Add the preview modal in the main video window when not in demo mode:
```tsx
{/* Screen Share Preview Modal - when actively sharing */}
{showScreenSharePreview && isScreenSharing && !isDemo && roomUrl && (
  <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center">
    <ScreenSharePreviewModal 
      onClose={() => setShowScreenSharePreview(false)} 
    />
  </div>
)}
```

---

### 3. Create ScreenSharePreviewModal Component

**File: `src/pages/Book.tsx`**

Create a new component that shows a simulated view of what the agent sees - the inventory tracker interface. This reuses the existing `InventoryShareModal` with minor modifications to indicate it's a "preview":

```tsx
function ScreenSharePreviewModal({ onClose }: { onClose: () => void }) {
  // Same state as InventoryShareModal for the inventory UI
  const [activeRoom, setActiveRoom] = useState('Living Room');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'Living Room-3-Cushion Sofa': 1,
    'Living Room-55" Plasma TV': 1,
    'Bedroom-Queen Bed': 1,
    // ... pre-populated items
  });

  // ... quantity update logic (same as InventoryShareModal)

  return (
    <div className="w-full max-w-2xl mx-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-600">
        {/* Window Chrome with "Agent's View" indicator */}
        <div className="px-4 py-3 bg-slate-100 dark:bg-slate-700 flex items-center gap-2 border-b">
          <div className="flex gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-medium">
              Agent's View - Your Inventory
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 flex items-center gap-1">
            <Monitor className="w-3 h-3" />
            Sharing
          </span>
        </div>
        
        {/* Main Content - Same as InventoryShareModal */}
        <div className="flex h-[360px]">
          {/* Room sidebar + Item grid */}
          ...
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t flex items-center justify-between">
          <span className="text-xs">X items • Est. Y lbs</span>
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Agent can see your screen
          </span>
        </div>
      </div>
    </div>
  );
}
```

---

### 4. Add Audio Toggle for Screen Share

**File: `src/pages/Book.tsx`**

Add a new state for system audio capture:
```tsx
const [shareAudio, setShareAudio] = useState(true);
```

Update the screen share request to use the toggle:
```tsx
const stream = await navigator.mediaDevices.getDisplayMedia({
  video: { 
    displaySurface: "monitor",
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  },
  audio: shareAudio  // Use state value
});
```

Add audio toggle button next to Screen Share in booking controls:
```tsx
<div className="video-consult-booking-inner">
  <Input ... />
  <Button className="video-consult-booking-join-btn" ...>Join Room</Button>
  
  {/* Screen Share with Audio Toggle */}
  <div className="flex items-center gap-1">
    <Button 
      variant="outline" 
      className={cn(
        "video-consult-booking-share-btn",
        isScreenSharing && "video-consult-booking-share-btn--active"
      )}
      onClick={handleScreenShare}
    >
      <Monitor className="w-4 h-4 mr-2" />
      {isScreenSharing ? "Stop Sharing" : "Screen Share"}
    </Button>
    
    {/* Audio toggle button */}
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "video-consult-booking-audio-btn",
        shareAudio ? "" : "video-consult-booking-audio-btn--muted"
      )}
      onClick={() => setShareAudio(!shareAudio)}
      title={shareAudio ? "System audio: ON" : "System audio: OFF"}
    >
      {shareAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </Button>
  </div>
  
  <Button className="video-consult-booking-demo-btn" ...>Demo</Button>
</div>
```

**File: `src/index.css`**

Add styles for the audio toggle button:
```css
/* Screen Share Audio Toggle */
.video-consult-booking-audio-btn {
  height: 44px !important;
  width: 44px !important;
  padding: 0 !important;
  background: transparent !important;
  border: 1px solid hsl(0 0% 100% / 0.3) !important;
  color: hsl(0 0% 100% / 0.85) !important;
  border-left: none !important;
  border-radius: 0 8px 8px 0 !important;
}

.video-consult-booking-audio-btn:hover {
  background: hsl(var(--primary) / 0.15) !important;
  color: hsl(var(--primary)) !important;
}

.video-consult-booking-audio-btn--muted {
  color: hsl(0 0% 100% / 0.4) !important;
}

/* Adjust share button when paired with audio toggle */
.video-consult-booking-share-btn {
  border-radius: 8px 0 0 8px !important;
}
```

---

## Summary of Changes

| Component | Change |
|-----------|--------|
| DemoVideoPlaceholder | Remove embedded chat panel (lines 567-590) |
| Book (main) | Add `showScreenSharePreview` and `shareAudio` states |
| Book (main) | Add ScreenSharePreviewModal showing inventory when sharing |
| Booking controls | Add audio toggle button next to Screen Share |
| handleScreenShare | Toggle preview modal visibility |
| CSS | Add `.video-consult-booking-audio-btn` styles |

---

## Files to Modify

- `src/pages/Book.tsx` - Remove chat from video, add preview modal, add audio toggle
- `src/index.css` - Add audio toggle button styles

