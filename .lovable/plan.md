
# Add Demo Info Callout to AI Inventory Analysis Section

## Overview
Add an informational callout box above the "Demo AI Analysis" button to set user expectations and explain what the demo showcases before they try it.

---

## Current Flow
1. User sees "AI Inventory Analysis" header
2. User clicks "Demo AI Analysis" button
3. Lead capture modal appears (if no contact info)
4. User navigates to `/scan-room`

## Problem
Users may not understand what they're about to see or what the demo demonstrates. Adding context improves the user experience and sets proper expectations.

---

## Changes

### 1. Add Demo Info Callout Component
**File:** `src/pages/Index.tsx` (around line 1536)

Insert an info callout between the subtitle and the button:

```tsx
{/* Demo Info Callout */}
<div className="tru-ai-demo-info">
  <div className="tru-ai-demo-info-icon">
    <Info className="w-5 h-5" />
  </div>
  <div className="tru-ai-demo-info-content">
    <p className="tru-ai-demo-info-title">
      This is an interactive demo
    </p>
    <p className="tru-ai-demo-info-text">
      Experience how our AI scans a room and automatically detects furniture, boxes, and appliances. 
      The demo uses sample imagery — when you're ready, you can scan your own home.
    </p>
  </div>
</div>
```

### 2. Add Info Icon Import
**File:** `src/pages/Index.tsx`

Ensure `Info` icon is imported from lucide-react:

```tsx
import { Info, ... } from "lucide-react";
```

### 3. Add CSS Styling for Demo Info Callout
**File:** `src/index.css`

```css
/* AI Demo Info Callout */
.tru-ai-demo-info {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: hsl(var(--primary) / 0.08);
  border: 1px solid hsl(var(--primary) / 0.2);
  border-radius: 12px;
  padding: 16px 20px;
  max-width: 520px;
  margin: 0 auto 24px;
  text-align: left;
}

.tru-ai-demo-info-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(var(--primary) / 0.15);
  border-radius: 10px;
  color: hsl(var(--primary));
}

.tru-ai-demo-info-content {
  flex: 1;
}

.tru-ai-demo-info-title {
  font-size: 15px;
  font-weight: 700;
  color: hsl(var(--foreground));
  margin: 0 0 4px;
}

.tru-ai-demo-info-text {
  font-size: 14px;
  color: hsl(var(--muted-foreground));
  line-height: 1.5;
  margin: 0;
}
```

---

## Visual Layout After Change

```
┌──────────────────────────────────────────────┐
│          AI Inventory Analysis               │
│  Take a video or pictures of your room...   │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ℹ️  This is an interactive demo        │  │
│  │    Experience how our AI scans a room  │  │
│  │    and automatically detects...        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│         [ Demo AI Analysis → ]               │
│                                              │
│      ┌──────────┐  ┌──────────────┐          │
│      │ Scanner  │  │ Live Items   │          │
│      │ Preview  │  │ Detection    │          │
│      └──────────┘  └──────────────┘          │
│                                              │
│    ① Video    ② AI Detection    ③ Agent     │
└──────────────────────────────────────────────┘
```

---

## Summary

| Change | File | Description |
|--------|------|-------------|
| Add Info import | `src/pages/Index.tsx` | Import Info icon from lucide-react |
| Add demo info callout | `src/pages/Index.tsx` | JSX callout with icon, title, and explanation |
| Add callout styling | `src/index.css` | Green-tinted info box with icon badge |

## Visual Result
- Clear callout explains this is a demo before users click
- Green-tinted design matches the primary brand color
- Icon badge draws attention without being aggressive
- Users understand they'll see sample imagery, not their actual home
