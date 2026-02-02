import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Play } from "lucide-react";
import DemoLauncherModal from "./DemoLauncherModal";

export default function FloatingDemoButton() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Hide on homepage
  if (location.pathname === "/") {
    return null;
  }

  return (
    <>
      {/* Floating Demo Button - Fixed bottom left */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          fixed bottom-6 left-6 z-40
          flex items-center gap-2 px-4 py-2.5
          bg-foreground text-background
          rounded-full shadow-lg
          font-semibold text-sm
          hover:bg-primary hover:text-foreground
          transition-all duration-200
          hover:scale-105 hover:shadow-xl
          border-2 border-transparent hover:border-primary/50
        "
        aria-label="Open demo launcher"
      >
        <Play className="w-4 h-4" />
        <span>Demo</span>
      </button>

      <DemoLauncherModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
