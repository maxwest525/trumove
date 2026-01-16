import { useState, useCallback, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { Lock, Sparkles, Package, Route, Calculator } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import InventoryBuilder from "@/components/estimate/InventoryBuilder";
import InventoryTable from "@/components/estimate/InventoryTable";
import QuoteSnapshot from "@/components/estimate/QuoteSnapshot";
import InventoryIntroModal from "@/components/estimate/InventoryIntroModal";
import EstimateWizard, { type ExtendedMoveDetails } from "@/components/estimate/EstimateWizard";
import { type InventoryItem, type MoveDetails, calculateTotalWeight, formatCurrency, calculateEstimate, determineMoveType } from "@/lib/priceCalculator";
import { calculateDistance } from "@/lib/distanceCalculator";

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

  // Auto-populate from homepage data stored in localStorage
  useEffect(() => {
    const storedLead = localStorage.getItem("tm_lead");
    if (storedLead && !extendedDetails) {
      try {
        const lead = JSON.parse(storedLead);
        
        // Pre-populate extendedDetails with homepage data
        // This will flow through to moveDetails and QuoteSnapshot
        setExtendedDetails({
          name: '',
          email: lead.email || '',
          phone: lead.phone || '',
          fromLocation: lead.fromCity ? `${lead.fromCity} ${lead.fromZip}` : lead.fromZip || '',
          toLocation: lead.toCity ? `${lead.toCity} ${lead.toZip}` : lead.toZip || '',
          homeSize: mapHomeSize(lead.size) || '',
          moveDate: lead.moveDate ? new Date(lead.moveDate) : null,
          // Set defaults for other required fields
          fromPropertyType: 'house',
          toPropertyType: 'house',
          fromFloor: 1,
          toFloor: 1,
          fromHasElevator: false,
          toHasElevator: false,
          fromParkingDistance: 'unknown',
          toParkingDistance: 'unknown',
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
              /* Wizard floating over inventory background */
              <div className="tru-estimate-overlay">
                {/* Background Layer - Inventory Builder (blurred) */}
                <div className="tru-estimate-bg-layer">
                  <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-7 h-7 rounded-full bg-muted text-muted-foreground text-sm font-bold flex items-center justify-center">2</span>
                      <h2 className="text-lg font-black text-foreground">Build your inventory</h2>
                    </div>
                    <InventoryBuilder 
                      onAddItem={() => {}} 
                      inventoryItems={[]}
                      onClearAll={() => {}}
                      specialHandling={false}
                      onSpecialHandlingChange={() => {}}
                    />
                  </section>
                </div>
                
                {/* Lock overlay with feature previews - OUTSIDE the blur layer */}
                <div className="tru-estimate-lock-overlay">
                  <div className="tru-lock-content">
                    <div className="tru-lock-badge">
                      <Lock className="w-5 h-5" />
                      <span>Complete the form above to unlock</span>
                    </div>
                    
                    {/* Feature Previews */}
                    <div className="tru-feature-previews">
                      <div className="tru-feature-preview">
                        <div className="tru-feature-icon">
                          <Package className="w-4 h-4" />
                        </div>
                        <div className="tru-feature-info">
                          <span className="tru-feature-title">Smart Inventory</span>
                          <span className="tru-feature-desc">Add items room-by-room</span>
                        </div>
                      </div>
                      <div className="tru-feature-preview">
                        <div className="tru-feature-icon">
                          <Route className="w-4 h-4" />
                        </div>
                        <div className="tru-feature-info">
                          <span className="tru-feature-title">Route Preview</span>
                          <span className="tru-feature-desc">See your move distance</span>
                        </div>
                      </div>
                      <div className="tru-feature-preview">
                        <div className="tru-feature-icon">
                          <Calculator className="w-4 h-4" />
                        </div>
                        <div className="tru-feature-info">
                          <span className="tru-feature-title">Live Estimate</span>
                          <span className="tru-feature-desc">Real-time price updates</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Foreground Layer - Wizard floats on TOP */}
                <div className="tru-estimate-wizard-float">
                  <EstimateWizard onComplete={handleWizardComplete} />
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
