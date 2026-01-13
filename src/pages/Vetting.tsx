import { useState } from "react";
import { Link } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import { Shield, CheckCircle2, AlertTriangle, Search, ExternalLink, Star, Truck, FileCheck, Activity } from "lucide-react";

const VETTING_STEPS = [
  {
    step: 1,
    title: "Pre-screen",
    description: "Business identity, years in business, service areas, and ownership verified."
  },
  {
    step: 2,
    title: "Compliance",
    description: "USDOT / MC status, licensing, insurance, and safety record must meet TruMove standards."
  },
  {
    step: 3,
    title: "Reputation",
    description: "Reviews, complaints, and claims history screened across multiple sources."
  },
  {
    step: 4,
    title: "Live scoring",
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
  "Hostage loads or extortion – demanding more money after loading or refusing delivery.",
  "Systematic bait and switch pricing – large, unjustified increases far beyond the quoted range.",
  "Serious safety violations – unqualified drivers, blatant hours of service abuse, or unsafe vehicles.",
  "Fraudulent reviews or identities – fake review farms, shell companies, or repeated reincarnations.",
  "Chronic damage and unpaid claims – patterns that show customers consistently being left unprotected."
];

export default function Vetting() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<null | { company: string; usdot: string; status: string; homeBase: string }>(null);

  const handleSearch = () => {
    // Placeholder - in real app would call API
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
      <div className="max-w-[1480px] mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            Carrier Vetting
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Every mover on TruMove is heavily vetted before they touch your stuff. We treat carrier selection like a safety and compliance problem, not just a sales one.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-card text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              FMCSA & USDOT verified carriers
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-card text-sm font-semibold">
              <Shield className="w-4 h-4 text-primary" />
              Insurance & safety record checks
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-card text-sm font-semibold">
              <Star className="w-4 h-4 text-primary" />
              Live review & claims monitoring
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-card text-sm font-semibold">
              <Activity className="w-4 h-4 text-primary" />
              AI risk scoring on every job
            </div>
          </div>
        </div>

        {/* How a mover gets onto TruMove */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-foreground mb-4">How a mover gets onto TruMove</h2>
          <p className="text-muted-foreground mb-8 max-w-4xl">
            TruMove does not just add every carrier that knocks on the door. Before a mover is allowed on the platform, they go through a multi-step review that looks at who they are, how they operate, and how they have treated customers in the past. Once approved, they are monitored on every job. If their performance slips or risk signals pop up, they are pushed down in results or removed entirely.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {VETTING_STEPS.map((step) => (
              <div key={step.step} className="p-5 rounded-xl border border-border/60 bg-card">
                <div className="w-10 h-10 rounded-full bg-foreground text-background text-lg font-bold flex items-center justify-center mb-3">
                  {step.step}
                </div>
                <div className="text-sm font-bold text-foreground mb-2">{step.title}</div>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What We Check */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-foreground mb-4">What we check on every carrier</h2>
          <p className="text-muted-foreground mb-8">
            Here is a snapshot of the data that flows into TruMove's carrier score before a mover is ever shown in your quotes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border/60 bg-card">
              <div className="flex items-center gap-2 mb-4">
                <FileCheck className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Legal, safety & insurance</h3>
              </div>
              <ul className="space-y-2">
                {LEGAL_CHECKS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 rounded-xl border border-border/60 bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Reputation & performance</h3>
              </div>
              <ul className="space-y-2">
                {REPUTATION_CHECKS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl">
            If a carrier fails any hard rule, they never go live on TruMove. If their live score drops below our threshold, they are automatically removed from customer facing results until issues are resolved.
          </p>
        </section>

        {/* Carrier Lookup */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-border/60 bg-card">
              <h3 className="text-xl font-black text-foreground mb-2">Check any mover's public record.</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Use this tool to look up a moving company by name or USDOT number. We will show you the core public info and links to the official federal record and external reviews.
              </p>
              
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter company name or USDOT number"
                  className="flex-1 h-12 px-4 rounded-xl border border-border/60 bg-background text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="h-12 px-6 rounded-xl bg-foreground text-background text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground mb-6">
                This is a convenience lookup that surfaces public data. For full details we always link you to official sources.
              </p>
              
              <div className="space-y-3 p-4 rounded-xl bg-muted/30">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Company</span>
                  <span className="text-sm font-semibold">{searchResult?.company || "Waiting for a search…"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">USDOT</span>
                  <span className="text-sm font-semibold">{searchResult?.usdot || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-semibold">{searchResult?.status || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Home base</span>
                  <span className="text-sm font-semibold">{searchResult?.homeBase || "—"}</span>
                </div>
              </div>
              
              {searchResult && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href="#" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                    View on FMCSA (SAFER) <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="#" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                    View Google Reviews <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="#" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                    View BBB Profile <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-6 rounded-xl border border-border/60 bg-card">
              <h3 className="text-xl font-black text-foreground mb-2">Verify TruMove's own credentials.</h3>
              <p className="text-sm text-muted-foreground mb-6">
                You should be able to vet us just as easily as we vet carriers. Here are TruMove's credentials and where to verify them directly.
              </p>
              
              <div className="space-y-3 p-4 rounded-xl bg-muted/30 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Legal entity</span>
                  <span className="text-sm font-semibold">TruMove Inc.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">USDOT</span>
                  <span className="text-sm font-semibold">0000000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">MC / FF</span>
                  <span className="text-sm font-semibold">MC 000000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Primary office</span>
                  <span className="text-sm font-semibold">City, State</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <a href="#" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                  View TruMove on FMCSA <ExternalLink className="w-3 h-3" />
                </a>
                <a href="#" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                  View TruMove on BBB <ExternalLink className="w-3 h-3" />
                </a>
                <a href="#" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                  View TruMove on Google <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Zero Tolerance */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-foreground mb-4">Zero tolerance for bad behavior.</h2>
          <p className="text-muted-foreground mb-6">
            TruMove has written rules that every carrier agrees to before they ever see a job. Certain behavior gets an immediate suspension or permanent removal from the platform.
          </p>
          
          <div className="space-y-3">
            {ZERO_TOLERANCE.map((item) => (
              <div key={item} className="flex items-start gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                <span className="w-2 h-2 rounded-full bg-destructive flex-shrink-0 mt-2" />
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Incident Response */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-foreground mb-4">When something goes wrong.</h2>
          <p className="text-muted-foreground mb-6">
            If a carrier has an issue mid-job, TruMove follows a structured response process.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: 1, title: "Report received", desc: "Customer or carrier flags the issue." },
              { step: 2, title: "Initial review", desc: "Ops team reviews within 24 hours." },
              { step: 3, title: "Resolution path", desc: "Mediation, carrier action, or removal." },
              { step: 4, title: "Score update", desc: "Incident affects future scoring." }
            ].map((item) => (
              <div key={item.step} className="p-5 rounded-xl border border-border/60 bg-card">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center mb-3">
                  {item.step}
                </div>
                <div className="text-sm font-bold text-foreground mb-1">{item.title}</div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-black text-foreground mb-4">Ready to book with confidence?</h2>
          <p className="text-muted-foreground mb-6">
            Talk to a TruMove specialist and get matched with vetted carriers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/online-estimate"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-foreground text-background text-sm font-bold tracking-wide uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get an Estimate
            </Link>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-border/60 bg-card text-foreground text-sm font-bold tracking-wide uppercase transition-all hover:bg-muted/50"
            >
              Book a Consult
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
