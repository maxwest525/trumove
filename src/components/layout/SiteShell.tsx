import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface SiteShellProps {
  children: ReactNode;
  centered?: boolean;
}

export default function SiteShell({ children, centered = false }: SiteShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <div className="sticky top-0 z-[90]">
        <Header />
      </div>
      <main className={`flex-1 w-full ${centered ? 'flex flex-col justify-center' : ''}`}>{children}</main>
      <Footer />
    </div>
  );
}
