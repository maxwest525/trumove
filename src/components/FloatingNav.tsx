import { useLocation, Link } from "react-router-dom";
import { Sparkles, Shield, MessageSquare, MapPin, Video, Headphones, LucideIcon } from "lucide-react";

interface FloatingNavProps {
  onChatOpen?: () => void;
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

export default function FloatingNav({ onChatOpen }: FloatingNavProps) {
  const location = useLocation();

  return (
    <nav className="tru-static-nav-menu">
      {navItems.map((item) => {
        const isActive = item.href && location.pathname === item.href;
        const Icon = item.icon;
        
        const itemContent = (
          <>
            <Icon className="w-4 h-4" strokeWidth={2} />
            <span>{item.label}</span>
          </>
        );

        const itemClasses = `tru-static-nav-item ${isActive ? 'is-active' : ''}`;

        if (item.action === "chat") {
          return (
            <button
              key={item.label}
              onClick={onChatOpen}
              className={itemClasses}
            >
              {itemContent}
            </button>
          );
        }
        
        if (item.href?.startsWith("tel:")) {
          return (
            <a
              key={item.label}
              href={item.href}
              className={itemClasses}
            >
              {itemContent}
            </a>
          );
        }
        
        return (
          <Link
            key={item.label}
            to={item.href!}
            className={itemClasses}
          >
            {itemContent}
          </Link>
        );
      })}
    </nav>
  );
}
