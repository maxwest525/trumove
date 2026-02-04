import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, X, Phone, Video, ChevronDown, User,
  Calculator, Calendar, MapPin, Shield, Scan, ArrowRight
} from "lucide-react";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";

// Import preview images
import previewAiScanner from "@/assets/preview-ai-scanner.jpg";
import previewVideoConsult from "@/assets/preview-video-consult.jpg";
import previewPropertyLookup from "@/assets/preview-property-lookup.jpg";
import previewCarrierVetting from "@/assets/preview-carrier-vetting.jpg";

// Mega-menu preview components - Image-based with feature highlights
const EstimatorPreview = () => (
  <div className="mega-preview-card">
    <div className="mega-preview-image">
      <img src={previewAiScanner} alt="AI Move Estimator" />
      <div className="mega-preview-overlay">
        <span className="mega-preview-badge">Live Demo</span>
      </div>
    </div>
    <div className="mega-preview-caption">
      <span className="mega-preview-highlight">Scan any room → Instant inventory</span>
    </div>
  </div>
);

const ConsultPreview = () => (
  <div className="mega-preview-card">
    <div className="mega-preview-image">
      <img src={previewVideoConsult} alt="Video Consultation" />
      <div className="mega-preview-overlay">
        <span className="mega-preview-live">
          <span className="mega-live-dot" />
          Available Now
        </span>
      </div>
    </div>
    <div className="mega-preview-caption">
      <span className="mega-preview-highlight">Talk to a real person, not a bot</span>
    </div>
  </div>
);

const TrackingPreview = () => (
  <div className="mega-preview-card">
    <div className="mega-preview-image">
      <img src={previewPropertyLookup} alt="Live Tracking" />
      <div className="mega-preview-overlay">
        <span className="mega-preview-badge">Real-time GPS</span>
      </div>
    </div>
    <div className="mega-preview-caption">
      <span className="mega-preview-highlight">Know exactly where your belongings are</span>
    </div>
  </div>
);

const VettingPreview = () => (
  <div className="mega-preview-card">
    <div className="mega-preview-image">
      <img src={previewCarrierVetting} alt="Carrier Vetting" />
      <div className="mega-preview-overlay">
        <span className="mega-preview-badge">FMCSA Data</span>
      </div>
    </div>
    <div className="mega-preview-caption">
      <span className="mega-preview-highlight">Verify any mover's safety record</span>
    </div>
  </div>
);

interface NavItem {
  href: string;
  label: string;
  hasDropdown?: boolean;
  subItems?: SubNavItem[];
  dropdownContent?: {
    icon: React.ElementType;
    title: string;
    tagline: string;
    cta: string;
    ctaHref?: string;
    PreviewComponent: React.FC;
  };
}

interface SubNavItem {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { 
    href: "/online-estimate", 
    label: "AI Move Estimator",
    hasDropdown: true,
    dropdownContent: {
      icon: Calculator,
      title: "AI Move Estimator",
      tagline: "Point. Scan. Price.",
      cta: "Try It Now",
      PreviewComponent: EstimatorPreview
    },
    subItems: [
      {
        href: "/scan-room",
        label: "Scan Your Room",
        description: "AI auto-detects your furniture",
        icon: Scan,
        badge: "Beta"
      },
      {
        href: "/online-estimate",
        label: "Build Manually",
        description: "Pick from 200+ items",
        icon: Calculator
      }
    ]
  },
  { 
    href: "/book", 
    label: "Connect With Us",
    hasDropdown: true,
    dropdownContent: {
      icon: Calendar,
      title: "Connect With Us",
      tagline: "Real humans. Zero pressure.",
      cta: "Schedule Free Call",
      PreviewComponent: ConsultPreview
    }
  },
  { 
    href: "/track", 
    label: "Shipment Tracking",
    hasDropdown: true,
    dropdownContent: {
      icon: MapPin,
      title: "Live Tracking",
      tagline: "GPS + Weather + ETA",
      cta: "Track Shipment",
      PreviewComponent: TrackingPreview
    }
  },
  { 
    href: "/carrier-vetting", 
    label: "Carrier Vetting",
    hasDropdown: true,
    dropdownContent: {
      icon: Shield,
      title: "Carrier Vetting",
      tagline: "FMCSA verified. Instant results.",
      cta: "Check Any Mover",
      PreviewComponent: VettingPreview
    }
  },
];

interface HeaderProps {
  whiteLogo?: boolean;
}

export default function Header({ whiteLogo = false }: HeaderProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener for enhanced shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`header-main header-floating ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner">
          {/* Logo */}
          <Link to="/" className="header-logo" aria-label="TruMove Home">
            <img src={logo} alt="TruMove" className={whiteLogo ? "brightness-0 invert" : ""} />
          </Link>

          {/* Desktop Nav with Mega-Menus */}
          <nav className="header-nav" aria-label="Primary">
            {NAV.map((item) => (
              <div 
                key={item.href}
                className="header-nav-item"
                onMouseEnter={() => item.hasDropdown && setActiveMenu(item.href)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to={item.href}
                  className={`header-nav-link ${location.pathname === item.href ? "is-active" : ""}`}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-3 h-3 header-nav-chevron" />}
                </Link>

                {/* Mega-Menu Dropdown */}
                {item.hasDropdown && activeMenu === item.href && (
                  <div className="header-mega-menu">
                    <div className="mega-menu-content">
                      {/* Preview Component - visual first */}
                      {item.dropdownContent && (
                        <item.dropdownContent.PreviewComponent />
                      )}

                      {/* Compact Header */}
                      {item.dropdownContent && (
                        <div className="mega-menu-header-compact">
                          <div className="mega-menu-title-row">
                            <item.dropdownContent.icon className="w-4 h-4" />
                            <h3>{item.dropdownContent.title}</h3>
                          </div>
                          <span className="mega-menu-tagline">{item.dropdownContent.tagline}</span>
                        </div>
                      )}

                      {/* Sub-items for AI Estimator */}
                      {item.subItems && item.subItems.length > 0 && (
                        <div className="mega-menu-methods-compact">
                          {item.subItems.map((subItem) => (
                            <Link 
                              key={subItem.href} 
                              to={subItem.href}
                              className="mega-method-pill"
                            >
                              <subItem.icon className="w-4 h-4" />
                              <span>{subItem.label}</span>
                              {subItem.badge && (
                                <span className="mega-method-badge">{subItem.badge}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* CTA - only show if no subitems */}
                      {item.dropdownContent && !item.subItems && (
                        <Link to={item.dropdownContent.ctaHref || item.href} className="mega-menu-cta-compact">
                          <span>{item.dropdownContent.cta}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Cluster */}
          <div className="header-actions">
            <a href="tel:+16097277647" className="header-btn header-btn-call">
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </a>
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            type="button" 
            className="header-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Agent Login Button - Absolute Far Right (outside header-inner) */}
        <Link 
          to="/agent-login" 
          className="header-btn header-btn-agent"
          aria-label="Agent Login"
        >
          <User className="w-4 h-4" />
          <span>Agent Login</span>
        </Link>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="header-mobile-menu">
            <nav className="header-mobile-nav">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`header-mobile-link ${location.pathname === item.href ? "is-active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="header-mobile-actions">
              <a href="tel:+16097277647" className="header-mobile-btn">
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>
              <Link 
                to="/book" 
                className="header-mobile-btn is-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Video className="w-4 h-4" />
                <span>Book Video Consult</span>
              </Link>
              {/* Agent Login Button (Mobile) */}
              <Link 
                to="/agent-login" 
                className="header-mobile-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Agent Login</span>
              </Link>
              {/* Theme Toggle (Mobile) */}
              <div className="flex justify-center pt-4 border-t border-border/40 mt-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
