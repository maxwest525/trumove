import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, X, Phone, Video, ChevronDown, User,
  Calculator, Calendar, Home, Shield, Bed, Bath, Square, CheckCircle2, Clock, Scan
} from "lucide-react";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";

// Mega-menu preview components
const EstimatorPreview = () => (
  <div className="mega-menu-demo">
    <div className="mega-demo-rooms">
      <div className="mega-demo-room">
        <img 
          src="/inventory/living-room/sofa-3-cushion.png" 
          alt="Sofa" 
          className="mega-demo-room-img"
        />
        <span>Living Room</span>
      </div>
      <div className="mega-demo-room">
        <img 
          src="/inventory/bedroom/bed-queen.png" 
          alt="Bed" 
          className="mega-demo-room-img"
        />
        <span>Master Bedroom</span>
      </div>
      <div className="mega-demo-room">
        <img 
          src="/inventory/kitchen/kitchen-table.png" 
          alt="Kitchen Table" 
          className="mega-demo-room-img"
        />
        <span>Kitchen</span>
      </div>
    </div>
    <div className="mega-demo-stats">
      <div className="mega-demo-stat">
        <span className="mega-demo-stat-label">Est. Weight</span>
        <span className="mega-demo-stat-value">~4,200 lbs</span>
      </div>
      <div className="mega-demo-stat">
        <span className="mega-demo-stat-label">Est. Range</span>
        <span className="mega-demo-stat-value">$2,100–$2,800</span>
      </div>
    </div>
  </div>
);

const ConsultPreview = () => (
  <div className="mega-menu-slots">
    <div className="mega-slots-header">
      <span className="mega-slots-day is-active">Today</span>
      <span className="mega-slots-day">Tomorrow</span>
    </div>
    <div className="mega-slots-grid">
      <span className="mega-slot">10:00 AM</span>
      <span className="mega-slot">1:00 PM</span>
      <span className="mega-slot">4:30 PM</span>
      <span className="mega-slot is-popular">
        <Clock className="w-3 h-3" />
        11:30 AM
      </span>
    </div>
    <span className="mega-slots-more">+5 more slots available</span>
  </div>
);

const PropertyPreview = () => (
  <div className="mega-menu-property">
    <div className="mega-property-image">
      <Home className="w-8 h-8 text-foreground" />
    </div>
    <div className="mega-property-info">
      <span className="mega-property-address">123 Main St, Anytown</span>
      <div className="mega-property-stats">
        <span><Bed className="w-3 h-3" /> 3 bed</span>
        <span><Bath className="w-3 h-3" /> 2 bath</span>
        <span><Square className="w-3 h-3" /> 1,850 sqft</span>
      </div>
    </div>
  </div>
);

const VettingPreview = () => (
  <div className="mega-menu-vetting">
    <div className="mega-vetting-shield">
      <Shield className="w-10 h-10" />
    </div>
    <div className="mega-vetting-badges">
      <div className="mega-vetting-badge is-verified">
        <CheckCircle2 className="w-3 h-3" />
        FMCSA Licensed
      </div>
      <div className="mega-vetting-badge is-verified">
        <CheckCircle2 className="w-3 h-3" />
        Insurance Verified
      </div>
      <div className="mega-vetting-badge is-verified">
        <CheckCircle2 className="w-3 h-3" />
        Safety Record Clean
      </div>
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
    description: string;
    features: string[];
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
      description: "Build your inventory and get instant estimates",
      features: ["Visual item selection", "AI-powered suggestions", "Real-time pricing"],
      cta: "Start Your Estimate",
      PreviewComponent: EstimatorPreview
    },
    subItems: [
      {
        href: "/scan-room",
        label: "Scan Your Room",
        description: "Use your phone camera to auto-detect furniture",
        icon: Scan,
        badge: "Coming Soon"
      },
      {
        href: "/online-estimate",
        label: "Build Manually",
        description: "Select items from our visual inventory catalog",
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
      description: "15-min free session with a TruMove client advocate",
      features: ["No sales pressure", "Get answers fast", "Instant callback option"],
      cta: "Book Now",
      PreviewComponent: ConsultPreview
    }
  },
  { 
    href: "/track", 
    label: "Shipment Tracking",
    hasDropdown: true,
    dropdownContent: {
      icon: Home,
      title: "Shipment Tracking",
      description: "Track your moving truck in real-time",
      features: ["Live GPS tracking", "Route visualization", "Weather conditions"],
      cta: "Track Shipment",
      PreviewComponent: PropertyPreview
    }
  },
  { 
    href: "/carrier-vetting", 
    label: "Carrier Vetting",
    hasDropdown: true,
    dropdownContent: {
      icon: Shield,
      title: "FMCSA Carrier Vetting",
      description: "Real-time safety & compliance data from the Federal Motor Carrier Safety Administration",
      features: ["Live FMCSA data", "Insurance verification", "Side-by-side compare"],
      cta: "Vet a Carrier",
      PreviewComponent: VettingPreview
    }
  },
  { href: "/about", label: "About" },
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
                      {item.dropdownContent && (
                        <div className="mega-menu-header">
                          <item.dropdownContent.icon className="mega-menu-icon" />
                          <div className="mega-menu-text">
                            <h3>{item.dropdownContent.title}</h3>
                            <p>{item.dropdownContent.description}</p>
                          </div>
                        </div>
                      )}

                      {/* Sub-items for AI Estimator - Choose Your Method */}
                      {item.subItems && item.subItems.length > 0 && (
                        <div className="mega-menu-method-selector">
                          <span className="mega-menu-method-label">Choose Your Method</span>
                          <div className="mega-menu-method-options">
                            {item.subItems.map((subItem) => (
                              <Link 
                                key={subItem.href} 
                                to={subItem.href}
                                className="mega-menu-method-option"
                              >
                                <div className="mega-menu-method-icon">
                                  <subItem.icon className="w-5 h-5" />
                                </div>
                                <div className="mega-menu-method-content">
                                  <span className="mega-menu-method-title">
                                    {subItem.label}
                                    {subItem.badge && (
                                      <span className="mega-menu-method-badge">{subItem.badge}</span>
                                    )}
                                  </span>
                                  <span className="mega-menu-method-desc">{subItem.description}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Preview Component - show for items with subitems too */}
                      {item.dropdownContent && (
                        <item.dropdownContent.PreviewComponent />
                      )}

                      {/* Features List */}
                      {item.dropdownContent && item.dropdownContent.features.length > 0 && (
                        <ul className="mega-menu-features">
                          {item.dropdownContent.features.map(f => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                      )}

                      {/* CTA - only show if no subitems */}
                      {item.dropdownContent && !item.subItems && (
                        <Link to={item.dropdownContent.ctaHref || item.href} className="mega-menu-cta">
                          {item.dropdownContent.cta}
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
