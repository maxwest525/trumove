import { useState, useEffect } from "react";
import { Shield, Brain, Zap, Users, Lock, TrendingUp } from "lucide-react";

const TECH_FEATURES = [
  { icon: Brain, text: "AI-powered rate comparison" },
  { icon: Zap, text: "Best carrier, best price" },
  { icon: Shield, text: "47+ vetted movers" },
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
      <div className={`tru-tech-chip ${isTransitioning ? "is-transitioning" : ""}`}>
        <span className="tru-tech-chip-icon">
          <Icon className="w-4 h-4" />
        </span>
        <span className="tru-tech-chip-text">{currentFeature.text}</span>
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
