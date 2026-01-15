import { useState, useMemo } from "react";
import { Plus, Search, X } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [customRoom, setCustomRoom] = useState('Living Room');
  const [customQty, setCustomQty] = useState(1);
  const [customWeight, setCustomWeight] = useState<number | ''>('');

  // Get all items for search with room info
  const allItemsWithRoom = useMemo(() => {
    const result: Array<{ name: string; cubicFeet: number; defaultWeight: number; room: string }> = [];
    for (const [room, items] of Object.entries(ROOM_SUGGESTIONS)) {
      for (const item of items) {
        result.push({ ...item, room });
      }
    }
    return result;
  }, []);

  // Filter items based on search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allItemsWithRoom
      .filter(item => item.name.toLowerCase().includes(query))
      .slice(0, 12);
  }, [searchQuery, allItemsWithRoom]);

  const suggestions = ROOM_SUGGESTIONS[activeRoom] || [];

  const handleQuickAdd = (item: { name: string; defaultWeight: number; cubicFeet?: number }, room?: string) => {
    onAddItem({
      name: item.name,
      room: room || activeRoom,
      quantity: 1,
      weightEach: item.defaultWeight,
      cubicFeet: item.cubicFeet,
    });
    setSearchQuery('');
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
      {/* Search Bar */}
      <div>
        <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-3">
          Search all items
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sofas, beds, appliances..."
            className="w-full h-12 pl-11 pr-11 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-3 p-3 rounded-xl border border-border/60 bg-muted/30">
            <div className="text-[9px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-2">
              {searchResults.length} results
            </div>
            <div className="flex flex-wrap gap-2">
              {searchResults.map((item) => (
                <button
                  key={`${item.room}-${item.name}`}
                  type="button"
                  onClick={() => handleQuickAdd(item, item.room)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-card hover:bg-muted/50 text-sm font-semibold text-foreground/80 hover:text-foreground transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  <span>{item.name}</span>
                  <span className="text-[10px] text-muted-foreground">({item.room})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

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
      <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
        {suggestions.slice(0, 20).map((item) => (
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
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Qty</label>
            <input
              type="number"
              min={1}
              value={customQty}
              onChange={(e) => setCustomQty(parseInt(e.target.value) || 1)}
              className="w-16 h-11 px-3 rounded-xl border border-border/60 bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-center"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Lbs (approx)</label>
            <input
              type="number"
              min={1}
              value={customWeight}
              onChange={(e) => setCustomWeight(e.target.value ? parseInt(e.target.value) : '')}
              placeholder="50"
              className="w-20 h-11 px-3 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-center"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleCustomAdd}
          disabled={!customName.trim()}
          className="mt-3 h-10 px-5 rounded-xl bg-foreground text-background text-xs font-bold tracking-wide uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          Add Custom Item
        </button>
      </div>
    </div>
  );
}