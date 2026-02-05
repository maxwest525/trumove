
# Trudy Marketing AI Assistant Integration

## Overview
Integrate Trudy as a full-service AI marketing assistant inside the Marketing Hub. Users can describe what they need in plain language (e.g., "I want an ad with a llama"), and Trudy will:
1. **Design & create** the marketing asset (ad copy, landing page, campaign)
2. **Generate images** using Lovable AI image generation
3. **Show where to launch** the asset across platforms (Google Ads, Meta, etc.)
4. **Handle any backend marketing tasks** through natural conversation

---

## Architecture

```text
+------------------------------------------+
|        Marketing Hub + Trudy Chat        |
+------------------------------------------+
|  +----------------+  +-----------------+ |
|  | Feature Cards  |  | Trudy AI Panel  | |
|  |                |  |                 | |
|  | Landing Pages  |  | "I want an ad   | |
|  | A/B Tests      |  |  with a llama"  | |
|  | Keywords       |  |                 | |
|  | Campaigns      |  | [Designing...]  | |
|  |                |  |                 | |
|  | [or just ask   |  | Here's your ad: | |
|  |  Trudy →]      |  | [Preview Image] | |
|  +----------------+  |                 | |
|                      | Launch on:      | |
|                      | ○ Google Ads    | |
|                      | ○ Meta/FB       | |
|                      | ○ TikTok        | |
|                      +-----------------+ |
+------------------------------------------+
```

---

## Implementation Plan

### Phase 1: Create Marketing AI Edge Function
**New file: `supabase/functions/marketing-ai-assistant/index.ts`**

Uses Lovable AI Gateway to power Trudy's marketing capabilities:
- Natural language understanding for marketing requests
- Image generation using `google/gemini-2.5-flash-image` for ad creatives
- Structured output for campaign configurations
- Platform-specific ad format recommendations

```typescript
// Key capabilities:
// 1. Parse user intent: "ad with llama" → {type: "ad", creative: "llama image"}
// 2. Generate ad copy with brand voice
// 3. Create images using Nano banana model
// 4. Suggest launch platforms with step-by-step guidance
```

### Phase 2: Create Trudy Marketing Chat Component
**New file: `src/components/demo/ppc/TrudyMarketingChat.tsx`**

A specialized chat interface embedded in the Marketing Hub:
- Streaming responses for real-time feedback
- Image preview cards for generated creatives
- Platform selection with "Launch" buttons
- Context-aware suggestions based on current page
- Inline action buttons (Create, Edit, Launch)

```text
+------------------------------------------+
| 💬 Ask Trudy                             |
+------------------------------------------+
| You: I want an ad with a llama for our   |
|      California moving service           |
|                                          |
| Trudy: Great choice! 🦙 Here's what I    |
| created for you:                         |
|                                          |
| [Generated Image Preview]                |
| "Move with the pack, not the hassle"     |
|                                          |
| Ad copy:                                 |
| ✓ Headline: Moving Made Easy - CA        |
| ✓ Description: Join 50,000+ happy...     |
|                                          |
| Ready to launch? Pick your platform:     |
| [Google Ads] [Meta] [TikTok]             |
+------------------------------------------+
| [Ask Trudy anything about marketing...]  |
+------------------------------------------+
```

### Phase 3: Integrate into Marketing Hub Dashboard
**Modify: `src/components/demo/ppc/MarketingHubDashboard.tsx`**

Add Trudy chat panel as a persistent sidebar or expandable panel:
- Split layout: Feature cards (left) + Trudy chat (right)
- "Ask Trudy" floating button when collapsed
- Quick prompts for common tasks:
  - "Create a landing page for [location]"
  - "Design a Facebook ad"
  - "Optimize my campaign"
  - "What keywords should I target?"

### Phase 4: Add Marketing Context to Trudy
**Modify: `src/components/chat/pageContextConfig.ts`**

Add marketing-specific context:
```typescript
marketing: {
  key: 'marketing',
  firstMessage: "Hi! I'm Trudy, your AI marketing assistant. I can create ads, design landing pages, generate images, and help you launch campaigns. What would you like to create today?",
  quickActions: [
    { id: 'create-ad', label: 'Create Ad', icon: Image, action: 'message', message: 'Help me create an ad' },
    { id: 'landing-page', label: 'Landing Page', icon: Layout, action: 'message', message: 'Build a landing page' },
    { id: 'optimize', label: 'Optimize Campaign', icon: TrendingUp, action: 'message', message: 'How can I improve my campaigns?' },
  ],
  agentContext: "User is in the Marketing Hub. Help create ads, landing pages, campaigns. You CAN generate images and provide specific marketing guidance.",
}
```

### Phase 5: Image Generation Integration
**Modify: `supabase/functions/marketing-ai-assistant/index.ts`**

Add image generation capability:
```typescript
// When user requests creative with specific imagery:
if (needsImageGeneration) {
  const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}` },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: imagePrompt }],
      modalities: ["image", "text"]
    })
  });
  // Return base64 image to display in chat
}
```

### Phase 6: Platform Launch Guidance
**New file: `src/components/demo/ppc/PlatformLaunchGuide.tsx`**

Interactive component showing users how to launch their created assets:
- Platform-specific step-by-step instructions
- Copy-to-clipboard for ad copy
- Download buttons for generated images
- Direct links to ad platforms (Google Ads, Meta Business Suite)
- Budget recommendations based on campaign type

---

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/marketing-ai-assistant/index.ts` | AI backend for marketing tasks with image generation |
| `src/components/demo/ppc/TrudyMarketingChat.tsx` | Specialized marketing chat UI with image previews |
| `src/components/demo/ppc/PlatformLaunchGuide.tsx` | Launch guidance for each ad platform |
| `src/components/demo/ppc/GeneratedAdPreview.tsx` | Preview card for AI-generated ad creatives |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/demo/ppc/MarketingHubDashboard.tsx` | Add Trudy chat panel, split layout |
| `src/components/demo/PPCDemoModal.tsx` | Integrate TrudyMarketingChat component |
| `src/components/chat/pageContextConfig.ts` | Add marketing context for Trudy |
| `supabase/config.toml` | Add new edge function configuration |

---

## User Experience Flow

1. **User opens Marketing Hub** → Sees feature cards + Trudy chat panel
2. **User types** "I want an ad with a llama for California moves"
3. **Trudy responds** with streaming text:
   - "Great idea! Let me create that for you..."
   - Generates image using AI
   - Writes ad copy
   - Shows preview card
4. **User sees** generated ad with llama image + copy
5. **User clicks** "Launch on Google Ads"
6. **Trudy shows** step-by-step guide:
   - "Go to ads.google.com"
   - "Click 'New Campaign'"
   - "Download this image [button]"
   - "Copy this headline [button]"
   - "Set budget: $50-100/day recommended"

---

## Trudy Marketing Capabilities

| Capability | How Trudy Handles It |
|------------|---------------------|
| **Create ad with custom image** | Uses Nano banana image gen + writes copy |
| **Build landing page** | Uses QuickStartWizard with AI-generated content |
| **Suggest keywords** | Analyzes business + returns keyword list |
| **Optimize campaign** | Reviews current settings + suggests improvements |
| **Explain metrics** | Natural language explanation of CTR, ROAS, etc. |
| **Launch guidance** | Platform-specific step-by-step instructions |
| **A/B test ideas** | Suggests variants to test based on goals |

---

## Technical Approach

### Edge Function: Marketing AI Assistant
- Uses `google/gemini-3-flash-preview` for text (fast, capable)
- Uses `google/gemini-2.5-flash-image` for image generation
- Structured output via tool calling for campaign configs
- Streaming responses for better UX

### Frontend: TrudyMarketingChat
- Token-by-token streaming render
- Image preview cards with download/copy actions
- Platform launch buttons with guided flows
- Context preservation between messages
- Quick action chips for common tasks

### Integration Points
- Uses existing `LOVABLE_API_KEY` (already configured)
- Follows patterns from `AIChatContainer.tsx`
- Reuses TruMove branding elements
- Works alongside existing Marketing Hub features
