import { useNavigate } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

export default function CompactCtaSection() {
  const navigate = useNavigate();

  return (
    <section className="tru-cta-compact">
      <div className="tru-cta-compact-inner">
        <h2 className="tru-cta-compact-title">Ready for a Better Move?</h2>
        <p className="tru-cta-compact-subtitle">
          Get matched with vetted carriers in minutes. No hidden fees, no corporate runaround.
        </p>
        <div className="tru-cta-compact-buttons">
          <button 
            className="tru-cta-compact-primary"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Build Your Quote
            <ArrowRight className="w-4 h-4" />
          </button>
          <a href="tel:+16097277647" className="tru-cta-compact-secondary">
            <Phone className="w-4 h-4" />
            Call (609) 727-7647
          </a>
        </div>
      </div>
    </section>
  );
}
