import { Package, DollarSign, AlertTriangle, Phone, ArrowRight } from "lucide-react";

interface InventoryIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  distance: number;
  moveType: 'local' | 'long-distance' | 'auto';
}

export default function InventoryIntroModal({ 
  isOpen, 
  onClose, 
  distance,
  moveType 
}: InventoryIntroModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Warning Header - Executive Style */}
        <div className="tru-inventory-warning-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wide">
                Important Notice
              </h3>
              <p className="text-sm text-white/90 font-medium">
                Your inventory directly affects your price
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Price Impact Warning */}
          <div className="tru-inventory-warning-box">
            <div className="flex gap-3">
              <DollarSign className="w-6 h-6 tru-warning-icon flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold tru-warning-title mb-1">
                  Accurate Inventory = Accurate Quote
                </p>
                <p className="text-sm tru-warning-text">
                  The cubic footage of your items determines your final moving cost. 
                  Missing or inaccurate items may result in unexpected charges on move day.
                </p>
              </div>
            </div>
          </div>

          {/* Move Details Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                {distance.toLocaleString()} miles
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm font-semibold text-foreground">
                {moveType === 'long-distance' ? 'Long Distance' : 'Local Move'}
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mb-6">
            Select rooms and add your furniture, boxes, and appliances to get an accurate estimate.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary CTA - Start Building */}
            <button
              type="button"
              onClick={onClose}
              className="tru-inventory-start-btn"
            >
              <Package className="w-5 h-5" />
              Start Building My Inventory
              <ArrowRight className="w-4 h-4" />
            </button>
            
            {/* Secondary CTA - Call Specialist */}
            <a
              href="tel:1-800-555-0123"
              className="tru-inventory-call-btn"
            >
              <Phone className="w-4 h-4" />
              Prefer to talk? Call a Moving Specialist
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
