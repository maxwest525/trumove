import { useState, useCallback } from "react";
import { Eye, X, Maximize2, Move, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface StreetViewInsetProps {
  coords: [number, number]; // [lng, lat]
  bearing: number;
  googleApiKey: string;
}

export function StreetViewInset({ coords, bearing, googleApiKey }: StreetViewInsetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentHeading, setCurrentHeading] = useState(bearing);
  const [currentPitch, setCurrentPitch] = useState(5);
  const [currentFov, setCurrentFov] = useState(100); // Field of view: 10-120, lower = more zoomed in
  const [imageFailed, setImageFailed] = useState(false);

  // Update heading when bearing changes (if not expanded)
  if (!isExpanded && Math.abs(currentHeading - bearing) > 10) {
    setCurrentHeading(bearing);
  }

  const handleRotate = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    switch (direction) {
      case 'left':
        setCurrentHeading((h) => (h - 45 + 360) % 360);
        break;
      case 'right':
        setCurrentHeading((h) => (h + 45) % 360);
        break;
      case 'up':
        setCurrentPitch((p) => Math.min(p + 15, 90));
        break;
      case 'down':
        setCurrentPitch((p) => Math.max(p - 15, -90));
        break;
    }
  }, []);

  const handleZoom = useCallback((direction: 'in' | 'out') => {
    if (direction === 'in') {
      setCurrentFov((f) => Math.max(f - 20, 20)); // Lower FOV = more zoomed in
    } else {
      setCurrentFov((f) => Math.min(f + 20, 120)); // Higher FOV = more zoomed out
    }
  }, []);

  const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${coords[1]},${coords[0]}&fov=${currentFov}&heading=${currentHeading}&pitch=${currentPitch}&key=${googleApiKey}`;
  const fallbackUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coords[1]},${coords[0]}&zoom=17&size=800x600&maptype=hybrid&key=${googleApiKey}`;

  return (
    <>
      {/* Inset preview - clickable to expand */}
      <div className="absolute bottom-4 right-4 z-30">
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative w-[200px] h-[140px] rounded-lg overflow-hidden border-2 border-white/20 shadow-xl bg-gradient-to-br from-slate-800 to-slate-900 cursor-pointer transition-all hover:border-primary/50 hover:scale-[1.02]"
          aria-label="Expand Street View"
        >
          <img
            src={`https://maps.googleapis.com/maps/api/streetview?size=400x280&location=${coords[1]},${coords[0]}&fov=100&heading=${bearing}&pitch=5&key=${googleApiKey}`}
            alt="Street View at truck location"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://maps.googleapis.com/maps/api/staticmap?center=${coords[1]},${coords[0]}&zoom=17&size=400x280&maptype=hybrid&key=${googleApiKey}`;
            }}
          />
          
          {/* Label overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wider">Street View</span>
            </div>
          </div>
          
          {/* Live indicator */}
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[8px] font-bold text-white/80 tracking-wider">LIVE</span>
          </div>

          {/* Expand hint on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 rounded bg-black/70 backdrop-blur-sm">
              <Maximize2 className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-semibold text-white">Click to expand</span>
            </div>
          </div>
        </button>
      </div>

      {/* Fullscreen Street View Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] h-[90vh] p-0 gap-0 bg-black border-white/10 overflow-hidden">
          <DialogTitle className="sr-only">Interactive Street View</DialogTitle>
          
          {/* Close button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/80 hover:bg-black border border-white/20 hover:border-primary/50 transition-all backdrop-blur-sm"
          >
            <X className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Exit View</span>
          </button>

          {/* Tracking pause notice */}
          <div className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm">
            <Move className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-amber-200">Please pause progress tracker</span>
          </div>

          {/* Street View Image */}
          <div className="relative w-full h-full">
            <img
              src={imageFailed ? fallbackUrl : streetViewUrl}
              alt="Interactive Street View"
              className="w-full h-full object-cover"
              onError={() => setImageFailed(true)}
            />

            {/* Pan controls */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Left arrow */}
              <button
                onClick={() => handleRotate('left')}
                className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 hover:border-primary/50 transition-all backdrop-blur-sm"
                aria-label="Pan left"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              {/* Right arrow */}
              <button
                onClick={() => handleRotate('right')}
                className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 hover:border-primary/50 transition-all backdrop-blur-sm"
                aria-label="Pan right"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Up arrow */}
              <button
                onClick={() => handleRotate('up')}
                className="pointer-events-auto absolute top-16 left-1/2 -translate-x-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 hover:border-primary/50 transition-all backdrop-blur-sm"
                aria-label="Pan up"
              >
                <ChevronUp className="w-6 h-6 text-white" />
              </button>

              {/* Down arrow */}
              <button
                onClick={() => handleRotate('down')}
                className="pointer-events-auto absolute bottom-16 left-1/2 -translate-x-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 hover:border-primary/50 transition-all backdrop-blur-sm"
                aria-label="Pan down"
              >
                <ChevronDown className="w-6 h-6 text-white" />
              </button>

              {/* Zoom controls - right side vertical stack */}
              <div className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                <button
                  onClick={() => handleZoom('in')}
                  className={cn(
                    "p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 hover:border-primary/50 transition-all backdrop-blur-sm",
                    currentFov <= 20 && "opacity-40 cursor-not-allowed"
                  )}
                  aria-label="Zoom in"
                  disabled={currentFov <= 20}
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => handleZoom('out')}
                  className={cn(
                    "p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 hover:border-primary/50 transition-all backdrop-blur-sm",
                    currentFov >= 120 && "opacity-40 cursor-not-allowed"
                  )}
                  aria-label="Zoom out"
                  disabled={currentFov >= 120}
                >
                  <ZoomOut className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* View info badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-white uppercase tracking-wider">
                {imageFailed ? "Satellite View" : "Street View"}
              </span>
              <span className="text-xs text-white/60">
                {coords[1].toFixed(4)}, {coords[0].toFixed(4)}
              </span>
            </div>

            {/* Heading & Zoom indicator */}
            <div className="absolute bottom-4 right-4 flex items-center gap-3 px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/60">Heading:</span>
                <span className="text-sm font-medium text-white">{Math.round(currentHeading)}°</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/60">Zoom:</span>
                <span className="text-sm font-medium text-white">{Math.round((120 - currentFov) / 20 + 1)}x</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
