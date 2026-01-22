import { useState, useCallback, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { Lock } from "lucide-react";
import FloatingQuoteButton from "@/components/FloatingQuoteButton";
import ChatModal from "@/components/chat/ChatModal";
import SiteShell from "@/components/layout/SiteShell";
import InventoryBuilder from "@/components/estimate/InventoryBuilder";
import InventoryTable from "@/components/estimate/InventoryTable";
import InventoryIntroModal from "@/components/estimate/InventoryIntroModal";
import EstimateWizard, { type ExtendedMoveDetails } from "@/components/estimate/EstimateWizard";
import QuoteSnapshotVertical from "@/components/estimate/QuoteSnapshotVertical";
import { type InventoryItem, type MoveDetails, calculateTotalWeight, formatCurrency, calculateEstimate, determineMoveType } from "@/lib/priceCalculator";
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
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Compact Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">
            Get your instant moving quote
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Tell us about your move, then build your inventory for an accurate estimate.
          </p>
        </div>

        {/* Three-Column Layout: Form | Summary Pill | Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_auto_1fr] gap-4 lg:gap-6 items-start">
          {/* Left Column - Wizard (constrained width) */}
          <div className="space-y-4">
            {/* Wizard Card */}
            <div className="tru-floating-form-card tru-floating-form-compact">
              <EstimateWizard onComplete={handleWizardComplete} />
            </div>

            {/* Finalize Section - Only when items exist */}
            {wizardComplete && items.length > 0 && (
              <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-full border-2 border-primary bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">3</span>
                  <h2 className="text-lg font-black text-foreground">Finalize your estimate</h2>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full h-11 rounded-lg border-2 border-primary bg-primary/10 text-primary text-sm font-bold tracking-wide uppercase transition-all hover:bg-primary/20 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Send My Estimate Request →
                </button>
              </section>
            )}
          </div>

          {/* Middle Column - Floating Summary Pill */}
          <div className="hidden lg:block">
            <QuoteSnapshotVertical items={items} moveDetails={moveDetails} />
          </div>

          {/* Right Column - Inventory Builder (with lock state) */}
          <div className="relative">
            {/* Locked Overlay */}
            {!wizardComplete && (
              <div className="tru-inventory-locked-overlay">
                <div className="tru-inventory-locked-content">
                  <div className="tru-inventory-locked-icon">
                    <Lock className="w-6 h-6" />
                  </div>
                  <span className="tru-inventory-locked-title">Inventory Builder</span>
                  <span className="tru-inventory-locked-subtitle">Complete the form to unlock</span>
                </div>
              </div>
            )}
            
            {/* Inventory Builder */}
            <div className={cn(
              "rounded-2xl border border-border/60 bg-card p-5 shadow-lg transition-all duration-500",
              !wizardComplete && "tru-inventory-locked"
            )}>
              <div className="flex items-center gap-2 mb-4">
                <span className={cn(
                  "w-7 h-7 rounded-full border-2 text-sm font-bold flex items-center justify-center",
                  wizardComplete 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-muted-foreground/30 bg-muted/30 text-muted-foreground/50"
                )}>2</span>
                <h2 className={cn(
                  "text-lg font-black",
                  wizardComplete ? "text-foreground" : "text-muted-foreground/50"
                )}>Build your inventory</h2>
              </div>
              <InventoryBuilder 
                onAddItem={handleAddItem} 
                inventoryItems={items}
                onUpdateQuantity={handleUpdateQuantity}
                onClearAll={handleClearAll}
                specialHandling={specialHandling}
                onSpecialHandlingChange={setSpecialHandling}
                isLocked={!wizardComplete}
              />
            </div>

            {/* Inventory Table - Below builder when items exist */}
            {wizardComplete && items.length > 0 && (
              <div className="mt-6">
                <InventoryTable 
                  items={items}
                  onUpdateItem={handleUpdateItem}
                  onRemoveItem={handleRemoveItem}
                  onClear={handleClearAll}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Intro Modal */}
      <InventoryIntroModal
        isOpen={showIntroModal}
        onClose={handleCloseModal}
        distance={moveDetails.distance}
        moveType={moveDetails.moveType}
      />

      {/* Floating Helper */}
      <FloatingQuoteButton onChatOpen={() => setChatOpen(true)} />

      {/* Chat Modal */}
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </SiteShell>
  );
}
