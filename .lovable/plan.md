
# Plan: Enhanced Demo Mode with Trudy Chat & Realistic Inventory

## Overview

Enhance the `/book` video consult demo mode with:
1. **Simulated typing/chat messages from Trudy** - Realistic conversation flow with typing indicators
2. **Realistic inventory items** - Replace emoji icons with actual 3D-rendered images from `/public/inventory/`

---

## Current State Analysis

**File:** `src/pages/Book.tsx`

The demo mode currently has:
- Basic chat with a single initial message from "Support"
- Simple user message handling with one generic response
- Inventory items using emoji icons (🛋, 📺, 🪑, etc.)
- No typing indicators or conversation flow

---

## Implementation Details

### 1. Simulated Trudy Chat with Typing Indicator

**New conversation flow:**
```text
[0s]   Trudy: "Hi! I'm Trudy, your TruMove specialist. I can see you've joined! 👋"
[3s]   Trudy: (typing indicator)
[5s]   Trudy: "I notice you're exploring our inventory builder. Would you like me to walk you through how screen sharing works?"
[10s]  Trudy: (typing indicator)
[12s]  Trudy: "Click 'Share Screen' below and I'll show you how we can review your inventory together in real-time."
[20s]  Trudy: "Take your time - I'm here whenever you're ready! 😊"
```

**New TypingIndicator component:**
```tsx
function ChatTypingIndicator() {
  return (
    <div className="flex items-center gap-1 text-xs text-white/50 py-1">
      <span className="font-bold">Trudy</span>
      <span className="flex gap-0.5">
        <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
      </span>
    </div>
  );
}
```

**Chat state management:**
```tsx
const [chatMessages, setChatMessages] = useState<{ from: string; text: string }[]>([]);
const [isTyping, setIsTyping] = useState(false);

useEffect(() => {
  // Simulated conversation timeline
  const timeline = [
    { delay: 500, text: "Hi! I'm Trudy, your TruMove specialist. I can see you've joined! 👋" },
    { delay: 4000, typing: true },
    { delay: 6000, text: "I notice you're exploring our inventory tools. Would you like me to show you how screen sharing works?" },
    { delay: 12000, typing: true },
    { delay: 14000, text: "Click 'Share Screen' below and I can help you review your inventory in real-time!" },
    { delay: 22000, text: "Take your time - I'm here whenever you're ready! 😊" },
  ];
  
  // Run timeline
}, []);
```

---

### 2. Realistic Inventory Items with Images

**Replace mockItems with real images:**

```tsx
const inventoryItems = [
  { 
    name: "3-Cushion Sofa", 
    room: "Living Room", 
    qty: 1, 
    image: "/inventory/living-room/sofa-3-cushion.png",
    weight: 180,
    volume: 45
  },
  { 
    name: "55\" Plasma TV", 
    room: "Living Room", 
    qty: 1, 
    image: "/inventory/living-room/tv-plasma.png",
    weight: 65,
    volume: 8
  },
  { 
    name: "Armchair", 
    room: "Living Room", 
    qty: 2, 
    image: "/inventory/living-room/armchair.png",
    weight: 85,
    volume: 24
  },
  { 
    name: "Coffee Table", 
    room: "Living Room", 
    qty: 1, 
    image: "/inventory/living-room/coffee-table.png",
    weight: 45,
    volume: 12
  },
  { 
    name: "Queen Bed", 
    room: "Bedroom", 
    qty: 1, 
    image: "/inventory/bedroom/bed-queen.png",
    weight: 150,
    volume: 60
  },
  { 
    name: "Dresser", 
    room: "Bedroom", 
    qty: 1, 
    image: "/inventory/bedroom/dresser.png",
    weight: 120,
    volume: 28
  },
  { 
    name: "Nightstand", 
    room: "Bedroom", 
    qty: 2, 
    image: "/inventory/bedroom/nightstand.png",
    weight: 35,
    volume: 6
  },
  { 
    name: "Medium Box", 
    room: "General", 
    qty: 8, 
    image: "/inventory/boxes/medium-box.png",
    weight: 25,
    volume: 3
  },
  { 
    name: "Refrigerator", 
    room: "Kitchen", 
    qty: 1, 
    image: "/inventory/appliances/refrigerator.png",
    weight: 250,
    volume: 40
  },
  { 
    name: "Washer", 
    room: "Laundry", 
    qty: 1, 
    image: "/inventory/appliances/washer.png",
    weight: 170,
    volume: 18
  },
];
```

**Updated inventory item UI:**

```tsx
<div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
  <div className="w-10 h-10 rounded-md bg-white dark:bg-slate-600 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-500">
    <img 
      src={item.image} 
      alt={item.name} 
      className="w-8 h-8 object-contain mix-blend-multiply dark:mix-blend-normal"
    />
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{item.name}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400">{item.room}</p>
  </div>
  <div className="text-right">
    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">×{item.qty}</span>
    <p className="text-[10px] text-slate-400">{item.weight} lbs</p>
  </div>
</div>
```

**Updated footer with calculated totals:**

```tsx
// Calculate totals from inventory
const totalItems = inventoryItems.reduce((sum, item) => sum + item.qty, 0);
const totalWeight = inventoryItems.reduce((sum, item) => sum + (item.weight * item.qty), 0);

// Footer
<div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-t">
  <span className="text-xs text-slate-500">
    {totalItems} items • Est. {totalWeight.toLocaleString()} lbs
  </span>
</div>
```

---

### 3. Additional Context-Aware Messages

**When screen sharing starts, add Trudy response:**

```tsx
const handleShareScreen = () => {
  setIsScreenSharing(!isScreenSharing);
  if (!isScreenSharing) {
    toast.success("Screen sharing started");
    // Trudy responds to screen share
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        from: "Trudy", 
        text: "Perfect! I can see your inventory now. Let me walk you through each item..." 
      }]);
    }, 1500);
  } else {
    toast("Screen sharing stopped");
  }
};
```

**When user sends a message, Trudy responds contextually:**

```tsx
const trudyResponses = [
  "Great question! I'm checking that for you now.",
  "That's a common concern - let me explain how we handle that.",
  "Absolutely! I'll make a note of that in your profile.",
  "I see that on my end. Let's walk through it together.",
];

const handleSendMessage = () => {
  if (newMessage.trim()) {
    setChatMessages([...chatMessages, { from: "You", text: newMessage }]);
    setNewMessage("");
    // Show typing then respond
    setTimeout(() => setIsTyping(true), 500);
    setTimeout(() => {
      setIsTyping(false);
      const response = trudyResponses[Math.floor(Math.random() * trudyResponses.length)];
      setChatMessages(prev => [...prev, { from: "Trudy", text: response }]);
    }, 2000);
  }
};
```

---

## Visual Layout

**Chat Panel (enhanced):**
```text
┌────────────────────────────────┐
│ 💬 Chat                        │
├────────────────────────────────┤
│ Trudy: Hi! I'm Trudy... 👋     │
│ Trudy: Would you like me to... │
│ Trudy ●●● (typing)             │ <- Animated dots
│ You: How does this work?       │
│ Trudy: Great question! I'm...  │
├────────────────────────────────┤
│ [Type a message...         ]   │
└────────────────────────────────┘
```

**Inventory Modal (enhanced):**
```text
┌────────────────────────────────────────────────┐
│ ● ● ●   Customer's Screen - My Move Inventory  │
├────────────────────────────────────────────────┤
│ [🛋️ img] 3-Cushion Sofa    Living Room    ×1  │
│ [📺 img] 55" Plasma TV     Living Room    ×1  │
│ [🪑 img] Armchair          Living Room    ×2  │
│ [☕ img] Coffee Table       Living Room    ×1  │
│ [🛏️ img] Queen Bed         Bedroom        ×1  │
│ [📦 img] Medium Box         General        ×8  │
│ [❄️ img] Refrigerator       Kitchen        ×1  │
├────────────────────────────────────────────────┤
│ 16 items • Est. 1,890 lbs    🟢 Live sharing   │
└────────────────────────────────────────────────┘
```

---

## Files Changed

| File | Change |
|------|--------|
| `src/pages/Book.tsx` | Add typing indicator, conversation timeline, realistic inventory items with images, context-aware chat responses |

---

## Testing Checklist

1. Navigate to /book and enter "demo" to join demo room
2. Verify Trudy's welcome messages appear with realistic timing
3. Verify typing indicator (●●●) appears between messages
4. Click "Share Screen" and verify Trudy responds contextually
5. Verify inventory modal shows actual 3D-rendered images (not emojis)
6. Verify item images render correctly on both light and dark mode
7. Send a chat message and verify Trudy responds with typing indicator
8. Verify calculated totals (items + weight) are accurate in footer
9. Test "Stop Sharing" and verify modal closes properly
