
# Plan: Fix ElevenLabs Text-Only Chat Connection

## Problem Identified

Your ElevenLabs agent is configured for **text-only mode** (as shown in your screenshot), but the current code is requesting a **WebRTC conversation token** which requires audio/video room capabilities. Text-only agents don't have LiveKit rooms, causing the 404 error.

## Solution

Switch from WebRTC tokens to WebSocket signed URLs for text-only connections.

## Changes Required

### 1. Update Edge Function: Get Signed URL Instead of Token

**File:** `supabase/functions/elevenlabs-conversation-token/index.ts`

Change the API endpoint from:
```
/v1/convai/conversation/token
```
To:
```
/v1/convai/conversation/get-signed-url
```

And return `signed_url` instead of `token`.

### 2. Update Client: Use WebSocket Connection

**File:** `src/components/chat/AIChatContainer.tsx`

Change the session start from:
```javascript
await conversation.startSession({
  conversationToken: data.token,
});
```
To:
```javascript
await conversation.startSession({
  signedUrl: data.signed_url,
  connectionType: "websocket",
});
```

## Technical Flow

```text
+-------------------+     +----------------------+     +------------------+
|  AIChatContainer  | --> | Edge Function        | --> | ElevenLabs API   |
|                   |     | (get-signed-url)     |     | /get-signed-url  |
+-------------------+     +----------------------+     +------------------+
         |                         |                           |
         |    { signed_url }       |<--------------------------|
         |<------------------------|                           
         |                                                     
         v                                                     
+-------------------+     +------------------+
|  startSession({   | --> | ElevenLabs       |
|    signedUrl,     |     | WebSocket Server |
|    connectionType:|     | (api.elevenlabs) |
|    "websocket"    |     |                  |
|  })               |     +------------------+
+-------------------+
```

## Why This Fixes the Issue

- **WebRTC tokens** create LiveKit rooms (for audio/video) → 404 because text-only agents don't have rooms
- **WebSocket signed URLs** connect directly to ElevenLabs text API → Works for text-only agents

## No Other Changes Needed

- Agent configuration is correct (Voice, LLM, Published, Text-only)
- The existing message handling code will continue to work
- No changes to the Maya persona or UI components
