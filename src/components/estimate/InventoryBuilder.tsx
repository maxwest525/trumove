import { useState } from "react";
import { Plus } from "lucide-react";
import { ROOM_SUGGESTIONS, type InventoryItem } from "@/lib/priceCalculator";

interface InventoryBuilderProps {
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
}

const ROOMS = [
  'Living Room', 
  'Dining Room', 
  'Bedroom', 
  'Kitchen', 
  'Appliances', 
  'Office', 
  'Nursery', 
  'Patio & Outdoor', 
  'Garage', 
  'Exercise & Sports', 
  'Electronics', 
  'Boxes & Cartons', 
  'Miscellaneous'
];

export default function InventoryBuilder({ onAddItem }: InventoryBuilderProps) {
  const [activeRoom, setActiveRoom] = useState('Living Room');
  const [customName, setCustomName] = useState('');
  const [customRoom, setCustomRoom] = useState('Living Room');
  const [customQty, setCustomQty] = useState(1);
  const [customWeight, setCustomWeight] = useState<number | ''>('');

  const suggestions = ROOM_SUGGESTIONS[activeRoom] || [];

  const handleQuickAdd = (item: { name: string; defaultWeight: number }) => {
    onAddItem({
      name: item.name,
      room: activeRoom,
      quantity: 1,
      weightEach: item.defaultWeight,
    });
  };

  const handleCustomAdd = () => {
    if (!customName.trim()) return;
    onAddItem({
      name: customName.trim(),
      room: customRoom,
      quantity: customQty,
      weightEach: typeof customWeight === 'number' ? customWeight : 50,
    });
    setCustomName('');
    setCustomQty(1);
    setCustomWeight('');
  };

  return (
    <div className="space-y-6">
      {/* Room Tabs */}
      <div>
        <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-3">
          Quick add by room
        </div>
        <div className="flex flex-wrap gap-2">
          {ROOMS.map((room) => (
            <button
              key={room}
              type="button"
              onClick={() => setActiveRoom(room)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-150
                ${activeRoom === room 
                  ? 'bg-primary text-primary-foreground shadow-[0_0_0_4px_hsl(var(--primary)/0.18)]' 
                  : 'bg-muted/60 text-foreground/70 hover:bg-muted hover:text-foreground'
                }`}
            >
              {room}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Add Suggestions */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => handleQuickAdd(item)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-card hover:bg-muted/50 text-sm font-semibold text-foreground/80 hover:text-foreground transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
          >
            <Plus className="w-3.5 h-3.5 text-primary" />
            {item.name}
          </button>
        ))}
      </div>

      {/* Custom Item Form */}
      <div className="pt-4 border-t border-border/40">
        <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-3">
          Or add a custom item
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-3 items-end">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Item name</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Sofa, dining table, TV stand"
              className="w-full h-11 px-3 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Room</label>
            <select
              value={customRoom}
              onChange={(e) => setCustomRoom(e.target.value)}
              className="h-11 px-3 rounded-xl border border-border/60 bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            >
              {ROOMS.map((room) => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Quantity</label>
            <input
              type="number"
              min={1}
              value={customQty}
              onChange={(e) => setCustomQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 h-11 px-3 rounded-xl border border-border/60 bg-card text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Approx lbs each</label>
            <input
              type="number"
              min={1}
              value={customWeight}
              onChange={(e) => setCustomWeight(e.target.value ? parseInt(e.target.value) : '')}
              placeholder="Approx."
              className="w-24 h-11 px-3 rounded-xl border border-border/60 bg-card text-sm font-medium text-center placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleCustomAdd}
          disabled={!customName.trim()}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold tracking-wide uppercase transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Plus className="w-4 h-4" />
          Add Item to Inventory
        </button>
        <p className="mt-2 text-xs text-muted-foreground">
          Weight can be a rough guess. Movers will fine tune it later.
        </p>
      </div>
    </div>
  );
}
