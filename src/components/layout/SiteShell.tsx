import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Database, Activity, ClipboardCheck, Lock, Shield, ExternalLink, MapPin, TrendingUp, Headphones, Star, Truck, Award, BadgeCheck, FileCheck, Scale, Users, Clock, ThumbsUp } from "lucide-react";

const DATA_SOURCES = [
  { icon: Database, title: 'SAFER Web Services' },
  { icon: Activity, title: 'Real-Time Updates' },
  { icon: ClipboardCheck, title: 'CSA BASIC Scores' },
  { icon: Lock, title: 'Authority Verification' },
  { icon: Shield, title: 'Insurance Coverage' },
  { icon: BadgeCheck, title: 'FMCSA Registered' },
  { icon: FileCheck, title: 'DOT Verified' },
  { icon: Scale, title: 'Compliance Monitoring' },
  { icon: ExternalLink, title: 'Official FMCSA Source', isLink: true }
];

const STATS_CONTENT = [
  { icon: MapPin, title: 'Serving 48 States' },
  { icon: TrendingUp, title: '50,000+ Moves Completed' },
  { icon: Headphones, title: '24/7 Support' },
  { icon: Star, title: '4.9★ Customer Rating' },
  { icon: Truck, title: 'Licensed & Insured' },
  { icon: Award, title: 'A+ BBB Rating' },
  { icon: BadgeCheck, title: 'BBB Accredited' },
  { icon: Users, title: 'Family Owned Since 2010' },
  { icon: Clock, title: 'On-Time Guarantee' },
  { icon: ThumbsUp, title: '98% Satisfaction Rate' }
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
        <>
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
          
          {/* Second Ticker - Stats & Achievements */}
          <div className="tru-ticker-strip tru-ticker-stats">
            <div className="tru-ticker-track tru-ticker-track-reverse">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="tru-ticker-set">
                  {STATS_CONTENT.map((item, idx) => (
                    <div key={`${setIndex}-${idx}`} className="tru-ticker-item">
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
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
