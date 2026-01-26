import { useNavigate } from "react-router-dom";
import { ArrowRight, Phone, Video } from "lucide-react";

export default function FinalCtaSection() {
  const navigate = useNavigate();
  
  return (
    <section className="tru-final-cta-section">
      <div className="tru-final-cta-inner">
        <h2 className="tru-final-cta-title">Ready for a Better Move?</h2>
        <p className="tru-final-cta-subtitle">
          Get matched with vetted, independent carriers who treat your stuff like family. 
          No corporate coldness, no hidden fees — just real people helping you move.
        </p>
        
        <div className="tru-final-cta-buttons">
          <button 
            className="tru-final-cta-primary"
            onClick={() => navigate("/online-estimate")}
          >
            <span>Build Your Quote Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="tru-final-cta-secondary-group">
            <button 
              className="tru-final-cta-secondary"
              onClick={() => navigate("/book")}
            >
              <Video className="w-5 h-5" />
              <span>Book Video Consult</span>
            </button>
            
            <a href="tel:+16097277647" className="tru-final-cta-secondary">
              <Phone className="w-5 h-5" />
              <span>Call (609) 727-7647</span>
            </a>
          </div>
        </div>
        
        <p className="tru-final-cta-tagline">
          Talk to a TruMove Specialist — real answers, no pressure
        </p>
      </div>
    </section>
  );
}
