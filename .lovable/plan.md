
# Plan: Add Fake Agent + Inventory Modal Screen Share in Demo Mode

## Current State

The demo video consult shows:
- A generic "TruMove Support" placeholder with pulsing Users icon
- Screen sharing replaces the main video area with a fake inventory builder

## Proposed Changes

### 1. Add Fake Agent (Trudy) in Main Video Area

Replace the generic support placeholder with a proper fake agent view showing:
- Trudy's avatar image (`trudy-avatar.png` already exists in assets)
- Agent name: "Trudy" with title "Moving Specialist"
- Simulated "speaking" animation when not sharing screen
- Connection status indicators

### 2. Screen Share as Popup Modal (Customer's Inventory)

Instead of replacing the entire video area, screen sharing will:
- Keep the agent visible in the background (slightly dimmed)
- Open a floating modal window that looks like the customer's shared inventory
- Modal has proper window chrome (macOS-style close/minimize/maximize buttons)
- Shows a realistic inventory list the customer is getting help with
- Draggable-looking header with "Customer's Screen - Inventory" title

---

## Visual Layout

**Before Screen Share:**
```text
┌─────────────────────────────────────────────────┐
│ [DEMO] [Connected]                     [Chat]   │
│                                                 │
│              ┌──────────────┐                   │
│              │   Trudy's    │                   │
│              │    Avatar    │                   │
│              └──────────────┘                   │
│              Trudy                              │
│              Moving Specialist                  │
│              (speaking indicator)               │
│                                        ┌─────┐  │
│                                        │ You │  │
│                                        └─────┘  │
├─────────────────────────────────────────────────┤
│  [Mic] [Video] [Share Screen] [End Call]        │
└─────────────────────────────────────────────────┘
```

**After Screen Share (Modal Overlay):**
```text
┌─────────────────────────────────────────────────┐
│ [DEMO] [Connected]                     [Chat]   │
│  ╔═══════════════════════════════════════════╗  │
│  ║ ● ● ●  Customer's Screen - Inventory      ║  │
│  ╠═══════════════════════════════════════════╣  │
│  ║  ┌────────────────────────────────────┐   ║  │
│  ║  │ Living Room                        │   ║  │
│  ║  ├────────────────────────────────────┤   ║  │
│  ║  │ 🛋 3-Seat Sofa           1   $XXX │   ║  │
│  ║  │ 📺 55" TV                1   $XXX │   ║  │
│  ║  │ 🪑 Armchair             2   $XXX │   ║  │
│  ║  │ 📦 Medium Box            4   $XXX │   ║  │
│  ║  └────────────────────────────────────┘   ║  │
│  ║  Total: 8 items • Est. 1,200 lbs          ║  │
│  ╚═══════════════════════════════════════════╝  │
│  (dimmed Trudy visible behind)                  │
├─────────────────────────────────────────────────┤
│  [Mic] [Video] [Stop Sharing] [End Call]        │
└─────────────────────────────────────────────────┘
```

---

## Technical Implementation

### File: `src/pages/Book.tsx`

**Changes to `DemoVideoPlaceholder` component:**

1. **Import Trudy avatar:**
```tsx
import trudyAvatar from "@/assets/trudy-avatar.png";
```

2. **Create `FakeAgentView` component** - Shows Trudy with animated speaking indicator:
```tsx
function FakeAgentView() {
  return (
    <div className="text-center">
      {/* Trudy Avatar */}
      <div className="relative inline-block mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl">
          <img src={trudyAvatar} alt="Trudy" className="w-full h-full object-cover" />
        </div>
        {/* Speaking indicator ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-20" />
      </div>
      <p className="text-white font-bold text-lg">Trudy</p>
      <p className="text-white/60 text-sm">Moving Specialist</p>
      <div className="flex items-center justify-center gap-1.5 mt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
        <span className="text-green-400 text-xs font-medium">Speaking...</span>
      </div>
    </div>
  );
}
```

3. **Create `InventoryShareModal` component** - Floating window showing customer's inventory:
```tsx
function InventoryShareModal({ onClose }: { onClose: () => void }) {
  const mockItems = [
    { name: "3-Seat Sofa", room: "Living Room", qty: 1, icon: "🛋" },
    { name: "55\" Smart TV", room: "Living Room", qty: 1, icon: "📺" },
    { name: "Armchair", room: "Living Room", qty: 2, icon: "🪑" },
    { name: "Coffee Table", room: "Living Room", qty: 1, icon: "☕" },
    { name: "Medium Box", room: "Bedroom", qty: 4, icon: "📦" },
    { name: "Queen Bed Frame", room: "Bedroom", qty: 1, icon: "🛏" },
  ];
  
  return (
    <div className="absolute inset-4 flex items-center justify-center z-10">
      {/* Modal */}
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-600">
        {/* Window Chrome */}
        <div className="px-4 py-3 bg-slate-100 dark:bg-slate-700 flex items-center gap-2 border-b">
          <div className="flex gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Customer's Screen - My Move Inventory
            </span>
          </div>
          <Monitor className="w-4 h-4 text-primary" />
        </div>
        
        {/* Inventory Content */}
        <div className="p-4 max-h-[300px] overflow-y-auto">
          <div className="space-y-2">
            {mockItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">{item.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.room}</p>
                </div>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">×{item.qty}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-t flex items-center justify-between">
          <span className="text-xs text-slate-500">10 items • Est. 1,850 lbs</span>
          <span className="text-xs text-primary font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live sharing
          </span>
        </div>
      </div>
    </div>
  );
}
```

4. **Update `DemoVideoPlaceholder` render logic:**
```tsx
{/* Main video area */}
<div className="flex-1 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  {/* Agent always visible */}
  <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isScreenSharing ? 'opacity-30' : 'opacity-100'}`}>
    <FakeAgentView />
  </div>
  
  {/* Screen share modal overlay */}
  {isScreenSharing && (
    <InventoryShareModal onClose={() => setIsScreenSharing(false)} />
  )}
  
  {/* Self view PIP - unchanged */}
  ...
</div>
```

---

## Files Changed

| File | Change |
|------|--------|
| `src/pages/Book.tsx` | Add Trudy avatar import, create `FakeAgentView` and `InventoryShareModal` components, update `DemoVideoPlaceholder` render |

---

## Testing Checklist

1. Navigate to /book and enter "demo" to start demo mode
2. Verify Trudy's avatar appears in the main video area with "Moving Specialist" title
3. Verify the speaking indicator animates
4. Click "Share Screen" button
5. Verify inventory modal appears as a floating window
6. Verify Trudy is still visible but dimmed behind the modal
7. Verify the modal has proper window chrome (red/yellow/green buttons)
8. Click the red close button or "Stop Sharing" to dismiss the modal
9. Verify the agent view returns to full opacity
