import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import SaferTrustStrip from "@/components/SaferTrustStrip";

interface SiteShellProps {
  children: ReactNode;
  centered?: boolean;
  hideTrustStrip?: boolean;
}

export default function SiteShell({ children, centered = false, hideTrustStrip = false }: SiteShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Sticky Header + Trust Strip Together - solid background with gradient fade */}
      <div className="sticky top-0 z-[90]">
        <div className="bg-background pt-2 px-6 pb-[25px]">
          <Header />
          {!hideTrustStrip && <SaferTrustStrip />}
        </div>
        {/* Gradient fade for soft transition */}
        <div className="h-6 bg-gradient-to-b from-background to-transparent -mt-6 pointer-events-none" />
      </div>
      <main className={`flex-1 w-full ${centered ? 'flex flex-col justify-center' : ''}`}>{children}</main>
      <Footer />
    </div>
  );
}
