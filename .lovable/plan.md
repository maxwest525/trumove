
# Plan: Page-Aware AI Assistant Customization

## Overview

Implement a context-aware AI chat system where the assistant's first message and quick action buttons adapt dynamically based on which page the user is viewing. This creates a more relevant and helpful experience tailored to the user's current intent.

## Current State Analysis

### Chat Entry Points
1. **FloatingTruckChat** - Main floating button visible on all pages (src/components/FloatingTruckChat.tsx)
2. **FloatingChatButton** - Alternative floating button (src/components/FloatingChatButton.tsx)
3. **ChatModal** - Modal wrapper that hosts AIChatContainer (src/components/chat/ChatModal.tsx)
4. **AIChatContainer** - ElevenLabs-powered AI chat (src/components/chat/AIChatContainer.tsx)

### Current Behavior
- AIChatContainer has a hardcoded welcome message: "Hi! I'm your TruMove AI assistant. I can help you with moving quotes, answer questions about our services, or connect you with a specialist."
- Quick action buttons are static: "Quick Quote", "Video Consult", "Call Us"
- No awareness of which page the user opened the chat from

## Implementation Approach

### 1. Define Page Contexts

Create a mapping of page paths to context configurations:

| Page | Context Key | First Message | Quick Actions |
|------|-------------|---------------|---------------|
| `/` (Home) | `home` | General welcome, offer to help start a quote | Quick Quote, Video Consult, Call Us |
| `/online-estimate` | `estimate` | Offer help with inventory building | Add Items Tips, Scan Room, Get AI Estimate |
| `/book` | `video-consult` | Help with video consultation booking | Schedule Call, Try Demo, Phone Support |
| `/track` | `tracking` | Assist with shipment tracking | Enter Booking, Check ETA, Contact Driver |
| `/carrier-vetting` | `vetting` | Help with carrier verification | Search Carrier, Compare Carriers, Safety Tips |
| `/about`, `/faq` | `info` | Answer questions about TruMove | Get Quote, Our Services, Contact Us |
| Default | `general` | Standard welcome message | Quick Quote, Video Consult, Call Us |

### 2. Create PageContext Configuration

```text
src/components/chat/
  pageContextConfig.ts   (NEW) - Page context definitions
```

This file will export:
- Type definitions for page contexts
- Configuration object mapping paths to context settings
- Helper function to get context from pathname

### 3. Update Component Data Flow

```text
Current Flow:
FloatingTruckChat/FloatingChatButton 
  -> ChatModal 
    -> AIChatContainer (hardcoded messages)

New Flow:
FloatingTruckChat/FloatingChatButton 
  -> ChatModal (pass pageContext prop)
    -> AIChatContainer (receive context, customize messages)
```

### 4. Files to Modify

**src/components/chat/pageContextConfig.ts** (NEW)
- Define PageContext type with firstMessage, quickActions, contextualPrompts
- Export getPageContext(pathname) function
- Configure all page-specific settings

**src/components/FloatingTruckChat.tsx**
- Import useLocation from react-router-dom
- Pass current pathname to ChatModal

**src/components/FloatingChatButton.tsx**
- Import useLocation from react-router-dom  
- Pass current pathname to ChatModal

**src/components/chat/ChatModal.tsx**
- Accept optional `pagePath` prop
- Derive page context from path
- Pass context to AIChatContainer

**src/components/chat/AIChatContainer.tsx**
- Accept `pageContext` prop
- Use context-specific first message in onConnect callback
- Render context-specific quick action buttons
- Pass context to ElevenLabs agent via sendContextualUpdate

### 5. Quick Action Button Configuration

Each page context will define:
```text
quickActions: [
  { id: string, label: string, icon: IconComponent, action: 'navigate' | 'quote' | 'call' | 'custom', target?: string }
]
```

Actions:
- `navigate`: Navigate to a route (target = path)
- `quote`: Switch to Quick Quote mode
- `call`: Open phone dialer
- `custom`: Send a specific message to the AI

### 6. Contextual Agent Prompting

When connecting to ElevenLabs:
- Send an initial contextual update via `conversation.sendContextualUpdate()` to inform the agent of the user's current page
- This allows the AI to provide more relevant responses

Example: "User is currently on the inventory builder page and may need help adding items or understanding the estimation process."

## Technical Details

### PageContext Type Definition
```text
interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  action: 'navigate' | 'quote' | 'call' | 'message';
  target?: string;
  message?: string;
}

interface PageContext {
  key: string;
  firstMessage: string;
  quickActions: QuickAction[];
  agentContext: string;  // Context sent to ElevenLabs agent
}
```

### Page-to-Context Mapping
```text
/                     -> home
/online-estimate      -> estimate
/book                 -> video-consult
/track                -> tracking
/carrier-vetting      -> vetting
/scan-room            -> scan-room
/about, /faq, /terms  -> info
*                     -> general (default)
```

## Implementation Order

1. Create `pageContextConfig.ts` with all configurations
2. Update `FloatingTruckChat.tsx` to detect and pass page context
3. Update `FloatingChatButton.tsx` to detect and pass page context
4. Update `ChatModal.tsx` to accept and forward context
5. Update `AIChatContainer.tsx` to consume context and customize behavior
6. Test all page contexts to verify correct messages and actions

## Expected Behavior

**User on Home Page:**
- First message: "Hi! Ready to get your instant moving quote? I can help you estimate costs, find vetted movers, or answer any questions about your upcoming move."
- Quick actions: [Get Quick Quote] [Book Video Consult] [Call Now]

**User on Inventory Builder:**
- First message: "Need help building your inventory? I can suggest items based on your home size, explain how our AI estimation works, or help you find specific furniture to add."
- Quick actions: [AI Estimate] [Scan Room] [View Tips]

**User on Live Tracking:**
- First message: "Tracking your shipment? I can help you understand your delivery timeline, check weather conditions along the route, or connect you with your driver coordinator."
- Quick actions: [Enter Booking #] [Check Weather] [Contact Support]

**User on Carrier Vetting:**
- First message: "Looking to verify a moving company? I can explain what the safety scores mean, help you compare carriers, or guide you through the vetting process."
- Quick actions: [How to Search] [Compare Tips] [What to Look For]
