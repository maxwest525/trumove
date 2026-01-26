import { Shield, BadgeCheck, Truck, Lock, CreditCard, Award } from "lucide-react";

const BADGES = [
  { icon: Shield, label: "FMCSA Verified", desc: "Every carrier checked" },
  { icon: BadgeCheck, label: "USDOT Compliant", desc: "Federal standards" },
  { icon: Truck, label: "Bonded & Insured", desc: "Move protected" },
  { icon: Lock, label: "TLS Encrypted", desc: "Bank-level security" },
  { icon: CreditCard, label: "Secure Payments", desc: "Protected transactions" },
  { icon: Award, label: "Licensed Broker", desc: "MC-1556991" },
];

export default function CompactTrustSection() {
  return (
    <section className="tru-trust-section-compact">
      <div className="tru-trust-section-compact-inner">
        {BADGES.map((badge, idx) => (
          <div key={idx} className="tru-trust-badge-compact">
            <div className="tru-trust-badge-compact-icon">
              <badge.icon />
            </div>
            <div className="tru-trust-badge-compact-text">
              <span className="tru-trust-badge-compact-label">{badge.label}</span>
              <span className="tru-trust-badge-compact-desc">{badge.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
