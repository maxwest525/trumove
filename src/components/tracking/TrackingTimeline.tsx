import { Truck, CheckCircle, Circle } from "lucide-react";

interface TrackingTimelineProps {
  progress: number;
  originName: string;
  destName: string;
  departureTime: string;
  etaTime: string;
  currentLocation?: string;
}

export function TrackingTimeline({
  progress,
  originName,
  destName,
  departureTime,
  etaTime,
  currentLocation
}: TrackingTimelineProps) {
  const isComplete = progress >= 100;

  return (
    <div className="tracking-info-card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
          Timeline
        </span>
      </div>

      <div className="relative">
        {/* Timeline Track */}
        <div className="flex items-center gap-0">
          {/* Origin Node */}
          <div className="flex flex-col items-center z-10">
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-black" />
            </div>
          </div>

          {/* Progress Line */}
          <div className="flex-1 h-1 bg-white/10 relative mx-1">
            <div 
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
            
            {/* Truck Icon */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-300 ease-out"
              style={{ left: `calc(${Math.min(progress, 95)}% - 14px)` }}
            >
              <div className="tracking-truck-marker-small">
                <div className="tracking-truck-glow-small" />
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Truck className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>
          </div>

          {/* Destination Node */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              isComplete ? "bg-primary" : "bg-white/20 border-2 border-white/30"
            }`}>
              {isComplete ? (
                <CheckCircle className="w-3 h-3 text-black" />
              ) : (
                <Circle className="w-2 h-2 text-white/40" />
              )}
            </div>
          </div>
        </div>

        {/* Labels Row */}
        <div className="flex justify-between mt-3">
          <div className="text-left">
            <div className="text-xs font-medium text-white/80">Pickup</div>
            <div className="text-[10px] text-white/40">{departureTime}</div>
            <div className="text-[10px] text-white/50 max-w-[80px] truncate">{originName}</div>
          </div>

          {currentLocation && !isComplete && (
            <div className="text-center absolute left-1/2 -translate-x-1/2 mt-1">
              <div className="text-[10px] text-primary font-medium">Current</div>
              <div className="text-[10px] text-white/50 max-w-[100px] truncate">{currentLocation}</div>
            </div>
          )}

          <div className="text-right">
            <div className="text-xs font-medium text-white/80">
              {isComplete ? "Delivered" : "Delivery"}
            </div>
            <div className="text-[10px] text-white/40">
              {isComplete ? "Complete" : `ETA ${etaTime}`}
            </div>
            <div className="text-[10px] text-white/50 max-w-[80px] truncate text-right">{destName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
