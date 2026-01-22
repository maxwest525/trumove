import { useState, useMemo, useRef } from "react";
import { 
  Plus, 
  Minus, 
  Search, 
  X, 
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
  Trash2,
  ShieldCheck,
  Lamp,
  Armchair,
  Music,
  Snowflake,
  BookOpen,
  Archive,
  Table,
  Coffee,
  Utensils,
  Monitor,
  FileBox,
  Hammer,
  Package,
  Bath,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Scale,
  type LucideIcon
} from "lucide-react";
import { ROOM_SUGGESTIONS, type InventoryItem, type ItemDefinition } from "@/lib/priceCalculator";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CustomItemModal } from "./CustomItemModal";
import { InventoryItemImage } from "./InventoryItemImage";

interface InventoryBuilderProps {
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  inventoryItems?: InventoryItem[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onClearAll?: () => void;
  specialHandling?: boolean;
  onSpecialHandlingChange?: (value: boolean) => void;
  isLocked?: boolean;
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

// Icon mapping for inventory items based on item name keywords
const getItemIcon = (itemName: string, roomId: string): LucideIcon => {
  const name = itemName.toLowerCase();
  
  // Specific item keywords - Seating
  if (name.includes('sofa') || name.includes('couch') || name.includes('loveseat') || name.includes('sectional')) return Sofa;
  if (name.includes('armchair') || name.includes('recliner') || name.includes('rocker') || name.includes('overstuffed')) return Armchair;
  
  // Beds
  if (name.includes('bed') || name.includes('mattress') || name.includes('bunk')) return Bed;
  
  // Entertainment & Electronics
  if (name.includes('tv') || name.includes('television') || name.includes('entertainment') || name.includes('stereo')) return Tv;
  if (name.includes('computer') || name.includes('monitor') || name.includes('printer') || name.includes('scanner')) return Monitor;
  
  // Lighting
  if (name.includes('lamp') || name.includes('light')) return Lamp;
  
  // Office & Desk
  if (name.includes('desk')) return Laptop;
  if (name.includes('bookcase') || name.includes('bookshelf') || name.includes('shelf')) return BookOpen;
  if (name.includes('file cabinet') || name.includes('credenza')) return FileBox;
  
  // Kitchen & Appliances
  if (name.includes('refrigerator') || name.includes('freezer')) return Snowflake;
  if (name.includes('washer') || name.includes('dryer')) return Archive;
  if (name.includes('microwave') || name.includes('dishwasher') || name.includes('stove') || name.includes('oven') || name.includes('range')) return Utensils;
  if (name.includes('coffee')) return Coffee;
  
  // Musical Instruments
  if (name.includes('piano') || name.includes('organ') || name.includes('keyboard')) return Music;
  
  // Storage & Furniture
  if (name.includes('dresser') || name.includes('chest') || name.includes('wardrobe') || name.includes('armoire')) return Archive;
  if (name.includes('table') || name.includes('nightstand') || name.includes('stand')) return Table;
  if (name.includes('chair')) return Armchair;
  if (name.includes('mirror')) return Monitor;
  
  // Exercise & Sports
  if (name.includes('treadmill') || name.includes('elliptical') || name.includes('weight') || name.includes('gym') || name.includes('bike')) return Dumbbell;
  
  // Baby & Nursery
  if (name.includes('crib') || name.includes('changing') || name.includes('highchair') || name.includes('stroller') || name.includes('playpen')) return Baby;
  
  // Outdoor & Patio
  if (name.includes('grill') || name.includes('patio') || name.includes('outdoor') || name.includes('umbrella') || name.includes('lawn')) return TreePine;
  
  // Garage & Tools
  if (name.includes('tool') || name.includes('workbench') || name.includes('mower') || name.includes('ladder')) return Hammer;
  
  // Boxes & Packaging
  if (name.includes('box') || name.includes('carton')) return Package;
  
  // Bathroom
  if (name.includes('bath') || name.includes('hamper') || name.includes('medicine')) return Bath;
  
  // Fallback to room-based icon
  const roomConfig = ROOM_CONFIG.find(r => r.id === roomId);
  return roomConfig?.icon || Box;
};

const ITEMS_PER_PAGE_OPTIONS = [9, 12, 18, 24];

export default function InventoryBuilder({ 
  onAddItem, 
  inventoryItems = [], 
  onUpdateQuantity,
  onClearAll,
  specialHandling = false,
  onSpecialHandlingChange,
  isLocked = false
}: InventoryBuilderProps) {
  const [activeRoom, setActiveRoom] = useState('Living Room');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [recentlyUpdated, setRecentlyUpdated] = useState<string | null>(null);
  const prevTotalRef = useRef(0);

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
  
  // Pagination
  const totalPages = Math.ceil(suggestions.length / itemsPerPage);
  const paginatedSuggestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return suggestions.slice(start, start + itemsPerPage);
  }, [suggestions, currentPage, itemsPerPage]);

  // Reset page when room changes
  const handleRoomChange = (roomId: string) => {
    setActiveRoom(roomId);
    setCurrentPage(1);
  };

  const getItemQuantity = (itemName: string, room: string) => {
    const key = `${room}-${itemName}`;
    return itemQuantities[key] || 0;
  };

  const handleQuantityChange = (item: { name: string; defaultWeight: number; cubicFeet?: number }, room: string, delta: number) => {
    const key = `${room}-${item.name}`;
    const currentQty = itemQuantities[key] || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    setItemQuantities(prev => ({ ...prev, [key]: newQty }));
    
    // Trigger animation
    if (delta > 0) {
      setRecentlyUpdated(key);
      setTimeout(() => setRecentlyUpdated(null), 300);
    }
    
    if (delta > 0) {
      // Adding item
      onAddItem({
        name: item.name,
        room: room,
        quantity: 1,
        weightEach: item.defaultWeight,
        cubicFeet: item.cubicFeet,
        specialHandling: specialHandling,
      });
    } else if (delta < 0 && onUpdateQuantity) {
      // Removing item - find matching item in inventoryItems and update/remove
      const matchingItem = inventoryItems.find(
        inv => inv.name === item.name && inv.room === room
      );
      if (matchingItem) {
        if (matchingItem.quantity <= 1) {
          // Remove the item entirely if quantity would go to 0
          onUpdateQuantity(matchingItem.id, 0);
        } else {
          // Decrease quantity by 1
          onUpdateQuantity(matchingItem.id, matchingItem.quantity - 1);
        }
      }
    }
  };

  const handleAddCustomItem = (customItem: {
    name: string;
    room: string;
    weight: number;
    cubicFeet: number;
    quantity: number;
    fragile: boolean;
  }) => {
    const key = `${customItem.room}-${customItem.name}`;
    setItemQuantities(prev => ({ ...prev, [key]: (prev[key] || 0) + customItem.quantity }));
    setRecentlyUpdated(key);
    setTimeout(() => setRecentlyUpdated(null), 300);
    
    onAddItem({
      name: customItem.name,
      room: customItem.room,
      quantity: customItem.quantity,
      weightEach: customItem.weight,
      cubicFeet: customItem.cubicFeet,
      specialHandling: customItem.fragile,
    });
  };

  const handleClearAll = () => {
    setItemQuantities({});
    onClearAll?.();
  };

  const totalItems = Object.values(itemQuantities).reduce((sum, qty) => sum + qty, 0);
  
  // Calculate total weight for floating summary
  const totalWeight = useMemo(() => {
    let weight = 0;
    for (const [key, qty] of Object.entries(itemQuantities)) {
      if (qty <= 0) continue;
      const [room, ...nameParts] = key.split('-');
      const itemName = nameParts.join('-');
      const roomItems = ROOM_SUGGESTIONS[room] || [];
      const item = roomItems.find(i => i.name === itemName);
      if (item) {
        weight += item.defaultWeight * qty;
      }
    }
    return weight;
  }, [itemQuantities]);

  return (
    <div className="flex gap-4 min-h-[400px]">
      {/* Left Sidebar - Room Navigation */}
      <div className="w-44 flex-shrink-0 space-y-1">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">
            My Inventory
          </div>
          {totalItems > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
        {ROOM_CONFIG.map((room) => {
          const Icon = room.icon;
          const count = roomCounts[room.id] || 0;
          const isActive = activeRoom === room.id;
          
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => handleRoomChange(room.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all",
                isActive 
                  ? "border-2 border-primary bg-primary/5 text-foreground shadow-sm" 
                  : "border-2 border-transparent hover:bg-muted/60 text-foreground/70 hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-semibold truncate flex-1">{room.label}</span>
              {count > 0 && (
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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
        {/* Search Bar & Special Handling Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
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
          
          {/* Special Handling Toggle */}
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
            specialHandling 
              ? "border-amber-500/50 bg-amber-500/10" 
              : "border-border/60 bg-card"
          )}>
            <ShieldCheck className={cn(
              "w-4 h-4",
              specialHandling ? "text-amber-600" : "text-muted-foreground"
            )} />
            <Label 
              htmlFor="special-handling" 
              className={cn(
                "text-xs font-semibold cursor-pointer whitespace-nowrap",
                specialHandling ? "text-amber-700" : "text-muted-foreground"
              )}
            >
              Fragile Items
            </Label>
            <Switch
              id="special-handling"
              checked={specialHandling}
              onCheckedChange={onSpecialHandlingChange}
              className="ml-1 scale-90"
            />
          </div>
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
                  icon={getItemIcon(item.name, item.room)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Room Section Header with View Controls */}
        {!searchQuery && (
          <>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 flex-1">
                <div className="h-px flex-1 bg-border/40" />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">
                  {activeRoom}
                </span>
                <div className="h-px flex-1 bg-border/40" />
              </div>
              
              {/* View Toggle & Items Per Page */}
              <div className="flex items-center gap-2 ml-3">
                {/* View Mode Toggle */}
                <div className="flex rounded-lg border border-border/60 bg-muted/30 p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-1.5 rounded-md transition-all",
                      viewMode === 'grid' 
                        ? "border border-primary bg-card text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-1.5 rounded-md transition-all",
                      viewMode === 'list' 
                        ? "border border-primary bg-card text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {/* Items Per Page Selector */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-7 px-2 text-[10px] font-semibold rounded-md border border-border/60 bg-muted/30 text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map(num => (
                    <option key={num} value={num}>{num} items</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Item Grid/List - Only show active room items */}
            {suggestions.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-3 gap-3">
                    {paginatedSuggestions.map((item) => {
                      const key = `${activeRoom}-${item.name}`;
                      return (
                        <ItemCard
                          key={item.name}
                          item={item}
                          room={activeRoom}
                          quantity={getItemQuantity(item.name, activeRoom)}
                          onAdd={() => handleQuantityChange(item, activeRoom, 1)}
                          onRemove={() => handleQuantityChange(item, activeRoom, -1)}
                          icon={getItemIcon(item.name, activeRoom)}
                          isAnimating={recentlyUpdated === key}
                        />
                      );
                    })}
                    
                    {/* Add Custom Item Card - only on last page or if less than itemsPerPage */}
                    {currentPage === totalPages && (
                      <button
                        type="button"
                        onClick={() => setCustomModalOpen(true)}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all min-h-[120px] text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="w-6 h-6" />
                        <span className="text-xs font-semibold text-center">Add Custom</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {paginatedSuggestions.map((item) => {
                      const key = `${activeRoom}-${item.name}`;
                      return (
                        <ItemListRow
                          key={item.name}
                          item={item}
                          room={activeRoom}
                          quantity={getItemQuantity(item.name, activeRoom)}
                          onAdd={() => handleQuantityChange(item, activeRoom, 1)}
                          onRemove={() => handleQuantityChange(item, activeRoom, -1)}
                          icon={getItemIcon(item.name, activeRoom)}
                          isAnimating={recentlyUpdated === key}
                        />
                      );
                    })}
                    
                    {/* Add Custom Item Row - only on last page */}
                    {currentPage === totalPages && (
                      <button
                        type="button"
                        onClick={() => setCustomModalOpen(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-sm font-semibold">Add Custom Item</span>
                      </button>
                    )}
                  </div>
                )}
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={cn(
                        "p-1.5 rounded-lg transition-all",
                        currentPage === 1 
                          ? "text-muted-foreground/40 cursor-not-allowed" 
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "w-7 h-7 rounded-lg text-xs font-semibold transition-all",
                            page === currentPage 
                              ? "border-2 border-primary bg-primary/10 text-primary" 
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={cn(
                        "p-1.5 rounded-lg transition-all",
                        currentPage === totalPages 
                          ? "text-muted-foreground/40 cursor-not-allowed" 
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Package className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">No items in this room</p>
                <p className="text-xs mt-1">Try searching or select another room</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Inventory Summary */}
      {totalItems > 0 && (
        <div className="tru-inventory-float-summary">
          <Package className="w-4 h-4 summary-icon" />
          <span className="summary-count">{totalItems} items</span>
          <span className="text-muted-foreground">•</span>
          <Scale className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="summary-weight">~{totalWeight.toLocaleString()} lbs</span>
        </div>
      )}

      {/* Custom Item Modal */}
      <CustomItemModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onAdd={handleAddCustomItem}
        defaultRoom={activeRoom}
      />
    </div>
  );
}

// Item Card Component
interface ItemCardProps {
  item: ItemDefinition;
  room: string;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  showRoom?: boolean;
  icon: LucideIcon;
  isAnimating?: boolean;
}

function ItemCard({ item, room, quantity, onAdd, onRemove, showRoom, icon: Icon, isAnimating }: ItemCardProps) {
  return (
    <div className={cn(
      "group flex flex-col p-3 rounded-xl border transition-all",
      quantity > 0 
        ? "border-primary/40 bg-primary/5 shadow-sm" 
        : "border-border/60 bg-card hover:border-primary/20",
      isAnimating && "tru-item-just-added"
    )}>
      {/* Item Image or Icon - with hover zoom */}
      <div className={cn(
        "w-full h-48 rounded-lg flex items-center justify-center mb-2 overflow-hidden",
        quantity > 0 ? "bg-muted/40" : "bg-muted/30"
      )}>
        <div className="transition-transform duration-300 ease-out group-hover:scale-110">
          <InventoryItemImage
            src={item.imageUrl}
            alt={item.name}
            fallbackIcon={Icon}
            className="w-[180px] h-[180px]"
            iconClassName={cn(
              "!w-16 !h-16",
              quantity > 0 ? "text-primary" : "text-muted-foreground/60"
            )}
          />
        </div>
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
          quantity > 0 ? "text-foreground" : "text-muted-foreground"
        )}>
          {quantity}
        </span>
        
        <button
          type="button"
          onClick={onAdd}
          className="w-7 h-7 rounded-full border-2 border-primary bg-card text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// List Row Component for List View
interface ItemListRowProps {
  item: ItemDefinition;
  room: string;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  icon: LucideIcon;
  isAnimating?: boolean;
}

function ItemListRow({ item, quantity, onAdd, onRemove, icon: Icon, isAnimating }: ItemListRowProps) {
  return (
    <div className={cn(
      "group flex items-center gap-3 p-3 rounded-xl border transition-all",
      quantity > 0 
        ? "border-primary/40 bg-primary/5 shadow-sm" 
        : "border-border/60 bg-card hover:border-primary/20",
      isAnimating && "tru-item-just-added"
    )}>
      {/* Item Image or Icon - with hover zoom */}
      <div className={cn(
        "w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden",
        quantity > 0 ? "bg-primary/10" : "bg-muted/40"
      )}>
        <div className="transition-transform duration-300 ease-out group-hover:scale-110">
          <InventoryItemImage
            src={item.imageUrl}
            alt={item.name}
            fallbackIcon={Icon}
            className="w-[72px] h-[72px]"
            iconClassName={cn(
              "!w-10 !h-10",
              quantity > 0 ? "text-primary" : "text-muted-foreground/60"
            )}
          />
        </div>
      </div>
      
      {/* Item Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {item.name}
        </p>
        <p className="text-[10px] text-muted-foreground">
          ~{item.cubicFeet || Math.ceil(item.defaultWeight / 7)} cu.ft • {item.defaultWeight} lbs
        </p>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
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
          "w-6 text-center text-sm font-bold tabular-nums",
          quantity > 0 ? "text-primary" : "text-muted-foreground"
        )}>
          {quantity}
        </span>
        
        <button
          type="button"
          onClick={onAdd}
          className="w-7 h-7 rounded-full border-2 border-primary/40 bg-card text-primary flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
