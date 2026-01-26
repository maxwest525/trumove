import { Truck, Sparkles, Heart, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Beat Van Lines",
    desc: "Fair prices, no hidden fees",
  },
  {
    icon: Sparkles,
    title: "AI-Accurate",
    desc: "Scans ensure spot-on quotes",
  },
  {
    icon: Heart,
    title: "Service-First",
    desc: "Vetted pros who care",
  },
  {
    icon: Shield,
    title: "You Control It",
    desc: "Tracking, payments, support",
  },
];

export default function CompactWhySection() {
  return (
    <section className="tru-why-compact">
      <div className="tru-why-compact-inner">
        <div className="tru-why-compact-header">
          <span className="tru-why-compact-kicker">Why TruMove</span>
          <h2 className="tru-why-compact-title">Moving should feel like an upgrade</h2>
        </div>
        <div className="tru-why-compact-grid">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="tru-why-compact-card">
              <div className="tru-why-compact-icon">
                <feature.icon />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
