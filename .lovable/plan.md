

# Plan: Video Consult UI Enhancements - Chat UX, Controls Cleanup, Schedule Form, and Layout Polish

## Overview
This plan addresses 7 specific enhancements to the Video Consult page (/book):

1. **Trudy AI tab enhancement** - Add arrow/icon that opens the actual chatbot via custom event, update sample messages
2. **Shrink booking/shipment ID input** - Make the input field more compact
3. **Schedule modal validation** - Require name, phone, email, date AND time for form completion
4. **Add TCPA consent** - Already exists, but ensure it's required for submission
5. **Remove mute/speaker buttons from Virtual Video Controls** - They already exist in the live video window
6. **Add speaker selection to Live Chat panel** - Device selector dropdown for audio output
7. **Move name/specialist badge in video preview** - Relocate from bottom-left to top-right area

---

## Visual Changes

```text
TRUDY AI TAB (Updated):
+----------------------------------------------------------+
|  Click the chat icon below to talk with Trudy →          |
|                                                          |
|  [🤖 Open Trudy Chat]  (Arrow/sparkle animation)         |
|                                                          |
|  Sample questions:                                       |
|  • "How much will my move cost?"                         |
|  • "What's included in full-service packing?"            |
|  • "Can you explain the insurance options?"              |
+----------------------------------------------------------+

LIVE CHAT TAB (Add Speaker Device Selector):
+----------------------------------------------------------+
|  Live Video Chat                            [🔊 Speaker ▼]|
|  Connected to call                                 LIVE  |
+----------------------------------------------------------+

VIDEO PREVIEW (Name Badge Moved):
+----------------------------------------------------------+
|  [LIVE]           [Trudy Martinez - Sr. Moving Spec.]    |
|                                                          |
|                   (video content)                        |
|                                                          |
|                                              [YOU] 📹    |
+----------------------------------------------------------+

VIRTUAL VIDEO CONTROLS (Simplified - No Mute/Volume):
+----------------------------------------------------------+
|  [Share][🔊] [📅 Schedule] [🤖 Trudy] [📋 Whiteboard] [⚙️] |
+----------------------------------------------------------+
```

---

## Technical Changes

### File: `src/pages/Book.tsx`

#### 1. Add `ExternalLink` to Imports (Line 6-11)
```tsx
import { 
  ..., ExternalLink, Headset,
} from "lucide-react";
```

#### 2. Update Trudy's Sample Messages (Lines 753-759)
Replace the timeline messages with more helpful, action-oriented content:

**BEFORE:**
```tsx
const timeline: { delay: number; text?: string; typing?: boolean }[] = [
  { delay: 300, text: "Hi there! Thanks for calling TruMove! 👋" },
  { delay: 3500, typing: true },
  { delay: 5500, text: "I'm Trudy, your dedicated moving specialist. How can I help you today?" },
  { delay: 10000, typing: true },
  { delay: 12000, text: "Feel free to share your screen if you'd like me to review your inventory!" },
];
```

**AFTER:**
```tsx
const timeline: { delay: number; text?: string; typing?: boolean }[] = [
  { delay: 300, text: "Welcome to TruMove! I'm Trudy, your personal moving consultant. 👋" },
  { delay: 3500, typing: true },
  { delay: 5500, text: "I see you're exploring your options - great timing! I can help you get an accurate quote, explain our services, or walk you through the moving process." },
  { delay: 10000, typing: true },
  { delay: 12000, text: "Want to share your screen so I can see your inventory? Or I can answer any questions you have about pricing, timelines, or logistics!" },
];
```

#### 3. Move Name Badge in FakeAgentView (Lines 77-85)
Move from bottom-left to top-right (next to LIVE badge):

**BEFORE:**
```tsx
{/* Name badge overlay - bottom left like real video calls */}
<div className="absolute bottom-20 left-4 flex items-center gap-3 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm">
  ...
</div>
```

**AFTER:**
```tsx
{/* Name badge overlay - top right, next to LIVE indicator */}
<div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm">
  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
  <div className="text-right">
    <p className="text-white font-bold text-xs">Trudy Martinez</p>
    <p className="text-white/60 text-[10px]">Senior Moving Specialist</p>
  </div>
</div>
```

#### 4. Update Trudy AI Chat Tab Content (Lines 1236-1238)
Replace `AIChatContainer` with a CTA panel that triggers the global chat:

**BEFORE:**
```tsx
{chatMode === 'trudy' && (
  <AIChatContainer pageContext={pageContext} />
)}
```

**AFTER:**
```tsx
{chatMode === 'trudy' && (
  <div className="video-consult-specialist-panel h-full flex flex-col">
    {/* Header */}
    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30">
        <img src={trudyAvatar} alt="Trudy" className="w-full h-full object-cover" />
      </div>
      <div>
        <h4 className="text-white font-bold text-sm">Trudy AI Assistant</h4>
        <p className="text-primary text-xs font-medium">Available 24/7</p>
      </div>
    </div>
    
    {/* Sample Questions */}
    <div className="flex-1 space-y-3">
      <p className="text-white/60 text-sm">
        Trudy can help you with:
      </p>
      <ul className="space-y-2 text-sm text-white/80">
        <li className="flex items-start gap-2">
          <span className="text-primary">•</span>
          "How much will my move cost?"
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary">•</span>
          "What's included in full-service packing?"
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary">•</span>
          "Can you explain the insurance options?"
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary">•</span>
          "Do you offer storage between moves?"
        </li>
      </ul>
    </div>
    
    {/* CTA Button with Arrow */}
    <div className="mt-auto pt-4">
      <Button 
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base group"
        onClick={() => window.dispatchEvent(new CustomEvent('openTrudyChat'))}
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Chat with Trudy Now
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
      <p className="text-center text-white/40 text-[10px] mt-2">
        Opens in floating chat window
      </p>
    </div>
  </div>
)}
```

#### 5. Add Speaker Device Selector to Live Chat Panel (Lines 1277-1294)
Add a dropdown for speaker selection in the Live Chat header:

**Add state variable** (around line 930):
```tsx
const [selectedSpeaker, setSelectedSpeaker] = useState<string>("default");
```

**Update Live Chat header:**
```tsx
{chatMode === 'livechat' && (
  <div className="video-consult-specialist-panel h-full flex flex-col">
    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
        <MessageSquare className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <h4 className="text-white font-bold text-sm">Live Video Chat</h4>
        <p className="text-white/50 text-xs">
          {roomUrl ? "Connected to call" : "Join a video call to chat"}
        </p>
      </div>
      
      {/* Speaker Device Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10">
            <Headset className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-white/20 text-white">
          <DropdownMenuLabel className="text-white/60 text-xs">Audio Output</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem 
            className="cursor-pointer text-white/80 hover:text-white focus:text-white focus:bg-white/10"
            onClick={() => {
              setSelectedSpeaker("default");
              toast.info("Using default speaker");
            }}
          >
            {selectedSpeaker === "default" && "✓ "}Default Speaker
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer text-white/80 hover:text-white focus:text-white focus:bg-white/10"
            onClick={() => {
              setSelectedSpeaker("headphones");
              toast.info("Using headphones");
            }}
          >
            {selectedSpeaker === "headphones" && "✓ "}Headphones
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer text-white/80 hover:text-white focus:text-white focus:bg-white/10"
            onClick={() => {
              setSelectedSpeaker("external");
              toast.info("Using external speakers");
            }}
          >
            {selectedSpeaker === "external" && "✓ "}External Speakers
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {roomUrl && (
        <span className="px-2 py-1 rounded bg-green-600/20 text-green-400 text-xs font-bold">
          LIVE
        </span>
      )}
    </div>
    ...
  </div>
)}
```

#### 6. Remove Mute Button from Virtual Video Controls (Lines 1378-1393)
Delete the mute button section entirely since it already exists in the video window control bar.

**DELETE this block:**
```tsx
{/* Mute Microphone */}
<Button
  variant="outline"
  size="icon"
  className={cn(
    "h-10 w-10 border border-border bg-background hover:bg-muted",
    isMicMuted && "border-destructive/50 bg-destructive/10 text-destructive"
  )}
  onClick={() => {
    setIsMicMuted(!isMicMuted);
    toast.info(isMicMuted ? "Microphone unmuted" : "Microphone muted");
  }}
  title={isMicMuted ? "Unmute" : "Mute"}
>
  {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
</Button>
```

#### 7. Update Schedule Modal Validation (Lines 1502-1515)
Ensure the form validates that date AND time are selected before allowing submission:

**Update the BookingCalendar onSelect handler:**
```tsx
<BookingCalendar 
  onSelect={(date, time) => {
    // Validate ALL required fields
    if (!date || !time) {
      toast.error("Please select both a date and time");
      return;
    }
    if (!scheduleName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!schedulePhone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!scheduleEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!scheduleTcpaConsent) {
      toast.error("Please consent to be contacted to continue");
      return;
    }
    
    // All fields valid - submit
    toast.success(`Scheduled for ${time} on ${date.toLocaleDateString()}`);
    // Reset form
    setScheduleName("");
    setSchedulePhone("");
    setScheduleEmail("");
    setScheduleTcpaConsent(false);
    setShowScheduleModal(false);
  }} 
/>
```

#### 8. Make Email Required in Schedule Form (Lines 1546-1558)
Change email from optional to required:

**BEFORE:**
```tsx
<Label htmlFor="schedule-email" className="text-xs">
  Email (optional)
</Label>
```

**AFTER:**
```tsx
<Label htmlFor="schedule-email" className="text-xs">
  Email <span className="text-destructive">*</span>
</Label>
```

#### 9. Shrink Booking Input Further (Lines 1461-1489)
Make the entire booking section more compact:

**Update the booking section:**
```tsx
{/* Bottom Section: Booking Input + Actions */}
<div className="w-full space-y-2">
  <div className="flex items-center gap-2">
    <Input
      value={bookingCode}
      onChange={(e) => setBookingCode(e.target.value)}
      placeholder="Booking Code or Shipment ID"
      className="flex-1 h-8 text-xs bg-background border border-border placeholder:text-muted-foreground/60"
      onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
    />
    <Button 
      onClick={handleJoinRoom} 
      disabled={!bookingCode.trim()}
      className="h-8 px-2.5 text-xs bg-foreground text-background hover:bg-foreground/90 font-semibold"
    >
      <Video className="w-3 h-3 mr-1" />
      Join
    </Button>
    <Button 
      variant="outline"
      className="h-8 px-2.5 text-xs border border-border bg-background hover:bg-muted font-semibold"
      onClick={() => window.location.href = "tel:+16097277647"}
    >
      <Phone className="w-3 h-3 mr-1" />
      Call
    </Button>
  </div>
</div>
```

---

## Summary of All Changes

| Change | Description |
|--------|-------------|
| **Trudy AI tab** | Replaced with CTA panel + sample questions + arrow button that opens floating chat |
| **Sample messages** | Updated Trudy's demo conversation to be more helpful and action-oriented |
| **Name badge** | Moved from bottom-left to top-right in video preview |
| **Speaker selector** | Added device dropdown in Live Chat panel header |
| **Mute button** | Removed from Virtual Video Controls (exists in video window) |
| **Schedule validation** | All fields (name, phone, email, date, time, TCPA) now required |
| **Email field** | Changed from optional to required |
| **Booking input** | Reduced height from h-9 to h-8, removed label, more compact |

---

## Files Modified

- `src/pages/Book.tsx` - All UI changes consolidated in single file

