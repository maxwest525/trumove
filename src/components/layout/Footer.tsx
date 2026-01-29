import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-[hsl(220_15%_8%)] relative z-[60]">
      <div className="max-w-[1480px] mx-auto px-[22px] py-[24px] flex items-start justify-between gap-[16px] flex-wrap">
        <div className="flex flex-col gap-[6px]">
          <div className="font-extrabold text-primary">TruMove</div>
          <div className="text-white/60 text-[13px] max-w-[420px]">
            AI-powered moving quotes and carrier coordination.
          </div>
        </div>

        <div className="flex gap-[14px] flex-wrap items-center">
          <Link className="no-underline text-white/80 text-[13px] py-[8px] px-[10px] rounded-[10px] hover:bg-primary/10 hover:text-primary transition-colors" to="/carrier-vetting">
            Carrier Vetting
          </Link>
          <Link className="no-underline text-white/80 text-[13px] py-[8px] px-[10px] rounded-[10px] hover:bg-primary/10 hover:text-primary transition-colors" to="/book">
            Book a consult
          </Link>
          <Link className="no-underline text-white/80 text-[13px] py-[8px] px-[10px] rounded-[10px] hover:bg-primary/10 hover:text-primary transition-colors" to="/faq">
            FAQ
          </Link>
          <Link className="no-underline text-white/80 text-[13px] py-[8px] px-[10px] rounded-[10px] hover:bg-primary/10 hover:text-primary transition-colors" to="/privacy">
            Privacy
          </Link>
          <Link className="no-underline text-white/80 text-[13px] py-[8px] px-[10px] rounded-[10px] hover:bg-primary/10 hover:text-primary transition-colors" to="/terms">
            Terms
          </Link>
          <Link className="no-underline text-white/50 text-[13px] py-[8px] px-[10px] rounded-[10px] hover:bg-primary/10 hover:text-white/70 transition-colors" to="/classic">
            Classic
          </Link>
        </div>
      </div>
    </footer>
  );
}
