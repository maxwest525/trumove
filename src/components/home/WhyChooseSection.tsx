import { Truck, Sparkles, Heart, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Beat the Big Van Lines",
    description: "Fair prices, no hidden fees, and small teams that show up on time and treat your belongings like their own.",
    accent: "warm"
  },
  {
    icon: Sparkles,
    title: "AI That Actually Helps",
    description: "Accurate room scans and smart matching ensure your quote is spot-on — no guessing games or surprise charges.",
    accent: "primary"
  },
  {
    icon: Heart,
    title: "Service-First Carriers",
    description: "Independent pros vetted with live FMCSA data who treat you like family, not just another job number.",
    accent: "warm"
  },
  {
    icon: Shield,
    title: "You Stay in Control",
    description: "Video consults, real-time tracking, transparent pricing, and secure payments — your move, your way.",
    accent: "primary"
  }
];

export default function WhyChooseSection() {
  return (
    <section className="tru-why-choose-section">
      <div className="tru-why-choose-inner">
        <div className="tru-why-choose-header">
          <span className="tru-why-choose-kicker">Why Choose TruMove</span>
          <h2 className="tru-why-choose-title">Moving should feel like an upgrade, not a headache</h2>
          <p className="tru-why-choose-subtitle">
            We're not a giant van line with call centers and corporate runarounds. 
            We're a smarter way to move — matching you with vetted independent movers who actually care.
          </p>
        </div>
        
        <div className="tru-why-choose-grid">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className={`tru-why-choose-card tru-why-choose-card-${feature.accent}`}>
              <div className="tru-why-choose-card-icon">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="tru-why-choose-card-title">{feature.title}</h3>
              <p className="tru-why-choose-card-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
