import { useState, useMemo } from "react";
import { Plus, Minus, Search, X, Sofa, Bed, UtensilsCrossed, Tv, Box, Dumbbell, TreePine, Wrench, Baby, Laptop } from "lucide-react";
import { ROOM_SUGGESTIONS, type InventoryItem } from "@/lib/priceCalculator";
import { cn } from "@/lib/utils";

interface InventoryBuilderProps {
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  inventoryItems?: InventoryItem[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
}

const ROOM_CONFIG = [
  { id: 'Living Room', label: 'Living Room', icon: Sofa },
  { id: 'Bedroom', label: 'Bedroom', icon: Bed },
  { id: 'Dining Room', label: 'Dining Room', icon: UtensilsCrossed },
  { id: 'Kitchen', label: 'Kitchen', icon: UtensilsCrossed },
  { id: 'Appliances', label: 'Appliances', icon: Tv },
  { id: 'Office', label: 'Office', icon: Laptop },
  { id: 'Nursery', label: 'Nursery', icon: Baby },
  { id: 'Patio & Outdoor', label: 'Outdoor', icon: TreePine },
  { id: 'Garage', label: 'Garage', icon: Wrench },
  { id: 'Exercise & Sports', label: 'Exercise', icon: Dumbbell },
  { id: 'Boxes & Cartons', label: 'Boxes', icon: Box },
];

export default function InventoryBuilder({ onAddItem, inventoryItems = [], onUpdateQuantity }: InventoryBuilderProps) {
  const [activeRoom, setActiveRoom] = useState('Living Room');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

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

  // Get room item counts from actual inventory
  const roomCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of inventoryItems) {
      counts[item.room] = (counts[item.room] || 0) + item.quantity;
    }
    return counts;
  }, [inventoryItems]);

  const suggestions = ROOM_SUGGESTIONS[activeRoom] || [];

  const getItemQuantity = (itemName: string, room: string) => {
    const key = `${room}-${itemName}`;
    return itemQuantities[key] || 0;
  };

  const handleQuantityChange = (item: { name: string; defaultWeight: number; cubicFeet?: number }, room: string, delta: number) => {
    const key = `${room}-${item.name}`;
    const currentQty = itemQuantities[key] || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    setItemQuantities(prev => ({ ...prev, [key]: newQty }));
    
    if (delta > 0) {
      onAddItem({
        name: item.name,
        room: room,
        quantity: 1,
        weightEach: item.defaultWeight,
        cubicFeet: item.cubicFeet,
      });
    }
  };

  return (
    <div className="flex gap-4 min-h-[400px]">
      {/* Left Sidebar - Room Navigation */}
      <div className="w-44 flex-shrink-0 space-y-1">
        <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-3 px-2">
          My Inventory
        </div>
        {ROOM_CONFIG.map((room) => {
          const Icon = room.icon;
          const count = roomCounts[room.id] || 0;
          const isActive = activeRoom === room.id;
          
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => setActiveRoom(room.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted/60 text-foreground/70 hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-semibold truncate flex-1">{room.label}</span>
              {count > 0 && (
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Content - Item Grid */}
      <div className="flex-1 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all items..."
            className="w-full h-10 pl-10 pr-10 rounded-lg border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="p-3 rounded-xl border border-border/60 bg-muted/30">
            <div className="text-[9px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-2">
              {searchResults.length} results
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {searchResults.map((item) => (
                <ItemCard
                  key={`${item.room}-${item.name}`}
                  item={item}
                  room={item.room}
                  quantity={getItemQuantity(item.name, item.room)}
                  onAdd={() => handleQuantityChange(item, item.room, 1)}
                  onRemove={() => handleQuantityChange(item, item.room, -1)}
                  showRoom
                />
              ))}
            </div>
          </div>
        )}

        {/* Room Section Header */}
        {!searchQuery && (
          <>
            <div className="flex items-center gap-2 px-1">
              <div className="h-px flex-1 bg-border/40" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">
                {activeRoom} Items
              </span>
              <div className="h-px flex-1 bg-border/40" />
            </div>

            {/* Item Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {suggestions.slice(0, 16).map((item) => (
                <ItemCard
                  key={item.name}
                  item={item}
                  room={activeRoom}
                  quantity={getItemQuantity(item.name, activeRoom)}
                  onAdd={() => handleQuantityChange(item, activeRoom, 1)}
                  onRemove={() => handleQuantityChange(item, activeRoom, -1)}
                />
              ))}
              
              {/* Add Custom Item Card */}
              <button
                type="button"
                onClick={() => {/* TODO: Open custom item modal */}}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all min-h-[120px] text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs font-semibold text-center">Add Custom Item</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Item Card Component
interface ItemCardProps {
  item: { name: string; defaultWeight: number; cubicFeet?: number };
  room: string;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  showRoom?: boolean;
}

function ItemCard({ item, room, quantity, onAdd, onRemove, showRoom }: ItemCardProps) {
  return (
    <div className={cn(
      "flex flex-col p-3 rounded-xl border transition-all",
      quantity > 0 
        ? "border-primary/40 bg-primary/5 shadow-sm" 
        : "border-border/60 bg-card hover:border-primary/20"
    )}>
      {/* Item Icon Placeholder */}
      <div className="w-full h-14 rounded-lg bg-muted/40 flex items-center justify-center mb-2">
        <Box className="w-6 h-6 text-muted-foreground/50" />
      </div>
      
      {/* Item Name */}
      <div className="flex-1 min-h-[40px]">
        <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
          {item.name}
        </p>
        {showRoom && (
          <p className="text-[10px] text-muted-foreground mt-0.5">{room}</p>
        )}
        <p className="text-[10px] text-muted-foreground mt-0.5">
          ~{item.cubicFeet || Math.ceil(item.defaultWeight / 7)} cu.ft
        </p>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
        <button
          type="button"
          onClick={onRemove}
          disabled={quantity === 0}
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center transition-all",
            quantity > 0 
              ? "bg-muted hover:bg-muted-foreground/20 text-foreground" 
              : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
          )}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        
        <span className={cn(
          "text-sm font-bold tabular-nums",
          quantity > 0 ? "text-primary" : "text-muted-foreground"
        )}>
          {quantity}
        </span>
        
        <button
          type="button"
          onClick={onAdd}
          className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
