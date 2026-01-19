import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Sparkles, Shield, MessageSquare, MapPin, Video, Headphones } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider delayDuration={200}>
      <nav 
        className="tru-floating-nav"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {navItems.map((item) => {
          const isActive = item.href && location.pathname === item.href;
          const Icon = item.icon;
          
          const itemContent = (
            <>
              <span className="tru-floating-nav-icon">
                <Icon className="w-5 h-5" strokeWidth={2} />
              </span>
              <span className="tru-floating-nav-label">{item.label}</span>
            </>
          );

          const itemClasses = `tru-floating-nav-item ${isActive ? 'is-active' : ''} ${isExpanded ? 'is-expanded' : ''}`;
          
          let element: React.ReactNode;

          if (item.action === "chat") {
            element = (
              <button
                key={item.label}
                onClick={onChatOpen}
                className={itemClasses}
              >
                {itemContent}
              </button>
            );
          } else if (item.href?.startsWith("tel:")) {
            element = (
              <a
                key={item.label}
                href={item.href}
                className={itemClasses}
              >
                {itemContent}
              </a>
            );
          } else {
            element = (
              <Link
                key={item.label}
                to={item.href!}
                className={itemClasses}
              >
                {itemContent}
              </Link>
            );
          }

          // Only show tooltip when collapsed
          if (!isExpanded) {
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  {element}
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return element;
        })}
      </nav>
    </TooltipProvider>
  );
}
