import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Database, Activity, ClipboardCheck, Lock, Shield, ExternalLink } from "lucide-react";

const DATA_SOURCES = [
  { icon: Database, title: 'SAFER Web Services' },
  { icon: Activity, title: 'Real-Time Updates' },
  { icon: ClipboardCheck, title: 'CSA BASIC Scores' },
  { icon: Lock, title: 'Authority Verification' },
  { icon: Shield, title: 'Insurance Coverage' }
];

interface SiteShellProps {
  children: ReactNode;
  centered?: boolean;
  hideTrustStrip?: boolean;
}

export default function SiteShell({ children, centered = false, hideTrustStrip = false }: SiteShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* SAFER Trust Strip - Above EVERYTHING */}
      {!hideTrustStrip && (
        <div className="tru-safer-trust-bar">
          <div className="tru-safer-trust-bar-inner">
            {DATA_SOURCES.map((source) => (
              <div key={source.title} className="tru-safer-trust-item">
                <source.icon className="w-3.5 h-3.5" />
                <span>{source.title}</span>
              </div>
            ))}
            <a 
              href="https://safer.fmcsa.dot.gov/CompanySnapshot.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="tru-safer-trust-link"
            >
              Official FMCSA Source
              <ExternalLink className="w-3 h-3" />
            </a>
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
