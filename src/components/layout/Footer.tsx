import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-white">
      <div className="max-w-[1480px] mx-auto px-[22px] py-[24px] flex items-start justify-between gap-[16px] flex-wrap">
        <div className="flex flex-col gap-[6px]">
          <div className="font-extrabold text-foreground">TruMove</div>
          <div className="text-muted-foreground text-[13px] max-w-[420px]">
            AI-powered moving quotes and carrier coordination.
          </div>
        </div>

        <div className="flex gap-[14px] flex-wrap items-center">
          <Link className="no-underline text-foreground text-[13px] py-[8px] px-[10px] rounded-[10px] hover:bg-muted" to="/vetting">
            Carrier Standards
          </Link>
          <Link className="no-underline text-foreground text-[13px] py-[8px] px-[10px] rounded-[10px] hover:bg-muted" to="/book">
            Book a consult
          </Link>
          <Link className="no-underline text-foreground text-[13px] py-[8px] px-[10px] rounded-[10px] hover:bg-muted" to="/faq">
            FAQ
          </Link>
          <Link className="no-underline text-foreground text-[13px] py-[8px] px-[10px] rounded-[10px] hover:bg-muted" to="/privacy">
            Privacy
          </Link>
          <Link className="no-underline text-foreground text-[13px] py-[8px] px-[10px] rounded-[10px] hover:bg-muted" to="/terms">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
