import { Shield, BadgeCheck, Truck, Lock, CreditCard, Award } from "lucide-react";

const BADGES = [
  { icon: Shield, label: "FMCSA Verified", desc: "Every carrier checked" },
  { icon: BadgeCheck, label: "USDOT Compliant", desc: "Federal standards met" },
  { icon: Truck, label: "Bonded & Insured", desc: "Your move protected" },
  { icon: Lock, label: "TLS Encrypted", desc: "Bank-level security" },
  { icon: CreditCard, label: "Secure Payments", desc: "Protected transactions" },
  { icon: Award, label: "Licensed Broker", desc: "MC-1556991" }
];

export default function TrustBadgesSection() {
  return (
    <section className="tru-trust-badges-section">
      <div className="tru-trust-badges-inner">
        <p className="tru-trust-badges-intro">
          Fully licensed moving broker — your move is protected every step of the way
        </p>
        <div className="tru-trust-badges-grid">
          {BADGES.map((badge, idx) => (
            <div key={idx} className="tru-trust-badge">
              <div className="tru-trust-badge-icon">
                <badge.icon className="w-5 h-5" />
              </div>
              <div className="tru-trust-badge-text">
                <span className="tru-trust-badge-label">{badge.label}</span>
                <span className="tru-trust-badge-desc">{badge.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
