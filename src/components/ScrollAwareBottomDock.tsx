import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Sparkles, Shield, MessageSquare, MapPin, Video, Headphones, LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScrollAwareBottomDockProps {
  onChatOpen?: () => void;
  heroRef?: React.RefObject<HTMLElement | null>;
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string | null;
  action?: string;
}

const navItems: NavItem[] = [
  { icon: Sparkles, label: "AI Estimator", href: "/online-estimate" },
  { icon: Shield, label: "Carrier Vetting", href: "/vetting" },
  { icon: MessageSquare, label: "AI Chat", href: null, action: "chat" },
  { icon: MapPin, label: "Property Lookup", href: "/property-lookup" },
  { icon: Video, label: "Video Consult", href: "/book" },
  { icon: Headphones, label: "Call Us", href: "tel:+16097277647" },
];

export default function ScrollAwareBottomDock({ onChatOpen, heroRef }: ScrollAwareBottomDockProps) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef?.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        // Show dock when hero is scrolled past (hero bottom is above viewport top)
        setIsVisible(heroBottom < 100);
      } else {
        // Fallback: show after scrolling 500px
        setIsVisible(window.scrollY > 500);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroRef]);

  const renderNavItem = (item: NavItem) => {
    const isActive = item.href && location.pathname === item.href;
    const Icon = item.icon;

    const content = (
      <>
        <Icon className="w-5 h-5" strokeWidth={2} />
        <span className="tru-dock-label">{item.label}</span>
      </>
    );

    let element: React.ReactNode;

    if (item.action === "chat") {
      element = (
        <button
          key={item.label}
          onClick={onChatOpen}
          className={`tru-dock-item ${isActive ? 'is-active' : ''}`}
        >
          {content}
        </button>
      );
    } else if (item.href?.startsWith("tel:")) {
      element = (
        <a
          key={item.label}
          href={item.href}
          className={`tru-dock-item ${isActive ? 'is-active' : ''}`}
        >
          {content}
        </a>
      );
    } else {
      element = (
        <Link
          key={item.label}
          to={item.href!}
          className={`tru-dock-item ${isActive ? 'is-active' : ''}`}
        >
          {content}
        </Link>
      );
    }

    return (
      <Tooltip key={item.label}>
        <TooltipTrigger asChild>
          {element}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="bg-card border border-border text-foreground text-xs font-medium px-3 py-1.5"
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <nav className={`tru-bottom-dock ${isVisible ? 'is-visible' : ''}`}>
      <div className="tru-bottom-dock-inner">
        {navItems.map(renderNavItem)}
      </div>
    </nav>
  );
}
