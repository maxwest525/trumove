import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Sparkles, Shield, MessageSquare, MapPin, Video, Headphones, CheckCircle2, LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FloatingNavProps {
  onChatOpen?: () => void;
}

interface NavItemPreview {
  title: string;
  description: string;
  stats?: { label: string; value: string }[];
  badges?: string[];
  slots?: string[];
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string | null;
  action?: string;
  preview: NavItemPreview;
}

const navItems: NavItem[] = [
  { 
    icon: Sparkles, 
    label: "AI Estimator", 
    href: "/online-estimate",
    preview: {
      title: "AI Move Estimator",
      description: "Build your inventory visually and get instant cost estimates",
      stats: [
        { label: "Items", value: "150+" },
        { label: "Accuracy", value: "95%" }
      ]
    }
  },
  { 
    icon: Shield, 
    label: "Carrier Vetting", 
    href: "/vetting",
    preview: {
      title: "Carrier Verification",
      description: "FMCSA licensed, insured, and safety-verified movers",
      badges: ["FMCSA Licensed", "Insured", "Safety Verified"]
    }
  },
  { 
    icon: MessageSquare, 
    label: "AI Chat", 
    href: null, 
    action: "chat",
    preview: {
      title: "AI Move Assistant",
      description: "Get instant answers about your move, 24/7"
    }
  },
  { 
    icon: MapPin, 
    label: "Property Lookup", 
    href: "/property-lookup",
    preview: {
      title: "Property Data",
      description: "Instant bed/bath, sqft, and photos for any address"
    }
  },
  { 
    icon: Video, 
    label: "Video Consult", 
    href: "/book",
    preview: {
      title: "Video Consultation",
      description: "15-min free session with a TruMove specialist",
      slots: ["10:00 AM", "1:00 PM", "4:30 PM"]
    }
  },
  { 
    icon: Headphones, 
    label: "Call Us", 
    href: "tel:+16097277647",
    preview: {
      title: "Call (609) 727-7647",
      description: "Speak directly with our team"
    }
  },
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

          // Show rich preview tooltip when collapsed
          if (!isExpanded && item.preview) {
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  {element}
                </TooltipTrigger>
                <TooltipContent 
                  side="left" 
                  sideOffset={12}
                  className="tru-nav-tooltip-preview"
                >
                  <div className="tru-nav-preview">
                    <div className="tru-nav-preview-header">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="tru-nav-preview-title">{item.preview.title}</span>
                    </div>
                    <p className="tru-nav-preview-desc">{item.preview.description}</p>
                    {item.preview.stats && (
                      <div className="tru-nav-preview-stats">
                        {item.preview.stats.map((stat) => (
                          <div key={stat.label} className="tru-nav-preview-stat">
                            <span className="tru-nav-preview-stat-value">{stat.value}</span>
                            <span className="tru-nav-preview-stat-label">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {item.preview.badges && (
                      <div className="tru-nav-preview-badges">
                        {item.preview.badges.map((badge) => (
                          <span key={badge} className="tru-nav-preview-badge">
                            <CheckCircle2 className="w-3 h-3" />
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.preview.slots && (
                      <div className="tru-nav-preview-slots">
                        {item.preview.slots.map((slot) => (
                          <span key={slot} className="tru-nav-preview-slot">{slot}</span>
                        ))}
                      </div>
                    )}
                  </div>
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