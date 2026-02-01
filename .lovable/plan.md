
# Plan: Reorganize Video Controls Card

## Overview
Restructure the video controls card to have:
1. **Top row**: All control buttons (Share Screen, Volume, Schedule Time, Trudy AI Service, Virtual Whiteboard, Demo, Settings)
2. **Bottom section**: Booking/Shipment ID input with Join Video and Call options
3. **Fix**: Remove all-green active states from buttons

---

## Layout Structure

```text
+----------------------------------------------------------+
|              VIRTUAL VIDEO CONTROLS                       |
+----------------------------------------------------------+
|  [Share] [🔊] [📅 Schedule] [🤖 Trudy AI] [📋 Whiteboard] [Demo] [⚙️] |
+----------------------------------------------------------+
|  Enter Booking Code or Shipment ID                        |
|  [________________________] [📹 Join Video] [📞 Call]     |
+----------------------------------------------------------+
```

---

## Changes

### File: `src/pages/Book.tsx`

#### 1. Add State for Schedule Modal
Add state near existing state declarations (around line 1010):
```tsx
const [showScheduleModal, setShowScheduleModal] = useState(false);
```

#### 2. Add Import for Calendar Icon
Ensure `CalendarDays`, `Bot`, `PenTool`, `Phone` icons are imported from lucide-react.

#### 3. Restructure Controls Card (lines 1247-1340)

Replace the entire booking controls section with new layout:

```tsx
{/* Booking Controls - Light themed card */}
<div className="video-consult-booking-controls animate-fade-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 w-full text-center">
    Virtual Video Controls
  </h3>
  
  {/* Top Row: All Control Buttons */}
  <div className="flex items-center gap-2 flex-wrap justify-center mb-4">
    {/* Screen Share with Audio Toggle */}
    <div className="flex items-center">
      <Button 
        variant="outline" 
        className={cn(
          "h-10 px-3 border border-border bg-background hover:bg-muted rounded-r-none",
          isScreenSharing && "border-foreground/50 bg-foreground/10"
        )}
        onClick={handleScreenShare}
      >
        <Monitor className="w-4 h-4 mr-1.5" />
        {isScreenSharing ? "Stop" : "Share"}
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "h-10 w-10 border border-border bg-background hover:bg-muted border-l-0 rounded-l-none",
          !shareAudio && "text-muted-foreground"
        )}
        onClick={() => setShareAudio(!shareAudio)}
        title={shareAudio ? "Audio: ON" : "Audio: OFF"}
      >
        {shareAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </Button>
    </div>
    
    {/* Schedule Time */}
    <Button 
      variant="outline"
      className="h-10 px-3 border border-border bg-background hover:bg-muted"
      onClick={() => setShowScheduleModal(true)}
    >
      <CalendarDays className="w-4 h-4 mr-1.5" />
      Schedule
    </Button>
    
    {/* Trudy AI Service */}
    <Button 
      variant="outline"
      className="h-10 px-3 border border-border bg-background hover:bg-muted"
      onClick={() => {/* Could trigger AI chat or modal */}}
    >
      <Bot className="w-4 h-4 mr-1.5" />
      Trudy AI
    </Button>
    
    {/* Virtual Whiteboard */}
    <Button 
      variant="outline"
      className="h-10 px-3 border border-border bg-background hover:bg-muted"
      onClick={() => {/* Whiteboard functionality */}}
    >
      <PenTool className="w-4 h-4 mr-1.5" />
      Whiteboard
    </Button>
    
    {/* Demo */}
    <Button 
      variant="outline" 
      onClick={handleStartDemo}
      className="h-10 px-3 border border-border bg-background hover:bg-muted"
    >
      <Sparkles className="w-4 h-4 mr-1.5" />
      Demo
    </Button>
    
    {/* Settings Dropdown */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="h-10 w-10 border border-border bg-background hover:bg-muted"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-border">
        {/* Settings content stays the same */}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  
  {/* Divider */}
  <div className="w-full border-t border-border mb-4" />
  
  {/* Bottom Section: Booking Input + Actions */}
  <div className="w-full space-y-3">
    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      Enter Booking Code or Shipment ID
    </label>
    <div className="flex items-center gap-2">
      <Input
        value={bookingCode}
        onChange={(e) => setBookingCode(e.target.value)}
        placeholder="e.g. TM-2026-XXXXXXXX"
        className="flex-1 h-11 bg-background border border-border"
        onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
      />
      <Button 
        onClick={handleJoinRoom} 
        disabled={!bookingCode.trim()}
        className="h-11 px-4 bg-foreground text-background hover:bg-foreground/90 font-semibold"
      >
        <Video className="w-4 h-4 mr-2" />
        Join Video
      </Button>
      <Button 
        variant="outline"
        className="h-11 px-4 border border-border bg-background hover:bg-muted font-semibold"
        onClick={() => window.location.href = "tel:+16097277647"}
      >
        <Phone className="w-4 h-4 mr-2" />
        Call
      </Button>
    </div>
  </div>
</div>
```

#### 4. Add Schedule Time Modal (after the controls card, before Footer)

```tsx
{/* Schedule Time Modal */}
<Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Schedule a Call with Your Agent</DialogTitle>
    </DialogHeader>
    <BookingCalendar 
      onSelect={(date, time) => {
        console.log('Selected:', date, time);
        // Handle scheduling logic
        setShowScheduleModal(false);
      }} 
    />
    <DialogFooter>
      <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
        Cancel
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### File: `src/index.css`

#### 5. Fix Active Button States (no all-green)

Update active state classes to use neutral/foreground colors instead of primary green:

```css
/* Screen Share Active State - neutral instead of green */
.video-consult-booking-share-btn--active {
  background: hsl(var(--foreground) / 0.1) !important;
  border-color: hsl(var(--foreground) / 0.5) !important;
  color: hsl(var(--foreground)) !important;
}

.video-consult-booking-share-btn--active:hover {
  background: hsl(var(--foreground) / 0.15) !important;
}
```

Also update inline active states in Book.tsx to use `border-foreground/50 bg-foreground/10` instead of `border-primary bg-primary/10 text-primary`.

---

## Summary

| Item | Change |
|------|--------|
| Control buttons row | Share, Volume, Schedule, Trudy AI, Whiteboard, Demo, Settings - all in one row |
| Booking input | Moved to bottom with prominent label "Enter Booking Code or Shipment ID" |
| Join Video button | Dark `bg-foreground` button for high contrast |
| Call button | New outline button to call agent directly |
| Schedule modal | Uses existing BookingCalendar component with time slot selection |
| Active button states | Changed from green to neutral dark (foreground) tones |

---

## Files to Modify

- `src/pages/Book.tsx` - Restructure controls layout, add Schedule modal, add new buttons
- `src/index.css` - Update active button state styles to remove green

