import { Scan, MapPin, Video, ShieldCheck } from "lucide-react";

const FEATURES = [
  { icon: Scan, text: "AI Inventory Scanner" },
  { icon: MapPin, text: "Live GPS Tracking" },
  { icon: Video, text: "Video Consults" },
  { icon: ShieldCheck, text: "FMCSA Carrier Vetting" },
];

export default function StatsStrip() {
  return (
    <div className="stats-strip">
      <div className="stats-strip-inner">
        {FEATURES.map((feature, idx) => (
          <div key={feature.text} className="stats-strip-item">
            <feature.icon className="w-4 h-4" />
            <span>{feature.text}</span>
            {idx < FEATURES.length - 1 && (
              <span className="stats-strip-dot">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
