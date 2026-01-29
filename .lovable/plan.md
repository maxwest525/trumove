
# Plan: Fix Message Parsing for ElevenLabs Text-Only Agent

## Great News - Connection is Working!

The ElevenLabs integration is actually connected and responding! Your agent "TruDy" is sending messages back. The issue is that the message format from text-only agents is different from what the code expects.

## The Problem

**What the code expects:**
```json
{
  "type": "agent_response",
  "agent_response_event": {
    "agent_response": "Hello!"
  }
}
```

**What ElevenLabs text-only agent actually sends:**
```json
{
  "source": "ai",
  "role": "agent",
  "message": "Hi, thanks for contacting TruDy at TruMove!"
}
```

## The Fix

Update the `onMessage` handler in `AIChatContainer.tsx` to recognize both message formats:

**File:** `src/components/chat/AIChatContainer.tsx`

```typescript
onMessage: (message: unknown) => {
  console.log("Message received:", message);
  
  const msg = message as { 
    type?: string; 
    source?: string;
    role?: string;
    message?: string;
    agent_response_event?: { agent_response?: string }; 
    agent_response_correction_event?: { corrected_agent_response?: string } 
  };
  
  // Handle text-only agent messages (simpler format)
  if (msg.source === "ai" && msg.role === "agent" && msg.message) {
    setIsThinking(false);
    addAssistantMessage(msg.message);
    return;
  }
  
  // Handle WebRTC agent responses (original format)
  if (msg.type === "agent_response") {
    setIsThinking(false);
    const agentText = msg.agent_response_event?.agent_response;
    if (agentText) {
      addAssistantMessage(agentText);
    }
  }
  
  // ... rest of existing code
}
```

## What This Changes

- Adds detection for the simpler `{ source, role, message }` format used by text-only agents
- Keeps existing WebRTC message handling for future voice agent support
- No other files need changes

## Expected Result

After this fix:
- TruDy's messages will appear in the chat UI
- Users can have a conversation with your AI assistant
- Quick actions will work as designed
