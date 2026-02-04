import { useState } from "react";
import { 
  Play, 
  X, 
  Truck, 
  Package, 
  ClipboardList, 
  Scan,
  MapPin,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PPCDemoModal from "./demo/PPCDemoModal";

interface DemoLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const demoOptions = [
  {
    id: "estimate",
    title: "Build Your Move",
    description: "Create a full moving estimate with addresses, inventory, and pricing",
    icon: ClipboardList,
    route: "/online-estimate",
    color: "from-primary/20 to-primary/5 border-primary/30",
    iconColor: "text-primary"
  },
  {
    id: "inventory",
    title: "Manual Inventory Builder",
    description: "Build your household inventory room by room with our visual catalog",
    icon: Package,
    route: "/online-estimate",
    skipToInventory: true,
    color: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
    iconColor: "text-amber-500"
  },
  {
    id: "tracking",
    title: "Shipment Tracker",
    description: "Track a demo shipment from Jacksonville to Miami in real-time",
    icon: Truck,
    route: "/track",
    demoCode: "12345",
    color: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
    iconColor: "text-blue-500"
  },
  {
    id: "scan",
    title: "AI Room Scanner",
    description: "Use AI to automatically detect furniture from video",
    icon: Scan,
    route: "/scan-room",
    color: "from-violet-500/20 to-violet-500/5 border-violet-500/30",
    iconColor: "text-violet-500"
  },
  {
    id: "property",
    title: "Property Lookup",
    description: "Look up property details with satellite and street views",
    icon: MapPin,
    route: "/property-lookup",
    color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
    iconColor: "text-emerald-500"
  },
  {
    id: "ppc",
    title: "AI Marketing Suite",
    description: "PPC campaigns, SEO audit, keyword research, and landing page builder",
    icon: Sparkles,
    route: "",
    openModal: true,
    color: "from-purple-500/20 to-pink-500/5 border-purple-500/30",
    iconColor: "text-purple-500"
  }
];

export default function DemoLauncherModal({ isOpen, onClose }: DemoLauncherModalProps) {
  const navigate = useNavigate();
  const [ppcModalOpen, setPpcModalOpen] = useState(false);

  const handleDemoSelect = (option: typeof demoOptions[0]) => {
    if (option.id === "ppc") {
      onClose();
      setPpcModalOpen(true);
      return;
    }
    
    onClose();
    
    if (option.id === "tracking" && option.demoCode) {
      localStorage.setItem("tm_demo_tracking_code", option.demoCode);
      navigate(option.route);
    } else if (option.skipToInventory) {
      localStorage.setItem("tm_skip_to_inventory", "true");
      navigate(option.route);
    } else {
      navigate(option.route);
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Play className="w-4 h-4 text-primary" />
            </div>
            Try a Demo
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Explore TruMove features with interactive demos
          </p>
        </DialogHeader>

        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {demoOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleDemoSelect(option)}
              className={`
                w-full p-4 rounded-xl border text-left transition-all duration-200
                bg-gradient-to-br ${option.color}
                hover:scale-[1.02] hover:shadow-md
                group
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-background/80 flex items-center justify-center flex-shrink-0 ${option.iconColor}`}>
                  <option.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{option.title}</h3>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            All demos use sample data. No real moves are created.
          </p>
        </div>
      </DialogContent>
    </Dialog>

    <PPCDemoModal open={ppcModalOpen} onOpenChange={setPpcModalOpen} />
  </>
  );
}
