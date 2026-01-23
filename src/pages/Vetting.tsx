import { useState } from "react";
import { Link } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import { 
  Shield, CheckCircle2, AlertTriangle, Search, ExternalLink, 
  Star, Truck, FileCheck, Activity, BadgeCheck, Eye, 
  Scale, UserCheck, TrendingUp, XCircle, ChevronRight
} from "lucide-react";
import previewImage from "@/assets/preview-carrier-vetting.jpg";

const VETTING_STEPS = [
  {
    step: 1,
    title: "Pre-screen",
    icon: UserCheck,
    description: "Business identity, years in business, service areas, and ownership verified."
  },
  {
    step: 2,
    title: "Compliance",
    icon: FileCheck,
    description: "USDOT / MC status, licensing, insurance, and safety record must meet TruMove standards."
  },
  {
    step: 3,
    title: "Reputation",
    icon: Star,
    description: "Reviews, complaints, and claims history screened across multiple sources."
  },
  {
    step: 4,
    title: "Live scoring",
    icon: TrendingUp,
    description: "On time rate, damages, and upcharges tracked on every TruMove job."
  }
];

const LEGAL_CHECKS = [
  "USDOT & MC active, not revoked",
  "Operating authority for household goods",
  "Safety rating and CSA scores",
  "Cargo & liability limits in force",
  "Worker's comp where required"
];

const REPUTATION_CHECKS = [
  "Google, Yelp, BBB review patterns",
  "Hostage load and scam indicators",
  "Damage & claim frequency",
  "On time pickup / delivery rates",
  "Surprise upcharge rate on move day"
];

const ZERO_TOLERANCE = [
  { title: "Hostage loads", desc: "Demanding more money after loading or refusing delivery." },
  { title: "Bait and switch", desc: "Large, unjustified increases far beyond the quoted range." },
  { title: "Safety violations", desc: "Unqualified drivers, hours abuse, or unsafe vehicles." },
  { title: "Fraudulent identity", desc: "Fake reviews, shell companies, or repeated reincarnations." },
  { title: "Chronic damage", desc: "Patterns showing customers consistently left unprotected." }
];

export default function Vetting() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<null | { company: string; usdot: string; status: string; homeBase: string }>(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchResult({
        company: "Example Moving Co.",
        usdot: "1234567",
        status: "Active",
        homeBase: "Miami, FL"
      });
    }
  };

  return (
    <SiteShell>
      <div className="tru-vetting-page">
        {/* Hero Section with Preview Card */}
        <section className="tru-vetting-hero">
          <div className="tru-vetting-hero-content">
            <div className="tru-vetting-badge">
              <Shield className="w-3.5 h-3.5" />
              <span>Trust & Safety</span>
            </div>
            
            <h1 className="tru-vetting-headline">
              Every Mover,
              <span className="tru-vetting-headline-accent">Heavily Vetted</span>
            </h1>
            
            <p className="tru-vetting-subheadline">
              We treat carrier selection like a safety and compliance problem, not just a sales one. 
              Every mover on TruMove is verified before they touch your stuff.
            </p>

            {/* Trust Pills */}
            <div className="tru-vetting-trust-pills">
              <div className="tru-vetting-pill">
                <CheckCircle2 className="w-4 h-4" />
                <span>FMCSA Verified</span>
              </div>
              <div className="tru-vetting-pill">
                <Shield className="w-4 h-4" />
                <span>Insurance Checked</span>
              </div>
              <div className="tru-vetting-pill">
                <Activity className="w-4 h-4" />
                <span>Live Scoring</span>
              </div>
            </div>

            <div className="tru-vetting-hero-cta">
              <Link to="/online-estimate" className="tru-vetting-primary-btn">
                Get Matched with Vetted Carriers
              </Link>
            </div>
          </div>

          {/* Hero Visual - Premium Preview Card */}
          <div className="tru-vetting-hero-visual">
            <div className="tru-vetting-preview-card">
              {/* Glow effects */}
              <div className="tru-vetting-preview-glow" />
              <div className="tru-vetting-preview-glow-secondary" />
              
              {/* Main preview image */}
              <div className="tru-vetting-preview-image-wrap">
                <img 
                  src={previewImage} 
                  alt="Carrier Vetting Dashboard Preview" 
                  className="tru-vetting-preview-image"
                />
                
                {/* Overlay gradient */}
                <div className="tru-vetting-preview-overlay" />
                
                {/* Floating verification badges */}
                <div className="tru-vetting-float-badge tru-vetting-badge-1">
                  <div className="tru-vetting-float-icon tru-vetting-icon-success">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="tru-vetting-float-content">
                    <span className="tru-vetting-float-title">USDOT Verified</span>
                    <span className="tru-vetting-float-meta">Active • No violations</span>
                  </div>
                </div>
                
                <div className="tru-vetting-float-badge tru-vetting-badge-2">
                  <div className="tru-vetting-float-icon tru-vetting-icon-success">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="tru-vetting-float-content">
                    <span className="tru-vetting-float-title">Insurance Active</span>
                    <span className="tru-vetting-float-meta">$1M Cargo • $750K Liability</span>
                  </div>
                </div>
                
                <div className="tru-vetting-float-badge tru-vetting-badge-3">
                  <div className="tru-vetting-float-icon tru-vetting-icon-warning">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div className="tru-vetting-float-content">
                    <span className="tru-vetting-float-title">Live Monitoring</span>
                    <span className="tru-vetting-float-meta">98.2% on-time rate</span>
                  </div>
                </div>

                {/* Score badge */}
                <div className="tru-vetting-score-badge">
                  <div className="tru-vetting-score-ring">
                    <span className="tru-vetting-score-value">A+</span>
                  </div>
                  <div className="tru-vetting-score-label">
                    <span>TruMove</span>
                    <span>Score</span>
                  </div>
                </div>
                
                {/* Stats bar */}
                <div className="tru-vetting-stats-bar">
                  <div className="tru-vetting-stat">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>847 carriers vetted</span>
                  </div>
                  <div className="tru-vetting-stat-divider" />
                  <div className="tru-vetting-stat">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>312 rejected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How a mover gets onto TruMove */}
        <section className="tru-vetting-section">
          <div className="tru-vetting-section-header">
            <span className="tru-vetting-section-eyebrow">Vetting Process</span>
            <h2 className="tru-vetting-section-title">How a Mover Gets Onto TruMove</h2>
            <p className="tru-vetting-section-desc">
              Before a mover is allowed on the platform, they go through a multi-step review. 
              Once approved, they are monitored on every job.
            </p>
          </div>
          
          <div className="tru-vetting-steps">
            {VETTING_STEPS.map((step, i) => (
              <div key={step.step} className="tru-vetting-step-wrapper">
                <div className="tru-vetting-step">
                  <div className="tru-vetting-step-number">{step.step}</div>
                  <div className="tru-vetting-step-icon">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="tru-vetting-step-title">{step.title}</h3>
                  <p className="tru-vetting-step-desc">{step.description}</p>
                </div>
                {i < VETTING_STEPS.length - 1 && (
                  <div className="tru-vetting-step-connector">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* What We Check */}
        <section className="tru-vetting-section tru-vetting-checks-section">
          <div className="tru-vetting-section-header">
            <span className="tru-vetting-section-eyebrow">Verification</span>
            <h2 className="tru-vetting-section-title">What We Check on Every Carrier</h2>
          </div>
          
          <div className="tru-vetting-checks-grid">
            <div className="tru-vetting-check-card">
              <div className="tru-vetting-check-header">
                <div className="tru-vetting-check-icon">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3>Legal, Safety & Insurance</h3>
              </div>
              <ul className="tru-vetting-check-list">
                {LEGAL_CHECKS.map((item) => (
                  <li key={item}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="tru-vetting-check-card">
              <div className="tru-vetting-check-header">
                <div className="tru-vetting-check-icon">
                  <Star className="w-5 h-5" />
                </div>
                <h3>Reputation & Performance</h3>
              </div>
              <ul className="tru-vetting-check-list">
                {REPUTATION_CHECKS.map((item) => (
                  <li key={item}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="tru-vetting-notice">
            <AlertTriangle className="w-4 h-4" />
            <p>If a carrier fails any hard rule, they never go live. If their score drops, they're removed from results.</p>
          </div>
        </section>

        {/* Zero Tolerance */}
        <section className="tru-vetting-section">
          <div className="tru-vetting-section-header">
            <span className="tru-vetting-section-eyebrow tru-vetting-eyebrow-danger">Zero Tolerance</span>
            <h2 className="tru-vetting-section-title">Instant Removal for Bad Behavior</h2>
          </div>
          
          <div className="tru-vetting-zero-grid">
            {ZERO_TOLERANCE.map((item, i) => (
              <div key={i} className="tru-vetting-zero-item">
                <div className="tru-vetting-zero-icon">
                  <XCircle className="w-4 h-4" />
                </div>
                <div className="tru-vetting-zero-content">
                  <span className="tru-vetting-zero-title">{item.title}</span>
                  <span className="tru-vetting-zero-desc">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Carrier Lookup */}
        <section className="tru-vetting-section tru-vetting-lookup-section">
          <div className="tru-vetting-lookup-grid">
            <div className="tru-vetting-lookup-card">
              <div className="tru-vetting-lookup-icon">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="tru-vetting-lookup-title">Check Any Mover's Public Record</h3>
              <p className="tru-vetting-lookup-desc">
                Look up a moving company by name or USDOT number. We'll show you core public info and links to official sources.
              </p>
              
              <div className="tru-vetting-search-wrap">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter company name or USDOT"
                  className="tru-vetting-search-input"
                />
                <button onClick={handleSearch} className="tru-vetting-search-btn">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
              
              <div className="tru-vetting-search-results">
                <div className="tru-vetting-result-row">
                  <span>Company</span>
                  <span>{searchResult?.company || "—"}</span>
                </div>
                <div className="tru-vetting-result-row">
                  <span>USDOT</span>
                  <span>{searchResult?.usdot || "—"}</span>
                </div>
                <div className="tru-vetting-result-row">
                  <span>Status</span>
                  <span className={searchResult?.status === "Active" ? "tru-vetting-status-active" : ""}>
                    {searchResult?.status || "—"}
                  </span>
                </div>
                <div className="tru-vetting-result-row">
                  <span>Home base</span>
                  <span>{searchResult?.homeBase || "—"}</span>
                </div>
              </div>
              
              {searchResult && (
                <div className="tru-vetting-result-links">
                  <a href="#"><ExternalLink className="w-3 h-3" /> FMCSA Record</a>
                  <a href="#"><ExternalLink className="w-3 h-3" /> Google Reviews</a>
                  <a href="#"><ExternalLink className="w-3 h-3" /> BBB Profile</a>
                </div>
              )}
            </div>

            <div className="tru-vetting-lookup-card tru-vetting-verify-card">
              <div className="tru-vetting-lookup-icon">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <h3 className="tru-vetting-lookup-title">Verify TruMove's Credentials</h3>
              <p className="tru-vetting-lookup-desc">
                You should be able to vet us just as easily as we vet carriers.
              </p>
              
              <div className="tru-vetting-search-results">
                <div className="tru-vetting-result-row">
                  <span>Legal entity</span>
                  <span>TruMove Inc.</span>
                </div>
                <div className="tru-vetting-result-row">
                  <span>USDOT</span>
                  <span>0000000</span>
                </div>
                <div className="tru-vetting-result-row">
                  <span>MC / FF</span>
                  <span>MC 000000</span>
                </div>
                <div className="tru-vetting-result-row">
                  <span>Primary office</span>
                  <span>City, State</span>
                </div>
              </div>
              
              <div className="tru-vetting-result-links">
                <a href="#"><ExternalLink className="w-3 h-3" /> TruMove on FMCSA</a>
                <a href="#"><ExternalLink className="w-3 h-3" /> TruMove on BBB</a>
                <a href="#"><ExternalLink className="w-3 h-3" /> TruMove on Google</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="tru-vetting-cta-section">
          <div className="tru-vetting-cta-card">
            <div className="tru-vetting-cta-glow" />
            <div className="tru-vetting-cta-icon">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="tru-vetting-cta-title">Ready to Book with Confidence?</h2>
            <p className="tru-vetting-cta-desc">
              Talk to a TruMove specialist and get matched with vetted carriers.
            </p>
            <div className="tru-vetting-cta-buttons">
              <Link to="/online-estimate" className="tru-vetting-submit-btn">
                Get an Estimate
              </Link>
              <Link to="/book" className="tru-vetting-alt-btn">
                Book a Consult
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
