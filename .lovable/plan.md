

# Plan: Enhanced Demo Mode - Professional Employee Image & Interactive Inventory Modal

## Overview

Update the `/book` video consult demo mode with:
1. **Professional woman employee image for Trudy** - Replace the current avatar with a realistic professional headshot
2. **Interactive inventory modal** - Make items clickable with +/- quantity controls, similar to the actual inventory builder

---

## Implementation Details

### 1. Professional Trudy Image

**Current State:** Uses `trudyAvatar.png` - a stylized/avatar image

**Solution:** Use a professional stock photo of a woman in a customer service/office setting. Since we don't have one in assets, we'll use a high-quality placeholder service like `randomuser.me` or similar for a professional female headshot.

**Update `FakeAgentView` component:**
```tsx
function FakeAgentView() {
  return (
    <div className="text-center">
      <div className="relative inline-block mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl">
          {/* Professional woman employee photo */}
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face" 
            alt="Trudy - Moving Specialist" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-20" />
      </div>
      <p className="text-white font-bold text-lg">Trudy Martinez</p>
      <p className="text-white/60 text-sm">Senior Moving Specialist</p>
      <div className="flex items-center justify-center gap-1.5 mt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
        <span className="text-green-400 text-xs font-medium">Speaking...</span>
      </div>
    </div>
  );
}
```

---

### 2. Interactive Inventory Modal

**Current State:** Static list of items with no click interaction

**New Features:**
- +/- buttons on each item to adjust quantity
- Visual feedback when quantity changes (highlight animation)
- Dynamic total recalculation
- Delete button to remove items entirely
- More realistic "active editing" feel

**Update `InventoryShareModal` component:**

```tsx
function InventoryShareModal({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState(inventoryItems.map(item => ({ ...item })));

  const updateQuantity = (index: number, delta: number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ).filter(item => item.qty > 0));
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.qty), 0);

  return (
    <div className="absolute inset-4 flex items-center justify-center z-10">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-2xl ...">
        {/* Window Chrome - unchanged */}
        
        {/* Inventory Content - Now Interactive */}
        <div className="p-4 max-h-[300px] overflow-y-auto">
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 group hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                {/* Image thumbnail */}
                <div className="w-10 h-10 rounded-md bg-white ...">
                  <img src={item.image} alt={item.name} className="..." />
                </div>
                
                {/* Item info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium ...">{item.name}</p>
                  <p className="text-xs ...">{item.room}</p>
                </div>
                
                {/* Quantity controls - NEW */}
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => updateQuantity(i, -1)}
                    className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                  <button 
                    onClick={() => updateQuantity(i, 1)}
                    className="w-6 h-6 rounded bg-primary/20 hover:bg-primary/30 flex items-center justify-center text-primary transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                
                {/* Delete button - visible on hover */}
                <button 
                  onClick={() => removeItem(i)}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center justify-center text-red-500 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Empty state */}
          {items.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No items in inventory</p>
            </div>
          )}
        </div>
        
        {/* Footer with dynamic totals */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-t ...">
          <span className="text-xs ...">{totalItems} items • Est. {totalWeight.toLocaleString()} lbs</span>
          <span className="text-xs text-primary font-medium ...">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live sharing
          </span>
        </div>
      </div>
    </div>
  );
}
```

---

## Visual Preview

**Trudy Video Feed:**
```text
┌─────────────────────────────────────┐
│                                     │
│      ┌───────────────────┐          │
│      │                   │          │
│      │  [Professional    │          │
│      │   woman photo     │          │
│      │   with headset]   │          │
│      │                   │          │
│      └───────────────────┘          │
│                                     │
│      Trudy Martinez                 │
│   Senior Moving Specialist          │
│      ● Speaking...                  │
│                                     │
└─────────────────────────────────────┘
```

**Interactive Inventory Modal:**
```text
┌────────────────────────────────────────────────────────┐
│ ● ● ●    Customer's Screen - My Move Inventory         │
├────────────────────────────────────────────────────────┤
│                                                        │
│ [img] 3-Cushion Sofa     Living Room   [-] 1 [+]  [×] │
│ [img] 55" Plasma TV      Living Room   [-] 1 [+]  [×] │
│ [img] Armchair           Living Room   [-] 2 [+]  [×] │
│ [img] Queen Bed          Bedroom       [-] 1 [+]  [×] │
│ [img] Medium Box         General       [-] 8 [+]  [×] │
│                                                        │
├────────────────────────────────────────────────────────┤
│ 19 items • Est. 1,890 lbs           🟢 Live sharing    │
└────────────────────────────────────────────────────────┘
```

---

## Files Changed

| File | Change |
|------|--------|
| `src/pages/Book.tsx` | Update `FakeAgentView` with professional photo, make `InventoryShareModal` interactive with quantity controls |

---

## Testing Checklist

1. Navigate to /book and enter "demo"
2. Verify Trudy shows as a professional woman employee (realistic photo)
3. Click "Share Screen" to open inventory modal
4. Click +/- buttons on items and verify quantities update
5. Verify totals recalculate dynamically
6. Hover over items and verify delete button appears
7. Delete an item and verify it disappears
8. Delete all items and verify empty state appears
9. Test in both light and dark mode

