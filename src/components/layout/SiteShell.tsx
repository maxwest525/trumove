import { ReactNode } from "react";
import StatusStrip from "./StatusStrip";
import Header from "./Header";
import TrustStrip from "./TrustStrip";
import Footer from "./Footer";

interface SiteShellProps {
  children: ReactNode;
}

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground font-sans">
      <StatusStrip />
      <Header />
      <TrustStrip />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
