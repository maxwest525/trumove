import { CheckCircle } from 'lucide-react';

interface ConfettiProps {
  show: boolean;
}

export default function Confetti({ show }: ConfettiProps) {
  if (!show) return null;

  const colors = ['#00ff6a', '#1e3a5f', '#fbbf24', '#60a5fa', '#f472b6', '#34d399'];
  const pieces = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.6}s`,
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
        <CheckCircle className="w-12 h-12 text-primary" />
        <span>Quote Submitted!</span>
      </div>
    </div>
  );
}
