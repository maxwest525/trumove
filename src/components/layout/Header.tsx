import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, X, Sparkles, Phone, Video, ChevronDown, Sun, Moon,
  Calculator, Calendar, Home, Shield, Bed, Bath, Square, CheckCircle2, Clock
} from "lucide-react";
import { useTheme } from "next-themes";
import logo from "@/assets/logo.png";
import ChatModal from "@/components/chat/ChatModal";

// Mega-menu preview components
const EstimatorPreview = () => (
  <div className="mega-menu-demo">
    <div className="mega-demo-rooms">
      <div className="mega-demo-room">
        <span className="mega-demo-room-icon">🛋️</span>
        <span>Living Room</span>
      </div>
      <div className="mega-demo-room">
        <span className="mega-demo-room-icon">🛏️</span>
        <span>Master Bedroom</span>
      </div>
      <div className="mega-demo-room">
        <span className="mega-demo-room-icon">🍳</span>
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
      <Home className="w-8 h-8" />
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
  dropdownContent?: {
    icon: React.ElementType;
    title: string;
    description: string;
    features: string[];
    cta: string;
    PreviewComponent: React.FC;
  };
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
      description: "Get an instant estimate powered by room-by-room AI inventory",
      features: ["Room-by-room inventory", "Real-time pricing", "Compare carriers"],
      cta: "Start Your Estimate",
      PreviewComponent: EstimatorPreview
    }
  },
  { 
    href: "/book", 
    label: "Book Video Consult",
    hasDropdown: true,
    dropdownContent: {
      icon: Calendar,
      title: "Book Video Consult",
      description: "15-min free session with a TruMove client advocate",
      features: ["Free consultation", "Expert guidance", "Personalized plan"],
      cta: "Book Now",
      PreviewComponent: ConsultPreview
    }
  },
  { 
    href: "/property-lookup", 
    label: "Property Lookup",
    hasDropdown: true,
    dropdownContent: {
      icon: Home,
      title: "Property Lookup",
      description: "Instant data on any US address",
      features: ["Bed/bath counts", "Square footage", "Property photos"],
      cta: "Look Up Property",
      PreviewComponent: PropertyPreview
    }
  },
  { 
    href: "/vetting", 
    label: "Carrier Vetting",
    hasDropdown: true,
    dropdownContent: {
      icon: Shield,
      title: "Carrier Vetting",
      description: "Verify any mover's credentials instantly",
      features: ["FMCSA verification", "Insurance check", "Safety records"],
      cta: "Vet a Mover",
      PreviewComponent: VettingPreview
    }
  },
  { href: "/about", label: "About" },
];

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll listener for enhanced shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header className={`header-main header-floating ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner">
          {/* Logo */}
          <Link to="/" className="header-logo" aria-label="TruMove Home">
            <img src={logo} alt="TruMove" />
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
                {item.hasDropdown && item.dropdownContent && activeMenu === item.href && (
                  <div className="header-mega-menu">
                    <div className="mega-menu-content">
                      <div className="mega-menu-header">
                        <item.dropdownContent.icon className="mega-menu-icon" />
                        <div className="mega-menu-text">
                          <h3>{item.dropdownContent.title}</h3>
                          <p>{item.dropdownContent.description}</p>
                        </div>
                      </div>

                      {/* Preview Component */}
                      <item.dropdownContent.PreviewComponent />

                      {/* Features List */}
                      <ul className="mega-menu-features">
                        {item.dropdownContent.features.map(f => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Link to={item.href} className="mega-menu-cta">
                        {item.dropdownContent.cta}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Cluster */}
          <div className="header-actions">
            <button 
              type="button" 
              className="header-btn header-btn-chat has-glow"
              onClick={() => setChatOpen(true)}
              aria-label="Open AI Chat"
            >
              <Sparkles className="w-4 h-4 sparkles-icon" />
              <span>AI Chat</span>
            </button>
            <a href="tel:+16097277647" className="header-btn header-btn-call">
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </a>
            
            {/* Dark Mode Toggle */}
            {mounted && (
              <button 
                type="button" 
                className="header-btn header-btn-theme"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 theme-icon" />
                ) : (
                  <Moon className="w-4 h-4 theme-icon" />
                )}
              </button>
            )}
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
              <button 
                type="button" 
                className="header-mobile-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setChatOpen(true);
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Chat</span>
              </button>
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
              {/* Mobile Theme Toggle */}
              {mounted && (
                <button 
                  type="button" 
                  className="header-mobile-btn"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="w-4 h-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Chat Modal */}
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
