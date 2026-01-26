import { useNavigate } from "react-router-dom";
import { Scan, Boxes, Shield, Video } from "lucide-react";

const FEATURES = [
  {
    icon: Scan,
    title: "AI Room Scanner",
    desc: "Point your phone to catalog items instantly",
    href: "/scan-room",
  },
  {
    icon: Boxes,
    title: "Inventory Builder",
    desc: "Room-by-room list for accurate estimates",
    href: "/online-estimate",
  },
  {
    icon: Shield,
    title: "Carrier Vetting",
    desc: "FMCSA/DOT data verified in real-time",
    href: "/vetting",
  },
  {
    icon: Video,
    title: "Live Consults",
    desc: "Video walkthrough with a specialist",
    href: "/book",
  },
];

export default function CompactFeatureStrip() {
  const navigate = useNavigate();

  return (
    <section className="tru-feature-strip">
      <div className="tru-feature-strip-inner">
        <div className="tru-feature-strip-header">
          <span className="tru-feature-strip-title">Our Tech Advantage</span>
        </div>
        <div className="tru-feature-strip-grid">
          {FEATURES.map((feature, idx) => (
            <div 
              key={idx} 
              className="tru-feature-strip-card"
              onClick={() => navigate(feature.href)}
            >
              <div className="tru-feature-strip-icon">
                <feature.icon />
              </div>
              <div className="tru-feature-strip-text">
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
