
# ElevenLabs Text Chat Integration Plan

## Overview
Replace the current scripted quote-flow chatbot with a true AI-powered conversational assistant using **ElevenLabs Conversational AI**. This will enable natural language conversations for customer service, move inquiries, and general questions - all through text chat (no voice yet).

## Current State Analysis

The existing chat system (`FloatingTruckChat` + `ChatContainer`) is a **scripted wizard flow**:
- Hardcoded conversation steps (ZIP → date → size → vehicle → packing → estimate)
- No actual AI - just conditional logic
- Limited to quote generation only
- Cannot handle freeform questions

## Architecture Decision

**Option A: ElevenLabs Conversational AI (Text-only mode)**
- ElevenLabs agents support `textOnly: true` mode via their React SDK
- Requires `@elevenlabs/react` package and an ElevenLabs connector
- Full conversational AI with custom knowledge base
- Can be upgraded to voice later

**Recommendation**: Use ElevenLabs for the AI brain and conversation management. The SDK's `useConversation` hook with `textOnly: true` provides a clean integration path.

---

## Implementation Plan

### Phase 1: Connect ElevenLabs

**Step 1.1: Set up ElevenLabs Connection**
- Use the ElevenLabs connector to link credentials
- This provides `ELEVENLABS_API_KEY` as an environment variable

**Step 1.2: Create Edge Function for Token Generation**
Create `supabase/functions/elevenlabs-conversation-token/index.ts`:
- Generates single-use conversation tokens server-side
- Keeps API key secure on the backend
- Returns token to client for WebSocket connection

### Phase 2: Create AI Chat Component

**Step 2.1: Install ElevenLabs React SDK**
```bash
npm install @elevenlabs/react
```

**Step 2.2: Create New AI Chat Container**
Create `src/components/chat/AIChatContainer.tsx`:
- Uses `useConversation` hook from `@elevenlabs/react`
- Set `textOnly: true` for text-only mode
- Handle `onMessage` events for transcripts
- Render messages with markdown support using `react-markdown`
- Keep existing chat UI styling (bubbles, typing indicator)

**Step 2.3: Message State Management**
- Track conversation messages locally
- Display user messages immediately
- Stream AI responses as they arrive
- Show typing indicator during AI "thinking"

### Phase 3: Configure ElevenLabs Agent

**Step 3.1: Agent Knowledge Base**
The ElevenLabs agent needs to be configured in the ElevenLabs web UI with:
- TruMove company information
- Moving services offered (residential, commercial, long-distance, etc.)
- Pricing guidance and quote process
- FAQ responses
- Ability to collect lead information (name, email, ZIP codes, move date)
- Escalation paths (schedule video call, talk to specialist)

**Step 3.2: Agent Prompt**
Configure the agent's system prompt to:
- Act as a friendly TruMove moving assistant
- Help customers get quotes and answer moving questions
- Collect necessary information conversationally
- Offer to schedule video consultations or connect with specialists

### Phase 4: Update Chat Components

**Step 4.1: Modify ChatModal**
Update `src/components/chat/ChatModal.tsx`:
- Add prop to choose between AI mode and legacy quote wizard
- Default to AI mode for general customer service

**Step 4.2: Create Mode Toggle**
- Allow switching between "Quick Quote" (existing wizard) and "Ask AI" (new ElevenLabs)
- This preserves the existing quote flow while adding AI capabilities

**Step 4.3: Preserve Existing Quick Quote Flow**
- Keep `ChatContainer.tsx` as the scripted quote wizard
- Use for users who want a structured, fast quote experience

### Phase 5: UI Enhancements

**Step 5.1: Markdown Rendering**
Install and configure `react-markdown` for AI responses:
- Format bullet points, links, bold text
- Display structured information cleanly

**Step 5.2: Quick Actions**
Add suggested action buttons based on conversation context:
- "Get a Quote" → Switch to quote wizard
- "Schedule Video Call" → Navigate to /book
- "Talk to Someone" → Show phone number

**Step 5.3: Typing Indicator**
Update typing indicator to show during AI response generation

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/elevenlabs-conversation-token/index.ts` | Create | Edge function for secure token generation |
| `supabase/config.toml` | Update | Add new edge function config |
| `src/components/chat/AIChatContainer.tsx` | Create | New AI-powered chat component |
| `src/components/chat/ChatModal.tsx` | Update | Add mode toggle (AI vs Quick Quote) |
| `src/components/chat/ChatMessage.tsx` | Update | Add markdown rendering support |
| `package.json` | Update | Add `@elevenlabs/react`, `react-markdown` |

---

## Technical Details

### Edge Function: Token Generation
```
POST /functions/v1/elevenlabs-conversation-token
Response: { token: "..." }
```

### useConversation Hook Configuration
```typescript
const conversation = useConversation({
  textOnly: true,
  onMessage: (message) => {
    // Handle user_transcript and agent_response events
  },
  onConnect: () => setIsConnected(true),
  onDisconnect: () => setIsConnected(false),
  onError: (error) => console.error(error),
});
```

### Connection Flow
1. User opens chat modal
2. Component fetches token from edge function
3. Calls `conversation.startSession({ conversationToken: token })`
4. User types message → `conversation.sendUserMessage(text)`
5. AI response arrives via `onMessage` callback
6. Display response in chat UI

---

## User Experience Flow

```text
User clicks "AI Moving Helper" button
         ↓
    Chat modal opens
         ↓
    ┌─────────────────────┐
    │  Choose your path:  │
    │                     │
    │  [💬 Ask AI]        │  ← New ElevenLabs-powered
    │  [⚡ Quick Quote]   │  ← Existing wizard
    └─────────────────────┘
         ↓
    (If Ask AI selected)
         ↓
    Token fetched from backend
         ↓
    WebSocket connection established
         ↓
    Natural conversation begins
         ↓
    AI can:
    - Answer moving questions
    - Collect lead info conversationally
    - Suggest booking video call
    - Transfer to quote wizard
```

---

## Prerequisites

Before implementation:
1. **ElevenLabs Account**: Need to create an agent in ElevenLabs web UI
2. **Agent ID**: Configure agent with TruMove knowledge base
3. **Connector Setup**: Link ElevenLabs connector to get API credentials

---

## Future Enhancements (Not in this phase)

- Voice mode toggle (same agent, just enable audio)
- Lip-synced avatar integration (Simli/HeyGen)
- Conversation history persistence
- Human handoff to live agents
