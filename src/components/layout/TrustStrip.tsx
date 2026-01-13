import { Shield, BadgeCheck, Truck, Award } from "lucide-react";

const TRUST = [
  { icon: Shield, text: "USDOT Compliant", accent: "gold" },
  { icon: BadgeCheck, text: "Bonded & Insured", accent: "green" },
  { icon: Truck, text: "FMCSA Authorized", accent: "gold" },
  { icon: Award, text: "Licensed Broker", accent: "green" },
];

export default function TrustStrip() {
  return (
    <div 
      className="bg-gradient-to-b from-[#070912] to-[#050610] border-b border-white/10" 
      aria-label="Compliance and authority"
    >
      <div className="max-w-[1480px] mx-auto px-4 py-[4px]">
        <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          {TRUST.map((t, idx) => (
            <span 
              key={t.text} 
              className="inline-flex items-center gap-1.5 whitespace-nowrap group"
            >
              <t.icon 
                className={`w-3 h-3 ${
                  t.accent === "gold" 
                    ? "text-amber-400/80" 
                    : "text-emerald-400/80"
                }`} 
              />
              <span className="text-[10px] tracking-[0.1em] uppercase font-semibold text-white/90">
                {t.text}
              </span>
              {idx < TRUST.length - 1 && (
                <span className="hidden md:inline text-white/20 ml-8">•</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
