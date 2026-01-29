

# Plan: Fix AI Chat Widget - Global Visibility & Agent Configuration

## Issue Summary

Two issues have been identified:

1. **AI assistant not responding** - The ElevenLabs agent connection fails with a 404 error during WebRTC handshake
2. **Chat widget not visible on other pages** - The floating button only appears on the home page

---

## Issue 1: AI Assistant Not Responding

### Root Cause Analysis

The diagnostic flow shows:
- Edge function successfully fetches a conversation token from ElevenLabs API (HTTP 200)
- Agent ID being used: `agent_0801kg5f25t0e3jbjw81shjtgtrn`
- WebRTC connection to `livekit.rtc.elevenlabs.io/rtc/v1/validate` fails with 404

This 404 means the agent exists in ElevenLabs but is **not properly published or configured**. Common causes:
- Agent is in draft mode (not published)
- Missing voice configuration
- Missing LLM/prompt configuration
- Agent was deleted or disabled

### Required Action (User)

You need to verify your ElevenLabs agent configuration in the ElevenLabs dashboard:

1. **Go to ElevenLabs Console** → Agents section
2. **Find the agent** with ID `agent_0801kg5f25t0e3jbjw81shjtgtrn`
3. **Verify it has:**
   - A voice selected
   - An LLM model configured (e.g., GPT-4)
   - System prompt/instructions defined
   - **Published status** (not draft)

4. **If agent doesn't exist or is broken**, create a new one:
   - Create a Conversational AI agent in ElevenLabs
   - Configure voice, LLM, and system prompt
   - Publish the agent
   - Copy the new Agent ID
   - Update the `ELEVENLABS_AGENT_ID` secret with the new ID

---

## Issue 2: Chat Widget Missing on Other Pages

### Root Cause

The `FloatingTruckChat` component is currently only rendered inside `src/pages/Index.tsx`. It's not included in `App.tsx` or any other page components.

### Solution

Move the `FloatingTruckChat` component to `App.tsx` so it renders globally across all routes.

### Implementation

**File: `src/App.tsx`**

Changes:
1. Import `FloatingTruckChat` component
2. Add it inside the `BrowserRouter` but outside the `Routes` component

```text
// Add import at top
import FloatingTruckChat from "@/components/FloatingTruckChat";

// Inside the JSX, after <Routes>...</Routes>:
<FloatingTruckChat />
```

**File: `src/pages/Index.tsx`**

Changes:
1. Remove the `FloatingTruckChat` import
2. Remove the `<FloatingTruckChat />` render near line 1491

This prevents duplicate rendering on the home page.

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/App.tsx` | Add FloatingTruckChat import and render globally |
| `src/pages/Index.tsx` | Remove FloatingTruckChat (moved to App) |

---

## Post-Implementation Verification

After the code changes:

1. Navigate to different pages (`/track`, `/online-estimate`, `/book`, etc.)
2. Confirm the floating AI chat button appears on all pages
3. Once the ElevenLabs agent is properly configured and published, test the AI chat functionality

---

## Note on ElevenLabs Agent Setup

For the AI to respond, the ElevenLabs agent needs:
- **Voice**: Select any voice from the library (e.g., "Rachel", "Adam")
- **LLM**: Choose a model (GPT-4, Claude, etc.)
- **System Prompt**: Define the assistant's personality and instructions for TruMove moving help
- **Status**: Must be **Published**, not in draft mode

If you need help creating or configuring the agent, I can provide a recommended system prompt for a moving company AI assistant.

