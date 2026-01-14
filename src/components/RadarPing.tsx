export default function RadarPing() {
  return (
    <div className="mc-radar-container">
      <svg viewBox="0 0 200 200" className="mc-radar-svg">
        {/* Grid circles */}
        <circle cx="100" cy="100" r="80" className="mc-radar-grid" />
        <circle cx="100" cy="100" r="60" className="mc-radar-grid" />
        <circle cx="100" cy="100" r="40" className="mc-radar-grid" />
        <circle cx="100" cy="100" r="20" className="mc-radar-grid" />
        
        {/* Cross lines */}
        <line x1="20" y1="100" x2="180" y2="100" className="mc-radar-grid" />
        <line x1="100" y1="20" x2="100" y2="180" className="mc-radar-grid" />
        
        {/* Rotating sweep */}
        <g className="mc-radar-sweep">
          <path 
            d="M100,100 L100,20 A80,80 0 0,1 157,50 Z" 
            className="mc-radar-sweep-fill"
          />
        </g>
        
        {/* Pings / Blips */}
        <circle cx="75" cy="65" r="4" className="mc-radar-ping mc-ping-1" />
        <circle cx="130" cy="85" r="3" className="mc-radar-ping mc-ping-2" />
        <circle cx="110" cy="130" r="5" className="mc-radar-ping mc-ping-3" />
        
        {/* Center dot */}
        <circle cx="100" cy="100" r="6" className="mc-radar-center" />
      </svg>
      
      <div className="mc-radar-label">CARRIER SCAN</div>
    </div>
  );
}
