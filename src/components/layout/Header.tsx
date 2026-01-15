import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles, Phone, Video } from "lucide-react";
import logo from "@/assets/logo.png";
import ChatModal from "@/components/chat/ChatModal";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/online-estimate", label: "Get Quote" },
  { href: "/property-lookup", label: "Property Lookup" },
  { href: "/vetting", label: "Carrier Vetting" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <header className="header-main">
        <div className="header-inner">
          {/* Logo */}
          <Link to="/" className="header-logo" aria-label="TruMove Home">
            <img src={logo} alt="TruMove" />
          </Link>

          {/* Desktop Nav */}
          <nav className="header-nav" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`header-nav-link ${location.pathname === item.href ? "is-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action Cluster - Centered */}
          <div className="header-actions">
            <button 
              type="button" 
              className="header-btn header-btn-chat"
              onClick={() => setChatOpen(true)}
              aria-label="Open AI Chat"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Chat</span>
            </button>
            <a href="tel:+16097277647" className="header-btn header-btn-call">
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </a>
            <Link to="/book" className="header-btn header-btn-primary">
              <Video className="w-4 h-4" />
              <span>Book Consult</span>
            </Link>
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
            </div>
          </div>
        )}
      </header>

      {/* Chat Modal */}
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
