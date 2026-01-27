import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Database, Activity, ClipboardCheck, Lock, Shield, ExternalLink } from "lucide-react";

const DATA_SOURCES = [
  { icon: Database, title: 'SAFER Web Services' },
  { icon: Activity, title: 'Real-Time Updates' },
  { icon: ClipboardCheck, title: 'CSA BASIC Scores' },
  { icon: Lock, title: 'Authority Verification' },
  { icon: Shield, title: 'Insurance Coverage' },
  { icon: ExternalLink, title: 'Official FMCSA Source', isLink: true }
];

interface SiteShellProps {
  children: ReactNode;
  centered?: boolean;
  hideTrustStrip?: boolean;
}

export default function SiteShell({ children, centered = false, hideTrustStrip = false }: SiteShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* SAFER Trust Strip - Infinite Scroll Ticker */}
      {!hideTrustStrip && (
        <div className="tru-ticker-strip">
          <div className="tru-ticker-track">
            {/* Render items twice for seamless loop */}
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="tru-ticker-set">
                {DATA_SOURCES.map((source, idx) => (
                  source.isLink ? (
                    <a 
                      key={`${setIndex}-${idx}`}
                      href="https://safer.fmcsa.dot.gov/CompanySnapshot.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tru-ticker-item tru-ticker-link"
                    >
                      <source.icon className="w-3.5 h-3.5" />
                      <span>{source.title}</span>
                    </a>
                  ) : (
                    <div key={`${setIndex}-${idx}`} className="tru-ticker-item">
                      <source.icon className="w-3.5 h-3.5" />
                      <span>{source.title}</span>
                    </div>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-[90]">
        <Header />
      </div>
      <main className={`flex-1 w-full ${centered ? 'flex flex-col justify-center' : ''}`}>{children}</main>
      <Footer />
    </div>
  );
}
