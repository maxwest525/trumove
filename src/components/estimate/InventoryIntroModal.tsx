import { Package } from "lucide-react";

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
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Package className="w-10 h-10 text-primary" />
        </div>

        <h2 className="text-2xl font-black text-foreground mb-3">
          Build Your Inventory
        </h2>
        
        <p className="text-base text-foreground mb-1">
          {"You're moving "}
          <span className="font-bold">{distance.toLocaleString()} miles</span>
          {" • "}
          <span className="font-bold">
            {moveType === 'long-distance' ? 'Long Distance' : 'Local Move'}
          </span>
        </p>
        
        <p className="text-sm text-muted-foreground mb-2">
          Add your furniture and boxes below.{" "}
          <span className="font-semibold text-foreground">
            Your inventory affects your price!
          </span>
        </p>

        <p className="text-xs text-muted-foreground mb-6">
          Use quick-add by room or search for specific items.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="h-12 px-8 rounded-xl bg-primary text-primary-foreground text-sm font-bold tracking-wide uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          OK
        </button>
      </div>
    </div>
  );
}