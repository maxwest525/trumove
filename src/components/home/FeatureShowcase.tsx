import { useNavigate } from "react-router-dom";
import { Scan, Boxes, Radar, Video, DollarSign, ShieldCheck, ArrowRight } from "lucide-react";

// Preview images for feature cards
import previewAiScanner from "@/assets/preview-ai-scanner.jpg";
import previewCarrierVetting from "@/assets/preview-carrier-vetting.jpg";
import previewVideoConsult from "@/assets/preview-video-consult.jpg";
import moversFurniture from "@/assets/movers-wrapping-furniture.jpg";
import familyUnpacking from "@/assets/family-unpacking-new-home.jpg";
import moversCouch from "@/assets/movers-carrying-couch.jpg";

const FEATURES = [
  {
    id: "ai-scanner",
    icon: Scan,
    title: "AI Room Scanner",
    subtitle: "Point your phone — instant inventory",
    description: "Our AI detects and catalogs furniture instantly, so your independent carrier knows exactly what to expect and handles everything with care. No more manual lists or missed items.",
    callout: "Unlike big van lines, our technology serves you — not their bottom line.",
    techImage: previewAiScanner,
    humanImage: moversFurniture,
    link: "/scan-room"
  },
  {
    id: "inventory",
    icon: Boxes,
    title: "Inventory Builder",
    subtitle: "Room-by-room precision",
    description: "Build your complete item list with weights and volumes calculated automatically. Get accurate estimates based on real data — not vague guesses that lead to surprise charges.",
    callout: "Real movers appreciate detailed inventories. It helps them plan your move right.",
    techImage: previewAiScanner,
    humanImage: familyUnpacking,
    link: "/online-estimate"
  },
  {
    id: "carrier-match",
    icon: Radar,
    title: "Smart Carrier Match",
    subtitle: "Vetted with live FMCSA data",
    description: "Our algorithm analyzes safety records, customer reviews, and route expertise to match you with carriers who'll treat your belongings like their own.",
    callout: "Every carrier is verified through federal SAFER Web data — no scammers, no surprises.",
    techImage: previewCarrierVetting,
    humanImage: moversCouch,
    link: "/vetting"
  },
  {
    id: "video-consult",
    icon: Video,
    title: "TruMove Specialist",
    subtitle: "Live help when you need it",
    description: "Walk through your home virtually with a real person who'll answer questions, refine your quote, and ensure nothing gets overlooked. It's like having a moving expert in your pocket.",
    callout: "No call centers, no scripts — just honest answers from people who care.",
    techImage: previewVideoConsult,
    humanImage: familyUnpacking,
    link: "/book"
  },
  {
    id: "instant-pricing",
    icon: DollarSign,
    title: "Instant Pricing",
    subtitle: "Transparent quotes in minutes",
    description: "See exactly what you'll pay with no hidden fees. Our real-time pricing pulls from market data so you get fair, competitive rates from vetted carriers.",
    callout: "We don't hide behind 'estimates' that double on moving day.",
    techImage: previewAiScanner,
    humanImage: moversCouch,
    link: "/online-estimate"
  },
  {
    id: "secure-payment",
    icon: ShieldCheck,
    title: "Secure Payment Protection",
    subtitle: "Your money is safe",
    description: "Pay through TruMove's protected platform. Your payment is held securely until you confirm your move was completed to your satisfaction.",
    callout: "We vet every carrier so you never have to worry about scams.",
    techImage: previewCarrierVetting,
    humanImage: familyUnpacking,
    link: "/online-estimate"
  }
];

export default function FeatureShowcase() {
  const navigate = useNavigate();
  
  return (
    <section className="tru-feature-showcase-section">
      <div className="tru-feature-showcase-inner">
        <div className="tru-feature-showcase-header">
          <span className="tru-feature-showcase-kicker">How We're Different</span>
          <h2 className="tru-feature-showcase-title">Technology that puts you first</h2>
          <p className="tru-feature-showcase-subtitle">
            Every tool we build exists to give you more control, more transparency, and a better moving experience. 
            Here's how TruMove works for you:
          </p>
        </div>
        
        <div className="tru-feature-showcase-grid">
          {FEATURES.map((feature, idx) => (
            <div 
              key={feature.id} 
              className={`tru-feature-showcase-card ${idx % 2 === 1 ? 'tru-feature-showcase-card-reverse' : ''}`}
              onClick={() => navigate(feature.link)}
            >
              <div className="tru-feature-showcase-content">
                <div className="tru-feature-showcase-icon">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="tru-feature-showcase-card-title">{feature.title}</h3>
                <span className="tru-feature-showcase-card-subtitle">{feature.subtitle}</span>
                <p className="tru-feature-showcase-card-desc">{feature.description}</p>
                <div className="tru-feature-showcase-callout">
                  {feature.callout}
                </div>
                <button className="tru-feature-showcase-cta">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="tru-feature-showcase-images">
                <div className="tru-feature-showcase-tech-img">
                  <img src={feature.techImage} alt={`${feature.title} interface`} />
                </div>
                <div className="tru-feature-showcase-human-img">
                  <img src={feature.humanImage} alt="Professional movers at work" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
