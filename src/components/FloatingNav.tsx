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
          
          if (item.action === "chat") {
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <button
                    onClick={onChatOpen}
                    className={`tru-floating-nav-item ${isExpanded ? 'is-expanded' : ''}`}
                  >
                    <span className="tru-floating-nav-icon">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="tru-floating-nav-label">{item.label}</span>
                  </button>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="left">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          }

          const isExternal = item.href?.startsWith("tel:");
          
          if (isExternal) {
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <a
                    href={item.href!}
                    className={`tru-floating-nav-item ${isExpanded ? 'is-expanded' : ''}`}
                  >
                    <span className="tru-floating-nav-icon">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="tru-floating-nav-label">{item.label}</span>
                  </a>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="left">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          }

          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Link
                  to={item.href!}
                  className={`tru-floating-nav-item ${isActive ? 'is-active' : ''} ${isExpanded ? 'is-expanded' : ''}`}
                >
                  <span className="tru-floating-nav-icon">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="tru-floating-nav-label">{item.label}</span>
                </Link>
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="left">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
