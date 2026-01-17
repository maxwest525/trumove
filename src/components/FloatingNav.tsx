import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Sparkles, Shield, MessageSquare, MapPin, Video, Headphones } from "lucide-react";

interface FloatingNavProps {
  onChatOpen?: () => void;
}

const navItems = [
  { icon: Sparkles, label: "AI Estimator", href: "/online-estimate" },
  { icon: Shield, label: "Carrier Vetting", href: "/vetting" },
  { icon: MessageSquare, label: "AI Chat", href: null, action: "chat" },
  { icon: MapPin, label: "Property Lookup", href: "/property-lookup" },
  { icon: Video, label: "Video Consult", href: "/book" },
  { icon: Headphones, label: "Call Us", href: "tel:+16097277647" },
];

export default function FloatingNav({ onChatOpen }: FloatingNavProps) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav 
      className="tru-floating-nav"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {navItems.map((item) => {
        const isActive = item.href && location.pathname === item.href;
        const Icon = item.icon;
        
        if (item.action === "chat") {
          return (
            <button
              key={item.label}
              onClick={onChatOpen}
              className={`tru-floating-nav-item ${isExpanded ? 'is-expanded' : ''}`}
            >
              <span className="tru-floating-nav-icon">
                <Icon className="w-5 h-5" />
              </span>
              <span className="tru-floating-nav-label">{item.label}</span>
            </button>
          );
        }

        const isExternal = item.href?.startsWith("tel:");
        
        if (isExternal) {
          return (
            <a
              key={item.label}
              href={item.href!}
              className={`tru-floating-nav-item ${isExpanded ? 'is-expanded' : ''}`}
            >
              <span className="tru-floating-nav-icon">
                <Icon className="w-5 h-5" />
              </span>
              <span className="tru-floating-nav-label">{item.label}</span>
            </a>
          );
        }

        return (
          <Link
            key={item.label}
            to={item.href!}
            className={`tru-floating-nav-item ${isActive ? 'is-active' : ''} ${isExpanded ? 'is-expanded' : ''}`}
          >
            <span className="tru-floating-nav-icon">
              <Icon className="w-5 h-5" />
            </span>
            <span className="tru-floating-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
