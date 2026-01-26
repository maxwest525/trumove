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
}

export default function SiteShell({ children, centered = false }: SiteShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <div className="sticky top-0 z-[90]">
        <Header />
        {/* Trust Strip - Below Header */}
        <div className="tru-header-trust-strip">
          <div className="tru-header-trust-strip-inner">
            {DATA_SOURCES.map((source) => (
              <div key={source.title} className="tru-header-trust-item">
                <source.icon className="w-3.5 h-3.5" />
                <span>{source.title}</span>
              </div>
            ))}
            <a 
              href="https://safer.fmcsa.dot.gov/CompanySnapshot.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="tru-header-trust-link"
            >
              Official FMCSA Source
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
      <main className={`flex-1 w-full ${centered ? 'flex flex-col justify-center' : ''}`}>{children}</main>
      <Footer />
    </div>
  );
}
