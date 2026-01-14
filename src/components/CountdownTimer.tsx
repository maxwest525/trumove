import { useState, useEffect } from "react";

interface CountdownTimerProps {
  onComplete?: () => void;
  seconds?: number;
  label?: string;
}

export default function CountdownTimer({ onComplete, seconds = 3, label = "LAUNCH IN" }: CountdownTimerProps) {
  const [count, setCount] = useState(seconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || count <= 0) {
      if (count <= 0 && onComplete) {
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, isActive, onComplete]);

  return (
    <div className="mc-countdown">
      <span className="mc-countdown-label">{label}</span>
      <span className="mc-countdown-value">T-{count}</span>
      <div className="mc-countdown-bar">
        <div 
          className="mc-countdown-fill" 
          style={{ width: `${((seconds - count) / seconds) * 100}%` }}
        />
      </div>
    </div>
  );
}
