import { Unlock } from 'lucide-react';

interface UnlockConfettiProps {
  show: boolean;
}

export default function UnlockConfetti({ show }: UnlockConfettiProps) {
  if (!show) return null;

  // Green/primary themed colors for unlock celebration
  const colors = ['#00ff6a', '#00cc55', '#22c55e', '#4ade80', '#86efac', '#1e3a5f'];
  
  const pieces = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.5}s`,
    duration: `${2 + Math.random() * 1.5}s`,
    rotation: `${Math.random() * 720}deg`,
  }));

  return (
    <div className="tru-confetti-container" aria-hidden="true">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="tru-confetti-piece"
          style={{
            '--color': piece.color,
            '--delay': piece.delay,
            '--duration': piece.duration,
            '--rotation': piece.rotation,
            left: piece.left,
          } as React.CSSProperties}
        />
      ))}
      <div className="tru-confetti-message">
        <Unlock className="w-12 h-12 text-primary" />
        <span>Inventory Unlocked!</span>
      </div>
    </div>
  );
}
