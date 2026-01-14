import { useState, useEffect } from "react";
import { Shield, Brain, Zap, Users, Lock, TrendingUp } from "lucide-react";

const TECH_FEATURES = [
  { icon: Lock, text: "256-bit encryption protecting your data" },
  { icon: Brain, text: "AI analyzing 47+ vetted carriers" },
  { icon: Zap, text: "Real-time pricing from live market data" },
  { icon: Users, text: "Every mover background-verified" },
  { icon: Shield, text: "FMCSA license verification active" },
  { icon: TrendingUp, text: "Smart matching based on performance data" },
];

export default function TechIndicatorStrip() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % TECH_FEATURES.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentFeature = TECH_FEATURES[currentIndex];
  const Icon = currentFeature.icon;

  return (
    <div className="tru-tech-strip">
      <div className={`tru-tech-item ${isTransitioning ? "is-transitioning" : ""}`}>
        <Icon className="tru-tech-icon" />
        <span className="tru-tech-text">{currentFeature.text}</span>
      </div>
      <div className="tru-tech-dots">
        {TECH_FEATURES.map((_, idx) => (
          <span
            key={idx}
            className={`tru-tech-dot ${idx === currentIndex ? "is-active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
