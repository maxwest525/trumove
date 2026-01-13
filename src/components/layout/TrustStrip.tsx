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
      <div className="max-w-[1480px] mx-auto px-4 py-[6px]">
        <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
          {TRUST.map((t, idx) => (
            <span 
              key={t.text} 
              className="inline-flex items-center gap-2 whitespace-nowrap group"
            >
              <span 
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                  ${t.accent === "gold" 
                    ? "bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30" 
                    : "bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 border border-emerald-400/30"
                  }
                  shadow-[0_0_8px_rgba(0,0,0,0.3)]
                  group-hover:scale-105 transition-transform duration-150
                `}
              >
                <t.icon 
                  className={`w-2.5 h-2.5 ${
                    t.accent === "gold" 
                      ? "text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" 
                      : "text-emerald-400 drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]"
                  }`} 
                />
              </span>
              <span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-white/85">
                {t.text}
              </span>
              {idx < TRUST.length - 1 && (
                <span className="hidden md:inline text-white/25 ml-2">•</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
