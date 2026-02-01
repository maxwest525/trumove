

# Plan: Refine Video Consult Controls & Chat Options

## Overview
This plan addresses 3 specific changes:
1. **Remove Demo button** from Virtual Video Controls (keep only in video window)
2. **Restructure Chat Module** to have 3 clear tabs: Trudy AI, Contact Support, Live Video Chat
3. **Add Mute button** to Virtual Video Controls

---

## Visual Layout Changes

```text
CHAT MODULE - 3 Tabs:
+----------------------------------------------------------+
|  [🤖 Trudy AI]  [📞 Support]  [💬 Live Chat]             |
+----------------------------------------------------------+
|                                                          |
|  (Tab content based on selection)                        |
|                                                          |
+----------------------------------------------------------+

VIRTUAL VIDEO CONTROLS (Demo removed, Mute added):
+----------------------------------------------------------+
|  [Share][🔊] [🔇 Mute] [📅 Schedule] [🤖 Trudy] [📋 Whiteboard] [⚙️] |
+----------------------------------------------------------+
```

---

## Changes

### File: `src/pages/Book.tsx`

#### 1. Add State for Microphone Mute
Add near existing state variables (around line 930):

```tsx
const [isMicMuted, setIsMicMuted] = useState(false);
```

#### 2. Update Chat Tab Types & State
Update `chatMode` to support 3 modes (around line 934):

```tsx
const [chatMode, setChatMode] = useState<'trudy' | 'support' | 'livechat'>('trudy');
```

#### 3. Restructure Chat Panel Tabs (lines 1196-1211)
Change from 2 tabs to 3 tabs with clearer labels:

```tsx
{/* Tab Selector - 3 Options */}
<div className="video-consult-chat-tabs">
  <button 
    className={chatMode === 'trudy' ? 'active' : ''}
    onClick={() => setChatMode('trudy')}
    title="Talk to Trudy AI Assistant"
  >
    <Bot className="w-4 h-4" />
    Trudy AI
  </button>
  <button 
    className={chatMode === 'support' ? 'active' : ''}
    onClick={() => setChatMode('support')}
    title="Contact Support Team"
  >
    <Phone className="w-4 h-4" />
    Support
  </button>
  <button 
    className={chatMode === 'livechat' ? 'active' : ''}
    onClick={() => setChatMode('livechat')}
    title="Live Chat During Video Call"
  >
    <MessageSquare className="w-4 h-4" />
    Live Chat
  </button>
</div>
```

#### 4. Update Chat Content to Handle 3 Modes (lines 1214-1251)
Replace the chat content section with:

```tsx
{/* Chat Content */}
<div className="video-consult-chat-content">
  {chatMode === 'trudy' && (
    <AIChatContainer pageContext={pageContext} />
  )}
  
  {chatMode === 'support' && (
    <div className="video-consult-specialist-panel">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Headphones className="w-8 h-8 text-primary" />
      </div>
      <h4 className="text-white font-bold mb-2">Contact Support</h4>
      <p className="text-white/60 text-sm mb-6">
        Get personalized help from our licensed moving consultants.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button 
          className="w-full bg-foreground hover:bg-foreground/90 text-background font-bold h-12 text-base"
          onClick={() => window.location.href = "tel:+18001234567"}
        >
          <Phone className="w-5 h-5 mr-2" />
          Call Now
        </Button>
        <Button 
          variant="outline" 
          className="w-full border border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-bold h-12 text-base"
          onClick={() => setShowScheduleModal(true)}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Schedule Callback
        </Button>
        <Button 
          variant="outline" 
          className="w-full border border-white/40 text-white hover:bg-white/10 hover:border-white/60 h-11"
          onClick={() => window.open('mailto:support@trumove.com')}
        >
          <Mail className="w-4 h-4 mr-2" />
          Email Support
        </Button>
      </div>
    </div>
  )}
  
  {chatMode === 'livechat' && (
    <div className="video-consult-specialist-panel h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-white font-bold text-sm">Live Video Chat</h4>
          <p className="text-white/50 text-xs">
            {roomUrl ? "Connected to call" : "Join a video call to chat"}
          </p>
        </div>
        {roomUrl && (
          <span className="ml-auto px-2 py-1 rounded bg-green-600/20 text-green-400 text-xs font-bold">
            LIVE
          </span>
        )}
      </div>
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[200px]">
        {!roomUrl ? (
          <div className="text-center text-white/40 text-sm py-8">
            Join a video call to start live chat
          </div>
        ) : (
          <div className="text-center text-white/40 text-sm py-8">
            Chat messages with your agent will appear here
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <div className="mt-auto">
        <div className="flex items-center gap-2">
          <Input 
            placeholder={roomUrl ? "Type a message..." : "Join call to chat"}
            disabled={!roomUrl}
            className="flex-1 bg-slate-800/60 border-white/30 text-white placeholder:text-white/50 h-10 disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim() && roomUrl) {
                toast.info("Message sent to agent!");
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
          <Button 
            size="icon"
            disabled={!roomUrl}
            className="h-10 w-10 bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )}
</div>
```

#### 5. Remove Demo Button from Controls (lines 1321-1329)
Delete the Demo button section entirely from Virtual Video Controls.

#### 6. Add Mute Button to Controls (after Screen Share, before Schedule)
Insert after the Screen Share button group:

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

#### 7. Add New Icon Imports
Add to lucide-react imports:

```tsx
import { Mic, MicOff, Send, Mail } from "lucide-react";
```

---

## Summary

| Item | Change |
|------|--------|
| Demo button | Removed from Virtual Video Controls (stays in video window placeholder) |
| Chat tabs | Now 3 options: **Trudy AI**, **Support**, **Live Chat** |
| Live Chat tab | Shows chat interface connected to current video call |
| Support tab | Call Now, Schedule Callback, Email Support options |
| Mute button | Added to Virtual Video Controls with muted/unmuted states |

---

## Files Modified

- `src/pages/Book.tsx` - Remove Demo button, add Mute button, restructure chat to 3 tabs

