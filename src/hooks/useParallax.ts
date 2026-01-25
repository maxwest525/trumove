import { useEffect, useState, useRef, RefObject } from "react";

interface ParallaxOptions {
  speed?: number; // 0-1, where 0 = no movement, 1 = full scroll speed
  direction?: "up" | "down";
  disabled?: boolean;
}

interface ParallaxState {
  y: number;
  opacity: number;
  scale: number;
}

export function useParallax<T extends HTMLElement>(
  options: ParallaxOptions = {}
): [RefObject<T | null>, ParallaxState] {
  const { speed = 0.3, direction = "up", disabled = false } = options;
  const ref = useRef<T>(null);
  const [state, setState] = useState<ParallaxState>({ y: 0, opacity: 1, scale: 1 });

  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far the element is from the center of the viewport
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distanceFromCenter = elementCenter - viewportCenter;
      
      // Calculate parallax offset
      const scrollProgress = window.scrollY;
      const parallaxOffset = scrollProgress * speed * (direction === "up" ? -1 : 1);
      
      // Calculate opacity fade as element scrolls away
      const visibleRatio = 1 - Math.min(1, Math.abs(distanceFromCenter) / viewportHeight);
      const opacity = Math.max(0.3, visibleRatio);
      
      // Subtle scale effect
      const scale = 1 - (scrollProgress * 0.0001);

      setState({
        y: parallaxOffset,
        opacity,
        scale: Math.max(0.95, Math.min(1, scale)),
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, direction, disabled]);

  return [ref, state];
}

// Simpler hook for just getting scroll progress within a section
export function useScrollProgress<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Progress from 0 (element entering bottom) to 1 (element leaving top)
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Calculate progress
      const startPoint = viewportHeight; // Element enters when top is at bottom of viewport
      const endPoint = -elementHeight; // Element leaves when bottom is at top of viewport
      const totalDistance = startPoint - endPoint;
      const currentDistance = startPoint - elementTop;
      
      const newProgress = Math.max(0, Math.min(1, currentDistance / totalDistance));
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return [ref, progress];
}
