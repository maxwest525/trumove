import { Database, Zap, BarChart3, ShieldCheck, CreditCard, Building2 } from "lucide-react";

const SAFER_TRUST_ITEMS = [
  { icon: Database, text: "SAFER Web Services" },
  { icon: Zap, text: "Real-Time Updates" },
  { icon: BarChart3, text: "CSA BASIC Scores" },
  { icon: ShieldCheck, text: "Authority Verification" },
  { icon: CreditCard, text: "Insurance Coverage" },
  { icon: Building2, text: "Official FMCSA Source" },
];

export default function SaferTrustStrip() {
  return (
    <div className="safer-trust-strip">
      <div className="safer-trust-strip-inner">
        {SAFER_TRUST_ITEMS.map((item, idx) => (
          <div key={item.text} className="safer-trust-item">
            <item.icon className="w-4 h-4" />
            <span>{item.text}</span>
            {idx < SAFER_TRUST_ITEMS.length - 1 && (
              <span className="safer-trust-dot">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
