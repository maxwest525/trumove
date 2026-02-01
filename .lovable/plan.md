

# Plan: Typing Indicators, Video Controls, and Weather Widget Relocation

## Overview
Three improvements:
1. Add typing indicators to Live Support chat when agent is composing a response
2. Add volume and mic buttons to the bottom of the video preview
3. Remove weather widget from AI Move Estimator (OnlineEstimate page) - the Shipment Tracking page already has route weather

---

## Visual Changes

```text
LIVE SUPPORT CHAT (Typing Indicator):
+--------------------------------+
| [User message bubble]          |
|--------------------------------|
| Trudy ● ● ●                    |  <- Shows while agent is "typing"
|--------------------------------|
| [Agent response bubble]        |
+--------------------------------+

VIDEO PREVIEW (Bottom Controls):
+--------------------------------+
|                                |
|     [Video Content]            |
|                                |
+--------------------------------+
| [Speaker] [Mic]                |  <- Bottom overlay with icon-only buttons
+--------------------------------+

WEATHER WIDGET:
- REMOVED from OnlineEstimate page
- ALREADY EXISTS in LiveTracking page (RouteWeather component)
```

---

## Technical Changes

### File: `src/pages/Book.tsx`

#### 1. Add Typing Indicator State (Around line 583)

Add state to track when agent is "typing":

```tsx
const [isAgentTyping, setIsAgentTyping] = useState(false);
```

#### 2. Update Message Sending Logic (Lines 1404-1430 and 1450-1465)

Modify the simulated agent response to show typing indicator first:

```tsx
// When user sends a message
onKeyDown={(e) => {
  if (e.key === 'Enter' && liveChatInput.trim() && roomUrl) {
    const newMsg = {
      id: `msg-${Date.now()}`,
      text: liveChatInput.trim(),
      isUser: true,
      time: new Date()
    };
    setLiveChatMessages(prev => [...prev, newMsg]);
    setLiveChatInput('');
    
    // Show typing indicator after 500ms
    setTimeout(() => {
      setIsAgentTyping(true);
    }, 500);
    
    // Hide typing and show response after 1.5-2.5 seconds
    setTimeout(() => {
      setIsAgentTyping(false);
      const agentResponses = [
        "Thanks for your message! I'm reviewing your inventory now.",
        "Got it! Let me check on that for you.",
        "Great question! Based on what I see, I can help with that.",
        "I'm here to help! Let me look into this.",
      ];
      const response = agentResponses[Math.floor(Math.random() * agentResponses.length)];
      setLiveChatMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        text: response,
        isUser: false,
        time: new Date()
      }]);
    }, 2000 + Math.random() * 500);
  }
}}
```

Apply the same logic to the onClick handler for the Send button.

#### 3. Display Typing Indicator in Messages Area (After line 1392)

Add the typing indicator display before the closing div of messages area:

```tsx
{/* Typing Indicator */}
{isAgentTyping && <ChatTypingIndicator />}
```

#### 4. Add Bottom Audio Controls to Video Preview (Around line 1231)

Add mic and speaker controls at the bottom of the video preview container:

```tsx
{/* Bottom Audio Control Bar */}
<div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-2">
  {/* Speaker Toggle - Icon Only with Dropdown */}
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
        title="Speaker settings"
      >
        <Volume2 className="w-5 h-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel className="text-xs">Select Speaker</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {audioOutputDevices.length > 0 ? (
        audioOutputDevices.map((device) => (
          <DropdownMenuItem key={device.deviceId} className="text-xs">
            {device.label || 'Default Speaker'}
          </DropdownMenuItem>
        ))
      ) : (
        <DropdownMenuItem disabled className="text-xs">
          Default Speaker
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
  
  {/* Mic Toggle - Icon Only */}
  <Button
    variant="ghost"
    size="icon"
    className={cn(
      "h-10 w-10 rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm",
      isMicMuted && "bg-destructive/20 border-destructive/50 text-destructive"
    )}
    onClick={() => {
      setIsMicMuted(!isMicMuted);
      toast.info(isMicMuted ? "Microphone unmuted" : "Microphone muted");
    }}
    title={isMicMuted ? "Unmute microphone" : "Mute microphone"}
  >
    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
  </Button>
</div>
```

---

### File: `src/pages/OnlineEstimate.tsx`

#### 5. Remove Weather Forecast Import (Line 21)

Remove the import:
```tsx
// DELETE: import MoveWeatherForecast from "@/components/estimate/MoveWeatherForecast";
```

#### 6. Remove Weather Forecast Component (Lines 425-432)

Remove the weather widget from the right sidebar:
```tsx
// DELETE this entire block:
{/* Weather Forecast along route */}
{extendedDetails && extendedDetails.fromLocation && extendedDetails.toLocation && (
  <MoveWeatherForecast
    originLocation={extendedDetails.fromLocation}
    destLocation={extendedDetails.toLocation}
    moveDate={extendedDetails.moveDate}
  />
)}
```

---

## Summary

| Change | File | Description |
|--------|------|-------------|
| Typing indicator state | Book.tsx | Add `isAgentTyping` state |
| Typing indicator logic | Book.tsx | Show indicator during "agent typing" simulation |
| Typing indicator display | Book.tsx | Render `ChatTypingIndicator` in messages area |
| Audio controls | Book.tsx | Add Volume/Mic buttons to video preview bottom |
| Remove weather import | OnlineEstimate.tsx | Remove unused import |
| Remove weather widget | OnlineEstimate.tsx | Remove MoveWeatherForecast from sidebar |

---

## Notes

- The Shipment Tracking page (`/track`) already has the `RouteWeather` component displaying weather conditions along the route
- The `ChatTypingIndicator` component already exists in Book.tsx (lines 89-101) with animated bouncing dots
- The typing indicator will show for ~1.5 seconds before the agent "response" appears

---

## Files Modified

- `src/pages/Book.tsx` - Typing indicator + audio controls
- `src/pages/OnlineEstimate.tsx` - Remove weather widget

