import { Camera, Truck, Video, Shield, Phone, Zap, Globe, CheckCircle } from "lucide-react";

const FEATURE_ITEMS = [
  { icon: Camera, text: "AI Room Scanner" },
  { icon: Truck, text: "Live GPS Tracking" },
  { icon: Video, text: "Video Consultations" },
  { icon: Shield, text: "Carrier Vetting" },
  { icon: Globe, text: "Nationwide Coverage" },
  { icon: CheckCircle, text: "Verified Estimates" },
];

export default function FeatureTrustStrip() {
  return (
    <div className="feature-trust-strip">
      <div className="feature-trust-strip-inner">
        {FEATURE_ITEMS.map((item, idx) => (
          <div key={item.text} className="feature-trust-item">
            <item.icon className="w-4 h-4" />
            <span>{item.text}</span>
            {idx < FEATURE_ITEMS.length - 1 && (
              <span className="feature-trust-dot">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
