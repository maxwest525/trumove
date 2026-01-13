const TRUST = [
  { tag: "USDOT", code: "USDOT", text: "USDOT Compliant" },
  { tag: "INSURED", code: "BOND", text: "Bonded and Insured" },
  { tag: "FMCSA", code: "FMCSA", text: "FMCSA Authorized Motor Carriers" },
  { tag: "BROKER", code: "BRKR", text: "Licensed Interstate Moving Broker" },
];

export default function TrustStrip() {
  return (
    <div className="bg-gradient-to-b from-[#070912] to-[#050610] border-b border-white/12" aria-label="Compliance and authority">
      <div className="max-w-[1480px] mx-auto px-[16px] py-[10px]">
        <div className="flex items-center justify-center gap-[26px] flex-wrap">
          {TRUST.map((t) => (
            <span key={t.tag} className="inline-flex items-center gap-[12px] whitespace-nowrap transition-transform duration-[140ms] hover:-translate-y-[1px]">
              <span
                className="w-[22px] h-[22px] relative inline-grid place-items-center flex-shrink-0 rounded-[8px] [clip-path:polygon(10%_0%,90%_0%,100%_20%,100%_80%,90%_100%,10%_100%,0%_80%,0%_20%)] border border-white/78 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.22),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.7),0_1px_0_rgba(0,0,0,0.6)] overflow-hidden before:content-[''] before:absolute before:inset-[4px] before:rounded-[6px] before:border before:border-white/40 before:opacity-95 after:content-[attr(data-code)] after:absolute after:inset-0 after:grid after:place-items-center after:text-[8.5px] after:font-black after:tracking-[0.14em] after:uppercase after:text-white/95 after:text-shadow-[0_1px_0_rgba(0,0,0,0.6)]"
                data-code={t.code}
                aria-hidden="true"
              />
              <span className="text-[10.5px] tracking-[0.16em] uppercase font-extrabold text-white/96">
                {t.text}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
