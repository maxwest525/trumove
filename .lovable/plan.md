

# Plan: Video Consult UI Fixes & Settings Dropdown

## Overview
Address 5 issues on the Video Consult page (/book):
1. Add a settings dropdown to the video controls
2. Fix the booking controls animation (already has `animate-fade-in` but may need delay)
3. Fix chat buttons - Call Now is all green, needs better contrast (reference image shows this)
4. Reduce green hover effect on Screen Share and Volume buttons
5. Improve overall button visibility and readability

---

## Changes

### 1. Add Settings Dropdown to Video Controls

Add a Settings button with dropdown for quality and notification preferences.

**File: `src/pages/Book.tsx`**

Add to imports:
```tsx
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
```

Add state for settings:
```tsx
const [videoQuality, setVideoQuality] = useState<'auto' | 'high' | 'medium' | 'low'>('auto');
const [notificationsEnabled, setNotificationsEnabled] = useState(true);
```

Add settings dropdown button after the Demo button (around line 1283):
```tsx
{/* Settings Dropdown */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button 
      variant="outline" 
      size="icon"
      className="video-consult-booking-settings-btn"
    >
      <Settings className="w-4 h-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700 text-white">
    <DropdownMenuLabel className="text-white/80">Video Settings</DropdownMenuLabel>
    <DropdownMenuSeparator className="bg-slate-700" />
    <DropdownMenuItem 
      className="text-white hover:bg-slate-700 cursor-pointer"
      onClick={() => setVideoQuality('auto')}
    >
      Quality: Auto {videoQuality === 'auto' && '✓'}
    </DropdownMenuItem>
    <DropdownMenuItem 
      className="text-white hover:bg-slate-700 cursor-pointer"
      onClick={() => setVideoQuality('high')}
    >
      Quality: High {videoQuality === 'high' && '✓'}
    </DropdownMenuItem>
    <DropdownMenuItem 
      className="text-white hover:bg-slate-700 cursor-pointer"
      onClick={() => setVideoQuality('medium')}
    >
      Quality: Medium {videoQuality === 'medium' && '✓'}
    </DropdownMenuItem>
    <DropdownMenuSeparator className="bg-slate-700" />
    <DropdownMenuLabel className="text-white/80">Notifications</DropdownMenuLabel>
    <DropdownMenuItem 
      className="text-white hover:bg-slate-700 cursor-pointer"
      onClick={() => setNotificationsEnabled(!notificationsEnabled)}
    >
      Sound Alerts: {notificationsEnabled ? 'On ✓' : 'Off'}
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### 2. Add Animation Delay to Booking Controls

Add a slight delay to the entrance animation for a staggered effect.

**File: `src/pages/Book.tsx`** (line 1231)

```tsx
// BEFORE:
<div className="video-consult-booking-controls animate-fade-in">

// AFTER:
<div className="video-consult-booking-controls animate-fade-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
```

---

### 3. Fix Chat Buttons - Not All Green

The "Call Now" button should be solid primary (green) but "Schedule Callback" needs a white/neutral color scheme per the user's screenshot showing the buttons with too much green.

**File: `src/pages/Book.tsx`** (lines 1208-1222)

```tsx
// BEFORE:
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

// AFTER - Higher contrast, no green hover on Schedule:
<Button 
  className="w-full bg-primary hover:bg-primary/85 text-black font-bold h-12 text-base shadow-[0_2px_8px_hsl(var(--primary)/0.3)]"
  onClick={() => window.location.href = "tel:+18001234567"}
>
  <Phone className="w-5 h-5 mr-2" />
  Call Now
</Button>
<Button 
  variant="outline" 
  className="w-full border-2 border-white/50 text-white hover:bg-white/10 hover:border-white/70 font-bold h-12 text-base bg-slate-800/50"
```

---

### 4. Reduce Green Hover on Screen Share and Volume Buttons

The hover states have too much green. Change to a subtle white highlight instead.

**File: `src/index.css`** (lines 29998-30002, 30060-30064)

```css
/* BEFORE - Screen Share hover: */
.video-consult-booking-share-btn:hover {
  background: hsl(var(--primary) / 0.2) !important;
  border-color: hsl(var(--primary)) !important;
  color: hsl(var(--primary)) !important;
}

/* AFTER - Subtle white hover: */
.video-consult-booking-share-btn:hover {
  background: hsl(0 0% 100% / 0.08) !important;
  border-color: hsl(0 0% 100% / 0.5) !important;
  color: hsl(0 0% 100%) !important;
}

/* BEFORE - Audio button hover: */
.video-consult-booking-audio-btn:hover {
  background: hsl(var(--primary) / 0.2) !important;
  color: hsl(var(--primary)) !important;
  border-color: hsl(var(--primary)) !important;
}

/* AFTER - Subtle white hover: */
.video-consult-booking-audio-btn:hover {
  background: hsl(0 0% 100% / 0.08) !important;
  color: hsl(0 0% 100%) !important;
  border-color: hsl(0 0% 100% / 0.5) !important;
}
```

---

### 5. Add Settings Button CSS

**File: `src/index.css`** (after line 30068)

```css
/* Settings Button */
.video-consult-booking-settings-btn {
  height: 48px !important;
  width: 48px !important;
  padding: 0 !important;
  background: hsl(220 15% 18%) !important;
  border: 2px solid hsl(0 0% 100% / 0.35) !important;
  color: hsl(0 0% 100%) !important;
  border-radius: 10px !important;
}

.video-consult-booking-settings-btn:hover {
  background: hsl(0 0% 100% / 0.08) !important;
  color: hsl(0 0% 100%) !important;
  border-color: hsl(0 0% 100% / 0.5) !important;
}
```

---

## Summary of Changes

| Component | Issue | Fix |
|-----------|-------|-----|
| Settings dropdown | Missing | Add dropdown with quality + notification options |
| Booking controls animation | May need delay | Add `animationDelay: '0.15s'` for staggered entrance |
| Call Now button | Hard to see text | Keep green bg, ensure black text |
| Schedule Callback button | Too much green | White/neutral scheme, no green hover |
| Screen Share hover | Too much green | Change to subtle white highlight |
| Volume button hover | Too much green | Change to subtle white highlight |
| Settings button | New | Style to match other control buttons |

---

## Files to Modify

- `src/pages/Book.tsx` - Add settings dropdown, fix button classes, add animation delay
- `src/index.css` - Update hover states, add settings button styles

