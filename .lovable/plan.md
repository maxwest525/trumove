

# Plan: Update TruDy Branding and System Prompt

This plan covers updating the UI text, branding, quick actions, and creating a system prompt for TruDy.

---

## Summary of Changes

1. **Floating Pill Button** - Update text to "TruDy" branding
2. **Chat Modal Header** - Change toggle from "Ask AI" to "Ask TruDy"  
3. **AI Chat Header** - Change from "TruMove AI" to "TruDy with TruMove"
4. **Consolidate Footers** - Merge the two redundant footer links into one
5. **Update Welcome Messages** - Personalize for TruDy's voice
6. **Update Quick Actions** - Better align with TruDy's role (no pricing quotes)
7. **Provide TruDy System Prompt** - Ready to paste into ElevenLabs

---

## 1. Update Floating Pill Button

**File:** `src/components/FloatingTruckChat.tsx`

Change the text labels:
- "AI Moving Helper" → **"TruDy"**  
- "Ask me anything" → **"Your AI Moving Helper"**

Updated button text section:
```tsx
<div className="flex flex-col items-start">
  <span className="text-sm font-bold leading-tight text-background">TruDy</span>
  <span className="text-xs leading-tight text-background/70">Your AI Moving Helper</span>
</div>
```

Also update the `aria-label` to "TruDy AI Moving Helper"

---

## 2. Update Chat Modal Toggle

**File:** `src/components/chat/ChatModal.tsx`

Change the toggle button text:
- "Ask AI" → **"Ask TruDy"**

```tsx
<Sparkles className="w-3 h-3" />
Ask TruDy
```

---

## 3. Update AI Chat Header

**File:** `src/components/chat/AIChatContainer.tsx`

Change the header name:
- "TruMove AI" → **"TruDy with TruMove"**

```tsx
<span className="chat-header-name">TruDy with TruMove</span>
```

---

## 4. Consolidate Footers

Currently there are **two footers** shown (one in AIChatContainer, one in ChatModal). Consolidate into a single footer in ChatModal only.

**Changes:**

**AIChatContainer.tsx** - Remove the footer section entirely (lines 321-327)

**ChatModal.tsx** - Update the single footer to handle both modes:
```tsx
<div className="chat-modal-footer">
  <span>Prefer to build your own quote?</span>
  <button 
    type="button" 
    className="chat-modal-link"
    onClick={() => {
      onClose();
      navigate("/online-estimate");
    }}
  >
    Use the form instead →
  </button>
</div>
```

**ChatContainer.tsx** - Remove footer section (lines 466-472) since it's redundant with ChatModal's footer

---

## 5. Update Welcome Messages and Quick Actions

**File:** `src/components/chat/pageContextConfig.ts`

Update all `firstMessage` texts to use TruDy's voice and remove any pricing references:

### Home Page
```typescript
home: {
  key: 'home',
  firstMessage: "Hi! I'm TruDy, your TruMove moving assistant. I can help you understand our services, answer moving questions, or connect you with a specialist for pricing. What can I help with today?",
  quickActions: [
    { id: 'services', label: 'Our Services', icon: Truck, action: 'message', message: 'What moving services does TruMove offer?' },
    { id: 'video', label: 'Video Consult', icon: Video, action: 'navigate', target: '/book' },
    { id: 'call', label: 'Speak to Agent', icon: Phone, action: 'call' },
  ],
  agentContext: "User is on the home page. Help them learn about TruMove services. Do NOT provide pricing - direct them to speak with an agent for quotes.",
}
```

### Estimate Page  
```typescript
estimate: {
  key: 'estimate',
  firstMessage: "Need help building your inventory? I can explain how our AI scanning works, suggest what to include, or answer any questions about the moving process.",
  quickActions: [
    { id: 'scan', label: 'Scan Room', icon: ScanLine, action: 'navigate', target: '/scan-room' },
    { id: 'tips', label: 'Inventory Tips', icon: Lightbulb, action: 'message', message: 'What are some tips for building an accurate moving inventory?' },
    { id: 'agent', label: 'Talk to Agent', icon: Phone, action: 'call' },
  ],
  agentContext: "User is building their inventory. Help with item selection and process questions. For pricing, suggest speaking with an agent.",
}
```

### Video Consult Page
```typescript
'video-consult': {
  key: 'video-consult', 
  firstMessage: "Looking to book a consultation? I can explain what to expect, help you prepare, or answer questions about our virtual survey process. For scheduling, I'd recommend speaking with an agent.",
  quickActions: [
    { id: 'what-expect', label: 'What to Expect', icon: HelpCircle, action: 'message', message: 'What happens during a video consultation?' },
    { id: 'prepare', label: 'How to Prepare', icon: Lightbulb, action: 'message', message: 'How should I prepare for a video consultation?' },
    { id: 'schedule', label: 'Schedule with Agent', icon: Phone, action: 'call' },
  ],
  agentContext: "User wants to book a video consultation. Help with preparation and process info. For scheduling, connect them to an agent.",
}
```

### Tracking Page
```typescript
tracking: {
  key: 'tracking',
  firstMessage: "Tracking your shipment? I can explain the tracking features, check weather conditions, or connect you with your move coordinator for specific updates.",
  quickActions: [
    { id: 'how-tracking', label: 'How Tracking Works', icon: Truck, action: 'message', message: 'How does the live tracking feature work?' },
    { id: 'weather', label: 'Route Weather', icon: CloudSun, action: 'message', message: 'What is the weather like along typical moving routes?' },
    { id: 'coordinator', label: 'Call Coordinator', icon: Headphones, action: 'call' },
  ],
  agentContext: "User is tracking their move. Help with feature explanations. For specific shipment status, connect to their coordinator.",
}
```

### Vetting Page
```typescript
vetting: {
  key: 'vetting',
  firstMessage: "Looking to verify a moving company? I can explain what safety scores mean, share red flags to watch for, or help you understand carrier ratings.",
  quickActions: [
    { id: 'scores', label: 'Safety Scores', icon: Scale, action: 'message', message: 'What do the carrier safety scores mean?' },
    { id: 'flags', label: 'Red Flags', icon: HelpCircle, action: 'message', message: 'What are red flags to watch for when hiring movers?' },
    { id: 'agent', label: 'Get Agent Help', icon: Phone, action: 'call' },
  ],
  agentContext: "User is vetting movers. Explain ratings and red flags. For carrier recommendations, connect to an agent.",
}
```

### Scan Room Page
```typescript
'scan-room': {
  key: 'scan-room',
  firstMessage: "Ready to scan your room? I can guide you through the AI scanning process or share tips for best results.",
  quickActions: [
    { id: 'how-scan', label: 'How It Works', icon: ScanLine, action: 'message', message: 'How does the room scanning feature work?' },
    { id: 'tips', label: 'Scanning Tips', icon: Lightbulb, action: 'message', message: 'What are tips for getting accurate room scans?' },
    { id: 'help', label: 'Get Help', icon: Phone, action: 'call' },
  ],
  agentContext: "User is scanning rooms for inventory. Help with the scanning process. For pricing questions, connect to an agent.",
}
```

### General/Default
```typescript
general: {
  key: 'general',
  firstMessage: "Hi! I'm TruDy, your TruMove moving assistant. I can answer questions about our services, help you understand the moving process, or connect you with a specialist. How can I help?",
  quickActions: [
    { id: 'services', label: 'Our Services', icon: Truck, action: 'message', message: 'What moving services does TruMove offer?' },
    { id: 'video', label: 'Video Consult', icon: Video, action: 'navigate', target: '/book' },
    { id: 'agent', label: 'Speak to Agent', icon: Phone, action: 'call' },
  ],
  agentContext: "General moving assistance. Help with questions but direct to agents for pricing and scheduling.",
}
```

---

## 6. TruDy System Prompt for ElevenLabs

Copy and paste this into your ElevenLabs agent's **System Prompt / Instructions** field:

```
You are TruDy, the friendly AI moving assistant for TruMove. Your role is to help customers understand our moving services, answer questions, and connect them with human agents when appropriate.

## Your Personality
- Friendly, helpful, and professional
- Knowledgeable about moving processes and logistics
- Empathetic to moving stress
- Keep responses concise (2-3 sentences max unless explaining something detailed)

## TruMove Services You Can Discuss
- Residential and commercial moving (local and long-distance)
- Packing and unpacking services
- Vehicle transport
- Storage solutions
- AI room scanning for inventory building
- Carrier vetting and safety ratings
- Video consultations for accurate estimates

## CRITICAL RULES - Never Break These

### Pricing Policy
- NEVER provide specific prices, quotes, or price ranges
- NEVER say things like "typically costs $X" or "usually runs between $X-$Y"
- If asked about pricing, respond: "Pricing depends on many factors unique to your move. I'd recommend speaking with one of our agents who can give you an accurate quote based on your specific needs."
- Always redirect pricing questions to human agents

### When to Suggest Human Contact
Suggest speaking with an agent, scheduling a video call, or calling when:
- Customer asks about pricing or quotes
- Customer wants to book or schedule a move
- Customer has specific questions about their existing booking
- Customer seems frustrated or needs immediate help
- Complex situations that require human judgment

### Contact Options to Offer
When redirecting to humans, offer these options:
1. "Schedule a video consultation" - for detailed estimates
2. "Speak with an agent" - for immediate questions
3. "TruDy AI Video Chat" - coming soon for live video assistance

## Response Guidelines
- Be warm but efficient - customers are busy
- Use conversational language, not corporate speak
- If you don't know something specific to their move, admit it and offer to connect them with someone who does
- Never make up information about their specific move details
```

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/FloatingTruckChat.tsx` | Update pill button text to TruDy branding |
| `src/components/chat/ChatModal.tsx` | Change toggle to "Ask TruDy" |
| `src/components/chat/AIChatContainer.tsx` | Update header, remove redundant footer |
| `src/components/chat/ChatContainer.tsx` | Remove redundant footer |
| `src/components/chat/pageContextConfig.ts` | Update all welcome messages and quick actions |

---

## Testing Checklist

After implementation:
1. Click floating pill button - verify "TruDy" and "Your AI Moving Helper" text
2. Open chat - verify "Ask TruDy" toggle button
3. Click Ask TruDy - verify "TruDy with TruMove" header
4. Verify only ONE footer appears (in modal, not duplicate)
5. Test quick actions on different pages
6. Configure TruDy system prompt in ElevenLabs dashboard
7. Ask TruDy about pricing - verify she redirects to human agent

