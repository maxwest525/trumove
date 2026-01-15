import { useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import SiteShell from "@/components/layout/SiteShell";
import InventoryBuilder from "@/components/estimate/InventoryBuilder";
import InventoryTable from "@/components/estimate/InventoryTable";
import QuoteSnapshot from "@/components/estimate/QuoteSnapshot";
import InventoryIntroModal from "@/components/estimate/InventoryIntroModal";
import EstimateWizard, { type ExtendedMoveDetails } from "@/components/estimate/EstimateWizard";
import { type InventoryItem, type MoveDetails, calculateTotalWeight, formatCurrency, calculateEstimate, determineMoveType } from "@/lib/priceCalculator";
import { calculateDistance } from "@/lib/distanceCalculator";

export default function OnlineEstimate() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [wizardComplete, setWizardComplete] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [specialHandling, setSpecialHandling] = useState(false);
  const [extendedDetails, setExtendedDetails] = useState<ExtendedMoveDetails | null>(null);
  
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
  Parking Distance: ${extendedDetails.fromParkingDistance === 'unknown' ? 'Unknown' : extendedDetails.fromParkingDistance === 'less75' ? 'Less than 75 feet' : 'More than 75 feet'}

To: ${extendedDetails.toLocation}
  Type: ${extendedDetails.toPropertyType}${extendedDetails.toPropertyType === 'apartment' ? ` (Floor ${extendedDetails.toFloor}, ${extendedDetails.toHasElevator ? 'Elevator' : 'Stairs'})` : ''}
  Parking Distance: ${extendedDetails.toParkingDistance === 'unknown' ? 'Unknown' : extendedDetails.toParkingDistance === 'less75' ? 'Less than 75 feet' : 'More than 75 feet'}

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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-card shadow-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[9px] font-black tracking-[0.16em] uppercase text-muted-foreground">
              AI-Powered Moving Estimate
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">
            Get your instant moving quote
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {!wizardComplete 
              ? "Tell us about your move, and we'll give you an accurate estimate."
              : "Build your inventory to get a personalized price estimate."}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left Column - Wizard or Inventory */}
          <div className="space-y-6">
            {!wizardComplete ? (
              /* Wizard with blurred inventory in background */
              <div className="tru-estimate-overlay">
                <div className="tru-estimate-wizard-container">
                  <EstimateWizard onComplete={handleWizardComplete} />
                </div>
                
                {/* Blurred Preview */}
                <div className="tru-estimate-bg-blur mt-6">
                  <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-7 h-7 rounded-full bg-muted text-muted-foreground text-sm font-bold flex items-center justify-center">2</span>
                      <h2 className="text-lg font-black text-foreground">Build your inventory</h2>
                    </div>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      Complete the steps above to unlock
                    </div>
                  </section>
                </div>
              </div>
            ) : (
              <>
                {/* Move Details Summary */}
                {extendedDetails && (
                  <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">✓</span>
                        <h2 className="text-lg font-black text-foreground">Your move details</h2>
                      </div>
                      <button 
                        onClick={() => setWizardComplete(false)}
                        className="text-sm text-primary font-semibold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block text-xs uppercase tracking-wide mb-1">From</span>
                        <span className="font-semibold">{extendedDetails.fromLocation}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs uppercase tracking-wide mb-1">To</span>
                        <span className="font-semibold">{extendedDetails.toLocation}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs uppercase tracking-wide mb-1">Date</span>
                        <span className="font-semibold">
                          {extendedDetails.moveDate ? format(extendedDetails.moveDate, 'MMM d, yyyy') : 'TBD'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs uppercase tracking-wide mb-1">Size</span>
                        <span className="font-semibold">{extendedDetails.homeSize}</span>
                      </div>
                    </div>
                  </section>
                )}

                {/* Inventory Builder */}
                <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">2</span>
                    <h2 className="text-lg font-black text-foreground">Build your inventory</h2>
                  </div>
                  <InventoryBuilder 
                    onAddItem={handleAddItem} 
                    inventoryItems={items}
                    onClearAll={handleClearAll}
                    specialHandling={specialHandling}
                    onSpecialHandlingChange={setSpecialHandling}
                  />
                </section>

                {/* Inventory Table */}
                {items.length > 0 && (
                  <InventoryTable 
                    items={items}
                    onUpdateItem={handleUpdateItem}
                    onRemoveItem={handleRemoveItem}
                    onClear={handleClearAll}
                  />
                )}

                {/* Finalize Section */}
                {items.length > 0 && (
                  <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">3</span>
                      <h2 className="text-lg font-black text-foreground">Finalize your estimate</h2>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-bold tracking-wide uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      Send My Estimate Request →
                    </button>
                  </section>
                )}
              </>
            )}
          </div>

          {/* Right Column - Quote Snapshot */}
          <div className="lg:sticky lg:top-[100px] lg:self-start">
            <QuoteSnapshot items={items} moveDetails={moveDetails} />
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
    </SiteShell>
  );
}
