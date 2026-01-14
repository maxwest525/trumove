import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface SiteShellProps {
  children: ReactNode;
}

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <div className="sticky top-0 z-[90]">
        <Header />
      </div>
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
