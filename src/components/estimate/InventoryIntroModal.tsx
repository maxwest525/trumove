import { Package, DollarSign } from "lucide-react";

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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Prominent Price Callout */}
        <div className="mb-6 p-4 rounded-xl bg-amber-500/15 border-2 border-amber-500/40">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="w-6 h-6 text-amber-600" />
            <span className="text-lg font-black text-amber-700 uppercase tracking-wide">
              Your Inventory Affects Your Price!
            </span>
            <DollarSign className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-sm text-amber-700/80 font-medium">
            The more accurate your list, the more accurate your quote will be.
          </p>
        </div>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Package className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-xl font-black text-foreground mb-2">
          Build Your Inventory
        </h2>
        
        <p className="text-sm text-foreground mb-4">
          {"You're moving "}
          <span className="font-bold">{distance.toLocaleString()} miles</span>
          {" • "}
          <span className="font-bold">
            {moveType === 'long-distance' ? 'Long Distance' : 'Local Move'}
          </span>
        </p>
        
        <p className="text-xs text-muted-foreground mb-6">
          Select a room and add your furniture and boxes below.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="h-12 px-8 rounded-xl bg-primary text-primary-foreground text-sm font-bold tracking-wide uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Start Building
        </button>
      </div>
    </div>
  );
}
