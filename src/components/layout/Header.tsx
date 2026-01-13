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
    <header className="sticky top-0 z-[80] bg-white/92 backdrop-blur-[10px] border-b border-border/40">
      <div className="max-w-[1480px] mx-auto px-[26px] py-[14px] grid grid-cols-[auto_1fr_auto] items-center gap-x-[26px]">
        <Link to="/" className="flex items-center flex-shrink-0" aria-label="TruMove Home">
          <img
            className="w-[280px] h-[62px] block"
            src={logo}
            alt="TruMove"
          />
        </Link>

        <nav className="flex justify-center items-center gap-[6px] flex-nowrap whitespace-nowrap min-w-0" aria-label="Primary">
          {NAV.map((item, idx) => (
            <div key={item.href} className="flex items-center gap-[6px]">
              <Link
                to={item.href}
                className={`group relative no-underline text-foreground text-[15px] tracking-[0.06em] font-medium py-[10px] px-[12px] whitespace-nowrap uppercase transition-all duration-200
                  ${location.pathname === item.href ? "text-foreground" : "text-foreground/70 hover:text-foreground"}
                `}
              >
                {item.label}
                <span 
                  className={`absolute left-[12px] right-[12px] bottom-[6px] h-[2px] bg-[hsl(142,76%,45%)] transition-transform duration-300 ease-out origin-left
                    ${location.pathname === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                  `}
                />
              </Link>
              {idx < NAV.length - 1 && (
                <span className="text-muted-foreground/40 text-[14px] font-light select-none">|</span>
              )}
            </div>
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
