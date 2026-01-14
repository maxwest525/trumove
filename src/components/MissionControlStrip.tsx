import { useState, useEffect } from "react";
import { Shield, Cpu, Radio, Satellite } from "lucide-react";

const TELEMETRY = [
  { icon: Shield, text: "ENCRYPTION: AES-256 ACTIVE", status: "NOMINAL" },
  { icon: Cpu, text: "AI CORE: ANALYZING 47 CARRIERS", status: "PROCESSING" },
  { icon: Radio, text: "SIGNAL: REAL-TIME DATA LINK", status: "ONLINE" },
  { icon: Satellite, text: "NETWORK: ALL SYSTEMS GREEN", status: "NOMINAL" },
];

export default function MissionControlStrip() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % TELEMETRY.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentItem = TELEMETRY[currentIndex];
  const Icon = currentItem.icon;

  return (
    <div className="mc-telemetry-strip">
      <div className="mc-telemetry-header">
        <span className="mc-telemetry-label">TELEMETRY</span>
        <div className="mc-signal-bars">
          <span className="mc-signal-bar is-active" />
          <span className="mc-signal-bar is-active" />
          <span className="mc-signal-bar is-active" />
          <span className="mc-signal-bar" />
        </div>
      </div>
      
      <div className={`mc-telemetry-item ${isTransitioning ? "is-transitioning" : ""}`}>
        <Icon className="mc-telemetry-icon" />
        <span className="mc-telemetry-text">{currentItem.text}</span>
        <span className={`mc-telemetry-status ${currentItem.status === "NOMINAL" ? "is-nominal" : "is-processing"}`}>
          {currentItem.status}
        </span>
      </div>

      <div className="mc-telemetry-dots">
        {TELEMETRY.map((_, idx) => (
          <span 
            key={idx} 
            className={`mc-telemetry-dot ${idx === currentIndex ? "is-active" : ""}`} 
          />
        ))}
      </div>
    </div>
  );
}
