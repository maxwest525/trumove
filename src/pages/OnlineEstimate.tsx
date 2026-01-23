import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Lock } from "lucide-react";
import FloatingInventoryButton from "@/components/estimate/FloatingInventoryButton";
import ChatModal from "@/components/chat/ChatModal";
import SiteShell from "@/components/layout/SiteShell";
import InventoryBuilder from "@/components/estimate/InventoryBuilder";
import InventoryTable from "@/components/estimate/InventoryTable";
import InventoryIntroModal from "@/components/estimate/InventoryIntroModal";
import EstimateWizard, { type ExtendedMoveDetails } from "@/components/estimate/EstimateWizard";
import QuoteSnapshotVertical from "@/components/estimate/QuoteSnapshotVertical";
import QuoteSnapshot from "@/components/estimate/QuoteSnapshot";
import CompactInventoryList from "@/components/estimate/CompactInventoryList";
import { type InventoryItem, type MoveDetails, calculateTotalWeight, calculateTotalCubicFeet, formatCurrency, calculateEstimate, determineMoveType } from "@/lib/priceCalculator";
import { calculateDistance } from "@/lib/distanceCalculator";
import { cn } from "@/lib/utils";

// Helper function to map homepage size values to wizard values
function mapHomeSize(size: string): string {
  const sizeMap: Record<string, string> = {
    'Studio': 'studio',
    '1 Bedroom': '1br',
    '2 Bedroom': '2br',
    '3 Bedroom': '3br',
    '4+ Bedroom': '4br+',
    'Office': '2br',
  };
  return sizeMap[size] || '';
}

export default function OnlineEstimate() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [wizardComplete, setWizardComplete] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [specialHandling, setSpecialHandling] = useState(false);
  const [extendedDetails, setExtendedDetails] = useState<ExtendedMoveDetails | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const inventoryRef = useRef<HTMLDivElement>(null);
  
  const totalCubicFeet = useMemo(() => calculateTotalCubicFeet(items), [items]);

  const scrollToInventory = useCallback(() => {
    inventoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Auto-populate from homepage data stored in localStorage
  useEffect(() => {
    const storedLead = localStorage.getItem("tm_lead");
    if (storedLead && !extendedDetails) {
      try {
        const lead = JSON.parse(storedLead);
        
        // Pre-populate extendedDetails with homepage data
        setExtendedDetails({
          name: '',
          email: lead.email || '',
          phone: lead.phone || '',
          fromLocation: lead.fromCity ? `${lead.fromCity} ${lead.fromZip}` : lead.fromZip || '',
          toLocation: lead.toCity ? `${lead.toCity} ${lead.toZip}` : lead.toZip || '',
          homeSize: mapHomeSize(lead.size) || '',
          toHomeSize: '',
          moveDate: lead.moveDate ? new Date(lead.moveDate) : null,
          fromPropertyType: lead.propertyType || 'house',
          toPropertyType: 'house',
          fromFloor: lead.floor || 1,
          toFloor: 1,
          fromHasElevator: lead.hasElevator || false,
          toHasElevator: false,
          hasVehicleTransport: false,
          needsPackingService: false,
        });
      } catch (e) {
        console.error("Failed to parse stored lead data:", e);
      }
    }
  }, [extendedDetails]);
  
  // Derived move details for pricing
  const moveDetails = useMemo<MoveDetails>(() => {
    if (!extendedDetails) {
      return {
        fromLocation: '',
        toLocation: '',
        distance: 0,
        moveType: 'auto' as const,
        moveDate: '',
        homeSize: '' as MoveDetails['homeSize'],
      };
    }
    
    // Extract ZIP codes for distance calculation
    const fromZip = extendedDetails.fromLocation.match(/\d{5}/)?.[0] || '';
    const toZip = extendedDetails.toLocation.match(/\d{5}/)?.[0] || '';
    const distance = calculateDistance(fromZip, toZip);
    const moveType = determineMoveType(distance);
    
    return {
      fromLocation: extendedDetails.fromLocation,
      toLocation: extendedDetails.toLocation,
      distance,
      moveType,
      moveDate: extendedDetails.moveDate ? format(extendedDetails.moveDate, 'yyyy-MM-dd') : '',
      homeSize: extendedDetails.homeSize as MoveDetails['homeSize'],
    };
  }, [extendedDetails]);

  const handleAddItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: crypto.randomUUID(),
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const handleUpdateItem = useCallback((id: string, updates: Partial<InventoryItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.id !== id));
    } else {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setItems([]);
  }, []);

  const handleWizardComplete = (details: ExtendedMoveDetails) => {
    setExtendedDetails(details);
    setShowIntroModal(true);
  };

  const handleCloseModal = () => {
    setShowIntroModal(false);
    setWizardComplete(true);
  };

  const handleSubmit = () => {
    if (!extendedDetails) return;
    
    const totalWeight = calculateTotalWeight(items);
    const effectiveMoveType = moveDetails.moveType === 'auto' 
      ? (moveDetails.distance >= 150 ? 'long-distance' : 'local')
      : moveDetails.moveType;
    const estimate = calculateEstimate(totalWeight, moveDetails.distance, effectiveMoveType);
    
    const inventoryList = items.map(item => 
      `• ${item.name} (${item.room}) - Qty: ${item.quantity}, Weight: ${item.quantity * item.weightEach} lbs`
    ).join('\n');

    const subject = encodeURIComponent(`TruMove Quote Request - ${extendedDetails.name}`);
    const body = encodeURIComponent(`
TruMove Moving Quote Request

CONTACT INFORMATION
Name: ${extendedDetails.name}
Email: ${extendedDetails.email}
Phone: ${extendedDetails.phone}

MOVE DETAILS
From: ${extendedDetails.fromLocation}
  Type: ${extendedDetails.fromPropertyType}${extendedDetails.fromPropertyType === 'apartment' ? ` (Floor ${extendedDetails.fromFloor}, ${extendedDetails.fromHasElevator ? 'Elevator' : 'Stairs'})` : ''}

To: ${extendedDetails.toLocation}
  Type: ${extendedDetails.toPropertyType}${extendedDetails.toPropertyType === 'apartment' ? ` (Floor ${extendedDetails.toFloor}, ${extendedDetails.toHasElevator ? 'Elevator' : 'Stairs'})` : ''}

Distance: ${moveDetails.distance} miles
Move Type: ${effectiveMoveType}
Target Date: ${extendedDetails.moveDate ? format(extendedDetails.moveDate, 'MMMM d, yyyy') : 'Not specified'}
Home Size: ${extendedDetails.homeSize}

INVENTORY (${items.length} items, ${totalWeight.toLocaleString()} lbs total)
${inventoryList}

ESTIMATED RANGE: ${formatCurrency(estimate.min)} - ${formatCurrency(estimate.max)}

---
Generated by TruMove Online Estimate Tool
    `.trim());

    window.location.href = `mailto:quotes@trumove.com?subject=${subject}&body=${body}`;
  };

  return (
    <SiteShell>
      <div className="max-w-[1400px] mx-auto pl-0 pr-4 py-8">
        {/* Compact Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">
            Build Your <span className="tru-qb-title-accent">Virtual Inventory</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Add your household items or scan your rooms so we can accurately model what you are moving and plan your route with confidence.
          </p>
        </div>

        {/* Conditional Layout: 3-column when locked, 2-column when unlocked */}
        {!wizardComplete ? (
          // LOCKED STATE: Three-Column Layout - Form (left) | Inventory (expanded center) | Summary (right)
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr_240px] gap-4 items-start">
            {/* Left Column - Wizard */}
            <div className="space-y-4">
              <div className="tru-floating-form-card tru-floating-form-compact">
                <EstimateWizard onComplete={handleWizardComplete} initialDetails={extendedDetails} />
              </div>
            </div>

            {/* Center Column - Inventory Builder (locked, takes full remaining width) */}
            <div className="relative w-full min-w-0">
              {/* Locked Overlay */}
              <div className="tru-inventory-locked-overlay">
                <div className="tru-inventory-locked-content">
                  <div className="tru-inventory-locked-icon">
                    <Lock className="w-6 h-6" />
                  </div>
                  <span className="tru-inventory-locked-title">Inventory Builder</span>
                  <span className="tru-inventory-locked-subtitle">Complete the form to unlock</span>
                </div>
              </div>
              
              {/* Inventory Builder (blurred) with muted header */}
              <div className="rounded-2xl border border-border/60 bg-card shadow-lg tru-inventory-locked w-full overflow-hidden">
                {/* Muted Header - maintains black/green aesthetic but blurred */}
                <div className="tru-summary-header-large border-b border-border/40 opacity-50">
                  <div className="text-center flex-1">
                    <h3 className="text-lg font-black text-foreground">
                      Build Your <span className="tru-qb-title-accent">Virtual Inventory</span>
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Add items or scan your rooms</p>
                  </div>
                </div>
                
                <div className="p-5">
                  <InventoryBuilder 
                    onAddItem={handleAddItem} 
                    inventoryItems={items}
                    onUpdateQuantity={handleUpdateQuantity}
                    onClearAll={handleClearAll}
                    specialHandling={specialHandling}
                    onSpecialHandlingChange={setSpecialHandling}
                    isLocked={true}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Summary (far right) */}
            <div className="hidden lg:block lg:sticky lg:top-6">
              <QuoteSnapshotVertical items={items} moveDetails={moveDetails} extendedDetails={extendedDetails} onEdit={() => {}} />
            </div>
          </div>
        ) : (
          /* UNLOCKED STATE: Two-Column Layout - Inventory Builder | Sidebar */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
            {/* Left Column - Expanded Inventory Builder + Inventory List with thumbnails */}
            <div className="space-y-6">
              {/* Inventory Builder */}
              <div ref={inventoryRef} className="rounded-2xl border border-border/60 bg-card shadow-lg overflow-hidden">
                {/* Header - Enlarged and Centered */}
                <div className="tru-summary-header-large border-b border-border/40">
                  <div className="text-center flex-1">
                    <h3 className="text-lg font-black text-foreground">
                      Build Your <span className="tru-qb-title-accent">Virtual Inventory</span>
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Add items or scan your rooms</p>
                  </div>
                </div>
                
                <div className="p-5">
                  <InventoryBuilder 
                    onAddItem={handleAddItem} 
                    inventoryItems={items}
                    onUpdateQuantity={handleUpdateQuantity}
                    onClearAll={handleClearAll}
                    specialHandling={specialHandling}
                    onSpecialHandlingChange={setSpecialHandling}
                    isLocked={false}
                  />
                </div>
              </div>

              {/* Unified Inventory Table with thumbnails */}
              {items.length > 0 && (
                <InventoryTable 
                  items={items}
                  onUpdateItem={handleUpdateItem}
                  onRemoveItem={handleRemoveItem}
                  onClear={handleClearAll}
                />
              )}
            </div>

            {/* Right Column - Move Summary (details) + Inventory Summary (room counts) + Finalize */}
            <div className="space-y-4 lg:sticky lg:top-6">
              {/* Move Summary - Full details from customer */}
              <QuoteSnapshotVertical items={items} moveDetails={moveDetails} extendedDetails={extendedDetails} onEdit={() => setWizardComplete(false)} />

              {/* Finalize Section */}
              {items.length > 0 && (
                <section className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
                  {/* Header - Enlarged and Centered */}
                  <div className="tru-summary-header-large border-b border-border/40">
                    <div className="text-center flex-1">
                      <h3 className="text-lg font-black text-foreground">
                        Finalize Your <span className="tru-qb-title-accent">Estimate</span>
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="tru-qb-continue w-full"
                    >
                      Send My Estimate Request →
                    </button>
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Intro Modal */}
      <InventoryIntroModal
        isOpen={showIntroModal}
        onClose={handleCloseModal}
        distance={moveDetails.distance}
        moveType={moveDetails.moveType}
      />

      {/* Floating Inventory Button - always visible */}
      <FloatingInventoryButton 
        itemCount={items.length}
        onScrollToInventory={scrollToInventory}
      />

      {/* Chat Modal */}
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </SiteShell>
  );
}
