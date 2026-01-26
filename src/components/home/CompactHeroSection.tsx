import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, BadgeCheck, Truck, Lock, Video, Phone } from "lucide-react";
import heroMoversFamily from "@/assets/hero-movers-family.jpg";

const TRUST_BADGES = [
  { icon: Shield, label: "FMCSA Verified" },
  { icon: BadgeCheck, label: "USDOT Compliant" },
  { icon: Truck, label: "Bonded & Insured" },
  { icon: Lock, label: "TLS Encrypted" },
];

interface CompactHeroSectionProps {
  children: React.ReactNode; // Form component
}

export default function CompactHeroSection({ children }: CompactHeroSectionProps) {
  const navigate = useNavigate();
  const bgRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.3;

  return (
    <section className="tru-hero-compact">
      {/* Parallax Background */}
      <div 
        ref={bgRef}
        className="tru-hero-bg-parallax"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <img 
          src={heroMoversFamily} 
          alt="Professional movers helping a family" 
          loading="eager"
        />
        <div className="tru-hero-bg-overlay" />
      </div>

      {/* Content Grid */}
      <div className="tru-hero-compact-grid">
        {/* Left: Content */}
        <div className="tru-hero-compact-content">
          <h1 className="tru-hero-compact-title">
            <span className="tru-hero-compact-title-accent">AI-Powered</span> Moving
            <br />Made Simple
          </h1>
          <p className="tru-hero-compact-subtitle">
            We match you with vetted, independent carriers who prioritize service over corporate profits. Fair prices, total transparency.
          </p>

          {/* Inline Trust Badges */}
          <div className="tru-hero-trust-badges">
            {TRUST_BADGES.map((badge, idx) => (
              <span key={idx} className="tru-hero-trust-badge">
                <badge.icon />
                {badge.label}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="tru-hero-compact-actions">
            <button 
              className="tru-hero-compact-btn-video"
              onClick={() => navigate("/book")}
            >
              <Video className="w-4 h-4" />
              Free Video Consult
            </button>
            <a href="tel:+16097277647" className="tru-hero-compact-btn-phone">
              <Phone className="w-3.5 h-3.5" />
              (609) 727-7647
            </a>
          </div>
        </div>

        {/* Right: Form */}
        <div className="tru-hero-form-compact">
          {children}
        </div>
      </div>
    </section>
  );
}
