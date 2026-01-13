import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/online-estimate", label: "Get an Estimate" },
  { href: "/vetting", label: "Carrier Standards" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className="bg-white/92 backdrop-blur-[10px] border-b border-border/40">
      <div className="max-w-[1480px] mx-auto px-[26px] py-[14px] grid grid-cols-[auto_1fr_auto] items-center gap-x-[26px]">
        <Link to="/" className="flex items-center flex-shrink-0" aria-label="TruMove Home">
          <img
            className="w-[280px] h-[62px] block"
            src={logo}
            alt="TruMove"
          />
        </Link>

        <nav className="flex justify-center gap-[26px] flex-nowrap whitespace-nowrap min-w-0" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`relative no-underline text-foreground text-[19.5px] tracking-[0.08em] font-medium py-[12px] px-[6px] whitespace-nowrap uppercase transition-all duration-150 
                ${location.pathname === item.href ? "opacity-100" : "opacity-[0.86] hover:opacity-100 hover:-translate-y-[1px]"}
                after:content-[''] after:absolute after:left-[4px] after:right-[4px] after:bottom-[6px] after:h-[2px] after:rounded-[2px] after:bg-primary after:origin-left after:transition-transform after:duration-[180ms]
                ${location.pathname === item.href ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-[10px] whitespace-nowrap flex-shrink-0">
          <a
            className="relative inline-flex items-center gap-[10px] h-[40px] px-[16px] rounded-full no-underline whitespace-nowrap text-[12.5px] font-semibold tracking-[0.1em] uppercase text-foreground border border-primary/40 bg-gradient-to-b from-primary/18 to-primary/6 shadow-[0_14px_30px_hsl(var(--tm-ink)/0.1),inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-150 hover:-translate-y-[1px] hover:border-primary/55 hover:shadow-[0_20px_44px_hsl(var(--tm-ink)/0.14),inset_0_1px_0_rgba(255,255,255,0.8)] hover:bg-gradient-to-b hover:from-white/94 hover:to-primary/8 before:content-[''] before:w-[10px] before:h-[10px] before:rounded-full before:bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,transparent_40%),radial-gradient(circle_at_center,hsl(var(--primary))_0%,hsl(var(--primary))_62%,hsl(var(--primary)/0.18)_100%)] before:shadow-[0_0_0_4px_hsl(var(--primary)/0.14)] before:flex-shrink-0"
            href="tel:+10000000000"
          >
            Call Us Now
          </a>
          <Link
            className="relative inline-flex items-center gap-[10px] h-[40px] px-[16px] rounded-full no-underline whitespace-nowrap text-[12.5px] font-semibold tracking-[0.1em] uppercase text-foreground border border-primary/40 bg-gradient-to-b from-primary/18 to-primary/6 shadow-[0_14px_30px_hsl(var(--tm-ink)/0.1),inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-150 hover:-translate-y-[1px] hover:border-primary/55 hover:shadow-[0_20px_44px_hsl(var(--tm-ink)/0.14),inset_0_1px_0_rgba(255,255,255,0.8)] hover:bg-gradient-to-b hover:from-white/94 hover:to-primary/8 before:content-[''] before:w-[10px] before:h-[10px] before:rounded-full before:bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,transparent_40%),radial-gradient(circle_at_center,hsl(var(--primary))_0%,hsl(var(--primary))_62%,hsl(var(--primary)/0.18)_100%)] before:shadow-[0_0_0_4px_hsl(var(--primary)/0.14)] before:flex-shrink-0"
            to="/book"
          >
            Book a Consult
          </Link>
        </div>
      </div>
    </header>
  );
}
