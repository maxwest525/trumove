import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

interface HeroParticlesProps {
  className?: string;
}

export default function HeroParticles({ className = "" }: HeroParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateDimensions = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    updateDimensions();

    // Initialize particles
    const particleCount = Math.min(50, Math.floor((dimensions.width * dimensions.height) / 20000));
    particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas.width, canvas.height));

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reinitialize particles when dimensions change
    const particleCount = Math.min(50, Math.floor((dimensions.width * dimensions.height) / 20000));
    if (particlesRef.current.length !== particleCount) {
      particlesRef.current = Array.from({ length: particleCount }, () => createParticle(dimensions.width, dimensions.height));
    }

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < -10) particle.x = dimensions.width + 10;
        if (particle.x > dimensions.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = dimensions.height + 10;
        if (particle.y > dimensions.height + 10) particle.y = -10;

        // Fade in/out based on position
        const edgeDistance = Math.min(
          particle.x,
          particle.y,
          dimensions.width - particle.x,
          dimensions.height - particle.y
        );
        const fadeFactor = Math.min(1, edgeDistance / 100);

        // Draw particle as soft glowing dot
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        
        // Use primary green color (hsl 142 76% 36%)
        const alpha = particle.opacity * fadeFactor;
        gradient.addColorStop(0, `hsla(142, 76%, 50%, ${alpha})`);
        gradient.addColorStop(0.5, `hsla(142, 76%, 45%, ${alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(142, 76%, 40%, 0)`);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Connect nearby particles with subtle lines
        particlesRef.current.slice(index + 1).forEach((other) => {
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const lineAlpha = (1 - distance / 120) * 0.15 * fadeFactor;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(142, 76%, 50%, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className={`tru-hero-particles ${className}`}
      aria-hidden="true"
    />
  );
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.4 + 0.1,
    hue: 142, // Primary green
  };
}
