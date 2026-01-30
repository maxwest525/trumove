

# Enhance Video Consult Demo - Full InventoryBuilder in Screen Share Modal

## Overview
Replace the simple list-based screen share modal with a full InventoryBuilder-style interface matching the manual builder exactly. This makes the demo look like a real collaborative inventory editing session.

---

## Current State vs Target

| Component | Current | Target |
|-----------|---------|--------|
| Screen Share Modal | Simple list of items with +/- controls | Full InventoryBuilder layout with room sidebar |
| Item Display | List rows with thumbnails | 4-column grid with ItemCards |
| Room Navigation | None | Left sidebar with room pills and counts |
| View Toggle | None | Grid/List toggle |

---

## Changes Required

### File: `src/pages/Book.tsx`

#### 1. Add Required Imports

Add missing icons for room navigation:

```tsx
import { 
  // Existing imports...
  Sofa, 
  Bed, 
  UtensilsCrossed, 
  Tv, 
  Box, 
  Dumbbell, 
  TreePine, 
  Wrench, 
  Baby, 
  Laptop,
  LayoutGrid,
  List
} from "lucide-react";
```

#### 2. Add Room Configuration and Item Data

Add the same room config used by InventoryBuilder:

```tsx
const ROOM_CONFIG_DEMO = [
  { id: 'Living Room', label: 'Living Room', icon: Sofa },
  { id: 'Bedroom', label: 'Bedroom', icon: Bed },
  { id: 'Kitchen', label: 'Kitchen', icon: UtensilsCrossed },
  { id: 'Dining Room', label: 'Dining', icon: UtensilsCrossed },
  { id: 'Office', label: 'Office', icon: Laptop },
  { id: 'Garage', label: 'Garage', icon: Wrench },
];

const inventoryItemsByRoom = {
  'Living Room': [
    { name: "3-Cushion Sofa", weight: 180, image: "/inventory/living-room/sofa-3-cushion.png" },
    { name: "55\" Plasma TV", weight: 65, image: "/inventory/living-room/tv-plasma.png" },
    { name: "Armchair", weight: 85, image: "/inventory/living-room/armchair.png" },
    { name: "Coffee Table", weight: 45, image: "/inventory/living-room/coffee-table.png" },
    { name: "End Table", weight: 25, image: "/inventory/living-room/end-table.png" },
    { name: "Bookcase, Medium", weight: 80, image: "/inventory/living-room/bookcase-medium.png" },
    { name: "TV Stand", weight: 50, image: "/inventory/living-room/tv-stand.png" },
    { name: "Floor Lamp", weight: 15, image: "/inventory/living-room/lamp-floor.png" },
  ],
  'Bedroom': [
    { name: "Queen Bed", weight: 150, image: "/inventory/bedroom/bed-queen.png" },
    { name: "Dresser", weight: 120, image: "/inventory/bedroom/dresser.png" },
    { name: "Nightstand", weight: 35, image: "/inventory/bedroom/nightstand.png" },
    { name: "Chest of Drawers", weight: 90, image: "/inventory/bedroom/chest-of-drawers.png" },
    { name: "Wardrobe", weight: 150, image: "/inventory/bedroom/wardrobe.png" },
    { name: "Vanity Dresser", weight: 80, image: "/inventory/bedroom/dresser-vanity.png" },
  ],
  'Kitchen': [
    { name: "Refrigerator", weight: 250, image: "/inventory/appliances/refrigerator.png" },
    { name: "Kitchen Table", weight: 60, image: "/inventory/kitchen/kitchen-table.png" },
    { name: "Kitchen Chair", weight: 15, image: "/inventory/kitchen/kitchen-chair.png" },
    { name: "Microwave", weight: 40, image: "/inventory/appliances/microwave.png" },
    { name: "Bar Stool", weight: 20, image: "/inventory/kitchen/bar-stool.png" },
  ],
  // ... more rooms
};
```

#### 3. Replace InventoryShareModal with Full Layout

The new modal will have:

```tsx
function InventoryShareModal({ onClose }: { onClose: () => void }) {
  const [activeRoom, setActiveRoom] = useState('Living Room');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'Living Room-3-Cushion Sofa': 1,
    'Living Room-55" Plasma TV': 1,
    'Living Room-Armchair': 2,
    'Living Room-Coffee Table': 1,
    'Bedroom-Queen Bed': 1,
    'Bedroom-Dresser': 1,
    'Bedroom-Nightstand': 2,
    'Kitchen-Refrigerator': 1,
  });

  const updateQuantity = (room: string, itemName: string, delta: number) => {
    const key = `${room}-${itemName}`;
    setQuantities(prev => {
      const newQty = Math.max(0, (prev[key] || 0) + delta);
      if (newQty === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: newQty };
    });
  };

  const getRoomCount = (roomId: string) => {
    return Object.entries(quantities)
      .filter(([key]) => key.startsWith(`${roomId}-`))
      .reduce((sum, [, qty]) => sum + qty, 0);
  };

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalWeight = Object.entries(quantities).reduce((sum, [key, qty]) => {
    const [room, ...nameParts] = key.split('-');
    const itemName = nameParts.join('-');
    const item = inventoryItemsByRoom[room]?.find(i => i.name === itemName);
    return sum + (item?.weight || 0) * qty;
  }, 0);

  const roomItems = inventoryItemsByRoom[activeRoom] || [];

  return (
    <div className="absolute inset-4 flex items-center justify-center z-10">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-600">
        {/* Window Chrome */}
        <div className="px-4 py-3 bg-slate-100 dark:bg-slate-700 flex items-center gap-2 border-b">
          <div className="flex gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-medium">Customer's Screen - My Move Inventory</span>
          </div>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/20 text-primary flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live
          </span>
        </div>
        
        {/* Main Content - Sidebar + Grid */}
        <div className="flex h-[360px]">
          {/* Left Sidebar - Room Navigation */}
          <div className="w-36 border-r border-slate-200 dark:border-slate-600 p-3 space-y-1 bg-slate-50 dark:bg-slate-800/50">
            <div className="text-[10px] font-black tracking-wider uppercase text-slate-400 mb-2 px-2">
              Rooms
            </div>
            {ROOM_CONFIG_DEMO.map((room) => {
              const Icon = room.icon;
              const count = getRoomCount(room.id);
              const isActive = activeRoom === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-xs font-semibold transition-all",
                    isActive 
                      ? "border-2 border-primary bg-primary/10 text-foreground" 
                      : "border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate flex-1">{room.label}</span>
                  {count > 0 && (
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                      isActive ? "bg-foreground text-background" : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Content - Item Grid */}
          <div className="flex-1 flex flex-col">
            {/* View Toggle Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{activeRoom}</span>
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    viewMode === 'grid' 
                      ? "bg-primary/20 text-primary" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    viewMode === 'list' 
                      ? "bg-primary/20 text-primary" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Item Grid */}
            <div className="flex-1 p-3 overflow-y-auto">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-4 gap-2">
                  {roomItems.map((item) => {
                    const qty = quantities[`${activeRoom}-${item.name}`] || 0;
                    return (
                      <div 
                        key={item.name}
                        className={cn(
                          "flex flex-col items-center p-2 rounded-xl border-2 transition-all",
                          qty > 0 
                            ? "border-primary/40 bg-primary/5" 
                            : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                        )}
                      >
                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-1 border border-slate-100">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
                        </div>
                        <span className="text-[10px] font-medium text-center line-clamp-2 h-7 text-slate-700 dark:text-slate-200">{item.name}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <button
                            onClick={() => updateQuantity(activeRoom, item.name, -1)}
                            disabled={qty === 0}
                            className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 disabled:opacity-30"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold">{qty}</span>
                          <button
                            onClick={() => updateQuantity(activeRoom, item.name, 1)}
                            className="w-5 h-5 rounded flex items-center justify-center bg-primary/20 hover:bg-primary/30 text-primary"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* List view - same style as before */
              )}
            </div>
          </div>
        </div>

        {/* Footer with Totals */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-t flex items-center justify-between">
          <span className="text-xs text-slate-500">{totalItems} items • Est. {totalWeight.toLocaleString()} lbs</span>
          <span className="text-xs text-primary font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live sharing with Trudy
          </span>
        </div>
      </div>
    </div>
  );
}
```

---

## Visual Layout

```text
┌────────────────────────────────────────────────────────────────┐
│ ● ● ●   Customer's Screen - My Move Inventory         ● Live │
├────────────────────────────────────────────────────────────────┤
│ ROOMS          │  LIVING ROOM                      ▤ ▥        │
│ □ Living Room 4│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│ □ Bedroom    3 │ │ [img]│ │ [img]│ │ [img]│ │ [img]│          │
│ □ Kitchen    1 │ │ Sofa │ │  TV  │ │Chair │ │Table │          │
│ □ Dining     0 │ │  1   │ │  1   │ │  2   │ │  1   │          │
│ □ Office     0 │ │ - + │ │ - + │ │ - + │ │ - + │          │
│ □ Garage     0 │ └──────┘ └──────┘ └──────┘ └──────┘          │
│                │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│                │ │ [img]│ │ [img]│ │ [img]│ │ [img]│          │
│                │ │EndTbl│ │ Book │ │TVStnd│ │ Lamp │          │
│                │ │  0   │ │  0   │ │  0   │ │  0   │          │
│                │ │ - + │ │ - + │ │ - + │ │ - + │          │
│                │ └──────┘ └──────┘ └──────┘ └──────┘          │
├────────────────────────────────────────────────────────────────┤
│ 10 items • Est. 1,250 lbs           ● Live sharing with Trudy │
└────────────────────────────────────────────────────────────────┘
```

---

## Summary

| Change | Description |
|--------|-------------|
| Add room icons | Import Sofa, Bed, UtensilsCrossed, Tv, Laptop, Wrench, LayoutGrid, List |
| Add room config | Same structure as InventoryBuilder |
| Add item data by room | Items organized by room with images |
| Replace modal layout | Full sidebar + grid layout matching InventoryBuilder |
| Add view toggle | Grid/List switch in header |
| Add room counts | Badge on each room showing item count |
| Update footer | "Live sharing with Trudy" message |

---

## Technical Details

### Files Modified
| File | Changes |
|------|---------|
| `src/pages/Book.tsx` | Complete overhaul of InventoryShareModal |

### Key Features
- Room sidebar with icon + label + count badge
- 4-column item grid with images
- +/- quantity controls on each card
- Active room highlighting
- Grid/List view toggle
- Dynamic totals in footer
- "Live" indicator badge

