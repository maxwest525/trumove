import { Shield, BadgeCheck, Monitor, FileText, Clock } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Shield, text: "SECURE VIDEO" },
  { icon: BadgeCheck, text: "LICENSED BROKER" },
  { icon: Monitor, text: "SCREEN SHARING" },
  { icon: FileText, text: "QUOTE REVIEW" },
  { icon: Clock, text: "NO OBLIGATION" },
];

export default function VideoConsultTrustStrip() {
  return (
    <div className="video-consult-trust-strip">
      <div className="video-consult-trust-strip-inner">
        {TRUST_ITEMS.map((item, idx) => (
          <div key={item.text} className="video-consult-trust-item">
            <item.icon className="w-4 h-4" />
            <span>{item.text}</span>
            {idx < TRUST_ITEMS.length - 1 && (
              <span className="video-consult-trust-dot">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
