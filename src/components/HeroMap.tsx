import { useEffect, useState } from "react";
import usMapImage from "@/assets/us_map_outlined.png";

export default function HeroMap() {
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Animated routes data - showcasing popular long-distance moves
  const routes = [
    { from: { x: 865, y: 180, label: "NYC" }, to: { x: 135, y: 295, label: "LA" }, color: "hsl(var(--primary))" },
    { from: { x: 670, y: 185, label: "CHI" }, to: { x: 835, y: 430, label: "MIA" }, color: "hsl(120 80% 50%)" },
    { from: { x: 98, y: 165, label: "SEA" }, to: { x: 495, y: 340, label: "DAL" }, color: "hsl(140 70% 45%)" },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tru-hero-map">
      <div className="tru-hero-map-glow" />
      
      <svg 
        viewBox="0 0 960 600" 
        className="tru-hero-map-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient for route lines */}
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(120 100% 54%)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(120 100% 70%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(120 100% 54%)" stopOpacity="0.8" />
          </linearGradient>
          
          {/* Glow filter for dots */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Pulse animation gradient */}
          <radialGradient id="pulseGradient">
            <stop offset="0%" stopColor="hsl(120 100% 54%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(120 100% 54%)" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* US Map background */}
        <image 
          href={usMapImage} 
          x="0" 
          y="0" 
          width="960" 
          height="600" 
          className="tru-hero-map-image"
        />
        
        {/* Animated route lines */}
        {routes.map((route, i) => {
          const isActive = animationPhase === i || animationPhase === 3;
          const midX = (route.from.x + route.to.x) / 2;
          const midY = Math.min(route.from.y, route.to.y) - 60;
          
          return (
            <g key={i} className={`tru-hero-route ${isActive ? 'is-active' : ''}`}>
              {/* Curved path */}
              <path
                d={`M ${route.from.x} ${route.from.y} Q ${midX} ${midY} ${route.to.x} ${route.to.y}`}
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="8 4"
                className="tru-hero-route-line"
              />
              
              {/* Origin dot */}
              <circle
                cx={route.from.x}
                cy={route.from.y}
                r="8"
                fill="hsl(120 100% 54%)"
                filter="url(#glow)"
                className="tru-hero-route-dot"
              />
              <circle
                cx={route.from.x}
                cy={route.from.y}
                r="16"
                fill="url(#pulseGradient)"
                className="tru-hero-route-pulse"
              />
              
              {/* Destination dot */}
              <circle
                cx={route.to.x}
                cy={route.to.y}
                r="8"
                fill="hsl(120 100% 54%)"
                filter="url(#glow)"
                className="tru-hero-route-dot"
              />
              <circle
                cx={route.to.x}
                cy={route.to.y}
                r="16"
                fill="url(#pulseGradient)"
                className="tru-hero-route-pulse"
              />
              
              {/* City labels */}
              <text
                x={route.from.x}
                y={route.from.y - 18}
                className="tru-hero-route-label"
                textAnchor="middle"
              >
                {route.from.label}
              </text>
              <text
                x={route.to.x}
                y={route.to.y - 18}
                className="tru-hero-route-label"
                textAnchor="middle"
              >
                {route.to.label}
              </text>
            </g>
          );
        })}
        
        {/* Animated truck along route */}
        <g className="tru-hero-truck-group">
          <circle
            cx="500"
            cy="250"
            r="12"
            fill="hsl(var(--tm-ink))"
            className="tru-hero-truck-dot"
          />
          <text
            x="500"
            y="254"
            textAnchor="middle"
            fill="hsl(120 100% 54%)"
            fontSize="12"
            fontWeight="bold"
          >
            🚚
          </text>
        </g>
      </svg>
      
      {/* Stats overlay */}
      <div className="tru-hero-map-stats">
        <div className="tru-hero-map-stat">
          <span className="tru-hero-map-stat-num">2,400+</span>
          <span className="tru-hero-map-stat-label">Moves Completed</span>
        </div>
        <div className="tru-hero-map-stat">
          <span className="tru-hero-map-stat-num">50</span>
          <span className="tru-hero-map-stat-label">States Covered</span>
        </div>
      </div>
    </div>
  );
}
