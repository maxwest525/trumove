interface TrafficLegendProps {
  isVisible: boolean;
}

export function TrafficLegend({ isVisible }: TrafficLegendProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-4 right-4 z-20 px-3 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg">
      <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-white/50 mb-2">
        Traffic Conditions
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded-full bg-[#22c55e]" />
          <span className="text-[10px] text-white/70">Free Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded-full bg-[#f59e0b]" />
          <span className="text-[10px] text-white/70">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded-full bg-[#ef4444]" />
          <span className="text-[10px] text-white/70">Heavy</span>
        </div>
      </div>
    </div>
  );
}
